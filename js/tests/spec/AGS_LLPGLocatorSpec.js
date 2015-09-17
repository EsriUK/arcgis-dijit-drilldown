

describe("A set of tests for the AGS LLPG Locator", function () {
    var _AGSLLPGLocator, widget, server,
        testAttributes = {
            Town: "test town", LocalityName: "local", StreetDescriptor: "High Street", ANOTHER_FIELD: "Uh oh", AdminArea: "",
            PAO_START_NUMBER: "", PAO_END_NUMBER: "", PAO_START_SUFFIX: "", PAO_END_SUFFIX: "", PAOText: "4A", PAONumberRange: "",
            SAO_START_NUMBER: "", SAO_END_NUMBER: "3", SAO_START_SUFFIX: "Z", SAO_END_SUFFIX: "", SAOText: "bob", SAONumberRange: ""
        },
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

    it("should return the correct text for the PAO", function (done) {
        var correctText = "4A", paoValue = "", testAttrs = JSON.parse(JSON.stringify(testAttributes));

        paoValue = widget._getPAOText(testAttributes);
        expect(paoValue).toEqual(correctText);

        testAttrs.PAO_END_NUMBER = "3";
        testAttrs.PAO_END_SUFFIX = "B";
        testAttrs.PAO_START_NUMBER = "1";
        testAttrs.PAO_START_SUFFIX = "C";
        testAttrs.PAOText = "Testing";
        testAttrs.PAONumberRange = "31";


        paoValue = widget._getPAOText(testAttrs);
        expect(paoValue).toEqual("Testing31");

        done();
    });

    it("should return the correct text for the SAO", function (done) {
        var correctText = "bob", paoValue = "", testAttrs = JSON.parse(JSON.stringify(testAttributes));

        paoValue = widget._getSAOText(testAttributes);
        expect(paoValue).toEqual(correctText);

        testAttrs.SAOText = "Testing";
        testAttrs.SAONumberRange = "1C-3B";


        paoValue = widget._getSAOText(testAttrs);
        expect(paoValue).toEqual("Testing1C-3B");

        done();
    });

    it("should return the correct description depending on the level passed in", function (done) {
        var descriptionVal = "";

        descriptionVal = widget._getListLevelDescription(1, testAttributes);
        expect(descriptionVal).toEqual("4A, High Street, local, test town");

        descriptionVal = widget._getListLevelDescription(2, testAttributes);
        expect(descriptionVal).toEqual("High Street, local, test town");

        descriptionVal = widget._getListLevelDescription(5, testAttributes);
        expect(descriptionVal).toEqual("");

        done();
    });

    it("should populate a picklist with a single address", function (done) {
        widget._buildPickList(singleAGSLLPGResults).then(function () {
            expect(widget.resultsPickList.PickListItems.length).toEqual(1);
            done();
        });
    });
});