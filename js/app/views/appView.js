/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/appModel',
    'views/homeView'
], function($, _, Backbone, AppModel, HomeView) {

    'use strict';

    var View = Backbone.View.extend({
        el: '#wrapper',

        model: AppModel,

        initialize: function() {
            this.render();
        },

        render: function() {
            new HomeView({
                el: this.el
            });
        }
    });

    return View;

});
