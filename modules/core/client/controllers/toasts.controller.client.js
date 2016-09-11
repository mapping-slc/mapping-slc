(function () {
  'use strict';

  angular
  .module('core')
  .controller('ToastController', ToastController);

  ToastController.$inject = ['$scope', '$mdToast'];

  function ToastController($scope, $mdToast) {
    var vm = this;
    vm.closeToast = function() {
      $mdToast.hide();
    };
    $scope.closeToast = function() {
      $mdToast.hide();
    }
  }

}());
