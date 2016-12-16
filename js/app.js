/* ------------------------------------------------------------------------------
App.js

Configuration and initialisation
--------------------------------------------------------------------------------- */

requirejs.config({
    paths: {
        /* Modules */
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

        /* Levels */
        'level1': 'levels/level1',
        'level2': 'levels/level2',
        'level3': 'levels/level3',
        'level4': 'levels/level4',
        'level5': 'levels/level5',
        'level6': 'levels/level6',

        /* Vendor */
        'screen_shake': '../vendor/phaser.screen_shake',
        'joystick': '../vendor/touchscreen_joystick',
        'jquery': '../vendor/jquery/dist/jquery.min',
        'Modernizr': '../vendor/modernizr/modernizr',
        'phaser': '../vendor/phaser-official/build/phaser.min'
    },

    shim: {
        '$': 'jquery',
        'phaser': {
            exports: 'Phaser'
        },
        'screen_shake': {
            deps: ['phaser']
        }
    }
});

(function() {

    'use strict';

    require(['jquery', 'Modernizr'], function($) {
        /* Little helper */
        window.log = function(input) {
            window.console.log(input);
        };

        window.DEBUG = true;

        $(function() {
            require(['phaser', 'boot', 'mainMenu', 'levelMenu', 'game', 'screen_shake'], function(Phaser, Boot, MainMenu, LevelMenu, Game) {
                /* Initialize game */
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