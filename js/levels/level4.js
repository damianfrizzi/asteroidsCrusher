/* ------------------------------------------------------------------------------
level4.js
--------------------------------------------------------------------------------- */

var level4Loaded = false;

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
            this.LEVEL_INDEX = 4;
            this.WEAPON = 'bullet';
            this.FUEL_DURATION = 85000;
            this.DIFFICULTY_CHANGE_TIME = 20000;
            this.LEVEL_DURATION = 90000;
            this.POWERUPS_DELAY = 5000;
            this.NUMBER_OF_POWERUPS = 8;
            this.ENEMY_MIN_SPEED = 50;
            this.ENEMY_MAX_SPEED = 100;
            this.ENEMY_DELAY = 900;
            this.NUMBER_OF_ENEMIES = 25;
            this.BACKGROUND_IMAGE = 4;
        },

        preload: function() {
            if(!level4Loaded) {
                G.game.load.image('background4', 'dist/images/backgrounds/background_04_parallax_01.png');
                G.game.load.image('background4_overlay', 'dist/images/backgrounds/background_04_parallax_02.png');
                G.game.load.image('background4_planet_1', 'dist/images/backgrounds/background_04_parallax_03.png');
                G.game.load.image('background4_planet_2', 'dist/images/backgrounds/background_04_parallax_04.png');

                level4Loaded = true;
            }
        },

        positionBackground: function() {
            G.game.background = G.game.Background.create(0, 0, 'background' + G.game.level.LEVEL_INDEX);
            G.game.backgroundOverlay = G.game.add.tileSprite(0, 0, G.game.width, G.game.height * 10, 'background' + G.game.level.LEVEL_INDEX + '_overlay');
            G.game.Background.add(G.game.backgroundOverlay);

            G.game.backgroundPlanet1 = G.game.add.sprite(150, 200, 'background' + G.game.level.LEVEL_INDEX + '_planet_1');
            G.game.backgroundPlanet1.anchor.setTo(0.5, 0.5);
            G.game.Background.add(G.game.backgroundPlanet1);

            G.game.backgroundPlanet2 = G.game.add.sprite(350, 200, 'background' + G.game.level.LEVEL_INDEX + '_planet_2');
            G.game.backgroundPlanet2.anchor.setTo(0.5, 0.5);
            G.game.Background.add(G.game.backgroundPlanet2);
        },

        updateBackground: function() {
            /* Rotate and reposition first planet */
            G.game.backgroundPlanet1.x -= 0.1;
            G.game.backgroundOverlay.x -= 0.2;

            /* Rotate and reposition second planet */
            G.game.backgroundPlanet2.x -= 0.12;
            G.game.backgroundPlanet2.rotation += 0.003;
        }        
    }

    return Level;
});
