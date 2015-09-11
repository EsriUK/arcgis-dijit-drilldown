

describe("A set of tests for the LLPG Locator", function () {
    var _LLPGLocator, widget, server,
        testAttributes = {
            TOWN_NAME: "test town", LOCALITY_NAME: "local", STREET_DESCRIPTOR: "High Street", ANOTHER_FIELD: "Uh oh", ADMINISTRATIVE_AREA: "",
            PAO_START_NUMBER: "4", PAO_END_NUMBER: "", PAO_START_SUFFIX: "A", PAO_END_SUFFIX: "", PAO_TEXT: "",
            SAO_START_NUMBER: "", SAO_END_NUMBER: "3", SAO_START_SUFFIX: "Z", SAO_END_SUFFIX: "", SAO_TEXT: "bob"
        },
        loadWidget = function (done) {
            require(["app/Locators/LLPGLocator"], function (LLPGLocator) {
                widget = new LLPGLocator("");
                _LLPGLocator = LLPGLocator;

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

    it("should be an LLPG locator", function (done) {
        expect(widget.locatorType).toEqual("LLPG");
        
        done();
    });

    it("should return an address value from the selected fields", function (done) {
        var addressFields = ["TOWN_NAME", "LOCALITY_NAME", "STREET_DESCRIPTOR"],
            finalAddress = "High Street, local, test town";

        expect(widget._getGroupedAddressValue(addressFields, testAttributes)).toEqual(finalAddress);

        done();
    });

    it("should populate a picklist", function (done) {
        widget._buildPickList(llpgResults).then(function () {
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
        testAttrs.PAO_TEXT = "Testing";


        paoValue = widget._getPAOText(testAttrs);
        expect(paoValue).toEqual("Testing1C-3B");

        done();
    });

    it("should return the correct text for the SAO", function (done) {
        var correctText = "bobZ-3", paoValue = "", testAttrs = JSON.parse(JSON.stringify(testAttributes));

        paoValue = widget._getSAOText(testAttributes);
        expect(paoValue).toEqual(correctText);

        testAttrs.SAO_END_NUMBER = "3";
        testAttrs.SAO_END_SUFFIX = "B";
        testAttrs.SAO_START_NUMBER = "1";
        testAttrs.SAO_START_SUFFIX = "C";
        testAttrs.SAO_TEXT = "Testing";


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
        widget._buildPickList(singleLlpgResult).then(function () {
            expect(widget.resultsPickList.PickListItems.length).toEqual(1);
            done();
        });
    });
});