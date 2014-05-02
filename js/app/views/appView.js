/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'models/appModel',
], function($, _, Backbone, AppModel) {

    'use strict';

    var View = Backbone.View.extend({
        initialize: function() {
            if (AppModel.get('debug')) {
                log('appView initialized');
            }
        }

    });

    return View;

});
