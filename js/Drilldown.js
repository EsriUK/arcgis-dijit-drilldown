/*global define, console, declare */

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
    "dojo/_base/lang",
    "dojo/promise/all",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "./_DrilldownBase",
    "esri/dijit/Search",
    "dojo/Deferred",
    "dojo/i18n",
    "dojo/i18n!./nls/Drilldown"
], function (declare, lang, all, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _DrilldownBase, Search, Deferred, i18n) {
    
    return declare([_Widget, _DrilldownBase, _TemplatedMixin, _WidgetsInTemplateMixin, Search], {
        // description: 
        //      Search for and display address details in a hierarchical list

        
        baseClass: "drilldown",
        widgetsInTemplate: true,


        constructor: function (args) {
            declare.safeMixin(this, args);
        },


        startup: function () {

        },

        destroy: function () {
            // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
            // call the superclass method of the same name.
            this.inherited(arguments);
        },

        setupConnections: function () {
            // summary:
            //    wire events, and such
            //

        },


        search: function (searchValue) {
            // Override the Search widget serach method

            var result = new Deferred(), resultsArray;

            this.inherited(arguments).then(function (res) {
                var a = 0;
            });

            
        },

        _hydrateResults: function (a, c) {
            if (a.PickListItems) {
                return a;
            }
            else {
                this.inherited(arguments);
            }
        }

    });
});