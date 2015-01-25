/* ------------------------------------------------------------------------------
levelMenu.js

An overview menu of all available levels
--------------------------------------------------------------------------------- */


define(['level1', 'level2', 'level3', 'level4', 'level5', 'level6'], function(Level1, Level2, Level3, Level4, Level5, Level6) {

    'use strict';

    var LevelMenu = function(game) {
        this.game = game;
    };

    LevelMenu.prototype = {

        /* init
        --------------------------------------------------------------------------------- */

        init: function() {
            Modernizr.touch && $('#joystick-wrapper').hide();

            this.NUM_OF_LEVELS = 6;
        },

        /* create
        --------------------------------------------------------------------------------- */

        create: function() {
            $(document).off('update');

            this.game.game_background && this.game.game_background.stop();
            !this.game.menu_background.isPlaying && this.game.menu_background.play('', 0, 1, true);

            /* Create levelMenu */
            this.game.add.image(0, 0, 'background_menu');
            this.game.levelMenu = this.game.add.group();

            /* Calculate menu position */
            var menuX = this.game.width / 2 - 400,
                menuY = this.game.height / 2 - 357;

            /* Create basic menu */
            this.game.levelMenu.create(menuX, menuY, 'window');
            this.game.add.text(410, 110, 'LEVELS', {
                font: '36px "neuropol_xregular", Arial, sans-serif',
                fill: '#fff'
            }, this.game.levelMenu);

            var _this = this,
                columnCounter = 0,
                rowCounter = 0,
                levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted'));

            for (var index = 1; index <= this.NUM_OF_LEVELS; index++) {
                if (columnCounter % 4 === 0 && columnCounter !== 0) {
                    columnCounter = 0;
                    rowCounter++;
                }

                /* Calculate position of level button */
                var width = menuX + 140 + (140 * columnCounter),
                    height = menuY + 200 + (140 * rowCounter);

                if (index === 1 || $.inArray(index - 1, levelsCompleted) !== -1) {

                    /* The completed levels including the first
                    --------------------------------------------------------------------------------- */

                    /**
                     * Level button
                     * On click/touch save selected level and start game state
                     */
                    var button = _this.game.add.button(width, height, 'select_frame', function(btn) {
                        _this.game.button.play('', 0, 0.5, false);

                        switch (btn.index) {
                            case 1:
                                _this.game.level = new Level1(_this);
                                break;
                            case 2:
                                _this.game.level = new Level2(_this);
                                break;
                            case 3:
                                _this.game.level = new Level3(_this);
                                break;
                            case 4:
                                _this.game.level = new Level4(_this);
                                break;
                            case 5:
                                _this.game.level = new Level5(_this);
                                break;
                            case 6:
                                _this.game.level = new Level6(_this);
                                break;
                        }

                        _this.game.state.start('game');
                    }, _this, 0, 1);

                    button.index = index;

                    /**
                     * Show level number
                     * i - 1 for frame because the sprite starts at 0
                     */
                    _this.game.add.sprite(button.x + 25, button.y + 20, 'select_number', index - 1);

                    /**
                     * Star icons
                     * Display star icons
                     */

                    var levels = JSON.parse(localStorage.getItem('levels')) || [],
                        levelExists = false;

                    $.each(levels, function(i, level) {
                        if (level.index === index) {
                            _this.game.add.sprite(button.x + 19, button.y + 65, 'stars', level.starsFrame);
                            levelExists = true;
                        }
                    });

                    /* If not score is stored to this level, show empty stars */
                    if (!levelExists) {
                        _this.game.add.sprite(button.x + 19, button.y + 65, 'stars', 3);
                    }

                } else {
                    /* locked levels
                    --------------------------------------------------------------------------------- */

                    /* Show lock icon if previous level hasn't been completed yet */
                    var button = _this.game.add.sprite(width, height, 'select_frame');
                    _this.game.add.image(button.x + 25, button.y + 20, 'locked');

                }

                columnCounter++;
            }
        }

    };

    return LevelMenu;
});
