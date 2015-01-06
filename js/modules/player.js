/* ------------------------------------------------------------------------------
player.js

Whole player logic including shooting and positioning
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var G, _this, Player = function(obj) {
        G = obj;

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
            if (G.game.ship.x > G.game.width) G.game.ship.x = 0;
            if (G.game.ship.x < 0) G.game.ship.x = G.game.width;
            if (G.game.ship.y > G.game.height) G.game.ship.y = 0;
            if (G.game.ship.y < 0) G.game.ship.y = G.game.height;

            if (!Modernizr.touch) {
                if (G.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || G.game.arrowLeftPressed) {
                    G.game.ship.body.angularVelocity = -G.game.SHIP_ROTATION_SPEED;
                } else if (G.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || G.game.arrowRightPressed) {
                    G.game.ship.body.angularVelocity = G.game.SHIP_ROTATION_SPEED;
                } else {
                    G.game.ship.body.angularVelocity = 0;
                }

                if (G.game.input.keyboard.isDown(Phaser.Keyboard.UP) || G.game.arrowUpPressed) {
                    G.game.ship.body.acceleration.x = Math.cos(G.game.ship.rotation) * G.game.SHIP_ACCELERATION;
                    G.game.ship.body.acceleration.y = Math.sin(G.game.ship.rotation) * G.game.SHIP_ACCELERATION;
                    G.game.ship.frame = 1;
                } else {
                    G.game.ship.body.acceleration.setTo(0, 0);
                    G.game.ship.frame = 0;
                }
            }

            if (G.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || G.game.shootingPressed) {
                _this.shootBullet();
            }
        },

        /* setupBullets
        --------------------------------------------------------------------------------- */

        setupBullets: function() {
            G.game.bulletsPool = G.game.add.group();

            for (var i = 0; i < G.game.NUMBER_OF_BULLETS; i++) {
                var bullet = G.game.add.sprite(0, 0, 'bullet');
                G.game.bulletsPool.add(bullet);
                G.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.kill();
            }
        },

        /* setupDoubleBullets
        --------------------------------------------------------------------------------- */

        setupDoubleBullets: function() {
            G.game.doubleBulletsPool = G.game.add.group();

            for (var i = 0; i < G.game.NUMBER_OF_DOUBLE_BULLETS; i++) {
                var doubleBullet = G.game.add.sprite(0, 0, 'bullet_double');
                G.game.doubleBulletsPool.add(doubleBullet);
                G.game.physics.enable(doubleBullet, Phaser.Physics.ARCADE);
                doubleBullet.anchor.setTo(0.5, 0.5);
                doubleBullet.kill();
            }
        },

        /* setupBXRockets
        --------------------------------------------------------------------------------- */

        setupBXRockets: function() {
            G.game.bxRocketsPool = G.game.add.group();

            for (var i = 0; i < G.game.NUMBER_OF_BX_ROCKETS; i++) {
                var bxRocket = G.game.add.sprite(0, 0, 'bx_rocket');
                G.game.bxRocketsPool.add(bxRocket);
                G.game.physics.enable(bxRocket, Phaser.Physics.ARCADE);
                bxRocket.anchor.setTo(0.5, 0.5);
                bxRocket.kill();
            }
        },

        /* setupShip
        --------------------------------------------------------------------------------- */

        setupShip: function() {
            G.game.ship = G.game.add.sprite(G.game.world.centerX, G.game.world.centerY, G.game.SHIP);
            G.game.ship.anchor.setTo(0.5, 0.5);
            G.game.ship.angle = -90;
            G.game.ship.health = G.game.NUMBER_OF_LIFES;

            G.game.physics.enable(G.game.ship, Phaser.Physics.ARCADE);
            G.game.ship.body.maxVelocity.setTo(G.game.SHIP_MAX_SPEED, G.game.SHIP_MAX_SPEED); // x, y

            G.game.ship.events.onRevived.add(function(ship) {
                ship.position.setTo(G.game.width / 2, G.game.height / 2);
                ship.rotation = 0;
                ship.angle = -90;
                ship.body.velocity.x = 0;
                ship.body.velocity.y = 0;
            }, this);

            // capture certain keys to prevent their default actions in the browser.
            G.game.input.keyboard.addKeyCapture([
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
            switch (G.game.WEAPON) {
                case 'bxRocket':
                    delay = G.game.ROCKET_BX_SHOT_DELAY;
                    pool = G.game.bxRocketsPool;
                    speed = G.game.ROCKET_BX_SPEED;
                    force = G.game.ROCKET_BX_FORCE;
                    break;
                case 'doubleBullet':
                    delay = G.game.DOUBLE_BULLET_SHOT_DELAY;
                    pool = G.game.doubleBulletsPool;
                    speed = G.game.DOUBLE_BULLET_SPEED;
                    force = G.game.DOUBLE_BULLET_FORCE
                    break;
                default:
                    delay = G.game.BULLET_SHOT_DELAY;
                    pool = G.game.bulletsPool;
                    speed = G.game.BULLET_SPEED;
                    force = G.game.BULLET_FORCE
                    break;
            }

            /* Enforce a delay between shots */
            if (G.game.lastBulletShotAt === undefined) G.game.lastBulletShotAt = 0;
            if (G.game.time.now - G.game.lastBulletShotAt < delay) return;
            G.game.lastBulletShotAt = G.game.time.now;

            var shot = pool.getFirstDead();

            /* If there aren't any shots available then don't shoot */
            if (shot === null || shot === undefined) return;

            shot.revive();
            shot.force = force;

            /* Shots should kill themselves when they leave the world to save memory */
            shot.checkWorldBounds = true;
            shot.outOfBoundsKill = true;

            /* Set the shot position to the ship position */
            shot.reset(G.game.ship.x, G.game.ship.y);
            shot.rotation = G.game.ship.rotation;

            /* Shoot it in the right direction */
            shot.body.velocity.x = Math.cos(shot.rotation) * speed;
            shot.body.velocity.y = Math.sin(shot.rotation) * speed;
        }

    };

    return Player;

});
