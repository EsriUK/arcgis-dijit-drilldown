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
        cssmin: {
            style: {
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['resources/*.css'],
                    dest: 'build/'
                }]
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
                src: [
                    'build/Locators/PickListItem.js',
                    'build/Locators/PickList.js',
                    'build/Locators/_LocatorBase.js',
                    'build/Locators/AGSLLPGLocator.js',
                    'build/Locators/LLPGLocator.js',
                    'build/Locators/ABXLocator.js',
                    'build/Locators/GMSLocator.js',
                    'build/Locators/OSGLocator.js',
                    'build/Drilldown.js'
                ],
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
            },
            css: {
                src: ['build/resources/Drilldown.css'],
                dest: 'dist/Drilldown.min.css'
            }
        },
        debug: {
            options: {
                open: true // do not open node-inspector in Chrome automatically
            }
        },
        jasmine: {
            testJSAPI14: {
                options: {
                    version: '2.2.0',
                    specs: './js/tests/unit_tests/spec/*.js',
                    helpers: [
                        './js/tests/helpers/agsllpgResults.js',
                        './js/tests/helpers/llpgLargeList.js',
                        './js/tests/helpers/llpgResults.js',
                        './js/tests/helpers/orgTestResults.js',
                        './js/tests/helpers/gmsResults.js',
                        './js/tests/helpers/abxResults.js',
                        './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-dojo'),
                    templateOptions: {
                        dojoConfig: {
                            async: true,
                            has: { 'native-xhr2': false },
                            paths: {
                                app: '/../js'
                            }
                        },
                        dojoFile: 'http://js.arcgis.com/3.14/init.js'
                    }
                }
            },
            testJSAPI15: {
                options: {
                    version: '2.2.0',
                    specs: './js/tests/unit_tests/spec/*.js',
                    helpers: [
                        './js/tests/helpers/agsllpgResults.js',
                        './js/tests/helpers/llpgLargeList.js',
                        './js/tests/helpers/llpgResults.js',
                        './js/tests/helpers/orgTestResults.js',
                        './js/tests/helpers/gmsResults.js',
                        './js/tests/helpers/abxResults.js',
                        './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-dojo'),
                    templateOptions: {
                        dojoConfig: {
                            async: true,
                            has: { 'native-xhr2': false },
                            paths: {
                                app: '/../js'
                            }
                        },
                        dojoFile: 'http://js.arcgis.com/3.15/init.js'
                    }
                }
            },
            testJSAPI16: {
                options: {
                    version: '2.2.0',
                    specs: './js/tests/unit_tests/spec/*.js',
                    helpers: [
                        './js/tests/helpers/agsllpgResults.js',
                        './js/tests/helpers/llpgLargeList.js',
                        './js/tests/helpers/llpgResults.js',
                        './js/tests/helpers/orgTestResults.js',
                        './js/tests/helpers/gmsResults.js',
                        './js/tests/helpers/abxResults.js',
                        './js/tests/lib/sinon/sinon.js'],
                    template: require('grunt-template-jasmine-dojo'),
                    templateOptions: {
                        dojoConfig: {
                            async: true,
                            has: { 'native-xhr2': false },
                            paths: {
                                app: '/../js'
                            }
                        },
                        dojoFile: 'http://js.arcgis.com/3.16/init.js'
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
                        './js/tests/helpers/orgTestResults.js',
                        './js/tests/helpers/gmsResults.js',
                        './js/tests/helpers/abxResults.js',
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
                            dojoFile: 'http://js.arcgis.com/3.14/init.js'
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
                        './js/tests/helpers/gmsResults.js',
                        './js/tests/helpers/abxResults.js',
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
                            dojoFile: 'http://js.arcgis.com/3.14/init.js'
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
        },
        bom: {
            outputfile: {
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['**/*.js'],
                    dest: 'js/'
                }]
            }
        }
    };


    grunt.registerMultiTask('bom', 'byte order mark remove files.', function () {
        grunt.log.writeln("Run BOM task");
        var options = this.options();
        grunt.verbose.writeflags(options, 'Options');

        this.files.forEach(function (file) {
            var bom;
            var max = file.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            })
                .map(grunt.file.read)
                .join(grunt.util.normalizelf(grunt.util.linefeed));

            try {
                bom = max.replace(/^\uFEFF/, '');

            } catch (err) {
                grunt.warn(file.src + '\n' + err);
            }

            if (bom.length < 1) {
                grunt.log.warn('Destination not written because BOM file was empty.');
            } else {
                grunt.file.write(file.dest, bom);
                grunt.log.writeln('File ' + file.dest + ' created.');
            }
        });
    });

    // Project configuration.
    grunt.initConfig(gruntconfig);

    // Load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-webdriver');
    

    // Add default task(s)
    grunt.registerTask('default', ['jasmine:testJSAPI14', 'jasmine:testJSAPI15', 'jasmine:testJSAPI16']);

    grunt.registerTask('test', ['jasmine:testJSAPI14', 'jasmine:testJSAPI15', 'jasmine:testJSAPI16']);

    grunt.registerTask('cover', ['jasmine:coverage']);

    grunt.registerTask('build', ['clean:pre', 'bom:outputfile', 'uglify', 'cssmin', 'concat', 'clean:post']);

    grunt.registerTask('travis', ['clean:pre', 'uglify', 'cssmin', 'concat', 'clean:post', 'jasmine:coverageci']);
};








