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

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof FNOP
                       ? this
                       : oThis,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // native functions don't have a prototype
            FNOP.prototype = this.prototype;
        }
        fBound.prototype = new FNOP();

        return fBound;
    };
}

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
    "dojo/NodeList-data"
], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search, domConstruct, ContentPane, TitlePane, TitleGroup, on, Deferred, query) {
    var _isNullOrEmpty = function (/*Anything*/ obj) {
        // summary:
        //		Checks to see if the passed in thing is undefined, null or empty.

        return (obj === undefined || obj === null || obj === '');
    },
    _createNodeWithData = function (address, addressData) {
        // summary:
        //      Creates a DOM node witht he address results data attched. This data is used
        //      when clicking on an address.

        var node = domConstruct.toDom("<span class='drilldownResult'>" + address + "</span>");
        query(node).data("result", addressData);

        return node;
    },
    _createCount = function (array, create) {
        if (!_isNullOrEmpty(array) && array.length > 0 && create) {
            return "<span class='drilldownCount'>" + array.length + "</span>";
        }
        return "";
    },
    _createSubGroup = function (premiseList, titleGroup, showCounts) {
        // summary:
        //      Creates the lowest level in the picklist. Creates the address results with the attached data.

        var k = 0, kL = 0, subPremiseTitleGroup = new TitleGroup(),
            subPremiseList = premiseList.Addresses;

        for (k = 0, kL = subPremiseList.length; k < kL; k+=1) {
            subPremiseTitleGroup.addChild(new ContentPane({
                content: [_createNodeWithData(subPremiseList[k].address, subPremiseList[k]), "<span class='drilldownResultIcon'></span>"]
            }));
        }
        
        titleGroup.addChild(new TitlePane({
            title: _createCount(subPremiseList, showCounts) + "<span class='drilldownTitle'>"+ premiseList.Description + "</span>",
            content: subPremiseTitleGroup,
            open: false
        }));
    },
    _createGroup = function (pickList, showCounts) {
        // summary:
        //      Creates a titlegroup. USed to create a premise level in the pick list.

        var j = 0, jL = 0, premiseTitleGroup = new TitleGroup(), premiseList, node;

        if (!_isNullOrEmpty(pickList.Addresses) && pickList.Addresses.length > 1) {

            // Create a title group to hold the premise list
            premiseList = pickList.Addresses;

            for (j = 0, jL = premiseList.length; j < jL; j++) {
                // Do we have a sub premise list?
                if (!_isNullOrEmpty(premiseList[j].Addresses) && premiseList[j].Addresses.length > 1) {
                    _createSubGroup(premiseList[j], premiseTitleGroup, showCounts);
                }
                else {
                    // Single premise

                    if (!_isNullOrEmpty(premiseList[j].address)) {
                        node = _createNodeWithData(premiseList[j].address, premiseList[j]);
                    }
                    else {
                        node = _createNodeWithData(premiseList[j].Addresses[0].address, premiseList[j].Addresses[0]);
                    }
                    premiseTitleGroup.addChild(new ContentPane({
                        content: [node, "<span class='drilldownResultIcon'></span>"]
                    }));
                }
            }

            premiseTitleGroup.startup();
        }
        else {
            // Single result
            if (!_isNullOrEmpty(pickList.Addresses[0].address)) {
                premiseTitleGroup = new ContentPane({
                    content: _createNodeWithData(pickList.Addresses[0].address, pickList.Addresses[0])
                });
            }
            else if (!_isNullOrEmpty(pickList.Addresses[0].Addresses) && pickList.Addresses[0].Addresses.length > 0) {
                _createSubGroup(pickList.Addresses[0], premiseTitleGroup);
            }
        }
        return premiseTitleGroup;
    },
    handlerFunc = function (list, showCounts) {
        // summary:
        //      Handles the onclick event of a titlepane and lazy loads any child results.
        //      Constructs the results if they have not been created yet.

        if (this.get("contentSet") === false) {
            this.set("content", _createGroup(list, showCounts));
            this.set("contentSet", true);
        }
    };

    // module:
    //      esriuk/dijit/Drilldown

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Search], {
        // summary:
        //      A hierarchical address search widget that extends the functionality of the Esri Search widget.
        //  
        // description: 
        //      Search for and display address details in a hierarchical list. The Drilldown widget works with custom locators to 
        //      create a picklist from the address results and output this as an interactive list.
        //      Custom locators have their own class that can be used when creating the sources.

        
        baseClass: "drilldown",
        widgetsInTemplate: true,

        // resultsElement: DOM object
        //      The element used to contain the results.
        resultsElement: null,

        // _titleGroups: Array
        //      A list of each title group created for the picklist results.
        //      Used to destroy these widgets if needed.
        _titleGroups: [],

        // showCounts: Boolean
        //      Flag to turn on or off the counts for each level in the drilldown results.
        showCounts: false,

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
            // summary: 
            //      Override the Search widget search method.
            //      
            // description:
            //      Call the base search method to get the results, this will use the custom locator, if set up, and build
            //      the picklist from the results.
            //      When we get the results back it will be a picklist so construct the picklist UI.

            var _this = this, results = new Deferred();

            this.inherited(arguments).then(function (res) {
                _this._buildPickListUi(res);
                results.resolve();
            });

            return results.promise;
        },

        clear: function () {
            // summary:
            //      Clear the picklists and call the base clear method.

            this._clearPicklist();
            this.inherited(arguments);
        },

        _hydrateResults: function (a) {
            // summary:
            //      Override base method to check if the results are a picklist.

            if (a.PickListItems) {
                return a;
            }
            return this.inherited(arguments);
        },

        _formatResults: function (resultArray, sourceIndex, searchValue) {
            // summary:
            //      Override base method to correctly format picklist results if one is returned.

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
            // summary:
            //      Clear the picklist results if we have any. Go throught the list of 
            //      title groups and destroy them. 

            var m, mL;
            if (this._titleGroups.length > 0) {
                for (m = 0, mL = this._titleGroups.length; m < mL; m++) {
                    this._titleGroups[m].destroy();
                }
                this._titleGroups = [];
            }
        },

        _showNoResults: function() {
            // summary:
            //      Function used to call the base no results functions. 

            this._noResults(this.value);
            this._showNoResultsMenu();
        },

        _isSingleResult: function(results) {
            // summary:
            //      Check to see if we only have a single result returned as a picklist.
            //      It may be a single result but under one or two levels.

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
            // summary:
            //      Main code used to construct the picklist UI. The picklist is built using nested titlegroups and titlepanes.
            //      Only one level is constructed, the lower levels are lazy loaded when clicking on a title.

            var _this = this, pickListItems, i = 0, iL = 0, resultsContainer,
                resultSource, noResults = false, res, sourceContainer, titlePane, finished = new Deferred();

            // Clear list of title groups
            this._clearPicklist();

            // Create the TitleGroup container
            domConstruct.destroy(this.resultsElement);
            this.resultsElement = domConstruct.create("div", { "class": "arcgisSearch searchGroup picklistResults" }, this.domNode, "last");

            // Check to see if we only have a single results
            if ((_this.activeSourceIndex !== this._allIndex) && this._isSingleResult(results)) {
                // Single result may not be first source so use active source index
                res = this._hydrateResult(results[_this.activeSourceIndex].PickListItems[0].Addresses[0], _this.activeSourceIndex, false);
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
                                        titlePane = new TitlePane({
                                            title: _createCount(pickListItems[i].Addresses, this.showCounts) + "<span class='drilldownTitle'>" + pickListItems[i].Description + "</span>",
                                            open: false,
                                            contentSet: false
                                        });

                                        if (iL === 1) {
                                            titlePane.set("open", true);
                                            titlePane.set("contentSet", true);
                                            titlePane.set("content", _createGroup(pickListItems[i], this.showCounts));
                                        }
                                        else {
                                            titlePane.own(titlePane.on("click", handlerFunc.bind(titlePane, pickListItems[i], this.showCounts)));
                                        }

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

                // Set up the onclick event for an individual address.
                if (!_isNullOrEmpty(this.resultsElement)) {
                    on(this.resultsElement, ".drilldownResult:click", function () {
                        var loc = query(this).data()[0],
                            res = _this._hydrateResult(loc.result, _this.activeSourceIndex, false);
                        _this.select(res);
                        _this._clearPicklist();
                    });
                }
            }
            return finished.promise;
        }
    });
});