/*global define, console, document */

/*
 | Copyright 2015 ESRI (UK) Limited
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

define([
    "dojo/_base/declare",
    "./_LocatorBase",
    "./PickList",
    "./PickListItem",
    "dojo/Deferred"
],
function (declare, _LocatorBase, PickList, PickListItem, Deferred) {
    // module:
    //      _LocatorBase

    return declare([_LocatorBase], {
        // summary:
        //		Base class for Drilldown Locators.
        locatorType: "LLPG",
        resultsPickList: null,
        streetGrouping: ["ADMINISTRATIVE_AREA", "TOWN_NAME", "LOCALITY_NAME", "STREET_DESCRIPTOR"],
        premiseGrouping: ["PAO_TEXT", "PAO_END_SUFFIX", "PAO_END_NUMBER", "PAO_START_SUFFIX", "PAO_START_NUMBER"],


        constructor: function () {
            this.inherited(arguments);
        },

       
        _getPAOText: function(attributes) {
            var tpao = "", numberRange = "";

            if (this._isNullOrEmpty(attributes.PAO_TEXT) === false) {
                tpao = attributes.PAO_TEXT.trim();   
            }
            numberRange = this._paoSaoNumberRange(attributes.PAO_START_NUMBER, attributes.PAO_START_SUFFIX, attributes.PAO_END_NUMBER, attributes.PAO_END_SUFFIX);

            if (this._isNullOrEmpty(numberRange) === false) {
                tpao += numberRange;
            }

            return tpao.trim();
        },

        _getSAOText: function(attributes) {
            var tsao = "", numberRange = "";

            if (this._isNullOrEmpty(attributes.SAO_TEXT) === false) {
                tsao = attributes.SAO_TEXT.trim();
            }
            numberRange = this._paoSaoNumberRange(attributes.SAO_START_NUMBER, attributes.SAO_START_SUFFIX, attributes.SAO_END_NUMBER, attributes.SAO_END_SUFFIX);

            if (this._isNullOrEmpty(numberRange) === false) {
                tsao += numberRange;
            }

            return tsao.trim();
        },

        _getListLevelDescription: function(level, attributes) {
            var description = "";

            switch (level) {
                case 1: // Sub Premise
                    description = [this._getPAOText(attributes), attributes.STREET_DESCRIPTOR, attributes.LOCALITY_NAME, attributes.TOWN_NAME, attributes.ADMINISTRATIVE_AREA].filter(Boolean).join(", ");
                    break;

                case 2: // Street
                    description = [attributes.STREET_DESCRIPTOR.trim(), attributes.LOCALITY_NAME.trim(), attributes.TOWN_NAME.trim(), attributes.ADMINISTRATIVE_AREA.trim()].filter(Boolean).join(", ");
                    break;

                default:
                    break;
            }

            return description;
        },

        

        _buildPickList: function (results) {
            var result = new Deferred(), i = 0, iL = 0, pickList = {}, premisePicklist = {}, candidates, candidate, attributes, addressKey,
                key, item, children, k = 0, kL = 0, premKey, childAddressCandidate;

            this.resultsPickList = new PickList();

            // Build picklist entries by concatenating fields in list
            if (results.candidates.length > 0) {
                candidates = results.candidates;
                
                for (i = 0, iL = candidates.length; i < iL; i++) {
                    candidate = candidates[i];
                    attributes = candidate.attributes;

                    // Build up street level grouping
                    addressKey = this._getGroupedAddressValue(this.streetGrouping, attributes);

                    if (addressKey.length > 0) {
                        if (pickList.hasOwnProperty(addressKey)) {
                            pickList[addressKey].addCandidate(candidate);
                        }
                        else {
                            pickList[addressKey] = new PickListItem({
                                SortDescription: attributes.STREET_DESCRIPTOR,
                                Description: this._getListLevelDescription(2, attributes),
                                Addresses: [candidate],
                                Level: 2
                            });
                        }
                    }
                }

                for (key in pickList) {
                    // Now do premise lists
                    if (pickList.hasOwnProperty(key)) {

                        premisePicklist = {};

                        if (pickList[key].Addresses.length > 1) {
                            item = new PickListItem({ Description: key });

                            // We have more than 1 results so need another picklist level
                            children = pickList[key].Addresses;

                            for (k = 0, kL = children.length; k < kL; k++) {
                                addressKey = this._getGroupedAddressValue(this.premiseGrouping, children[k].attributes);
                                childAddressCandidate = null;

                                if (addressKey.length > 0) {
                                    childAddressCandidate = children[k];
                                    childAddressCandidate.SortDescription = this._getSAOText(children[k].attributes);

                                    if (premisePicklist.hasOwnProperty(addressKey)) {
                                        premisePicklist[addressKey].addCandidate(childAddressCandidate);
                                    }
                                    else {
                                        premisePicklist[addressKey] = new PickListItem({
                                            SortDescription: this._getPAOText(children[k].attributes),
                                            Description: this._getListLevelDescription(1, children[k].attributes),
                                            Addresses: [childAddressCandidate],
                                            Level: 1
                                        });
                                    }
                                }
                            }

                            for (premKey in premisePicklist) {
                                if (premisePicklist.hasOwnProperty(premKey)) {
                                    premisePicklist[premKey].Addresses.sort(this._alphanumSort);
                                    item.addCandidate(premisePicklist[premKey]);
                                }
                            }

                            // Sort premise list
                            item.Addresses.sort(this._alphanumSort);

                            this.resultsPickList.addItem(item);
                        }
                        else {
                            // no children
                            this.resultsPickList.addItem(pickList[key]);
                        }
                    }
                }

                // Sort street list
                this.resultsPickList.PickListItems.sort(this._descriptionSort);
                this.resultsPickList.PickListItems.reverse();

                result.resolve();
            }


            return result.promise;
        }
    });
});