/* ------------------------------------------------------------------------------
hud.js

Setup heads up display
--------------------------------------------------------------------------------- */

define(['player'], function(Player) {

    'use strict';

    var G, _this, Hud = function(obj) {
        G = obj.game;

        _this = this;
        this.init();
    };

    Hud.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            this.setupScoreMenu();
            this.setupFuelMenu();
            this.setupShootingButton();
            this.setupPauseButton();

            G.events.onUpdateScore = new Phaser.Signal();
            G.events.onUpdatePowerupDuration = new Phaser.Signal();
            G.events.onAddLife = new Phaser.Signal();
            G.events.onRemoveLife = new Phaser.Signal();

            G.events.onUpdateScore.add(this.updateScore, this);
            G.events.onUpdatePowerupDuration.add(this.updatePowerupDuration, this);
            G.events.onAddLife.add(this.addLife, this);
            G.events.onRemoveLife.add(this.removeLife, this);

            $(document).on('update', this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.GameElapsedTime = G.time.now - G.gameStartTime;

            // adapt fuel indicator
            if (G.GameElapsedTime > G.FUEL_DURATION / 100 + ((G.FUEL_DURATION / 100) * G.fuelCounter)) {
                G.fuelCounter++;
                G.FUEL--;
                G.controlOverlay.y = G.height - 170 + (100 - G.FUEL);
            } else if (G.FUEL <= 0) {
                G.GAME_OVER = true;
            }

            G.GAME_OVER && _this.onGameOver();
            G.GAME_COMPLETED && _this.onGameCompleted();
        },

        /* setupScoreMenu
        --------------------------------------------------------------------------------- */

        setupScoreMenu: function() {
            // score menu
            G.scoreMenu = G.add.group();

            // show score background
            G.pointsPowerupLifes = G.add.sprite(0, 0, 'points_powerup_lifes');
            G.scoreMenu.add(G.pointsPowerupLifes);

            // setup score text placeholder
            G.scoreText = G.add.text(190, 50, '' + G.SCORE + '', {
                font: '48px "planerregular", Arial, sans-serif',
                fill: '#fff'
            });
            G.scoreMenu.add(G.scoreText);

            // setup powerup text placeholder
            G.powerupText = G.add.text(60, 63, '00', {
                font: '42px "planerregular", Arial, sans-serif',
                fill: '#ff8b14'
            });
            G.scoreMenu.add(G.powerupText);

            // setup percentage sign next to text powerup placeholder
            G.powerupTextPercentage = G.add.text(110, 66, '%', {
                font: '20px "planerregular", Arial, sans-serif',
                fill: '#ff8b14'
            });
            G.scoreMenu.add(G.powerupTextPercentage);

            // setup powerup square circle life indicator
            G.powerupLifeIndicator = G.add.sprite(29, 25, 'powerup_life', 34);
            G.scoreMenu.add(G.powerupLifeIndicator);

            // show hearts representing the lifes
            G.lifes = G.add.group();
            G.scoreMenu.add(G.lifes);

            for (var i = 0; i < G.ship.health; i++) {
                G.lifes.create(290 + (i * 20), 12, 'life');
            }

            G.lifes.reverse();
        },

        /* setupFuelMenu
        --------------------------------------------------------------------------------- */

        setupFuelMenu: function() {
            var myMask = G.add.graphics(115, G.height - 120);
            myMask.beginFill();
            myMask.drawCircle(0, 0, 85);
            myMask.endFill();

            G.controls = G.add.group();

            G.controlFuel = G.controls.create(65, G.height - 170, 'control_fuel');
            G.controlFuel.mask = myMask;
            G.controlOverlay = G.controls.create(65, G.height - 170, 'control_fuel', 1);
            G.controlOverlay.mask = myMask;

            G.control_fuel_icon = G.controls.create(10, G.height - 75, 'control_fuel_icon');
            G.controlField = G.controls.create(15, G.height - 220, 'control_field');
        },

        /* setupShootingButton
        --------------------------------------------------------------------------------- */

        setupShootingButton: function() {
            G.shootingButton = G.add.button(G.width - 142, G.height - 199, 'shooting_button', Player.shootBullet, this, 1, 0, 1);

            G.shootingButton.inputEnabled = true;

            G.shootingButton.onInputDown.add(function() {
                G.shootingPressed = true;
            });

            G.shootingButton.onInputUp.add(function() {
                G.shootingPressed = false;
            });
        },

        /* setupPauseButton
        --------------------------------------------------------------------------------- */

        setupPauseButton: function() {
            // setup pause button
            G.pauseButton = G.add.button(G.width - 142, 0, 'pause', this.pausePressed, this, 1, 0, 1);

            G.pauseButton.inputEnabled = true;
            G.pauseButton.events.onInputUp.add(this.pause);

            // Add a input listener that can help us return from being paused
            G.input.onDown.add(this.unpause, self);
        },

        /* pause
        --------------------------------------------------------------------------------- */

        pause: function(w, h) {
            /* Play button sound */
            G.button.play('', 0, 0.5, false);

            var w = G.width / 2 - 400,
                h = G.height / 2 - 357;

            // when the paus button is pressed, we pause the game
            G.isPaused = true;
            G.paused = true;

            // hide score menu
            G.scoreMenu.alpha = 0;
            G.controls.alpha = 0;
            G.shootingButton.alpha = 0;

            Modernizr.touch && $('#joystick-wrapper').hide();

            // then add the menu
            G.pauseMenu = G.add.group();
            G.pauseMenu.create(w, h, 'window');

            G.add.text(440, 110, 'PAUSE', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);

            // score
            G.pauseMenu.create(w + 100, h + 200, 'summary_icons');
            G.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);
            G.add.text(w + 500, h + 210, '' + G.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.pauseMenu);

            // destroyed asteroids
            G.pauseMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);
            G.add.text(w + 500, h + 290, '' + G.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.pauseMenu);

            // game time
            var elapsedTime = (G.time.now - G.gameStartTime) / 1000;

            G.pauseMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);
            G.add.text(w + 500, h + 370, '' + G.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.pauseMenu);

            // restart button
            G.restartButton = G.pauseMenu.create(w + 114, h + 480, 'button');
            G.add.text(w + 162, h + 488, 'RESTART', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);

            // levels button
            G.levelsButton = G.pauseMenu.create(w + 314, h + 480, 'button');
            G.add.text(w + 362, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.pauseMenu);
        },

        /* unpause
        --------------------------------------------------------------------------------- */

        unpause: function(event) {
            /* Play button sound */
            G.button.play('', 0, 0.5, false);

            if (G.paused) {
                Modernizr.touch && $('#joystick-wrapper').show();

                var pauseBtnX1 = G.pauseButton.x,
                    pauseBtnX2 = pauseBtnX1 + G.pauseButton.width,
                    pauseBtnY1 = G.pauseButton.y,
                    pauseBtnY2 = pauseBtnY1 + G.pauseButton.height,
                    levelsBtnX1 = G.levelsButton.x,
                    levelsBtnX2 = levelsBtnX1 + G.levelsButton.width,
                    levelsBtnY1 = G.levelsButton.y,
                    levelsBtnY2 = levelsBtnY1 + G.levelsButton.height,
                    restartBtnX1 = G.restartButton.x,
                    restartBtnX2 = restartBtnX1 + G.restartButton.width,
                    restartBtnY1 = G.restartButton.y,
                    restartBtnY2 = restartBtnY1 + G.restartButton.height;

                // detect if pause button was clicked
                if (event.x > pauseBtnX1 && event.x < pauseBtnX2 && event.y > pauseBtnY1 && event.y < pauseBtnY2) {
                    /* Play button sound */
                    G.button.play('', 0, 0.5, false);
                    G.pauseMenu.destroy();
                    G.scoreMenu.alpha = 1;
                    G.controls.alpha = 1;
                    G.shootingButton.alpha = 1;
                    G.pauseButton.frame = 0;
                    G.isPaused = false;
                    G.paused = false;
                } else if (event.x > levelsBtnX1 && event.x < levelsBtnX2 && event.y > levelsBtnY1 && event.y < levelsBtnY2) {
                    /* Play button sound */
                    G.button.play('', 0, 0.5, false);
                    G.isPaused = false;
                    G.paused = false;
                    G.state.start('levelMenu');
                } else if (event.x > restartBtnX1 && event.x < restartBtnX2 && event.y > restartBtnY1 && event.y < restartBtnY2) {
                    /* Play button sound */
                    G.button.play('', 0, 0.5, false);
                    _this.restartGame();
                }
            }
        },

        /* updateScore
        --------------------------------------------------------------------------------- */

        updateScore: function(score) {
            G.SCORE += score;
            G.scoreText.setText(G.SCORE);
            G.DESTROYED_ASTEROIDS++;
        },

        /* addLife
        --------------------------------------------------------------------------------- */

        addLife: function() {
            if (G.ship.health < G.MAX_LIFES) {
                G.ship.health++;

                var firstLife = G.lifes.getFirstDead();

                G.lifes.forEachDead(function(life) {
                    if (life.z > firstLife.z) {
                        firstLife = life;
                    }
                }, this);

                firstLife.revive();

                /* Show normal state */
                this.setHudNormal();
            }
        },

        /* removeLife
        --------------------------------------------------------------------------------- */

        removeLife: function() {
            G.ship.health--;
            G.lifes.getFirstAlive().kill();

            G.plugins.screenShake.shake(10);

            /* Show critical state */
            if (G.ship.health < 2) {
                this.setHudCritical();
            }

            if (G.ship.health < 1) {
                G.showExplosion(G.ship.x, G.ship.y);
                G.ship.kill();
                G.GAME_OVER = true;
            }
        },

        /* setHudCritical
        --------------------------------------------------------------------------------- */

        setHudCritical: function() {
            G.pointsPowerupLifes.frame = 1;
            G.controlField.frame = 1;
            G.control_fuel_icon.frame = 1;
            G.shootingButton.setFrames(3, 2, 3);
            G.pauseButton.setFrames(3, 2, 3);
            G.lifes.forEachAlive(function(life) {
                life.frame = 1;
            }, this);
        },

        /* setHudNormal
        --------------------------------------------------------------------------------- */

        setHudNormal: function() {
            G.pointsPowerupLifes.frame = 0;
            G.controlField.frame = 0;
            G.control_fuel_icon.frame = 0;
            G.shootingButton.setFrames(1, 0, 1);
            G.pauseButton.setFrames(1, 0, 1);
            G.lifes.forEachAlive(function(life) {
                life.frame = 0;
            }, this);
        },

        /* updatePowerupDuration
        --------------------------------------------------------------------------------- */

        updatePowerupDuration: function(elapsedTime) {
            var percentage = ((G.activePowerup.duration - elapsedTime) * 100) / G.activePowerup.duration;

            percentage = Math.round(percentage) == 100 ? 99 : Math.round(percentage);
            percentage = percentage < 10 ? '0' + percentage : percentage;
            G.powerupText.setText(percentage);

            if (percentage < 100 - ((G.powerupLifeIndicator.frame + 1) * (100 / 36))) {
                G.powerupLifeIndicator.frame += 1;
            }
        },

        /* onGameOver
        --------------------------------------------------------------------------------- */

        onGameOver: function() {
            G.game_background.stop();
            G.game_over.play('', 0, 1, false);

            // hide other hud elements
            this.toggleHudElements(0);
            Modernizr.touch && $('#joystick-wrapper').hide();

            // create game over menu
            G.gameOverMenu = G.add.group();

            var w = G.width / 2 - 400,
                h = G.height / 2 - 357;

            // create background
            G.gameOverMenu.create(w, h, 'window');

            // title text
            G.add.text(365, 110, 'GAME OVER', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);

            // score
            G.gameOverMenu.create(w + 100, h + 200, 'summary_icons');
            G.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);
            G.add.text(w + 500, h + 210, '' + G.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameOverMenu);

            // destroyed asteroids
            G.gameOverMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);
            G.add.text(w + 500, h + 290, '' + G.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameOverMenu);

            // game time
            var elapsedTime = (G.time.now - G.gameStartTime) / 1000;

            G.gameOverMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);
            G.add.text(w + 500, h + 370, '' + G.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameOverMenu);

            // restart button
            G.restartButton = G.add.button(w + 114, h + 480, 'button', this.restartGame, this);
            G.restartButton.inputEnabled = true;
            G.gameOverMenu.add(G.restartButton);
            G.add.text(w + 162, h + 488, 'RESTART', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);

            // levels button
            G.levelsButton = G.add.button(w + 314, h + 480, 'button', function() {
                G.state.start('levelMenu');
            }, this);
            G.levelsButton.inputEnabled = true;
            G.gameOverMenu.add(G.levelsButton);
            G.add.text(w + 362, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameOverMenu);

            G.resetGame();
        },

        /* onGameCompleted
        --------------------------------------------------------------------------------- */

        onGameCompleted: function() {
            G.game_background.stop();
            G.game_victory.play('', 0, 1, false);

            var levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted')) || [];

            if ($.inArray(G.LEVEL_INDEX, levelsCompleted) === -1) {
                levelsCompleted.push(G.LEVEL_INDEX);

                localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
            }

            this.toggleHudElements(0);

            // create game over menu
            G.gameCompletedMenu = G.add.group();

            var w = G.width / 2 - 400,
                h = G.height / 2 - 357;

            // create background
            G.gameCompletedMenu.create(w, h, 'window');

            // title text
            G.add.text(350, 110, 'VICTORY', {
                font: '32px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameCompletedMenu);

            var starsFrame;

            if (G.SCORE > (G.POSSIBLE_SCORE / 4) * 3) {
                starsFrame = 0;
            } else if (G.SCORE > (G.POSSIBLE_SCORE / 4) * 2) {
                starsFrame = 1;
            } else {
                starsFrame = 2;
            }

            /**
             * Store level score
             *
             */

            var levels = JSON.parse(localStorage.getItem('levels')) || [],
                exists = false;

            /**
             * Update stored level
             * The current level is already stored, we need to update it
             */

            levels = $.each(levels, function(index, level) {
                if (level.index === G.level.LEVEL_INDEX) {
                    level.starsFrame = starsFrame < level.starsFrame ? starsFrame : level.starsFrame;
                    level.score = level.score < G.SCORE ? G.SCORE : level.score;
                    exists = true;
                }

                return level;
            });

            /**
             * Store new Level
             * The current level is not yet stored
             */

            if (!exists) {
                levels.push({
                    index: G.level.LEVEL_INDEX,
                    score: G.SCORE,
                    starsFrame: starsFrame
                });
            }

            localStorage.setItem('levels', JSON.stringify(levels));

            // display stars
            G.gameCompletedMenu.create(580, 112, 'stars_big', starsFrame);

            // score
            G.gameCompletedMenu.create(w + 100, h + 200, 'summary_icons');
            G.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameCompletedMenu);
            G.add.text(w + 500, h + 210, '' + G.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameCompletedMenu);

            // destroyed asteroids
            G.gameCompletedMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameCompletedMenu);
            G.add.text(w + 500, h + 290, '' + G.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameCompletedMenu);

            // game time
            var elapsedTime = (G.time.now - G.gameStartTime) / 1000;

            G.gameCompletedMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameCompletedMenu);
            G.add.text(w + 500, h + 370, '' + G.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.gameCompletedMenu);

            // restart button
            G.restartButton = G.add.button(w + 114, h + 480, 'button', function() {
                G.state.start('levelMenu');
            }, this);
            G.restartButton.inputEnabled = true;
            G.gameCompletedMenu.add(G.restartButton);
            G.add.text(w + 162, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.gameCompletedMenu);

            G.resetGame();
        },

        /* restartGame
        --------------------------------------------------------------------------------- */

        restartGame: function() {
            G.resetGame();

            /* Show normal state */
            this.setHudNormal();

            // show other hud elements
            this.toggleHudElements(1);

            // reset ship
            G.ship.revive(G.NUMBER_OF_LIFES);

            // destroy game over menu
            G.gameOverMenu && G.gameOverMenu.destroy();
            G.pauseMenu && G.pauseMenu.destroy();
            G.GAME_OVER = false;
            G.paused = false;

            // reset game start time
            G.gameStartTime = G.time.now;

            G.game_over.stop();
            G.game_background.play('', 0, 1, true);
        },

        /* toggleHudElements
        --------------------------------------------------------------------------------- */

        toggleHudElements: function(alpha) {
            G.scoreMenu.alpha = alpha;
            G.controls.alpha = alpha;
            G.pauseButton.alpha = alpha;
            G.shootingButton.alpha = alpha;

            Modernizr.touch && $('#joystick-wrapper').toggle();
        }
    };

    return Hud;
});
