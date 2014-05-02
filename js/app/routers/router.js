/*global define*/
define([
    'jquery',
    'backbone',
    'models/appModel',
    'views/aboutView'
], function($, Backbone, AppModel, AboutView) {

    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*actions': 'defaultRoute',
            'about': 'showAbout'
        },
        initialize: function() {
            if (AppModel.get('debug')) {
                log('Router initiliazed');
            }
        },
        showAbout: function(param) {
            log('about: '+param);
        }
    });

    return new AppRouter;

});
