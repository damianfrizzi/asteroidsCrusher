/* ------------------------------------------------------------------------------
hud.js

Setup heads up display
--------------------------------------------------------------------------------- */

define(['player'], function(Player) {

    'use strict';

    var G, _this, Hud = function(obj) {
        G = obj;

        _this = this;
        _this.init();
    };

    Hud.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            _this.setupScoreMenu();
            _this.setupFuelMenu();
            _this.setupShootingButton();
            _this.setupPauseButton();

            G.game.events.onUpdateScore = new Phaser.Signal();
            G.game.events.onUpdatePowerupDuration = new Phaser.Signal();
            G.game.events.onAddLife = new Phaser.Signal();
            G.game.events.onRemoveLife = new Phaser.Signal();

            G.game.events.onUpdateScore.add(_this.updateScore, this);
            G.game.events.onUpdatePowerupDuration.add(_this.updatePowerupDuration, this);
            G.game.events.onAddLife.add(_this.addLife, this);
            G.game.events.onRemoveLife.add(_this.removeLife, this);

            $(document).on('update', _this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.game.GameElapsedTime = G.game.time.now - G.game.gameStartTime;

            // adapt fuel indicator
            if (G.game.GameElapsedTime > G.game.FUEL_DURATION / 100 + ((G.game.FUEL_DURATION / 100) * G.game.fuelCounter)) {
                G.game.fuelCounter++;
                G.game.FUEL--;
                G.game.controlOverlay.y = G.game.height - 170 + (100 - G.game.FUEL);
            } else if (G.game.FUEL <= 0) {
                G.game.GAME_OVER = true;
            }

            // G.game.GAME_COMPLETED = true;

            G.game.GAME_OVER && _this.onGameOver();
            G.game.GAME_COMPLETED && _this.onGameCompleted();
        },

        /* setupScoreMenu
        --------------------------------------------------------------------------------- */

        setupScoreMenu: function() {
            // score menu
            G.game.scoreMenu = G.game.add.group();

            // show score background
            G.game.pointsPowerupLifes = G.game.add.sprite(0, 0, 'points_powerup_lifes');
            G.game.scoreMenu.add(G.game.pointsPowerupLifes);

            // setup score text placeholder
            G.game.scoreText = G.game.add.text(190, 50, '' + G.game.SCORE + '', {
                font: '48px "planerregular", Arial, sans-serif',
                fill: '#fff'
            });
            G.game.scoreMenu.add(G.game.scoreText);

            // setup powerup text placeholder
            G.game.powerupText = G.game.add.text(60, 63, '00', {
                font: '42px "planerregular", Arial, sans-serif',
                fill: '#ff8b14'
            });
            G.game.scoreMenu.add(G.game.powerupText);

            // setup percentage sign next to text powerup placeholder
            G.game.powerupTextPercentage = G.game.add.text(110, 66, '%', {
                font: '20px "planerregular", Arial, sans-serif',
                fill: '#ff8b14'
            });
            G.game.scoreMenu.add(G.game.powerupTextPercentage);

            // setup powerup square circle life indicator
            G.game.powerupLifeIndicator = G.game.add.sprite(29, 25, 'powerup_life');
            G.game.scoreMenu.add(G.game.powerupLifeIndicator);

            // show hearts representing the lifes
            G.game.lifes = G.game.add.group();
            G.game.scoreMenu.add(G.game.lifes);

            for (var i = 0; i < G.game.ship.health; i++) {
                G.game.lifes.create(290 + (i * 20), 12, 'life');
            }

            G.game.lifes.reverse();
        },

        /* setupFuelMenu
        --------------------------------------------------------------------------------- */

        setupFuelMenu: function() {
            var myMask = G.game.add.graphics(115, G.game.height - 120);
            myMask.beginFill();
            myMask.drawCircle(0, 0, 85);
            myMask.endFill();

            G.game.controls = G.game.add.group();

            G.game.controlFuel = G.game.controls.create(65, G.game.height - 170, 'control_fuel');
            G.game.controlFuel.mask = myMask;
            G.game.controlOverlay = G.game.controls.create(65, G.game.height - 170, 'control_fuel', 1);
            G.game.controlOverlay.mask = myMask;

            G.game.control_fuel_icon = G.game.controls.create(10, G.game.height - 75, 'control_fuel_icon');
            G.game.controlField = G.game.controls.create(15, G.game.height - 220, 'control_field');
        },

        /* setupShootingButton
        --------------------------------------------------------------------------------- */

        setupShootingButton: function() {
            G.game.shootingButton = G.game.add.button(G.game.width - 142, G.game.height - 199, 'shooting_button', Player.shootBullet, this, 1, 0, 1);

            G.game.shootingButton.inputEnabled = true;

            G.game.shootingButton.onInputDown.add(function() {
                G.game.shootingPressed = true;
            });

            G.game.shootingButton.onInputUp.add(function() {
                G.game.shootingPressed = false;
            });
        },

        /* setupPauseButton
        --------------------------------------------------------------------------------- */

        setupPauseButton: function() {
            // setup pause button
            G.game.pauseButton = G.game.add.button(G.game.width - 142, 0, 'pause', _this.pausePressed, this, 1, 0, 1);

            G.game.pauseButton.inputEnabled = true;
            G.game.pauseButton.events.onInputUp.add(_this.pause);

            // Add a input listener that can help us return from being paused
            G.game.input.onDown.add(_this.unpause, self);
        },

        /* pause
        --------------------------------------------------------------------------------- */

        pause: function(w, h) {
            var w = G.game.width / 2 - 400,
                h = G.game.height / 2 - 357;

            // when the paus button is pressed, we pause the game
            G.game.isPaused = true;
            G.game.paused = true;

            // hide score menu
            G.game.scoreMenu.alpha = 0;
            G.game.controls.alpha = 0;
            G.game.shootingButton.alpha = 0;

            Modernizr.touch && $('#joystick-wrapper').hide();

            // then add the menu
            G.game.pauseMenu = G.game.add.group();
            G.game.pauseMenu.create(w, h, 'window');

            G.game.add.text(440, 110, 'PAUSE', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);

            // score
            G.game.pauseMenu.create(w + 100, h + 200, 'summary_icons');
            G.game.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);
            G.game.add.text(w + 500, h + 210, '' + G.game.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.pauseMenu);

            // destroyed asteroids
            G.game.pauseMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.game.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);
            G.game.add.text(w + 500, h + 290, '' + G.game.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.pauseMenu);

            // game time
            var elapsedTime = (G.game.time.now - G.game.gameStartTime) / 1000;

            G.game.pauseMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.game.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);
            G.game.add.text(w + 500, h + 370, '' + G.game.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.pauseMenu);

            // restart button  
            G.game.restartButton = G.game.pauseMenu.create(w + 114, h + 480, 'button');
            G.game.add.text(w + 162, h + 488, 'RESTART', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);

            // levels button
            G.game.levelsButton = G.game.pauseMenu.create(w + 314, h + 480, 'button');
            G.game.add.text(w + 362, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.pauseMenu);
        },

        /* unpause
        --------------------------------------------------------------------------------- */

        unpause: function(event) {
            if (G.game.paused) {
                Modernizr.touch && $('#joystick-wrapper').show();

                var pauseBtnX1 = G.game.pauseButton.x,
                    pauseBtnX2 = pauseBtnX1 + G.game.pauseButton.width,
                    pauseBtnY1 = G.game.pauseButton.y,
                    pauseBtnY2 = pauseBtnY1 + G.game.pauseButton.height,
                    levelsBtnX1 = G.game.levelsButton.x,
                    levelsBtnX2 = levelsBtnX1 + G.game.levelsButton.width,
                    levelsBtnY1 = G.game.levelsButton.y,
                    levelsBtnY2 = levelsBtnY1 + G.game.levelsButton.height,
                    restartBtnX1 = G.game.restartButton.x,
                    restartBtnX2 = restartBtnX1 + G.game.restartButton.width,
                    restartBtnY1 = G.game.restartButton.y,
                    restartBtnY2 = restartBtnY1 + G.game.restartButton.height;

                // detect if pause button was clicked
                if (event.x > pauseBtnX1 && event.x < pauseBtnX2 && event.y > pauseBtnY1 && event.y < pauseBtnY2) {
                    G.game.pauseMenu.destroy();
                    G.game.scoreMenu.alpha = 1;
                    G.game.controls.alpha = 1;
                    G.game.shootingButton.alpha = 1;
                    G.game.pauseButton.frame = 0;
                    G.game.isPaused = false;
                    G.game.paused = false;
                } else if (event.x > levelsBtnX1 && event.x < levelsBtnX2 && event.y > levelsBtnY1 && event.y < levelsBtnY2) {
                    G.game.isPaused = false;
                    G.game.paused = false;
                    G.game.state.start('levelMenu');
                } else if (event.x > restartBtnX1 && event.x < restartBtnX2 && event.y > restartBtnY1 && event.y < restartBtnY2) {
                    _this.restartGame();
                }
            }
        },

        /* updateScore
        --------------------------------------------------------------------------------- */

        updateScore: function(score) {
            G.game.SCORE += score;
            G.game.scoreText.setText(G.game.SCORE);
            G.game.DESTROYED_ASTEROIDS++;
        },

        /* addLife
        --------------------------------------------------------------------------------- */

        addLife: function() {
            if (G.game.ship.health < G.game.MAX_LIFES) {
                G.game.ship.health++;
                G.game.lifes.getFirstDead().revive();
            }
        },

        /* removeLife
        --------------------------------------------------------------------------------- */

        removeLife: function() {
            G.game.ship.health--;
            G.game.lifes.getFirstAlive().kill();

            G.game.plugins.screenShake.shake(10);

            if (G.game.ship.health < 1) {
                G.game.showExplosion(G.game.ship.x, G.game.ship.y);
                G.game.ship.kill();
                G.game.GAME_OVER = true;
            }
        },

        /* updatePowerupDuration
        --------------------------------------------------------------------------------- */

        updatePowerupDuration: function(elapsedTime) {
            var percentage = ((G.game.activePowerup.duration - elapsedTime) * 100) / G.game.activePowerup.duration;

            percentage = Math.round(percentage) == 100 ? 99 : Math.round(percentage);
            percentage = percentage < 10 ? '0' + percentage : percentage;
            G.game.powerupText.setText(percentage);

            if (percentage < 100 - ((G.game.powerupLifeIndicator.frame + 1) * (100 / 36))) {
                G.game.powerupLifeIndicator.frame += 1;
            }
        },

        /* onGameOver
        --------------------------------------------------------------------------------- */

        onGameOver: function() {
            G.game.game_background.stop();
            G.game.game_over.play('', 0, 1, false);

            // hide other hud elements
            _this.toggleHudElements(0);
            Modernizr.touch && $('#joystick-wrapper').hide();

            // create game over menu
            G.game.gameOverMenu = G.game.add.group();

            var w = G.game.width / 2 - 400,
                h = G.game.height / 2 - 357;

            // create background
            G.game.gameOverMenu.create(w, h, 'window');

            // title text
            G.game.add.text(365, 110, 'GAME OVER', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);

            // score
            G.game.gameOverMenu.create(w + 100, h + 200, 'summary_icons');
            G.game.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);
            G.game.add.text(w + 500, h + 210, '' + G.game.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameOverMenu);

            // destroyed asteroids
            G.game.gameOverMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.game.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);
            G.game.add.text(w + 500, h + 290, '' + G.game.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameOverMenu);

            // game time
            var elapsedTime = (G.game.time.now - G.game.gameStartTime) / 1000;

            G.game.gameOverMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.game.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);
            G.game.add.text(w + 500, h + 370, '' + G.game.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameOverMenu);

            // restart button
            G.game.restartButton = G.game.add.button(w + 114, h + 480, 'button', _this.restartGame, this);
            G.game.restartButton.inputEnabled = true;
            G.game.gameOverMenu.add(G.game.restartButton);
            G.game.add.text(w + 162, h + 488, 'RESTART', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);

            // levels button
            G.game.levelsButton = G.game.add.button(w + 314, h + 480, 'button', function() {
                G.game.state.start('levelMenu');
            }, this);
            G.game.levelsButton.inputEnabled = true;
            G.game.gameOverMenu.add(G.game.levelsButton);
            G.game.add.text(w + 362, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameOverMenu);

            G.game.resetGame();
        },

        /* onGameCompleted
        --------------------------------------------------------------------------------- */

        onGameCompleted: function() {
            G.game.game_background.stop();
            G.game.game_victory.play('', 0, 1, false);

            var levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted')) || [];

            if ($.inArray(G.game.LEVEL_INDEX, levelsCompleted) === -1) {
                levelsCompleted.push(G.game.LEVEL_INDEX);

                localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
            }

            _this.toggleHudElements(0);

            // create game over menu
            G.game.gameCompletedMenu = G.game.add.group();

            var w = G.game.width / 2 - 400,
                h = G.game.height / 2 - 357;

            // create background
            G.game.gameCompletedMenu.create(w, h, 'window');

            // title text
            G.game.add.text(350, 110, 'VICTORY', {
                font: '32px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameCompletedMenu);

            var starsFrame;

            if (G.game.SCORE > (G.game.POSSIBLE_SCORE / 4) * 3) {
                starsFrame = 0;
            } else if (G.game.SCORE > (G.game.POSSIBLE_SCORE / 4) * 2) {
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
                if (level.index === G.game.level.LEVEL_INDEX) {
                    level.starsFrame = starsFrame < level.starsFrame ? starsFrame : level.starsFrame;
                    level.score = level.score < G.game.SCORE ? G.game.SCORE : level.score;
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
                    index: G.game.level.LEVEL_INDEX,
                    score: G.game.SCORE,
                    starsFrame: starsFrame
                });
            }

            localStorage.setItem('levels', JSON.stringify(levels));


            // // store level score
            // var levelIndex = JSON.parse(localStorage.getItem('activeLevel')).LEVEL_INDEX,
            //     levelsScore = JSON.parse(localStorage.getItem('levelScore')) || [],
            //     exists = false;

            // levelsScore = $.each(levelsScore, function(index, levelScore) {
            //     if (levelScore.LEVEL_INDEX === levelIndex) {
            //         levelScore.STARS_FRAME = starsFrame < levelScore.STARS_FRAME ? starsFrame : levelScore.STARS_FRAME;
            //         levelScore.SCORE = levelScore.SCORE < G.game.SCORE ? G.game.SCORE : levelScore.SCORE;
            //         exists = true;
            //     }

            //     return levelScore;
            // });

            // if (!exists) {
            //     levelsScore.push({
            //         'LEVEL_INDEX': levelIndex,
            //         'STARS_FRAME': starsFrame,
            //         'SCORE': G.game.SCORE
            //     });
            // }

            // localStorage.setItem('levelScore', JSON.stringify(levelsScore));

            // display stars
            G.game.gameCompletedMenu.create(580, 112, 'stars_big', starsFrame);

            // score
            G.game.gameCompletedMenu.create(w + 100, h + 200, 'summary_icons');
            G.game.add.text(w + 170, h + 220, 'POINTS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameCompletedMenu);
            G.game.add.text(w + 500, h + 210, '' + G.game.SCORE + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameCompletedMenu);

            // destroyed asteroids
            G.game.gameCompletedMenu.create(w + 100, h + 280, 'summary_icons', 1);
            G.game.add.text(w + 170, h + 300, 'DESTROYED ASTEROIDS:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameCompletedMenu);
            G.game.add.text(w + 500, h + 290, '' + G.game.DESTROYED_ASTEROIDS + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameCompletedMenu);

            // game time
            var elapsedTime = (G.game.time.now - G.game.gameStartTime) / 1000;

            G.game.gameCompletedMenu.create(w + 100, h + 360, 'summary_icons', 3);
            G.game.add.text(w + 170, h + 380, 'GAME TIME:', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameCompletedMenu);
            G.game.add.text(w + 500, h + 370, '' + G.game.secondsToString(elapsedTime) + '', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#00fcf1'
            }, G.game.gameCompletedMenu);

            // restart button
            G.game.restartButton = G.game.add.button(w + 114, h + 480, 'button', function() {
                G.game.state.start('levelMenu');
            }, this);
            G.game.restartButton.inputEnabled = true;
            G.game.gameCompletedMenu.add(G.game.restartButton);
            G.game.add.text(w + 162, h + 488, 'LEVELS', {
                font: '18px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, G.game.gameCompletedMenu);

            G.game.resetGame();
        },

        /* restartGame
        --------------------------------------------------------------------------------- */

        restartGame: function() {
            G.game.resetGame();

            // show other hud elements
            _this.toggleHudElements(1);

            // reset ship
            G.game.ship.revive(G.game.NUMBER_OF_LIFES);

            // destroy game over menu
            G.game.gameOverMenu && G.game.gameOverMenu.destroy();
            G.game.pauseMenu && G.game.pauseMenu.destroy();
            G.game.GAME_OVER = false;
            G.game.paused = false;

            // reset game start time
            G.game.gameStartTime = G.game.time.now;

            G.game.game_over.stop();
            G.game.game_background.play('', 0, 1, true);
        },

        /* toggleHudElements
        --------------------------------------------------------------------------------- */

        toggleHudElements: function(alpha) {
            G.game.scoreMenu.alpha = alpha;
            G.game.controls.alpha = alpha;
            G.game.pauseButton.alpha = alpha;
            G.game.shootingButton.alpha = alpha;

            Modernizr.touch && $('#joystick-wrapper').toggle();
        }
    };

    return Hud;
});
