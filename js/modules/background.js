/* ------------------------------------------------------------------------------
background.js

Setup and draw background
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
            bg = G.game.options.BACKGROUND_IMAGE || 1;

            G.game.Background = G.game.add.group();

            G.game.background = G.game.Background.create(0, 0, 'background' + bg);
            G.game.backgroundOverlay = G.game.add.tileSprite(0, 0, G.game.width, G.game.height * 10, 'background' + bg + '_overlay');
            G.game.Background.add(G.game.backgroundOverlay);

            G.game.backgroundPlanet1 = G.game.add.sprite(800, 550, 'background' + bg + '_planet_1');
            G.game.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.game.Background.add(G.game.backgroundPlanet1);

            if (bg !== 3) {
                G.game.backgroundPlanet1.x = 200;
                G.game.backgroundPlanet1.y = 350;
                G.game.backgroundPlanet2 = G.game.add.sprite(G.game.width - 200, G.game.height - 200, 'background' + bg + '_planet_2');
                G.game.backgroundPlanet2.anchor.setTo(0.5, 0.5);
                G.game.Background.add(G.game.backgroundPlanet2);
            }

            $(document).on('update', this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            /* Rotate and reposition first planet */
            G.game.backgroundPlanet1.y -= 0.07;
            G.game.backgroundOverlay.y -= 0.5;

            if (bg !== 3) {
                /* Rotate and reposition second planet */
                G.game.backgroundPlanet2.y -= 0.16;
                G.game.backgroundPlanet2.rotation += 0.001;

                if (G.game.backgroundPlanet2.y < -G.game.backgroundPlanet2.height / 2) {
                    G.game.backgroundPlanet2.y = G.game.height + G.game.backgroundPlanet2.height;
                }
            }
        }
    };

    return Background;

});
