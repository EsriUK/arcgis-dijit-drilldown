exports.config = {

	//
	// =================
	// Service Providers
	// =================
	// WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
	// should work too though). These services define specific user and key (or access key)
	// values you need to put in here in order to connect to these services.
	//
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY,

	//
	// If you are using Sauce Labs, WebdriverIO takes care to update the job information
	// once the test is done. This option is set to `true` by default.
	//
	updateJob: true, // will get overwritten
    throttled: 1,

	//
	// ==================
	// Specify Test Files
	// ==================
	// Define which test specs should run. The pattern is relative to the directory
	// from which `wdio` was called. Notice that, if you are calling `wdio` from an
	// NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
	// directory is where your package.json resides, so `wdio` will be called from there.
	//
	specs: [
        './js/tests/integration_tests/abx_tests.js'
	],
	// Patterns to exclude.
	exclude: [
        // 'path/to/excluded/files'
	],
	//
	// ============
	// Capabilities
	// ============
	// Define your capabilities here. WebdriverIO can run multiple capabilties at the same
	// time. Depending on the number of capabilities, WebdriverIO launches several test
	// sessions. Within your capabilities you can overwrite the spec and exclude option in
	// order to group specific specs to a specific capability.
	//
	// If you have trouble getting all important capabilities together, check out the
	// Sauce Labs platform configurator - a great tool to configure your capabilities:
	// https://docs.saucelabs.com/reference/platforms-configurator
	//
	capabilities: [{
	    browserName: 'chrome',
	    platform: "Windows 7",
	    name: "Drilldown - Chrome",
	    tags: ["Drilldown", "Chrome"],
	    build: process.env.TRAVIS_BUILD_NUMBER
        //throttled: 1
	}, {
	    browserName: 'firefox',
	    platform: "Windows 7",
	    name: "Drilldown - Firefox",
	    tags: ["Drilldown", "Firefox"],
	    build: process.env.TRAVIS_BUILD_NUMBER
	},{
	    browserName: 'internet explorer',
	    version: "9.0",
	    platform: "Windows 7",
	    name: "Drilldown - Explorer9",
	    tags: ["Drilldown", "Explorer9"],
	    build: process.env.TRAVIS_BUILD_NUMBER
	}, {
	    browserName: 'internet explorer',
	    version: "10.0",
	    platform: "Windows 7",
	    name: "Drilldown - Explorer10",
	    tags: ["Drilldown", "Explorer10"],
	    build: process.env.TRAVIS_BUILD_NUMBER
	}, {
	    browserName: 'internet explorer',
	    version: "11.0",
	    platform: "Windows 7",
	    name: "Drilldown - Explorer11",
	    tags: ["Drilldown", "Explorer11"],
	    build: process.env.TRAVIS_BUILD_NUMBER
	},{
	    browserName: 'safari',
	    platform: "OS",
	    deviceName: "iPhone 5",
	    deviceOrientation: "portait",
	    name: "Drilldown - iPhone5",
	    tags: ["Drilldown", "iPhone5"],
	    build: process.env.TRAVIS_BUILD_NUMBER
	},{
	    browserName: 'safari',
        platformName: "iOS",
        deviceName: "iPad Retina",
        deviceOrientation: "portait",
        name: "Drilldown - iPad",
        tags: ["Drilldown", "iPad"],
        build: process.env.TRAVIS_BUILD_NUMBER
    },{
	    browserName: 'chrome',
	    platform: "Linux",
        name: "Drilldown - ChromeAndroid",
        tags: ["Drilldown", "ChromeAndroid"],
        build: process.env.TRAVIS_BUILD_NUMBER
    //},{
	    //browserName: 'MicrosoftEdge',
        //platform: "Windows 10",
        //name: "Drilldown - Windows10Edge",
        //tags: ["Drilldown", "Windows10Edge"],
        //build: process.env.TRAVIS_BUILD_NUMBER
	},
	],
		
	//
	// ===================
	// Test Configurations
	// ===================
	// Define all options that are relevant for the WebdriverIO instance here
	//
	// Level of logging verbosity.
	logLevel: 'error',
	//
	// Enables colors for log output.
	coloredLogs: true,
	//
	// Saves a screenshot to a given path if a command fails.
	screenshotPath: './',
	//
	// Set a base URL in order to shorten url command calls. If your url parameter starts
	// with "/", the base url gets prepended.
	baseUrl: 'http://webdriverjs.christian-bromann.com',
	//
	// Default timeout for all waitForXXX commands.
	waitforTimeout: 10000,
	//
	// Initialize the browser instance with a WebdriverIO plugin. The object should have the
	// plugin name as key and the desired plugin options as property. Make sure you have
	// the plugin installed before running any tests. The following plugins are currently
	// available:
	// WebdriverCSS: https://github.com/webdriverio/webdrivercss
	// WebdriverRTC: https://github.com/webdriverio/webdriverrtc
	// Browserevent: https://github.com/webdriverio/browserevent
	// plugins: {
	//     webdrivercss: {
	//         screenshotRoot: 'my-shots',
	//         failedComparisonsRoot: 'diffs',
	//         misMatchTolerance: 0.05,
	//         screenWidth: [320,480,640,1024]
	//     },
	//     webdriverrtc: {},
	//     browserevent: {}
	// },
	//
	// Framework you want to run your specs with.
	// The following are supported: mocha, jasmine and cucumber
	// see also: http://webdriver.io/guide/testrunner/frameworks.html
	//
	// Make sure you have the node package for the specific framework installed before running
	// any tests. If not please install the following package:
	// Mocha: `$ npm install mocha`
	// Jasmine: `$ npm install jasmine`
	// Cucumber: `$ npm install cucumber`
	framework: 'mocha', // gets overwritten in gruntfile
	//
	// Test reporter for stdout.
	// The following are supported: dot (default), spec and xunit
	// see also: http://webdriver.io/guide/testrunner/reporters.html
	reporter: 'spec',

	//
	// Options to be passed to Mocha.
	// See the full list at http://mochajs.org/
	mochaOpts: {
		ui: 'bdd'
	},

	//
	// =====
	// Hooks
	// =====
	// Run functions before or after the test. If one of them returns with a promise, WebdriverIO
	// will wait until that promise got resolved to continue.
	// see also: http://webdriver.io/guide/testrunner/hooks.html
	//
	// Gets executed before all workers get launched.
	onPrepare: function () {
		// do something
	},
	//
	// Gets executed before test execution begins. At this point you will have access to all global
	// variables like `browser`. It is the perfect place to define custom commands.
	before: function () {
		// do something
	},
	//
	// Gets executed after all tests are done. You still have access to all global variables from
	// the test.
	after: function () {
		// mark travis job as passed
		var options = {
			headers: { 'Content-Type': 'text/json' },
			url: 'http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@saucelabs.com/rest/v1/' + process.env.SAUCE_USERNAME + '/jobs/' + client.requestHandler.sessionID,
			method: 'PUT',
			body: JSON.stringify({
				passed: true,
				public: true
			})
		};

		request(options, function (err) {
			if (err) {
				client.end(function () {
					done(err);
				});
				return false;
			}

			client.end(done);

		});
	},
	//
	// Gets executed after all workers got shut down and the process is about to exit. It is not
	// possible to defer the end of the process using a promise.
	onComplete: function () {
		// do something
	}
};