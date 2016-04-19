var assert = require('assert'),
    webdriverio = require('webdriverio'),
    helper = require('../helpers/test_helper'),
    options = {
        host: 'localhost',
        port: 4444
    };


browser.addCommand("login", helper.oAuthLogin.bind(browser));



describe('Drilldown tests: ' + helper.getBrowser(), function () {
    this.timeout(99999999);

    afterEach(function (done) {
        browser.call(done);
    });


    //it('should open the drilldown test page', function (done) {
    //    // Load drilldown test site
    //    browser
    //        .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

    //        // Check the title
    //        .getTitle(function (err, title) {
    //            assert(err === undefined);
    //            assert(title === 'Drilldown Widget');
    //        })
    //        .call(done);
    //});

    
    

    it('should do an ABX address search for 11 HIGH STREET', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/21/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="1"]')
            .setValue('#searchWidget_input', '11 HIGH STREET EX4 3LF')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click(".zoomTo")
            .pause(2000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

            .call(done);
    });

    it('should do an ABX address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="1"]')

            .setValue('#searchWidget_input', 'High Street Exeter')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_16 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do an ABX address search for EX3 0EA from list then select 12 High Street Topsham', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="1"]')

            .setValue('#searchWidget_input', 'EX3 0EA')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_6 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do an ABX address search for High Street then select Exeter, Communicatioon Station then Site 79215', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

              // Set Locator to ABX
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="1"]')

            .setValue('#searchWidget_input', 'High Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_0")
            .click("#dijit_TitlePane_3")
            .click("#dijit_layout_ContentPane_12 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

            .call(done);
    });
});