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


    it('should open the drilldown test page', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

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
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)
            .setValue('#searchWidget_input', '13 Princes Street EH2 2AN')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click(".zoomTo")
            .pause(2000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

       // origin/master
            .call(done);
    });
    
    it('should do an address search for Princes Street then select 12 Princes street from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)
            .setValue('#searchWidget_input', 'Princes Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_15 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function(text) {
                console.log(text);
            })
            .call(done);
    });
   
    it('should do an address search for EH1 2AN from list then select 26 Rutland Street', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
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
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)
            .setValue('#searchWidget_input', 'Princes Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_1")
            .click("#dijit_layout_ContentPane_3 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

            .call(done);
    });

    it('should do an ABX address search for 11 HIGH STREET', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

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
            .getText("#searchWidget_more_results div.moreItem").then(function(text) {
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

    it('should do an Merge address search for 11 HIGH STREET', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="2"]')
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

    it('should do an Merge address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="2"]')

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

    it('should do a Merge address search for EX3 0EA from list then select 12 High Street Topsham', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="2"]')

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

    it('should do a Merge address search for High Street then select Exeter, Communicatioon Station then Site 79215', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

              // Set Locator to Merge
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="2"]')

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

    it('should do an Merge DPA address search for 11 HIGH STREET', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="3"]')
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

    it('should do an Merge DPA address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="3"]')

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

    it('should do a Merge DPA address search for EX3 0EA from list then select 12 High Street Topsham', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="3"]')

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

    it('should do a Merge DPA address search for High Street then select Exeter, Communicatioon Station then Site 79215', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

              // Set Locator to Merge DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="3"]')

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


    it('should do an Merge Pointer address search for 11 HIGH STREET EX4 3LF', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge Pointer
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="4"]')

            .waitForExist("#searchWidget_input", 2000)
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

    it('should do an Merge Pointer address search for 11 HIGH STREET ARDGLASS', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge Pointer
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="4"]')
            .setValue('#searchWidget_input', '11 HIGH STREET ARDGLASS')
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
    it('should do an Merge Pointer address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge Pointer
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="4"]')

            .setValue('#searchWidget_input', 'High Street Exeter')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_0")
            .click("#dijit_layout_ContentPane_2 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do a Merge Pointer address search for EX3 0EA from list then select 12 High Street Topsham', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Merge Pointer
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="4"]')

            .setValue('#searchWidget_input', 'EX3 0EA')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_5 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do a Merge address search for High Street Belfast then select Hi Park centre then Watchmaker', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

              // Set Locator to Merge Pointer
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="4"]')

            .setValue('#searchWidget_input', 'High Street Belfast')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_1")
            .click("#dijit_layout_ContentPane_5 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

            .call(done);
    });

    it('should do an ABX DPA address search for 11 HIGH STREET', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="5"]')
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

    it('should do an ABX DPA address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="5"]')

            .setValue('#searchWidget_input', 'High Street Exeter')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_0")
            .click("#dijit_layout_ContentPane_2 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do a ABX DPA address search for EX3 0EA from list then select 12 High Street Topsham', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to ABX DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="5"]')

            .setValue('#searchWidget_input', 'EX3 0EA')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_layout_ContentPane_5 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);
    });

    it('should do a ABX DPA address search for High Street then select Exeter, Burger King', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

              // Set Locator to ABX DPA
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="5"]')

            .setValue('#searchWidget_input', 'High Street')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_0")
            .click("#dijit_TitlePane_2")
            .click("#dijit_layout_ContentPane_27 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })

            .call(done);
    });

    it('should do a Cascade address search for 11 HIGH STREET EX4 3LF', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search

            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Cascade
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="8"]')
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


    it('should do a Cascade address search for High Street Exeter then select BUILD A BEAR, 4 HIGH STREET from list', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

            // Perform a valid search
            .waitForExist("#searchWidget_input", 50000)
            .pause(2000)

            // Set Locator to Cascade
            .click(".esri-icon-down-arrow")
            .click('//*[@data-index="8"]')

            .setValue('#searchWidget_input', 'High Street Exeter')
            .pause(2000)
            .click(".esri-icon-search")
            .pause(10000)
            .click("#dijit_TitlePane_0")
            .click("#dijit_layout_ContentPane_19 span.drilldownResult")
            .pause(10000)
            .getText("#searchWidget_more_results div.moreItem").then(function (text) {
                console.log(text);
            })
            .call(done);

    });

    //it('should do a GMS address search for Bethel Street then select 901 Bethel Street from list', function (done) {
    //    // Load drilldown test site
    //    browser
    //        .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

    //        // Perform a valid search
    //        .waitForExist("#searchWidget_input", 50000)
    //        .pause(2000)

    //        // Set Locator to Cascade
    //        .click(".esri-icon-down-arrow")
    //        .click('//*[@data-index="13"]')

    //        .setValue('#searchWidget_input', 'Bethel Street')
    //        .pause(2000)
    //        .click(".esri-icon-search")
    //        .pause(10000)
    //        .click("#dijit_layout_ContentPane_3 span.drilldownResult")
    //        .pause(10000)
    //        .getText("#searchWidget_more_results div.moreItem").then(function (text) {
    //            console.log(text);
    //        })
    //        .call(done);

    //        });

    //        it('should do a GMS address search for Bethel Street then select 1006 Heading then 1006 Bethel Street from list', function (done) {
    //            // Load drilldown test site
    //            browser
    //                .url("http://appsdev.esriuk.com/app/Vanilla-Drilldown-demo/6/wmt/view/191a2e7584ef4a9fbf7275a2cbcb01ce/index.html")

    //                // Perform a valid search
    //                .waitForExist("#searchWidget_input", 50000)
    //                .pause(2000)

    //                // Set Locator to Cascade
    //                .click(".esri-icon-down-arrow")
    //                .click('//*[@data-index="13"]')

    //                .setValue('#searchWidget_input', 'Bethel Street')
    //                .pause(2000)
    //                .click(".esri-icon-search")
    //                .pause(10000)
    //                .click("#dijit_TitlePane_1")
    //                .click("#dijit_layout_ContentPane_6 span.drilldownResult")
    //                .pause(10000)
    //                .getText("#searchWidget_more_results div.moreItem").then(function (text) {
    //                    console.log(text);
    //                })
    //                .call(done);
    //        });

 
});