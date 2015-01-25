/* ------------------------------------------------------------------------------
level6.js
--------------------------------------------------------------------------------- */

var level6Loaded = false;

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
            this.LEVEL_INDEX = 6;
            this.WEAPON = 'bullet';
            this.FUEL_DURATION = 55000;
            this.DIFFICULTY_CHANGE_TIME = 15000;
            this.LEVEL_DURATION = 4000;
            this.POWERUPS_DELAY = 5000;
            this.NUMBER_OF_POWERUPS = 8;
            this.ENEMY_MIN_SPEED = 20;
            this.ENEMY_MAX_SPEED = 60;
            this.ENEMY_DELAY = 500;
            this.NUMBER_OF_ENEMIES = 40;
            this.BACKGROUND_IMAGE = 1;
        },

        preload: function() {
            if(!level6Loaded) {
                G.load.image('background1', 'dist/images/backgrounds/background_01_parallax_01.png');
                G.load.image('background1_overlay', 'dist/images/backgrounds/background_01_parallax_02.png');
                G.load.image('background1_planet_1', 'dist/images/backgrounds/background_01_parallax_03.png');
                G.load.image('background1_planet_2', 'dist/images/backgrounds/background_01_parallax_04.png');

                level6Loaded = true;
            }
        },

        positionBackground: function() {
            G.background = G.Background.create(0, 0, 'background' + this.BACKGROUND_IMAGE);
            G.backgroundOverlay = G.add.tileSprite(0, 0, G.width, G.height * 10, 'background' + this.BACKGROUND_IMAGE + '_overlay');
            G.Background.add(G.backgroundOverlay);

            G.backgroundPlanet1 = G.add.sprite(200, 350, 'background' + this.BACKGROUND_IMAGE + '_planet_1');
            G.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.Background.add(G.backgroundPlanet1);

            G.backgroundPlanet2 = G.add.sprite(G.width - 200, G.height - 200, 'background' + this.BACKGROUND_IMAGE + '_planet_2');
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
