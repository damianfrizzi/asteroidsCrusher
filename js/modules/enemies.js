/* ------------------------------------------------------------------------------
enemies.js

Whole enemies logic
--------------------------------------------------------------------------------- */

define(['hud'], function(Hud) {

    'use strict';

    var G, _this,
        Enemies = function(obj) {
            G = obj;

            _this = this;
            _this.init();
        };

    Enemies.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            G.game.explosionGroup = G.game.add.group();

            _this.createRandomEnemy();
            _this.createBoss();

            $(document).on('update', _this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.game.physics.arcade.collide(G.game.bulletsPool, G.game.enemies, _this.shotHitsEnemy);
            G.game.physics.arcade.collide(G.game.bxRocketsPool, G.game.enemies, _this.shotHitsEnemy);
            G.game.physics.arcade.collide(G.game.doubleBulletsPool, G.game.enemies, _this.shotHitsEnemy);
            G.game.physics.arcade.collide(G.game.ship, G.game.enemies, _this.shipHitsEnemy);

            if (G.game.time.now - G.game.gameStartTime > G.game.LEVEL_DURATION && !G.game.BOSS_SHOWN) {
                /**
                 * When level time is over
                 * Show with the next iteration once level time is over
                 *
                 * @todo Change sound to be more dramatic
                 */
                G.game.BOSS_SHOWN = true;
                /* Revive boss with 8 lifes */
                G.game.boss.revive(8);
                G.game.boss.bringToTop();

                /* Kill all living enemies */
                G.game.enemies.forEachAlive(function(enemy) {
                    G.game.showExplosion(enemy.x, enemy.y);
                    enemy.kill();
                });
                G.game.lastEnemyAt = 0;
            } else if (G.game.BOSS_SHOWN) {

                /* Boss is visible
                --------------------------------------------------------------------------------- */

                /* Shot hits boss/shop */
                G.game.physics.arcade.overlap(G.game.bossBulletsPool, G.game.ship, _this.shotHitsShip);
                G.game.physics.arcade.collide(G.game.bulletsPool, G.game.boss, _this.shotHitsBoss);
                G.game.physics.arcade.collide(G.game.bxRocketsPool, G.game.boss, _this.shotHitsBoss);
                G.game.physics.arcade.collide(G.game.doubleBulletsPool, G.game.boss, _this.shotHitsBoss);

                var outX = (G.game.boss.x - (G.game.boss.width / 2) < 0 || G.game.boss.x + (G.game.boss.width / 2) > G.game.width),
                    outY = (G.game.boss.y - (G.game.boss.height / 2) < 0 || G.game.boss.y + (G.game.boss.height / 2) > G.game.height);

                if(outX || outY) {
                    /**
                     * Boss is outside of stage
                     * Move boss towards the ship
                     */
                    G.game.physics.arcade.moveToObject(G.game.boss, G.game.ship, G.game.getRandomInt(G.game.ENEMY_MIN_SPEED, G.game.ENEMY_MAX_SPEED));
                } else if (!G.game.boss.body.collideWorldBounds) {
                    /**
                     * Boss enters stage
                     * When boss enters stage bound it to the stage
                     */
                    G.game.boss.body.collideWorldBounds = true;
                } else {
                    /**
                     * Pull boss
                     * Pull boss in direction of the ship to increase
                     * difficulty and generate kind of randomness
                     */

                    if (G.game.boss.y < G.game.ship.y) {
                        G.game.boss.body.gravity.y = 70;
                    } else {
                        G.game.boss.body.gravity.y = -70;
                    }

                    if (G.game.boss.x < G.game.ship.x) {
                        G.game.boss.body.gravity.x = 170;
                    } else {
                        G.game.boss.body.gravity.x = -170;
                    }

                    if(G.game.boss.body.velocity.x < G.game.BOSS_MAX_SPEED) {
                        G.game.boss.body.velocity.x += 0.3;
                    } else if(G.game.boss.body.velocity.y < G.game.BOSS_MAX_SPEED) {
                        G.game.boss.body.velocity.y += 0.1;
                    }
                }

                /* Enforce a delay between shots */
                if (G.game.lastEnemyShotAt === undefined) G.game.lastEnemyShotAt = 0;
                if (G.game.time.now - G.game.lastEnemyShotAt < 1500) return;
                G.game.lastEnemyShotAt = G.game.time.now;

                _this.bossShot();
            } else {

                /* Normal enemies
                --------------------------------------------------------------------------------- */

                /* Enforce a delay between appearing of enemies */
                if (G.game.lastEnemyAt === undefined) G.game.lastEnemyAt = 0;
                if (G.game.time.now - G.game.lastEnemyAt < G.game.ENEMY_DELAY) return;
                G.game.lastEnemyAt = G.game.time.now;

                /* Get a random dead enemy from the pool */
                var enemy = Phaser.Math.getRandom(G.game.enemies.children.filter(function(e) {
                    return !e.alive;
                }));

                if (enemy === null || enemy === undefined) return;

                var randomPos = G.game.getRandomStartingPosition();

                enemy.position.x = randomPos.x;
                enemy.position.y = randomPos.y;

                /* Revive the enemy */
                enemy.revive(G.game.enemiesObjects[enemy.index].lifes);

                G.game.physics.arcade.moveToObject(enemy, G.game.ship, G.game.getRandomInt(G.game.ENEMY_MIN_SPEED, G.game.ENEMY_MAX_SPEED));
            }
        },

        /* createRandomEnemy
        --------------------------------------------------------------------------------- */

        createRandomEnemy: function() {
            G.game.enemies = G.game.add.group();

            for (var i = 0; i < G.game.NUMBER_OF_ENEMIES; i++) {
                var randomPos = G.game.getRandomStartingPosition(),
                    randomEnemyIndex = G.game.getRandomInt(0, 50) > 45 ? 2 : G.game.getRandomInt(0, 1),
                    enemyObj = G.game.enemiesObjects[randomEnemyIndex],
                    enemy = G.game.enemies.create(randomPos.x, randomPos.y, '' + enemyObj.name + '');

                G.game.physics.enable(enemy, Phaser.Physics.ARCADE);

                enemy.index = randomEnemyIndex;
                enemy.health = enemyObj.lifes;
                enemy.score = enemyObj.score;
                enemy.checkWorldBounds = true;
                enemy.outOfBoundsKill = true;
                enemy.body.immovable = true;
                enemy.kill();

                enemy.events.onEnterBounds.add(function(enemy) {
                    G.game.POSSIBLE_SCORE += enemy.score
                });

                enemy.events.onRevived.add(function(enemy) {
                    enemy.frame = 0;
                }, this);
            }
        },

        /* createBoss
        --------------------------------------------------------------------------------- */
        createBoss: function() {
            var randomPos = G.game.getRandomStartingPosition();

            G.game.boss = G.game.add.sprite(randomPos.x, randomPos.y, 'enemy_unit');

            var minSpeed = -75,
                maxSpeed = 75,
                vx = Math.random() * (maxSpeed - minSpeed + 1) - minSpeed,
                vy = Math.random() * (maxSpeed - minSpeed + 1) - minSpeed;

            G.game.physics.enable(G.game.boss, Phaser.Physics.ARCADE);
            G.game.boss.anchor.setTo(0.5, 0.5);

            G.game.boss.body.bounce.setTo(1, 1);
            G.game.boss.body.velocity.x = G.game.boss.vx;
            G.game.boss.body.velocity.y = G.game.boss.vy;
            G.game.boss.body.immovable = true;
            G.game.boss.body.maxVelocity.setTo(G.game.BOSS_MAX_SPEED, G.game.BOSS_MAX_SPEED);

            G.game.boss.score = 500;
            G.game.boss.kill();

            /* Update possible score once boss appears */
            G.game.boss.events.onEnterBounds.add(function() {
                G.game.POSSIBLE_SCORE += 500
            });

            G.game.bossBulletsPool = G.game.add.group();

            for (var i = 0; i < 20; i++) {
                var bullet = G.game.add.sprite(0, 0, 'bullet');
                G.game.bossBulletsPool.add(bullet);
                G.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.body.immovable = true;
                bullet.anchor.setTo(0.5, 0.5);
                bullet.kill();
            }
        },

        /* bossShot
        --------------------------------------------------------------------------------- */

        bossShot: function() {
            var shot = G.game.bossBulletsPool.getFirstDead();

            /* If there aren't any shots available then don't shoot */
            if (shot === null || shot === undefined) return;

            // revive the shot
            shot.revive();

            // set the shot position to the ship position
            shot.reset(G.game.boss.x, G.game.boss.y);

            // shots should kill themselves when they leave the world
            shot.checkWorldBounds = true;
            shot.outOfBoundsKill = true;

            shot.rotation = G.game.physics.arcade.moveToObject(shot, G.game.ship, 400);
        },        

        /* shotHitsShip
        --------------------------------------------------------------------------------- */

        shotHitsShip: function(ship, shot) {
            G.game.showExplosion(shot.x, shot.y);
            shot.kill();

            // if a shield is active, don't decrease lifes
            if (G.game.activePowerup && G.game.activePowerup.name === 'shield') {
                return;
            }

            G.game.events.onRemoveLife.dispatch();
        },

        /* shotHitsEnemy
        --------------------------------------------------------------------------------- */

        shotHitsEnemy: function(shot, enemy) {
            shot.kill();

            if (enemy.frame === 0) {
                enemy.frame = 1;
            }

            enemy.health -= shot.force;

            if (enemy.health <= 0) {
                G.game.showExplosion(enemy.x, enemy.y);
                enemy.kill();

                G.game.events.onUpdateScore.dispatch(enemy.score);
            } else {
                enemy.frame += 1;
            }
        },

        /* shotHitsBoss
        --------------------------------------------------------------------------------- */

        shotHitsBoss: function(boss, shot) {
            shot.kill();

            boss.health -= shot.force;

            if (boss.health <= 0) {
                G.game.showExplosion(boss.x, boss.y);
                boss.kill();

                G.game.BOSS_SHOWN = false;
                G.game.GAME_COMPLETED = true;

                G.game.events.onUpdateScore.dispatch(boss.score);
            }
        },

        /* shipHitsEnemy
        --------------------------------------------------------------------------------- */

        shipHitsEnemy: function(ship, enemy) {
            G.game.showExplosion(enemy.x, enemy.y);
            enemy.kill();

            // if a shield is active, don't decrease lifes
            if (G.game.activePowerup && G.game.activePowerup.name === 'shield') {
                G.game.events.onUpdateScore.dispatch(enemy.score);
                return;
            }

            G.game.events.onRemoveLife.dispatch();
        }
    };

    return Enemies;
});
