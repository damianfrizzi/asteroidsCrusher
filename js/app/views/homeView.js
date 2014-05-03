/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.html'
], function($, _, Backbone, HomeTemplate) {

    'use strict';

    var View = Backbone.View.extend({
        template: _.template(HomeTemplate),

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template);
        }
    });

    return View;

});
