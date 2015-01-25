/* ------------------------------------------------------------------------------
powerups.js
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var blinkTimer = 0;

    var G, _this, Powerups = function(obj) {
        G = obj.game;

        _this = this;
        _this.init();
    };

    Powerups.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            /* Generate powerups*/
            G.powerups = G.add.group();

            for (var i = 0; i < G.powerupsObjects.length; i++) {
                var randomPos = G.getRandomStartingPosition(),
                    powerupObj = G.powerupsObjects[i],
                    powerup = G.powerups.create(randomPos.x, randomPos.y, 'powerups');

                G.physics.enable(powerup, Phaser.Physics.ARCADE);

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
            G.physics.arcade.overlap(G.ship, G.powerups, _this.powerupHit);

            if (G.activePowerup !== undefined) {
                if (G.activePowerup.name === 'shield') {

                    /* Shield powerup logic
                    --------------------------------------------------------------------------------- */

                    G.activePowerup.x = G.ship.x;
                    G.activePowerup.y = G.ship.y;
                    G.activePowerup.angle += 1;

                    blinkTimer += G.time.elapsed;

                    var elapsedTime = G.time.now - G.activePowerup.creationTime;

                    G.events.onUpdatePowerupDuration.dispatch(elapsedTime);

                    if (elapsedTime >= G.activePowerup.duration) {
                        G.activePowerup.kill();
                        G.powerUpIndicator.kill();
                        G.activePowerup = undefined;
                    } else {
                        /**
                         * Shield blink animation
                         * If 60 percent of the powerup duration time has been reached, start the
                         * blink animation in a 500ms interval
                         */

                        if (blinkTimer >= 500 && elapsedTime > (0.6 * G.activePowerup.duration)) {
                            blinkTimer -= 500;

                            var powerupFadeOut = G.add.tween(G.activePowerup);

                            powerupFadeOut.to({
                                alpha: 0.2
                            }, 200, Phaser.Easing.Linear.Out);

                            powerupFadeOut.onComplete.add(function() {
                                /* Check again as during the fadeOut the shield could have been destroyed */
                                if (G.activePowerup === undefined) return;

                                var powerupFadeIn = G.add.tween(G.activePowerup);

                                powerupFadeIn.to({
                                    alpha: 1
                                }, 200, Phaser.Easing.Linear.Out);

                                powerupFadeIn.start();
                            }, this);

                            powerupFadeOut.start();
                        }
                    }
                } else if (G.activePowerup.name === 'bxRocket' || G.activePowerup.name === 'doubleBullet') {

                    /* bxRocket logic
                    --------------------------------------------------------------------------------- */

                    var elapsedTime = G.time.now - G.activePowerup.creationTime;

                    G.events.onUpdatePowerupDuration.dispatch(elapsedTime);

                    if (elapsedTime >= G.activePowerup.duration) {
                        _this.killActivePowerup();
                    }
                }
            }

            /* Create delay between the appearing of the powerups */
            if (G.lastPowerupAt === undefined) G.lastPowerupAt = 0;
            if (G.time.now - G.lastPowerupAt < G.POWERUPS_DELAY) return;
            G.lastPowerupAt = G.time.now;

            if (G.FUEL < 30) {
                /* If the fuel is low, create a fuel powerup to give the user a chance to survive */
                var randomPos = G.getRandomStartingPosition(),
                    powerupObj = G.powerupsObjects[3],
                    powerup = G.powerups.create(randomPos.x, randomPos.y, 'powerups');

                G.physics.enable(powerup, Phaser.Physics.ARCADE);

                powerup.index = 3;
                powerup.name = powerupObj.name;
                powerup.duration = powerupObj.duration;
                powerup.frame = powerupObj.frame;
                powerup.body.immovable = true;
            } else {
                /* Get a dead powerup from the pool */
                var powerup = Phaser.Math.getRandom(G.powerups.children.filter(function(e) {
                    if (G.BOSS_SHOWN) {
                        return !e.alive && e.name !== 'destroyAll';
                    } else {
                        return !e.alive;
                    }
                }));

                /* If there aren't any powerups available, do nothing */
                if (powerup === null || powerup === undefined) return;

                var randomPos = G.getRandomStartingPosition();

                powerup.position.x = randomPos.x;
                powerup.position.y = randomPos.y;

                /* Revive the powerup */
                powerup.revive();
            }

            /* Let the powerup move in the direction of the current ship position */
            G.physics.arcade.moveToObject(powerup, G.ship, G.rnd.integerInRange(G.ENEMY_MIN_SPEED, G.ENEMY_MAX_SPEED));
        },

        /* powerupHit
        --------------------------------------------------------------------------------- */

        powerupHit: function(ship, powerup) {
            /* Don't do anything if full life and powerup was a life */
            if (powerup.name === 'life' && G.ship.health >= G.MAX_LIFES) return;

            /* Play audio */
            G.itemCollect.play();

            if (powerup.name === 'life') {
                /* life powerup */
                G.events.onAddLife.dispatch();
            } else if (powerup.name === 'shield') {
                /* shield powerup */
                _this.killActivePowerup();

                // add shield and store properties from its powerupsObjects refference
                G.activePowerup = G.add.sprite(G.ship.x, G.ship.y, 'shield');
                G.activePowerup.name = powerup.name
                G.activePowerup.duration = powerup.duration;
                G.activePowerup.creationTime = G.time.now;
                G.activePowerup.anchor.setTo(0.5, 0.5);
                G.physics.enable(G.activePowerup, Phaser.Physics.ARCADE);
                G.powerUpIndicator = G.add.image(31, 23, 'shield_single');
            } else if (powerup.name === 'doubleBullet') {
                /* doubleBullet powerup */
                _this.killActivePowerup();

                G.WEAPON = 'doubleBullet';

                G.activePowerup = {
                    name: 'doubleBullet',
                    duration: powerup.duration,
                    creationTime: G.time.now,
                    kill: function() {
                        G.WEAPON = 'bullet';
                    }
                };

                G.powerUpIndicator = G.add.image(31, 23, 'double_bullet_single');
                G.ship.loadTexture('ship_multiple_guns', 0);
            } else if (powerup.name === 'bxRocket') {
                /* bxRocket powerup */
                _this.killActivePowerup();

                G.WEAPON = 'bxRocket';

                G.activePowerup = {
                    name: 'bxRocket',
                    duration: powerup.duration,
                    creationTime: G.time.now,
                    kill: function() {
                        G.WEAPON = 'bullet';
                    }
                };

                G.powerUpIndicator = G.add.image(31, 23, 'bx_rocket_single');
                G.ship.loadTexture('ship_multiple_guns', 0);
            } else if (powerup.name === 'fuel') {
                /* fuel powerup */
                G.FUEL = G.FUEL + 50 > 100 ? 100 : G.FUEL + 50;
            } else if (powerup.name === 'destroyAll') {
                /* destroyAll powerup */
                G.enemies.forEachAlive(function(enemy) {
                    G.events.onUpdateScore.dispatch(enemy.score);
                    G.showExplosion(enemy.x, enemy.y);
                    enemy.kill();
                });
            }

            G.powerupLifeIndicator.frame = 0;
            powerup.kill();
        },

        /* killActivePowerup
        --------------------------------------------------------------------------------- */

        killActivePowerup: function() {
            if (G.activePowerup) {
                G.activePowerup.kill();
                G.powerUpIndicator.kill();
                G.activePowerup = undefined;
                G.WEAPPON = 'bullet';
                G.ship.loadTexture(G.SHIP, 0);
            }
        }
    };

    return Powerups;

});
