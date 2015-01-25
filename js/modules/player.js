/* ------------------------------------------------------------------------------
player.js

Whole player logic including shooting and positioning
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var G, _this, Player = function(obj) {
        G = obj.game;

        _this = this;
        _this.init();
    };

    Player.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            _this.setupBullets();
            _this.setupDoubleBullets();
            _this.setupBXRockets();
            _this.setupShip();

            $(document).on('update', _this.update);
        },

        /* update
        --------------------------------------------------------------------------------- */

        update: function() {
            if (G.ship.x > G.width) G.ship.x = 0;
            if (G.ship.x < 0) G.ship.x = G.width;
            if (G.ship.y > G.height) G.ship.y = 0;
            if (G.ship.y < 0) G.ship.y = G.height;

            if (!Modernizr.touch) {
                if (G.input.keyboard.isDown(Phaser.Keyboard.LEFT) || G.arrowLeftPressed) {
                    G.ship.body.angularVelocity = -G.SHIP_ROTATION_SPEED;
                } else if (G.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || G.arrowRightPressed) {
                    G.ship.body.angularVelocity = G.SHIP_ROTATION_SPEED;
                } else {
                    G.ship.body.angularVelocity = 0;
                }

                if (G.input.keyboard.isDown(Phaser.Keyboard.UP) || G.arrowUpPressed) {
                    G.ship.body.acceleration.x = Math.cos(G.ship.rotation) * G.SHIP_ACCELERATION;
                    G.ship.body.acceleration.y = Math.sin(G.ship.rotation) * G.SHIP_ACCELERATION;
                    G.ship.frame = 1;
                    !G.shipThruster.isPlaying && G.shipThruster.play('', 0, 1, false);
                } else {
                    G.ship.body.acceleration.setTo(0, 0);
                    G.ship.frame = 0;
                    G.shipThruster.stop();
                }
            }

            if (G.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || G.shootingPressed) {
                _this.shootBullet();
            }
        },

        /* setupBullets
        --------------------------------------------------------------------------------- */

        setupBullets: function() {
            G.bulletsPool = G.add.group();

            for (var i = 0; i < G.NUMBER_OF_BULLETS; i++) {
                var bullet = G.add.sprite(0, 0, 'bullet');
                G.bulletsPool.add(bullet);
                G.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.kill();
            }
        },

        /* setupDoubleBullets
        --------------------------------------------------------------------------------- */

        setupDoubleBullets: function() {
            G.doubleBulletsPool = G.add.group();

            for (var i = 0; i < G.NUMBER_OF_DOUBLE_BULLETS; i++) {
                var doubleBullet = G.add.sprite(0, 0, 'bullet_double');
                G.doubleBulletsPool.add(doubleBullet);
                G.physics.enable(doubleBullet, Phaser.Physics.ARCADE);
                doubleBullet.anchor.setTo(0.5, 0.5);
                doubleBullet.kill();
            }
        },

        /* setupBXRockets
        --------------------------------------------------------------------------------- */

        setupBXRockets: function() {
            G.bxRocketsPool = G.add.group();

            for (var i = 0; i < G.NUMBER_OF_BX_ROCKETS; i++) {
                var bxRocket = G.add.sprite(0, 0, 'bx_rocket');
                G.bxRocketsPool.add(bxRocket);
                G.physics.enable(bxRocket, Phaser.Physics.ARCADE);
                bxRocket.anchor.setTo(0.5, 0.5);
                bxRocket.kill();
            }
        },

        /* setupShip
        --------------------------------------------------------------------------------- */

        setupShip: function() {
            G.ship = G.add.sprite(G.world.centerX, G.world.centerY, G.SHIP);
            G.ship.anchor.setTo(0.5, 0.5);
            G.ship.angle = -90;
            G.ship.health = G.NUMBER_OF_LIFES;

            G.physics.enable(G.ship, Phaser.Physics.ARCADE);
            G.ship.body.maxVelocity.setTo(G.SHIP_MAX_SPEED, G.SHIP_MAX_SPEED);

            G.ship.events.onRevived.add(function(ship) {
                ship.position.setTo(G.width / 2, G.height / 2);
                ship.rotation = 0;
                ship.angle = -90;
                ship.body.velocity.x = 0;
                ship.body.velocity.y = 0;
            }, this);

            // capture certain keys to prevent their default actions in the browser.
            G.input.keyboard.addKeyCapture([
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN
            ]);
        },

        /* shootBullet
        --------------------------------------------------------------------------------- */

        shootBullet: function() {
            var delay, pool, speed, force;

            /* Set properties depending on active weapon */
            switch (G.WEAPON) {
                case 'bxRocket':
                    delay = G.ROCKET_BX_SHOT_DELAY;
                    pool = G.bxRocketsPool;
                    speed = G.ROCKET_BX_SPEED;
                    force = G.ROCKET_BX_FORCE;
                    break;
                case 'doubleBullet':
                    delay = G.DOUBLE_BULLET_SHOT_DELAY;
                    pool = G.doubleBulletsPool;
                    speed = G.DOUBLE_BULLET_SPEED;
                    force = G.DOUBLE_BULLET_FORCE
                    break;
                default:
                    delay = G.BULLET_SHOT_DELAY;
                    pool = G.bulletsPool;
                    speed = G.BULLET_SPEED;
                    force = G.BULLET_FORCE
                    break;
            }

            /* Enforce a delay between shots */
            if (G.lastBulletShotAt === undefined) G.lastBulletShotAt = 0;
            if (G.time.now - G.lastBulletShotAt < delay) return;
            G.lastBulletShotAt = G.time.now;

            var shot = pool.getFirstDead();

            /* If there aren't any shots available then don't shoot */
            if (shot === null || shot === undefined) return;

            shot.revive();
            shot.force = force;

            /* Shots should kill themselves when they leave the world to save memory */
            shot.checkWorldBounds = true;
            shot.outOfBoundsKill = true;

            /* Set the shot position to the ship position */
            shot.reset(G.ship.x, G.ship.y);
            shot.rotation = G.ship.rotation;

            /* Shoot it in the right direction */
            shot.body.velocity.x = Math.cos(shot.rotation) * speed;
            shot.body.velocity.y = Math.sin(shot.rotation) * speed;

            /* Play audio */
            G.gunshot.play('', 0, 0.5);
        }

    };

    return Player;

});
