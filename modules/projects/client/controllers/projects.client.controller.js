'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$sce', 'ApiKeys', 'GeoCodeApi', '$rootScope', 'AdminAuthService', 'User', 'AdminUpdateUser', '$state', 'UtilsService', '$uibModal', '$window', '$log', 'notify', '$document',
  function ($scope, $stateParams, $location, Authentication, Projects, $http, $sce, ApiKeys, GeoCodeApi, $rootScope, AdminAuthService, User, AdminUpdateUser, $state, UtilsService, $uibModal, $window, $log, notify, $document) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;
    $scope.logo = '../../../modules/core/img/brand/mapping_150w.png';
    var width = '800';
    var height = '250';
    var markerUrl = 'url-http%3A%2F%2Fwww.mappingslc.org%2Fimages%2Fsite_img%2Flogo_marker_150px.png';
    $scope.mapImage = '';
    $rootScope.signInBeforeProject = false;
    $scope.updateToContrib = null;
    $scope.isPublished = false;
    $scope.userToEdit = {};
    $scope.images = [];
    $scope.override = false;
    $scope.isFavorite = false;
    $scope.trustAsHtml = $sce.trustAsHtml;


    $scope.init = function () {
      $scope.publishedProjects();
    };

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

    /**
     * called when $scope.project.status updates
     */
    $scope.projectStatusChanged = function () {
      if ($scope.project.status === 'published') {
        $scope.publishProject();
        $scope.toggleEdit = false;
      } else {
        $scope.update();
        $scope.toggleEdit = false;
      }
    };

      /**
       * Get Featured Array
        */

      $scope.getFeaturedArray = function() {

          $http.get('/api/v1/featured')
          .then(function(err, data){
                  if (err){
                      throw err;
                  } else {
                      $scope.featuredStory = data;
                  }
              })
      };

    $scope.confirmPublishModal = function () {
      $scope.animationsEnabled = true;
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
        controller: 'ModalController',
        size: 'lg'
      });
    };

    var publishUser = function (project) {
      AdminUpdateUser.get({userId: project.user._id},
        function (userData, getResponseHeader) {
          userData.associatedProjects.push(project._id);
          if (userData.roles[0] !== 'admin' || userData.roles[0] !== 'superUser') {
            userData.roles[0] = 'contributor';
          }
          userData.$update(function (userData, putResponseHeaders) {
          });
        });
    };

    $scope.publishProject = function () {
      //todo need to call on a confirm modal first
      $scope.confirmPublishModal();
      $scope.project.publishedDate = new Date();
      $scope.update();
      publishUser($scope.project); //call method to display contributor bio
    };

    var saveProject = null;
    $scope.updateLatLng = function (project) {
      console.log('project ctrl', project);
      $http.get('/api/v1/keys').success(function (data) {
        var mapboxKey = data.mapboxKey;
        var mapboxSecret = data.mapboxSecret;
        var hereKey = data.hereKey;
        var hereSecret = data.hereSecret;

        GeoCodeApi.callGeoCodeApi(project, hereKey, hereSecret, saveProject)
          .success(function (data) {
            project.lat = data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
            project.lng = data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
            project.mapImage = 'http://api.tiles.mapbox.com/v4/' + mapboxKey + '/' + markerUrl + '(' + project.lng + ',' + project.lat + ')/' + project.lng + ',' + project.lat + ',15/' + width + 'x' + height + '.png?access_token=' + mapboxSecret;
            saveProject();
          })
          .error(function (data, status) {

          })
      });
    };

    // Find a list of all published projects
    $scope.publishedProjects = function () {
      $http.get('/api/v1/projects/published').
      success(function (publishedProjects) {
        $scope.publishedProjects = publishedProjects;
        console.log('$scope.publishedProjects:::::::::\n', $scope.publishedProjects);
      }).
      error(function (data, status) {

      });
    };

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
        story: '',
        title: this.project.title
      });

      saveProject = function () {
        project.$save(function (response) {
          $scope.override = true;
          $location.path('projects/' + response._id + '/status');
          // Clear form fields
          $scope.street = '';
          $scope.city = '';
          $scope.state = '';
          $scope.zip = '';
          $scope.story = '';
          $scope.title = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.updateLatLng(project);
      $scope.override = false;
    };

    // Remove existing Project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects [i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          if ($location.path() === '/admin/edit-project/' + $scope.project._id) {
            $location.path('admin/projects-queue');
          } else {
            $location.path('projects');
          }
        });
      }
    };

    // Update existing Project
    $scope.update = function () {
      var project = $scope.project;
      project.$update(function (response) {
        if (response.$resolved) {
          if ($location.path() === '/admin/edit-project/' + project._id) {
            $location.path('/admin/edit-project/' + project._id);
            $scope.toggleEditFn(0);
          } else {
            $location.path('projects/' + project._id);
            $scope.toggleEditFn(0);
          }
          notify({
            message: 'Project updated successfully',
            classes: 'ng-notify-contact-success'
          })
        } else {
          notify({
            message: 'Something went wrong, and we didn\'t receive your message. We apologize.',
            classes: 'ng-notify-contact-failure'
          })
        }
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    // Find a list of Projects
    $scope.find = function () {
      $scope.projects = Projects.query();
    };

    // Find existing Project
    $scope.findOne = function () {

      Projects.get({
        projectId: $stateParams.projectId
      }, function (project) {
        $scope.project = project;
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
        getUserFavoriteStories($scope.user.favorites, $scope.project.id);
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


    //CKEDITOR.replace('story');
    //$scope.editorOptions = {
    //  language: 'en',
    //  uiColor: '#02211D'
    //};
    //CKEDITOR.replaceClass = 'ck-crazy';

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

    /**
     * Favorite project function
     */

    //getUserFavorites.getUserFavoriteStories(userFavoriteProjects, projectId);
    //getUserFavorites.toggleFavProject();

    var getUserFavoriteStories = function (userFavoriteProjects, projectId) {
      userFavoriteProjects.forEach(function (userFavoriteProject) {
        if (userFavoriteProject === projectId) {
          $scope.isFavorite = true;
        }
      });
    };
    $scope.toggleFavProject = function () {
      $scope.isFavorite = !$scope.isFavorite;

      var updateFavoriteObj = {favorite: $scope.project.id, isFavorite: true};
      if (!$scope.isFavorite) {
        updateFavoriteObj.isFavorite = false;
      }
      $http.put('/api/v1/users/' + $scope.user._id, updateFavoriteObj)
    };


    /**
     * modal for leaving projects, will give user warning if leaving form
     *
     */

    $scope.preventRunning = true;
    $scope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        var state = {
          event: event,
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams
        };
        if (!$scope.preventRunning || $scope.override) {
          return
        } else {
          var template = '';
          $scope.items = [];

          if (fromState.url === '/projects/create' && toState.url !== "/signin?err") {
            event.preventDefault();
            $scope.items.toStateUrl = toState.url;
            template = '/modules/projects/client/directives/views/project-warning-modal.html';
            $scope.openModal('lg', template);
          }

        }
      });


    $scope.animationsEnabled = true;
    $scope.openModal = function (size, template, backdropClass, windowClass) {

      var modalInstance = $uibModal.open({
        templateUrl: template,
        controller: 'ModalController',
        animation: $scope.animationsEnabled,
        backdrop: 'static',
        backdropClass: backdropClass,
        windowClass: windowClass,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.preventRunning = false;
        return $location.path(selectedItem);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    };


    /**
     * admin panel editing
     */

    $scope.toggleEdit = false;
    $scope.toggleId = 0;

    $scope.toggleEditFn = function (editNum) {
      $scope.toggleEdit = !$scope.toggle;
      $scope.toggleId = editNum;
    };

    /**
     * nlp
     **/
      //$scope.update()
    $scope.nlpData = null;
    var nlpSampleText = 'My father worked for the Union Pacific railroad for nearly thirty-five years. For most of my life, he was a yardmaster , a job that entailed maintaining perpetual radio contact with trains approaching and departing the railyard, ensuring that there were no accidents and that the endless train traffic was routed for unloading, repair, or continuation as efficiently as possible. Much like an air traffic controller, he worked in a tower. It was perhaps six or seven stories tall, straddled by tracks on either side, and it gave him a birds-eye view of the yard and nearly every human, animal, or mechanical movement within it. Every day for most of his working life, he climbed the zig-zagging stories of steel grate stairs to the small box overlooking an enormous hub of simultaneous movement and stagnation, the flux of capitalism and the slow rot of industry. Since the day he retired over eight years ago, I have never heard him utter a word about his career or workplace unless asked about it. When told that Top End, the yard in which he worked most of his career, was shutting down and that his tower would be demolished to make way for an enormous Utah Transit Authority hub, he merely shrugged and moved on to the Roper Yard in South Salt Lake, where he spent a couple more years guiding trains.';
    $scope.processNlpData = function () {
      $http.get('api/v1/nlp').
      success(function (nlpData) {
        console.log(nlpData);
        $scope.nlpData = nlpData;
      }).
      error(function () {
      });
    };




    //
    //var documentClicked = function(e) {
    //  var target = angular.element(e.target),
    //    parent = angular.element(target.parent()[0]);
    //
    //  if (!(target.hasClass('dropdown-display') && target.hasClass('clicked')) && !(parent.hasClass('dropdown-display') && parent.hasClass('clicked'))) {
    //    $scope.$applyAsync(function() {
    //      $scope.listVisible = false;
    //    });
    //  }
    //};
    //
    //$document.bind('click', documentClicked);
    //
    //
    //
    ////$scope.dropdownList = function($scope) {
    //  $scope.listVisible = false;
    //  $scope.isPlaceholder = true;
    //
    //  $scope.select = function(item) {
    //    $scope.isPlaceholder = false;
    //    $scope.selected = item;
    //  };
    //
    //  $scope.isSelected = function(item) {
    //    return item[$scope.property] === $scope.selected[$scope.property];
    //  };
    //
    //  $scope.show = function() {
    //    $scope.listVisible = true;
    //  };
    //
    //  $rootScope.$on('documentClicked', function(inner, target) {
    //
    //    var parent = angular.element(target.parent()[0]);
    //    if (!(target.hasClass('dropdown-display') && target.hasClass('clicked-add')) && !(parent.hasClass('dropdown-display') && parent.hasClass('clicked-add'))) {
    //
    //      $scope.$apply(function() {
    //        $scope.listVisible = false;
    //      });
    //    }
    //
    //    //  var parent = angular.element(target.parent()[0]);
    //    //  if (!parent.hasClass('clicked')) {
    //    //    $scope.$apply(function () {
    //    //      $scope.listVisible = false;
    //    //    });
    //    //  }
    //
    //
    //  });
    //
    //  $scope.$watch('selected', function(value) {
    //    //$scope.isPlaceholder = $scope.selected[$scope.property] === undefined;
    //    //$scope.display = $scope.selected[$scope.property];
    //  });
    ////};
    //
    //
    //
    //
    //
    //
    //
    //$scope.colours = [{
    //  name: 'Red',
    //  hex: '#F21B1B'
    //}, {
    //  name: 'Blue',
    //  hex: '#1B66F2'
    //}, {
    //  name: 'Green',
    //  hex: '#07BA16'
    //}];
    //$scope.colour = '';
    //


  }

]);

