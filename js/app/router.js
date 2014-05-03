/*global define*/
define([
    'jquery',
    'backbone'
], function($, Backbone, AppModel) {

    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*actions': 'defaultRout'
        },

        defaultRout: function() {
            log('Routed');
        }
    });

    return AppRouter;

});
