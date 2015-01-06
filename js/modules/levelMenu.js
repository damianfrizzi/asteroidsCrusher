/* ------------------------------------------------------------------------------
levelMenu.js

An overview menu of all available levels
--------------------------------------------------------------------------------- */


define(function() {

    'use strict';

    /**
     * Levels
     * Each object inside Levels creates a new level, which is automatically positioned
     * inside the level menu
     */

    var Levels = [{
        /* Unique level index */
        LEVEL_INDEX: 1,

        /**
         * Starting weapon
         * Possible weapons: bullet, doubleBullet, bxRocket
         */
        WEAPON: 'bullet',

        /**
         * Duration until fuel has gone
         * Gameover when finished
         */
        FUEL_DURATION: 85000,

        /**
         * Difficulty increase interval
         * Increases the difficulty every x milliseconds
         */
        DIFFICULTY_CHANGE_TIME: 20000,

        /**
         * Level duration
         * When this time is over, the boss will appear
         */
        LEVEL_DURATION: 60000,

        /**
         * Powerups delay
         * The powerups appearing interval
         * This will be decreased during difficulty change
         */
        POWERUPS_DELAY: 5000,

        /* Number of powerups */
        NUMBER_OF_POWERUPS: 5,

        /* Minimum enemy speed */
        ENEMY_MIN_SPEED: 50,

        /**
         * Maximum enemy speed
         * This property will be increased during difficulty change
         */
        ENEMY_MAX_SPEED: 100,

        /**
         * Enemy delay
         * The enemies appearing interval
         * This will be decreased during difficulty change
         */
        ENEMY_DELAY: 1000,

        /* Number of enemies */
        NUMBER_OF_ENEMIES: 20,

        /* Backgound image */
        BACKGROUND_IMAGE: 1
    }, {
        LEVEL_INDEX: 2,
        WEAPON: 'bullet',
        FUEL_DURATION: 85000,
        DIFFICULTY_CHANGE_TIME: 20000,
        LEVEL_DURATION: 80000,
        POWERUPS_DELAY: 5000,
        NUMBER_OF_POWERUPS: 5,
        ENEMY_MIN_SPEED: 50,
        ENEMY_MAX_SPEED: 100,
        ENEMY_DELAY: 1000,
        NUMBER_OF_ENEMIES: 20,
        BACKGROUND_IMAGE: 2
    }, {
        LEVEL_INDEX: 3,
        WEAPON: 'bullet',
        FUEL_DURATION: 85000,
        DIFFICULTY_CHANGE_TIME: 20000,
        LEVEL_DURATION: 100000,
        POWERUPS_DELAY: 5000,
        NUMBER_OF_POWERUPS: 5,
        ENEMY_MIN_SPEED: 50,
        ENEMY_MAX_SPEED: 100,
        ENEMY_DELAY: 1000,
        NUMBER_OF_ENEMIES: 20,
        BACKGROUND_IMAGE: 3
    }, {
        LEVEL_INDEX: 4,
        WEAPON: 'bullet',
        FUEL_DURATION: 85000,
        DIFFICULTY_CHANGE_TIME: 20000,
        LEVEL_DURATION: 60000,
        POWERUPS_DELAY: 5000,
        NUMBER_OF_POWERUPS: 5,
        ENEMY_MIN_SPEED: 50,
        ENEMY_MAX_SPEED: 110,
        ENEMY_DELAY: 900,
        NUMBER_OF_ENEMIES: 20
    }, {
        LEVEL_INDEX: 5,
        WEAPON: 'bullet',
        FUEL_DURATION: 85000,
        DIFFICULTY_CHANGE_TIME: 15000,
        LEVEL_DURATION: 60000,
        POWERUPS_DELAY: 5000,
        NUMBER_OF_POWERUPS: 5,
        ENEMY_MIN_SPEED: 50,
        ENEMY_MAX_SPEED: 110,
        ENEMY_DELAY: 900,
        NUMBER_OF_ENEMIES: 20
    }, {
        LEVEL_INDEX: 6,
        WEAPON: 'bullet',
        FUEL_DURATION: 85000,
        DIFFICULTY_CHANGE_TIME: 20000,
        LEVEL_DURATION: 60000,
        POWERUPS_DELAY: 5000,
        NUMBER_OF_POWERUPS: 5,
        ENEMY_MIN_SPEED: 50,
        ENEMY_MAX_SPEED: 110,
        ENEMY_DELAY: 800,
        NUMBER_OF_ENEMIES: 20
    }];

    var LevelMenu = function(game) {
        this.game = game;
    };

    LevelMenu.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            Modernizr.touch && $('#joystick-wrapper').hide();
        },

        /* preload
        --------------------------------------------------------------------------------- */

        preload: function() {
            this.game.load.spritesheet('select_frame', 'images/gui/mission_select_frame.png', 100, 100);
            this.game.load.spritesheet('select_number', 'images/gui/mission_select_numbers.png', 50, 39);
            this.game.load.image('locked', 'images/gui/mission_select_locked.png');
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            $(document).off('update');

            /* Create levelMenu
            --------------------------------------------------------------------------------- */

            this.game.add.image(0, 0, 'background_menu');

            this.game.levelMenu = this.game.add.group();

            /* Calculate menu position */
            var w = this.game.width / 2 - 400,
                h = this.game.height / 2 - 357;

            /* Create basic menu */
            this.game.levelMenu.create(w, h, 'window');
            this.game.add.text(410, 110, 'LEVELS', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, this.game.levelMenu);

            var _this = this,
                columnCounter = 0,
                rowCounter = 0,
                levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted'));

            // create level buttons
            $.each(Levels, function(index, level) {
                if (columnCounter % 4 === 0 && columnCounter !== 0) {
                    columnCounter = 0;
                    rowCounter++;
                }

                /* Calculate position of level button */
                var width = w + 140 + (140 * columnCounter),
                    height = h + 200 + (140 * rowCounter);

                if (index === 0 || $.inArray(index, levelsCompleted) !== -1) {
                    /* The completed levels including the first */

                    /**
                     * Level button
                     * On click/touch save selected level and start game state
                     */
                    var button = _this.game.add.button(width, height, 'select_frame', function() {
                        _this.game.options = level;
                        localStorage.setItem('activeLevel', JSON.stringify(level));
                        _this.game.state.start('game');
                    }, _this, 0, 1);

                    /* Show level number */
                    _this.game.add.sprite(button.x + 25, button.y + 20, 'select_number', index);

                    /* Display stars icons */
                    var levelsScore = JSON.parse(localStorage.getItem('levelScore')) || [],
                        exists = false;

                    $.each(levelsScore, function(i, levelScore) {
                        if (levelScore.LEVEL_INDEX === index + 1) {
                            _this.game.add.sprite(button.x + 19, button.y + 65, 'stars', levelScore.STARS_FRAME);
                            exists = true;
                        }
                    });

                    /* If not score is stored to this level, show empty stars */
                    if (!exists) {
                        _this.game.add.sprite(button.x + 19, button.y + 65, 'stars', 3);
                    }

                } else {
                    /* Levels not yet released */

                    /* Show lock icon if previous level hasn't been completed yet */
                    var button = _this.game.add.sprite(width, height, 'select_frame');
                    _this.game.add.image(button.x + 25, button.y + 20, 'locked');

                }

                columnCounter++;
            });
        }

    };

    return LevelMenu;
});
