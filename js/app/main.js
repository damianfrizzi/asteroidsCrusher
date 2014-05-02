'use strict';

// Don't change the name of projectPaths as it's used in the build.js process
var projectPaths = {
    "jquery": ["http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min", "../vendor/jquery/dist/jquery.min"],
    "backbone": "../vendor/backbone/backbone",
    "underscore": "../vendor/underscore/underscore",
}

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    },
    paths: projectPaths
});

require([
    'backbone',
    'views/appView',
    'routers/router'
], function(Backbone, AppView, AppRouter) {

    new AppRouter();
    Backbone.history.start();


});