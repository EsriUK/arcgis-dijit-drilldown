/*global grunt, module, require */
var fs = require('fs'),
    path = require('path'),
    Zip = require('adm-zip');

module.exports = function (grunt) {

    var gruntconfig = {
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            pre: {
                options: { force: true },
                src: ["build/", "dist/"]
            },
            post: {
                options: { force: true },
                src: ["dist/Drilldown.js"]
            }
        },
        uglify: {
            locators: {
                options: {
                    compress: true,
                    mangle: true,
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['Locators/*.js'],
                    dest: 'build/'
                }]
            },
            widget: {
                options: {
                    compress: true,
                    mangle: true,
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['*.js'],
                    dest: 'build/'
                }]
            }
        },
        concat: {
            dist: {
                options: {
                    separator: ',',
                    process: function (src, filepath) {
                        return '"esriuk/dijit/' + filepath.replace(".js", "").replace("build/", "") + '": function () {' + src + '}';
                    }
                },
                src: ['build/Locators/PickListItem.js', 'build/Locators/PickList.js', 'build/Locators/_LocatorBase.js', 'build/Locators/AGSLLPGLocator.js', 'build/Locators/LLPGLocator.js', 'build/Drilldown.js'],
                dest: 'dist/Drilldown.js' 
            },
            final: {
                options: {
                    process: function (src, filepath) {
                        return 'require({ cache: { '+ src +' } });';
                    }
                },
                src: ['dist/Drilldown.js'],
                dest: 'dist/Drilldown.min.js'
            }
        },
        debug: {
            options: {
                open: true // do not open node-inspector in Chrome automatically
            }
        },
        jasmine: {
            test: {
                options: {
                    specs: './js/tests/unit_tests/spec/*.js',
                    helpers: ['./js/tests/helpers/*.js', './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-dojo'),
                    templateOptions: {
                        dojoConfig: {
                            async: true,
                            has: { 'native-xhr2': false },
                            paths: {
                                app: '/../../js'
                            }
                        },
                        dojoFile: 'http://js.arcgis.com/3.14/'
                    }
                }
            },
            coverage: {
                src: ['js/*.js', 'js/Locators/*.js'],

                options: {
                    specs: ['./js/tests/unit_tests/spec/*.js'],
                    helpers: [
                        './js/tests/helpers/agsllpgResults.js',
                        './js/tests/helpers/llpgLargeList.js',
                        './js/tests/helpers/llpgResults.js',
                        './js/tests/lib/sinon/sinon.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: 'coverage',
                        template: require('grunt-template-jasmine-dojo'),
                        templateOptions: {
                            dojoConfig: {
                                async: true,
                                has: { 'native-xhr2': false },
                                paths: {
                                    app: '/../.grunt/grunt-contrib-jasmine/js'
                                }
                            },
                            dojoFile: 'http://js.arcgis.com/3.14/'
                        }
                    }
                }
            },
            coverageci: {
                src: ['js/*.js', 'js/Locators/*.js'],

                options: {
                    specs: ['./js/tests/unit_tests/spec/*.js'],
                    helpers: [
                        './js/tests/helpers/agsllpgResults.js',
                        './js/tests/helpers/llpgLargeList.js',
                        './js/tests/helpers/llpgResults.js',
                        './js/tests/lib/sinon/sinon.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: {
                            type: 'lcov',
                            options: {
                                dir: 'coverage/lcov'
                            }
                        },
                        template: require('grunt-template-jasmine-dojo'),
                        templateOptions: {
                            dojoConfig: {
                                async: true,
                                has: { 'native-xhr2': false },
                                paths: {
                                    app: '/../.grunt/grunt-contrib-jasmine/js'
                                }
                            },
                            dojoFile: 'http://js.arcgis.com/3.14/'
                        }
                    }
                }
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/lcov/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: true
            },
            dijit_coverage: {
                src: 'coverage/lcov/lcov.info'
            }
        },
        webdriver: {
            options: {
                host: 'ondemand.saucelabs.com',
                port: 80,
                user: 'danbatsb',
                key: 'fbaa5a4c-de4f-4969-8119-14eafd496572',
                updateSauceJob: true
            },
            testconfig: {
                configFile: "js/tests/integration_tests/wdio.conf.js"
            }
        }
    };


    // Project configuration.
    grunt.initConfig(gruntconfig);

    // Load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webdriver');
 

    // Add default task(s)
    grunt.registerTask('default', ['jasmine:test']);

    grunt.registerTask('cover', ['jasmine:coverage']);

    grunt.registerTask('build', ['clean:pre', 'uglify', 'concat', 'clean:post']);

    grunt.registerTask('travis', ['jasmine:coverageci', 'clean:pre', 'uglify', 'concat', 'clean:post']);
};








