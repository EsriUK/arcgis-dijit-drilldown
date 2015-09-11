﻿/*global define, console, document */

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
    "./PickListItem"
],
function (declare, PickListItem) {
    // module:
    //      _LocatorBase

    return declare(null, {
        // summary:
        //		Base class for Drilldown Locators.
        PickListItems: [],
        Identifier: "",
       

        constructor: function () {
            this.PickListItems = [];
        },



        addItem: function (item) {
            this.PickListItems.push(item);
        }


    });
});