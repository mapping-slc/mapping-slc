'use strict';

//Setting up route
angular.module('contacts').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
]);
