var drilldownFlatProps = {
    sources: [{
        locator: null,
        singleLineFieldName: "LH_ADDRESS",
        outFields: ["*"],
        name: "LH 5.3 LLPG",
        maxResults: 250,
        showCounts: true
    }],
    flatMatch: true,
    enableSuggestions: false
};

describe("A set of tests for the Drilldown widget using the flattened match", function () {
    var _Drilldown, widget, server,
        loadWidget = function (done) {
            require(["app/Drilldown", "esri/tasks/locator", "esri/SpatialReference", "esri/dijit/Search"], function (DrillDown, Locator, SpatialReference) {
                var llpgLocator = new Locator("http://testserver/LocatorHub/arcgis/rest/services/FAKELOCATOR/ADDRESS/GeocodeServer");
                llpgLocator.setOutSpatialReference(new SpatialReference({ wkid: 27700 }));
                drilldownFlatProps.sources[0].locator = llpgLocator;

                widget = new DrillDown(drilldownFlatProps, 'widget');

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
            JSON.stringify(flatList)
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



    it("should handle a flat list of results", function (done) {
        var searchStub = sinon.stub(widget, "search", function () {
            var res = this._hydrateResults(flatList);
            
            this._buildPickListUi(flatList);
        });
        widget.clear();

        widget.search("High Street");

        expect(widget._titleGroups.length).toEqual(1);
        widget.clear();

        done();
    });

    it("should not create a list of results", function (done) {
        if (widget) {
            widget.clear();
            widget.destroy();
            widget = null;
        }
        if (server) {
            server.restore();
        }

        drilldownFlatProps.enableSuggestions = true;
        drilldownFlatProps.flatMatch = false;

        loadWidget(function () {
            var searchStub = sinon.stub(widget, "search", function () {
                var res = this._hydrateResults(flatList);
                this._buildPickListUi(flatList);
            });
            widget.clear();
            widget.search("High Street");

            expect(widget._titleGroups.length).toEqual(0);
            widget.clear();

            done();

        });

        
    });
});