/* ------------------------------------------------------------------------------
mobileControls.js
--------------------------------------------------------------------------------- */

define(['joystick'], function(joystick) {

    'use strict';

    var G, isMoving = false,
        interval,
        randomBg, MobileControls = function(obj) {
            G = obj;

            this.init();
        };

    MobileControls.prototype = {

        /* init
        --------------------------------------------------------------------------------- */              
            
        init: function() {

            $('#joystick-wrapper').fadeIn();

            var settings = {
                pretendArrowKeys: false,
                mindistance: 1,
                maxdistance: 100,
                middleLeft: 25,
                middleTop: 25
            };

            var joystick = new SQUARIFIC.framework.TouchControl(document.getElementById('joystick'), settings);

            joystick.on('joystickMove', function(data) {
                var acceleration = data.distance > 50 ? G.game.SHIP_ACCELERATION : data.distance;
                clearTimeout(interval);
                isMoving = true;
                G.game.ship.angle = data.angle;
                G.game.ship.body.acceleration.x = Math.cos(G.game.ship.rotation) * acceleration;
                G.game.ship.body.acceleration.y = Math.sin(G.game.ship.rotation) * acceleration;

                if (data.distance > 50) {
                    G.game.ship.frame = 1;
                }
            });

            setInterval(function() {
                if (isMoving) {
                    interval = setTimeout(function() {
                        G.game.ship.body.acceleration.setTo(0, 0);
                        G.game.ship.frame = 0;
                        isMoving = false;
                    }, 100);
                }
            }, 200);

            $(document).on('update', this.update);

        },

    };

    return MobileControls;

});
