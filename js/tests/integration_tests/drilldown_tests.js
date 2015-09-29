var assert = require('assert'),
    webdriverio = require('webdriverio'),
    helper = require('../helpers/test_helper');


browser.addCommand("login", helper.oAuthLogin.bind(browser));



describe('Drilldown tests: ' + helper.getBrowser(), function () {
    this.timeout(99999999);

    afterEach(function (done) {
        browser.call(done);
    });


    it('should open the drilldown test page', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/15/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Check the title
            .getTitle(function (err, title) {
                assert(err === undefined);
                assert(title === 'Drilldown Widget');
            })
            .call(done);
    });

    it('should do an address search for 13 Princes Street', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/15/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 10000)
            .pause(2000)
            .setValue('#searchWidget_input', '13 Princes Street EH2 2AN')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
<<<<<<< HEAD
            .click(".zoomTo")
            .pause(2000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
=======

>>>>>>> origin/master
            .call(done);
    });
    
    it('should do an address search for Princes Street then select 12 Princes street from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/13/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 10000)
            .pause(2000)
            .setValue('#searchWidget_input', 'Princes Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_6 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function(text) {
                console.log(text);
            })
            .call(done);
    });
   
    it('should do an address search for EH1 2AN from list then select 26 Rutland Street', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/13/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 10000)
            .pause(2000)
            .setValue('#searchWidget_input', 'EH1 2AN')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_4 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });
    it('should do an address search for Princes Street then select top heading and Unit 2', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/13/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 10000)
            .pause(2000)
            .setValue('#searchWidget_input', 'Princes Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_1")
            .click("#dijit_layout_ContentPane_1 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

});