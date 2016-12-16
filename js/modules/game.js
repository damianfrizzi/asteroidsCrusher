/* ------------------------------------------------------------------------------
game.js

Setup new game environement
--------------------------------------------------------------------------------- */

define(['background', 'player', 'enemies', 'powerups', 'hud', 'mobileControls'], function(Background, Player, Enemies, Powerups, Hud, MobileControls) {

    'use strict';

    var G, Game = function(game) {
        G = game;
    };

    Game.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            $('#loader').fadeIn();

            /* Level specific properties are set in levelMenu.js */
            $.extend(G, G.level);

            /* General settings */
            G.SCORE = 0;
            G.NUMBER_OF_LIFES = 4;
            G.MAX_LIFES = 4;
            G.FUEL = 100;
            G.DESTROYED_ASTEROIDS = 0;
            G.BOSS_SHOWN = false;
            G.POSSIBLE_SCORE = 0;
            G.difficultyCounter = 0;
            G.fuelCounter = 0;
            G.GAME_OVER = false;
            G.GAME_COMPLETED = false;

            /**
             * Powerups
             * Store different types of powerups
             */
            G.powerupsObjects = [{
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
            G.enemiesObjects = [{
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
            G.SHIP = 'ship_normal' // ship_normal, ship_multiple_guns
            G.SHIP_ROTATION_SPEED = 250;
            G.SHIP_ACCELERATION = 350;
            G.SHIP_MAX_SPEED = 250;

            /* Boss settings */
            G.BOSS_MAX_SPEED = 150;

            /* bullet settings */
            G.BULLET_SHOT_DELAY = 200;
            G.BULLET_SPEED = 500;
            G.BULLET_FORCE = 1;
            G.NUMBER_OF_BULLETS = 50;

            /* doubleBullet settings */
            G.DOUBLE_BULLET_SHOT_DELAY = 100;
            G.DOUBLE_BULLET_SPEED = 500;
            G.DOUBLE_BULLET_FORCE = 1;
            G.NUMBER_OF_DOUBLE_BULLETS = 50;

            /* bxRocket settings */
            G.ROCKET_BX_SHOT_DELAY = 100;
            G.ROCKET_BX_SPEED = 500;
            G.ROCKET_BX_FORCE = 1;
            G.NUMBER_OF_BX_ROCKETS = 5;
        },

        preload: function() {
            G.level.preload && G.level.preload();

            /* Load general game assets if they haven't been loaded yet */
            if (!G.GAME_ASSETS_LOADED) {

                /* Audio
                --------------------------------------------------------------------------------- */
                G.load.audio('ship_thruster', ['audio/ship_thruster.mp3', 'audio/ship_thruster.ogg', 'audio/ship_thruster.m4a']);
                G.load.audio('gunshot', ['audio/gunshot.mp3', 'audio/gunshot.ogg', 'audio/gunshot.m4a']);
                G.load.audio('item_collect', ['audio/item_collect.mp3', 'audio/item_collect.ogg', 'audio/item_collect.m4a']);
                G.load.audio('explosion', ['audio/explosion.mp3', 'audio/explosion.ogg', 'audio/explosion.m4a']);
                G.load.audio('boss', ['audio/boss.mp3', 'audio/boss.ogg', 'audio/boss.m4a']);
                G.load.audio('game_background', ['audio/game_background.mp3', 'audio/game_background.ogg', 'audio/game_background.m4a']);
                G.load.audio('game_over', ['audio/game_over.mp3', 'audio/game_over.ogg', 'audio/game_over.m4a']);
                G.load.audio('game_victory', ['audio/game_victory.mp3', 'audio/game_victory.ogg', 'audio/game_victory.m4a']);

                /* Graphics
                --------------------------------------------------------------------------------- */

                /* Weapons */
                G.load.image('bullet', 'dist/images/weapons/bullet.png');
                G.load.image('bullet_double', 'dist/images/weapons/bullet_double.png');
                G.load.image('double_bullet_single', 'dist/images/weapons/double_bullet_single.png');
                G.load.image('bx_rocket', 'dist/images/weapons/bx_rocket.png');
                G.load.image('bx_rocket_single', 'dist/images/weapons/bx_rocket_single.png');

                /* Powerups */
                G.load.image('shield', 'dist/images/powerups/shield.png');
                G.load.image('shield_single', 'dist/images/powerups/shield_single.png');
                G.load.spritesheet('powerups', 'dist/images/powerups/powerups.png', 100, 100);
                G.load.spritesheet('powerup_life', 'dist/images/powerups/points_powerup_lifes_powerup_indicator.png', 124, 124);

                /* Enemies */
                G.load.image('enemy_unit', 'dist/images/enemies/enemy_unit.png');
                G.load.spritesheet('asteorid_1', 'dist/images/enemies/asteroid_1.png', 100, 44);
                G.load.spritesheet('asteorid_2', 'dist/images/enemies/asteroid_2.png', 170, 140);
                G.load.spritesheet('asteorid_3', 'dist/images/enemies/asteroid_3.png', 90, 77);

                /* HUD */
                G.load.image('control_stick', 'dist/images/hud/control_stick.png');
                G.load.image('arrow_up', 'dist/images/hud/button_arrow_up.png');
                G.load.image('arrow_right', 'dist/images/hud/button_arrow_right.png');
                G.load.image('arrow_down', 'dist/images/hud/button_arrow_down.png');
                G.load.image('arrow_left', 'dist/images/hud/button_arrow_left.png');
                G.load.image('button', 'dist/images/hud/button.png');
                G.load.spritesheet('control_fuel_icon', 'dist/images/hud/control_fuel_icon.png', 60, 60);
                G.load.spritesheet('control_field', 'dist/images/hud/control_field.png', 200, 200);
                G.load.spritesheet('life', 'dist/images/hud/life_indicator.png', 24, 24);
                G.load.spritesheet('points_powerup_lifes', 'dist/images/hud/points_powerup_lifes.png', 444, 179);
                G.load.spritesheet('ship_normal', 'dist/images/spaceships/spaceship_normal.png', 90, 76);
                G.load.spritesheet('ship_multiple_guns', 'dist/images/spaceships/spaceship_normal_multiple_gun.png', 90, 76);
                G.load.spritesheet('explosion', 'dist/images/misc/explosion.png', 90, 90);
                G.load.spritesheet('damage', 'dist/images/misc/damage.png', 90, 90);
                G.load.spritesheet('pause', 'dist/images/hud/pause_button.png', 142, 157);
                G.load.spritesheet('shooting_button', 'dist/images/hud/shooting_button.png', 190, 199);
                G.load.spritesheet('control_fuel', 'dist/images/hud/control_fuel_indicator.png', 99, 99);
                G.load.spritesheet('summary_icons', 'dist/images/hud/summary_icons.png', 60, 60);

                G.GAME_ASSETS_LOADED = true;
            }
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            /* Setup audio */
            G.shipThruster = G.add.audio('ship_thruster');
            G.itemCollect = G.add.audio('item_collect');
            G.gunshot = G.add.audio('gunshot');
            G.explosion = G.add.audio('explosion');
            G.boss_background = G.add.audio('boss');
            G.game_background = G.add.audio('game_background');
            G.game_over = G.add.audio('game_over');
            G.game_victory = G.add.audio('game_victory');

            /* Pause game when window loses focus */
            $(window).on('mouseleave', function() {
                if (!G.isPaused) G.paused = true;
            }).on('mouseenter', function() {
                if (!G.isPaused) G.paused = false;
            });

            G.menu_background.stop();
            G.game_background.play('', 0, 1, true);

            /* Store game start time */
            G.gameStartTime = G.time.now;

            /* Enable physics */
            G.physics.startSystem(Phaser.Physics.ARCADE);

            /* Setup events object */
            if (!G.events) G.events = {};

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
                G.time.advancedTiming = true;
                G.fpsText = G.add.text(
                    G.width - 220, 20, '', {
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
            if (G.GameElapsedTime > G.DIFFICULTY_CHANGE_TIME + (G.DIFFICULTY_CHANGE_TIME * G.difficultyCounter)) {
                G.ENEMY_DELAY -= 40;
                G.POWERUPS_DELAY -= 20;
                G.ENEMY_MAX_SPEED += 10;
                G.difficultyCounter++;
            }

            /* Trigger update event for modules */
            if (!G.GAME_OVER && !G.GAME_COMPLETED) {
                $(document).trigger('update');
            }

            /* DEBUG update fps */
            if (DEBUG && G.time.fps !== 0) {
                G.fpsText.setText(G.time.fps + ' FPS');
            }
        }

    };

    return Game;
});
