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
    "./_LocatorBase",
    "./PickListItem"
],
function (declare, _LocatorBase, PickListItem) {
    // module:
    //      LLPGLocator

    return declare([_LocatorBase], {
        // summary:
        //		        ABXDPA Locator
        // description: 
        //              A Locator that can be used for address searches against an LLPG LocatorHub 5.3 locator.
        //              The Locator returns the address results as a picklist.
        //

        // locatorType: String
        //              The type of locator.
        locatorType: "ABXDPA",

        // resultsPickList: PickList
        //              The picklist that contains the list of results.
        resultsPickList: null,

        // streetGrouping: Array
        //              An array of the street level field names to use for grouping.
        streetGrouping: ["DPA_DEP_THOROUGHFARE", "DPA_THOROUGHFARE", "DPA_DEP_LOCALITY", "DPA_LOCALITY", "DPA_POST_TOWN"],

        // premiseGrouping: Array
        //              An array of the premise level field names to use for grouping.
        premiseGrouping: ["DPA_BUILDING_NAME", "DPA_BUILDING_NUMBER", "DPA_DEP_THOROUGHFARE"],

        // streetFields: Object
        //              An object containing the field name value mappings for
        //              constructing the street description.
        streetFields: {
           
            STREET_DESCRIPTOR: "DPA_THOROUGHFARE",
            LOCALITY_NAME: "DPA_LOCALITY",
            TOWN_NAME: "DPA_POST_TOWN",
            ADMINISTRATIVE_AREA: "DPA_DEP_LOCALITY"
        },

        // paoFields: Object
        //              An object containing the field name value mappings for
        //              constructing the PAO description.
        paoFields: {
            PAO_TEXT: "DPA_BUILDING_NAME",
            PAO_START_NUMBER: "DPA_BUILDING_NUMBER",
            PAO_START_SUFFIX: "",
            PAO_END_NUMBER: "",
            PAO_END_SUFFIX: ""
        },

        // saoFields: Object
        //              An object containing the field name value mappings for
        //              constructing the SAO description.
        saoFields: {
            SAO_TEXT: "DPA_SUB_BUILDING_NAME",
            SAO_START_NUMBER: "DPA_BUILDING_NUMBER",
            SAO_START_SUFFIX: "DPA_BUILDING_NAME",
            SAO_END_NUMBER: "",
            SAO_END_SUFFIX: ""
        },

        _buildPicklistItem: function (childAttributes, childAddressCandidate) {
            return new PickListItem({
                SortDescription: this._getSortDescription(this._getSAOText(childAttributes, true)),
                Description: this._getListLevelDescription(1, childAttributes),
                Addresses: [childAddressCandidate],
                Level: 1
            });
        }
    });
});