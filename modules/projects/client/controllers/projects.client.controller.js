'use strict';

// Projects controller
//noinspection JSAnnotator
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$sce', 'ApiKeys', 'GeoCodeApi', '$rootScope', 'AdminAuthService', 'UserService', 'User', 'UserData', 'AdminUpdateUser', '$state', 'UtilsService', 'confirmModalService', '$uibModal', '$window', '$log', 'notify', '$document', 'publishedProjectsService', 'userFavoritesService', 'Upload',
  function ($scope, $stateParams, $location, Authentication, Projects, $http, $sce, ApiKeys, GeoCodeApi, $rootScope, AdminAuthService, UserService, User, UserData, AdminUpdateUser, $state, UtilsService, confirmModalService, $uibModal, $window, $log, notify, $document, publishedProjectsService, userFavoritesService, Upload) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;
    $rootScope.signInBeforeProject = false;
    $scope.updateToContrib = null;
    $scope.isPublished = false;
    $scope.userToEdit = {};
    $scope.images = [];
    $scope.files = [];
    $scope.logo = '../../../modules/core/img/brand/mapping_150w.png';
    $scope.override = false;
    $scope.isFavorite = false;
    $scope.trustAsHtml = $sce.trustAsHtml;
    $scope.project = {};
    $scope.previewImages = [];
    $scope.projectFiles = [];
    $scope.uploading = false;

    $scope.initSubmissionStatus = function () {
      $scope.findOne();
    };

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    $scope.showUpload = false;
    $scope.showSubmit = false;
    $scope.showUploadFunction = function () {
      if (project.street !== '') {
        $scope.showUpload = true;
      }
      if ($scope.showUpload && this.project.story !== '') {
        $scope.showSubmit = true;
      }
    };


    var saveProject = null;
    $scope.updateLatLng = function (project) {
      $http.get('/api/v1/keys')
      .then(function (keys, revoked) {

        GeoCodeApi.callGeoCodeApi(project, keys, saveProject)
        .success(function (data) {

          var width = '';
          var height = '250';
          var markerUrl = 'url-http%3A%2F%2Fwww.mappingslc.org%2Fimages%2Fsite_img%2Flogo_marker_150px.svg';
          var markerUrlThumb = 'url-http%3A%2F%2Fwww.mappingslc.org%2Fimages%2Fsite_img%2Flogo_marker_75px.png';

          var mapboxKey = keys.data.MAPBOX_KEY;
          var mapboxSecret = keys.data.MAPBOX_SECRET;
          project.lat = data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
          project.lng = data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
          project.mapImage = 'http://api.tiles.mapbox.com/v4/' + mapboxKey + '/' + markerUrl + '(' + project.lng + ',' + project.lat + ')/' + project.lng + ',' + project.lat + ',15/800x250.png?access_token=' + mapboxSecret;
          project.mapImageThumb = 'http://api.tiles.mapbox.com/v4/' + mapboxKey + '/' + markerUrlThumb + '(' + project.lng + ',' + project.lat + ')/' + project.lng + ',' + project.lat + ',16/350x250.png?access_token=' + mapboxSecret;
          saveProject();
        })
        .error(function (data, status) {

        })
      });
    };


    // todo: refactor by making create project view a directive and add this function in that directive
    // Create new Project
    $scope.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }
      // Create new Project object
      var project = new Projects({
        createdBy: Authentication.user._id,
        street: this.project.street,
        city: this.project.city,
        state: 'UT',
        zip: this.project.zip,
        category: this.project.category,
        story: '',
        title: this.project.title
      });
      console.log('project:\n', project);
      saveProject = function () {
        project.$save(function (response) {
          console.log('project Obj `response`:\n', response);
          console.log('`response.markerColor`: ', response.markerColor);

          if($scope.project.files) {
            $scope.imageUpload('projects', response._id, $scope.project.files);
          }

          // update user's associated projects
          response.user.associatedProjects.push(response._id);
          UserService.patchUser({ associatedProjects: response.user.associatedProjects }, response.user._id);
          $scope.override = true;
          $location.path('projects/' + response._id + '/status');

          // todo create something like `$scope.project.street`, `$scope.project.city`, etc. simpler to read and easier clean up afterwards
          // Clear form fields
          $scope.street = '';
          $scope.city = '';
          $scope.state = '';
          $scope.zip = '';
          $scope.title = '';
          $scope.category = '';
          $scope.story = '';
          $scope.files = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
      $scope.updateLatLng(project);
      $scope.override = false;
    };


    // Remove existing Project
    // todo remove fn commented-out until i've added a mdDialog warning to confirm
    $scope.remove = function (project) {
      // if (project) {
      //   project.$remove();
      //
      //   for (var i in $scope.projects) {
      //     if ($scope.projects [i] === project) {
      //       $scope.projects.splice(i, 1);
      //     }
      //   }
      // } else {
      //   $scope.project.$remove(function () {
      //     if ($location.path() === '/admin/edit-project/' + $scope.project._id) {
      //       $location.path('admin/projects-queue');
      //     } else {
      //       $location.path('projects');
      //     }
      //   });
      // }
    };


    /**
     * Find a list of Projects
     */
    $scope.find = function () {
      $scope.projects = Projects.query();
    };

    /**
     * Find existing Project
     */
    $scope.findOne = function () {
      Projects.get({ projectId: $stateParams.projectId },
        function (project) {
          $scope.project = project;
          // todo refactor to call this in the various directives that need this data, e.g., in userViewFormWrapper.directive.js in admins directive dir
          $scope.userToEdit = UserData.get({ userId: $scope.project.user._id });

          if (project.vimeoId) {
            $scope.vimeo = {
              video: $sce.trustAsResourceUrl('http://player.vimeo.com/video/' + project.vimeoId),
              width: $window.innerWidth / 1.75,
              height: $window.innerHeight / 1.75
            };
          }
          if (project.soundCloudId) {
            $scope.soundCloud = {
              audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + project.soundCloudId + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true',
              width: $window.innerWidth / 1.75,
              height: $window.innerHeight / 1.75
            };
          }
          if (project.imageGallery) {
            for (var i = 0; i < project.imageGallery.length; i++) {
              $scope.images.push(project.imageGallery[i]);
            }
          }
          if (project.fileUrls) {
            for (i = 0; i < project.fileUrls.length; i++) {
              $scope.files.push(project.fileUrls[i]);
            }
          }
          getUserFavoriteStoriesFn($scope.project.user.favorites, $scope.project.id);
        });
    };


    $scope.completed = function () {
      var formField;
      for (formField in $scope.createProject) {
        if ($scope.createProject === null) {
          return $scope.completed = false;
        } else {
          $scope.completed = true;
        }
      }
    };

    // todo refactor to createProject directive

    /**
     * Checks to see if a user is logged in before allowing a user to create a project
     * @type {function}
     * @params: none
     */

    $rootScope.previousState = '';
    $rootScope.currentState = '';
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });
    $scope.goBack = function () {
      if ($rootScope.previousState === 'listProjects') {
        $state.go($rootScope.previousState);
      } else {
        $state.go('admin');
      }
    };
    $scope.run = function ($rootScope, $state, Authentication) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !Authentication.isLoggedIn()) {
        }
        event.preventDefault();
      });
    };

    $scope.userLoggedin = function () {
      // get request to /users/me
      if ($location.path() === '/projects/create') {
        $http.get('/api/v1/users/me')
        .success(function (data) {
          if (data === null) {
            $rootScope.signInBeforeProject = true;
            $location.path('/authentication/signin');
          }
        });
      }
    }();


    var getUserFavoriteStoriesFn = function (userFavoriteProjects, projectId) {
      userFavoritesService.getUserFavoriteStories(userFavoriteProjects, projectId,
        function (err, data) {
          $scope.isFavorite = data;
        }
      );
    };

    // refactored - code now in use at
    // $scope.toggleFavProjectFn = function () {
    //   userFavoritesService.toggleFavProject($scope.isFavorite, $scope.project,
    //     function (err, data) {
    //       $scope.isFavorite = data;
    //     });
    // };


    // $scope.toggleEdit = false;
    // $scope.toggleId = 0;
    //
    // $scope.toggleEditAdminPanel = function (editNum, isEdit, originalData) {
    //
    // };




  }
]);
