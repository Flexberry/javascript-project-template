module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/*.js',
                dest: 'dest/build/<%= pkg.name %>.min.js'
            }
        },

        githooks: {
            all: {
                'pre-commit': 'test',
                options: {
                    hashbang: '#!/bin/sh',
                    template: 'githook.hb',
                    startMarker: '## LET THE FUN BEGIN',
                    endMarker: '## PARTY IS OVER',
                    preventExit: false
                }
            }
        },

        jshint: {
            files: ['src/*.js'],
            options: {
                jshintrc: true
            }
        },

        jslint: {
            all: {
                src: ['src/*.js'],
                options: {
                    errorsOnly: false,
                    failOnError: true
                },
                directives: {
                    white: false,
                    devel: true
                }
            }
        },
        
        clean: ['dest/', 'test/report/'],
        
        jsdoc : {
            dist : {
                src: ['src/*.js'], 
                options: {
                    configure: '.jsdocrc',
                    destination: 'dest'
                }
            }
        },
        
        'gh-pages': {
            options: {
              git: 'git'
            },
            publish: {
                options: {
                    base: 'dest',
                    branch: 'gh-pages',
                    message: 'auto publish',
                    add: false
				},
                src: ['**/*']
            },
            deploy: {
                options: {
                    base: 'dest',
                    branch: 'gh-pages',
                    message: 'auto deploy',
                    user: {
                        name: 'Flexberry',
                        email: 'mail@flexberry.net'
                    },
                    repo: 'https://' + process.env.GH_TOKEN + '@github.com/Flexberry/testproj.git',
                    silent: true
                },
                src: ['**/*']
            }
        },
        
        qunit: {
            options: {
                timeout: 30000,
                "--web-security": "no",
                coverage: {
                    src: "dest/build/<%= pkg.name %>.min.js",
                    instrumentedFiles: "test/report/temp/",
                    htmlReport: "test/report/coverage",
                    lcovReport: "test/report/lcov",
                    linesThresholdPct: 70
                }
            },
            all: ['test/**/*.html', '!test/report/**/*.html']
        },
        
        coveralls: {
            options: {
                force: true
            },
            all: {
                src: "test/report/lcov/lcov.info"
            }
        }        
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    grunt.loadNpmTasks('grunt-coveralls');

    // githooks - Binds grunt tasks to git hooks
    grunt.registerTask('default', ['githooks', 'uglify']);

    grunt.registerTask('test', ['jshint', 'jslint', 'clean', 'uglify', 'qunit']);

    grunt.registerTask('travis', ['jshint', 'jslint', 'clean', 'uglify', 'jsdoc', 'gh-pages:deploy', 'coveralls']);
    
    grunt.registerTask('docs', ['clean', 'jsdoc']);
};