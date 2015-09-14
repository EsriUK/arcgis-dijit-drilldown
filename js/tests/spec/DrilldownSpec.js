

describe("A set of tests for the Drilldown widget", function () {
    var _Drilldown, widget, server,
        loadWidget = function (done) {
            require(["app/Drilldown"], function (DrillDown) {
                widget = new DrillDown({}, 'widget');
                _Drilldown = DrillDown;

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

    
    it("should clear the list of pricklists", function (done) {
        var destroyFunc = function() {
            return true;
        };
        widget._titleGroups.push({ destroy: destroyFunc }, { destroy: destroyFunc });

        widget._clearPicklist();
        expect(widget._titleGroups.length).toEqual(0);


        done();
    });
});