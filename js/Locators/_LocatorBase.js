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
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}



if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun/*, thisArg*/) {
        'use strict';

        var t, len, res, thisArg, i = 0, val;

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        t = Object(this);
        len = t.length >>> 0;
        if (typeof fun !== 'function') {
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
    'dojo/_base/declare',
    "esri/tasks/locator",
    "./PickList",
    "./PickListItem",
    "dojo/Deferred"
],
function (declare, Locator, PickList, PickListItem, Deferred) {
    // module:
    //      _LocatorBase

    return declare([Locator], {
        // summary:
        //		Base class for Drilldown Locators.

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

        constructor: function () {

        },

        _isNullOrEmpty: function (/*Anything*/ obj) {
            // summary:
            //		Checks to see if the passed in thing is undefined, null or empty.
            // tags:
            //		private

            return (obj === undefined || obj === null || obj === "");
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

        _descriptionSort: function (a, b) {
            return a.SortDescription.trim().localeCompare(b.SortDescription.trim());
        },

        _alphanumSort: function (a, b) {
            var aString = a.SortDescription, bString = b.SortDescription, aa, bb, x;

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

            aa = chunkify(aString);
            bb = chunkify(bString);

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
        },

        _paoSaoNumberRange: function (startNumber, startSuffix, endNumber, endSuffix) {
            var start = startNumber.trim() + startSuffix.trim(),
                end = endNumber.trim() + endSuffix.trim();

            if ((this._isNullOrEmpty(start) === false) && (this._isNullOrEmpty(end) === false)) {
                return start + "-" + end;
            }

            // Only start or end has a value so the below code will return the one 
            // that has a value.

            return start + end;
        },

        

        _getGroupedAddressValue: function (fields, attributes) {
            var i = 0, iL = fields.length, addressValue = "", fieldName, fieldValue, addressParts = [];

            for (i = 0; i < iL; i++) {
                fieldName = fields[i];

                fieldValue = attributes[fieldName];

                if (fieldValue.length > 0) {
                    addressParts.push(fieldValue);
                }
            }

            if (addressParts.length > 0) {
                addressParts.reverse();
                addressValue = addressParts.join(", ");
            }

            return addressValue;
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
            else {
                result.resolve();
            }

            return result.promise;
        }
    });
});