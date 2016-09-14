(function () {

  'use strict';

  angular
  .module('projects')
  .factory('checkProjectStatus', checkProjectStatus);

  checkProjectStatus.$inject = ['$http', 'Authentication'];


  function checkProjectStatus($stateParams, $http, Authentication, $state) {
    return $http.get(`api/v1/projects/${$stateParams.projectId}`)
    .then(function(project) {
      if (project.data.user._id === Authentication.user._id) {
        return Authentication.user;
      } else {
        $state.go('home');
      }
    }, function (err) {
      return console.error('err: ', err);
    });
  }

  return checkProjectStatus;

}());
