/* ------------------------------------------------------------------------------
boot.js

Preload assets
Initialize mainMenu state once alle settings were made and graphics were loaded
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var Boot = function(game) {
        this.game = game;
    };

    Boot.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(0, 0, 1024, 768);
            this.game.scale.pageAlignVertically = true;
            this.game.scale.pageAlignHorizontally = true;
        },

        /* preload
        --------------------------------------------------------------------------------- */

        preload: function() {

            /* Audio
            --------------------------------------------------------------------------------- */
            this.game.load.audio('ship_thruster', ['audio/ship_thruster.mp3', 'audio/ship_thruster.ogg', 'audio/ship_thruster.m4a']);
            this.game.load.audio('gunshot', ['audio/gunshot.mp3', 'audio/gunshot.ogg', 'audio/gunshot.m4a']);
            this.game.load.audio('item_collect', ['audio/item_collect.mp3', 'audio/item_collect.ogg', 'audio/item_collect.m4a']);
            this.game.load.audio('explosion', ['audio/explosion.mp3', 'audio/explosion.ogg', 'audio/explosion.m4a']);
            this.game.load.audio('menu_background', ['audio/menu_background.mp3', 'audio/menu_background.ogg', 'audio/menu_background.m4a']);
            this.game.load.audio('game_background', ['audio/game_background.mp3', 'audio/game_background.ogg', 'audio/game_background.m4a']);
            this.game.load.audio('game_over', ['audio/game_over.mp3', 'audio/game_over.ogg', 'audio/game_over.m4a']);
            this.game.load.audio('game_victory', ['audio/game_victory.mp3', 'audio/game_victory.ogg', 'audio/game_victory.m4a']);

            /* Graphics
            --------------------------------------------------------------------------------- */

            /* Background */
            this.game.load.image('background1', 'dist/images/backgrounds/background_01_parallax_01.png');
            this.game.load.image('background2', 'dist/images/backgrounds/background_02_parallax_01.png');
            this.game.load.image('background3', 'dist/images/backgrounds/background_03_parallax_01.png');
            this.game.load.image('background_menu', 'dist/images/backgrounds/background_menu.jpg');
            this.game.load.image('background1_overlay', 'dist/images/backgrounds/background_01_parallax_02.png');
            this.game.load.image('background1_planet_1', 'dist/images/backgrounds/background_01_parallax_03.png');
            this.game.load.image('background1_planet_2', 'dist/images/backgrounds/background_01_parallax_04.png');
            this.game.load.image('background2_overlay', 'dist/images/backgrounds/background_02_parallax_02.png');
            this.game.load.image('background2_planet_1', 'dist/images/backgrounds/background_02_parallax_03.png');
            this.game.load.image('background2_planet_2', 'dist/images/backgrounds/background_02_parallax_04.png');
            this.game.load.image('background3_overlay', 'dist/images/backgrounds/background_03_parallax_02.png');
            this.game.load.image('background3_planet_1', 'dist/images/backgrounds/background_03_parallax_03.png');

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
            this.game.load.image('window', 'dist/images/hud/window_whole.png');
            this.game.load.image('control_field', 'dist/images/hud/control_field.png');
            this.game.load.image('control_fuel_icon', 'dist/images/hud/control_fuel_icon.png');
            this.game.load.image('control_stick', 'dist/images/hud/control_stick.png');
            this.game.load.image('arrow_up', 'dist/images/hud/button_arrow_up.png');
            this.game.load.image('arrow_right', 'dist/images/hud/button_arrow_right.png');
            this.game.load.image('arrow_down', 'dist/images/hud/button_arrow_down.png');
            this.game.load.image('arrow_left', 'dist/images/hud/button_arrow_left.png');
            this.game.load.image('button', 'dist/images/hud/button.png');
            this.game.load.image('main_button', 'dist/images/hud/main_button.png');
            this.game.load.spritesheet('ship_normal', 'dist/images/spaceships/spaceship_normal.png', 90, 76);
            this.game.load.spritesheet('ship_multiple_guns', 'dist/images/spaceships/spaceship_normal_multiple_gun.png', 90, 76);
            this.game.load.spritesheet('stars', 'dist/images/gui/mission_select_stars.png', 65, 20);
            this.game.load.spritesheet('stars_big', 'dist/images/gui/mission_select_stars_big.png', 115, 35);
            this.game.load.spritesheet('explosion', 'dist/images/misc/explosion.png', 90, 90);
            this.game.load.spritesheet('pause', 'dist/images/hud/pause_button.png', 142, 157);
            this.game.load.spritesheet('shooting_button', 'dist/images/hud/shooting_button.png', 190, 199);
            this.game.load.spritesheet('control_fuel', 'dist/images/hud/control_fuel_indicator.png', 99, 99);
            this.game.load.spritesheet('summary_icons', 'dist/images/hud/summary_icons.png', 60, 60);
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            /* Register screenShake plugin */
            this.game.plugins.screenShake = this.game.plugins.add(Phaser.Plugin.ScreenShake);

            /* Setup audio */

            this.game.shipThruster = this.game.add.audio('ship_thruster');
            this.game.itemCollect = this.game.add.audio('item_collect');
            this.game.gunshot = this.game.add.audio('gunshot');
            this.game.explosion = this.game.add.audio('explosion');               
            this.game.menu_background = this.game.add.audio('menu_background');               
            this.game.game_background = this.game.add.audio('game_background');               
            this.game.game_over = this.game.add.audio('game_over');               
            this.game.game_victory = this.game.add.audio('game_victory');               

            /**
             * Reset Game
             * Function to reset the game to its initial level state
             */

            this.game.resetGame = function() {
                var _this = this,
                    level = JSON.parse(localStorage.getItem('activeLevel'));

                this.ENEMY_DELAY = level.ENEMY_DELAY;
                this.POWERUPS_DELAY = level.POWERUPS_DELAY;
                this.ENEMY_MAX_SPEED = level.ENEMY_MAX_SPEED;
                this.WEAPON = level.WEAPON;
                this.DESTROYED_ASTEROIDS = 0;
                this.difficultyCounter = 0;
                this.FUEL = 100;
                this.SCORE = 0;
                this.NUMBER_OF_LIFES = 4;

                /* Kill all living enemies */
                this.enemies.forEachAlive(function(enemy) {
                    _this.showExplosion(enemy.x, enemy.y);
                    enemy.kill();
                });
                this.lastEnemyAt = 0;

                /* Kill ship */
                this.ship.loadTexture('ship_normal', 0);

                /* Kill all living powerups */
                this.powerups.forEachAlive(function(powerup) {
                    _this.showExplosion(powerup.x, powerup.y);
                    powerup.kill();
                });
                this.powerupText.setText('00');
                this.powerUpIndicator && this.powerUpIndicator.kill();
                this.activePowerup = undefined;

                /* Reset boss */
                this.BOSS_SHOWN = false;
                this.showExplosion(this.boss.x, this.boss.y);
                this.boss.body.collideWorldBounds = false;
                var randomPos = this.getRandomStartingPosition();
                this.boss.reset(randomPos.x, randomPos.y);                
                this.boss.kill();
                this.bossBulletsPool.forEachAlive(function(bullet) {
                    bullet.kill();
                });

                /* Recreate lifes */
                this.lifes.forEach(function(life) {
                    life.revive();
                });

                /* Reset score */
                this.scoreText.setText('0');

                /* Fill up fuel */
                this.fuelCounter = 0;
                this.controlOverlay.y = this.height - 170;
            };

            /**
             * Show explosion
             * Display explosion effect at a given point
             */

            this.game.showExplosion = function(x, y) {
                /* Play audio */
                this.explosion.play();

                var explosion = this.explosionGroup.getFirstDead();

                /* If there aren't any available, create a new one */
                if (explosion === null) {
                    explosion = this.add.sprite(0, 0, 'explosion');
                    explosion.anchor.setTo(0.5, 0.5);

                    /* add an animation for the explosion that kills the sprite when the animation is complete */
                    var animation = explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, false);
                    animation.killOnComplete = true;

                    this.explosionGroup.add(explosion);
                }

                explosion.revive();
                explosion.x = x;
                explosion.y = y;
                explosion.angle = this.rnd.integerInRange(0, 360);
                explosion.animations.play('boom');

                return explosion;
            };

            /* General helpers */
            this.game.getRandomStartingPosition = function() {
                var posX, posY;

                if (this.getRandomInt(0, 10) < 5) {
                    posX = this.getRandomInt(0, 10) < 5 ? -150 : this.width + 150;
                    posY = this.getRandomInt(0, this.height);
                } else {
                    posX = this.getRandomInt(0, this.width);
                    posY = this.getRandomInt(0, 10) < 5 ? -150 : this.height + 150;
                }

                return {
                    x: posX,
                    y: posY
                };
            };

            this.game.getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            this.game.secondsToString = function(seconds) {
                var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
                numminutes = numminutes < 10 ? '0' + numminutes : numminutes;
                var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);
                numseconds = numseconds < 10 ? '0' + numseconds : numseconds;

                return numminutes + ':' + numseconds;
            };

            this.game.state.start('mainMenu');
        }


    };

    return Boot;
});
