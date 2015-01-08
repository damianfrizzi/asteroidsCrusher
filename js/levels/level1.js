/* ------------------------------------------------------------------------------
level1.js
--------------------------------------------------------------------------------- */

var level1Loaded = false;

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
            this.ENEMY_MAX_SPEED = 100;

            /**
             * Enemy delay
             * The enemies appearing interval
             * This will be decreased during difficulty change
             */
            this.ENEMY_DELAY = 1000;

            /* Number of enemies */
            this.NUMBER_OF_ENEMIES = 20;

            /* Backgound image */
            this.BACKGROUND_IMAGE = 1;
        },

        preload: function() {
            if (!level1Loaded) {
                G.game.load.image('background1', 'dist/images/backgrounds/background_01_parallax_01.png');
                G.game.load.image('background1_overlay', 'dist/images/backgrounds/background_01_parallax_02.png');
                G.game.load.image('background1_planet_1', 'dist/images/backgrounds/background_01_parallax_03.png');
                G.game.load.image('background1_planet_2', 'dist/images/backgrounds/background_01_parallax_04.png');

                level1Loaded = true;
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
