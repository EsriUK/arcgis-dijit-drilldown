

describe("A set of tests for the ABX DPA Locator", function () {
    var _ABXLocator, widget, server,
        testAttributes = {
            DPA_POST_TOWN: "test town", DPA_DEP_LOCALITY: "local", DPA_DEP_THOROUGHFARE: "Oak Close", DPA_THOROUGHFARE: "High Street", ANOTHER_FIELD: "Uh oh", ADMINISTRATIVE_AREA: "",
            DPA_BUILDING_NUMBER: "4", PAO_END_NUMBER: "", PAO_START_SUFFIX: "A", PAO_END_SUFFIX: "", DPA_BUILDING_NAME: "A",
            SAO_START_NUMBER: "", SAO_END_NUMBER: "3", SAO_START_SUFFIX: "Z", SAO_END_SUFFIX: "", DPA_SUB_BUILDING_NAME: "bob"
        },
        loadWidget = function (done) {
            require(["app/Locators/ABXDPALocator"], function (ABXDPALocator) {
                widget = new ABXDPALocator("");
                _ABXLocator = ABXDPALocator;

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

    it("should be an ABX DPA locator", function (done) {
        expect(widget.locatorType).toEqual("ABXDPA");
        
        done();
    });



    it("should populate a picklist", function (done) {
        widget._buildPickList(abxDPAResults).then(function () {
            expect(widget.resultsPickList.PickListItems.length).toEqual(4);
            done();
        });
    });

    it("should return the correct text for the PAO", function (done) {
        var correctText = "A 4", paoValue = "", testAttrs = JSON.parse(JSON.stringify(testAttributes));

        paoValue = widget._getPAOText(testAttributes);
        expect(paoValue).toEqual(correctText);

        testAttrs.PAO_END_NUMBER = "";
        testAttrs.DPA_BUILDING_NUMBER = "1";
        testAttrs.DPA_BUILDING_NAME = "Testing";


        paoValue = widget._getPAOText(testAttrs);
        expect(paoValue).toEqual("Testing 1");

        done();
    });

    it("should return the correct text for the SAO", function (done) {
        var correctText = "bob 4A", paoValue = "", testAttrs = JSON.parse(JSON.stringify(testAttributes));

        paoValue = widget._getSAOText(testAttributes);
        expect(paoValue).toEqual(correctText);

        testAttrs.DPA_BUILDING_NUMBER = "1";
        testAttrs.DPA_BUILDING_NAME = "C";
        testAttrs.DPA_SUB_BUILDING_NAME = "Testing";


        paoValue = widget._getSAOText(testAttrs);
        expect(paoValue).toEqual("Testing 1C");

        done();
    });

    it("should return the correct description depending on the level passed in", function (done) {
        var descriptionVal = "";

        descriptionVal = widget._getListLevelDescription(1, testAttributes);
        expect(descriptionVal).toEqual("A 4, High Street, test town, local");

        descriptionVal = widget._getListLevelDescription(2, testAttributes);
        expect(descriptionVal).toEqual("High Street, test town, local");

        descriptionVal = widget._getListLevelDescription(5, testAttributes);
        expect(descriptionVal).toEqual("");

        done();
    });

    it("should populate a picklist with a single address", function (done) {
        widget._buildPickList(abxDPASingleResult).then(function () {
            expect(widget.resultsPickList.PickListItems.length).toEqual(1);
            done();
        });
    });

    it("should sort the results by the description property", function (done) {
        var results = {
            "candidates": [{
                "address": "5 NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                "attributes": {
                    "Match_addr": "5 NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                    "DPA_UDPRN": 8746006,
                    "DPA_ORGANISATION_NAME": "",
                    "DPA_DEPARTMENT_NAME": "",
                    "DPA_SUB_BUILDING_NAME": "",
                    "DPA_BUILDING_NAME": "",
                    "DPA_BUILDING_NUMBER": 5,
                    "DPA_DEP_THOROUGHFARE": "",
                    "DPA_THOROUGHFARE": "NORTH STREET",
                    "DPA_DOUBLE_DEP_LOCALITY": null,
                    "DPA_DEP_LOCALITY": "HEAVITREE",
                    "DPA_POST_TOWN": "EXETER",
                    "DPA_POSTCODE": "EX1 2RH",
                    "DPA_POSTCODE_TYPE": "S",
                    "DPA_WELSH_DEP_THOROUGHFARE": "",
                    "DPA_WELSH_THOROUGHFARE": "",
                    "DPA_WELSH_DB_DEP_LOCALITY": "",
                    "DPA_WELSH_DEP_LOCALITY": "",
                    "DPA_WELSH_POST_TOWN": "",
                    "DPA_DELIVERY_POINT_SUFFIX": "1F",
                    "DPA_PO_BOX_NUMBER": "",
                    "DPA_PROCESS_DATE": "23\/02\/2015 00:00:00",
                    "DPA_START_DATE": "19\/03\/2012 00:00:00",
                    "DPA_END_DATE": null,
                    "DPA_ENTRY_DATE": "23\/02\/2015 00:00:00",
                    "DPA_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "COUNTRY": "E",
                    "LATITUDE": 50.722213,
                    "LONGITUDE": -3.505562,
                    "UPRN": "100040226056",
                    "BLPU_LOGICAL_STATUS": 1,
                    "BLPU_STATE": 2,
                    "BLPU_STATE_DATE": "12\/05\/2014 00:00:00",
                    "PARENT_UPRN": "",
                    "RPC": 1,
                    "BLPU_START_DATE": "24\/10\/2007 00:00:00",
                    "BLPU_END_DATE": null,
                    "BLPU_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "BLPU_ENTRY_DATE": "04\/04\/2001 00:00:00",
                    "ORG_KEY": "1110O000016280",
                    "ORGANISATION": "HEAVITREE OSTEOPATHIC CLINIC",
                    "LEGAL_NAME": "",
                    "BLPU_CLASSES": "437,CM,MH",
                    "MULTI_OCC_COUNT": 0,
                    "ADDRESSBASE_POSTAL": "D",
                    "POSTCODE": "EX1 2RH",
                    "LOCAL_CUSTODIAN_CODE": 1110,
                    "LPI_KEY": "1110L000109010",
                    "LPI_LANGUAGE": "ENG",
                    "LPI_LOGICAL_STATUS": 1,
                    "LPI_START_DATE": "24\/10\/2007 00:00:00",
                    "LPI_END_DATE": null,
                    "LPI_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "LPI_ENTRY_DATE": "04\/04\/2001 00:00:00",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "5",
                    "PAO_END_NUMBER": "",
                    "USRN_MATCH_INDICATOR": "1",
                    "AREA_NAME": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "LEVEL_TEXT": "",
                    "OFFICIAL_FLAG": "",
                    "STREET_RECORD_TYPE": 1,
                    "STREET_STATE": 2,
                    "STREET_STATE_DATE": "01\/01\/1990 00:00:00",
                    "STREET_SURFACE": 1,
                    "STREET_CLASSIFICATION": 8,
                    "STREET_VERSION": 0,
                    "STREET_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "STREET_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_TOLERANCE": 10,
                    "STREET_START_X": 293785,
                    "STREET_START_Y": 92615,
                    "STREET_END_X": 293830,
                    "STREET_END_Y": 92390,
                    "STREET_START_LAT": 50.723408,
                    "STREET_START_LONG": -3.50613,
                    "STREET_END_LAT": 50.721394,
                    "STREET_END_LONG": -3.505428,
                    "STREET_DESCRIPTION": "NORTH STREET",
                    "LOCALITY": "HEAVITREE",
                    "ADMINISTRATIVE_AREA": "DEVON",
                    "TOWN_NAME": "EXETER",
                    "STREET_LANGUAGE": "ENG",
                    "USRN": "14200594",
                    "STREET_DESC_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_DESC_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_DESC_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_DESC_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "OS_ADDRESS_TOID": "osgb1000002274394292",
                    "OS_ADDRESS_TOID_VERSION": 11,
                    "OS_TOPO_TOID": "osgb1000012343477",
                    "OS_TOPO_TOID_VERSION": 4,
                    "OS_TRANSPORT_TOID": "osgb4000000025321175",
                    "OS_TRANSPORT_TOID_VERSION": 5,
                    "COUNCIL_TAX_REFERENCE": "",
                    "NON_DOMESTIC_REFERENCE": "",
                    "WARD_CODE": "E05003495",
                    "PARISH_CODE": ""
                }
            },{
                "address": "COBALT COMPUTER SOLUTIONS LTD, 2A, NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                "attributes": {
                    "Match_addr": "COBALT COMPUTER SOLUTIONS LTD, 2A, NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                    "DPA_UDPRN": 8745995,
                    "DPA_ORGANISATION_NAME": "COBALT COMPUTER SOLUTIONS LTD",
                    "DPA_DEPARTMENT_NAME": "",
                    "DPA_SUB_BUILDING_NAME": "",
                    "DPA_BUILDING_NAME": "2A",
                    "DPA_BUILDING_NUMBER": null,
                    "DPA_DEP_THOROUGHFARE": "",
                    "DPA_THOROUGHFARE": "NORTH STREET",
                    "DPA_DOUBLE_DEP_LOCALITY": null,
                    "DPA_DEP_LOCALITY": "HEAVITREE",
                    "DPA_POST_TOWN": "EXETER",
                    "DPA_POSTCODE": "EX1 2RH",
                    "DPA_POSTCODE_TYPE": "S",
                    "DPA_WELSH_DEP_THOROUGHFARE": "",
                    "DPA_WELSH_THOROUGHFARE": "",
                    "DPA_WELSH_DB_DEP_LOCALITY": "",
                    "DPA_WELSH_DEP_LOCALITY": "",
                    "DPA_WELSH_POST_TOWN": "",
                    "DPA_DELIVERY_POINT_SUFFIX": "1X",
                    "DPA_PO_BOX_NUMBER": "",
                    "DPA_PROCESS_DATE": "23\/02\/2015 00:00:00",
                    "DPA_START_DATE": "19\/03\/2012 00:00:00",
                    "DPA_END_DATE": null,
                    "DPA_ENTRY_DATE": "23\/02\/2015 00:00:00",
                    "DPA_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "COUNTRY": "E",
                    "LATITUDE": 50.721871,
                    "LONGITUDE": -3.505401,
                    "UPRN": "100041045586",
                    "BLPU_LOGICAL_STATUS": 1,
                    "BLPU_STATE": null,
                    "BLPU_STATE_DATE": null,
                    "PARENT_UPRN": "",
                    "RPC": 1,
                    "BLPU_START_DATE": "24\/10\/2007 00:00:00",
                    "BLPU_END_DATE": null,
                    "BLPU_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "BLPU_ENTRY_DATE": "04\/04\/2001 00:00:00",
                    "ORG_KEY": "",
                    "ORGANISATION": "",
                    "LEGAL_NAME": "",
                    "BLPU_CLASSES": "249,CI,CS",
                    "MULTI_OCC_COUNT": 2,
                    "ADDRESSBASE_POSTAL": "D",
                    "POSTCODE": "EX1 2RH",
                    "LOCAL_CUSTODIAN_CODE": 1110,
                    "LPI_KEY": "1110L000115384",
                    "LPI_LANGUAGE": "ENG",
                    "LPI_LOGICAL_STATUS": 1,
                    "LPI_START_DATE": "24\/10\/2007 00:00:00",
                    "LPI_END_DATE": null,
                    "LPI_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "LPI_ENTRY_DATE": "04\/04\/2001 00:00:00",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "",
                    "PAO_START_NUMBER": "2",
                    "PAO_END_NUMBER": "",
                    "USRN_MATCH_INDICATOR": "1",
                    "AREA_NAME": "",
                    "PAO_START_SUFFIX": "A",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "",
                    "LEVEL_TEXT": "",
                    "OFFICIAL_FLAG": "",
                    "STREET_RECORD_TYPE": 1,
                    "STREET_STATE": 2,
                    "STREET_STATE_DATE": "01\/01\/1990 00:00:00",
                    "STREET_SURFACE": 1,
                    "STREET_CLASSIFICATION": 8,
                    "STREET_VERSION": 0,
                    "STREET_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "STREET_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_TOLERANCE": 10,
                    "STREET_START_X": 293785,
                    "STREET_START_Y": 92615,
                    "STREET_END_X": 293830,
                    "STREET_END_Y": 92390,
                    "STREET_START_LAT": 50.723408,
                    "STREET_START_LONG": -3.50613,
                    "STREET_END_LAT": 50.721394,
                    "STREET_END_LONG": -3.505428,
                    "STREET_DESCRIPTION": "NORTH STREET",
                    "LOCALITY": "HEAVITREE",
                    "ADMINISTRATIVE_AREA": "DEVON",
                    "TOWN_NAME": "EXETER",
                    "STREET_LANGUAGE": "ENG",
                    "USRN": "14200594",
                    "STREET_DESC_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_DESC_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_DESC_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_DESC_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "OS_ADDRESS_TOID": "osgb1000002274503103",
                    "OS_ADDRESS_TOID_VERSION": 3,
                    "OS_TOPO_TOID": "osgb1000012343485",
                    "OS_TOPO_TOID_VERSION": 3,
                    "OS_TRANSPORT_TOID": "osgb4000000025321175",
                    "OS_TRANSPORT_TOID_VERSION": 5,
                    "COUNCIL_TAX_REFERENCE": "",
                    "NON_DOMESTIC_REFERENCE": "",
                    "WARD_CODE": "E05003495",
                    "PARISH_CODE": ""
                }
            }, {
                "address": "WINDSOR CASTLE INN, 4 NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                "attributes": {
                    "Match_addr": "WINDSOR CASTLE INN, 4 NORTH STREET, HEAVITREE, EXETER, EX1 2RH",
                    "DPA_UDPRN": 8745999,
                    "DPA_ORGANISATION_NAME": "WINDSOR CASTLE INN",
                    "DPA_DEPARTMENT_NAME": "",
                    "DPA_SUB_BUILDING_NAME": "",
                    "DPA_BUILDING_NAME": "",
                    "DPA_BUILDING_NUMBER": 4,
                    "DPA_DEP_THOROUGHFARE": "",
                    "DPA_THOROUGHFARE": "NORTH STREET",
                    "DPA_DOUBLE_DEP_LOCALITY": null,
                    "DPA_DEP_LOCALITY": "HEAVITREE",
                    "DPA_POST_TOWN": "EXETER",
                    "DPA_POSTCODE": "EX1 2RH",
                    "DPA_POSTCODE_TYPE": "S",
                    "DPA_WELSH_DEP_THOROUGHFARE": "",
                    "DPA_WELSH_THOROUGHFARE": "",
                    "DPA_WELSH_DB_DEP_LOCALITY": "",
                    "DPA_WELSH_DEP_LOCALITY": "",
                    "DPA_WELSH_POST_TOWN": "",
                    "DPA_DELIVERY_POINT_SUFFIX": "1E",
                    "DPA_PO_BOX_NUMBER": "",
                    "DPA_PROCESS_DATE": "23\/02\/2015 00:00:00",
                    "DPA_START_DATE": "19\/03\/2012 00:00:00",
                    "DPA_END_DATE": null,
                    "DPA_ENTRY_DATE": "23\/02\/2015 00:00:00",
                    "DPA_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "COUNTRY": "E",
                    "LATITUDE": 50.722148,
                    "LONGITUDE": -3.505523,
                    "UPRN": "100040226058",
                    "BLPU_LOGICAL_STATUS": 1,
                    "BLPU_STATE": 2,
                    "BLPU_STATE_DATE": "10\/09\/2012 00:00:00",
                    "PARENT_UPRN": "100041124884",
                    "RPC": 1,
                    "BLPU_START_DATE": "24\/10\/2007 00:00:00",
                    "BLPU_END_DATE": null,
                    "BLPU_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "BLPU_ENTRY_DATE": "04\/04\/2001 00:00:00",
                    "ORG_KEY": "",
                    "ORGANISATION": "",
                    "LEGAL_NAME": "",
                    "BLPU_CLASSES": "RD06",
                    "MULTI_OCC_COUNT": 0,
                    "ADDRESSBASE_POSTAL": "D",
                    "POSTCODE": "EX1 2RH",
                    "LOCAL_CUSTODIAN_CODE": 1110,
                    "LPI_KEY": "1110L000109012",
                    "LPI_LANGUAGE": "ENG",
                    "LPI_LOGICAL_STATUS": 1,
                    "LPI_START_DATE": "24\/10\/2007 00:00:00",
                    "LPI_END_DATE": null,
                    "LPI_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "LPI_ENTRY_DATE": "22\/04\/2002 00:00:00",
                    "SAO_START_NUMBER": "",
                    "SAO_END_NUMBER": "",
                    "SAO_START_SUFFIX": "",
                    "SAO_END_SUFFIX": "",
                    "SAO_TEXT": "THE FLAT",
                    "PAO_START_NUMBER": "4",
                    "PAO_END_NUMBER": "",
                    "USRN_MATCH_INDICATOR": "1",
                    "AREA_NAME": "",
                    "PAO_START_SUFFIX": "",
                    "PAO_END_SUFFIX": "",
                    "PAO_TEXT": "WINDSOR CASTLE INN",
                    "LEVEL_TEXT": "",
                    "OFFICIAL_FLAG": "",
                    "STREET_RECORD_TYPE": 1,
                    "STREET_STATE": 2,
                    "STREET_STATE_DATE": "01\/01\/1990 00:00:00",
                    "STREET_SURFACE": 1,
                    "STREET_CLASSIFICATION": 8,
                    "STREET_VERSION": 0,
                    "STREET_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "STREET_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_TOLERANCE": 10,
                    "STREET_START_X": 293785,
                    "STREET_START_Y": 92615,
                    "STREET_END_X": 293830,
                    "STREET_END_Y": 92390,
                    "STREET_START_LAT": 50.723408,
                    "STREET_START_LONG": -3.50613,
                    "STREET_END_LAT": 50.721394,
                    "STREET_END_LONG": -3.505428,
                    "STREET_DESCRIPTION": "NORTH STREET",
                    "LOCALITY": "HEAVITREE",
                    "ADMINISTRATIVE_AREA": "DEVON",
                    "TOWN_NAME": "EXETER",
                    "STREET_LANGUAGE": "ENG",
                    "USRN": "14200594",
                    "STREET_DESC_START_DATE": "24\/10\/2007 00:00:00",
                    "STREET_DESC_END_DATE": "29\/01\/2014 00:00:00",
                    "STREET_DESC_LAST_UPDATE_DATE": "02\/01\/2015 00:00:00",
                    "STREET_DESC_ENTRY_DATE": "26\/07\/1995 00:00:00",
                    "OS_ADDRESS_TOID": "osgb1000002274394364",
                    "OS_ADDRESS_TOID_VERSION": 10,
                    "OS_TOPO_TOID": "osgb1000012343479",
                    "OS_TOPO_TOID_VERSION": 4,
                    "OS_TRANSPORT_TOID": "osgb4000000025321175",
                    "OS_TRANSPORT_TOID_VERSION": 5,
                    "COUNCIL_TAX_REFERENCE": "260937182",
                    "NON_DOMESTIC_REFERENCE": "",
                    "WARD_CODE": "E05003495",
                    "PARISH_CODE": ""
                }
            }]
        }

        widget._buildPickList(results).then(function () {

            //

            expect(widget.resultsPickList.PickListItems[0].Addresses[1].Description).toEqual("4, NORTH STREET, EXETER, HEAVITREE");
            done();
        });


    });
});