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
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}



if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun/*, thisArg*/) {
        "use strict";

        var t, len, res, thisArg, i = 0, val;

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        t = Object(this);
        len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw new TypeError();
        }

        res = [];
        thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (i = 0; i < len; i++) {
            if (i in t) {
                val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

define([
    "dojo/_base/declare",
    "esri/tasks/locator",
    "./PickList",
    "./PickListItem",
    "dojo/Deferred"
],
function (declare, Locator, PickList, PickListItem, Deferred) {
    // module:
    //      esriuk/dijit/locators/_LocatorBase

    var reA = /[^a-zA-Z]/g, reN = /[^0-9]/g,
        _getGroupedAddressValue = function (fields, attributes) {
            var i = 0, iL = fields.length, addressValue = "", fieldName, fieldValue, addressParts = [];

            for (i = 0; i < iL; i += 1) {
                fieldName = fields[i];

                fieldValue = attributes[fieldName];

                if (fieldValue.length > 0) {
                    addressParts.push(fieldValue);
                }
            }

            if (addressParts.length > 0) {
                addressValue = addressParts.join(", ");
            }

            return addressValue;
        },
        _getStreets = function (candidates, pickList, streetField, streetGroups) {
            var i = 0, iL = 0, candidate, attributes, addressKey;

            for (i = 0, iL = candidates.length; i < iL; i += 1) {
                candidate = candidates[i];
                attributes = candidate.attributes;

                // Build up street level grouping
                addressKey = _getGroupedAddressValue(streetGroups, attributes);

                if (addressKey.length > 0) {
                    if (pickList.hasOwnProperty(addressKey)) {
                        pickList[addressKey].addCandidate(candidate);
                    }
                    else {
                        pickList[addressKey] = new PickListItem({
                            SortDescription: addressKey,
                            Description: addressKey,
                            Addresses: [candidate],
                            Level: 2
                        });
                    }
                }
            }
        },

        descriptionSort = function (a, b) {
            return a.localeCompare(b);
        },

        sortAlphaNum = function (a, b) {
            function chunkify(t) {
                var tz = [], x = 0, y = -1, n = 0, i, j;

                while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                    var m = (i == 46 || (i >= 48 && i <= 57));
                    if (m !== n) {
                        tz[++y] = "";
                        n = m;
                    }
                    tz[y] += j;
                }
                return tz;
            }

            var x = 0, aa = chunkify(a), bb = chunkify(b), c, d;

            for (x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    c = Number(aa[x]), d = Number(bb[x]);
                    if (c == aa[x] && d == bb[x]) {
                        return c - d;
                    }
                    return (aa[x] > bb[x]) ? 1 : -1;
                }
            }
            return aa.length - bb.length;
        };

    return declare([Locator], {
        // summary:
        //		Base class for Locators. Inherits from esri locator.

        locatorType: "None",
        streetGrouping: [],
        premiseGrouping: [],
        

        paoFields: {
            PAO_TEXT: "",
            PAO_START_NUMBER: "",
            PAO_START_SUFFIX: "",
            PAO_END_NUMBER: "",
            PAO_END_SUFFIX: ""
        },

        saoFields: {
            SAO_TEXT: "",
            SAO_START_NUMBER: "",
            SAO_START_SUFFIX: "",
            SAO_END_NUMBER: "",
            SAO_END_SUFFIX: ""
        },

        _geocodeHandler: function (results, b, k, g, c) {
            // Process the results, constructing the picklist if needed
            var _this = this;

            try {
                this.resultsPickList = new PickList();

                this._buildPickList(results).then(function () {
                    _this._successHandler([_this.resultsPickList], "onAddressToLocationsComplete", k, c);
                });
            }
            catch (ex) {
                this._errorHandler(ex, g, c);
            }
        },
     
        _getListLevelDescription: function (level, attributes) {
            // summary:
            //      Gets the correct description depending on the address level
            // tags:
            //      private

            var description = "", streetF = this.streetFields;

            switch (level) {
                case 1: // Sub Premise
                    description = [this._getPAOText(attributes, false), attributes[streetF.STREET_DESCRIPTOR], attributes[streetF.LOCALITY_NAME], attributes[streetF.TOWN_NAME], attributes[streetF.ADMINISTRATIVE_AREA]].filter(Boolean).join(", ");
                    break;

                case 2: // Street
                    description = [attributes[streetF.STREET_DESCRIPTOR], attributes[streetF.LOCALITY_NAME], attributes[streetF.TOWN_NAME], attributes[streetF.ADMINISTRATIVE_AREA]].filter(Boolean).join(", ");
                    break;

                default:
                    break;
            }

            return description;
        },

        _buildPickList: function (results) {
            var result = new Deferred(), pickList = {}, premisePicklist = {}, candidates, addressKey, 
                key, item, children, k = 0, kL = 0, premKey, childAddressCandidate, resultsPickList = new PickList(), childAttributes,
                streetDescriptor = this.streetFields.STREET_DESCRIPTOR, streetGroups = this.streetGrouping, premiseGroups = this.premiseGrouping,
                descFunc = function (a, b) {
                    return descriptionSort(a.SortDescription, b.SortDescription);
                },
                sortFunc = function (a, b) {
                    return sortAlphaNum(a.SortDescription, b.SortDescription);
                };

            // Build picklist entries by concatenating fields in list
            if (results.candidates.length > 0) {
                candidates = results.candidates;

                _getStreets(candidates, pickList, streetDescriptor, streetGroups);

                for (key in pickList) {
                    // Now do premise lists
                    if (pickList.hasOwnProperty(key)) {

                        premisePicklist = {};

                        if (pickList[key].Addresses.length > 1) {
                            item = new PickListItem({ Description: key, SortDescription: pickList[key].SortDescription });

                            // We have more than 1 results so need another picklist level
                            children = pickList[key].Addresses;

                            for (k = 0, kL = children.length; k < kL; k += 1) {
                                childAttributes = children[k].attributes;
                                addressKey = _getGroupedAddressValue(premiseGroups, childAttributes);
                                childAddressCandidate = null;

                                if (addressKey.length > 0) {
                                    childAddressCandidate = children[k];
                                    childAddressCandidate.SortDescription = this._getSAOText(childAttributes, true);

                                    if (premisePicklist.hasOwnProperty(addressKey)) {
                                        premisePicklist[addressKey].addCandidate(childAddressCandidate);
                                    }
                                    else {
                                        premisePicklist[addressKey] = new PickListItem({
                                            SortDescription: this._getPAOText(childAttributes, true),
                                            Description: this._getListLevelDescription(1, childAttributes),
                                            Addresses: [childAddressCandidate],
                                            Level: 1
                                        });
                                    }
                                }
                            }

                            for (premKey in premisePicklist) {
                                if (premisePicklist.hasOwnProperty(premKey)) {
                                    premisePicklist[premKey].Addresses.sort(sortFunc);
                                    item.addCandidate(premisePicklist[premKey]);
                                }
                            }

                            // Sort premise list
                            item.Addresses.sort(sortFunc);

                            resultsPickList.addItem(item);
                        }
                        else {
                            // no children
                            resultsPickList.addItem(pickList[key]);
                        }
                    }
                }

                // Sort street list
                resultsPickList.PickListItems.sort(descFunc);

                this.resultsPickList = resultsPickList;

                result.resolve();
            }
            else {
                this.resultsPickList = resultsPickList;
                result.resolve();
            }

            return result.promise;
        }
    });
});