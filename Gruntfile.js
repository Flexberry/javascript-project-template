module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
	
	githooks: {
	  all: {
	    'pre-commit': 'jshint'
	  }
	},
	
	jshint: {
      files: ['src/*.js'],
      options: {
        camelcase: true,
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        }
      }
    }
  });

  // Default task(s).
  // githooks - Binds grunt tasks to git hooks
  grunt.registerTask('default', ['githooks', 'uglify']);

};