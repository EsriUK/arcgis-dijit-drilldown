

describe("A set of tests for the Base Locator", function () {
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

    it("should be the base locator", function (done) {
        expect(widget.locatorType).toEqual("None");

        done();
    });

    it("should run the _geocodeHandler", function (done) {
        require(["dojo/Deferred"], function (Deferred) {
            widget._successHandler = function (results) {
                expect(results.length).toEqual(1);
                done();
            };

            widget._buildPickList = function () {
                this.resultsPickList.PickListItems.push({});
                var def = new Deferred();
                return def.resolve();
            }

            widget._geocodeHandler(llpgResults);

            
        });
    });

    //it("should sort the results by the description property", function (done) {
    //    var descArray = [
    //        { SortDescription: "HILL COURT" },
    //        { SortDescription: "HILL STREET SOUTH LANE" },
    //        { SortDescription: "HILL STREET" },
    //        { SortDescription: "HILL STREET NORTH LANE" },
    //        { SortDescription: "HILL SQUARE" },
    //        { SortDescription: "HILL PLACE" }
    //    ];

    //    descArray.sort(widget._descriptionSort);

    //    expect(descArray[0].SortDescription).toEqual("HILL COURT");
    //    expect(descArray[5].SortDescription).toEqual("HILL STREET SOUTH LANE");

    //    done();
    //});
});