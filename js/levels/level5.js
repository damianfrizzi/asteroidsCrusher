/* ------------------------------------------------------------------------------
level5.js
--------------------------------------------------------------------------------- */

var level5Loaded = false;

define(function() {

    'use strict';

    var G, Level = function(obj) {
        G = obj;

        this.init();
    };

    Level.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            this.LEVEL_INDEX = 5;
            this.WEAPON = 'bullet';
            this.FUEL_DURATION = 55000;
            this.DIFFICULTY_CHANGE_TIME = 15000;
            this.LEVEL_DURATION = 90000;
            this.POWERUPS_DELAY = 5000;
            this.NUMBER_OF_POWERUPS = 8;
            this.ENEMY_MIN_SPEED = 50;
            this.ENEMY_MAX_SPEED = 80;
            this.ENEMY_DELAY = 800;
            this.NUMBER_OF_ENEMIES = 30;
            this.BACKGROUND_IMAGE = 2;
        },

        preload: function() {
            if(!level5Loaded) {
                G.game.load.image('background2', 'dist/images/backgrounds/background_02_parallax_01.png');
                G.game.load.image('background2_overlay', 'dist/images/backgrounds/background_02_parallax_02.png');
                G.game.load.image('background2_planet_1', 'dist/images/backgrounds/background_02_parallax_03.png');
                G.game.load.image('background2_planet_2', 'dist/images/backgrounds/background_02_parallax_04.png');

                level5Loaded = true;
            }
        },

        positionBackground: function() {
            G.game.background = G.game.Background.create(0, 0, 'background' + this.BACKGROUND_IMAGE);
            G.game.backgroundOverlay = G.game.add.tileSprite(0, 0, G.game.width, G.game.height * 10, 'background' + this.BACKGROUND_IMAGE + '_overlay');
            G.game.Background.add(G.game.backgroundOverlay);

            G.game.backgroundPlanet1 = G.game.add.sprite(200, 350, 'background' + this.BACKGROUND_IMAGE + '_planet_1');
            G.game.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.game.Background.add(G.game.backgroundPlanet1);

            G.game.backgroundPlanet2 = G.game.add.sprite(G.game.width - 200, G.game.height - 200, 'background' + this.BACKGROUND_IMAGE + '_planet_2');
            G.game.backgroundPlanet2.anchor.setTo(0.5, 0.5);
            G.game.Background.add(G.game.backgroundPlanet2);
        },

        updateBackground: function() {
            /* Rotate and reposition first planet */
            G.game.backgroundPlanet1.y -= 0.07;
            G.game.backgroundOverlay.y -= 0.5;

            /* Rotate and reposition second planet */
            G.game.backgroundPlanet2.y -= 0.16;
            G.game.backgroundPlanet2.rotation += 0.001;

            if (G.game.backgroundPlanet2.y < -G.game.backgroundPlanet2.height / 2) {
                G.game.backgroundPlanet2.y = G.game.height + G.game.backgroundPlanet2.height;
            }
        }            
    }

    return Level;
});
