

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

    it("should sort the results by the description property", function (done) {
        var results = {
            "candidates": [{
                "address": "CONFERENCE CENTRE, 35A MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                "attributes": {
                    "Match_addr": "39B MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "LOCATOR_DESCRIPTION": "39B MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "39B",
                    "PAO_END_NUMBER": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "STREET_DESCRIPTOR": "MARYLEBONE HIGH STREET",
                    "LOCALITY_NAME": "",
                    "ADMINISTRATIVE_AREA": "CITY OF WESTMINSTER",
                    "TOWN_NAME": "LONDON"
                }
            },{
                "address": "35 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                "attributes": {
                    "Match_addr": "35 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "LOCATOR_DESCRIPTION": "35 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "35",
                    "PAO_END_NUMBER": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "STREET_DESCRIPTOR": "MARYLEBONE HIGH STREET",
                    "LOCALITY_NAME": "",
                    "ADMINISTRATIVE_AREA": "CITY OF WESTMINSTER",
                    "TOWN_NAME": "LONDON"
                }
            }, {
                "address": "CONFERENCE CENTRE, 35A MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                "attributes": {
                    "Match_addr": "35A MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "LOCATOR_DESCRIPTION": "35A MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "35A",
                    "PAO_END_NUMBER": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "STREET_DESCRIPTOR": "MARYLEBONE HIGH STREET",
                    "LOCALITY_NAME": "",
                    "ADMINISTRATIVE_AREA": "CITY OF WESTMINSTER",
                    "TOWN_NAME": "LONDON"
                }
            }, {
                "address": "36 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                "attributes": {
                    "Match_addr": "36 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "LOCATOR_DESCRIPTION": "36 MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER, W1U 4AA",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "36",
                    "PAO_END_NUMBER": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "STREET_DESCRIPTOR": "MARYLEBONE HIGH STREET",
                    "LOCALITY_NAME": "",
                    "ADMINISTRATIVE_AREA": "CITY OF WESTMINSTER",
                    "TOWN_NAME": "LONDON"
                }
            }]
        }

        widget._buildPickList(results).then(function () {

            //

            expect(widget.resultsPickList.PickListItems[0].Addresses[1].Description).toEqual("35A, MARYLEBONE HIGH STREET, LONDON, CITY OF WESTMINSTER");
            done();
        });


    });
});