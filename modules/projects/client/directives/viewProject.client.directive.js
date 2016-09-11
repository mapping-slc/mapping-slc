(function () {
  'use strict';

  angular.module('projects')
  .config(function (LightboxProvider) {
    LightboxProvider.templateUrl = 'modules/core/client/views/lightbox-template.html';
    LightboxProvider.fullScreenMode = false;
    LightboxProvider.getImageUrl = function (image) {
      return image.imageUrl;
    };
    LightboxProvider.getImageCaption = function (image) {
      return image.imageCaption;
    };
  })
  .directive('viewProject', viewProject);

  viewProject.$inject = [];

  function viewProject() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/projects/client/directives/views/view-project.html',
      controller: controller
    };
    return directive;

    function controller($scope, Lightbox) {
      $scope.findOne();
      this.$onInit = function () {
      };

      $scope.toggleFavProjectFn = function () {
        userFavoritesService.toggleFavProject($scope.isFavorite, $scope.project,
            function (err, data) {
              $scope.isFavorite = data;
            });
      };


      /**
       * Lightbox
       */
      $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
      };

    }
  }
}());
