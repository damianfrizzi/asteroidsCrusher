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
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        }
    });

    /* Load plugins */
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');

    /* Setup grunt tasks */
    grunt.registerTask('default', ['requirejs', 'cssmin', 'imagemin']);
    grunt.registerTask('js', ['requirejs']);
    grunt.registerTask('img', ['newer:imagemin']);
};
