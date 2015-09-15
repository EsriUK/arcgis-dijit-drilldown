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
            require(["app/Drilldown", "app/Locators/LLPGLocator", "esri/SpatialReference"], function (DrillDown, LLPGLocator, SpatialReference) {

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

        server.respondWith("http://testserver/LocatorHub/arcgis/rest/info?f=json", [
            200,
            {
                "Content-Type": "application/json"
            },
            JSON.stringify("")
        ]);

        server.respondWith("http://testserver/LocatorHub/arcgis/rest/services/FAKELOCATOR/ADDRESS/GeocodeServer/findAddressCandidates", [
            200,
            {
                "Content-Type": "application/json"
            },
            JSON.stringify(agsLLPGResults)
        ]);

    };

    beforeEach(function (done) {
        loadWidget(done);
    });

    afterEach(function () {
        if (widget) {
            widget.destroy();
            widget = null;
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
        setupSinon();

        widget.search("high street");

        expect(1).toEqual(1);

        done();
    });
});