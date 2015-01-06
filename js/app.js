/* ------------------------------------------------------------------------------
App.js

Configuration and initialisation happen here
--------------------------------------------------------------------------------- */        
    
;(function() {

    'use strict';

    require.config({
        paths: {
            'game': 'modules/game',
            'boot': 'modules/boot',
            'mainMenu': 'modules/mainMenu',
            'levelMenu': 'modules/levelMenu',
            'mobileControls': 'modules/mobileControls',
            'background': 'modules/background',
            'hud': 'modules/hud',
            'player': 'modules/player',
            'enemies': 'modules/enemies',
            'powerups': 'modules/powerups',
            'screen_shake': 'vendor/phaser.screen_shake',
            'joystick': 'vendor/touchscreen_joystick',
            'jquery': '../bower_components/jquery/dist/jquery',
            'Modernizr': '../bower_components/modernizr/modernizr',
            'phaser': '../bower_components/phaser-official/build/phaser.min'
        },

        shim: {
            'phaser': {
                exports: 'Phaser'
            },
            'screen_shake': {
                deps: ['phaser']
            }
        },

        /* Remove on production to guarantee caching */
        urlArgs: 'bust=' + (new Date()).getTime()
    });

    require(['jquery', 'Modernizr'], function($) {
        /* Little helper */
        window.log = function(input) {
            console.log(input);
        }

        window.DEBUG = true;

        $(function() {
            require(['phaser', 'boot', 'mainMenu', 'levelMenu', 'game', 'screen_shake'], function(Phaser, Boot, MainMenu, LevelMenu, Game) {
                /* Initialize game stage */
                var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

                /* Add different game states */
                game.state.add('boot', Boot, true);
                game.state.add('mainMenu', MainMenu);
                game.state.add('levelMenu', LevelMenu);
                game.state.add('game', Game);
            });
        });
    });

}());
