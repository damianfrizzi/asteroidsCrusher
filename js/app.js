'use strict';

require.config({
  paths: {
    'Test': 'modules/test',
    'Modernizr': '../bower_components/modernizr/modernizr',
    'Underscore': '../bower_components/underscore/underscore'
  },
  shim: {
    Underscore: {
      exports: '_'
    }
  }
});

require(['Test', 'Modernizr'], function(Test) {
  Test.init();
});
