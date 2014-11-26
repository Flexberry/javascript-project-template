module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    // TODO: move getPackageAuthor to grunt-gh-pages and make pull request
    // (string support for gh-pages.options.user as defined in package.json specification).
    // Then delete this with the function.
    pkg.author = getPackageAuthor();

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        tmpDir: '.tmp/',

        buildName: '<%= pkg.name %>',
        buildDir: 'build/',
        buildFileNameNoExt: '<%= buildDir %><%= buildName %>',
        buildJsFilePath: '<%= buildFileNameNoExt %>.js',
        buildMinJsFilePath: '<%= buildFileNameNoExt %>.min.js',
        buildCssFilePath: '<%= buildFileNameNoExt %>.css',
        buildMinCssFilePath: '<%= buildFileNameNoExt %>.min.css',
        buildArchiveFilePath: '<%= tmpDir %>release/build.zip',
        buildMinArchiveFilePath: '<%= tmpDir %>release/build.min.zip',

        srcScriptDir: 'src/',
        srcStyleDir: 'styles/',
        srcScriptFilePaths: ['<%= srcScriptDir %>*.js'],
        srcStyleFilePaths: ['<%= srcStyleDir %>*.scss'],
        srcMainStyleFilePath: '<%= srcStyleDir %>main.scss',

        testDir: 'test/',
        testReportDir: '<%= testDir %>report/',
        testFilePaths: ['<%= testDir %>**/*.html', '!<%= testReportDir %>**/*.html'],
        testHtmlReportDir: '<%= testReportDir %>coverage/',
        testLcovReportDir: '<%= testReportDir %>lcov/',

        docsDir: 'docs/',
        teststandDir: 'teststand/',
        libDir: 'lib/',
        ghPagesPublishPaths: ['<%= buildDir %>**/*', '<%= docsDir %>**/*', '<%= teststandDir %>**/*',
            '<%= libDir %>**/*'],

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        repositoryShortPath: getRepositoryShortPath(),

        concat: {
            options: {
                banner: '<%= banner %>'
            },
            debug: {
                src: ['<%= srcScriptFilePaths %>'],
                dest: '<%= buildJsFilePath %>',
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'link',
                    stripBanners: false
                }
            },
            release: {
                src: ['<%= srcScriptFilePaths %>'],
                dest: '<%= buildJsFilePath %>',
                options: {
                    sourceMap: false,
                    stripBanners: true
                }
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            debug: {
                src: ['<%= srcScriptFilePaths %>'],
                dest: '<%= buildMinJsFilePath %>',
                options: {
                    sourceMap: true,
                    preserveComments: 'some'
                }
            },
            release: {
                src: ['<%= srcScriptFilePaths %>'],
                dest: '<%= buildMinJsFilePath %>',
                options: {
                    sourceMap: false,
                    preserveComments: 'some'
                }
            }
        },

        githooks: {
            all: {
                options: {
                    hashbang: '#!/bin/sh',
                    startMarker: '# GRUNT-GITHOOKS START',
                    endMarker: '# GRUNT-GITHOOKS END'
                },

                'pre-commit': {
                    command: 'grunt',
                    taskNames: 'check',
                    template: 'pre-commit-hook.hbs',
                    preventExit: false
                },

                'post-merge': {
                    template: 'post-merge-hook.hbs',
                    preventExit: true
                }
            }
        },

        lintspaces: {
            options: {
                editorconfig: '.editorconfig',
                showCodes: true,
                showTypes: true,
                showValid: true
            },
            gruntfile: {
                src: ['Gruntfile.js'],
                options: {
                    ignores: ['js-comments']
                }
            },
            scripts: {
                src: ['<%= srcScriptFilePaths %>'],
                options: {
                    ignores: ['js-comments']
                }
            },
            styles: {
                src: ['<%= srcStyleFilePaths %>'],
                options: {
                }
            },
            tests: {
                src: ['<%= testFilePaths %>'],
                options: {
                    ignores: ['html-comments']
                }
            },
            configs: {
                src: ['*.yml', '.*rc', '*-hook.hbs', '*.json'],
                options: {
                }
            }
        },

        jscs: {
            options: {
                config: true
            },

            /* Please, take into account https://github.com/tschaub/grunt-newer/issues/39.
               TODO: Remove this warning when the issue will be closed. */
            gruntfile: {
                src: ['Gruntfile.js']
            },
            scripts: {
                src: ['<%= srcScriptFilePaths %>']
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            /* Please, take into account https://github.com/tschaub/grunt-newer/issues/39.
             TODO: Remove this warning when the issue will be closed. */
            gruntfile: {
                src: ['Gruntfile.js']
            },
            scripts: {
                src: ['<%= srcScriptFilePaths %>']
            }
        },

        clean: {
            build: ['<%= buildDir %>'],
            docs: ['<%= docsDir %>'],
            tests: ['<%= testReportDir %>'],
            release: ['<%= buildArchiveFilePath %>', '<%= buildMinArchiveFilePath %>'],
            tmp: ['<%= tmpDir %>']
        },

        jsdoc: {
            dist: {
                src: ['<%= srcScriptFilePaths %>', 'README.md', 'package.json'],
                options: {
                    destination: '<%= docsDir %>',
                    configure: '.jsdocrc'
                }
            }
        },

        'gh-pages': {
            options: {
                git: 'git',
                clone: '<%= tmpDir %>gh-pages',
                branch: 'gh-pages',
                add: false,
                only: '<%= ghPagesPublishPaths %>'
            },
            publish: {
                options: {
                    message: 'auto publish'
                },
                src: ['<%= ghPagesPublishPaths %>']
            },
            deploy: {
                options: {
                    // Travis environment variables can be found here:
                    // https://github.com/travis-ci/travis-build/blob/master/lib/travis/build/data/env.rb
                    // https://github.com/travis-ci/travis-build/blob/master/spec/shared/script.rb
                    message: require('util').format('auto deploy\nReason: %s', process.env.TRAVIS_COMMIT || 'unknown'),
                    user: '<%= pkg.author %>',
                    repo: 'https://$GH_TOKEN@github.com/<%= repositoryShortPath %>.git'
                },
                src: ['<%= ghPagesPublishPaths %>']
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
                    archive: '<%= buildArchiveFilePath %>'
                },
                files: [
                    {
                        src: ['*.js', '*.css', '!*.min.js', '!*.min.css'],
                        dest: '',
                        expand: true,
                        cwd: '<%= buildDir %>'
                    }
                ]
            },

            'release-min': {
                options: {
                    archive: '<%= buildMinArchiveFilePath %>'
                },
                files: [
                    {
                        src: ['*.min.js', '*.min.css'],
                        dest: '',
                        expand: true,
                        cwd: '<%= buildDir %>'
                    }
                ]
            }
        },

        'github-release': {
            options: {
                repository: '<%= repositoryShortPath %>',
                auth: {
                    user: process.env.GH_TOKEN,
                    password: ''
                },
                release: {
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    // jshint camelcase:false
                    // If no specified then version field from package.json will be used.
                    tag_name: grunt.option('tag'),

                    // If no specified then tag_name will be used.
                    name: grunt.option('title'),

                    // Description of release. If no specified then last commit comment will be used.
                    body: grunt.option('desc'),

                    // true to create a draft (unpublished) release, false to create a published one.
                    draft: grunt.option('draft') || false,

                    // Pre-release label. If tag_name ends with 'rc' (release candidate), then true.
                    prerelease: grunt.option('prerelease') || /rc$/.test(grunt.option('tag')) || false
                }
            },
            files: {
                // Files that you want to attach to Release
                src: ['<%= buildArchiveFilePath %>', '<%= buildMinArchiveFilePath %>']
            }
        },

        sass: {
            debug: {
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
        },

        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            scripts: {
                files: ['<%= srcScriptFilePaths %>'],
                tasks: ['concat:debug', 'uglify:debug']
            },
            styles: {
                files: ['<%= srcStyleFilePaths %>'],
                tasks: ['sass:debug']
            }
        },

        bower: {
            options: {
                targetDir: '<%= libDir %>',
                layout: 'byComponent',
                packages: grunt.option('packages') ? grunt.option('packages').trim().split(' ') : undefined
            },
            cleanup: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    install: false,
                    copy: false
                }
            },
            install: {
                options: {
                    install: true,
                    copy: false,
                    prune: true
                }
            },
            refreshLib: {
                options: {
                    install: false,
                    copy: true
                }
            },
            removeLib: {
                options:{
                    copy: false,
                    install: false,
                    cleanBowerDir: false,
                    cleanTargetDir: true
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'test', 'docs']);

    grunt.registerTask('check', ['lintspaces', 'jscs', 'jshint']);
    grunt.registerTask('check-new', ['newer:lintspaces', 'newer:jscs', 'newer:jshint']);
    grunt.registerTask('test', ['check', 'clean:tests', 'build-debug', 'qunit']);

    grunt.registerTask('build', ['build-debug']);

    // build with MAP files
    grunt.registerTask('build-debug', ['clean:build', 'concat:debug', 'uglify:debug', 'sass:debug']);

    // build without MAP files
    grunt.registerTask('build-release', ['clean:build', 'concat:release', 'uglify:release', 'sass:release',
        'sass:release-min']);

    grunt.registerTask('docs', ['clean:docs', 'jsdoc']);

    /* Usage:    grunt release --tag=v1.0.0 --title="First release" --desc="Release description"
     * or:       grunt release --tag=v1.0.1rc (auto title and description)
     * or just:  grunt release (tag from package.json->version)
     *
     * NOTE: for github-release task you need GH_TOKEN environment variable.
     *       Put once in cmd: SET GH_TOKEN=<YOUR GITHUB TOKEN>
     */
    grunt.registerTask('release', ['release-local', 'github-release', 'clean:release']);
    grunt.registerTask('release-local', ['clean:release', 'build-release', 'compress:release', 'compress:release-min']);

    grunt.registerTask('publish', ['check', 'build-release', 'docs', 'gh-pages:publish']);

    grunt.registerTask('travis', 'Travis CI build task', function() {
        if (process.env.TRAVIS_REPO_SLUG === undefined && !grunt.option('pleaserun')) {
            throw new Error(
                'Task "travis" is not intended to execute in the environment other than Travis CI. ' +
                'Use --pleaserun to run anyway.'
            );
        }

        grunt.task.run(['check', 'build-release', 'bower:install', 'docs', 'gh-pages:deploy', 'qunit', 'coveralls']);
    });

    /* Usage:  grunt print-config --p=concat  (print out 'concat' property)
     * or:     grunt print-config             (print out all properties)
     */
    grunt.registerTask('print-config', 'Print out the grunt configuration', function() {
        var propertyName = grunt.option('p'),
            configObj = grunt.config(propertyName),
            configStr = JSON.stringify(configObj, null, 2);

        return configStr !== undefined ?
            grunt.log.oklns(configStr) :
            grunt.log.errorlns('Property "' + propertyName + '" is not defined.');
    });

    // TODO: move to a new npm module 'github-repo-urlhelper'. Also, refactor gh-pages.deploy.options.repo.
    function getRepositoryShortPath() {
        var url = pkg.repository && pkg.repository.url,
            found;
        if (!url) {
            throw new Error('Repository URL not found in package.json, please define it: ' +
                            'https://www.npmjs.org/doc/files/package.json.html#repository');
        }

        found = url.match(/.*github\.com[\/:]([^\.]*)(?:\.git)?/i);
        found = found && found[1];
        if (!found) {
            throw new Error('Failed to parse repository URL from package.json. ' +
                            'GitHub URL via HTTPS or SSH expected.');
        }

        return found;
    }

    function getPackageAuthor() {
        var author = pkg.author,
            type = typeof author,
            errMsg;

        switch (type) {
            case 'string':
                author = require('parse-author')(author);
                break;
            case 'object':
                break;
            case 'undefined':
                errMsg = 'Task "gh-pages:deploy" requires "author" in package.json.';
                throw new Error(errMsg);
            default:
                errMsg = 'Invalid type of "author" in package.json: ' + type + ' (string or object expected).';
                throw new TypeError(errMsg);
        }

        return author;
    }
};
