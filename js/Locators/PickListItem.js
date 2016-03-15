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
    'dojo/_base/declare'
],
function (declare) {
    // module:
    //      esriuk/dijit/locators/PickListItem

    return declare(null, {
        // summary:
        //		A class to represent a PickListItem.

        // Description: String
        //      The items address description
        Description: "",

        // Addresses: Array
        //      The list of addresses for this item
        Addresses: [],

        // Level: Integer
        //      The level within the picklist
        Level: 0,

        // SortDescription: String
        //      The description used for sorting. May be different
        //      from the description.
        SortDescription: "",

        constructor: function (args) {
            this.Description = "";
            this.Addresses = [];
            this.Level = 0;
            this.SortDescription = "";

            declare.safeMixin(this, args);
        },

        addCandidate: function (address) {
            // summary:
            //      Adds an address to the current list of addresses.

            this.Addresses.push(address);
        }
    });
});