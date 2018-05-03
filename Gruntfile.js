module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodemon: {
      dev: {
        script: "server.js",
        options: {
          ext: "js,html",
          watch: [
            "server.js",
            "config/**/*.js",
            "app/**/*.js"
          ]
        }
      }
    },
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
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask('default', ['nodemon', 'watch']);

};