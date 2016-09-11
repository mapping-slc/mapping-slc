(function () {
  'use strict';

  angular.module('admins')
  .directive('projectAdminFeatures', projectAdminFeatures);

  projectAdminFeatures.$inject = [];

  function projectAdminFeatures() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',
      controller: controller
    };
    return directive;

    function controller($scope, $http, getLists, $mdDialog, $mdToast, _) {
      var vm = this;

      vm.$onInit = function() {
        $scope.projectFeaturedName = 'Not Featured';
        if($scope.project.featured) { $scope.projectFeaturedName = 'Featured'; }
        $scope.toggleEdit = true;
        // console.log('$scope.statusSorts:\n', $scope.statusSorts);
      };


      $scope.statusSorts = getLists.listStatuses();
      $scope.featuredProjects = getLists.listFeaturedProjects();
      $scope.adminCategorySorts = getLists.listCategories();
      // $scope.statusFiltered = $scope.project.status[0].toCapitalCase();



      (function getFeaturedProjs() {
        $http.get('/api/v1/featured', {cache: true})
        .then(function successCallback(resolved) {
          $scope.featuredProjects = resolved.data;
        }, function errorCallback(rejected) {
          return console.log('rejected:\n', rejected);
        });
      })();

      /** Update Featured Projects **/
      $scope.updateFeatured = function () {
        $scope.toggleEditFn(0);
        $scope.toggleEdit = false;

        console.log('$scope.project.featured: ', $scope.project.featured);
        if($scope.project.featured) { $scope.projectFeaturedName = 'Featured'; }
        else { $scope.projectFeaturedName = 'Not Featured'; }

        if($scope.project.featured) {
          if($scope.featuredProjects.length===3) {
            $scope.featuredProjects.splice($scope.featuredProjects-1, 1, $scope.project);
          } else if($scope.featuredProjects.length < 3) {
            $scope.featuredProjects.push($scope.project);
          } else {
            _.dropRight($scope.featuredProjects, $scope.featuredProjects - 3);
            console.error('more than 3 featured projects');
          }
        } else {
          $scope.featuredProjects.splice(
              $scope.featuredProjects.findIndex(function(featuredProject) {
                return featuredProject._id === $scope.project._id;
              }), 1);
        }
        $http.put('api/v1/projects/' + $scope.project._id + '/featured', $scope.project)
        .then(function (resolved) {
          console.log('resolved.data:\n', resolved.data);
        }, function (rejected) {
          console.error('rejected:\n', rejected);
        });
        console.log('projectFeaturedName: ', $scope.projectFeaturedName);
      };

      var publishUser = function() {
        if ($scope.project.status === 'published' && $scope.project.user.roles[0] !== 'admin' || $scope.project.user.roles[0] !== 'superUser') {
          $scope.project.user.roles[0] = 'contributor';
          $http.patch('/api/v1/users/' + $scope.project.user._id, { roles: $scope.project.user.roles })
          .then(function(updatedUser) {
            console.log('updatedUser:\n', updatedUser);
          }, function(err) {
            console.error('ERROR updatedUser:\n', err);
          });
        }
      };

      var publishProject = function() {
        $scope.project.publishedDate = new Date().getTime();
        $scope.updateProject();
        publishUser();
      };


      /** called when $scope.project.status updates **/
      $scope.projectStatusChanged = function () {
        $scope.project.status = $scope.project.status.value;
        if ($scope.project.status === 'published') {
          return showConfirmPublishModal();
        }
        $scope.updateProject();
      };

      // todo the confirm success toast modal works; however the cancel toast does not work
      function showConfirmPublishModal() {
        var modalText = '<ng-md-icon icon="warning"></ng-md-icon><h3>Confirm to Publish Project</h3>' +
            '<p>Please click \'Publish\' to confirm</p>';
        var confirmPublishModal = $mdDialog.confirm()
        .htmlContent(modalText)
        .ariaLabel('Confirm Publishing Project')
        .ok('Publish')
        .cancel('Cancel');

        $mdDialog.show(confirmPublishModal)
        .then(function (confirm) {
          if (confirm) {
            publishProject();
          }
          $mdDialog.hide();
          return confirm;
        })
        .then(function (confirm) {
          var confirmText;
          if (confirm) {
            confirmText = 'modules/core/client/views/md-toasts/confirm-publish-success.html';
          }
          else {
            confirmText = 'modules/core/client/views/md-toasts/confirm-publish-cancel.html'
          }
          console.log('confirmText: ', confirmText);
          $mdToast.show({
            hideDelay: 4000,
            position: 'top',
            toastClass: 'confirm-publish-success',
            templateUrl: confirmText
          });
        });
      }

    }
  }

}());
