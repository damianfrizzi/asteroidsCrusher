/* ------------------------------------------------------------------------------
powerups.js
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var blinkTimer = 0;

    var G, _this, Powerups = function(obj) {
        G = obj;

        _this = this;
        _this.init();
    };

    Powerups.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            /* Generate powerups*/
            G.game.powerups = G.game.add.group();

            for (var i = 0; i < G.game.powerupsObjects.length; i++) {
                var randomPos = G.game.getRandomStartingPosition(),
                    powerupObj = G.game.powerupsObjects[i],
                    powerup = G.game.powerups.create(randomPos.x, randomPos.y, 'powerups');

                G.game.physics.enable(powerup, Phaser.Physics.ARCADE);

                powerup.index = i;
                powerup.name = powerupObj.name;
                powerup.duration = powerupObj.duration;
                powerup.frame = powerupObj.frame;
                powerup.body.immovable = true;
                powerup.checkWorldBounds = true;
                powerup.outOfBoundsKill = true;
                powerup.kill();
            }

            $(document).on('update', this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.game.physics.arcade.overlap(G.game.ship, G.game.powerups, _this.powerupHit);

            if (G.game.activePowerup !== undefined) {
                if (G.game.activePowerup.name === 'shield') {

                    /* Shield powerup logic
                    --------------------------------------------------------------------------------- */

                    G.game.activePowerup.x = G.game.ship.x;
                    G.game.activePowerup.y = G.game.ship.y;
                    G.game.activePowerup.angle += 1;

                    blinkTimer += G.game.time.elapsed;

                    var elapsedTime = G.game.time.now - G.game.activePowerup.creationTime;

                    G.game.events.onUpdatePowerupDuration.dispatch(elapsedTime);

                    if (elapsedTime >= G.game.activePowerup.duration) {
                        G.game.activePowerup.kill();
                        G.game.powerUpIndicator.kill();
                        G.game.activePowerup = undefined;
                    } else {
                        /**
                         * Shield blink animation
                         * If 60 percent of the powerup duration time has been reached, start the 
                         * blink animation in a 500ms interval
                         */
                            
                        if (blinkTimer >= 500 && elapsedTime > (0.6 * G.game.activePowerup.duration)) {
                            blinkTimer -= 500;

                            var powerupFadeOut = G.game.add.tween(G.game.activePowerup);

                            powerupFadeOut.to({
                                alpha: 0.2
                            }, 200, Phaser.Easing.Linear.Out);

                            powerupFadeOut.onComplete.add(function() {
                                /* Check again as during the fadeOut the shield could have been destroyed */
                                if (G.game.activePowerup === undefined) return;

                                var powerupFadeIn = G.game.add.tween(G.game.activePowerup);

                                powerupFadeIn.to({
                                    alpha: 1
                                }, 200, Phaser.Easing.Linear.Out);

                                powerupFadeIn.start();
                            }, this);

                            powerupFadeOut.start();
                        }
                    }
                } else if (G.game.activePowerup.name === 'bxRocket' || G.game.activePowerup.name === 'doubleBullet') {

                    /* bxRocket logic
                    --------------------------------------------------------------------------------- */              

                    var elapsedTime = G.game.time.now - G.game.activePowerup.creationTime;

                    G.game.events.onUpdatePowerupDuration.dispatch(elapsedTime);

                    if (elapsedTime >= G.game.activePowerup.duration) {
                        _this.killActivePowerup();
                    }
                }
            }

            /* Create delay between the appearing of the powerups */
            if (G.game.lastPowerupAt === undefined) G.game.lastPowerupAt = 0;
            if (G.game.time.now - G.game.lastPowerupAt < G.game.POWERUPS_DELAY) return;
            G.game.lastPowerupAt = G.game.time.now;

            if (G.game.FUEL < 30) {
                /* If the fuel is low, create a fuel powerup to give the user a chance to survive */
                var randomPos = G.game.getRandomStartingPosition(),
                    powerupObj = G.game.powerupsObjects[3],
                    powerup = G.game.powerups.create(randomPos.x, randomPos.y, 'powerups');

                G.game.physics.enable(powerup, Phaser.Physics.ARCADE);

                powerup.index = 3;
                powerup.name = powerupObj.name;
                powerup.duration = powerupObj.duration;
                powerup.frame = powerupObj.frame;
                powerup.body.immovable = true;
            } else {
                /* Get a dead powerup from the pool */
                var powerup = Phaser.Math.getRandom(G.game.powerups.children.filter(function(e) {
                    return !e.alive;
                }));

                /* If there aren't any powerups available, do nothing */
                if (powerup === null || powerup === undefined) return;

                var randomPos = G.game.getRandomStartingPosition();

                powerup.position.x = randomPos.x;
                powerup.position.y = randomPos.y;

                /* Revive the powerup */
                powerup.revive();
            }

            /* Let the powerup move in the direction of the current ship position */
            G.game.physics.arcade.moveToObject(powerup, G.game.ship, G.game.getRandomInt(G.game.ENEMY_MIN_SPEED, G.game.ENEMY_MAX_SPEED));
        },

        /* powerupHit
        --------------------------------------------------------------------------------- */

        powerupHit: function(ship, powerup) {
            /* Don't do anything if full life and powerup was a life */
            if (powerup.name === 'life' && G.game.ship.health >= G.game.MAX_LIFES) return;

            /* Play audio */
            G.game.itemCollect.play();

            if (powerup.name === 'life') {
                /* life powerup */
                G.game.events.onAddLife.dispatch();
            } else if (powerup.name === 'shield') {
                /* shield powerup */
                _this.killActivePowerup();

                // add shield and store properties from its powerupsObjects refference
                G.game.activePowerup = G.game.add.sprite(G.game.ship.x, G.game.ship.y, 'shield');
                G.game.activePowerup.name = powerup.name
                G.game.activePowerup.duration = powerup.duration;
                G.game.activePowerup.creationTime = G.game.time.now;
                G.game.activePowerup.anchor.setTo(0.5, 0.5);
                G.game.physics.enable(G.game.activePowerup, Phaser.Physics.ARCADE);
                G.game.powerUpIndicator = G.game.add.image(31, 23, 'shield_single');
            } else if (powerup.name === 'doubleBullet') {
                /* doubleBullet powerup */
                _this.killActivePowerup();

                G.game.WEAPON = 'doubleBullet';

                G.game.activePowerup = {
                    name: 'doubleBullet',
                    duration: powerup.duration,
                    creationTime: G.game.time.now,
                    kill: function() {
                        G.game.WEAPON = 'bullet';
                    }
                };

                G.game.powerUpIndicator = G.game.add.image(31, 23, 'double_bullet_single');
                G.game.ship.loadTexture('ship_multiple_guns', 0);
            } else if (powerup.name === 'bxRocket') {
                /* bxRocket powerup */
                _this.killActivePowerup();

                G.game.WEAPON = 'bxRocket';

                G.game.activePowerup = {
                    name: 'bxRocket',
                    duration: powerup.duration,
                    creationTime: G.game.time.now,
                    kill: function() {
                        G.game.WEAPON = 'bullet';
                    }
                };

                G.game.powerUpIndicator = G.game.add.image(31, 23, 'bx_rocket_single');
                G.game.ship.loadTexture('ship_multiple_guns', 0);
            } else if (powerup.name === 'fuel') {
                /* fuel powerup */
                G.game.FUEL = G.game.FUEL + 50 > 100 ? 100 : G.game.FUEL + 50;
            } else if (powerup.name === 'destroyAll') {
                /* destroyAll powerup */
                G.game.enemies.forEachAlive(function(enemy) {
                    G.game.events.onUpdateScore.dispatch(enemy.score);
                    G.game.showExplosion(enemy.x, enemy.y);
                    enemy.kill();
                });
            }

            G.game.powerupLifeIndicator.frame = 0;
            powerup.kill();
        },

        /* killActivePowerup
        --------------------------------------------------------------------------------- */

        killActivePowerup: function() {
            if (G.game.activePowerup) {
                G.game.activePowerup.kill();
                G.game.powerUpIndicator.kill();
                G.game.activePowerup = undefined;
                G.game.WEAPPON = 'bullet';
                G.game.ship.loadTexture(G.game.SHIP, 0);
            }
        }
    };

    return Powerups;

});
