/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/appModel',
    'models/aboutModel',
], function($, _, Backbone, AppModel, AboutModel) {

    'use strict';

    var View = Backbone.View.extend({
        initialize: function() {
            if (AppModel.get('debug')) {
                log('aboutView initialized');
            }
        }

    });

    return View;

});
