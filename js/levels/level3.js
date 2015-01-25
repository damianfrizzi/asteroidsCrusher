/* ------------------------------------------------------------------------------
level3.js
--------------------------------------------------------------------------------- */

var level3Loaded = false;

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
            this.LEVEL_INDEX = 3;
            this.WEAPON = 'bullet';
            this.FUEL_DURATION = 85000;
            this.DIFFICULTY_CHANGE_TIME = 20000;
            this.LEVEL_DURATION = 90000;
            this.POWERUPS_DELAY = 5000;
            this.NUMBER_OF_POWERUPS = 5;
            this.ENEMY_MIN_SPEED = 70;
            this.ENEMY_MAX_SPEED = 100;
            this.ENEMY_DELAY = 900;
            this.NUMBER_OF_ENEMIES = 30;
            this.BACKGROUND_IMAGE = 3;
        },

        preload: function() {
            if(!level3Loaded) {
                G.load.image('background3', 'dist/images/backgrounds/background_03_parallax_01.png');
                G.load.image('background3_overlay', 'dist/images/backgrounds/background_03_parallax_02.png');
                G.load.image('background3_planet_1', 'dist/images/backgrounds/background_03_parallax_03.png');

                level3Loaded = true;
            }
        },

        positionBackground: function() {
            G.background = G.Background.create(0, 0, 'background' + G.LEVEL_INDEX);
            G.backgroundOverlay = G.add.tileSprite(0, 0, G.width, G.height * 10, 'background' + G.LEVEL_INDEX + '_overlay');
            G.Background.add(G.backgroundOverlay);

            G.backgroundPlanet1 = G.add.sprite(800, 550, 'background' + G.LEVEL_INDEX + '_planet_1');
            G.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.Background.add(G.backgroundPlanet1);            
        },

        updateBackground: function() {
            /* Rotate and reposition first planet */
            G.backgroundPlanet1.y -= 0.07;
            G.backgroundOverlay.y -= 0.5;
        }        
    }

    return Level;
});
