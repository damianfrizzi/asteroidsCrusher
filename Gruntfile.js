module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    name: 'app',
                    baseUrl: 'js/',
                    mainConfigFile: 'js/app.js',
                    out: 'dist/built.js',
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    removeCombined: true
                }
            }
        },

        cssmin: {
            target: {
                files: {
                    'dist/main.min.css': ['css/main.css']
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/images/' // Destination path prefix
                }]
            }
        }
    });

    /* Load plugins */
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    /* What happens when we "grunt" the terminal */
    grunt.registerTask('default', ['requirejs', 'cssmin', 'imagemin']);
};
