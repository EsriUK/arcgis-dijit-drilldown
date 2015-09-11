

describe("A set of tests for the AGS LLPG Locator", function () {
    var _AGSLLPGLocator, widget, server,
        loadWidget = function (done) {
            require(["app/Locators/AGSLLPGLocator"], function (AGSLLPGLocator) {
                widget = new AGSLLPGLocator("");
                _AGSLLPGLocator = AGSLLPGLocator;

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

    it("should be an AGS LLPG locator", function (done) {
        expect(widget.locatorType).toEqual("AGS_LLPG");
        
        done();
    });


    it("should return an address value from the selected fields", function (done) {
        var addressFields = ["Town", "LocalityName", "StreetDescriptor"],
            attributes = { Town: "test town", LocalityName: "local", StreetDescriptor: "High Street", ANOTHER_FIELD: "Uh oh" },
            finalAddress = "High Street, local, test town";

        expect(widget._getGroupedAddressValue(addressFields, attributes)).toEqual(finalAddress);

        done();
    });


    it("should populate a picklist", function (done) {
        widget._buildPickList(agsLLPGResults).then(function () {
            expect(widget.resultsPickList.PickListItems.length).toEqual(1);
            done();
        });
    });
});