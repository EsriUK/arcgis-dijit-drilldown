var drilldownProps = {
    enableSuggestions: false,
    sources: [{
        locator: null,
        singleLineFieldName: "LH_ADDRESS",
        outFields: ["*"],
        name: "LH 5.3 LLPG",
        maxResults: 250,
        showCounts: true,
        flatMatch: false
    }],
};

describe("A set of tests for the Drilldown widget", function () {
    var _Drilldown, widget, server,
        loadWidget = function (done) {
            require(["app/Drilldown", "app/Locators/LLPGLocator", "esri/SpatialReference", "esri/dijit/Search"], function (DrillDown, LLPGLocator, SpatialReference) {
                var llpgLocator = new LLPGLocator("http://testserver/LocatorHub/arcgis/rest/services/FAKELOCATOR/ADDRESS/GeocodeServer");
                llpgLocator.setOutSpatialReference(new SpatialReference({ wkid: 27700 }));
                drilldownProps.sources[0].locator = llpgLocator;

                widget = new DrillDown(drilldownProps, 'widget');

                _Drilldown = DrillDown;

                widget.startup();
                done();
            });
        };


    var setupSinon = function () {


    };

    beforeEach(function (done) {
        setupSinon();
        loadWidget(done);
    });

    afterEach(function () {
        if (widget) {
            widget.clear();
            widget.destroy();
            widget = null;
        }
        if (server) {
            server.restore();
        }

    });

    it("should not be null", function (done) {
        expect(widget).not.toEqual(null);
        done();
    });


    
    it("should clear the list of picklists", function (done) {
        var destroyFunc = function() {
            return true;
        };
        widget._titleGroups.push({ destroy: destroyFunc }, { destroy: destroyFunc });

        widget._clearPicklist();
        expect(widget._titleGroups.length).toEqual(0);


        done();
    });

    it("should search for an address and return a picklist", function (done) {
        //setupSinon();
        var searchStub = sinon.stub(widget, "search").callsFake(function () {
            var res = this._hydrateResults(postcodeResults);
            this._buildPickListUi([res]);
        });
        widget.search("EH8 8AS")

        expect(widget._titleGroups.length).toEqual(1);
        done();
    });

    it("should clear the results of a search", function (done) {
        //setupSinon();

        var searchStub = sinon.stub(widget, "search").callsFake(function () {
            var res = this._hydrateResults(postcodeResults);
            this._buildPickListUi([res]);
        });

        widget.search("EH8 8AS")

        expect(widget._titleGroups.length).toEqual(1);

        widget.clear();

        expect(widget._titleGroups.length).toEqual(0);

        done();
    });

    it("should handle no results", function (done) {
        widget.clear();
        widget.search("")
        expect(widget._titleGroups.length).toEqual(0);
        widget.clear();

        var searchStub = sinon.stub(widget, "search").callsFake(function () {
            var res = { PickListItems: []};
            this._buildPickListUi([res]);
        });
        widget.search("")
        expect(widget._titleGroups.length).toEqual(0);
        done();
    });

    it("should handle a single result", function (done) {
        var searchStub = sinon.stub(widget, "search").callsFake(function () {
            var res = this._hydrateResults(singleResult);
            this._buildPickListUi([res]);
        });

        widget.search("7 Harrison Road")

        expect(widget._titleGroups.length).toEqual(0);
        widget.clear();

        done();
    });

    it("should handle a single level with multiple result", function (done) {
        var searchStub = sinon.stub(widget, "search").callsFake(function () {
            var res = this._hydrateResults(singleLevelMulti);
            this._buildPickListUi([res]);
        });

        widget.search("1 Harrison Road")

        expect(widget._titleGroups.length).toEqual(1);
        widget.clear();

        done();
    });

  

    it("should handle searching all sources", function (done) {
        if (widget) {
            widget.clear();
            widget.destroy();
            widget = null;
        }
      
        require(["app/Locators/LLPGLocator", "esri/SpatialReference", "dojo/Deferred", "app/Locators/PickList", "app/Locators/PickListItem"], function (LLPGLocator, SpatialReference, Deferred, PickList, PickListItem) {
            var llpgLocator = new LLPGLocator("http://testserver/LocatorHub/arcgis/rest/services/FAKELOCATOR/ADDRESS/GeocodeServer");
            llpgLocator.setOutSpatialReference(new SpatialReference({ wkid: 27700 }));

            drilldownProps.sources.push({
                locator: llpgLocator,
                singleLineFieldName: "LH_ADDRESS",
                outFields: ["*"],
                name: "LH 5.3 LLPG 2",
                maxResults: 250,
                showCounts: true,
                flatMatch: false
            });

            loadWidget(function () {
                var searchStub = sinon.stub(widget, "_searchDeferred").callsFake(function (a) {
                    var p = new PickList();
                    p.addItem(new PickListItem({
                        Description: "1 High Street",
                        SortDescription: "1 High Street",
                        Addresses: []
                    }));
                    var def = new Deferred();
                    var res = this._formatResults([p], this.activeSourceIndex, this.value);

                    return def.resolve([res]);
                });
                widget.activeSourceIndex = "all";
                widget.activeSource = null;
                widget.clear();
                widget.search("High street");

                expect(widget._titleGroups.length).toEqual(0);
                widget.clear();

                done();

            });
        });
    });

    it("should handle a LocatorHub error message", function (done) {
        require(["dojo/Deferred"], function (Deferred) {
            widget.activeSourceIndex = 1;
            var searchStub = sinon.stub(widget, "search").callsFake(function () {
                var def = new Deferred();

                this.emit("search-results", { "activeSourceIndex": 1, "errors": { 1: { "code": 400, "message": "Unable to complete operation", "details": ["NoMatchTooVague"] } } });
                this._buildPickListUi();
          
            });

            widget.search("1 Harrison Road")

            expect(widget.errors).not.toEqual(null);

            done();
        });
    });
});