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
            this.game.load.audio('menu_background', ['audio/menu_background.mp3', 'audio/menu_background.ogg', 'audio/menu_background.m4a']);
            this.game.load.audio('button', ['audio/button.mp3', 'audio/button.ogg', 'audio/button.m4a']);

            /* Graphics
            --------------------------------------------------------------------------------- */

            /* Background */
            this.game.load.image('background_menu', 'dist/images/backgrounds/background_menu.jpg');

            /* Level menu */
            this.game.load.spritesheet('select_frame', 'dist/images/gui/mission_select_frame.png', 100, 100);
            this.game.load.spritesheet('select_number', 'dist/images/gui/mission_select_numbers.png', 50, 39);
            this.game.load.image('locked', 'dist/images/gui/mission_select_locked.png');

            /* HUD */
            this.game.load.image('main_button', 'dist/images/hud/main_button.png');
            this.game.load.image('window', 'dist/images/hud/window_whole.png');

            /* Gui */
            this.game.load.spritesheet('stars', 'dist/images/gui/mission_select_stars.png', 65, 20);
            this.game.load.spritesheet('stars_big', 'dist/images/gui/mission_select_stars_big.png', 115, 35);

        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            /* Register screenShake plugin */
            this.game.plugins.screenShake = this.game.plugins.add(Phaser.Plugin.ScreenShake);

            /* Setup audio */
            this.game.menu_background = this.game.add.audio('menu_background');
            this.game.button = this.game.add.audio('button');

            /* Settings */
            this.game.GAME_ASSETS_LOADED = false;

            /**
             * Reset Game
             * Function to reset the game to its initial level state
             */

            this.game.resetGame = function() {
                var _this = this,
                    level = _this.level;

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

            this.game.showDamage = function(x, y) {
                /* Play audio */
                this.explosion.play();

                var damage = this.damageGroup.getFirstDead();

                /* If there aren't any available, create a new one */
                if (damage === null) {
                    damage = this.add.sprite(0, 0, 'damage');
                    damage.anchor.setTo(0.5, 0.5);

                    /* add an animation for the damage that kills the sprite when the animation is complete */
                    var animation = damage.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, false);
                    animation.killOnComplete = true;

                    this.damageGroup.add(damage);
                }

                damage.revive();
                damage.x = x;
                damage.y = y;
                damage.angle = this.rnd.integerInRange(0, 360);
                damage.animations.play('boom');

                return damage;
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

                if (this.rnd.integerInRange(0, 10) < 5) {
                    posX = this.rnd.integerInRange(0, 10) < 5 ? -110 : this.width + 110;
                    posY = this.rnd.integerInRange(0, this.height);
                } else {
                    posX = this.rnd.integerInRange(0, this.width);
                    posY = this.rnd.integerInRange(0, 10) < 5 ? -110 : this.height + 110;
                }

                return {
                    x: posX,
                    y: posY
                };
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