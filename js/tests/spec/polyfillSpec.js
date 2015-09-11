﻿

describe("A set of tests for the Base Locator", function () {
    var originalTrim = String.prototype.trim, originalFilter = Array.prototype.filter;

  
    String.prototype.trim = undefined;
    Array.prototype.filter = undefined;

    beforeEach(function (done) {
        done();
    });

    afterEach(function () {
        String.prototype.trim = originalTrim;
        Array.prototype.filter = originalFilter;
    });

    it("should test the trim polyfill", function (done) {
        require(["app/Locators/_LocatorBase"], function (_LocatorBase) {

            expect("tttttt ".trim()).toEqual("tttttt");

            done();
        });
        
    });

    it("should test the filter polyfill", function (done) {
        //Array.prototype.filter = undefined;

        require(["app/Locators/_LocatorBase"], function (_LocatorBase) {

            var test = ["a", "b", "", "c", "", "d", "e"]
            

            expect(test.filter(Boolean).length).toEqual(5);

            done();
        });
    });
});