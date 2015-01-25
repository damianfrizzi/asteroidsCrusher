/* ------------------------------------------------------------------------------
level1.js
--------------------------------------------------------------------------------- */

var level1Loaded = false;

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
            /* Unique level index */
            this.LEVEL_INDEX = 1;

            /**
             * Starting weapon
             * Possible weapons: bullet, doubleBullet, bxRocket
             */
            this.WEAPON = 'bullet';

            /**
             * Duration until fuel has gone
             * Gameover when finished
             */
            this.FUEL_DURATION = 85000;

            /**
             * Difficulty increase interval
             * Increases the difficulty every x milliseconds
             */
            this.DIFFICULTY_CHANGE_TIME = 20000;

            /**
             * Level duration
             * When this time is over; the boss will appear
             */
            this.LEVEL_DURATION = 60000;

            /**
             * Powerups delay
             * The powerups appearing interval
             * This will be decreased during difficulty change
             */
            this.POWERUPS_DELAY = 5000;

            /* Number of powerups */
            this.NUMBER_OF_POWERUPS = 5;

            /* Minimum enemy speed */
            this.ENEMY_MIN_SPEED = 50;

            /**
             * Maximum enemy speed
             * This property will be increased during difficulty change
             */
            this.ENEMY_MAX_SPEED = 80;

            /**
             * Enemy delay
             * The enemies appearing interval
             * This will be decreased during difficulty change
             */
            this.ENEMY_DELAY = 2000;

            /* Number of enemies */
            this.NUMBER_OF_ENEMIES = 15;

            /* Backgound image */
            this.BACKGROUND_IMAGE = 1;
        },

        preload: function() {
            if (!level1Loaded) {
                G.load.image('background1', 'dist/images/backgrounds/background_01_parallax_01.png');
                G.load.image('background1_overlay', 'dist/images/backgrounds/background_01_parallax_02.png');
                G.load.image('background1_planet_1', 'dist/images/backgrounds/background_01_parallax_03.png');
                G.load.image('background1_planet_2', 'dist/images/backgrounds/background_01_parallax_04.png');

                level1Loaded = true;
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
