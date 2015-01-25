/* ------------------------------------------------------------------------------
enemies.js

Whole enemies logic
--------------------------------------------------------------------------------- */

define(['hud'], function(Hud) {

    'use strict';

    var G, _this,
        Enemies = function(obj) {
            G = obj.game;

            _this = this;
            _this.init();
        };

    Enemies.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            /* Explosion & damage pool */
            G.explosionGroup = G.add.group();
            G.damageGroup = G.add.group();

            _this.createRandomEnemy();
            _this.createBoss();

            $(document).on('update', _this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            G.physics.arcade.collide(G.bulletsPool, G.enemies, _this.shotHitsEnemy);
            G.physics.arcade.collide(G.bxRocketsPool, G.enemies, _this.shotHitsEnemy);
            G.physics.arcade.collide(G.doubleBulletsPool, G.enemies, _this.shotHitsEnemy);
            G.physics.arcade.collide(G.ship, G.enemies, _this.shipHitsEnemy);

            if (G.time.now - G.gameStartTime > G.LEVEL_DURATION && !G.BOSS_SHOWN) {
                /**
                 * When level time is over
                 * Show with the next iteration once level time is over
                 *
                 * @todo Change sound to be more dramatic
                 */
                G.BOSS_SHOWN = true;

                /* Revive boss with 8 lifes */
                G.boss.revive(8);
                G.boss.bringToTop();

                /* Play boss sound */
                G.game_background.stop();
                G.boss_background.play('', 0, 1, true);

                /* Update possible score */
                G.POSSIBLE_SCORE += 500;

                /* Kill all living enemies */
                G.enemies.forEachAlive(function(enemy) {
                    G.showExplosion(enemy.x, enemy.y);
                    enemy.kill();
                });
                G.lastEnemyAt = 0;
            } else if (G.BOSS_SHOWN) {

                /* Boss is visible
                --------------------------------------------------------------------------------- */

                /* Shot hits boss/shop */
                G.physics.arcade.overlap(G.bossBulletsPool, G.ship, _this.shotHitsShip);
                G.physics.arcade.collide(G.bulletsPool, G.boss, _this.shotHitsBoss);
                G.physics.arcade.collide(G.bxRocketsPool, G.boss, _this.shotHitsBoss);
                G.physics.arcade.collide(G.doubleBulletsPool, G.boss, _this.shotHitsBoss);

                var outX = (G.boss.x - (G.boss.width / 2) < 0 || G.boss.x + (G.boss.width / 2) > G.width),
                    outY = (G.boss.y - (G.boss.height / 2) < 0 || G.boss.y + (G.boss.height / 2) > G.height);

                if (outX || outY) {
                    /**
                     * Boss is outside of stage
                     * Move boss towards the ship
                     */
                    G.physics.arcade.moveToObject(G.boss, G.ship, G.rnd.integerInRange(G.ENEMY_MIN_SPEED, G.ENEMY_MAX_SPEED));
                } else if (!G.boss.body.collideWorldBounds) {
                    /**
                     * Boss enters stage
                     * When boss enters stage bound it to the stage
                     */
                    G.boss.body.collideWorldBounds = true;
                } else {
                    /**
                     * Pull boss
                     * Pull boss in direction of the ship to increase
                     * difficulty and generate kind of randomness
                     */

                    if (G.boss.y < G.ship.y) {
                        G.boss.body.gravity.y = 70;
                    } else {
                        G.boss.body.gravity.y = -70;
                    }

                    if (G.boss.x < G.ship.x) {
                        G.boss.body.gravity.x = 170;
                    } else {
                        G.boss.body.gravity.x = -170;
                    }

                    if (G.boss.body.velocity.x < G.BOSS_MAX_SPEED) {
                        G.boss.body.velocity.x += 0.3;
                    } else if (G.boss.body.velocity.y < G.BOSS_MAX_SPEED) {
                        G.boss.body.velocity.y += 0.1;
                    }
                }

                /* Enforce a delay between shots */
                if (G.lastEnemyShotAt === undefined) G.lastEnemyShotAt = 0;
                if (G.time.now - G.lastEnemyShotAt < 3000) return;
                G.lastEnemyShotAt = G.time.now;

                _this.bossShot();
            } else {

                /* Normal enemies
                --------------------------------------------------------------------------------- */

                /* Enforce a delay between appearing of enemies */
                if (G.lastEnemyAt === undefined) G.lastEnemyAt = 0;
                if (G.time.now - G.lastEnemyAt < G.ENEMY_DELAY) return;
                G.lastEnemyAt = G.time.now;

                /* Get a random dead enemy from the pool */
                var enemy = Phaser.Math.getRandom(G.enemies.children.filter(function(e) {
                    return !e.alive;
                }));

                if (enemy === null || enemy === undefined) return;

                var randomPos = G.getRandomStartingPosition();

                enemy.position.x = randomPos.x;
                enemy.position.y = randomPos.y;

                /* Revive the enemy */
                enemy.revive(G.enemiesObjects[enemy.index].lifes);

                G.physics.arcade.moveToObject(enemy, G.ship, G.rnd.integerInRange(G.ENEMY_MIN_SPEED, G.ENEMY_MAX_SPEED));
            }
        },

        /* createRandomEnemy
        --------------------------------------------------------------------------------- */

        createRandomEnemy: function() {
            G.enemies = G.add.group();

            for (var i = 0; i < G.NUMBER_OF_ENEMIES; i++) {
                var randomPos = G.getRandomStartingPosition(),
                    randomEnemyIndex = G.rnd.integerInRange(0, 50) > 45 ? 2 : G.rnd.integerInRange(0, 1),
                    enemyObj = G.enemiesObjects[randomEnemyIndex],
                    enemy = G.enemies.create(randomPos.x, randomPos.y, '' + enemyObj.name + '');

                G.physics.enable(enemy, Phaser.Physics.ARCADE);

                enemy.index = randomEnemyIndex;
                enemy.health = enemyObj.lifes;
                enemy.score = enemyObj.score;
                enemy.checkWorldBounds = true;
                enemy.outOfBoundsKill = true;
                enemy.body.immovable = true;
                enemy.kill();

                enemy.events.onEnterBounds.add(function(enemy) {
                    G.POSSIBLE_SCORE += enemy.score
                });

                enemy.events.onRevived.add(function(enemy) {
                    enemy.frame = 0;
                }, this);
            }
        },

        /* createBoss
        --------------------------------------------------------------------------------- */
        createBoss: function() {
            var randomPos = G.getRandomStartingPosition();

            G.boss = G.add.sprite(randomPos.x, randomPos.y, 'enemy_unit');

            var minSpeed = -75,
                maxSpeed = 75,
                vx = Math.random() * (maxSpeed - minSpeed + 1) - minSpeed,
                vy = Math.random() * (maxSpeed - minSpeed + 1) - minSpeed;

            G.physics.enable(G.boss, Phaser.Physics.ARCADE);
            G.boss.anchor.setTo(0.5, 0.5);

            G.boss.body.bounce.setTo(1, 1);
            G.boss.body.velocity.x = G.boss.vx;
            G.boss.body.velocity.y = G.boss.vy;
            G.boss.body.immovable = true;
            G.boss.body.maxVelocity.setTo(G.BOSS_MAX_SPEED, G.BOSS_MAX_SPEED);

            G.boss.score = 500;
            G.boss.kill();

            G.bossBulletsPool = G.add.group();

            for (var i = 0; i < 20; i++) {
                var bullet = G.add.sprite(0, 0, 'bullet');
                G.bossBulletsPool.add(bullet);
                G.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.body.immovable = true;
                bullet.anchor.setTo(0.5, 0.5);
                bullet.kill();
            }
        },

        /* bossShot
        --------------------------------------------------------------------------------- */

        bossShot: function() {
            var shot = G.bossBulletsPool.getFirstDead();

            /* If there aren't any shots available then don't shoot */
            if (shot === null || shot === undefined) return;

            // revive the shot
            shot.revive();

            // set the shot position to the ship position
            shot.reset(G.boss.x, G.boss.y);

            // shots should kill themselves when they leave the world
            shot.checkWorldBounds = true;
            shot.outOfBoundsKill = true;

            shot.rotation = G.physics.arcade.moveToObject(shot, G.ship, 400);
        },

        /* shotHitsShip
        --------------------------------------------------------------------------------- */

        shotHitsShip: function(ship, shot) {
            G.showExplosion(shot.x, shot.y);
            shot.kill();

            // if a shield is active, don't decrease lifes
            if (G.activePowerup && G.activePowerup.name === 'shield') {
                return;
            }

            G.events.onRemoveLife.dispatch();
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
                G.showExplosion(shot.x, shot.y);
                enemy.kill();

                G.events.onUpdateScore.dispatch(enemy.score);
            } else {
                G.showDamage(shot.x, shot.y);
                enemy.frame += 1;
            }
        },

        /* shotHitsBoss
        --------------------------------------------------------------------------------- */

        shotHitsBoss: function(boss, shot) {
            shot.kill();

            boss.health -= shot.force;

            if (boss.health <= 0) {
                G.showExplosion(boss.x, boss.y);
                boss.kill();

                G.BOSS_SHOWN = false;
                G.GAME_COMPLETED = true;

                G.events.onUpdateScore.dispatch(boss.score);
            } else {
                G.showDamage(shot.x, shot.y);
            }
        },

        /* shipHitsEnemy
        --------------------------------------------------------------------------------- */

        shipHitsEnemy: function(ship, enemy) {
            G.showExplosion(enemy.x, enemy.y);
            enemy.kill();

            // if a shield is active, don't decrease lifes
            if (G.activePowerup && G.activePowerup.name === 'shield') {
                G.events.onUpdateScore.dispatch(enemy.score);
                return;
            }

            G.events.onRemoveLife.dispatch();
        }
    };

    return Enemies;
});
