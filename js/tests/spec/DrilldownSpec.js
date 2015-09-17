var drilldownProps = {
    sources: [{
        locator: null,
        singleLineFieldName: "LH_ADDRESS",
        outFields: ["*"],
        name: "LH 5.3 LLPG",
        maxResults: 250
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
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.autoRespondAfter = 257;
        server.respondImmediately = true;

        server.respondWith("http://testserver/LocatorHub/arcgis/rest/info?f=json", [
            200,
            {
                "Content-Type": "application/json"
            },
            JSON.stringify("")
        ]);

        server.respondWith("GET", "http://testserver/LocatorHub/arcgis/rest/services/FAKELOCATOR/ADDRESS/GeocodeServer/findAddressCandidates?LH_ADDRESS=EH8%208AS&f=json&outSR=%7B%22wkid%22%3A4326%7D&outFields=*&maxLocations=250&callback=dojo.io.script.jsonp_dojoIoScript1._jsonpCallback", [
            200,
            {
                "Content-Type": "application/json"
            },
            JSON.stringify(postcodeResults)
        ]);
    };

    beforeEach(function (done) {
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

    it("should provide _isNullOrEmpty function", function (done) {
        expect(widget._isNullOrEmpty(null)).toEqual(true);
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
        var searchStub = sinon.stub(widget, "search", function () {
            var res = this._hydrateResults(postcodeResults);
            this._buildPickListUi([res]);
        });
        widget.search("EH8 8AS")

        expect(widget._titleGroups.length).toEqual(1);
        done();
    });

    it("should clear the results of a search", function (done) {
        //setupSinon();

        var searchStub = sinon.stub(widget, "search", function () {
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

        var searchStub = sinon.stub(widget, "search", function () {
            var res = { PickListItems: []};
            this._buildPickListUi([res]);
        });
        widget.search("")
        expect(widget._titleGroups.length).toEqual(0);
        done();
    });

    it("should handle a single result", function (done) {
        var searchStub = sinon.stub(widget, "search", function () {
            var res = this._hydrateResults(singleResult);
            this._buildPickListUi([res]);
        });

        widget.search("7 Harrison Road")

        expect(widget._titleGroups.length).toEqual(0);
        widget.clear();

        done();
    });

    it("should handle a single level with multiple result", function (done) {
        var searchStub = sinon.stub(widget, "search", function () {
            var res = this._hydrateResults(singleLevelMulti);
            this._buildPickListUi([res]);
        });

        widget.search("1 Harrison Road")

        expect(widget._titleGroups.length).toEqual(1);
        widget.clear();

        done();
    });
});