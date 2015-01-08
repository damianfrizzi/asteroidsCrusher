module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    name: 'app',
                    baseUrl: 'js/',
                    mainConfigFile: 'js/app.js',
                    out: 'js/built.js',
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    removeCombined: true
                }
            }
        },

        cssmin: {
            target: {
                files: {
                    'css/main.min.css': ['css/main.css']
                }
            }
        }
    });

    /* Load plugins */
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    /* What happens when we "grunt" the terminal */
    grunt.registerTask('default', ['requirejs', 'cssmin']);
};
