/* ------------------------------------------------------------------------------
menu.js

Setup main menu. Basically no logic, just painting.
--------------------------------------------------------------------------------- */

define(function() {

    'use strict';

    var MainMenu = function(game) {
        this.game = game;
    };

    MainMenu.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            Modernizr.touch && $('#joystick-wrapper').hide();
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            setTimeout(function() {
                $('#loader').fadeOut();
            }, 2000);

            !this.game.menu_background.isPlaying && this.game.menu_background.play('', 0, 1, true);

            this.game.add.image(0, 0, 'background_menu');
            this.game.add.button((this.game.width / 2) - 250, (this.game.height / 2) - 72, 'main_button', this.startGame, this);

            this.game.add.text((this.game.width / 2) - 90, (this.game.height / 2) - 15, 'SINGLE GAME', {
                font: '30px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            });
        },

        /* startGame
        --------------------------------------------------------------------------------- */

        startGame: function() {
            this.game.button.play('', 0, 0.5, false);
            this.game.state.start('levelMenu');
        }


    };

    return MainMenu;
});
