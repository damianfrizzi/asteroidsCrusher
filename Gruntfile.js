module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['js/*.js', 'scss/*.scss'],
        tasks: ['requirejs', 'sass'],
        options: {
          spawn: false,
          reload: true
        },
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'app',
          baseUrl: 'js/',
          mainConfigFile: 'js/app.js',
          out: 'js/built.js',
          preserveLicenseComments: false
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/main.css': 'scss/main.scss'
        }
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // What happens when we "grunt" the terminal
  grunt.registerTask('default', ['requirejs', 'sass']);

};
