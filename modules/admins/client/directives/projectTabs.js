'use strict';

angular.module('admins').directive('projectTabs', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-tabs.html',
    controller: function ($scope, $stateParams, Projects, $location) {


      /** Update an existing Project **/
      $scope.updateProject = function () {

        $scope.originalData = $scope.project;

        $scope.project.$update(function (response) {
          if($location.path() === '/admin/edit-project/' + $scope.project._id) {
            $location.path('/admin/edit-project/' + $scope.project._id);
          } else {
            $location.path('projects/' + $scope.project._id);
          }
        }, function (errorResponse) {
          console.error('ERROR on $scope.updateProject() `errorResponse`:\n', errorResponse);
          $scope.error = errorResponse.data.message;
        });
        $scope.toggleEditFn(0);
        $scope.toggleEdit = false;
      };


      // todo - refactor/rethink if needed -- intention is to hold previous state, in case admin/user cancels edits ... need to revert back to original state ... perhaps most valuable use case is on wysiwyg editor (or user bio ... anything where reverting to previous state is arduous
      $scope.toggleEditFn = function (editNum, isEdit, originalData) {
        // if(isEdit === 'edit') {
        //
        // } else if(isEdit === 'cancel') {
        //   $scope.project.story = originalData;
        // }
        if(isEdit === 'cancel') {
          $scope.project.story = $scope.originalData = originalData;
          console.log('$scope.project.story:\n', $scope.project.story);
          console.log('$scope.originalData:\n', $scope.originalData);
          console.log('originalData:\n',originalData);
        }
        $scope.toggleEdit = !$scope.toggleEdit;
        $scope.toggleId = editNum;
      };


      // not currently in use -- either use or delete
      // would be used for sorting/ordering arrays
      // source: https://docs.angularjs.org/api/ng/filter/orderBy
      $scope.predicate = 'title';
      $scope.reverse = true;
      $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };


      // this.getProject = function () {
      //   return Projects.get({projectId: $stateParams.projectId});
      // };
    }
  };
});
