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
                G.game.BOSS_SHOWN = true;

                G.game.boss.score = 500;

                G.game.boss.revive(8);
                G.game.boss.bringToTop();
            } else {

                if (G.game.BOSS_SHOWN) {

                    G.game.physics.arcade.overlap(G.game.bossBulletsPool, G.game.ship, _this.shotHitsShip);
                    G.game.physics.arcade.collide(G.game.bulletsPool, G.game.boss, _this.shotHitsBoss);
                    G.game.physics.arcade.collide(G.game.bxRocketsPool, G.game.boss, _this.shotHitsBoss);
                    G.game.physics.arcade.collide(G.game.doubleBulletsPool, G.game.boss, _this.shotHitsBoss);

                    if (G.game.boss.y >= G.game.height || G.game.boss.y <= 0 || G.game.boss.x >= G.game.width || G.game.boss.x <= 0) {
                        G.game.physics.arcade.moveToObject(G.game.boss, G.game.ship, G.game.getRandomInt(G.game.ENEMY_MIN_SPEED, G.game.ENEMY_MAX_SPEED));
                    } else {
                        var angle = Math.atan2(G.game.ship.y - G.game.boss.y, G.game.ship.x - G.game.boss.x);
                        angle = angle * (180 / Math.PI) - 90;
                        G.game.boss.angle = angle;
                        G.game.physics.arcade.velocityFromAngle(angle, 100, G.game.boss.body.velocity);
                    }


                    // enforce a delay between shots
                    if (G.game.lastEnemyShotAt === undefined) G.game.lastEnemyShotAt = 0;
                    if (G.game.time.now - G.game.lastEnemyShotAt < 1500) return;
                    G.game.lastEnemyShotAt = G.game.time.now;

                    _this.bossShot();

                    return;
                }

                if (G.game.lastEnemyAt === undefined) G.game.lastEnemyAt = 0;
                if (G.game.time.now - G.game.lastEnemyAt < G.game.ENEMY_DELAY) return;
                G.game.lastEnemyAt = G.game.time.now;

                // get a random dead enemy from the pool
                var enemy = Phaser.Math.getRandom(G.game.enemies.children.filter(function(e) {
                    return !e.alive;
                }));

                if (enemy === null || enemy === undefined) return;

                var randomPos = G.game.getRandomStartingPosition();

                enemy.position.x = randomPos.x;
                enemy.position.y = randomPos.y;

                // revive the enemy
                enemy.revive(G.game.enemiesObjects[enemy.index].lifes);

                G.game.physics.arcade.moveToObject(enemy, G.game.ship, G.game.getRandomInt(G.game.ENEMY_MIN_SPEED, G.game.ENEMY_MAX_SPEED));
            }
        },

        /* bossShot
        --------------------------------------------------------------------------------- */

        bossShot: function() {
            // var angle = Math.atan2(G.game.ship.y - G.game.boss.y, G.game.ship.x - G.game.boss.x);

            // G.game.physics.arcade.velocityFromAngle(angle * (180 / Math.PI), 30, G.game.boss.body.velocity);

            // get a dead shot from the pool
            var shot = G.game.bossBulletsPool.getFirstDead();

            // if there aren't any shots available then don't shoot
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

            var randomPos = G.game.getRandomStartingPosition();

            G.game.boss = G.game.add.sprite(randomPos.x, randomPos.y, 'enemy_unit');
            G.game.boss.anchor.setTo(0.5, 0.5);
            G.game.physics.enable(G.game.boss, Phaser.Physics.ARCADE);
            G.game.boss.body.immovable = true;
            G.game.boss.kill();

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
