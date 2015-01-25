/* ------------------------------------------------------------------------------
level2.js
--------------------------------------------------------------------------------- */

var level2Loaded = false;

define(function() {

    'use strict';

    var G, Level = function(obj) {
        G = obj.game;

        this.init();
    };

    Level.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            this.LEVEL_INDEX = 2;
            this.WEAPON = 'bullet';
            this.FUEL_DURATION = 85000;
            this.DIFFICULTY_CHANGE_TIME = 20000;
            this.LEVEL_DURATION = 60000;
            this.POWERUPS_DELAY = 5000;
            this.NUMBER_OF_POWERUPS = 5;
            this.ENEMY_MIN_SPEED = 70;
            this.ENEMY_MAX_SPEED = 100;
            this.ENEMY_DELAY = 1000;
            this.NUMBER_OF_ENEMIES = 20;
            this.BACKGROUND_IMAGE = 2;
        },

        preload: function() {
            if(!level2Loaded) {
                G.load.image('background2', 'dist/images/backgrounds/background_02_parallax_01.png');
                G.load.image('background2_overlay', 'dist/images/backgrounds/background_02_parallax_02.png');
                G.load.image('background2_planet_1', 'dist/images/backgrounds/background_02_parallax_03.png');
                G.load.image('background2_planet_2', 'dist/images/backgrounds/background_02_parallax_04.png');

                level2Loaded = true;
            }
        },

        positionBackground: function() {
            G.background = G.Background.create(0, 0, 'background' + G.level.LEVEL_INDEX);
            G.backgroundOverlay = G.add.tileSprite(0, 0, G.width, G.height * 10, 'background' + G.level.LEVEL_INDEX + '_overlay');
            G.Background.add(G.backgroundOverlay);

            G.backgroundPlanet1 = G.add.sprite(200, 350, 'background' + G.level.LEVEL_INDEX + '_planet_1');
            G.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.Background.add(G.backgroundPlanet1);

            G.backgroundPlanet2 = G.add.sprite(G.width - 200, G.height - 200, 'background' + G.level.LEVEL_INDEX + '_planet_2');
            G.backgroundPlanet2.anchor.setTo(0.5, 0.5);
            G.Background.add(G.backgroundPlanet2);
        },

        updateBackground: function() {
            /* Rotate and reposition first planet */
            G.backgroundPlanet1.y -= 0.07;
            G.backgroundOverlay.y -= 0.5;

            /* Rotate and reposition second planet */
            G.backgroundPlanet2.y -= 0.16;
            G.backgroundPlanet2.rotation += 0.001;

            if (G.backgroundPlanet2.y < -G.backgroundPlanet2.height / 2) {
                G.backgroundPlanet2.y = G.height + G.backgroundPlanet2.height;
            }
        }            
    }

    return Level;
});
