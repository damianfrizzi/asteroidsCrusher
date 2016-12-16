/* ------------------------------------------------------------------------------
background.js
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var G, bg, Background = function(obj) {
        G = obj.game;

        this.init();
    };

    Background.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            G.Background = G.add.group();

            G.level.positionBackground && G.level.positionBackground();

            $(document).on('update', this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.level.updateBackground && G.level.updateBackground();
        }
    };

    return Background;

});