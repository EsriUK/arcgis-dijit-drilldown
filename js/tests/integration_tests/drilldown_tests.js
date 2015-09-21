var assert = require('assert'),
    webdriverio = require('webdriverio'),
    helper = require('../helpers/test_helper');


browser.addCommand("login", helper.oAuthLogin.bind(browser));



describe('Drilldown tests: ' + helper.getBrowser(), function () {
    this.timeout(99999999);

    afterEach(function (done) {
        browser.call(done);
    });

    // PB 

    it('should open the drilldown test page', function (done) {
        // Load drilldown test site
        browser
            .url("http://appsstage.esriuk.com/app/Drilldown-demo/13/wmt/view/416bf5a4f02f45158a0a893c73450878/index.html")

            // Check the title
            .getTitle(function (err, title) {
                assert(err === undefined);
                assert(title === 'Drilldown Widget');
            })
            .call(done);
    });

});