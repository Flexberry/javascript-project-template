module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['src/*.js'],
                dest: 'dest/build/<%= pkg.name %>.js'
            }
        },
  
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['src/*.js'],
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
        
        clean: {
            dest: ['dest/build/', 'dest/docs/'],
            tests: ['test/report/'],
            release: ['build.zip', 'build.min.zip']
        },
        
        jsdoc : {
            dist : {
                src: ['src/*.js'], 
                options: {
                    configure: '.jsdocrc',
                    destination: 'dest/docs'
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
                    add: true
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
                    silent: true,
                    add: true
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
        },
        
        compress: {
            release: {
                options: {
                    archive: 'build.zip'
                },
                files: [
                    { src: ['*.js', '*.css', '!*.min.js', '!*.min.css'], dest: '', expand: true, cwd: 'dest/build/' }
                ]
            },
            
            "release-min": {
                options: {
                    archive: 'build.min.zip'
                },
                files: [
                    { src: ['*.min.js', '*.min.css'], dest: '', expand: true, cwd: 'dest/build/' }
                ]
            }
        },
        
        "github-release": {
            options: {
                repository: 'Flexberry/testproj',
                auth: {
                    user: process.env.GH_TOKEN,
                    password: ''
                },
                release: {
                    tag_name: grunt.option('tag'), // If no specified then version field from package.json will be used.
                    name: grunt.option('title'), // If no specified then tag_name will be used.
                    body: grunt.option('desc'), // Description of release. If no specified then last commit comment will be used.
                    draft: grunt.option('draft') || false, 
                    prerelease: grunt.option('prerelease') || /rc$/.test(grunt.option('tag')) || false // Pre-release label. If tag_name ends with 'rc' (release candidate), then true.
                }
            },
            files: {
                src: ['build.zip', 'build.min.zip'] // Files that you want to attach to Release
            }
        },
        
        sass: {
            dist: {
                options: {
                    noCache: true,
                    sourcemap: 'auto',
                    style: 'expanded'
                },
                files: {
                    'dest/build/<%= pkg.name %>.css': 'styles/main.scss'
                }
            },
            
            release: {
                options: {
                    noCache: true,
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: {
                    'dest/build/<%= pkg.name %>.css': 'styles/main.scss'
                }
            },
            
            "release-min": {
                options: {
                    noCache: true,
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    'dest/build/<%= pkg.name %>.min.css': 'styles/main.scss'
                }
            }
        }
    });
    
    // githooks - Binds grunt tasks to git hooks
    grunt.registerTask('default', ['githooks', 'concat', 'uglify', 'sass:dist']);

    grunt.registerTask('test', ['jshint', 'jslint', 'clean', 'concat', 'uglify', 'sass:dist', 'qunit']);

    grunt.registerTask('travis', ['jshint', 'jslint', 'clean', 'concat', 'uglify', 'sass:release', 'sass:release-min', 'jsdoc', 'gh-pages:deploy', 'qunit', 'coveralls']);
    
    grunt.registerTask('docs', ['clean', 'jsdoc']);
    
    // Usage:    grunt release --tag=v1.0.0 --title="First release" --desc="Release description"
    // or:       grunt release --tag=v1.0.1rc (auto title and description)
    // or just:  grunt release (tag from package.json->version) 
    // NOTE: for github-release task you need GH_TOKEN environment variable. Put once in cmd: SET GH_TOKEN=<YOUR GITHUB TOKEN>
    grunt.registerTask('release', ['clean:dest', 'concat', 'uglify', 'sass:release', 'sass:release-min', 'compress:release', 'compress:release-min', 'github-release', 'clean:release']);
    
    grunt.registerTask('mycustomtask', 'My custom task.', function() {
        // http://gruntjs.com/creating-tasks#custom-tasks
        grunt.log.writeln('Currently running my custom task.');
        
        // grunt.task.run('bar', 'baz');
        // Or:
        // grunt.task.run(['bar', 'baz']);
        
        // Use task args (http://gruntjs.com/api/grunt.option):
        // grunt mycustomtask --opt
        // grunt.option('opt')
    });
};