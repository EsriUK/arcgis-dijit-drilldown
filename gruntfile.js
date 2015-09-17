/*global grunt, module, require */

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
            options: { force: true },
            src: ["js/build/", "dist/"]
        },
        uglify: {
            locators: {
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['Locators/*.js'],
                    dest: 'build/'
                }]
            },
            widget: {
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['*.js'],
                    dest: 'dist/'
                }]
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            locators: {
                src: ['build/Locators/PickList.js', 'build/Locators/PickListItem.js', 'build/Locators/_LocatorBase.js', 'build/Locators/AGSLLPGLocator.js', 'build/Locators/LLPGLocator.js'],
                dest: 'dist/DrilldownLocators.js',
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
                    specs: './js/tests/spec/*.js',
                    helpers: ['./js/tests/helpers/*.js', './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-dojo'),
                    templateOptions: {
                        dojoConfig: {
                            async: true,
                            has: { 'native-xhr2': false },
                            paths: {
                                app: '/../js'
                            }
                        },
                        dojoFile: 'http://js.arcgis.com/3.14/'
                    }
                }
            },
            coverage: {
                src: ['js/*.js', 'js/Locators/*.js'],

                options: {
                    specs: ['./js/tests/spec/*.js'],
                    helpers: ['./js/tests/helpers/*.js', './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: 'coverage',
                        srcCopy: ['js/nls/Drilldown.js', 'js/nls/en-gb/Drilldown.js'],
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
                    specs: ['./js/tests/spec/*.js'],
                    helpers: ['./js/tests/helpers/*.js', './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: {
                            type: 'lcov',
                            options: {
                                dir: 'coverage/lcov'
                            }
                        },
                        srcCopy: ['js/nls/Drilldown.js', 'js/nls/en-gb/Drilldown.js'],
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

    // Add default task(s)
    grunt.registerTask('default', ['jasmine:test']);

    grunt.registerTask('cover', ['jasmine:coverage']);

    grunt.registerTask('build', ['clean', 'uglify:locators', 'uglify:widget', 'concat']);

    grunt.registerTask('travis', ['jasmine:coverageci']);
};








