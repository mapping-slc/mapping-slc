(function () {
  'use strict';

  angular
    .module('core')
    .filter('toCapitalCase', toCapitalCase);

  toCapitalCase.$inject = [];

  function toCapitalCase() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  }
})();
