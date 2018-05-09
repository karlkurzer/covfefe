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
    },
    concurrent: {
      dev: {
        tasks: [["nodemon"], "watch"],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // Load the grunt plugins
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask('default', ['concurrent:dev']);

};