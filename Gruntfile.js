module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-githooks');

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
	}
  });

  // Default task(s).
  // githooks - Binds grunt tasks to git hooks
  grunt.registerTask('default', ['githooks', 'uglify']);

};