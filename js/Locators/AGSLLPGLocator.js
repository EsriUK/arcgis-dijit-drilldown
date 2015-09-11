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

    return declare([_LocatorBase], {
        // summary:
        //		AGS LLPG Locator.

        locatorType: "AGS_LLPG",
        resultsPickList: null,
        streetGrouping: ["AdminArea", "Town", "LocalityName", "StreetDescriptor"],
        premiseGrouping: ["PAOText", "PAONumberRange"],

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
            SAO_END_SUFFIX: "SAO_END_SUFFIX"
        },

        constructor: function () {
            this.inherited(arguments);
        },

        _getPAOText: function (attributes) {
            var tpao = "", numberRange = "";

            if (this._isNullOrEmpty(attributes[this.paoFields.PAO_TEXT]) === false) {
                tpao = attributes[this.paoFields.PAO_TEXT].trim();
            }
            numberRange = attributes.PAONumberRange.trim();

            if (this._isNullOrEmpty(numberRange) === false) {
                tpao += numberRange;
            }

            return tpao.trim();
        },

        _getSAOText: function (attributes) {
            var tsao = "", numberRange = "";

            if (this._isNullOrEmpty(attributes[this.saoFields.SAO_TEXT]) === false) {
                tsao = attributes[this.saoFields.SAO_TEXT].trim();
            }
            numberRange = attributes.SAONumberRange.trim();

            if (this._isNullOrEmpty(numberRange) === false) {
                tsao += numberRange;
            }

            return tsao.trim();
        },

        _getListLevelDescription: function (level, attributes) {
            // summary:
            //      Gets the correct description depending on the address level
            // tags:
            //      private

            var description = "";

            switch (level) {
                case 1: // Sub Premise
                    description = [attributes[this.paoFields.PAO_TEXT], attributes[this.paoFields.PAONumberRange]].filter(Boolean).join(", ");
                    break;

                case 2: // Street
                    description = [attributes.StreetDescriptor.trim(), attributes.LocalityName.trim(), attributes.Town.trim(), attributes.AdminArea.trim()].filter(Boolean).join(", ");
                    break;

                default:
                    break;
            }

            return description;
        }
    });
});