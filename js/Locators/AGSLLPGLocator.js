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
    "./_LocatorBase"
],
function (declare, _LocatorBase) {
    // module:
    //      _LocatorBase

    var _isNullOrEmpty = function (/*Anything*/ obj) {
        // summary:
        //		Checks to see if the passed in thing is undefined, null or empty.
        // tags:
        //		private

        return (obj === undefined || obj === null || obj === '');
    };

    return declare([_LocatorBase], {
        // summary:
        //		AGS LLPG Locator.

        locatorType: "AGS_LLPG",
        resultsPickList: null,
        streetGrouping: ["StreetDescriptor", "LocalityName", "Town", "AdminArea"],
        premiseGrouping: ["PAOText", "PAONumberRange"],

        streetFields: {
            STREET_DESCRIPTOR: "StreetDescriptor",
            LOCALITY_NAME: "LocalityName",
            TOWN_NAME: "Town",
            ADMINISTRATIVE_AREA: "AdminArea"
        },

        paoFields: {
            PAO_TEXT: "PAOText",
            PAO_START_NUMBER: "PAO_START_NUMBER",
            PAO_START_SUFFIX: "PAO_START_SUFFIX",
            PAO_END_NUMBER: "PAO_END_NUMBER",
            PAO_END_SUFFIX: "PAO_END_SUFFIX",
            PAONumberRange: "PAONumberRange"
        },

        saoFields: {
            SAO_TEXT: "SAOText",
            SAO_START_NUMBER: "SAO_START_NUMBER",
            SAO_START_SUFFIX: "SAO_START_SUFFIX",
            SAO_END_NUMBER: "SAO_END_NUMBER",
            SAO_END_SUFFIX: "SAO_END_SUFFIX",
            SAONumberRange: "SAONumberRange"
        },

        constructor: function () {
            this.inherited(arguments);
        },

        _getPAOText: function (attributes, sortText) {
            var tpao = "", numberRange = "";

            if ((_isNullOrEmpty(attributes[this.paoFields.PAO_TEXT]) === false) && (!sortText)) {
                tpao = attributes[this.paoFields.PAO_TEXT].trim();
            }
            numberRange = attributes[this.paoFields.PAONumberRange].trim();

            if (_isNullOrEmpty(numberRange) === false) {
                tpao += numberRange;
            }

            return tpao.trim();
        },

        _getSAOText: function (attributes, sortText) {
            var tsao = "", numberRange = "";

            if ((_isNullOrEmpty(attributes[this.saoFields.SAO_TEXT]) === false) && (!sortText)) {
                tsao = attributes[this.saoFields.SAO_TEXT].trim();
            }
            numberRange = attributes[this.saoFields.SAONumberRange].trim();

            if (_isNullOrEmpty(numberRange) === false) {
                tsao += numberRange;
            }

            return tsao.trim();
        }

        
    });
});