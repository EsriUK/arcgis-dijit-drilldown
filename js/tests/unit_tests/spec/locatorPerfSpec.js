

describe("A set of performance tests for the Base Locator", function () {
    var _locatorBase, widget, server,
        loadWidget = function (done) {
            require(["app/Locators/_LocatorBase"], function (_LocatorBase) {
                widget = new _LocatorBase("");
                _locatorBase = _LocatorBase;

                done();
            });
        };


    var setupSinon = function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.autoRespondAfter = 257;
    };

    beforeEach(function (done) {
        loadWidget(done);
    });

    afterEach(function () {
        if (widget) {
            widget = null;
        }
    });

    it("should not be null", function (done) {
        expect(widget).not.toEqual(null);
        done();
    });

});