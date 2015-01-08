/* ------------------------------------------------------------------------------
background.js
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var G, bg, Background = function(obj) {
        G = obj;

        this.init();
    };

    Background.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            G.game.Background = G.game.add.group();

            G.game.level.positionBackground && G.game.level.positionBackground();

            $(document).on('update', this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.game.level.updateBackground && G.game.level.updateBackground();
        }
    };

    return Background;

});
