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
        locatorType: "AGS_LLPG",
        resultsPickList: null,
        streetGrouping: ["AdminArea", "Town", "LocalityName", "StreetDescriptor"],
        premiseGrouping: ["PAOText", "PAONumberRange"],

        constructor: function () {
            this.inherited(arguments);
        },      

        

        _buildPickList: function (results) {
            var result = new Deferred(), i = 0, iL = 0, pickList = {}, premisePicklist = {}, candidates, candidate, attributes, addressKey;

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
                            pickList[addressKey] = new PickListItem({ Description: addressKey, Addresses: [candidate] });
                        }
                    }
                    

                }

                for (var key in pickList) {
                    // Now do premise lists
                    
                    if (pickList[key].Addresses.length > 1) {
                        var item = new PickListItem({ Description: key });

                        // We have more than 1 results so need another picklist level
                        var children = pickList[key].Addresses;

                        for (var k = 0, kL = children.length; k < kL; k++) {
                            addressKey = this._getGroupedAddressValue(this.premiseGrouping, children[k].attributes);

                            if (addressKey.length > 0) {
                                if (premisePicklist.hasOwnProperty(addressKey)) {
                                    premisePicklist[addressKey].addCandidate(children[k]);
                                }
                                else {
                                    premisePicklist[addressKey] = new PickListItem({ Description: addressKey, Addresses: [children[k]] });
                                }
                            }
                            
                        }

                        for (var key in premisePicklist) {
                            item.addCandidate(premisePicklist[key])
                        }

                        this.resultsPickList.addItem(item);
                    }
                    else {
                        // no children
                        this.resultsPickList.addItem(pickList[key]);
                    }
                }
                result.resolve();
            }


            return result.promise;
        }
    });
});