
/**
* A set of useful commands for use with tests.
*/

module.exports = {
    oAuthLogin: function (username, password, cb) {
        this.setValue('#user_username', username)
        .setValue('#user_password', password)
        .click("#signIn", function (err, result) {
            cb(err, result);
        });
    },

    getBrowser: function () {
        if (browser && browser.desiredCapabilities) {
            return browser.desiredCapabilities.browserName;
        }
        return "Browser name not found";
    },

    getJobId: function () {
        return browser.requestHandler.sessionID;
    }
};