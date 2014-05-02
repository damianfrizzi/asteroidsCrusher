/*global define*/
define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    'use strict';

    var Model = Backbone.Model.extend({

        initialize: function() {
            if (this.get('debug')) {
                log('aboutModel initialized');
            }                        
        }
        
    });

    return new Model;
    
});
