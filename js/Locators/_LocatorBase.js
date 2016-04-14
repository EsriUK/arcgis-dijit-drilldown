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

if (!Object.keys) {
    Object.keys = function (obj) {
        var arr = [],
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key);
            }
        }
        return arr;
    };
}

var _isNullOrEmpty = function (/*Anything*/ obj) {
    // summary:
    //		Checks to see if the passed in thing is undefined, null or empty.
    // tags:
    //		private

    return (obj === undefined || obj === null || obj === "");
},

_paoSaoNumberRange = function (startNumber, startSuffix, endNumber, endSuffix) {
    var start = "", end = "";

    if (!_isNullOrEmpty(startNumber)) {
        start = startNumber + "".trim();
    }
    if (!_isNullOrEmpty(startSuffix)) {
        start += startSuffix + "".trim();
    }
    if (!_isNullOrEmpty(endNumber)) {
        end = endNumber + "".trim();
    }
    if (!_isNullOrEmpty(endSuffix)) {
        end += endSuffix + "".trim();
    }

    if ((!_isNullOrEmpty(start)) && (!_isNullOrEmpty(end))) {
        return start + "-" + end;
    }

    // Only start or end has a value so the below code will return the one 
    // that has a value.

    return start + end;
};

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

    var _getGroupedAddressValue = function (fields, attributes) {
            var i = 0, iL = fields.length, addressValue = "", fieldName, fieldValue, addressParts = [];

            for (i = 0; i < iL; i += 1) {
                fieldName = fields[i];

                fieldValue = attributes[fieldName];

                if (!_isNullOrEmpty(fieldValue)) {
                    addressParts.push(fieldValue);
                }
            }

            if (addressParts.length > 0) {
                addressValue = addressParts.join(", ");
            }

            return addressValue;
        },
        _getStreets = function (candidates, pickList, streetGroups) {
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
        sortAlphaNum = function (a, b) {
            function chunkify(t) {
                var tz = new Array();
                var x = 0, y = -1, n = 0, i, j;

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

            var aa = chunkify(a.toLowerCase());
            var bb = chunkify(b.toLowerCase());

            for (x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    var c = Number(aa[x]), d = Number(bb[x]);
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

        _getPAOText: function (attributes, sortText) {
            // summary: 
            //      Constructs the PAO text from the PAO fields. 
            var tpao = "", numberRange = "", paoFields = this.paoFields;

            if ((_isNullOrEmpty(attributes[paoFields.PAO_TEXT]) === false) && (!sortText)) {
                tpao = attributes[paoFields.PAO_TEXT].trim();
            }
            numberRange = _paoSaoNumberRange(attributes[paoFields.PAO_START_NUMBER], attributes[paoFields.PAO_START_SUFFIX], attributes[paoFields.PAO_END_NUMBER], attributes[paoFields.PAO_END_SUFFIX]);

            if (_isNullOrEmpty(numberRange) === false) {
                tpao += " " + numberRange;
            }

            return tpao.trim();
        },

        _getSAOText: function (attributes, sortText) {
            // summary: 
            //      Constructs the SAO text from the SAO fields. 
            var tsao = "", numberRange = "", saoFields = this.saoFields;

            if ((_isNullOrEmpty(attributes[saoFields.SAO_TEXT]) === false) && (!sortText)) {
                tsao = attributes[saoFields.SAO_TEXT].trim();
            }
            numberRange = _paoSaoNumberRange(attributes[saoFields.SAO_START_NUMBER], attributes[saoFields.SAO_START_SUFFIX], attributes[saoFields.SAO_END_NUMBER], attributes[saoFields.SAO_END_SUFFIX]);

            if (_isNullOrEmpty(numberRange) === false) {
                tsao += " " + numberRange;
            }

            return tsao.trim();
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

        _getSortDescription: function (sortString, defaultSort) {
            var testString = sortString, parsedSort;

            if (_isNullOrEmpty(testString) && !_isNullOrEmpty(defaultSort)) {
                testString = defaultSort;
            }

            parsedSort = parseInt(testString);

            if (isNaN(parsedSort)) {
                return testString;
            }
            return testString.toString();

        },

        _buildPicklistItem: function (childAttributes, childAddressCandidate) {
            return new PickListItem({
                SortDescription: this._getSortDescription(this._getPAOText(childAttributes, true), this._getPAOText(childAttributes, false)),
                Description: this._getListLevelDescription(1, childAttributes),
                Addresses: [childAddressCandidate],
                Level: 1
            });
        },

        _buildPickList: function (results) {
            var result = new Deferred(), pickList = {}, premisePicklist = {}, candidates, addressKey, 
                key, item, children, k = 0, kL = 0, premKey, childAddressCandidate, resultsPickList = new PickList(), childAttributes,
                streetGroups = this.streetGrouping, premiseGroups = this.premiseGrouping,
                sortFunc = function (a, b) {
                    return sortAlphaNum(a.SortDescription, b.SortDescription);
                };

            // Build picklist entries by concatenating fields in list
            if (!_isNullOrEmpty(results.candidates) && results.candidates.length > 0) {
                candidates = results.candidates;

                _getStreets(candidates, pickList, streetGroups);

                if (Object.keys(pickList).length === 0) {
                    // Didnt find any of the required fields, just ouput everything
                    for (var a = 0; a < candidates.length; a++) {
                        resultsPickList.addItem(new PickListItem({ 
                            Description: candidates[a].attributes.Match_addr,
                            SortDescription: candidates[a].attributes.Match_addr,
                            Addresses: [candidates[a]]
                        }));
                    }
                    
                }
                else {
                    for (key in pickList) {
                        // Now do premise lists
                        if (pickList.hasOwnProperty(key) && pickList[key].Addresses.length > 1) {

                            premisePicklist = {};

                            item = new PickListItem({ Description: key, SortDescription: pickList[key].SortDescription });

                            // We have more than 1 results so need another picklist level
                            children = pickList[key].Addresses;

                            for (k = 0, kL = children.length; k < kL; k += 1) {
                                childAttributes = children[k].attributes;
                                addressKey = _getGroupedAddressValue(premiseGroups, childAttributes);
                                childAddressCandidate = null;

                                if (addressKey.length > 0) {
                                    childAddressCandidate = children[k];
                                    childAddressCandidate.SortDescription = this._getSortDescription(this._getSAOText(childAttributes, false));

                                    if (premisePicklist.hasOwnProperty(addressKey)) {
                                        premisePicklist[addressKey].addCandidate(childAddressCandidate);
                                    }
                                    else {
                                        premisePicklist[addressKey] = this._buildPicklistItem(childAttributes, childAddressCandidate);
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
                // Do we have results but no keys pulled out? No matching fields so just dump out the results.

                // Sort street list
                resultsPickList.PickListItems.sort(sortFunc);

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