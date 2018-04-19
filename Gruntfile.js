module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      css: {
        files: ['public/assets/css/custom.css'],
        options: {
          livereload: true
        }
      }
    }
  });

  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};