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
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "esri/dijit/Search",
    "dojo/dom-construct",
    "dijit/layout/ContentPane", 
    "dijit/TitlePane", 
    "dojox/widget/TitleGroup",
    "dojo/on",
    "dojo/i18n",
    "dojo/i18n!./nls/Drilldown"
], function (declare, lang, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search, domConstruct, ContentPane, TitlePane, TitleGroup, on, i18n) {
    
    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search], {
        // description: 
        //      Search for and display address details in a hierarchical list

        
        baseClass: "drilldown",
        widgetsInTemplate: true,
        resultsElement: null,
        _titleGroups: [],

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

        search: function () {
            // Override the Search widget serach method

            var _this = this;

            this.inherited(arguments).then(function (res) {
                _this._buildPickListUi(res.results);
            });

            
        },

        clear: function() {
            this._clearPicklist();
            this.inherited(arguments);
        },

        _hydrateResults: function (a) {
            if (a.PickListItems) {
                return a;
            }
            this.inherited(arguments);
        },

        _isNullOrEmpty: function (/*Anything*/ obj) {
            // summary:
            //		Checks to see if the passed in thing is undefined, null or empty.
            // tags:
            //		private

            return (obj === undefined || obj === null || obj === '');
        },

        _clearPicklist: function() {
            var m, mL;
            if (this._titleGroups.length > 0) {
                for (m = 0, mL = this._titleGroups.length; m < mL; m++) {
                    this._titleGroups[m].destroy();
                }
                this._titleGroups = [];
            }
        },

        _noResults: function() {
            this._noResultsHTML(this.value);
            this._showNoResultsMenu();
        },

        _buildPickListUi: function(results) {
            var _this = this, pickListItems, i = 0, iL = 0, resultsContainer, premiseList, subPremiseList, j = 0, jL = 0,
                premiseTitleGroup, subPremiseTitleGroup, k = 0, kL = 0, m = 0, mL = 0;

            // Clear list of title groups
            if (this._titleGroups.length > 0) {
                for (m = 0, mL = this._titleGroups.length; m < mL; m++) {
                    this._titleGroups[m].destroy();

                }
                this._titleGroups = [];
            }

            // Check we have some results
            if (!this._isNullOrEmpty(results) && !this._isNullOrEmpty(results[0]) && !this._isNullOrEmpty(results[0].PickListItems)) {
                // Create the TitleGroup container
                this.resultsElement = domConstruct.create("div", { id: "picklistResults" }, this.domNode, "last");
                resultsContainer = new TitleGroup(null, this.resultsElement);

                // Keep a list of all groups
                this._titleGroups.push(resultsContainer);

                // Get the picklist
                pickListItems = results[0].PickListItems;
                iL = pickListItems.length;

                if (iL > 0) {
                    for (i = 0; i < iL; i++) {
                        // Create the list of premises
                        premiseList = [];

                        premiseTitleGroup = this._createGroup(pickListItems[i]);

                        // Output each street as a title pane
                        resultsContainer.addChild(new TitlePane({
                            title: pickListItems[i].Description,
                            content: premiseTitleGroup,
                            open: false
                        }));

                        //Strat the widget
                        resultsContainer.startup();
                    }
                }
                else {
                    // No results
                    this._noResults();
                }
            }
            else {
                // Output and error message
                this._noResults();
            }

            if (!this._isNullOrEmpty(resultsContainer)) {
                on(resultsContainer, ".drilldownResult:click", function (e) {
                    _this.search(this.innerText);
                });
            }
        },

        _createSubGroup: function (premiseList, titleGroup) {
            var k = 0, kL = 0, subPremiseTitleGroup = new TitleGroup(),
                subPremiseList = premiseList.Addresses;

            for (k = 0, kL = subPremiseList.length; k < kL; k++) {
                subPremiseTitleGroup.addChild(new ContentPane({
                    content: "<span class='drilldownResult'>" + subPremiseList[k].address + "</span>"
                }));
            }
            subPremiseTitleGroup.startup();

            titleGroup.addChild(new TitlePane({
                title: premiseList.Description,
                content: subPremiseTitleGroup,
                open: false
            }));
        },

        _createGroup: function (pickList) {
            var _this = this, premiseTitleGroup = new TitleGroup(), premiseList, address = "";

            if (!this._isNullOrEmpty(pickList.Addresses) && pickList.Addresses.length > 1) {

                // Create a title group to hold the premise list
                premiseList = pickList.Addresses;

                for (j = 0, jL = premiseList.length; j < jL; j++) {
                    // Do we have a sub premise list?
                    if (!this._isNullOrEmpty(premiseList[j].Addresses) && premiseList[j].Addresses.length > 1) {
                        _this._createSubGroup(premiseList[j], premiseTitleGroup);
                    }
                    else {
                        // Single premise
                        if (!this._isNullOrEmpty(premiseList[j].address)) {
                            address = premiseList[j].address;
                        }
                        else {
                            address = premiseList[j].Addresses[0].address
                        }
                        premiseTitleGroup.addChild(new ContentPane({
                            content: "<span class='drilldownResult'>" + address + "</span>"
                        }));
                    }
                }

                premiseTitleGroup.startup();
            }
            else {
                // Single result
                if (!this._isNullOrEmpty(pickList.Addresses[0].address)) {
                    premiseTitleGroup = new ContentPane({
                        content: "<span class='drilldownResult'>" + pickList.Addresses[0].address + "</span>"
                    });
                }
                else if (!this._isNullOrEmpty(pickList.Addresses[0].Addresses) && pickList.Addresses[0].Addresses.length > 0) {
                    _this._createSubGroup(pickList.Addresses[0], premiseTitleGroup);
                    premiseTitleGroup.startup();
                }
            }
            return premiseTitleGroup;
        }

    });
});