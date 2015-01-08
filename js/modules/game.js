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
            $('#loader').fadeIn();

            /* Level specific properties are set in levelMenu.js */
            $.extend(this.game, this.game.level);

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

            /* Boss settings */
            this.game.BOSS_MAX_SPEED = 150;

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

        preload: function() {
            this.game.level.preload && this.game.level.preload();

            /* Load general game assets if they haven't been loaded yet */
            if (!this.game.GAME_ASSETS_LOADED) {

                /* Audio
                --------------------------------------------------------------------------------- */
                this.game.load.audio('ship_thruster', ['audio/ship_thruster.mp3', 'audio/ship_thruster.ogg', 'audio/ship_thruster.m4a']);
                this.game.load.audio('gunshot', ['audio/gunshot.mp3', 'audio/gunshot.ogg', 'audio/gunshot.m4a']);
                this.game.load.audio('item_collect', ['audio/item_collect.mp3', 'audio/item_collect.ogg', 'audio/item_collect.m4a']);
                this.game.load.audio('explosion', ['audio/explosion.mp3', 'audio/explosion.ogg', 'audio/explosion.m4a']);
                this.game.load.audio('game_background', ['audio/game_background.mp3', 'audio/game_background.ogg', 'audio/game_background.m4a']);
                this.game.load.audio('game_over', ['audio/game_over.mp3', 'audio/game_over.ogg', 'audio/game_over.m4a']);
                this.game.load.audio('game_victory', ['audio/game_victory.mp3', 'audio/game_victory.ogg', 'audio/game_victory.m4a']);

                /* Graphics
                --------------------------------------------------------------------------------- */

                /* Weapons */
                this.game.load.image('bullet', 'dist/images/weapons/bullet.png');
                this.game.load.image('bullet_double', 'dist/images/weapons/bullet_double.png');
                this.game.load.image('double_bullet_single', 'dist/images/weapons/double_bullet_single.png');
                this.game.load.image('bx_rocket', 'dist/images/weapons/bx_rocket.png');
                this.game.load.image('bx_rocket_single', 'dist/images/weapons/bx_rocket_single.png');

                /* Powerups */
                this.game.load.image('shield', 'dist/images/powerups/shield.png');
                this.game.load.image('shield_single', 'dist/images/powerups/shield_single.png');
                this.game.load.spritesheet('powerups', 'dist/images/powerups/powerups.png', 100, 100);
                this.game.load.spritesheet('powerup_life', 'dist/images/powerups/points_powerup_lifes_powerup_indicator.png', 124, 124);

                /* Enemies */
                this.game.load.image('enemy_unit', 'dist/images/enemies/enemy_unit.png');
                this.game.load.spritesheet('asteorid_1', 'dist/images/enemies/asteroid_1.png', 100, 44);
                this.game.load.spritesheet('asteorid_2', 'dist/images/enemies/asteroid_2.png', 170, 140);
                this.game.load.spritesheet('asteorid_3', 'dist/images/enemies/asteroid_3.png', 90, 77);

                /* HUD */
                this.game.load.image('points_powerup_lifes', 'dist/images/hud/points_powerup_lifes.png');
                this.game.load.image('life', 'dist/images/hud/life_indicator.png', 24, 24);
                this.game.load.image('control_field', 'dist/images/hud/control_field.png');
                this.game.load.image('control_fuel_icon', 'dist/images/hud/control_fuel_icon.png');
                this.game.load.image('control_stick', 'dist/images/hud/control_stick.png');
                this.game.load.image('arrow_up', 'dist/images/hud/button_arrow_up.png');
                this.game.load.image('arrow_right', 'dist/images/hud/button_arrow_right.png');
                this.game.load.image('arrow_down', 'dist/images/hud/button_arrow_down.png');
                this.game.load.image('arrow_left', 'dist/images/hud/button_arrow_left.png');
                this.game.load.image('button', 'dist/images/hud/button.png');
                this.game.load.spritesheet('ship_normal', 'dist/images/spaceships/spaceship_normal.png', 90, 76);
                this.game.load.spritesheet('ship_multiple_guns', 'dist/images/spaceships/spaceship_normal_multiple_gun.png', 90, 76);
                this.game.load.spritesheet('explosion', 'dist/images/misc/explosion.png', 90, 90);
                this.game.load.spritesheet('damage', 'dist/images/misc/damage.png', 90, 90);
                this.game.load.spritesheet('pause', 'dist/images/hud/pause_button.png', 142, 157);
                this.game.load.spritesheet('shooting_button', 'dist/images/hud/shooting_button.png', 190, 199);
                this.game.load.spritesheet('control_fuel', 'dist/images/hud/control_fuel_indicator.png', 99, 99);
                this.game.load.spritesheet('summary_icons', 'dist/images/hud/summary_icons.png', 60, 60);

                this.game.GAME_ASSETS_LOADED = true;
            }
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            var G = this;

            /* Pause game when window loses focus */
            $(window).on('mouseleave', function() {
                if (!G.game.isPaused) G.game.paused = true;
            }).on('mouseenter', function() {
                if (!G.game.isPaused) G.game.paused = false;
            });

            this.game.menu_background.stop();
            this.game.game_background.play('', 0, 1, true);

            /* Store game start time */
            this.game.gameStartTime = this.game.time.now;

            /* Enable physics */
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            /* Setup events object */
            if (!this.game.events) this.game.events = {};

            /* Go fullscreen on mobile devices */
            if (!this.game.device.desktop) {
                this.game.input.onDown.add(function() {
                    this.game.scale.startFullScreen(false);
                }, this);
            }

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

            $('#loader').hide();
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
