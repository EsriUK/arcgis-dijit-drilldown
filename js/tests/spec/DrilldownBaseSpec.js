

describe("A set of tests for the Drilldown base widget", function () {
    var _DrilldownBase, widget, server,
        loadWidget = function (done) {
            require(["app/_DrilldownBase"], function (_drilldownBase) {
                widget = new _drilldownBase({}, 'widgetBase');
                _DrilldownBase = _drilldownBase;

                widget.startup();
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

    it("should replace the fields in the text with the values", function (done) {
        var text = "blah blah {bob}, something else: {tings}. Then this happened {what}", values = {
            bob: "Hello?",
            tings: 1234,
            what: "Morning"
        }, finalText = "blah blah Hello?, something else: 1234. Then this happened Morning"

        expect(widget._fieldReplace(text, values)).toEqual(finalText);
        done();
    });
});