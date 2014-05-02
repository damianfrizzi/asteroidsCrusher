/*global define*/
define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    'use strict';

    var Model = Backbone.Model.extend({
        defaults: {
            debug: true
        },

        initialize: function() {
            this.consoleShortcut();

            if (this.get('debug')) {
                log('appModel initialized');
            }                        
        },
        
        consoleShortcut: function() {
            window.log = function(test) {
                console.log(test);
            };
        }
    });

    return new Model;
    
});
