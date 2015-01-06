/* ------------------------------------------------------------------------------
game.js

Setup new game environement
--------------------------------------------------------------------------------- */

define(['background', 'player', 'enemies', 'powerups', 'hud', 'mobileControls'], function(Background, Player, Enemies, Powerups, Hud, MobileControls) {

    'use strict';

    var Game = function(game) {
        this.game = game;
    };

    Game.prototype = {

        /* init
        --------------------------------------------------------------------------------- */              
            
        init: function() {
            /* Level specific properties are set in levelMenu.js */
            $.extend(this.game, this.game.options);

            /* General settings */
            this.game.SCORE = 0;
            this.game.NUMBER_OF_LIFES = 4;
            this.game.MAX_LIFES = 4;
            this.game.FUEL = 100;
            this.game.DESTROYED_ASTEROIDS = 0;
            this.game.BOSS_SHOWN = false;
            this.game.POSSIBLE_SCORE = 0;
            this.game.difficultyCounter = 0;
            this.game.fuelCounter = 0;
            this.game.GAME_OVER = false;
            this.game.GAME_COMPLETED = false;

            /**
             * Powerups
             * Store different types of powerups
             */
            this.game.powerupsObjects = [{
                name: 'life',
                frame: 0,
                duration: 0
            }, {
                name: 'shield',
                frame: 3,
                duration: 10000
            }, {
                name: 'bxRocket',
                frame: 5,
                duration: 15000
            }, {
                name: 'fuel',
                frame: 1,
                duration: 0
            }, {
                name: 'destroyAll',
                frame: 10,
                duration: 0
            }, {
                name: 'doubleBullet',
                frame: 12,
                duration: 15000
            }];

            /**
             * Enemies
             * Store different types of enemies
             */
            this.game.enemiesObjects = [{
                name: 'asteorid_1',
                score: 50,
                lifes: 2
            }, {
                name: 'asteorid_3',
                score: 100,
                lifes: 3
            }, {
                name: 'asteorid_2',
                score: 200,
                lifes: 4
            }];

            /* Ship settings */
            this.game.SHIP = 'ship_normal' // ship_normal, ship_multiple_guns
            this.game.SHIP_ROTATION_SPEED = 250;
            this.game.SHIP_ACCELERATION = 350;
            this.game.SHIP_MAX_SPEED = 250;

            /* bullet settings */
            this.game.BULLET_SHOT_DELAY = 200;
            this.game.BULLET_SPEED = 500;
            this.game.BULLET_FORCE = 1;
            this.game.NUMBER_OF_BULLETS = 50;

            /* doubleBullet settings */
            this.game.DOUBLE_BULLET_SHOT_DELAY = 100;
            this.game.DOUBLE_BULLET_SPEED = 500;
            this.game.DOUBLE_BULLET_FORCE = 1;
            this.game.NUMBER_OF_DOUBLE_BULLETS = 50;

            /* bxRocket settings */
            this.game.ROCKET_BX_SHOT_DELAY = 100;
            this.game.ROCKET_BX_SPEED = 500;
            this.game.ROCKET_BX_FORCE = 1;
            this.game.NUMBER_OF_BX_ROCKETS = 5;
        },

        /* create
        --------------------------------------------------------------------------------- */              
            
        create: function() {
            /* Store game start time */
            this.game.gameStartTime = this.game.time.now;

            /* Enable physics */
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            /* Setup events object */
            if (!this.game.events) this.game.events = {};

            /* Go fullscreen on mobile devices */
            // if (!this.game.device.desktop) {
            //     this.game.input.onDown.add(function() {
            //         this.game.scale.startFullScreen(false);
            //     }, this);
            // }

            /* Setup background */
            new Background(this);

            /* Setup player */
            new Player(this);

            /* Setup enemies */
            new Enemies(this);

            /* Setup powerups */
            new Powerups(this);

            /* Setup heads up display */
            new Hud(this);

            /* Setup mobile controls if touch gestures are supported */
            Modernizr.touch && new MobileControls(this);

            /* DEBUG Show fps*/
            if (DEBUG) {
                this.game.time.advancedTiming = true;
                this.game.fpsText = this.game.add.text(
                    this.game.width - 80, 20, '', {
                        font: '16px Arial',
                        fill: '#ffffff'
                    }
                );
            }
        },

        /* update
        --------------------------------------------------------------------------------- */              

        update: function() {
            /* If difficulty change time has been reached, increase difficulty */
            if (this.game.GameElapsedTime > this.game.DIFFICULTY_CHANGE_TIME + (this.game.DIFFICULTY_CHANGE_TIME * this.game.difficultyCounter)) {
                this.game.ENEMY_DELAY -= 40;
                this.game.POWERUPS_DELAY -= 20;
                this.game.ENEMY_MAX_SPEED += 10;
                this.game.difficultyCounter++;
            }

            /* Trigger update event for modules */
            if (!this.game.GAME_OVER && !this.game.GAME_COMPLETED) {
                $(document).trigger('update');
            }

            /* DEBUG update fps */
            if (DEBUG && this.game.time.fps !== 0) {
                this.game.fpsText.setText(this.game.time.fps + ' FPS');
            }
        }

    };

    return Game;
});
