/*global define, _paoSaoNumberRange, _isNullOrEmpty */

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
    //      LLPGLocator

    return declare([_LocatorBase], {
        // summary:
        //		        LLPG Locator
        // description: 
        //              A Locator that can be used for address searches against an LLPG LocatorHub 5.3 locator.
        //              The Locator returns the address results as a picklist.
        //

        // locatorType: String
        //              The type of locator.
        locatorType: "ABX",

        // resultsPickList: PickList
        //              The picklist that contains the list of results.
        resultsPickList: null,

        // streetGrouping: Array
        //              An array of the street level field names to use for grouping.
        streetGrouping: ["STREET_DESCRIPTION", "LOCALITY_NAME", "TOWN_NAME", "ADMINISTRATIVE_AREA"],

        // premiseGrouping: Array
        //              An array of the premise level field names to use for grouping.
        premiseGrouping: ["PAO_TEXT", "PAO_END_SUFFIX", "PAO_END_NUMBER", "PAO_START_SUFFIX", "PAO_START_NUMBER"],

        // streetFields: Object
        //              An object containing the field name value mappings for
        //              constructing the street description.
        streetFields: {
            STREET_DESCRIPTOR: "STREET_DESCRIPTION",
            LOCALITY_NAME: "LOCALITY_NAME",
            TOWN_NAME: "TOWN_NAME",
            ADMINISTRATIVE_AREA: "ADMINISTRATIVE_AREA"
        },

        // paoFields: Object
        //              An object containing the field name value mappings for
        //              constructing the PAO description.
        paoFields: {
            PAO_TEXT: "PAO_TEXT",
            PAO_START_NUMBER: "PAO_START_NUMBER",
            PAO_START_SUFFIX: "PAO_START_SUFFIX",
            PAO_END_NUMBER: "PAO_END_NUMBER",
            PAO_END_SUFFIX: "PAO_END_SUFFIX"
        },

        // saoFields: Object
        //              An object containing the field name value mappings for
        //              constructing the SAO description.
        saoFields: {
            SAO_TEXT: "SAO_TEXT",
            SAO_START_NUMBER: "SAO_START_NUMBER",
            SAO_START_SUFFIX: "SAO_START_SUFFIX",
            SAO_END_NUMBER: "SAO_END_NUMBER",
            SAO_END_SUFFIX: "SAO_END_SUFFIX"
        }
    });
});