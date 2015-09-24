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
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "esri/dijit/Search",
    "dojo/dom-construct",
    "dijit/layout/ContentPane", 
    "dijit/TitlePane", 
    "dojox/widget/TitleGroup",
    "dojo/on",
    "dojo/Deferred",
    "dojo/query",
    "dojo/store/Memory",
    "dojo/NodeList-data"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search, domConstruct, ContentPane, TitlePane, TitleGroup, on, Deferred, query, Memory) {
    var _isNullOrEmpty = function (/*Anything*/ obj) {
        // summary:
        //		Checks to see if the passed in thing is undefined, null or empty.
        // tags:
        //		private

        return (obj === undefined || obj === null || obj === '');
    },
    _createSubGroup = function (premiseList, titleGroup) {
        var k = 0, kL = 0, subPremiseTitleGroup = new TitleGroup(),
            subPremiseList = premiseList.Addresses, node, panes = [];
        subPremiseTitleGroup.startup();

        for (k = 0, kL = subPremiseList.length; k < kL; k+=1) {
            node = domConstruct.toDom("<span class='drilldownResult'>" + subPremiseList[k].address + "</span>");
            query(node).data("result", subPremiseList[k]);

            subPremiseTitleGroup.addChild(new ContentPane({
                content: node
            }));
        }
        

        titleGroup.addChild(new TitlePane({
            title: premiseList.Description,
            content: subPremiseTitleGroup,
            open: false
        }));
    };

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search], {
        // description: 
        //      Search for and display address details in a hierarchical list

        
        baseClass: "drilldown",
        widgetsInTemplate: true,
        resultsElement: null,
        _titleGroups: [],
        _resultsStore: null,

        constructor: function (args) {
            declare.safeMixin(this, args);
        },


        destroy: function () {
            // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
            // call the superclass method of the same name.
            
            this._clearPicklist();
            this.inherited(arguments);
        },

        search: function () {
            // Override the Search widget search method

            var _this = this, results = new Deferred();

            this.inherited(arguments).then(function (res) {
                _this._buildPickListUi(res);
                results.resolve();
            });

            return results.promise;
        },


        clear: function() {
            this._clearPicklist();
            this.inherited(arguments);
        },

        _hydrateResults: function (a) {
            if (a.PickListItems) {
                return a; //this._hydratePickListResult(a);
            }
            return this.inherited(arguments);
        },


        _formatResults: function (resultArray, sourceIndex, searchValue) {
            var c = {
                activeSourceIndex: sourceIndex,
                value: searchValue,
                numResults: 0,
                numErrors: 0,
                errors: null,
                results: null
            }, d = {}, e = {}, b = 0;

            if (resultArray) {
                if(sourceIndex === this._allIndex) {
                    // Using all locators
                    for (b = 0; b < resultArray.length; b++) {
                        if (!_isNullOrEmpty(this.sources[b].locator.locatorType)) {
                            // Custom locator with picklists
                            e[sourceIndex] = resultArray[0];
                            c.numResults += resultArray[0].PickListItems.length;
                        }
                        else {
                            c = this.inherited(arguments);
                        }
                    }
                    c.results = e;
                    c.err = d;
                    return c;
                }
                
                if (!_isNullOrEmpty(this.activeSource.locator.locatorType)) {
                    // Custom locator with picklists
                    e[sourceIndex] = resultArray[0];
                    c.numResults += resultArray[0].PickListItems.length;
                    c.results = e;
                    c.err = d;
                    return c;
                }
                return this.inherited(arguments);
                
            }
            return c;
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


        _showNoResults: function() {
            this._noResults(this.value);
            this._showNoResultsMenu();
        },

        _isSingleResult: function(results) {
            var numberOfResults = 0, pickListItems, singleSource, source;

            for (source in results) {
                if (results.hasOwnProperty(source)) {
                    numberOfResults++;
                    singleSource = source;
                }
            }

            if (numberOfResults === 1) {
                pickListItems = results[singleSource].PickListItems;

                if (pickListItems.length === 1 && pickListItems[0].Addresses.length === 1) {
                    if (_isNullOrEmpty(pickListItems[0].Addresses[0].Addresses)) {
                        return true;
                    }
                    if (!_isNullOrEmpty(pickListItems[0].Addresses[0].Addresses) && pickListItems[0].Addresses[0].Addresses.length === 1) {
                        return true;
                    }
                }
                return false;
            }

            return false;
        },

        _buildPickListUi: function(results) {
            var _this = this, pickListItems, i = 0, iL = 0, resultsContainer, premiseList, premiseTitleGroup, 
                resultSource, noResults = false, res, sourceContainer, titlePane, _createGroup = this._createGroup,
                finished = new Deferred();

            // Clear list of title groups
            this._clearPicklist();

            //this._resultsStore = new Memory({
            //    data: results,
            //    getChildren: function (object) {
            //        return object.children || [];
            //    }
            //});


            // Create the TitleGroup container
            domConstruct.destroy(this.resultsElement);
            this.resultsElement = domConstruct.create("div", { "class": "arcgisSearch searchGroup picklistResults" }, this.domNode, "last");

            // Check to see if we only have a single results
            if ((_this.activeSourceIndex !== this._allIndex) && this._isSingleResult(results)) {
                res = this._hydrateResult(results[0].PickListItems[0].Addresses[0], _this.activeSourceIndex, false);
                this.select(res);
            }
            else {
                if (!_isNullOrEmpty(results)) {
                    for (resultSource in results) {
                        if (results.hasOwnProperty(resultSource)) {
                            // Check we have some results
                            if (!_isNullOrEmpty(results[resultSource]) && !_isNullOrEmpty(results[resultSource].PickListItems)) {
                                // Get the picklist
                                pickListItems = results[resultSource].PickListItems;
                                iL = pickListItems.length;

                                if (iL > 0) {
                                    sourceContainer = domConstruct.create("div", { id: resultSource }, this.resultsElement, "last");
                                    resultsContainer = new TitleGroup(null, sourceContainer);

                                    // Keep a list of all groups
                                    this._titleGroups.push(resultsContainer);

                                    for (i = 0; i < iL; i+=1) {
                                        // Create the list of premises
                                        premiseList = [];

                                        premiseTitleGroup = _createGroup(pickListItems[i]);

                                        titlePane = new TitlePane({
                                            title: pickListItems[i].Description,
                                            content: premiseTitleGroup,
                                            open: (iL === 1) ? true : false
                                        });
                                        titlePane.startup();

                                        resultsContainer.startup();

                                        // Output each street as a title pane
                                        resultsContainer.addChild(titlePane);
                                        noResults = false;
                                    }
                                }
                                else {
                                    // No results
                                    noResults = true;
                                }
                            }
                            else {
                                // Output and error message
                                noResults = true;
                            }
                        }
                    }
                    finished.resolve();
                }

                if (noResults) {
                    this._showNoResults();
                }
                if (!_isNullOrEmpty(this.resultsElement)) {
                    on(this.resultsElement, ".drilldownResult:click", function () {
                        var loc = query(this).data()[0],
                            res = _this._hydrateResult(loc.result, _this.activeSourceIndex, false);
                        _this.select(res);
                    });
                }
            }
            return finished.promise;
        },

        

        _createGroup: function (pickList) {
            var j = 0, jL = 0, premiseTitleGroup = new TitleGroup(), premiseList, node;

            if (!_isNullOrEmpty(pickList.Addresses) && pickList.Addresses.length > 1) {

                // Create a title group to hold the premise list
                premiseList = pickList.Addresses;

                for (j = 0, jL = premiseList.length; j < jL; j++) {
                    // Do we have a sub premise list?
                    if (!_isNullOrEmpty(premiseList[j].Addresses) && premiseList[j].Addresses.length > 1) {
                        _createSubGroup(premiseList[j], premiseTitleGroup);
                    }
                    else {
                        // Single premise
                        if (!_isNullOrEmpty(premiseList[j].address)) {
                            node = domConstruct.toDom("<span class='drilldownResult'>" + premiseList[j].address + "</span>");
                            query(node).data("result", premiseList[j]);
                        }
                        else {
                            node = domConstruct.toDom("<span class='drilldownResult'>" + premiseList[j].Addresses[0].address + "</span>");
                            query(node).data("result", premiseList[j].Addresses[0]);
                        }
                        premiseTitleGroup.addChild(new ContentPane({
                            content: node
                        }));
                    }
                }

                premiseTitleGroup.startup();
            }
            else {
                // Single result
                if (!_isNullOrEmpty(pickList.Addresses[0].address)) {
                    node = domConstruct.toDom("<span class='drilldownResult'>" + pickList.Addresses[0].address + "</span>");
                    query(node).data("result", pickList.Addresses[0]);

                    premiseTitleGroup = new ContentPane({
                        content: node
                    });
                }
                else if (!_isNullOrEmpty(pickList.Addresses[0].Addresses) && pickList.Addresses[0].Addresses.length > 0) {
                    _createSubGroup(pickList.Addresses[0], premiseTitleGroup);
                    premiseTitleGroup.startup();
                }
            }
            return premiseTitleGroup;
        }

    });
});