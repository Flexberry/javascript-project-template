module.exports = function(grunt) {

    var util = require('util');

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        buildName: '<%= pkg.name %>',
        buildDir: 'dest/build/',
        buildFileNameNoExt: '<%= buildDir %><%= buildName %>',
        buildJsFilePath: '<%= buildFileNameNoExt %>.js',
        buildMinJsFilePath: '<%= buildFileNameNoExt %>.min.js',
        buildCssFilePath: '<%= buildFileNameNoExt %>.css',
        buildMinCssFilePath: '<%= buildFileNameNoExt %>.min.css',
        buildArchiveFileName: 'build.zip',
        buildMinArchiveFileName: 'build.min.zip',

        srcDir: 'src/',
        srcFilePaths: ['<%= srcDir %>*.js'],
        srcMainStyleFilePath: 'styles/main.scss',

        testDir: 'test/',
        testReportDir: '<%= testDir %>report/',
        testFilePaths: ['<%= testDir %>**/*.html', '!<%= testReportDir %>**/*.html'],
        testHtmlReportDir: '<%= testReportDir %>coverage/',
        testLcovReportDir: '<%= testReportDir %>lcov/',

        docsDir: 'dest/docs/',

        banner: '/*! <%= buildName %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',

        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '<%= banner %>'
            },
            build: {
                src: ['<%= srcFilePaths %>'],
                dest: '<%= buildJsFilePath %>'
            }
        },
  
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '<%= banner %>'
            },
            build: {
                src: ['<%= srcFilePaths %>'],
                dest: '<%= buildMinJsFilePath %>'
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
            files: ['<%= srcFilePaths %>'],
            options: {
                jshintrc: true
            }
        },

        jslint: {
            all: {
                src: ['<%= srcFilePaths %>'],
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
            dest: ['<%= buildDir %>', '<%= docsDir %>'],
            tests: ['<%= testReportDir %>'],
            release: ['<%= buildArchiveFileName %>', '<%= buildMinArchiveFileName %>']
        },
        
        jsdoc : {
            dist : {
                src: ['<%= srcFilePaths %>'],
                options: {
                    configure: '.jsdocrc',
                    destination: '<%= docsDir %>'
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

                    // Travis environment variables можно посмотреть здесь:
                    // https://github.com/travis-ci/travis-build/blob/master/lib/travis/build/data/env.rb
                    // https://github.com/travis-ci/travis-build/blob/master/spec/shared/script.rb
                    message: util.format('auto deploy\nReason: %s', process.env.TRAVIS_COMMIT || 'unknown'),
                    
                    user: {
                        name: 'Flexberry',
                        email: 'mail@flexberry.net'
                    },
                    repo: 'https://' + process.env.GH_TOKEN + '@github.com/Flexberry/testproj.git',
                    silent: true, // скрыть лог задачи, иначе github-токен будет выведен в логе билда Travis CI.
                    add: true
                },
                src: ['**/*']
            }
        },
        
        qunit: {
            options: {
                timeout: 30000,
                '--web-security': 'no',
                coverage: {
                    src: '<%= buildMinJsFilePath %>',
                    instrumentedFiles: '<%= testReportDir %>temp/',
                    htmlReport: '<%= testHtmlReportDir %>',
                    lcovReport: '<%= testLcovReportDir %>',
                    linesThresholdPct: 70
                }
            },
            all: ['<%= testFilePaths %>']
        },
        
        coveralls: {
            options: {
                force: true
            },
            all: {
                src: '<%= testLcovReportDir %>lcov.info'
            }
        },
        
        compress: {
            release: {
                options: {
                    archive: '<%= buildArchiveFileName %>'
                },
                files: [
                    { src: ['*.js', '*.css', '!*.min.js', '!*.min.css'], dest: '', expand: true, cwd: '<%= buildDir %>' }
                ]
            },
            
            'release-min': {
                options: {
                    archive: '<%= buildMinArchiveFileName %>'
                },
                files: [
                    { src: ['*.min.js', '*.min.css'], dest: '', expand: true, cwd: '<%= buildDir %>' }
                ]
            }
        },
        
        'github-release': {
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
                src: ['<%= buildArchiveFileName %>', '<%= buildMinArchiveFileName %>'] // Files that you want to attach to Release
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
                    '<%= buildCssFilePath %>': '<%= srcMainStyleFilePath %>'
                }
            },
            
            release: {
                options: {
                    noCache: true,
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: {
                    '<%=buildCssFilePath %>': '<%= srcMainStyleFilePath %>'
                }
            },
            
            'release-min': {
                options: {
                    noCache: true,
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    '<%= buildMinCssFilePath %>': '<%= srcMainStyleFilePath %>'
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