/*global define*/
define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function() {
            this.consoleShortcut();                       
        },
        
        consoleShortcut: function() {
            window.log = function(test) {
                console.log(test);
            };
        }
    });

    return new Model;
    
});
