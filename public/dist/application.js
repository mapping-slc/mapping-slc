'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngCkeditor', 'bootstrapLightbox', 'cgNotify', 'ngFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('admins');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contacts');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

/**




console.log('#   __    __                            __     __                                            __       __\n#  /  |  /  |                          /  |   /  |                                          /  \     /  |\n#  $$ |  $$ | ______  __    __        _$$ |_  $$ |____   ______   ______   ______           $$  \   /$$ | ______   ______   ______   ______   ______\n#  $$ |__$$ |/      \\/  |  /  |      / $$   | $$      \\ /      \\ /      \\ /      \\          $$$  \\ /$$$ |/      \\ /      \\ /      \\ /      \\ /      \\\n#  $$    $$ /$$$$$$  $$ |  $$ |      $$$$$$/  $$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |         $$$$  /$$$$ |$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |\n#  $$$$$$$$ $$    $$ $$ |  $$ |        $$ | __$$ |  $$ $$    $$ $$ |  $$/$$    $$ |         $$ $$ $$/$$ |/    $$ $$ |  $$ $$ |  $$ $$    $$ $$ |  $$/\n#  $$ |  $$ $$$$$$$$/$$ \__$$ |        $$ |/  $$ |  $$ $$$$$$$$/$$ |     $$$$$$$$/ __       $$ |$$$/ $$ /$$$$$$$ $$ |__$$ $$ |__$$ $$$$$$$$/$$ |__\n#  $$ |  $$ $$       $$    $$ |        $$  $$/$$ |  $$ $$       $$ |     $$       /  |      $$ | $/  $$ $$    $$ $$    $$/$$    $$/$$       $$ /  |\n#  $$/   $$/ $$$$$$$/ $$$$$$$ |         $$$$/ $$/   $$/ $$$$$$$/$$/       $$$$$$$/$$/       $$/      $$/ $$$$$$$/$$$$$$$/ $$$$$$$/  $$$$$$$/$$/$$/\n#                    /  \__$$ |                                                   $/                             $$ |     $$ |\n#                    $$    $$/                                                                                   $$ |     $$ |\n#                     $$$$$$/                                                                                    $$/      $$/');




**/

'use strict';

//Setting up route
angular.module('admins').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
]);

'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
      state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view>',
        //data property is inherited by child states, so you can place something like this authenticate flag in the parent.
        data: {
          authenticate: true,
          data: {
            roles: ['admin', 'superUser']
          }
        }
      })
    //admin projects routes
      .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/admins/client/views/admins.client.view.html',
        data: {
          authenticate: true,
          data: {
            roles: ['admin', 'superUser']
          }
        }
      })
      .state('admin.adminProjectsQueue', {
        url: '/projects-queue',
        templateUrl: 'modules/admins/client/views/projects/admin-projects-list.client.view.html'
      })
      .state('admin.adminEditProject', {
        url: '/edit-project/:projectId',
        templateUrl: 'modules/admins/client/views/projects/admin-view-project.client.view.html'
      })


    //admin contact form routes
      .state('admin.adminListMessages', {
        url: '/messages',
        templateUrl: 'modules/admins/client/views/messages/admin-list-messages.client.view.html'
      })
      .state('admin.adminViewMessage', {
        url: '/messages/:contactId',
        templateUrl: 'modules/admins/client/views/messages/admin-view-message.client.view.html'
      })


    //admin user routes
      .state('admin.adminListUsers', {
        url: '/list-users',
        templateUrl: 'modules/admins/client/views/users/admin-list-users.client.view.html'
      })
      .state('admin.adminViewUser', {
        url: '/users/:userId',
        templateUrl: 'modules/admins/client/views/users/admin-view-user.client.view.html'
      }).
      state('adminEditUser', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/admins/client/views/users/admin-edit-user.client.view.html'
      })
      .state('admin.createUser', {
        url: '/create-user',
        templateUrl: 'modules/users/client/views/create-user.client.view.html'
      });
  }

]);

'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', 'd3', '$stateParams', '$location', 'Authentication', 'Projects', 'UserData', 'Contacts', 'AdminAuthService',
	function ($scope, d3, $stateParams, $location, Authentication, Projects, UserData, Contacts, AdminAuthService) {
		$scope.authentication = Authentication;
		$scope.isAdmin = AdminAuthService;

		//for dropdown

		$scope.colors = [{
			name: 'Red',
			hex: '#F21B1B'
		}, {
			name: 'Blue',
			hex: '#1B66F2'
		}, {
			name: 'Green',
			hex: '#07BA16'
		}];

		$scope.color = '';

		$scope.colorsArray = ["Red", "Green", "Blue"];



		//
		//function run($rootScope, $state, Authentication) {
		//
		//	$rootScope.$on('$stateChangeStart',
		//		function(event, toState, toParams, fromState, fromParams) {
		//			if ( toState.authenticate && !Authentication.isLoggedIn() ) {
		//				$state.go( 'login' );
		//			}
		//			event.preventDefault();
		//		}
		//	)};


	var run = function ($rootScope, $state, Authentication) {
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if (toState.authenticate && !Authentication.isLoggedIn()) {
				$state.go('signin');
			}
			event.preventDefault();
		});

	};

		// If user is not an administrator then redirect back home
		if (!$scope.admin) $location.path('/');


		/**
		 *
		 * Projects Admin Functions
		 *
		 **/


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
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function () {
			var project = $scope.project;

			project.$update(function () {
				$location.path('projects/' + project._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.findProjects = function () {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOneProject = function () {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			});
		};


		/**
		 *
		 * Users Admin Functions
		 *
		 **/


			// Update a user profile
		$scope.updateUserProfile = function () {
			$scope.success = $scope.error = null;
			var user = new UserData($scope.user);

			user.$update(function (response) {
				$scope.success = true;
				Authentication.user = response;
			}, function (response) {
				$scope.error = response.data.message;
			});
		};


		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function (provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function (provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};



		//featured projects --- either a service injected into core or in core ctrl

	}
]);

'use strict';

//Admins service used for communicating with the articles REST endpoints
angular.module('admins').factory('Admins', ['$resource',
  function ($resource) {
    return $resource('api/v1/admins/:adminId', {
      adminId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//'use strict';
//
////angular.module('admins').run(function($rootScope) {
////	angular.element(document).on('click', function(e) {
////		$rootScope.$broadcast('documentClicked', angular.element(e.target));
////	});
////});
//
//angular.module('admins').directive('dropdown', function($rootScope) {
//	return {
//		restrict: 'E',
//		templateUrl: '/modules/admins/directives/views/dropdown.html',
//		scope: {
//			placeholder: '@',
//			list: '=',
//			selected: '=',
//			property: '@'
//		},
//		link: function(scope) {
//			scope.listVisible = false;
//			scope.isPlaceholder = true;
//
//			scope.select = function (item) {
//				scope.isPlaceholder = false;
//				scope.selected = item;
//			};
//
//			scope.isSelected = function (item) {
//				return item[scope.property] === scope.selected[scope.property];
//			};
//
//			scope.show = function () {
//				scope.listVisible = true;
//			};
//
//			//$rootScope.$on('documentClicked', function(inner, target) {
//			//	console.log($(target[0]).is('.dropdown-display.clicked') || $(target[0]).parents('.dropdown-display.clicked').length > 0);
//			//	if (!$(target[0]).is('.dropdown-display.clicked') && !$(target[0]).parents('.dropdown-display.clicked').length > 0)
//			//		scope.$apply(function() {
//			//			scope.listVisible = false;
//			//		});
//			//});
//
//			$rootScope.on('documentClicked', function(inner, target) {
//				var parent = angular.element(target.parent()[0]);
//				if (!parent.hasClass('clicked')) {
//					scope.$apply(function () {
//						scope.listVisible = false;
//					});
//				}
//			});
//
//			scope.$watch('selected', function(value) {
//				scope.isPlaceholder = scope.selected[scope.property] === undefined;
//				scope.display = scope.selected[scope.property];
//			});
//		}
//	}
//})
//
//	.run(function($rootScope) {
//		angular.element(document).on('click', function(e) {
//			$rootScope.$broadcast('documentClicked', angular.element(e.target));
//		});
//	});
'use strict';

angular.module('admins').directive('projectAdminFeatures', function () {
	return {
		restrict: 'EA',
		templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',

		link: function ($scope) {
			console.log('inside directive projAdminFeatures, logging $scope.project:\n', $scope.project);
			if($scope.project.status === 'published'){
			}
		}
	};
});



'use strict';

angular.module('admins').directive('projectEditor', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/project-editor.html'
        };
    });

'use strict';

angular.module('admins').directive('projectMainTab', function () {
	return {
		restrict: 'E',
		templateUrl: '/modules/admins/client/directives/views/project-main-tab.html'
	};
});

'use strict';

angular.module('admins').directive('projectMultimedia', function () {
	return {
		restrict: 'E',
		templateUrl: '/modules/admins/client/directives/views/project-multimedia.html'
	};
});

'use strict';

angular.module('admins').directive('projectViewForm', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/project-view-form.html'
        };
    });

'use strict';

angular.module('admins').directive('userViewForm', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/user-view-form.html'
        };
    });

'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts', '$http', 'AdminAuthService', 'UtilsService', 'notify',
	function($scope, $stateParams, $location, Authentication, Contacts, $http, AdminAuthService, UtilsService, notify) {
		$scope.authentication = Authentication;
		$scope.isAdmin = AdminAuthService;

		//function to create a link on an entire row in a table
		$scope.viewMessage = function(contactId) {
			$location.path('admin/messages/' + contactId);
		};

		//provides logic for the css in the forms
		UtilsService.cssLayout();


		//todo  'moment' is not defined.  --> from grunt jslint
		// $scope.dateNow = moment();


		$scope.toggleSort = true;
		$scope.oneAtATime = true;

		// Create new Contact
		$scope.create = function() {
			// Create new Contact object
			var contact = new Contacts ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				zip: this.zip,
				newsletter: this.newsletter,
				message: this.message
			});

			// Redirect after save
			contact.$save(function(response) {
				$location.path('/');

				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.zip = '';
				$scope.newsletter = '';
				$scope.message = '';
        console.log('response:\n', response);
        if(response.$resolved) {
          notify({
            message: 'Thanks for the message!',
            classes: 'ng-notify-contact-success'
          })
        }else{
          notify({
            message: 'Something went wrong, and we didn\'t receive your message We apologize.',
            classes: 'ng-notify-contact-failure'
          })
        }
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contact
		$scope.remove = function(contact) {
			if ( contact ) { 
				contact.$remove();

				for (var i in $scope.contacts) {
					if ($scope.contacts [i] === contact) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
					$location.path('contacts');
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact;

			contact.$update(function() {
				$location.path('contacts/' + contact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
		};

		//get data from back end for display in table
		$http.get('/contacts').
			success(function(messageData){
				//console.log(messageData);
				$scope.messageData = messageData;

				$scope.sentToday = function(){
					//if(messageData.created === moment()){
					//	return moment().calendar(messageData.created);
					//}else{
						var today = moment().calendar(messageData.created);
						return today;
					//}
				};

			}).
			error(function(data, status){

			});

	}
]);



'use strict';

//Setting up route
angular.module('contacts').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
]);

'use strict';

//Setting up route
angular.module('contacts').config(['$stateProvider',
    function ($stateProvider) {
        // Contacts state routing
        $stateProvider.
            state('createContact', {
                url: '/contact-us',
                templateUrl: 'modules/contacts/client/views/contact-us.client.view.html',
            })
            .state('editContact', {
                url: '/contacts/:contactId/edit',
                templateUrl: 'modules/contacts/client/views/edit-contact.client.view.html'
            })
            .state('aboutMappingSlc', {
                url: '/about-mapping-slc',
                templateUrl: 'modules/contacts/client/views/about-mapping-slc.client.view.html'
            })
            .state('aboutUs', {
              url: '/about-us',
              templateUrl: 'modules/contacts/client/views/about-us.client.view.html'
            });
    }
]);

'use strict';

//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('api/v1/contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('projects').config(['$compileProvider',
      function ($compileProvider) {

        //turn off debugging for  prod
        // https://docs.angularjs.org/guide/production
        $compileProvider.debugInfoEnabled(false);
  }
]);

//.run(function($rootScope) {
//    angular.element(document).on('click', function(e) {
//      $rootScope.$broadcast('documentClicked', angular.element(e.target));
//    });
//  });






'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
    state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
    }).
    state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/client/views/create-project.client.view.html',
      loginRequired: true
    }).
    state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/client/views/view-project.client.view.html'
    }).
    state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
      data: {
        authenticate: true,
        roles: ['contributor', 'admin', 'superUser']
      }
    }).
    state('confirmCreateProject', {
      url: '/projects/:projectId/status',
      //data: {
      //  authenticate: true,
      //  roles: ['contributor', 'admin', 'superUser']
      //}
      templateUrl: 'modules/projects/client/views/project-for-submission.client.view.html'
    });
  }
]);

'use strict';

angular.module('projects').controller('ProjectsUploadController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http',
  function ($scope, $timeout, $window, Authentication, Upload, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.uploading = false;

    $scope.onFileSelect = function(files) {

      if (files.length > 0) {
        $scope.uploading = true;
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          filename: filename,
          type: type,
          user: $scope.user,
          project: $scope.project
        };
        var configObj = {cache: true};
        $http.post('api/v1/s3/upload/project', query, configObj)
          .success(function(result) {
            console.log('result v1\n', result);
            Upload.upload({
              url: result.url, //s3Url
              transformRequest: function(data, headersGetter) {
                var headers = headersGetter();
                delete headers.Authorization;
                console.log('data v1\n', data);
                return data;
              },
              fields: result.fields, //credentials
              method: 'POST',
              file: files[0]
            }).progress(function(evt) {

              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));

            }).success(function(data, status, headers, config) {

              // file is uploaded successfully
              $scope.uploading = false;

              console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

              // need to set image on front end
              if(data && data.s3Url) {
                console.log('data v2\n', data);
                $scope.user.profileImageURL = data.s3Url;
                $scope.imageURL = data.s3Url;
              }
              console.log('$scope.imageURL:\n', $scope.imageURL);
              //$http({
              //  url: '',
              //  method: 'PUT'
              //})
              //  .then(function(data) {
              //
              //  })
              //  .finally(function(data) {
              //
              //  });

              // and need to update mongodb


            }).error(function() {

            });

            if(result && result.s3Url) {
              console.log('result v2\n', result);
              $scope.user.profileImageURL = result.s3Url;
              $scope.imageURL = result.s3Url;
            }
          })
          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.uploading = false;
          });

        //  .xhr(function(xhr) {
        //    $scope.abort = function() {
        //    xhr.abort();
        //    $scope.uploading = false;
        //  };
        //});

      }


    };


  }
]);

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
      $http.get('/api/v1/keys')
        .then(function (keys, revoked) {

        GeoCodeApi.callGeoCodeApi(project, keys, saveProject)
          .success(function (data) {
            var mapboxKey = keys.data.MAPBOX_KEY;
            var mapboxSecret = keys.data.MAPBOX_SECRET;
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


//'use strict';
//
//angular.module('projects').directive('dropdownList', function($rootScope) {
//  return {
//    restrict: 'E',
//    templateUrl: 'modules/projects/client/directives/views/dropdown-list.html',
//    scope: {
//      placeholder: '@',
//      list: '=',
//      selected: '=',
//      property: '@'
//    },
//    link: function(scope) {
//      scope.listVisible = false;
//      scope.isPlaceholder = true;
//
//      scope.select = function(item) {
//        scope.isPlaceholder = false;
//        scope.selected = item;
//      };
//
//      scope.isSelected = function(item) {
//        return item[scope.property] === scope.selected[scope.property];
//      };
//
//      scope.show = function() {
//        scope.listVisible = true;
//      };
//
//      $rootScope.$on('documentClicked', function(inner, target) {
//
//        var parent = angular.element(target.parent()[0]);
//    if (!(target.hasClass('dropdown-display') && target.hasClass('clicked-add')) && !(parent.hasClass('dropdown-display') && parent.hasClass('clicked-add'))) {
//
//          scope.$apply(function() {
//            scope.listVisible = false;
//          });
//        }
//
//      //  var parent = angular.element(target.parent()[0]);
//      //  if (!parent.hasClass('clicked')) {
//      //    scope.$apply(function () {
//      //      scope.listVisible = false;
//      //    });
//      //  }
//
//
//      });
//
//      scope.$watch('selected', function(value) {
//        //scope.isPlaceholder = scope.selected[scope.property] === undefined;
//        //scope.display = scope.selected[scope.property];
//      });
//    }
//  }
//});

'use strict';

angular.module('projects').directive('projectStatusOverview', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-overview.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusProjectEditor', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-project-editor.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusProjectInfo', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-project-info.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusUserBio', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-user-bio.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusUserInfo', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-user-info.html'
        };
    });

'use strict';

angular.module('projects').directive('projectUploaderDirective', function () {
  return {
    restrict: 'AE',
    templateUrl:'/modules/projects/client/directives/views/projectUploader.html',
    controller: ["$scope", "$http", function($scope,$http) {


      // Project Uploader Service logic

      $scope.uploading = false;

      $scope.projectUpload = function (files) {

        if (files.length > 0) {
          $scope.uploading = true;
          var filename = files[0].name;
          var type = files[0].type;
          var query = {
            filename: filename,
            type: type,
            user: $scope.user,
            project: $scope.project
          };
          var configObj = {cache: true};
          $http.post('api/v1/s3/upload/project', query, configObj)
            .success(function (result) {
              console.log('result v1\n', result);
              Upload.upload({
                url: result.url, //s3Url
                transformRequest: function (data, headersGetter) {
                  var headers = headersGetter();
                  delete headers.Authorization;
                  console.log('data v1\n', data);
                  return data;
                },
                fields: result.fields, //credentials
                method: 'POST',
                file: files[0]
              }).progress(function (evt) {

                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));

              }).success(function (data, status, headers, config) {

                // file is uploaded successfully
                $scope.uploading = false;

                console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

                // need to set image on front end
                if (data && data.s3Url) {
                  console.log('data v2\n', data);
                  $scope.project.file = data.s3Url;
                }
                console.log('$scope.imageURL:\n', $scope.imageURL);


              }).error(function () {

              });

              if (result && result.s3Url) {
                console.log('result v2\n', result);
                $scope.user.profileImageURL = result.s3Url;
                $scope.imageURL = result.s3Url;
              }
            })
            .error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $scope.uploading = false;
            });

          //  .xhr(function(xhr) {
          //    $scope.abort = function() {
          //    xhr.abort();
          //    $scope.uploading = false;
          //  };
          //});

        }

      }

    }]

  }
});

//'use strict';
//
//angular.module('projects').directive('staticMap', ['$scope',
//	function($scope) {
//		return {
//			template: '<div></div>',
//			restrict: 'E',
//			link: function postLink(scope, element, attrs) {
//
//				//create static map from lat and long
//
//				$scope.mapImage =
//					'http://api.tiles.mapbox.com/v4/{' +
//					data.mapboxKey + '/' +
//					this.geocode.long + ',' +
//					this.geocode.lat +
//					',10/' + //set the map zoom: default '10'
//					width + 'x' + height + '.png?access_token=' +
//					data.mapboxSecret;
//
//				//{name}-{label}+{color}({lon},{lat})
//				//var width = '100%';
//				//var height = 'auto';
//
//				element.text('this is the staticMap directive');
//			}
//		};
//	}
//]);
'use strict';

angular.module('projects').service('GeoCodeApi', ['$http',
  function ($http) {

    // Geocodeapi service logic

    this.callGeoCodeApi = function (project, keys, projectSaveCallback) {
      console.log('keys::::::::\n', keys);
      console.log('keys.data.::::::::\n', keys.data);
      console.log('data.HERE_KEY::::::::\n', keys.data.HERE_KEY);
      console.log('data.HERE_SECRET::::::::\n', keys.data.HERE_SECRET);
      var hereKey = keys.data.HERE_KEY;
      var hereSecret = keys.data.HERE_SECRET;

      if (!project || !project.state || !project.city || !project.zip || !project.street || !hereKey || !hereSecret) {
        projectSaveCallback();
        console.log('err, there\'s an error, yo.');
        return;
      }

      return $http.get('http://geocoder.cit.api.here.com/6.2/geocode.json' +
          '?state=' + project.state +
          '&city=' + project.city +
          '&postalcode=' + project.zip +
          '&street=' + project.street +
          '&gen=8' +
          '&app_id=' + hereKey +
          '&app_code=' + hereSecret)
        .success(function (geoData) {
          project.lat = geoData.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
          project.lng = geoData.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        }).error(function (data, status) {
          console.log('geocode error:\n', data, 'status:\n', status);
          //TODO: handle this gracefully
        });

    };
  }
]);

'use strict';

angular.module('projects').service('getUserFavorites', ['$scope', '$http',
  function ($scope, $http) {
      this.getUserFavoriteStories = function (userFavoriteProjects, projectId) {
        userFavoriteProjects.forEach(function (userFavoriteProject) {
          if (userFavoriteProject === projectId) {
            $scope.isFavorite = true;
          }
        });
      };
      this.toggleFavProject = function () {
        $scope.isFavorite = !$scope.isFavorite;

        var updateFavoriteObj = {favorite: $scope.project.id, isFavorite: true};
        if (!$scope.isFavorite) {
          updateFavoriteObj.isFavorite = false;
        }
        $http.put('/api/v1/users/' + $scope.user._id, updateFavoriteObj)
      };
  }
]);

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('api/v1/projects/:projectId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		}, {
			create: {
				method: 'POST'
			}
		}, {
			read: {
				method: 'GET'
			}
		}
		);
	}
]);

'use strict';

angular.module('projects').service('PublishingService', ['$http',
  function ($http) {

    this.getPublishedProjects = function () {
      console.log('publishing service');
      $http.get('/api/v1/projects/published');
      //.success(function (data) {
      //  console.log('published list data:\n', data);
      //  return data;
      //}).
      //error(function (data, error) {
      //  console.log('publishing error:\n', data, '\n', error);
      //});

    };

  }
]);

//'use strict';
//
//// Configuring the Articles module
//angular.module('users.admin').run(['Menus',
//  function (Menus) {
//    Menus.addSubMenuItem('topbar', 'admin', {
//      title: 'Manage Users',
//      state: 'admin.users'
//    });
//  }
//]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return AdminUpdateUser.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return AdminUpdateUser.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider', 'LightboxProvider', '$compileProvider',
  function ($httpProvider, LightboxProvider, $compileProvider) {

    //turn off debugging for  prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);

    // Set the httpProvider "not authorized" interceptor

    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);


    /**
     // todo Lightbox

     // set a custom template
     LightboxProvider.templateUrl = '/modules/users/client/directives/views/lightbox.html';

     // our images array is not in the default format, so we have to write this
     // custom method
     LightboxProvider.getImageUrl = function (imageUrl) {
      return imageUrl;
    };

     // set the caption of each image as its text color
     LightboxProvider.getImageCaption = function (imageUrl) {
      return '#' + imageUrl.match(/00\/(\w+)/)[1];
    };

     // increase the maximum display height of the image
     LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
      return {
        'maxWidth': dimensions.windowWidth >= 768 ? // default
        dimensions.windowWidth - 92 :
        dimensions.windowWidth - 52,
        'maxHeight': 1600                           // custom
      };
    };

     // the modal height calculation has to be changed since our custom template is
     // taller than the default template
     LightboxProvider.calculateModalDimensions = function (dimensions) {
      var width = Math.max(400, dimensions.imageDisplayWidth + 32);

      if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
        width = 'auto';
      }

      return {
        'width': width,    // default
        'height': 'auto'   // custom
      };
    };

     **/


//.config(function (LightboxProvider) {

      //set a custom template
    LightboxProvider.templateUrl = '/modules/users/client/views/lightbox.html';

//// set the caption of each image as its text color
//  LightboxProvider.getImageCaption = function (imageUrl) {
//    return '#' + imageUrl.match(/00\/(\w+)/)[1];
//  };

    // increase the maximum display height of the image
    LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
      return {
        'maxWidth': dimensions.windowWidth >= 768 ? // default
        dimensions.windowWidth - 92 :
        dimensions.windowWidth - 52,
        'maxHeight': 1600                           // custom
      };
    };

    // the modal height calculation has to be changed since our custom template is
    // taller than the default template
    LightboxProvider.calculateModalDimensions = function (dimensions) {
      var width = Math.max(400, dimensions.imageDisplayWidth + 32);

      if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
        width = 'auto';
      }

      return {
        'width': width,                             // default
        'height': 'auto'                            // custom
      };
    };
  }

]);


'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          authenticate: true,
          roles: ['user', 'registered', 'contributor', 'admin', 'superUser']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.favorites', {
        url: '/favorites',
        templateUrl: 'modules/users/client/views/settings/favorites.client.view.html'
      })
      .state('settings.submissions', {
        url: '/submissions',
        //abstract: true,
        templateUrl: 'modules/users/client/views/settings/submissions-list.client.view.html'
        //templateUrl: 'modules/users/client/directives/views/user-submissions-list.html'
      })
      .state('settings.submissionsView', {
        url: '/:projectId/status/',
        templateUrl: 'modules/users/client/views/settings/submissions-view.client.view.html'
        //templateUrl: 'modules/users/client/directives/views/user-submissions-view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      })
      .state('contributors', {
        url: '/contributors',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.list.html'
      })
      .state('contributor', {
        url: '/contributors/:userId',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.view.html'
      });
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$uibModal', 'UtilsService',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $uibModal, UtilsService) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/v1/auth/signup', $scope.credentials)
        .success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/v1/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.user = $scope.authentication.user = response;
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    $scope.goToSignUp = function ($state) {
      $state.go('signup');
    };


    // Reroutes from sign in to sign up on modal
    $scope.modalOpenSignUp = function () {
      var isSwitched = false;
      $uibModal.open({
        templateUrl: function () {
          if (!isSwitched) {
            isSwitched = false;
            return 'modules/users/client/views/authentication/signup.client.view.html';

          } else {
            return 'modules/users/client/views/authentication/signin.client.view.html';

          }
        },
        size: 'lg',
        backdropClass: 'sign-in-modal-background',
        windowClass: 'sign-in-modal-background',
        backdrop: false,
        controller: ["$scope", function ($scope) {

        }]

      }).then(function () {

        console.log('Success!!!!!');
      });
    };

  }
]);

'use strict';


angular.module('users').controller('ContributorController', ['$scope', '$animate', '$location', 'Authentication', 'GetContributors', '$stateParams', '$http', '$uibModal', '$window', 'Lightbox', 'UtilsService', 'User', 'Projects',
  function ($scope, $animate, $location, Authentication, GetContributors, $stateParams, $http, $uibModal, $window, Lightbox, UtilsService, User, Projects) {

    $scope.contributors = null;
    $scope.contributor = {};
    $scope.contributorProjects = [];
    $scope.contribData = {};
    $scope.images = [];

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    /**
     * Lightbox
     */
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.init = function () {
      getContribData();
    };

    var getContribData = function() {
      GetContributors.contributors()
        .success(function (contributorsData) {
          getImages(contributorsData);
          $scope.contributors = contributorsData;
          return $scope.images;
        }).
      error(function (errorData) {
        console.log('errorData: ', errorData);
      });
    };

    var getImages = function (contribData) {
      for(var i = 0; i < contribData.length; i++ ) {
        var tempData = {};
        tempData.url = contribData[i].profileImageURL;
        tempData.thumbUrl = contribData[i].profileImageThumbURL;
        tempData.caption = contribData[i].bio;
        $scope.images.push(tempData);
      }

    };

    $scope.findContributor = function() {
      User.get({userId: $stateParams.userId},
        function(userData) {
          getAssociatedProjects(userData);
          $scope.contributor = userData;
      });
    };

    var getAssociatedProjects = function(userObj) {
      for (var i = 0; i < userObj.associatedProjects.length; i++) {
        Projects.get({projectId: userObj.associatedProjects[i]},
        function(projectObj){
          $scope.contributorProjects.push(projectObj);
        })
      }
    };


    $scope.changeView = function (view) {
      $location.path(view);
    };

  }
]);

'use strict';

// Projects controller
angular.module('users').controller('GalleryController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$uibModal',
    function ($scope, $stateParams, $location, Authentication, $http, $uibModal) {

        //Give user warning if leaving form
        var preventRunning = false;
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (preventRunning) {
                return;
            }
            if (fromState.url === '/projects/create' && toState.url !== '/projects/:projectId') {
                event.preventDefault();

                $uibModal.open({
                    templateUrl: '/modules/projects/directives/views/modal.html',
                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                        $scope.closeMe = function () {
                            $modalInstance.dismiss(function (reason) {
                                console.log(reason);
                            });
                        };
                        $scope.leave = function () {
                            preventRunning = true;
                            $scope.closeMe();
                            $location.path(toState);
                        };
                    }],
                    size: 'lg'
                });
            }

        });



    }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/v1/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/v1/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'UserData', 'Users', 'ProfileImageService', 'Projects', '$http', '$resource', 'Newsletter',
  function ($scope, $state, $stateParams, Authentication, UserData, Users, ProfileImageService, Projects, $http, $resource, Newsletter) {
    $scope.user = Authentication.user;
    var favoriteProjects = $scope.user.favorites;
    var associatedProjects = $scope.user.associatedProjects;
    var userProjects = [];
    var userFavorites = [];


    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      //probably need to create new User instance before being able to use `user.$update()`
      //also need to better understand `$state.go()`
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    //delete user
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    // Find a list of Users
    $scope.find = function () {
      $scope.users = Users.query($scope.query);
      ProfileImageService.getUploadedProfilePic();
    };

    // Find existing User
    $scope.findOne = function () {
      $scope.user = UserData.get({
        userId: $stateParams.userId || $scope.user.userId
      });
      console.log('$scope.users: ', $scope.users);
    };

    //Find existing project submissions by UserId
    $scope.findUserFavorites = function () {
      $scope.getFavorites = function (favoriteProjects) {
        favoriteProjects.forEach(function (favoriteProject) {
          userFavorites.push(Projects.get({
              projectId: favoriteProject
            })
          );
        });
        $scope.userFavorites = userFavorites;
        return userFavorites;
      };
      $scope.getFavorites(favoriteProjects);
    };

    //Find existing project submissions by UserId
    $scope.findCurrentUserSubmissions = function () {
      $scope.getProjects = function (associatedProjects) {
        associatedProjects.forEach(function (associatedProject) {
          userProjects.push(Projects.get({
              projectId: associatedProject
            })
          );
        });
        $scope.userProjects = userProjects;
        return userProjects;
      };
      $scope.getProjects(associatedProjects);

    };

    /**
     * newsletter subscription form
     */
    $scope.newsletterSubscription = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return;
      }
      // Send email enter from input field to back end
      $scope.users = Newsletter.query({email: $scope.subscribe.newsletter});

    };



    /**
     * Remove User Favorites function
     */

    $scope.removeFavProject = function (projectId) {
      $scope.$on('$stateChangeStart',
        function (event) {
            event.preventDefault();

          console.log('kill that fav!', projectId);
          console.log('kill that fav!', $scope.user);

          $scope.isFavorite = false;
          var updateFavoriteObj = {favorite: projectId, isFavorite: false};
          $http.put('/api/v1/users/' + $scope.user._id, updateFavoriteObj);

          return;

          });

    };


  }
]);

'use strict';

angular.module('users').directive('changeProfilePicture', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/users/client/directives/views/change-profile-picture.html'
        };
    });

'use strict';

angular.module('users').directive('editProfile', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/users/client/directives/views/edit-profile.html'
        };
    });

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

//'use strict';
//
//angular.module('users').directive('userSubmissionsList', function() {
//        return {
//          restrict: 'EA',
//          templateUrl: 'modules/users/client/directives/views/user-submissions-list.html',
//          controller: function($scope, Projects) {
//           // Find existing project submissions by UserId
//            $scope.findCurrentUserSubmissions = function () {
//              var associatedProjects = $scope.user.associatedProjects;
//              var userProjects = [];
//              $scope.getProjects = function (associatedProjects) {
//                associatedProjects.forEach(function (associatedProject) {
//                  userProjects.push(Projects.get({
//                      projectId: associatedProject
//                    })
//                  );
//                });
//                console.log('userProjects:\n', userProjects);
//                return userProjects;
//              };
//              $scope.userProjects = $scope.user.projects = $scope.getProjects(associatedProjects);
//
//            };
//          }
//        };
//    });

'use strict';

angular.module('users').directive('userSubmissionsView', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/users/client/directives/views/user-submissions-list.html',
          controller: ["$scope", "Projects", function($scope, Projects) {

           // Find existing project submissions by UserId
            $scope.findCurrentUserSubmissions = function () {

              var associatedProjects = $scope.user.associatedProjects;
              var userProjects = [];

              var getProjects = function (associatedProjects) {
                associatedProjects.forEach(function (associatedProject) {
                  userProjects.push(Projects.get({
                      projectId: associatedProject
                    })
                  );
                });
                return userProjects;
              };

              $scope.userProjects = $scope.user.projects = getProjects(associatedProjects);

            };
          }]
        };
    });

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// retrieve all contributors' and admins' profile data from users.model

angular.module('users').service('GetContributors', ['$http',
	function($http) {
		this.contributors = function(){
			return $http.get('/api/v1/contributors');
		};
	}
]);

'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http', 'Authentication',
	function($http, Authentication) {
		console.log('uploader working for profilePic Service');


		//this.getUploadedProfilePic = function() {
		//		var user = Authentication.user;
		//		var configObj = {cache: true, responseType: 'arraybuffer'};
		//		var userProfileImage = '';
    //
		//	$http.get('api/v1/users/' + user._id + '/media/' +  user.profileImageFileName, configObj)
		//		.then(function successCallback(successCallback) {
		//			console.log('profilePic', successCallback);
		//			console.log('profilePic.data', successCallback.data);
		//			console.log('successCallback.data.object.data', successCallback.data.object.data);
		//			return userProfileImage = successCallback.data.object.data;
		//			//return userProfileImage = fileReader.readAsDataURL(imageAsBuffer);
    //
		//			//return userProfileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
		//		}, function errorCallback(errorCallback) {
		//			console.log('profile photo error', errorCallback);
		//			return userProfileImage = 'modules/users/client/img/profile/default.png';
		//		});

    var user = Authentication.user;

    this.getUploadedProfilePic = function() {
      var configObj = {cache: true};

			$http.get('api/v1/users/' + user._id + '/media/uploadedProfileImage/' +  user.profileImageFileName, configObj)
				.then(function successCallback(successCallback) {
					console.log('profilePic', successCallback);
					user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
				}, function errorCallback(errorCallback) {
					console.log('profile photo error', errorCallback);
					user.profileImage = 'modules/users/client/img/profile/default.png';
				});

      //else if(user.profileImageFileName === 'uploaded-profile-image.png') {
       // console.log('uploaded-profile-image.png:\n', user.profileImageFileName);
       // user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.png';
      //}
      //else if (user.profileImageFileName === 'uploaded-profile-image.jpg') {
       // console.log('uploaded-profile-image.jpg:\n', user.profileImageFileName);
       // user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
      //}
			//else if(user.profileImageFileName !== 'default.png' && user.profileImageFileName !== '') {
       // console.log('user.profileImageFileName !== && user.profileImageFileName !== :\n', user.profileImageFileName);
			//	//get request with cache lookup
			//
			//} else {
       // console.log('else:\n', user.profileImageFileName);
			//	//get request with cache lookup
			//	user.profileImage = 'modules/users/client/img/profile/default.png';
			//}
		};


	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('AdminAuthService', ['$window', 'Authentication',
	function($window, Authentication) {

		if(Authentication.user !== '') {

			var isAdmin = {
				user: $window.user.roles[0]
			};
			console.log('isAdmin.user', isAdmin.user);
			return isAdmin;

		} else {

			isAdmin = {
				user: 'notAdmin'
			};
			console.log('!isAdmin.user', isAdmin.user);
			return isAdmin;
		}
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

    'use strict';

angular.module('users').service('SubscribeService', [
    function ($scope, $location, Projects, $stateParams) {


    //search database for e-mail address--if found, update newsletter subscription field; else, create new user

        // Update existing Project
        $scope.update = function () {
            var project = $scope.project;

            project.$update(function () {
                $location.path('projects/' + project._id);
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
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            });
        };

        $scope.completed = function () {
            var formField;
            for (formField in $scope.createProject) {
                if ($scope.createProject === null) {
                    $scope.completed = false;
                    return $scope.completed;
                } else {
                    $scope.completed = true;
                }
            }
        };




        // Create new Project
        $scope.create = function () {

            // Create new Project object
            var project = new Projects({
                created: this.created,
                createdBy: this.createdBy,
                street: this.street,
                city: this.city,
                state: this.state,
                zip: this.zip,
                story: this.story,
                title: this.title
            });

            var saveProject = function () {
                project.$save(function (response) {
                    $location.path('projects/' + response._id);
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
        };


    }
]);

'use strict';

// retrieve user's profile data from users.model

angular.module('users').factory( 'UserData', ['$resource',
	function($resource) {
		return $resource('/api/v1/users/:userId', {userId: '@_id'}, {
			update: {
				method: 'PUT'
			}
		});

	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('/api/v1/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users').factory('User', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/user/:userId', {userId: '@_id'}, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
    } else {
      return $resource('api/v1/users/:userId', {userId: '@_id'}, {
        update: {
          method: 'GET'
        }
      });
    }
  }
]);

angular.module('users').factory('AdminUpdateUser', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/users/:userId', {userId: '@_id'}, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
    } else {
      return 'error - user is not admin'
    }
  }
]);

//TODO this should be Users service
angular.module('users').factory('Newsletter', ['$resource',
  function ($resource) {
      return $resource('api/v1/newsletter', {email: '@email'}, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
  }
]);

/**
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

**/
//'use strict';
//
//angular.module('core.admin').run(['Menus',
//  function (Menus) {
//    Menus.addMenuItem('topbar', {
//      title: 'Admin',
//      state: 'admin',
//      type: 'dropdown',
//      roles: ['admin']
//    });
//  }
//]);

//'use strict';
//
//// Setting up route
//angular.module('core.menu').config(['$stateProvider',
//  function ($stateProvider) {
//    $stateProvider
//      .state('menu', {
//        abstract: true,
//        url: '/menu',
//        template: '<ui-view/>'
//        //data: {
//        //  roles: ['admin']
//        //}
//      })
//    .state('settings', {
//      //url: '/subscribe-form',
//      templateUrl: 'modules/projects/client/directives/views/dropdown-list.html'
//    })
//    .state('uploads', {
//      url: '/uploads',
//      templateUrl: 'modules/core/views/file-upload.client.view.html'
//    })
//    .state('uploadFile', {
//      url: '/uploads/:fileHash'
//      //templateUrl: 'modules/users/views/create-user.client.view.html'
//    });
//  }
//]);

'use strict';

//Setting up route
angular.module('core').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

// Controller that serves a random static map for secondary views
angular.module('core').controller('RandomMapController', ['$scope', 'RandomMapService',
    function($scope, RandomMapService) {

        $scope.staticMap = RandomMapService.getRandomMap();
        $scope.myFunction = function(){
            console.log('error loading that map!');
        };

    }
]);


//'use strict';
//
//angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
//  function ($scope, $state, Authentication, Menus) {
//    // Expose view variables
//    $scope.$state = $state;
//    $scope.authentication = Authentication;
//
//    // Get the topbar menu
//    $scope.menu = Menus.getMenu('topbar');
//
//    // Toggle the menu items
//    $scope.isCollapsed = false;
//    $scope.toggleCollapsibleMenu = function () {
//      $scope.isCollapsed = !$scope.isCollapsed;
//    };
//
//    // Collapsing the menu after navigation
//    $scope.$on('$stateChangeSuccess', function () {
//      $scope.isCollapsed = false;
//    });
//  }
//]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ApiKeys', '$http', 'MarkerDataService', 'mapService', 'AdminAuthService', '$rootScope', '$location', '$sce', 'UtilsService',
  function ($scope, Authentication, ApiKeys, $http, MarkerDataService, mapService, AdminAuthService, $rootScope, $location, $sce, UtilsService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;
    console.log('current user:\n', $scope.authentication.user);

    //for overlay
    $scope.featuredProjects = {};

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    //menu functions
    $scope.trustAsHtml = $sce.trustAsHtml;
    $scope.goToProject = function (id) {
      $location.path('projects/' + id);
    };

    //placeholder for featured projects images
    //todo once admin module is built, create a function that makes photo1 and 2 dynamic rather than hard-coded
    $scope.photo0 = 'chris--bw-2.jpg';
    $scope.photo1 = 'as_thumb_150.jpg';
    $scope.photo2 = 'wli_thumb_150.jpg';
    $scope.photo3 = 'dw_thumb_150.jpg';
    $scope.photo4 = 'as_thumb_bw.png';

    $scope.projectMarker = null;
    $scope.markerData = null;

    /**
     * test for getting and setting cookies
     */

    /**
     *
     * Animation Functionality
     *
     **/


    //var getFeatured = function () {
    //  $http.get('/api/v1/featured', {cache: true})
    //    .then(function (resolved, rejected) {
    //      console.log('resolved:::::::::\n', resolved);
    //    });
    //};
    //getFeatured();

    $scope.overlayActive = true;
    $scope.menuOpen = false;
    //var changeMapFrom = null;
    $scope.shadeMap = false;

    $scope.toggleTest = function(){
      $scope.shadeMap = !$scope.shadeMap;
      console.log('$scope.shadeMap: ', $scope.shadeMap);
    };


    $scope.toggleOverlayFunction = function (source) {
      if ($scope.overlayActive && source === 'overlay') {
        $scope.overlayActive = !$scope.overlayActive;
        $scope.shadeMap = true;
      } else if ($scope.overlayActive && source === 'menu-closed') {
        $scope.overlayActive = false;
        $scope.menuOpen = true;
        $scope.shadeMap = true;
      } else if (!$scope.overlayActive && source === 'menu-closed' && !$scope.menuOpen) {
        $scope.menuOpen = !$scope.menuOpen;
        $scope.shadeMap = false;
      } else if (!$scope.overlayActive && source === 'home') {
        $scope.menuOpen = false;
        $scope.overlayActive = true;
        $scope.shadeMap = false;
      }
    };

    //atrribution toggle
    $scope.attributionFull = false;
    $scope.attributionText = '<div style="padding: 0 5px 0 2px"><a href="http://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> & <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, with map data by <a href="http://openstreetmap.org/copyright">OpenStreetMap©</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a></div>';

    /**
     *
     * Map Functionality
     *
     **/

    $scope.markers = true;
    $scope.filters = true;
    $scope.censusDataTractLayer = true;
    $scope.googlePlacesLayer = false;
    //$scope.toggleProjectDetails = false;
    $scope.sidebarToggle = false;


    //service that returns public front end keys
    ApiKeys.getApiKeys()
      .then(function (resolved, rejected) {
        mapFunction(resolved.data.MAPBOX_KEY, resolved.data.MAPBOX_SECRET);
      });




    /**
     *  call map and add functionality
     */
    var mapFunction = function (mapboxKey, mapboxAccessToken) {
      //creates a Mapbox Map
      L.mapbox.accessToken = mapboxAccessToken;

      //'info' id is part of creating tooltip with absolute position
      var info = document.getElementById('info');

      var map = L.mapbox.map('map', null, {
          infoControl: false, attributionControl: false
        })
        .setView([40.7630772, -111.8689467], 12)
        .addControl(L.mapbox.geocoderControl('mapbox.places', { position: 'topright' }))
        .addControl( L.control.zoom({position: 'topright'}) );
        //.addControl(L.mapbox.Zoom({ position: 'topright' }));

      var grayMap = L.mapbox.tileLayer('poetsrock.b06189bb'),
        mainMap = L.mapbox.tileLayer('poetsrock.la999il2'),
        topoMap = L.mapbox.tileLayer('poetsrock.la97f747'),
        greenMap = L.mapbox.tileLayer('poetsrock.jdgpalp2'),
        landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'),
        comic = L.mapbox.tileLayer('poetsrock.23d30eb5'),
        watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png');

      var layers = {
        'Main Map': mainMap,
        'Topo Map': topoMap,
        'Green Map': greenMap,
        'Landscape': landscape,
        'Comically Yours': comic,
        'Gray Day': grayMap,
        'Watercolor': watercolor
      };

      mainMap.addTo(map);
      L.control.layers(layers).addTo(map);

      //var markers = new L.MarkerClusterGroup();
      //markers.addLayer(new L.Marker(getRandomLatLng(map)));
      //map.addLayer(markers);


      //service that returns project markers
      MarkerDataService.getMarkerData()
        .success(function (markerData) {
          //$scope.getProjectMarkers(markerData);
          $scope.addProjectMarkers(markerData);
        })
        .error(function (data, status) {
          alert('Failed to load project markers. Status: ' + status);
        });

      $scope.markerArray = [];

      //add markers from marker data
      $scope.addProjectMarkers = function (markerData) {
        $scope.markerData = markerData;
        var index = 0;


        //loop through markers array and return values for each property
        for (var prop in markerData) {

          $scope.projectMarker = L.mapbox.featureLayer({
              //var singleMarker = L.mapbox.featureLayer({
              // this feature is in the GeoJSON format: see geojson.org for full specs
              type: 'Feature',
              geometry: {
                type: 'Point',
                // coordinates here are in longitude, latitude order because
                // x, y is the standard for GeoJSON and many formats
                coordinates: [markerData[prop].lng, markerData[prop].lat]
              },
              properties: {
                // one can customize markers by adding simplestyle properties
                // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                'marker-size': 'large',
                'marker-color': mapService.markerColorFn(markerData, prop),
                //'marker-color': '#00ff00',
                'marker-symbol': 'heart',
                projectId: markerData[prop]._id,
                summary: markerData[prop].storySummary,
                title: markerData[prop].title,
                mainImage: markerData[prop].mainImage,
                category: markerData[prop].category,
                mapImage: markerData[prop].mapImage,
                lat: markerData[prop].lat,
                lng: markerData[prop].lng,
                published: markerData[prop].created,
                leafletId: null,
                arrayIndexId: index
              }
            })
            //create toogle for marker event that toggles sidebar on marker click
            .on('click', function (e) {
              $scope.$apply(function () {
                $scope.storyEvent = e.target._geojson.properties;
              });
              map.panTo(e.layer.getLatLng()); //	center the map when a project marker is clicked
              popupMenuToggle(e);
              return $scope.projectMarker[prop];
            });

          $scope.projectMarker.addTo(map);
          $scope.markerArray.push($scope.projectMarker);
          index++;
        }
        return $scope.markerArray;
      };

      //style the polygon tracts
      var style = {
        'stroke': true,
        'clickable': true,
        'color': "#00D",
        'fillColor': "#00D",
        'weight': 1.0,
        'opacity': 0.2,
        'fillOpacity': 0.0,
        'className': ''  //String that sets custom class name on an element
      };
      var hoverStyle = {
        'color': "#00D",
        "fillOpacity": 0.5,
        'weight': 1.0,
        'opacity': 0.2,
        'className': ''  //String that sets custom class name on an element
      };

      var hoverOffset = new L.Point(30, -16);


      //create toggle/filter functionality for Census Tract Data
      $scope.toggleGooglePlacesData = function () {
        if ($scope.googlePlacesLayer) {
          map.removeLayer(googlePlacesMarkerLayer);
        } else {
          map.addLayer(googlePlacesMarkerLayer);
        }
      };

      map.on('click', function (e) {
        console.log('click event', e);
        if ($scope.menuOpen) {
          $scope.sidebar.close();
          $scope.shadeMap = false;
        } else {
          console.log('map click!');
          $scope.overlayActive = false;
        }
      });

      $scope.getProjectMarkers = function (markerData) {
      };
    };

    var popupIndex = 0;
    var popupMenuToggle = function (e) {
      if (!$scope.menuOpen && popupIndex !== e.target._leaflet_id) {
        $scope.toggleOverlayFunction('menu-closed');
        //$scope.populateStorySummary($scope.projectDetails);
        $scope.sidebar.open('details');
        popupIndex = e.target._leaflet_id;
      } else if (!$scope.menuOpen && popupIndex === e.target._leaflet_id) {
        //$scope.populateStorySummary($scope.projectDetails);
      } else if ($scope.menuOpen && popupIndex !== e.target._leaflet_id) {
        //$scope.populateStorySummary($scope.projectDetails);
        $scope.sidebar.open('details');
        popupIndex = e.target._leaflet_id;
      } else if ($scope.menuOpen && popupIndex === e.target._leaflet_id) {
        $scope.sidebar.close();
        popupIndex = 0;
      }
    };
  }
]);

'use strict';

angular.module('core').controller('ModalController', ['$scope', '$uibModalInstance', 'items',
    function($scope, $uibModalInstance, items) {
        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0],
          toStateUrl: items.toStateUrl
        };
      console.log('$scope.selected', $scope.selected);


      if ($scope.selected.item) {
        console.log('$scope.selected.item', $scope.selected.item);
        $scope.ok = function () {
          $uibModalInstance.close($scope.selected.item);
        };
      } else {
        console.log('$scope.selected.toStateName', $scope.selected.toStateUrl);
        $scope.ok = function () {
          $uibModalInstance.close($scope.selected.toStateUrl);
        };
      }

      $scope.cancel = function () {
          $uibModalInstance.dismiss('user cancelled modal');
      };
    }
]);

'use strict';

angular.module('core').directive('featuredProjects', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/core/client/directives/views/featured-projects.html'

//            controller: function() {
//              document.getElementById('photo-3').onload = function() {
//              var c=document.getElementById('inverse-photo-3');
//              var ctx=c.getContext('2d');
//              var img=document.getElementById('photo-3');
//              ctx.drawImage(img,0,0);
//              var imgData=ctx.getImageData(0,0,c.width,c.height);
//// invert colors
//              for (var i=0;i<imgData.data.length;i+=4)
//              {
//                imgData.data[i]=255-imgData.data[i];
//                imgData.data[i+1]=255-imgData.data[i+1];
//                imgData.data[i+2]=255-imgData.data[i+2];
//                imgData.data[i+3]=255;
//              }
//              ctx.putImageData(imgData,0,0);
//
//                //<canvas id="inverse-photo-3" width="220" height="277" style="border:1px solid #d3d3d3;" class="desaturate">
//                //  Your browser does not support the HTML5 canvas tag.</canvas>
//
//            }
//          }


        };
    });

'use strict';

angular.module('core').directive('footerDirective', ["UtilsService", function (UtilsService) {
  return {
    restrict: 'AE',
    //replace: true,
    priority: 0,
    templateUrl: '/modules/core/client/directives/views/footer-directive.html',
    controller: ["$scope", "$http", function ($scope, $http) {
      //provides logic for the css in the forms
      UtilsService.cssLayout();

      //$scope.create = function (isValid) {
      //  $http({
      //    method: 'POST',
      //    url: '/api/v1/auth/signup/newsletter',
      //    data: {
      //      email: $scope.email
      //    }
      //  }).success(function (data) {
      //      console.log(data);
      //      if (data) {
      //        console.log('YO the DATA', data);
      //      }
      //    })
      //    .error(function (err) {
      //      console.log(err);
      //      if (err) {
      //        $scope.error_message = "Please try again!";
      //      }
      //    });
      //
      //  $scope.email = '';
      //}
    }]
  };
}]);

'use strict';

angular.module('core').directive('randomMapDirective', [
    function ($scope) {

        var staticMap = null;

        var maps = {
            'originalMap': 'poetsrock.55znsh8b',
            'grayMap': 'poetsrock.b06189bb',
            'mainMap': 'poetsrock.la999il2',
            'topoMap': 'poetsrock.la97f747',
            'greenMap': 'poetsrock.jdgpalp2',
            'funkyMap': 'poetsrock.23d30eb5'
        };

        /**
         lng: -111.784-999 , -112.0-060,
         lat: 40.845-674
         **/

        //array of
        var randomMap = [maps.originalMap, maps.grayMap, maps.mainMap, maps.topoMap, maps.greenMap, maps.funkyMap];

        var getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        var randomLat = function () {
            var randomLngInt = Math.floor(getRandomArbitrary(111, 113));
            if (randomLngInt === 111) {
                return '-111.' + Math.floor(getRandomArbitrary(7840, 9999));
            } else {
                var randomDecimal = Math.floor(getRandomArbitrary(100, 600));
                return '-112.0' + randomDecimal;
            }
        };

        var randomLng = function () {
            return '40.' + Math.floor(getRandomArbitrary(0, 9999));
        };

        var randomMapId = function () {
            return Math.floor(getRandomArbitrary(0, 7));
        };

        var randomZoom = function () {
            return Math.floor(getRandomArbitrary(10, 18));
        };

        return {
            template: '<div></div>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //staticMap = 'http://api.tiles.mapbox.com/v4/' + randomMap[randomMapId()] + '/' + randomLat() + ',' + randomLng() + ',' + randomZoom() + '/' + '1280x720.png32?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw';
            }

        };

    }
]);

'use strict';

angular.module('core').directive('mainMenu', ["AdminAuthService", function(AdminAuthService) {
    return {
      restrict: 'EA',
      templateUrl: '/modules/core/client/directives/views/main-menu.html',

      controller: ["$scope", function($scope) {
        $scope.isAdmin = AdminAuthService.user;


        $scope.sidebar = L.control.sidebar('sidebar', {
          closeButton: true,
          position: 'left'
        }).addTo(map);

        $scope.sidebar.click = function() {
          if (L.DomUtil.hasClass(this, 'active')) {
            $scope.sidebar.close();
            console.log('here i am close');
          }
          else {
            $scope.sidebar.open(this.firstChild.hash.slice(1));
            console.log('here i am open');
          }
        };


        $scope.sidebar.on('click', function (e) {
          console.log('sidebar click event', e);
        });


          //if (child.firstChild.hash == '#' + id)
          //  L.DomUtil.addClass(child, 'active');
          //else if (L.DomUtil.hasClass(child, 'active'))
          //  L.DomUtil.removeClass(child, 'active');

          //
          //if (L.DomUtil.hasClass(this, 'active')) {
          //  $scope.sidebar.close();
          //  console.log('here i am close');
          //}
          //else {
          //  $scope.sidebar.open(this.firstChild.hash.slice(1));
          //  console.log('here i am open');
          //}


      }],

      link: function($scope) {
        //$scope.sidebar = L.control.sidebar('sidebar', {
        //  closeButton: true,
        //  position: 'left'
        //}).addTo(map);


      }

    };
}]);



//// add Admin link in menu if user is admin
//if ($scope.authentication.user.roles[0] === 'admin' || $scope.authentication.user.roles[0] === 'superAdmin')

'use strict';

angular.module('core').directive('mainPageOverlay', function() {
    return {
        restrict: 'AE',
        priority: 10,
        templateUrl:'/modules/core/client/directives/views/main-page-overlay.html'
    };
});

'use strict';

angular.module('core').directive('modalDirective', function() {
        return {
            restrict: 'E',
            link: function() {

            $uibModal.open({
              animation: true,
              //templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
              templateUrl: template,
              controller: ["$scope", "$modalInstance", "$location", function ($scope, $modalInstance, $location) {
                $scope.stay = function (result) {
                  //$modalInstance.dismiss('cancel');
                  console.log('stay just a little bit longer, oh won\'t you stay');
                  $modalInstance.close(function (result) {
                    console.log('result: ', result);
                  });
                };
                $scope.leave = function () {
                  var preventRunning = true;
                  $scope.stay();
                  $location.path(toState);
                };
              }],
              size: 'lg'
            });


          }
        };
    });

'use strict';

angular.module('core').directive('secondaryMenuDirective', function() {

    return {

        restrict: 'E',
        templateUrl: '/modules/core/client/directives/views/secondary-menu-directive.html',

        controller: ["AdminAuthService", "$scope", function(AdminAuthService, $scope){
              $scope.isAdmin = AdminAuthService;
        }],

        link: function(scope) {

            scope.secondMenuOpened = false;
            scope.toggleSecondMenu = false;

        }
    }
});

'use strict';

angular.module('core').directive('secondaryPageDirective', function() {
    return {
        restrict: 'AE',
        //replace: true,
        priority: 0,
        templateUrl:'/modules/core/client/directives/views/secondary-page.html'
    };
});

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

'use strict';

angular.module('core').directive('signInDirective', function() {
        return {
          restrict: 'EA',
          templateUrl: '/modules/core/client/directives/views/sign-in-directive.html',
          controller: ["$scope", "$http", "Authentication", function($scope, $http, Authentication) {
            var userProfileImage = '';
            $scope.user = Authentication.user;

            if ($scope.user === '') {
              console.log('directive profilePic Service - calling nothing, just `return`');
              return
            } else if(Authentication.user.profileImageFileName === 'default.png' || Authentication.user.profileImageFileName === '') {
              $scope.user.profileImage = 'modules/users/client/img/profile/default.png';
            } else if (Authentication.user.profileImageFileName !== '' ) {
              $scope.user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
            }


            /**
             *
             * turning the s3 get image function off for now ...
             * it returns data... just don't know how to parse what i'm getting back
             * uncomment and load home page and look in console log to see a few options for how i'm
             *    trying to parse.
             */
            /**
            else {

              $scope.getUploadedProfilePic = function() {
                var user = Authentication.user;
                //var configObj = {cache: true, responseType: 'arraybuffer'};
                var configObj = {cache: true};


                $http.get('api/v1/users/' + user._id + '/media/' + user.profileImageFileName, configObj)
                  .then(function successCallback(successCallback) {
                    console.log('profilePic - successCallback\n', successCallback);
                    console.log('successCallback.data.imageAsBase64Array\n', successCallback.data.imageAsBase64Array);
                    console.log('successCallback.data.imageAsUtf8\n', successCallback.data.imageAsUtf8);
                    console.log('successCallback.data.imageObjectAsString\n', successCallback.data.imageObjectAsString);
                    return userProfileImage = successCallback.data.imageAsBase64Array;
                  }, function errorCallback(errorCallback) {
                    console.log('profile photo error', errorCallback);
                    return userProfileImage = 'modules/users/client/img/profile/default.png';
                  });

              };
              $scope.getUploadedProfilePic();
              $scope.user.profileImage = userProfileImage;


            }
             **/

          }]
        };

    });

/**
* Created by poetsrock on 3/11/15.
*/

'use strict';

angular.module('core').directive('submitProjectDirective', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/core/client/directives/views/submit-project-directive.html'
        };
    });

'use strict';

angular.module('core').service('ApiKeys', ['$http',
	function($http) {
		// ApiKeys service logic
		// ...
        this.getApiKeys = function(){
            return  $http.get('/api/v1/keys');
        };
        this.getTractData = function(){
            return  $http.get('api/v1/tractData');
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('core').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

angular.module('core').service('CensusDataService', ['$http', 'ApiKeys',
    function ($http, ApiKeys) {

        //Census Data for Population Stats service logic

        var censusDataKey = 'P0010001';
        var censusYear = [2000, 2010, 2011, 2012, 2013, 2014];
        var population = '';

        this.callCensusApi = function () {
            ApiKeys.getApiKeys()
                .success(function (keys) {
                    censusData(keys.CENSUS_KEY);
                })
                .error(function (data, status) {
                    alert('Failed to load Mapbox API key. Status: ' + status);
                });

            censusData = function (censusKey){
                return $http.get('http://api.census.gov/data/' + censusYear[1] + '/sf1?get=' + population + '&for=tract:*&in=state:49+county:035&key=' + censusKey);
            }
        };
    }
]);


//'use strict';
//
//angular.module('core').factory('ErrorHandleService', ['$httpProvider',
//    function($httpProvider){
//    $httpProvider.interceptors.push(['$q',
//        function ($q) {
//            return {
//                responseError: function (rejection) {
//                    console.log(rejection);
//                    switch (rejection.status) {
//                        case 400:
//                            return '400';
//                        case 404:
//                            return '404';
//                    }
//
//                    return $q.reject(rejection);
//                },
//                'response': function(response){
//                    console.log(response);
//                    return response;
//                }
//            };
//        }
//    ])
//}
//]);
'use strict';

angular.module('core').service('FullScreenService', [,
    function() {

        this.fullScreen= function(){

            /**
             * Full-screen functionality
             */
            // Find the right method, call on correct element
            var launchFullscreen = function(element) {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            };

            // Launch fullscreen for browsers that support it
            //launchFullscreen(document.documentElement); // the whole page
            //launchFullscreen(document.getElementById("videoElement")); // any individual element

            // Whack fullscreen
            var exitFullscreen = function(element) {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            };

// Cancel fullscreen for browsers that support it!
//    exitFullscreen();


        };
    }
]);

'use strict';

angular.module('core').service('RandomMapService', [
    function () {
        
        var staticMap = null;
        
        var maps = {
            'mapbox': {
                'originalMap': 'poetsrock.j5o1g9on',
                'grayMap': 'poetsrock.b06189bb',
                'mainMap': 'poetsrock.la999il2',
                'topoMap': 'poetsrock.la97f747',
                'greenMap': 'poetsrock.jdgpalp2',
                'comic': 'poetsrock.23d30eb5',
                'fancyYouMap': 'poetsrock.m6b73kk7',
                'pencilMeInMap': 'poetsrock.m6b7f6mj'
            //},
            //'thunderforest': {
            //    'landscape': 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'
            //},
            //'stamen': {
            //    'watercolor': 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
            //    'toner': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
            }
        };
        
        var url = {
            'mapbox': 'http://api.tiles.mapbox.com/v4',
            //'thunderforest': 'http://{s}.tile.thunderforest.com',
            //'stamen': 'http://maps.stamen.com/m2i',
            //'ngs': ''
        };
        
        //array of
        var randomMap = [
            ['mapbox', maps.mapbox.originalMap],
            ['mapbox', maps.mapbox.grayMap],
            ['mapbox', maps.mapbox.mainMap],
            ['mapbox', maps.mapbox.topoMap],
            ['mapbox', maps.mapbox.greenMap],
            ['mapbox', maps.mapbox.comic],
            ['mapbox', maps.mapbox.fancyYouMap],
            ['mapbox', maps.mapbox.pencilMeInMap],
            //['stamen', maps.stamen.watercolor],
            //['stamen', maps.stamen.toner],
            //['thunderforest', maps.thunderforest.landscape]
        ];
        
        var getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        
        var randomLat = function () {
            var randomLngInt = Math.floor(getRandomArbitrary(111, 113));
            if (randomLngInt === 111) {
                return '-111.' + Math.floor(getRandomArbitrary(7840, 9999));
            } else {
                var randomDecimal = Math.floor(getRandomArbitrary(100, 600));
                return '-112.0' + randomDecimal;
            }
        };
        
        var randomLng = function () {
            return '40.' + Math.floor(getRandomArbitrary(0, 9999));
        };

        var randomZoom = function () {
            return Math.floor(getRandomArbitrary(9, 16));
        };
        
        this.getRandomMap = function () {
            var randomNum = Math.floor(getRandomArbitrary(0, 7));
            var mapVendor = randomMap[randomNum][0];
            var randomMapId = randomMap[randomNum][1];

            if (mapVendor === 'mapbox') {
                return staticMap = {mapUrl: url.mapbox + '/' + randomMapId + '/' + randomLat() + ',' + randomLng() + ',' + randomZoom() + '/' + '1280x720.png32?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw'};
            //} else if (mapVendor === 'stamen') {
                //return staticMap = {mapUrl: url.stamen + '/#watercolor' + '1280:720/' + randomZoom() + '/' + randomLat() + '/' + randomLng()};
                //return staticMap = {mapUrl: 'http://maps.stamen.com/m2i/#watercolor/1280:720/14/40.8905/-112.0204'};
            } else {
                console.log('Error!\nrandomNum: ', randomNum, '\nmapVendor', mapVendor, '\nrandomMapId: ', randomMapId );
            }
        }
        
    }
]);

'use strict';

//Google Places API

angular.module('core').factory('googlePlacesService', ['$http',
	function ($http) {
		var googlePlacesMarker = null;
		var googlePlacesMarkerLayer = null;
		var googlePlacesMarkerArray = [];

		var googlePlacesData = function () {
			$http.get('/places').success(function (poiData) {

				var placeLength = poiData.results.length;
				for (var place = 0; place < placeLength; place++) {

					var mapLat = poiData.results[place].geometry.location.lat;
					var mapLng = poiData.results[place].geometry.location.lng;
					var mapTitle = poiData.results[place].name;

					googlePlacesMarker = L.marker([mapLat, mapLng]).toGeoJSON();

					googlePlacesMarkerArray.push(googlePlacesMarker);
				} //end of FOR loop

				googlePlacesMarkerLayer = L.geoJson(googlePlacesMarkerArray, {
					style: function (feature) {
						return {
							'title': mapTitle,
							'marker-size': 'large',
							//'marker-symbol': mapSymbol(),
							'marker-symbol': 'marker',
							'marker-color': '#00295A',
							'riseOnHover': true,
							'riseOffset': 250,
							'opacity': 0.5,
							'clickable': true
						}
					}
				})
			});
		};


	}
]);
'use strict';

angular.module('core').service('mapService', [
	function ($scope) {
		// Various Services for Map Functionality

		this.featuredProjects = function (markerData) {
			var featureProjectsArray = [];
			for (var prop in markerData) {
				var i = 0;
				if (i < 2 && markerData[prop].featured) {      //setup for loop to end after finding the first three featured projects
					var featuredProject = {
						thumb: markerData[prop].thumbnail,
						projectId: markerData[prop]._id,
						shortTitle: markerData[prop].shortTitle
					};
					featureProjectsArray.push(featuredProject);
				}
				i++;
			}
		};

		this.markerColorFn = function (markerData, prop) {
			if (markerData[prop].category === 'video') {
				return '#ff0011';
			} else if (markerData[prop].category === 'multimedia') {
				return '#ff0101';
			} else if (markerData[prop].category === 'essay') {
				return '#0015ff';
			} else if (markerData[prop].category === 'literature') {
				return '#15ff35';
			} else if (markerData[prop].category === 'interview') {
				return 'brown';
			} else if (markerData[prop].category === 'map') {
				return 'yellow';
			} else if (markerData[prop].category === 'audio') {
				return '#111111';
			} else {
				return '#00ff44';
			}
		};
	}
]);
'use strict';

angular.module('core').service('MarkerDataService', ['$http',
    function($http) {
        // Project Marker Data Service

        this.getMarkerData = function(){
            return  $http.get('/api/v1/markerData').
                success(function(projects){
                    //console.log('projects: \n', projects);
                    //for (var prop in projects) {
                    //    console.log('projects[prop].lng: \n', projects[prop].lng);
                    //}

                })
                .error(function(error){
                    console.log('marker data error: \n', error);
                });
        };
    }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

//Google Places API

angular.module('core').factory('tractDataService', ['$scope', 'ApiKeys',
	function ($scope, ApiKeys) {

		var dataBoxStaticPopup = null,
			tractData = {},
			censusTractData = null;


		ApiKeys.getTractData()
			.success(function (tractData) {
				tractDataLayer(tractData);
			})
			.error(function (tractData) {
				alert('Failed to load tractData. Status: ' + status);
			});
		var tractDataLayer = function (tractData) {
			censusTractData = L.geoJson(tractData, {
					style: style,
					onEachFeature: function (feature, layer) {
						if (feature.properties) {
							var popupString = '<div class="popup">';
							for (var k in feature.properties) {
								var v = feature.properties[k];
								popupString += k + ': ' + v + '<br />';
							}
							popupString += '</div>';
							layer.bindPopup(popupString);
						}
						if (!(layer instanceof L.Point)) {
							layer.on('mouseover', function () {
								layer.setStyle(hoverStyle);
								//layer.setStyle(hoverOffset);
							});
							layer.on('mouseout', function () {
								layer.setStyle(style);
								//layer.setStyle(hoverOffset);
							});
						}

					}
				}
			);
		};

		$scope.dataBoxStaticPopupFn = function (dataBoxStaticPopup) {

			// Listen for individual marker clicks.
			dataBoxStaticPopup.on('mouseover', function (e) {
				// Force the popup closed.
				e.layer.closePopup();

				var feature = e.layer.feature;
				var content = '<div><strong>' + feature.properties.title + '</strong>' +
					'<p>' + feature.properties.description + '</p></div>';

				info.innerHTML = content;
			});

			function empty() {
				info.innerHTML = '<div><strong>Click a marker</strong></div>';
			}

			// Clear the tooltip when .map is clicked.
			map.on('move', empty);

			// Trigger empty contents when the script has loaded on the page.
			empty();

		};

//create toggle/filter functionality for Census Tract Data
		$scope.toggleCensusData = function () {
			if (!$scope.censusDataTractLayer) {
				map.removeLayer(censusTractData);
				map.removeLayer(dataBoxStaticPopup);
			} else {
				map.addLayer(censusTractData);
				map.addLayer(dataBoxStaticPopup);

			}
		};

	}
]);
'use strict';

// Underscore service
angular.module('core').factory('_', [
	function() {
		return window._;
	}
]);
'use strict';

angular.module('core').service('UtilsService', ['$http', '$window',
  function($http, $window) {


    //logic for css on the contact form

    this.cssLayout = function () {
      [].slice.call(document.querySelectorAll('input.input_field'))

        .forEach(function (inputEl) {
          // in case the input is already filled
          if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input-filled');
          }
          // events
          inputEl.addEventListener('focus', onInputFocus);
          inputEl.addEventListener('blur', onInputBlur);
        });

      function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input-filled');
      }

      function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
          classie.remove(ev.target.parentNode, 'input-filled');
        }
      }
    };


  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'AdminUpdateUser',
  function ($scope, $filter, AdminUpdateUser) {
    AdminUpdateUser.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

//'use strict';
//
//angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
//  function ($scope, $state, Authentication, userResolve) {
//    $scope.authentication = Authentication;
//    //$scope.user = userResolve;
//
//    $scope.remove = function (user) {
//      if (confirm('Are you sure you want to delete this user?')) {
//        if (user) {
//          user.$remove();
//
//          $scope.users.splice($scope.users.indexOf(user), 1);
//        } else {
//          $scope.user.$remove(function () {
//            $state.go('admin.users');
//          });
//        }
//      }
//    };
//
//    $scope.update = function (isValid) {
//      if (!isValid) {
//        $scope.$broadcast('show-errors-check-validity', 'userForm');
//
//        return false;
//      }
//
//      var user = $scope.user;
//
//      user.$update(function () {
//        $state.go('admin.user', {
//          userId: user._id
//        });
//      }, function (errorResponse) {
//        $scope.error = errorResponse.data.message;
//      });
//    };
//  }
//]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/v1/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http', 'ProfileImageService',
  function ($scope, $timeout, $window, Authentication, Upload, $http, ProfileImageService) {

    $scope.init = function () {
      ProfileImageService.getUploadedProfilePic();
    };

    //// Create a new cache with a capacity of 10
    //var lruCache = $cacheFactory('lruCache', { capacity: 10 });

    $scope.user = Authentication.user;
    $scope.uploading = false;
    var upload = null;

    /**
     *
     * @param requestType {string} - the requestType specifies what type of files are being uploaded...
     *    for example, 'profile-image' is passed in when the content is for a user's profile image.
     * @param files {object} a Blob that contains the file(s) to upload
     */
      //$scope.onFileSelect = function (files, requestType) {
    $scope.onFileSelect = function (files) {
      //if (files.length > 0) {
      $scope.uploading = true;

      console.log('files:\n', files[0]);
      console.log('files:\n', files[0].File);

      var fileType = files[0].type;
      if (fileType === 'image/jpeg') {
        fileType = '.jpg'
      } else if (fileType === 'image/png') {
        fileType = '.png'
      }
      var fileName = '';
      //hard coded for now ... later will refactor to take multiple use cases
      var requestType = 'profile-image';

      if (requestType === 'profile-image') {
        fileName = {
          origFileName: files[0].name.replace(/\s/g, '_'), //substitute all whitespace with underscores
          fileName: 'uploaded-profile-image' + fileType
        };
      }

      var query = {
        user: $scope.user,
        fileName: fileName.fileName,
        origFileName: fileName.origFileName,
        type: files[0].type
      };

      console.log('fileType:\n', fileType);
      console.log('query:\n', query);

      $http.post('api/v1/s3/upload/media/photo', query)
        .then(function (result) {

          console.log('result:\n', result);
          console.log('result.data:\n', result.data);
          console.log('result.status:\n', result.status);
          console.log('result.config:\n', result.config);

          /**
           Specify the file and optional data to be sent to the server.
           Each field including nested objects will be sent as a form data multipart.
           Samples:

           {pic: file, username: username}
           {files: files, otherInfo: {id: id, person: person,...}} multiple files (html5)
           {profiles: {[{pic: file1, username: username1}, {pic: file2, username: username2}]} nested array multiple files (html5)
           {file: file, info: Upload.json({id: id, name: name, ...})} send fields as json string
           {file: file, info: Upload.jsonBlob({id: id, name: name, ...})} send fields as json blob
           {picFile: Upload.rename(file, 'profile.jpg'), title: title} send file with picFile key and profile.jpg file name
         **/


            //upload to back end
          upload = Upload.upload({
              url: result.config.url, //s3Url
              //transformRequest: function (data, headersGetter) {
              //  var headers = headersGetter();
              //  delete headers.Authorization;
              //  console.log('data v1\n', data);
              //  return data;
              //},
              //info: Upload.jsonBlob({id: id, name: name}),
              file: files[0],
              //data: {
              //  file: files,
              //  picFile: Upload.rename(files, 'uploaded-profile-image.jpg')
              //},
              //fields: result.fields, //credentials
              method: 'POST'
            })
            .then(function (resp) {
              // file is uploaded successfully
              console.log('resp:\n', resp);
              var s3Result = xmlToJSON.parseString(resp.data);   // parse
              console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + s3Result);
              console.log('status: ', resp.status);
              $scope.uploading = false;
              ProfileImageService.getUploadedProfilePic();
            }, function (resp) {
              // handle error
            }, function (evt) {
              //var s3Result = xmlToJSON.parseString(resp.data);
              console.log('evt:\n', evt);
              // progress notify
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.data.file.name);
            });
          //upload.catch(errorCallback);
          //upload.finally(callback, notifyCallback);


          //  .progress(function (evt) {
          //    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          //  })
          //  .success(function (data, status, headers, config) {
          //    var s3Result = xmlToJSON.parseString(data);   // parse
          //    console.log('status: ', status);
          //    console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);
          //    $scope.uploading = false;
          //    ProfileImageService.getUploadedProfilePic();
          //  })
          //  .error(function () {
          //
          //  });
          //})
          //.error(function (data, status, headers, config) {
          //  // called asynchronously if an error occurs
          //  // or server returns response with an error status.
          //  $scope.uploading = false;
          //});
        });
      //.catch(err)
      //.finally(callback, notifyCallback);
    };
    //};


    /* cancel/abort the upload in progress. */
    $scope.abort = function () {
      console.log('abort!!!');
      upload.abort();
      $scope.uploading = false;
    };



    $scope.getProfilePic = function() {

    };


  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'UserData', '$stateParams', 'Authentication', 'AdminAuthService', 'UtilsService',
  function ($scope, $http, $location, Users, UserData, $stateParams, Authentication, AdminAuthService, UtilsService) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;

    console.log('\n\n$scope.user:\n', $scope.user, '\n\n');

    // Provides logic for the css in the forms
    UtilsService.cssLayout();


    // user fn to update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


    // admin fn to update existing User
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userAdminForm');
        return false;
      }

      var userToEdit = $scope.userToEdit;

      userToEdit.$update(function () {
        $location.path('users/' + user._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    $scope.toggleEdit = false;
    $scope.toggleId = 0;

    $scope.toggleEditFn = function(editNum) {
      $scope.toggleEdit = !$scope.toggle;
      $scope.toggleId = editNum;
    };

    //runs a query to return user ID for admin panel editing
    $scope.find = function () {
      $scope.users = Users.query();
    };

    // Find a list of Users
    $scope.find = function() {
      $scope.users = Users.query($scope.query);
    };

    // Find existing User
    $scope.findOne = function() {
      $scope.userToEdit = UserData.get({
        userId: $stateParams.userId
      });
    };


  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/v1/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

(function () {
	'use strict';

	angular
		.module('core')
		.run(templates);

	templates.$inject = ['$templateCache'];

	function templates($templateCache) {
		$templateCache.put('modules/admins/views/admins.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"find()\" class=\"main-content-inner\">\n                <div class=\"admin\">\n\n                    <div class=\"page-header\">\n                        <h1>Admin Panel</h1>\n                    </div>\n\n\n                    <div class=\"row\">\n                        <div class=\"col-md-4\">\n                            <a href=\"/admin/list-users\" class=\"widget-box\">\n                                <i class=\"fa fa-users\"></i><br/>\n                                <span>User Menu</span>\n                            </a>\n                        </div>\n                        <div class=\"col-md-4\">\n                            <a href=\"/admin/projects-queue\" class=\"widget-box\">\n                                <i class=\"fa fa-th\"></i><br/>\n                                <span>Projects</span>\n                            </a>\n                        </div>\n                        <div class=\"col-md-4\">\n                            <a href=\"/admin/messages\" class=\"widget-box\">\n                                <i class=\"fa fa-envelope\"></i><br/>\n                                <span>Messages</span>\n                            </a>\n                        </div>\n                    </div>\n\n                </div>\n\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/contacts/views/about-mapping-slc.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n      <section data-ng-controller=\"ContactsController\" class=\"main-content-inner\">\n        <div class=\"about\">\n\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <div class=\"contact home\">\n\n                <h1>About Mapping Salt Lake City</h1>\n                <!--<div>-->\n                <!--<img src=\"{{staticMap.mapUrl}}\">-->\n                <!--</div>-->\n\n                <!--<p>-->\n                <!--{{toggleSecondMenu}}-->\n                <!--</p>-->\n\n                <p>Because a city and its history are not static but a complex network of connections,\n                  environment and relationships, the purpose of Mapping Salt Lake City is to create a\n                  continually evolving narrative in which community members and scholars, writers and\n                  artists can be in dialogue. And because there are always absences in any record of\n                  place, we rely on readers to fill in these gaps by writing and submitting their own\n                  content. Over the years, as more people add their own stories, Mapping Salt Lake\n                  City will change, expand and grow in the same ways that a city might, to become a more\n                  inclusive reflection of our community\'s diverse, and diverging, perspectives.</p>\n\n                <p>highlight some of the content categories??</p>\n\n                <p>Mapping Salt Lake City is an independent, not-for-profit community project based on <a\n                  href=\"http://rebeccasolnit.net/atlases/\" target=\"_blank\">Rebecca Solnit\'s book <em>Infinite City</em></a>,\n                  which maps many of the communities and histories\n                  that make up San Francisco. Initially the focus of a 2013 nonfiction writing course at\n                  the University of Utah taught by Paisley Rekdal, Mapping Salt Lake City has quickly\n                  become a city-wide collaboration led by professors, writers and scholars from the University\n                  of Utah and Westminster College.</p>\n\n                <p>Interested participants can <a\n                  href=\"index.php?option=com_k2&amp;view=item&amp;layout=item&amp;id=4&amp;Itemid=279\">contribute</a>\n                  in a number of ways: by writing a critical, historical or personal essay or by\n                  producing\n                  a multi-media project about a subject relevant to Salt Lake; by creating a personal\n                  city\n                  map using mapping technologies such as Google Maps or Google Earth; by drawing their\n                  own\n                  Salt Lake City <a\n                    href=\"index.php?option=com_k2&amp;view=item&amp;layout=item&amp;id=5&amp;Itemid=280\">using\n                    the map found on our site</a>; or by writing for our ongoing project, \"This Was\n                  Here.\"</p>\n\n                <p>Our hope is for Mapping Salt Lake City to become an integral site for the community\n                  to\n                  visit, a place for people to enter the complex conversation about place that has\n                  already\n                  begun, and that continues to evolve, around Salt Lake City.</p>\n\n                <p>We welcome you to join our community, either by assisting in the development of the\n                  site,\n                  or by submitting work to the project.</p>\n\n              </div>\n            </div>\n          </div>\n\n          <div class=\"links\">\n            <div class=\"row\">\n\n              <div class=\"col-md-4\">\n                <a href=\"/about-us\">\n                  <div class=\"tiles\">\n                  <div class=\"row\">\n                  <div><img src=\"#\"></div>\n                    <p>About Us</p>\n                  </div>\n                  </div>\n                </a>\n              </div>\n\n              <div class=\"col-md-4\">\n                <a href=\"#\">\n                  <div class=\"tiles\">\n                  <div class=\"row\">\n                  <div><img src=\"#\"></div>\n                    <p>Get Involved</p>\n                  </div>\n                  </div>\n                </a>\n              </div>\n\n              <div class=\"col-md-4\">\n                <a href=\"#\">\n                  <div class=\"tiles\">\n                    <div class=\"row\">\n                    <div><img src=\"#\"></div>\n                    <p>Support the Project</p>\n                    </div>\n                  </div>\n                </a>\n              </div>\n\n            </div>\n          </div>\n\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/contacts/views/about-us.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n      <section data-ng-controller=\"ContactsController\" class=\"main-content-inner\">\n        <div class=\"about\">\n\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <div class=\"contact home\">\n\n                <h1>About Mapping Salt Lake City</h1>\n\n                <p>Mapping Salt Lake City is an independent, non-profit organization made possible by grants from the <a\n                  href=\"http://www.utah.edu/\"\n                  target=\"_blank\">University\n                  of Utah</a>, <a href=\"http://www.westminstercollege.edu/\" target=\"_blank\">Westminster\n                  College</a>, the Richard Segal Foundation, and from the <a\n                  href=\"http://www.utahhumanities.org/\" target=\"_blank\">Utah Humanities\n                  Council</a>,\n                  which empowers organizations like ours to improve our community through active\n                  engagement in the humanities.</p>\n\n                <p>Mapping Salt Lake City also occasionally provides teaching resources and exercises\n                  involving creative mapping projects for educators in the Salt Lake City region. For\n                  current examples, see our <a\n                    href=\"index.php?option=com_k2&amp;view=item&amp;layout=item&amp;id=5&amp;Itemid=280\">Resources</a>\n                  page. We are also interested in meeting with small groups and classes to lead\n                  creative\n                  mapping workshops. For more info, <a\n                    href=\"index.php?option=com_k2&amp;view=item&amp;layout=item&amp;id=6&amp;Itemid=281\">please\n                    contact us</a>.</p>\n\n                <p>As Mapping Salt Lake City is an arts and educational resource, the photos and images\n                  on\n                  this site are to be used solely for that purpose. Copyright for photo use must be\n                  obtained from the relevant institutions.</p>\n\n                <div>\n                  <h3>The Mapping SLC Crew</h3>\n                  <a href=\"#\">Paisley Rekdal</a> is the creator and Editor for Mapping Salt Lake\n                  City.</br>\n                  <a href=\"#\">Chris Tanseer</a> serves as the Assistant Editor and Lead Web Developer\n                  for\n                  the\n                  project.</br>\n                </div>\n\n                <div>\n                  <h4>Founding Members</h4>\n                  <ul>\n                    <li>Chris Dunsmore</li>\n                    <li>Jeff Nichols</li>\n                    <li>Paisley Rekdal</li>\n                    <li>Chris Tanseer</li>\n                  </ul>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/contacts/views/contact-us.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n            <section data-ng-controller=\"ContactsController\" class=\"main-content-inner\">\n\n                <div class=\"contact-form\">\n\n                    <div class=\"page-header\">\n                        <h1>Contact Us</h1>\n                    </div>\n\n<div class=\"row\">\n    <div class=\"col-md-12\">\n        <p>Thank you for your interest in Mapping Salt Lake City. If you have a general question or would like to get involved, please contact us with the form below.</p>\n\n        <p>If you would like to submit a project, please review the guidelines and <a href=\"/project/create\"> submit your information</a>.</p>\n\n        <div class=\"row\">\n            <div class=\"col-md-8\">\n\n                <form class=\"form-horizontal\" data-ng-submit=\"create()\" novalidate>\n                    <fieldset class=\"contact\">\n                        <div class=\"form-group\">\n\n                            <section class=\"content\">\n                                <div class=\"row\">\n\n                                    <!--<input type=\"text\" data-ng-model=\"state\" id=\"state\" class=\"form-control\" placeholder=\"State\" required>-->\n                                    <div class=\"col-md-6\">\n                                    <span class=\"input input-secondary\">\n                                        <input class=\"input_field input_field-secondary\" type=\"text\" id=\"firstName\" data-ng-model=\"firstName\" required/>\n                                        <label class=\"input_label input_label-secondary\" for=\"firstName\">\n                                            <span class=\"input_label-content input_label-content-secondary\">First Name</span>\n                                        </label>\n                                    </span>\n                                    </div>\n\n                                    <div class=\"col-md-6\">\n                                    <span class=\"input input-secondary\">\n                                        <input class=\"input_field input_field-secondary\" type=\"text\" id=\"lastName\" data-ng-model=\"lastName\">\n                                        <label class=\"input_label input_label-secondary\" for=\"lastName\">\n                                            <span class=\"input_label-content input_label-content-secondary\">Last Name</span>\n                                        </label>\n                                    </span>\n                                    </div>\n\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-md-8\">\n                                        <span class=\"input input-secondary\">\n                                            <input class=\"input_field input_field-secondary\" type=\"email\" id=\"email\" data-ng-model=\"email\" required>\n                                            <label class=\"input_label input_label-secondary\" for=\"email\">\n                                                <span class=\"input_label-content input_label-content-secondary\">E-Mail</span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                    <div class=\"col-md-4\">\n                                        <span class=\"input input-secondary\">\n                                            <input class=\"input_field input_field-secondary\" type=\"text\" id=\"zip\" data-ng-model=\"zip\" required>\n                                            <label class=\"input_label input_label-secondary\" for=\"zip\">\n                                                <span class=\"input_label-content input_label-content-secondary\">Zip Code</span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                                <!--<div class=\"row\">-->\n                                    <!--<div class=\"col-md-12\">-->\n                                        <!--<span class=\"input input-secondary\">-->\n                                            <!--<input class=\"input_field input_field-secondary\" type=\"checkbox\" id=\"newsletter\" data-ng-model=\"newsletter\">-->\n                                            <!--<label class=\"input_label input_label-secondary\" for=\"newsletter\">-->\n                                                <!--<span class=\"input_label-content input_label-content-secondary\">Subscribe to our Quarterly Newsletter?</span>-->\n                                            <!--</label>-->\n                                        <!--</span>-->\n                                    <!--</div>-->\n                                <!--</div>-->\n\n\n                                <div class=\"row\">\n                                <div class=\"col-md-12\">\n\n                                <div id=\"check-awesome\" class=\"form-group filter first-filter\">\n                                    <input type=\"checkbox\" name=\"filters\" id=\"newsletter\" value=\"newsletter\">\n                                    <label for=\"newsletter\">\n                                        <span class=\"check\"></span>\n                                        <span class=\"box\"></span>\n                                        Subscribe to our quarterly e-newsletter\n                                    </label>\n                                </div>\n                                </div>\n                                </div>\n\n                                <!--<div class=\"row\">-->\n                                    <!--<div class=\"col-md-12\">-->\n                                        <!--<label class=\"checkbox\">-->\n                                            <!--<input type=\"checkbox\" data-ng-model=\"newsletter\">-->\n                                            <!--Subscribe to our quarterly e-newsletter.-->\n                                        <!--</label>-->\n                                    <!--</div>-->\n                                <!--</div>-->\n\n                                <div class=\"row\">\n                                    <div class=\"col-md-12\">\n                                        <textarea id=\"message\" data-ng-model=\"message\" name=\"styled-textarea\" required>Let us know what you think</textarea>\n                                    </div>\n                                </div>\n\n                            </section>\n\n                        </div>\n\n                        <div class=\"form-group\">\n                            <button class=\"btn btn-main btn-lg grow btn-contact\" type=\"submit\">Send</button>\n                        </div>\n\n                        <div data-ng-show=\"error\" class=\"text-danger\">\n                            <strong data-ng-bind=\"error\"></strong>\n                        </div>\n\n                    </fieldset>\n                </form>\n\n            </div>\n        </div>\n    </div>\n</div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/contacts/views/edit-contact.client.view.html', '<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\">\n    <section class=\"container\">\n\n        <section data-ng-controller=\"ContactsController\" data-ng-init=\"findOne()\">\n    <div class=\"page-header\">\n        <h1>Edit Contact</h1>\n    </div>\n    <div class=\"col-md-12\">\n        <form class=\"form-horizontal\" data-ng-submit=\"update()\" novalidate>\n            <fieldset>\n                <div class=\"form-group\">\n                    <label class=\"control-label\" for=\"name\">Name</label>\n                    <div class=\"controls\">\n                        <input type=\"text\" data-ng-model=\"contact.name\" id=\"name\" class=\"form-control\" placeholder=\"Name\" required>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <input type=\"submit\" value=\"Update\" class=\"btn btn-default\">\n                </div>\n				<div data-ng-show=\"error\" class=\"text-danger\">\n					<strong data-ng-bind=\"error\"></strong>\n				</div>\n            </fieldset>\n        </form>\n    </div>\n</section>\n</section>\n</section>\n');
		$templateCache.put('modules/contacts/views/view-contact.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n            <section data-ng-controller=\"ContactsController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n\n                <div class=\"row\">\n                    <div class=\"col-xs-12 \">\n\n\n                        <div class=\"img-responsive\">\n                            <a ng-href=\"/\"><img ng-src=\"{{logo}}\"></a>\n                        </div>\n\n                        <div class=\"page-header\">\n                            <h1 data-ng-bind=\"contact.title\"></h1>\n                        </div>\n\n                        <small>\n                            <em class=\"text-muted\">\n\n                                Published\n                                <span data-ng-bind=\"contact.created | date:\'mediumDate\'\"></span>\n                                by\n                                <span data-ng-bind=\"contact.user.firstName\"></span>\n                                <span data-ng-bind=\"contact.user.lastName\"></span>\n                            </em>\n                        </small>\n\n                        <div>\n                            <p data-ng-bind-html=\"contact.message\"></p>\n                        </div>\n\n                        <hr>\n\n                        <!--edit and delete message-->\n                        <div class=\"pull-right\"\n                             data-ng-show=\"(!authentication.admin)\">\n                            <a class=\"btn btn-primary\" href=\"/contacts/{{contact._id}}/edit\">\n                                <i class=\"glyphicon glyphicon-edit\"></i>\n                            </a>\n                            <a class=\"btn btn-primary\" data-ng-click=\"remove();\">\n                                <i class=\"glyphicon glyphicon-trash\"></i>\n                            </a>\n                        </div>\n\n                    </div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/projects/views/create-project.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n      <section data-ng-controller=\"ProjectsController\" class=\"main-content-inner\">\n\n        <div class=\"page-header\">\n          <h1>Project Submission Form</h1>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-md-12\">\n\n            Please include an address for <span>the location of a your essay or project</span>. (Feel free to\n            approximate if there\'s not an exact address.)\n\n            <form name=\"project\" class=\"form-horizontal\" data-ng-submit=\"create(project.$valid)\" novalidate>\n              <fieldset>\n                <div class=\"form-group\">\n\n\n                  <div class=\"row\">\n\n                    <div class=\"col-md-6\">\n                      <span class=\"input input-secondary\">\n                          <input class=\"input_field input_field-secondary\" type=\"text\" id=\"street\"\n                                 data-ng-model=\"project.street\" required ng-change=\"showUploadFunction()\"/>\n                          <label class=\"input_label input_label-secondary\" for=\"street\">\n                            <span\n                              class=\"input_label-content input_label-content-secondary\">Street Address for Project</span>\n                          </label>\n                      </span>\n                    </div>\n\n                    <div class=\"col-md-6\">\n                      <span class=\"input input-secondary\">\n                          <input class=\"input_field input_field-secondary\" type=\"text\" id=\"city\"\n                                 data-ng-model=\"project.city\" required/>\n                          <label class=\"input_label input_label-secondary\" for=\"city\">\n                            <span class=\"input_label-content input_label-content-secondary\">City</span>\n                          </label>\n                      </span>\n                    </div>\n\n                  </div>\n\n                  <div class=\"row\">\n\n                    <div class=\"col-md-6\">\n\n\n\n                      <span class=\"input input-secondary\">\n                          <input class=\"input_field input_field-secondary\" type=\"zip\" id=\"zip\"\n                                 data-ng-model=\"project.zip\" required/>\n                          <label class=\"input_label input_label-secondary\" for=\"zip\">\n                            <span\n                              class=\"input_label-content input_label-content-secondary\">Zip Code</span>\n                          </label>\n                      </span>\n                    </div>\n\n\n                    <div class=\"col-md-6\">\n                      <label for=\"status\">Submission Category\n                        <a href=\"#\" tooltip-placement=\"right\"\n                           uib-tooltip=\"If you\'re unsure of the best  category, just select whatever you feel is close.\">\n                          <i class=\"fa fa-question-circle\"></i>\n                        </a>\n                      </label>\n                      <div class=\"dropdown\">\n                        <select id=\"status\" data-ng-model=\"project.category\">\n                          <option value=\"essay\">Essay</option>\n                          <option value=\"multimedia\">Multimedia</option>\n                          <option value=\"video\">Video</option>\n                          <option value=\"audio\">Audio</option>\n                          <option value=\"photograhpy\">Photography</option>\n                          <option value=\"this was here\">This Was Here</option>\n                        </select>\n                      </div>\n                    </div>\n                  </div>\n\n\n                  <div class=\"row\">\n                    <div class=\"col-md-12\">\n                      <span class=\"input input-secondary title\">\n                          <input class=\"input_field input_field-secondary\" type=\"text\" id=\"title\"\n                                 data-ng-model=\"project.title\" required/>\n                          <label class=\"input_label input_label-secondary title\" for=\"title\">\n                            <span\n                              class=\"input_label-content input_label-content-secondary\">Title</span>\n                          </label>\n                      </span>\n                    </div>\n                  </div>\n\n\n                  <div class=\"row\">\n\n                    <div class=\"col-md-6\">\n                      <project-uploader-directive data-ng-show=\"showUpload\"></project-uploader-directive>\n                    </div>\n\n                  </div>\n\n                  <div class=\"row\">\n                    <div class=\"col-md-offset-8 col-md-2\">\n\n                      <div class=\"form-group pull-right submit-project\">\n                        <input type=\"submit\" class=\"btn btn-primary btn-lg btn-main grow\">\n                      </div>\n\n                      <div data-ng-show=\"error\" class=\"text-danger\">\n                        <strong data-ng-bind=\"error\"></strong>\n                      </div>\n\n                    </div>\n                  </div>\n\n\n                </div>\n\n              </fieldset>\n            </form>\n          </div>\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/projects/views/edit-project.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n        <div class=\"main-content-outer\">\n\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n            <div class=\"page-header\">\n                <h1>Edit Project</h1>\n            </div>\n            <div class=\"col-md-12\">\n                <div class=\"img-responsive\">\n                    <a ng-href=\"/\"><img ng-src=\"{{logo}}\"></a>\n                </div>\n                <form class=\"form-horizontal\" data-ng-submit=\"update()\" novalidate>\n                    <fieldset>\n                        <div class=\"form-group\">\n\n                            <div class=\"controls\">\n                                <label class=\"control-label\">Street</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"street\" id=\"street\" class=\"form-control\"\n                                           placeholder=\"Street\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">City</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"city\" id=\"city\" class=\"form-control\"\n                                           placeholder=\"City\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">State</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"state\" id=\"state\" class=\"form-control\"\n                                           placeholder=\"State\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">Zip Code</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"number\" data-ng-model=\"zip\" id=\"zip\" class=\"form-control\"\n                                           placeholder=\"Zip Code\"\n                                           required>\n                                </div>\n\n                                <label class=\"control-label\">Project Title</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"title\" id=\"title\" class=\"form-control\"\n                                           placeholder=\"Project Title\"\n                                           required>\n                                </div>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"category\" id=\"category\" class=\"form-control\"\n                                           placeholder=\"Category\">\n                                </div>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"vimeoId\" id=\"vimeoId\" class=\"form-control\"\n                                           placeholder=\"Vimeo ID\">\n                                </div>\n\n\n                                <label class=\"control-label\">Story</label>\n                                <div class=\"controls\">\n                                    <textarea ckeditor=\"editorOptions\" ng-model=\"story\" id=\"story\" required></textarea>\n                                </div>\n\n\n                            </div>\n\n                            <div class=\"form-group\">\n                                <input type=\"submit\" value=\"Update\" class=\"btn btn-primary btn-lg btn-main grow\">\n                            </div>\n\n                            <div data-ng-show=\"error\" class=\"text-danger\">\n                                <strong data-ng-bind=\"error\"></strong>\n                            </div>\n                        </div>\n                    </fieldset>\n                </form>\n            </div>\n        </section>\n            </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/projects/views/lightbox.html', '<section data-ng-controller=\"ContributorController\">\n  <div class=\"modal-body\" id=\"lightbox-modal\"\n       ng-swipe-left=\"Lightbox.nextImage()\"\n       ng-swipe-right=\"Lightbox.prevImage()\">\n\n    <div class=lightbox-nav>\n      <button class=close aria-hidden=true ng-click=$dismiss()>×</button>\n      <div class=btn-group>\n        <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.prevImage()><i class=\"fa fa-chevron-left\"></i></a>\n        <a ng-href={{Lightbox.imageUrl}} target=_blank class=\"btn btn-xs btn-default\" title=\"Open in new tab\">Open image\n          in new tab</a>\n        <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.nextImage()><i class=\"fa fa-chevron-right\"></i></a>\n      </div>\n    </div>\n\n    <!-- image -->\n    <div class=\"lightbox-image-container\">\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n\n\n          <div class=lightbox-image-caption>\n            <div><img lightbox-src=\"{{Lightbox.imageUrl}}\"></div>\n\n            <div>{{Lightbox.imageCaption}}</div>\n          </div>\n\n        </div>\n      </div>\n\n    </div>\n  </div>\n</section>\n');
		$templateCache.put('modules/projects/views/list-projects.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n\n      <section data-ng-controller=\"ProjectsController\" data-ng-init=\"init()\" class=\"main-content-inner\">\n\n        <div class=\"list-projects\">\n\n          <div class=\"page-header\">\n            <h1>Projects</h1>\n          </div>\n\n          <div class=\"list-group\">\n            <div class=\"row\">\n              <div class=\"col-md-12\">\n                <a data-ng-repeat=\"publishedProject in publishedProjects\" data-ng-href=\"/projects/{{publishedProject._id}}\" class=\"col-md-4 story-summary animation-cards\">\n                    <span>\n                        <span>\n                            <img data-ng-src=\"{{publishedProject.mainImgThumbnail}}\"/>\n                        </span>\n\n                        <span class=\"pull-right\">\n                            <span data-ng-bind=\"publishedProject.title\"></span><br/>\n                            <span data-ng-bind=\"publishedProject.user.displayName\">there</span><br/>\n                        </span>\n                    </span>\n                </a>\n              </div>\n            </div>\n\n\n            <div class=\"alert alert-warning text-center\"\n                 data-ng-hide=\"!PublishingService.getPublishedProjects() || projects.length\">\n              No Projects yet, why don\'t you <a href=\"/projects/create\">create one</a>?\n            </div>\n\n          </div>\n        </div>\n        <pagination boundary-links=\"true\" max-size=\"8\" items-per-page=\"itemsPerPage\" total-items=\"filterLength\"\n                    ng-model=\"currentPage\" ng-change=\"pageChanged()\"></pagination>\n\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/projects/views/project-for-submission.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n\n      <project-status-overview></project-status-overview>\n\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/projects/views/view-project.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n\n      <section data-ng-controller=\"ProjectsController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n        <!--<a data-ng-click=\"goBack()\"><span><i class=\"fa fa-chevron-left\"></i></span></a>-->\n\n        <div class=\"view-project\">\n          <div class=\"page-header\">\n              <h1 data-ng-bind=\"project.title\"></h1>\n              <i class=\"fa fa-heart-o\" ng-show=\"!isFavorite\" ng-click=\"toggleFavProject()\"></i>\n              <i class=\"fa fa-heart\" ng-show=\"isFavorite\" ng-click=\"toggleFavProject()\"></i>\n            <em class=\"text-muted\">\n              <span data-ng-bind=\"project.createdOn | date:\'mediumDate\'\"></span>\n              by\n              <a data-ng-href=\"/contributors/{{project.user._id}}\"><span data-ng-bind=\"project.user.displayName\"></span></a>\n            </em>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <div class=\"videoWrapper\" data-ng-show=\"project.vimeoId\">\n                <iframe data-ng-show=\"!videoSizeSelect()\" width=\"{{vimeo.width}}\" height=\"{{vimeo.height}}\"\n                        data-ng-src=\"{{vimeo.video}}\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen\n                        allowfullscreen>\n                </iframe>\n              </div>\n\n              <div class=\"videoWrapper\" data-ng-show=\"project.soundCloudId\">\n                <iframe width=\"100%\" height=\"450\" scrolling=\"no\" frameborder=\"no\" data-ng-src=\"{{soundCloud.audio}}\">\n                </iframe>\n              </div>\n\n              <div data-ng-show=\"project.imageGallery || images\">\n                <div class=\"row\">\n                  <ul id=\"grid-view\">\n                    <a ng-click=\"openLightboxModal($index)\" data-ng-repeat=\"image in images\" class=\"col-md-3\">\n                      <li>\n                        <img ng-src=\"{{image}}\" class=\"img-thumbnail\">\n                      </li>\n                    </a>\n                  </ul>\n                </div>\n\n\n                <div data-ng-show=\"project.story !== \'\'\">\n                  <p data-ng-bind-html=\"trustAsHtml(project.story)\"></p>\n                </div>\n                <hr>\n                <div>\n                  <img ng-src=\"{{project.mapImage}}\" class=\"img-responsive\">\n                </div>\n\n                <hr/>\n                <h3>Related Stories</h3>\n\n                <div class=\"pull-right\"\n                     data-ng-show=\"((authentication.user) && (authentication.user._id == project.user._id)) || isAdmin.user === \'admin\'\">\n                  <a class=\"btn btn-main grow\" href=\"/projects/{{project._id}}/edit\">\n                    <i class=\"glyphicon glyphicon-edit\"></i>\n                  </a>\n                  <a class=\"btn btn-primary btn-warning\" data-ng-click=\"remove();\">\n                    <i class=\"glyphicon glyphicon-trash\"></i>\n                  </a>\n                </div>\n\n              </div>\n            </div>\n          </div>\n        </div>\n\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/core/views/400.client.view.html', '<h1>Bad Request</h1>\n<div class=\"alert alert-danger\" role=\"alert\">\n  <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n  <span class=\"sr-only\">Error:</span>\n  You made a bad request\n</div>\n');
		$templateCache.put('modules/core/views/403.client.view.html', '<h1>Forbidden</h1>\n<div class=\"alert alert-danger\" role=\"alert\">\n  <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n  <span class=\"sr-only\">Error:</span>\n  You are not authorized to access this resource\n</div>\n');
		$templateCache.put('modules/core/views/404.client.view.html', '<h1>Page Not Found</h1>\n<div class=\"alert alert-danger\" role=\"alert\">\n  <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n  <span class=\"sr-only\">Error:</span> Page Not Found\n</div>\n');
		$templateCache.put('modules/core/views/file-upload.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n    <section class=\"container\">\n        <div class=\"main-content-outer\">\n            <section data-ng-controller=\"FileUploadController\" class=\"main-content-inner\">\n\n                <div class=\"file-upload\">\n\n                    <div ngf-drop ngf-select ng-model=\"files\" class=\"drop-box\" ngf-drag-over-class=\"dragover\" ngf-allow-dir=\"true\" accept=\"image/*\">\n                        <span>Drag images or click here to load a file</span>\n                    </div>\n\n                    <!--preview file before upload-->\n                    <div>\n                        <img ngf-src=\"files[0]\" data-ng-show=\"files[0].type.indexOf(\'image\') === 0\" data-ng-hide=\"uploadCommplete\" ngf-accept=\"\'image/*\'\"/>\n                    </div>\n\n                    <!--update button will appear after file has been selected-->\n                    <div>\n                        <button data-ng-click=\"uploadFile(files)\" data-ng-show=\"files[0].type.indexOf(\'image\') > -1\" class=\"btn btn-main grow\">\n                            Upload\n                        </button>\n                    </div>\n\n\n                    <!--preview of uploaded file-->\n                    <!--<img ng-src=\"{{imgSrc}}\" data-ng-show=\"files[0].type.indexOf(\'image\') > -1\" />-->\n                    <!--<img ng-src=\"{{imgSrc}}\" />-->\n                    <img data-ng-show=\"imgSrc\"\n                         ngf-src=\"{{files}}\"\n                         ngf-accept=\"\'.png,.jpg\'\"\n                         ngf-min-size=\'100\'\n                         ngf-max-size=\'30000\'\n                            />\n\n                    <!--<span data-ng-if=\"uploadInProgress\">Upload progress: {{ uploadProgress }}</span> <br />-->\n                    <!--<img data-ng-src=\"uploadedImage\" data-ng-if=\"uploadedImage\"> <br />-->\n\n                    Upload Log:\n                    <pre>{{log}}</pre>\n\n\n                    <hr/>\n\n\n                    <form name=\"myForm\">\n                        <fieldset>\n                            <legend>Upload on form submit</legend>\n                            Username: <input type=\"text\" name=\"userName\" ng-model=\"username\" size=\"39\" required=\"\">\n                            <i ng-show=\"myForm.userName.$error.required\">*required</i><br>\n                            Profile Picture: <input type=\"file\" ngf-select=\"\" ng-model=\"picFile\" name=\"file\" accept=\"image/*\" required=\"\">\n                            <i ng-show=\"myForm.file.$error.required\">*required</i>\n                            <br>\n\n                            <button ng-disabled=\"!myForm.$valid\" ng-click=\"uploadPic(picFile)\">Submit</button>\n                            <img ng-show=\"picFile[0] != null\" ngf-src=\"picFile[0]\" class=\"thumb\">\n                            <span class=\"progress\" ng-show=\"picFile[0].progress >= 0\">\n                                <div style=\"width:{{picFile[0].progress}}%\" ng-bind=\"picFile[0].progress + \'%\'\" class=\"ng-binding\"></div>\n                            </span>\n                            <span ng-show=\"picFile[0].result\">Upload Successful</span>\n                        </fieldset>\n                        <br>\n                    </form>\n\n\n                    <hr/>\n\n\n                    <div>\n                        <form>\n                            <div>Image URL</div>\n                            <div>\n                                <input type=\"url\" placeholder=\"Type in the url you want to upload\" data-ng-model=\"imgUrl.url\" name=\"url\" id=\"url\"/>\n                            </div>\n                            <div>\n                                <button data-ng-click=\"submitUrl(imgUrl)\" class=\"btn btn-main grow\" data-ng-show=\"imgUrl !== \'\'\">\n                                    Submit Url\n                                </button>\n                            </div>\n                        </form>\n                    </div>\n\n\n\n                    <!--<div ngf-no-file-drop>-->\n                    <!--<span>File Drag/Drop is not supported for this browser</span>-->\n\n                    <!--<div>-->\n                    <!--<form>-->\n                    <!--<div><input type=\"url\" placeholder=\"Type in the url you want to upload\" ng-model=\"imgUrl\"/></div>-->\n                    <!--<div>-->\n                    <!--<button ng-click=\"submitUrl(imgUrl)\">Submit Url</button>-->\n                    <!--</div>-->\n                    <!--</form>-->\n                    <!--</div>-->\n                    <!--</div>-->\n\n\n                </div>\n\n\n            </section>\n        </div>\n    </section>\n</section>');
		$templateCache.put('modules/core/views/header.client.view.html', '<div class=\"container\" ng-controller=\"HeaderController\">\n  <div class=\"navbar-header\">\n    <button class=\"navbar-toggle\" type=\"button\" ng-click=\"toggleCollapsibleMenu()\">\n      <span class=\"sr-only\">Toggle navigation</span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a ui-sref=\"home\" class=\"navbar-brand\">MEAN.JS</a>\n  </div>\n  <nav class=\"collapse navbar-collapse\" collapse=\"!isCollapsed\" role=\"navigation\">\n    <ul class=\"nav navbar-nav\" ng-if=\"menu.shouldRender(authentication.user);\">\n      <li ng-repeat=\"item in menu.items | orderBy: \'position\'\" ng-if=\"item.shouldRender(authentication.user);\" ng-switch=\"item.type\" ng-class=\"{ active: $state.includes(item.state), dropdown: item.type === \'dropdown\' }\" class=\"{{item.class}}\" dropdown=\"item.type === \'dropdown\'\">\n        <a ng-switch-when=\"dropdown\" class=\"dropdown-toggle\" dropdown-toggle role=\"button\">{{::item.title}}&nbsp;<span class=\"caret\"></span></a>\n        <ul ng-switch-when=\"dropdown\" class=\"dropdown-menu\">\n          <li ng-repeat=\"subitem in item.items | orderBy: \'position\'\" ng-if=\"subitem.shouldRender(authentication.user);\" ui-sref-active=\"active\">\n            <a ui-sref=\"{{subitem.state}}\" ng-bind=\"subitem.title\"></a>\n          </li>\n        </ul>\n        <a ng-switch-default ui-sref=\"{{item.state}}\" ng-bind=\"item.title\"></a>\n      </li>\n    </ul>\n    <ul class=\"nav navbar-nav navbar-right\" ng-hide=\"authentication.user\">\n      <li ui-sref-active=\"active\">\n        <a ui-sref=\"authentication.signup\">Sign Up</a>\n      </li>\n      <li class=\"divider-vertical\"></li>\n      <li ui-sref-active=\"active\">\n        <a ui-sref=\"authentication.signin\">Sign In</a>\n      </li>\n    </ul>\n    <ul class=\"nav navbar-nav navbar-right\" ng-show=\"authentication.user\">\n      <li class=\"dropdown\" dropdown>\n        <a class=\"dropdown-toggle user-header-dropdown-toggle\" dropdown-toggle role=\"button\">\n          <img ng-src=\"{{authentication.user.profileImageURL}}\" alt=\"{{authentication.user.displayName}}\" class=\"header-profile-image\" />\n          <span ng-bind=\"authentication.user.displayName\"></span> <b class=\"caret\"></b>\n        </a>\n        <ul class=\"dropdown-menu\" role=\"menu\">\n          <li ui-sref-active=\"active\">\n            <a ui-sref=\"settings.profile\">Edit Profile</a>\n          </li>\n          <li ui-sref-active=\"active\">\n            <a ui-sref=\"settings.picture\">Change Profile Picture</a>\n          </li>\n          <li ui-sref-active=\"active\" ng-show=\"authentication.user.provider === \'local\'\">\n            <a ui-sref=\"settings.password\">Change Password</a>\n          </li>\n          <li ui-sref-active=\"active\">\n            <a ui-sref=\"settings.accounts\">Manage Social Accounts</a>\n          </li>\n          <li class=\"divider\"></li>\n          <li>\n            <a href=\"/api/v1/auth/signout\" target=\"_self\">Signout</a>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </nav>\n</div>\n');
		$templateCache.put('modules/core/views/home.client.view.html', '<section class=\"container map\" data-ng-controller=\"HomeController\" data-ng-init=\"mapFunction()\">\n\n    <!--logo-->\n    <div data-ng-show=\"!overlayActive && !menuOpen\">\n        <div class=\"small-main-logo logo-on-page img-responsive\" data-ng-click=\"toggleOverlayFunction(\'home\')\"></div>\n    </div>\n\n    <main-page-overlay></main-page-overlay>\n\n    <!--call MapBox map-->\n\n    <div id=\"map\" class=\"map\" data-ng-class=\"{\'leaflet-tile-gray\': !shadeMap}\">\n       <i class=\"fa fa-info-circle\" data-ng-click=\"attributionFull = !attributionFull\" data-ng-class=\"{\'atrrib-clicked\': attributionFull}\"></i>\n        <div class=\"attrib\" data-ng-show=\"attributionFull\" data-ng-bind-html=\"attributionText\"></div>\n    </div>\n\n    <div id=\"main-menu\" class=\"main-menu\">\n        <main-menu></main-menu>\n    </div>\n\n    <div id=\"info\" class=\"info\" data-ng-class=\"{\'info-project-details\': toggleDetails}\"></div>\n\n</section>\n');
		$templateCache.put('modules/core/views/modal.client.view.html', '<div data-ng-controller=\"ModalController\" >\n\n<signup-modal></signup-modal>\n</div>\n\n');
		$templateCache.put('modules/admins/views/messages/admin-list-messages.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n\n    <div class=\"main-content-outer\">\n\n      <section class=\"main-content-inner\" data-ng-controller=\"ContactsController\" data-ng-init=\"find()\">\n\n\n        <div class=\"admin\">\n\n          <div class=\"admin-messages\">\n\n            <div class=\"admin-nav\">\n              <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                Admin Home Page\n              </a>\n              <a class=\"btn btn-main grow\" ui-sref=\"admin.adminProjectsQueue\">\n                Admin Project Page\n              </a>\n            </div>\n\n            <div class=\"page-header\">\n              <h1>Messages</h1>\n            </div>\n\n            <table class=\"table table-bordered table-striped\">\n              <thead ts-wrapper>\n              <tr>\n                <th ts-criteria=\"firstName\">First Name</th>\n                <th ts-criteria=\"lastName|lowercase\" ts-default>Last Name</th>\n                <th ts-criteria=\"email\">E-Mail</th>\n                <th ts-criteria=\"created\">Date Sent</th>\n                <!--<th ts-criteria=\"read\">Read</th>-->\n                <!--<th ts-criteria=\"flag\">Flag</th>-->\n              </tr>\n              </thead>\n\n\n              <tbody>\n\n              <tr data-ng-repeat=\"contact in contacts | orderBy: \'-created\'\"\n                  data-ng-class=\"{\'message-read\' : contact.read}\" data-ng-click=\"viewMessage(contact._id)\">\n                <td>{{ contact.firstName }}</td>\n                <td>{{ contact.lastName }}</td>\n                <!--<td>{{ contact.email }}</td>-->\n                <td>{{ contact._id }}</td>\n                <td>{{ contact.created | date : short }}</td>\n                <!--<td>{{ contact.read }}</td>-->\n                <!--<td align=\"center\"><i class=\"fa fa-flag\" data-ng-click=\"toggleFlag = !toggleFlag\" data-ng-class=\"{\'select\' : toggleFlag = true}\"></i></td>-->\n              </tr>\n\n              </tbody>\n\n            </table>\n\n            <pagination boundary-links=\"true\" max-size=\"8\" items-per-page=\"itemsPerPage\" total-items=\"filterLength\"\n                        ng-model=\"currentPage\" ng-change=\"pageChanged()\"></pagination>\n\n\n          </div>\n        </div>\n      </section>\n    </div>\n\n\n  </section>\n</section>\n');
		$templateCache.put('modules/admins/views/messages/admin-view-message.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n\n        <div class=\"main-content-outer admin\">\n\n            <section data-ng-controller=\"ContactsController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-messages\">\n\n                        <div class=\"admin-nav\">\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                                Admin Home Page\n                            </a>\n                        </div>\n\n                        <div class=\"page-header\">\n                            <h1 data-ng-bind=\"contact.name\"></h1>\n                        </div>\n\n                        <div class=\"row\">\n\n\n                            <div class=\"row\">\n                                <!--<div class=\"col-md-5\" data-ng-bind=\"contact.fullName\"></div>-->\n                                <div class=\"col-md-8\">{{contact.firstName}} {{contact.lastName}}</div>\n                                <div class=\"col-md-2\" data-ng-bind=\"contact.email\"></div>\n                            </div>\n                            <div class=\"row\">\n                                <div data-ng-bind=\"contact.message\"></div>\n                            </div>\n                            <small>\n                                <em class=\"text-muted\">\n                                    <span data-ng-bind=\"contact.created | date:\'mediumDate\'\"></span>\n                                    from\n                                    <span data-ng-bind=\"contact.user.displayName\"></span>\n                                </em>\n                            </small>\n                        </div>\n\n                        <div class=\"pull-right\" data-ng-show=\"isAdmin.user\">\n                            <a class=\"btn btn-primary btn-warning\" data-ng-click=\"remove();\">\n                                <i class=\"glyphicon glyphicon-trash\"></i>\n                            </a>\n                        </div>\n\n                    </div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/projects/admin-edit-project.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n\n        <div class=\"main-content-outer\">\n\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"findOneProject()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-projects\">\n\n                        <div class=\"admin-nav\">\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                                Admin Home Page\n                            </a>\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.adminListUsers\">\n                                Admin User Page\n                            </a>\n                        </div>\n\n            <div class=\"page-header\">\n                <h1>Edit Project</h1>\n            </div>\n            <div class=\"col-md-12\">\n                <div class=\"img-responsive\">\n                    <a ng-href=\"/\"><img ng-src=\"{{logo}}\"></a>\n                </div>\n                <form class=\"form-horizontal\" data-ng-submit=\"update()\" novalidate>\n                    <fieldset>\n                        <div class=\"form-group\">\n\n                            <div class=\"controls\">\n                                <label class=\"control-label\">Street</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"street\" id=\"street\" class=\"form-control\"\n                                           placeholder=\"Street\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">City</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"city\" id=\"city\" class=\"form-control\"\n                                           placeholder=\"City\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">State</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"state\" id=\"state\" class=\"form-control\"\n                                           placeholder=\"State\"\n                                           required>\n                                </div>\n                                <label class=\"control-label\">Zip Code</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"number\" data-ng-model=\"zip\" id=\"zip\" class=\"form-control\"\n                                           placeholder=\"Zip Code\"\n                                           required>\n                                </div>\n\n                                <label class=\"control-label\">Project Title</label>\n\n                                <div class=\"controls\">\n                                    <input type=\"text\" data-ng-model=\"title\" id=\"title\" class=\"form-control\"\n                                           placeholder=\"Project Title\"\n                                           required>\n                                </div>\n\n\n                                <label class=\"control-label\">Story</label>\n\n                                <div class=\"controls\">\n                                    <textarea ckeditor=\"editorOptions\" ng-model=\"story\" id=\"story\" required></textarea>\n                                </div>\n                            </div>\n                            <div class=\"form-group\">\n                                <input type=\"submit\" value=\"Update\" class=\"btn btn-primary btn-lg btn-main grow\">\n                            </div>\n                            <div data-ng-show=\"error\" class=\"text-danger\">\n                                <strong data-ng-bind=\"error\"></strong>\n                            </div>\n                        </div>\n                    </fieldset>\n                </form>\n            </div>\n            </div>\n            </div>\n        </section>\n            </div>\n    </section>\n</section>');
		$templateCache.put('modules/admins/views/projects/admin-projects-list.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"find()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-projects\">\n\n                        <div class=\"admin-nav\">\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                                Admin Home Page\n                            </a>\n                        </div>\n\n                        <div class=\"page-header\">\n                            <h1>Admin Panel</h1>\n                        </div>\n\n                        <div class=\"row\">\n                            <!--<a data-ng-repeat=\"project in projects\" data-ng-href=\"/projects/{{project._id}}\" class=\"col-md-12 admin-list\">-->\n                            <a data-ng-repeat=\"project in projects\" data-ng-href=\"/admin/edit-project/{{project._id}}\" class=\"col-md-12 admin-list\">\n                              <h3 class=\"list-group-item-heading\" data-ng-bind=\"project.title\"></h3>\n                              <div data-ng-bind=\"project.user.displayName\"></div>\n                              <small>\n                                Submitted:\n                                <span data-ng-bind=\"project.createdOn | date:\'medium\'\"></span>\n                              </small>\n\n                            </a>\n                        </div>\n\n                        <div class=\"alert alert-warning text-center\" data-ng-hide=\"!projects.$resolved || projects.length\">\n                            No projects are currently waiting for approval. Check <a href=\"#\">blah blah</a> for blah blah.\n                        </div>\n\n                    </div>\n                </div>\n\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/projects/admin-projects.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"find()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-projects\">\n\n                        <div class=\"admin-nav\">\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                                Admin Home Page\n                            </a>\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.adminProjectsQueue\">\n                                Admin Project Page\n                            </a>\n                        </div>\n\n                        <div class=\"page-header\">\n                            <h1>Admin Panel</h1>\n                        </div>\n\n                        <div class=\"row\">\n                            <a data-ng-repeat=\"project in projects\" data-ng-href=\"/projects/{{project._id}}\" class=\"col-md-12 admin-list\">\n                                <small>\n                                    Posted on\n                                    <span data-ng-bind=\"project.created | date:\'medium\'\"></span>\n                                    by\n                                    <span data-ng-bind=\"project.user.displayName\"></span>\n                                </small>\n                                <h4 class=\"list-group-item-heading\" data-ng-bind=\"project.name\"></h4>\n                            </a>\n                        </div>\n\n                        <div class=\"alert alert-warning text-center\" data-ng-hide=\"!projects.$resolved || projects.length\">\n                            No projects are currently waiting for approval. Check <a href=\"#\">blah blah</a> for blah blah.\n                        </div>\n\n                    </div>\n                </div>\n\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/projects/admin-view-project.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\" onerror=\"myFunction()\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"ProjectsController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n                    <div class=\"admin-projects\">\n\n                      <div class=\"admin-nav\">\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                          Admin Home Page\n                        </a>\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.adminProjectsQueue\">\n                          Admin Project Page\n                        </a>\n                      </div>\n\n                        <div class=\"page-header\">\n                            <h1>{{project.title}}\n                                <a href=\"#\" data-ng-show=\"\'modules/core/img/{{photo0}}\'\"><span><img data-ng-src=\"modules/core/img/{{photo0}}\" class=\"header-profile-image pull-right\"/></span></a>\n                                <a href=\"#\" data-ng-hide=\"\'modules/core/img/{{photo0}}\'\"><span><img data-ng-src=\"\" class=\"header-profile-image pull-right\"/></span>Upload\n                                    a Pic</a>\n                            </h1>\n                        </div>\n\n                        <div class=\"row projects-profile\">\n                            <div class=\"col-xs-12\">\n                              <a class=\"btn btn-main grow\" data-ng-click=\"processNlpData()\">\n                                NLP!\n                                <i class=\"fa fa-check\"></i>\n                              </a>\n\n                              <a class=\"btn btn-main grow\" data-ng-click=\"confirmPublishModal()\">\n                                Yodal My Modal\n                                <i class=\"fa fa-check\"></i>\n                              </a>\n\n                                <form class=\"form-horizontal\" data-ng-submit=\"update(toggleId)\" novalidate>\n                                  <fieldset>\n                                        <project-view-form></project-view-form>\n                                    </fieldset>\n                                </form>\n\n                            </div>\n                        </div>\n\n                        <hr>\n\n                        <div class=\"pull-right\">\n                            <a class=\"btn btn-main grow btn-warning\" data-ng-click=\"remove();\">\n                                <i class=\"glyphicon glyphicon-trash\"></i>\n                            </a>\n                        </div>\n\n                    </div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/users/admin-edit-user.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"UserController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n                <div class=\"admin-user\">\n\n                    <div class=\"admin-nav\">\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                            Admin Home Page\n                        </a>\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.adminListUsers\">\n                            Admin User Page\n                        </a>\n                    </div>\n\n                    <div class=\"page-header\">\n                        <h1>Edit {{user.firstName}} {{user.lastName}}\'s Profile</h1>\n                    </div>\n\n                    <div class=\"row\">\n                        <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2\">\n                            <form data-ng-submit=\"updateUserProfile()\" class=\"signin form-horizontal\" autocomplete=\"off\">\n\n                                <fieldset>\n                                    <div class=\"form-group\">\n                                        <label for=\"firstName\">First Name</label>\n                                        <input type=\"text\" id=\"firstName\" name=\"firstName\" class=\"form-control\" data-ng-model=\"user.firstName\"\n                                               placeholder=\"First Name\">\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"lastName\">Last Name</label>\n                                        <input type=\"text\" id=\"lastName\" name=\"lastName\" class=\"form-control\" data-ng-model=\"user.lastName\" placeholder=\"Last Name\">\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"email\">Email</label>\n                                        <input type=\"text\" id=\"email\" name=\"email\" class=\"form-control\" data-ng-model=\"user.email\" placeholder=\"Email\">\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"username\">Username</label>\n                                        <input type=\"text\" id=\"username\" name=\"username\" class=\"form-control\" data-ng-model=\"user.username\" placeholder=\"Username\">\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"zip\">Zip Code</label>\n                                        <input type=\"number\" id=\"zip\" name=\"zip\" class=\"form-control\" data-ng-model=\"user.zip\" placeholder=\"Zip Code\">\n                                    </div>\n\n                                    <div class=\"text-center form-group\">\n                                        <button type=\"submit\" class=\"btn btn-large btn-primary\">Save Profile</button>\n                                    </div>\n\n\n                                    <div data-ng-show=\"success\" class=\"text-center text-success\">\n                                        <strong>Profile Saved Successfully</strong>\n                                    </div>\n                                    <div data-ng-show=\"error\" class=\"text-center text-danger\">\n                                        <strong data-ng-bind=\"error\"></strong>\n                                    </div>\n                                </fieldset>\n\n\n                            </form>\n                        </div>\n                    </div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/users/admin-list-users.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n            <section data-ng-controller=\"UserController\" data-ng-init=\"find()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-user\">\n\n                        <div class=\"admin-nav\">\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                                Admin Home Page\n                            </a>\n                            <a class=\"btn btn-main grow\" ui-sref=\"admin.adminListUsers\">\n                                Admin User Page\n                            </a>\n                        </div>\n\n                        <div class=\"page-header\">\n                            <h1>List of Users</h1>\n                        </div>\n\n                        <div class=\"row\">\n                            <div class=\"col-md-12\">\n                                <a data-ng-repeat=\"user in users\" data-ng-href=\"/users/{{user._id}}\" class=\"col-md-6\">\n                                  <div class=\"tile\">\n                                    <div class=\"user-summary\" data-ng-bind=\"user.displayName\">{{user._id}}</div>\n                                    <div><img data-ng-src=\"{{user.profileImage}}\"></div>\n                                  </div>\n                                </a>\n                            </div>\n                        </div>\n\n                    </div>\n\n                    <div class=\"container\">\n                        <div class=\"gridStyle\" data-ng-grid=\"gridOptions\"></div>\n                    </div>\n\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/admins/views/users/admin-view-user.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\" data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n    <section class=\"container\">\n        <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n        <div class=\"main-content-outer\">\n\n            <section data-ng-controller=\"EditProfileController\" data-ng-init=\"findOne()\" class=\"main-content-inner\">\n\n                <div class=\"admin\">\n\n                    <div class=\"admin-user\">\n\n                      <div class=\"admin-nav\">\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.dashboard\">\n                          Admin Home Page\n                        </a>\n                        <a class=\"btn btn-main grow\" ui-sref=\"admin.adminListUsers\">\n                          Admin User Page\n                        </a>\n                      </div>\n\n                        <div class=\"page-header\">\n                            <h1>{{userToEdit.firstName}} {{userToEdit.lastName}}\'s Profile\n                                <a href=\"#\" data-ng-show=\"userToEdit.profileImageURL\"><span><img data-ng-src=\"{{userToEdit.profileImageURL}}\" class=\"header-profile-image pull-right\"/></span>\n                                </a>\n\n                                <a href=\"#\" data-ng-show=\"!userToEdit.profileImageURL\"><span><img data-ng-src=\"\" class=\"header-profile-image pull-right\"/></span>Upload a Pic\n                                </a>\n                            </h1>\n                        </div>\n\n                        <div class=\"row user-profile\">\n                            <div class=\"col-xs-12\">\n                              <form name=\"userAdminForm\" class=\"form-horizontal\" data-ng-submit=\"update(userToEdit.$valid)\" novalidate>\n                                <fieldset>\n                                  <user-view-form></user-view-form>\n                                </fieldset>\n                              </form>\n                            </div>\n                        </div>\n\n\n\n                      <hr>\n\n                        <div class=\"pull-right\">\n                            <!--data-ng-show=\"((authentication.user) && (authentication.user._id == project.user._id))\">-->\n                            <!--<a class=\"btn btn-primary\" href=\"/users/{{user._id}}/edit\">-->\n                            <!--<i class=\"glyphicon glyphicon-edit\"></i>-->\n                            <!--</a>-->\n                            <a class=\"btn btn-main grow btn-warning\" data-ng-click=\"remove();\">\n                                <i class=\"glyphicon glyphicon-trash\"></i>\n                            </a>\n                        </div>\n\n                    </div>\n                </div>\n            </section>\n        </div>\n    </section>\n</section>\n');
		$templateCache.put('modules/users/views/admin/edit-user.client.view.html', '<section>\n  <div class=\"page-header\">\n    <h1>User <span ng-bind=\"user.username\"></span></h1>\n  </div>\n  <div class=\"col-md-12\">\n    <form name=\"userForm\" ng-submit=\"update(userForm.$valid)\" novalidate>\n      <fieldset>\n        <div class=\"form-group\" show-errors>\n          <label for=\"firstName\">First Name</label>\n          <input type=\"text\" id=\"firstName\" name=\"firstName\" class=\"form-control\" ng-model=\"user.firstName\" placeholder=\"First Name\" required />\n          <div ng-messages=\"userForm.firstName.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">First name is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"lastName\">Last Name</label>\n          <input type=\"text\" id=\"lastName\" name=\"lastName\" class=\"form-control\" ng-model=\"user.lastName\" placeholder=\"Last Name\" required />\n          <div ng-messages=\"userForm.lastName.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Last name is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label class=\"control-label\" for=\"roles\">Roles</label>\n          <div class=\"controls\">\n            <input class=\"form-control\" type=\"text\" name=\"roles\" ng-model=\"user.roles\" id=\"roles\" ng-list required />\n            <div ng-messages=\"userForm.roles.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">At least one role is required.</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <input type=\"submit\" value=\"Update\" class=\"btn btn-default\">\n        </div>\n        <div ng-show=\"error\" class=\"text-danger\">\n          <strong ng-bind=\"error\"></strong>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/admin/list-users.client.view.html', '<section>\n  <div class=\"page-header\">\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <h1>Users</h1>\n      </div>\n      <div class=\"col-md-4\" style=\"margin-top: 2em\">\n        <input class=\"form-control col-md-4\" type=\"text\" ng-model=\"search\" placeholder=\"Search\" ng-change=\"figureOutItemsToDisplay()\" />\n      </div>\n    </div>\n  </div>\n  <div class=\"list-group\">\n    <a ng-repeat=\"user in pagedItems\" ui-sref=\"admin.user({userId: user._id})\" class=\"list-group-item\">\n      <h4 class=\"list-group-item-heading\" ng-bind=\"user.username\"></h4>\n      <p class=\"list-group-item-text pull-right small\" ng-bind=\"user.roles\"></p>\n      <p class=\"list-group-item-text\" ng-bind=\"user.email\"></p>\n    </a>\n  </div>\n\n  <pagination boundary-links=\"true\" max-size=\"8\" items-per-page=\"itemsPerPage\" total-items=\"filterLength\" ng-model=\"currentPage\" ng-change=\"pageChanged()\"></pagination>\n</section>\n');
		$templateCache.put('modules/users/views/admin/view-user.client.view.html', '<section>\n  <div class=\"page-header\">\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <h1 ng-bind=\"user.username\"></h1>\n      </div>\n      <div class=\"col-md-4\">\n        <a class=\"btn btn-primary\" ui-sref=\"admin.user-edit({userId: user._id})\">\n          <i class=\"glyphicon glyphicon-edit\"></i>\n        </a>\n        <a class=\"btn btn-primary\" ng-click=\"remove();\" ng-if=\"user._id !== authentication.user._id\">\n          <i class=\"glyphicon glyphicon-trash\"></i>\n        </a>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-8\">\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>First Name</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.firstName\"></div>\n      </div>\n      <hr/>\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>Last Name</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.lastName\"></div>\n      </div>\n      <hr/>\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>Email</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.email\"></div>\n      </div>\n      <hr/>\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>Provider</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.provider\"></div>\n      </div>\n      <hr/>\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>Created</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.created\"></div>\n      </div>\n      <hr/>\n      <div class=\"row\">\n        <div class=\"col-md-3\"><strong>Roles</strong></div>\n        <div class=\"col-md-6\" ng-bind=\"user.roles\"></div>\n      </div>\n    </div>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/authentication/authentication.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n\n\n      <section ng-controller=\"AuthenticationController\" class=\"main-content-inner\">\n\n        <div class=\"row\">\n\n          <h3 class=\"col-md-12 text-center\">Sign in using your social accounts</h3>\n\n          <div class=\"col-md-12 text-center signin-icons\">\n\n            <a data-ng-click=\"callOauthProvider(\'/api/v1/auth/facebook\')\" class=\"undecorated-link\"><i class=\"fa fa-facebook\"></i></a>\n            <a ng-click=\"callOauthProvider(\'/api/v1/auth/twitter\')\" class=\"undecorated-link\"><i class=\"fa fa-twitter\"></i></a>\n          </div>\n          <div ui-view></div>\n        </div>\n      </section>\n\n    </div>\n\n  </section>\n</section>\n');
		$templateCache.put('modules/users/views/authentication/signin.client.view.html', '<section data-ng-controller=\"AuthenticationController\">\n  <div class=\"auth-form\">\n    <h3 class=\"col-md-12 text-center\">Or with your account</h3>\n    <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-3 col-md-5\">\n      <form name=\"userForm\" ng-submit=\"signin(userForm.$valid)\" class=\"signin form-horizontal\" autocomplete=\"off\">\n        <fieldset>\n          <div class=\"form-group\" show-errors>\n\n            <div class=\"row\"> <!-- Row #1 -->\n              <div class=\"col-md-12\">\n                      <span class=\"input input-secondary\" data-ng-class=\"{\'input-filled\': credentials.username }\">\n                      <input class=\"input_field input_field-secondary\" placeholder=\"Username\" type=\"text\" id=\"username\" value=\"\" name=\"username\" data-ng-model=\"credentials.username\"/>\n                      <label class=\"input_label input_label-secondary\" for=\"username\">\n                        <span class=\"input_label-content input_label-content-secondary\">Username</span>\n                      </label>\n                  </span>\n              </div>\n            </div>\n\n            <div ng-messages=\"userForm.username.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">Username is required.</p>\n            </div>\n          </div>\n          <div class=\"form-group\" show-errors>\n            <div class=\"row\">  <!-- Row #2 -->\n              <div class=\"col-md-12\">\n                  <span class=\"input input-secondary\" data-ng-class=\"{\'input-filled\': credentials.password }\">\n                      <input class=\"input_field input_field-secondary\" type=\"password\" id=\"password\" name=\"password\" value=\"\" data-ng-model=\"credentials.password\" placeholder=\"Password\" required/>\n                      <label class=\"input_label input_label-secondary\" for=\"password\">\n                        <span class=\"input_label-content input_label-content-secondary\">Password</span>\n                      </label>\n                  </span>\n              </div>\n            </div>\n            <div ng-messages=\"userForm.password.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">Password is required.</p>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-2 col-md-10\">\n              <div class=\"form-group\">\n                <div>\n                  <button type=\"submit\" class=\"btn btn-main grow\">Sign in</button>\n                  &nbsp; or&nbsp;\n                  <a a ui-sref=\"authentication.signup\">Sign up</a>\n                </div>\n                <div class=\"forgot-password\">\n                  <a ui-sref=\"password.forgot\">Forgot your password?</a>\n                </div>\n                <uib-alert type=\"danger\" data-ng-show=\"error\" class=\"text-center text-danger\">\n                  <span data-ng-bind=\"error\"></span>\n                </uib-alert>\n              </div>\n            </div>\n          </div>\n\n\n        </fieldset>\n      </form>\n    </div>\n  </div>\n</section>\n\n\n\n\n\n  <div class=\"row\" data-ng-show=\"signInBeforeProject && !closeWarning\">\n    <div class=\"col-md-12\">\n      <div class=\"sign-in-warning\">\n        <div class=\"pull-right\" data-ng-click=\"closeWarning = !closeWarning\">X</div>\n        <div>\n          <p>You need to sign in before you create a project.</p>\n          <p>If you have not registered yet, it\'s quick. <a href=\"/signup\">Register here</a>.</p>\n        </div>\n      </div>\n    </div>\n  </div>\n');
		$templateCache.put('modules/users/views/authentication/signup.client.view.html', '<section ng-controller=\"AuthenticationController\" class=\"main-content-inner\">\n  <h3 class=\"col-md-12 text-center\">Or sign up using your email</h3>\n  <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-4 col-md-4\">\n    <form name=\"userForm\" ng-submit=\"signup(userForm.$valid)\" class=\"signin\" novalidate autocomplete=\"off\">\n      <fieldset>\n        <div class=\"form-group\" show-errors>\n          <label for=\"firstName\">First Name</label>\n          <input type=\"text\" id=\"firstName\" name=\"firstName\" class=\"form-control\" ng-model=\"credentials.firstName\"\n                 placeholder=\"First Name\" required>\n\n          <div ng-messages=\"userForm.firstName.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">First name is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"lastName\">Last Name</label>\n          <input type=\"text\" id=\"lastName\" name=\"lastName\" class=\"form-control\" ng-model=\"credentials.lastName\"\n                 placeholder=\"Last Name\" required>\n\n          <div ng-messages=\"userForm.lastName.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Last name is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"email\">Email</label>\n          <input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" ng-model=\"credentials.email\" placeholder=\"Email\" required>\n          <div ng-messages=\"userForm.email.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Email address is required.</p>\n            <p class=\"help-block error-text\" ng-message=\"email\">Email address is invalid.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"username\">Username</label>\n          <input type=\"text\" id=\"username\" name=\"username\" class=\"form-control\" ng-model=\"credentials.username\" required>\n          <div ng-messages=\"userForm.username.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Username is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"password\">Password</label>\n            <input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" ng-model=\"credentials.password\" placeholder=\"Password\" popover=\"{{popoverMsg}}\" popover-trigger=\"focus\" password-validator required>\n          <div ng-messages=\"userForm.password.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Password is required.</p>\n            <div ng-repeat=\"passwordError in passwordErrors\">\n              <p class=\"help-block error-text\" ng-show=\"userForm.password.$error.requirements\">{{passwordError}}</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"form-group\" ng-show=\"!userForm.password.$error.required\">\n        <!--<label>Password Strength</label>-->\n        <!--<progressbar value=\"strengthProgress\" type=\"{{strengthColor}}\"><span-->\n        <!--style=\"color:white; white-space:nowrap;\">{{strengthProgress}}%</span></progressbar>-->\n        <!--</div>-->\n\n\n        <!--<div class=\"form-group\" ng-show=\"!userForm.password.$pristine\">-->\n        <div class=\"form-group\">\n\n          <div class=\"row\">\n\n            <div class=\"col-md-6\">\n          <label>Password Requirements</label>\n          <progressbar value=\"requirementsProgress\" type=\"{{requirementsColor}}\"><span style=\"color:white; white-space:nowrap;\">{{requirementsProgress}}%</span></progressbar>\n        </div>\n        <div class=\"text-center form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Sign up</button>\n          &nbsp; or&nbsp;\n          <a ui-sref=\"authentication.signin\" class=\"show-signup\">Sign in</a>\n        </div>\n        <div ng-show=\"error\" class=\"text-center text-danger\">\n          <strong ng-bind=\"error\"></strong>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</section>\n\n\n<div class=\"row\" data-ng-show=\"signInBeforeProject && !closeWarning\">\n  <div class=\"col-md-12\">\n    <div class=\"sign-in-warning\">\n      <div class=\"pull-right\" data-ng-click=\"closeWarning = !closeWarning\">X</div>\n      <div>\n        <p>You need to sign up before you create a project.</p>\n\n        <p>If you\'ve already registered, <a href=\"//signin\">sign in here</a>.</p>\n      </div>\n    </div>\n  </div>\n</div>\n\n<h1 class=\"page-header col-md-12 text-center\">Sign Up</h1>\n\n<div class=\"row\">\n\n  <div class=\"col-md-12\">\n\n    <h3>... with your social accounts</h3>\n\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <a href=\"/auth/facebook\" class=\"undecorated-link\">\n          <i class=\"fa fa-facebook\"></i>\n          <img src=\"/modules/users/img/buttons/facebook.png\">\n        </a>\n        <a href=\"/auth/twitter\" class=\"undecorated-link\">\n          <img src=\"/modules/users/img/buttons/twitter.png\">\n          <i class=\"fa fa-twitter\"></i>\n        </a>\n\n      </div>\n    </div>\n\n    <span>\n        <div class=\"signup-email\" data-ng-click=\"toggleSignup = !toggleSignup\"\n             data-ng-class=\"{\'carot-down\': toggleSignup}\">\n          ... or click here to sign up with your email address <i class=\"fa fa-chevron-right\"\n                                                                  data-ng-show=\"!toggleSignup\"></i><i\n          class=\"fa fa-chevron-down\" data-ng-show=\"toggleSignup\"></i>\n        </div>\n    </span>\n\n\n    <form name=\"userForm\" data-ng-submit=\"signup()\" class=\"signin form-horizontal\" novalidate autocomplete=\"off\"\n          data-ng-show=\"toggleSignup\">\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <!--<div class=\"col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2\">-->\n          <!--<form name=\"userForm\" data-ng-submit=\"signup()\" class=\"signin form-horizontal\" novalidate autocomplete=\"off\">-->\n          <fieldset>\n            <div class=\"form-group\"></div>\n\n            <div class=\"row\"> <!-- Row #1 -->\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.firstName}\">\n                    <input class=\"input_field input_field-secondary\" type=\"text\"\n                           id=\"firstName\"\n                           data-ng-model=\"credentials.firstName\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"firstName\">\n                      <span class=\"input_label-content input_label-content-secondary\">First Name</span>\n                    </label>\n                </span>\n              </div>\n\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.lastName}\">\n                    <input class=\"input_field input_field-secondary\" type=\"text\"\n                           id=\"lastName\" data-ng-model=\"credentials.lastName\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"lastName\">\n                      <span class=\"input_label-content input_label-content-secondary\">Last Name</span>\n                    </label>\n                </span>\n              </div>\n            </div>\n\n            <div class=\"row\"> <!-- Row #2 -->\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.email}\">\n                    <input class=\"input_field input_field-secondary\" type=\"text\" id=\"email\"\n                           data-ng-model=\"credentials.email\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"email\">\n                      <span\n                        class=\"input_label-content input_label-content-secondary\">E-mail</span>\n                    </label>\n                </span>\n              </div>\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.userZip}\">\n                    <input class=\"input_field input_field-secondary\" type=\"userZip\"\n                           id=\"userZip\"\n                           data-ng-model=\"credentials.userZip\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"userZip\">\n                      <span class=\"input_label-content input_label-content-secondary\">Zip Code</span>\n                    </label>\n                </span>\n              </div>\n            </div>\n\n            <div class=\"row\"> <!-- Row #3 -->\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.username.value}\">\n                    <input class=\"input_field input_field-secondary\" type=\"text\"\n                           id=\"username\" data-ng-model=\"credentials.username\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"username\">\n                      <span class=\"input_label-content input_label-content-secondary\">Username</span>\n                    </label>\n                </span>\n              </div>\n              <div class=\"col-md-6\">\n                <span class=\"input input-secondary\"\n                      data-ng-class=\"{\'input-filled\': credentials.password}\">\n                    <input class=\"input_field input_field-secondary\" type=\"password\"\n                           id=\"password\"\n                           data-ng-model=\"credentials.password\"/>\n                    <label class=\"input_label input_label-secondary\" for=\"password\">\n                      <span class=\"input_label-content input_label-content-secondary\">Password</span>\n                    </label>\n                </span>\n              </div>\n            </div>\n\n            <div class=\"row\">  <!-- Row #4 -->\n              <div class=\"col-md-12\">\n                <div id=\"check-awesome\" class=\"form-group filter first-filter\">\n                  <input type=\"checkbox\" name=\"filters\" id=\"newsletter\" value=\"newsletter\"\n                         data-ng-model=\"credentials.newsletter\">\n                  <label for=\"newsletter\">\n                    <span class=\"check\"></span>\n                    <span class=\"box\"></span>\n                    Subscribe to our quarterly e-newsletter\n                  </label>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col-xs-4\">\n                <div class=\"form-group\">\n                  <div>\n                    <button type=\"submit\" class=\"btn btn-main grow\">Sign up</button>\n                    &nbsp; or&nbsp;\n                    <a href=\"//signin\" class=\"show-signup\">Sign in</a>\n                  </div>\n                  <div class=\"forgot-password\">\n                    <a href=\"//password/forgot\">Forgot your password?</a>\n                  </div>\n                  <div data-ng-show=\"error\" class=\"text-center text-danger\">\n                    <strong data-ng-bind=\"error\"></strong>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </fieldset>\n\n        </div>\n      </div>\n\n    </form>\n  </div>\n</div>\n');
		$templateCache.put('modules/users/views/contributors/contributors.client.list.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n      <section data-ng-controller=\"ContributorController\" data-ng-init=\"init()\" class=\"contributors\">\n        <div class=\"contrib\">\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <div class=\"main-content-inner\">\n\n                <div class=\"row\">\n                  <div><h1 class=\"col-md-6\">Contributors</h1></div>\n\n                  <div class=\"col-md-6 search-input-div\">\n                    <span class=\"input input-secondary pull-right\">\n                        <input class=\"input_field input_field-secondary\" type=\"text\" id=\"search\"\n                               data-ng-model=\"searchContributors\"/>\n                        <label class=\"input_label input_label-secondary\" for=\"search\">\n                          <span class=\"input_label-content input_label-content-secondary\">Search Contributors</span>\n                        </label>\n                    </span>\n                  </div>\n                </div>\n\n                <div class=\"row\">\n\n                  <ul id=\"grid-view\">\n                    <a ng-click=\"openLightboxModal($index)\" data-ng-repeat=\"contributor in contributors | filter:searchContributors\" class=\"col-md-3\">\n                      <li>\n                        <div>\n                            <img ng-src=\"{{contributor.profileImageURL}}\" class=\"img-thumbnail\">\n                            <p>{{contributor.firstName}} {{contributor.lastName}}</p>\n                        </div>\n                      </li>\n                    </a>\n                  </ul>\n\n\n                </div>\n              </div>\n\n            </div>\n          </div>\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/users/views/contributors/contributors.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n      <section data-ng-controller=\"ContributorController\" data-ng-init=\"findContributor()\" class=\"contributors\">\n        <div class=\"contrib-view\">\n          <div class=\"row\">\n            <div class=\"col-md-12\">\n              <div class=\"main-content-inner\">\n\n                <div class=\"row\">\n                  <div><h1 class=\"col-md-6\">{{contributor.firstName}} {{contributor.lastName}}</h1></div>\n                  <div><img class=\"col-md-6 pull-right\" data-ng-src=\"{{contributor.profileImageURL}}\"/></div>\n                </div>\n\n                <div class=\"row\">\n                  <div><p class=\"col-md-12\">{{contributor.bio}}</p></div>\n                </div>\n\n                <hr/>\n\n                <h4>Other Projects by {{contributor.firstName}}</h4>\n                <div class=\"row\">\n                  <div><p class=\"col-md-12\" data-ng-repeat=\"contributorProject in contributorProjects\"><a data-ng-href=\"/projects/{{contributorProject._id}}\">\n                    {{contributorProject.title}}\n                    </a>\n                  </p></div>\n                </div>\n\n\n                <!--<div class=\"row\">-->\n\n                  <!--<ul id=\"grid-view\">-->\n                    <!--<a ng-click=\"openLightboxModal($index)\" data-ng-repeat=\"contributor in contributors | filter:searchContributors\" class=\"col-md-3\">-->\n                      <!--<li>-->\n                        <!--<div>-->\n                            <!--<img ng-src=\"{{contributor.profileImageURL}}\" class=\"img-thumbnail\">-->\n                            <!--<p>{{contributor.firstName}} {{contributor.lastName}}</p>-->\n                        <!--</div>-->\n                      <!--</li>-->\n                    <!--</a>-->\n                  <!--</ul>-->\n\n\n                <!--</div>-->\n              </div>\n\n            </div>\n          </div>\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/users/views/contributors/lightbox.html', '<section data-ng-controller=\"ContributorController\">\n  <div class=\"modal-body\" id=\"lightbox-modal\"\n       ng-swipe-left=\"Lightbox.nextImage()\"\n       ng-swipe-right=\"Lightbox.prevImage()\">\n\n    <div class=lightbox-nav>\n      <button class=close aria-hidden=true ng-click=$dismiss()>×</button>\n      <div class=btn-group>\n        <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.prevImage()><i class=\"fa fa-chevron-left\"></i></a>\n        <a ng-href={{Lightbox.imageUrl}} target=_blank class=\"btn btn-xs btn-default\" title=\"Open in new tab\">Open image\n          in new tab</a>\n        <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.nextImage()><i class=\"fa fa-chevron-right\"></i></a>\n      </div>\n    </div>\n\n    <!-- image -->\n    <div class=\"lightbox-image-container\">\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n\n\n          <div class=lightbox-image-caption>\n            <div><img lightbox-src=\"{{Lightbox.imageUrl}}\"></div>\n\n            <div>{{Lightbox.imageCaption}}</div>\n          </div>\n\n        </div>\n      </div>\n\n    </div>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/password/forgot-password.client.view.html', '<section class=\"row\" ng-controller=\"PasswordController\">\n  <h3 class=\"col-md-12 text-center\">Restore your password</h3>\n  <p class=\"small text-center\">Enter your account username.</p>\n  <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2\">\n    <form name=\"forgotPasswordForm\" ng-submit=\"askForPasswordReset(forgotPasswordForm.$valid)\" class=\"form-horizontal\" novalidate autocomplete=\"off\">\n      <fieldset>\n        <div class=\"form-group\" show-errors>\n          <input type=\"text\" id=\"username\" name=\"username\" class=\"form-control\" ng-model=\"credentials.username\" placeholder=\"Username\" lowercase required>\n          <div ng-messages=\"forgotPasswordForm.username.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Enter a username.</p>\n          </div>\n        </div>\n        <div class=\"text-center form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n        <div ng-show=\"error\" class=\"text-center text-danger\">\n          <strong ng-bind=\"error\"></strong>\n        </div>\n        <div ng-show=\"success\" class=\"text-center text-success\">\n          <strong ng-bind=\"success\"></strong>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/password/reset-password-invalid.client.view.html', '<section class=\"row text-center\">\n  <h3 class=\"col-md-12\">Password reset is invalid</h3>\n  <a ui-sref=\"password.forgot\" class=\"col-md-12\">Ask for a new password reset</a>\n</section>\n');
		$templateCache.put('modules/users/views/password/reset-password-success.client.view.html', '<section class=\"row text-center\">\n  <h3 class=\"col-md-12\">Password successfully reset</h3>\n  <a ui-sref=\"home\" class=\"col-md-12\">Continue to home page</a>\n</section>\n');
		$templateCache.put('modules/users/views/password/reset-password.client.view.html', '<section class=\"row\" ng-controller=\"PasswordController\">\n  <h3 class=\"col-md-12 text-center\">Reset your password</h3>\n  <div class=\"col-xs-offset-2 col-xs-8 col-md-offset-4 col-md-4\">\n    <form name=\"resetPasswordForm\" ng-submit=\"resetUserPassword(resetPasswordForm.$valid)\" class=\"signin form-horizontal\" novalidate autocomplete=\"off\">\n      <fieldset>\n        <div class=\"form-group\" show-errors>\n          <label for=\"newPassword\">New Password</label>\n          <input type=\"password\" id=\"newPassword\" name=\"newPassword\" class=\"form-control\" ng-model=\"passwordDetails.newPassword\" placeholder=\"New Password\" autocomplete=\"new-password\" popover=\"{{popoverMsg}}\" popover-trigger=\"focus\" popover-placement=\"top\" password-validator required>\n          <div ng-messages=\"resetPasswordForm.newPassword.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Enter a new password.</p>\n            <div ng-repeat=\"passwordError in passwordErrors\">\n              <p class=\"help-block error-text\" ng-show=\"resetPasswordForm.newPassword.$error.requirements\">{{passwordError}}</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"verifyPassword\">Verify Password</label>\n          <input type=\"password\" id=\"verifyPassword\" name=\"verifyPassword\" class=\"form-control\" ng-model=\"passwordDetails.verifyPassword\" placeholder=\"Verify Password\" password-verify=\"passwordDetails.newPassword\" required>\n          <div ng-messages=\"resetPasswordForm.verifyPassword.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Enter the password again to verify.</p>\n            <p class=\"help-block error-text\" ng-show=resetPasswordForm.verifyPassword.$error.passwordVerify>Passwords do not match.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" ng-show=\"!resetPasswordForm.newPassword.$error.required\">\n          <label>Password Requirements</label>\n          <progressbar value=\"requirementsProgress\" type=\"{{requirementsColor}}\"><span style=\"color:white; white-space:nowrap;\">{{requirementsProgress}}%</span></progressbar>\n        </div>\n        <div class=\"text-center form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Update Password</button>\n        </div>\n        <div ng-show=\"error\" class=\"text-center text-danger\">\n          <strong ng-bind=\"error\"></strong>\n        </div>\n        <div ng-show=\"success\" class=\"text-center text-success\">\n          <strong ng-bind=\"success\"></strong>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/settings/change-password.client.view.html', '<section class=\"row\" ng-controller=\"ChangePasswordController\">\n  <div class=\"col-xs-offset-1 col-xs-10 col-md-offset-4 col-md-4\">\n    <form name=\"passwordForm\" ng-submit=\"changeUserPassword(passwordForm.$valid)\" class=\"signin\" novalidate autocomplete=\"off\">\n      <fieldset>\n        <div class=\"form-group\" show-errors>\n          <label for=\"currentPassword\">Current Password</label>\n          <input type=\"password\" id=\"currentPassword\" name=\"currentPassword\" class=\"form-control\" ng-model=\"passwordDetails.currentPassword\" placeholder=\"Current Password\" required>\n          <div ng-messages=\"passwordForm.currentPassword.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Your current password is required.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"newPassword\">New Password</label>\n          <input type=\"password\" id=\"newPassword\" name=\"newPassword\" class=\"form-control\" ng-model=\"passwordDetails.newPassword\" placeholder=\"New Password\" popover=\"{{popoverMsg}}\" popover-trigger=\"focus\" password-validator required>\n          <div ng-messages=\"passwordForm.newPassword.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Enter a new password.</p>\n            <div ng-repeat=\"passwordError in passwordErrors\">\n              <p class=\"help-block error-text\" ng-show=\"passwordForm.newPassword.$error.requirements\">{{passwordError}}</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"form-group\" show-errors>\n          <label for=\"verifyPassword\">Verify Password</label>\n          <input type=\"password\" id=\"verifyPassword\" name=\"verifyPassword\" class=\"form-control\" ng-model=\"passwordDetails.verifyPassword\" placeholder=\"Verify Password\" password-verify=\"passwordDetails.newPassword\" required>\n          <div ng-messages=\"passwordForm.verifyPassword.$error\" role=\"alert\">\n            <p class=\"help-block error-text\" ng-message=\"required\">Verify your new password.</p>\n            <p class=\"help-block error-text\" ng-show=passwordForm.verifyPassword.$error.passwordVerify>Passwords do not match.</p>\n          </div>\n        </div>\n        <div class=\"form-group\" ng-show=\"!passwordForm.newPassword.$error.required\">\n          <label>Password Requirements</label>\n          <progressbar value=\"requirementsProgress\" type=\"{{requirementsColor}}\"><span style=\"color:white; white-space:nowrap;\">{{requirementsProgress}}%</span></progressbar>\n        </div>\n        <div class=\"text-center form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Save Password</button>\n        </div>\n        <div ng-show=\"success\" class=\"text-center text-success\">\n          <strong>Password Changed Successfully</strong>\n        </div>\n        <div ng-show=\"error\" class=\"text-center text-danger\">\n          <strong ng-bind=\"error\"></strong>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/settings/change-profile-picture.client.view.html', '<section class=\"row\" ng-controller=\"ChangeProfilePictureController\" data-ng-init=\"init();\">\n\n  <div class=\"file-upload\">\n\n  <div class=\"col-xs-offset-1 col-xs-10 col-md-offset-1 col-md-8\">\n\n    <!--<h4>Upload on file select</h4>-->\n    <!--<button type=\"file\" ngf-select=\"uploadFiles($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"3000\" ngf-max-size=\"5MB\">-->\n      <!--Select File</button>-->\n    <!--<br><br>-->\n    <!--File:-->\n    <!--<div>{{f.name}} {{errFile.name}} {{errFile.$error}} {{errFile.$errorParam}}-->\n      <!--<span class=\"progress\" ng-show=\"f.progress >= 0\">-->\n          <!--<div style=\"width:{{f.progress}}%\" ng-bind=\"f.progress + \'%\'\"></div>-->\n      <!--</span>-->\n    <!--</div>-->\n    <!--{{errorMsg}}-->\n\n\n\n    <!--<a data-ng-repeat=\"file in listOfImages\" data-ng-href=\"{{file.imagepath}}{{file.imagename}}\" class=\"list-group-item\">-->\n      <!--<img data-ng-src=\"{{imageURL}}\" />-->\n    <!--</a>-->\n\n    <img data-ng-src=\"{{user.profileImage}}\" class=\"img-thumbnail user-profile-picture\"/>\n\n    <div>\n        <button type=\"file\" class=\"btn btn-main btn-footer-overlay grow\" data-ng-hide=\"uploading\" ngf-select ngf-change=\"onFileSelect($files)\">Choose File</button>\n    </div>\n\n    <!--<button class=\"button\" ng-file-select ngf-select ngf-change=\"onFileSelect($files)\">Upload on file change</button>-->\n\n    <button data-ng-click=\"abort();\" data-ng-hide=\"!uploading\" class=\"btn btn-main btn-footer-overlay grow\" >Cancel</button>\n\n    <!--Drop File:-->\n    <div ngf-file-drop ng-model=\"files\" class=\"drop-box\" ngf-select ngf-change=\"onFileSelect($files)\" drag-over-class=\"dragover\" ngf-multiple=\"true\" allow-dir=\"true\" accept=\".jpg,.png,.pdf\" data-ng-hide=\"uploading\">\n      Drop Images or PDFs Files Here\n    </div>\n\n    <div ngf-no-file-drop data-ng-hide=\"uploading\" class=\"drag-drop-alert\">File Drag/Drop is not supported for this browser</div>\n\n\n\n    <!--<form name=\"profileImg\" class=\"signin form-horizontal\">-->\n      <!--<fieldset>-->\n\n\n        <!--<div class=\"form-group text-center\">-->\n          <!--<img ng-src=\"{{imageURL}}\" alt=\"{{user.displayName}}\" class=\"img-thumbnail user-profile-picture\">-->\n          <!--Image thumbnail: <img ngf-thumbnail=\"file || \'/thumb.jpg\'\">-->\n        <!--</div>-->\n\n        <!--<legend>Upload on form submit</legend>-->\n        <!--Username:-->\n        <!---->\n        <!--<input type=\"text\" name=\"userName\" ng-model=\"username\" size=\"31\" required>-->\n\n        <!--<i ng-show=\"profileImg.userName.$error.required\">*required</i>-->\n\n        <!--<br>-->\n\n        <!--Photo:-->\n        <!--<input type=\"file\" ngf-select ng-model=\"picFile\" name=\"file\" accept=\"image/*\" ngf-max-size=\"2MB\" required>-->\n\n        <!--<i ng-show=\"profileImg.file.$error.required\">*required</i>-->\n\n        <!--<br>-->\n\n        <!--<i ng-show=\"profileImg.file.$error.maxSize\">File too large {{picFile.size / 1000000|number:1}}MB: max 2M</i>-->\n\n        <!--<img ng-show=\"myForm.file.$valid\" ngf-thumbnail=\"picFile\" class=\"thumb\">-->\n        <!--<button ng-click=\"picFile = null\" ng-show=\"picFile\">Remove</button>-->\n\n        <!--<br>-->\n\n        <!--<button ng-disabled=\"!myForm.$valid\" data-ng-click=\"uploadPic(picFile)\">Submit</button>-->\n\n        <span class=\"progress\" ng-show=\"picFile.progress >= 0\">\n          <div style=\"width:{{picFile.progress}}%\" ng-bind=\"picFile.progress + \'%\'\"></div>\n        </span>\n\n        <!--<span ng-show=\"picFile.result\">Upload Successful</span>-->\n        <!--<span class=\"err\" ng-show=\"errorMsg\">{{errorMsg}}</span>-->\n\n        <!--<div ng-show=\"success\" class=\"text-center text-success\">-->\n          <!--<strong>Profile Picture Changed Successfully</strong>-->\n        <!--</div>-->\n\n        <!--<div ng-show=\"error\" class=\"text-center text-danger\">-->\n          <!--<strong ng-bind=\"error\"></strong>-->\n        <!--</div>-->\n\n\n      <!--</fieldset>-->\n    <!--</form>-->\n  </div>\n\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/settings/edit-profile.client.view.html', '<section data-ng-controller=\"EditProfileController\" class=\"row\">\n    <div class=\"col-xs-offset-1 col-xs-10 col-md-offset-4 col-md-4\">\n      <form name=\"userForm\" ng-submit=\"updateUserProfile(userForm.$valid)\" class=\"signin\" novalidate autocomplete=\"off\">\n            \n        <fieldset>\n          <div class=\"form-group\" show-errors>\n            <label for=\"firstName\">First Name</label>\n          <input type=\"text\" id=\"firstName\" name=\"firstName\" class=\"form-control\" ng-model=\"user.firstName\" placeholder=\"First Name\" required>\n            <div ng-messages=\"userForm.firstName.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">First name is required.</p>\n            </div>\n          </div>\n          <div class=\"form-group\" show-errors>\n            <label for=\"lastName\">Last Name</label>\n          <input type=\"text\" id=\"lastName\" name=\"lastName\" class=\"form-control\" ng-model=\"user.lastName\" placeholder=\"Last Name\" required>\n            <div ng-messages=\"userForm.lastName.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">Last name is required.</p>\n            </div>\n          </div>\n          <div class=\"form-group\" show-errors>\n            <label for=\"email\">Email</label>\n          <input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" ng-model=\"user.email\" placeholder=\"Email\" required>\n            <div ng-messages=\"userForm.email.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">Email address is required.</p>\n              <p class=\"help-block error-text\" ng-message=\"email\">Email address is invalid.</p>\n            </div>\n          </div>\n          <div class=\"form-group\" show-errors>\n            <label for=\"username\">Username</label>\n          <input type=\"text\" id=\"username\" name=\"username\" class=\"form-control\" ng-model=\"user.username\" placeholder=\"Username\" required>\n            <div ng-messages=\"userForm.username.$error\" role=\"alert\">\n              <p class=\"help-block error-text\" ng-message=\"required\">Username is required.</p>\n            </div>\n          </div>\n          <div class=\"text-center form-group\">\n            <button type=\"submit\" class=\"btn btn-primary\">Save Profile</button>\n          </div>\n          <div ng-show=\"success\" class=\"text-center text-success\">\n            <strong>Profile Saved Successfully</strong>\n          </div>\n          <div ng-show=\"error\" class=\"text-center text-danger\">\n            <strong ng-bind=\"error\"></strong>\n          </div>\n        </fieldset>\n      </form>\n    </div>\n</section>\n');
		$templateCache.put('modules/users/views/settings/favorites.client.view.html', '<section data-ng-controller=\"UserController\" class=\"row\" style=\"height: 600px;\" data-ng-init=\"findUserFavorites()\">\n\n  <div class=\"user-submissions\">\n\n    <div class=\"list-group\">\n      <div class=\"row\">\n\n        <a data-ng-repeat=\"userFavorite in userFavorites\" ui-sref=\"viewProject({projectId: userFavorite.id})\"\n           class=\"col-md-12 admin-list\">\n          <div class=\"row\">\n\n            <div class=\"col-md-2\">\n              <img data-ng-src=\"{{userFavorite.mainImgThumbnail}}\"/>\n            </div>\n\n            <div class=\"col-md-9\">\n              <h4 class=\"list-group-item-heading\" data-ng-bind=\"userFavorite.title\"></h4>\n              <small>\n                <span>{{userFavorite.user.firstName}} {{userFavorite.user.lastName}}</span>\n              </small>\n\n            </div>\n            <div class=\"col-md-1\">\n              <i class=\"fa fa-times pull-right\" data-ng-click=\"removeFavProject(userFavorite.id)\" style=\"color: rgba(2,58,49,0.4);\"></i>\n            </div>\n          </div>\n        </a>\n\n      </div>\n    </div>\n\n  </div>\n\n</section>\n');
		$templateCache.put('modules/users/views/settings/manage-social-accounts.client.view.html', '<section class=\"row\" ng-controller=\"SocialAccountsController\">\n  <h3 class=\"col-md-12 text-center\" ng-show=\"hasConnectedAdditionalSocialAccounts()\">Connected social accounts:</h3>\n  <div class=\"col-md-12 text-center\">\n    <div ng-repeat=\"(providerName, providerData) in user.additionalProvidersData\" class=\"social-account-container\">\n      <img ng-src=\"/modules/users/client/img/buttons/{{providerName}}.png\">\n      <a class=\"btn btn-danger btn-remove-account\" ng-click=\"removeUserSocialAccount(providerName)\">\n        <i class=\"glyphicon glyphicon-trash\"></i>\n      </a>\n    </div>\n  </div>\n  <h3 class=\"col-md-12 text-center\" ng-show=\"hasConnectedAdditionalSocialAccounts()\">Unconnected social accounts:</h3>\n  <div class=\"col-md-12 text-center\">\n    <div class=\"social-account-container\" ng-hide=\"isConnectedSocialAccount(\'facebook\')\">\n      <img ng-src=\"/modules/users/client/img/buttons/facebook.png\">\n      <a class=\"btn btn-success btn-remove-account\" href=\"/api/v1/auth/facebook\" target=\"_self\">\n        <i class=\"glyphicon glyphicon-plus\"></i>\n      </a>\n    </div>\n    <div class=\"social-account-container\" ng-hide=\"isConnectedSocialAccount(\'twitter\')\">\n      <img ng-src=\"/modules/users/client/img/buttons/twitter.png\">\n      <a class=\"btn btn-success btn-remove-account\" href=\"/api/v1/auth/twitter\" target=\"_self\">\n        <i class=\"glyphicon glyphicon-plus\"></i>\n      </a>\n    </div>\n  </div>\n</section>\n');
		$templateCache.put('modules/users/views/settings/settings.client.view.html', '<secondary-menu-directive></secondary-menu-directive>\n<section class=\"content background\" data-ng-controller=\"RandomMapController\"\n         ng-style=\"{\'background-image\': \'url(\' + staticMap.mapUrl + \')\', \'background-size\' : \'cover\' }\"\n         data-ng-class=\"{\'page-view-menu-open\': toggleSecondMenu}\">\n\n  <section class=\"container\">\n    <a href=\"/\" class=\"small-main-logo logo-on-page logo-second-page img-responsive\"></a>\n\n    <div class=\"main-content-outer\">\n\n      <section ng-controller=\"UserController\" class=\"main-content-inner\">\n        <div class=\"page-header\">\n          <h1>Settings</h1>\n        </div>\n        <div class=\"row\">\n          <nav class=\"col-sm-3 col-md-3\">\n            <ul class=\"nav nav-pills nav-stacked\">\n              <li ui-sref-active=\"active\">\n                <a ui-sref=\"settings.profile\">Edit Profile</a>\n              </li>\n              <li ui-sref-active=\"active\">\n                <a ui-sref=\"settings.picture\">Change Profile Picture</a>\n              </li>\n              <li ui-sref-active=\"active\" ng-show=\"user.provider === \'local\'\">\n                <a ui-sref=\"settings.password\">Change Password</a>\n              </li>\n              <li ui-sref-active=\"active\">\n                <a ui-sref=\"settings.accounts\">Manage Social Accounts</a>\n              </li>\n              <li ui-sref-active=\"active\">\n                <a ui-sref=\"settings.favorites\">Favorite Projects</a>\n              </li>\n              <li ui-sref-active=\"active\">\n                <a ui-sref=\"settings.submissions\">Current Submissions</a>\n              </li>\n            </ul>\n          </nav>\n          <div class=\"col-sm-9 col-md-8 settings-view\">\n            <div ui-view></div>\n          </div>\n        </div>\n      </section>\n    </div>\n  </section>\n</section>\n');
		$templateCache.put('modules/users/views/settings/submissions-list.client.view.html', '<section data-ng-controller=\"UserController\" class=\"row\" style=\"height: 600px;\" data-ng-init=\"findCurrentUserSubmissions()\">\n\n  <div class=\"user-submissions\">\n\n    <div class=\"list-group\">\n      <div class=\"row\">\n\n        <a data-ng-repeat=\"userProject in userProjects\" ui-sref=\"settings.submissionsView({projectId: userProject.id})\"\n           class=\"col-md-12 admin-list\">\n          <div class=\"row\">\n\n            <div class=\"col-md-2\">\n              <img data-ng-src=\"{{userProject.mainImgThumbnail}}\"/>\n            </div>\n\n            <div class=\"col-md-10\">\n              <h4 class=\"list-group-item-heading\" data-ng-bind=\"userProject.title\"></h4>\n              <small>\n                Submitted on <span data-ng-bind=\"userProject.createdOn | date:\'medium\'\"></span>\n                <div data-ng-bind=\"userProject.id\"></div>\n              </small>\n\n            </div>\n\n          </div>\n        </a>\n\n      </div>\n    </div>\n\n  </div>\n\n</section>\n\n\n<!--<section data-ng-controller=\"UserController\" class=\"row\" style=\"height: 600px;\" data-ng-init=\"findCurrentUserSubmissions()\">-->\n\n  <!--<div class=\"user-submissions\">-->\n\n    <!--<div class=\"list-group\">-->\n      <!--<div class=\"row\">-->\n\n        <!--<a data-ng-repeat=\"userProject in userProjects\" ui-sref=\"settings.submissionsView({projectId: userProjects.id})\"-->\n           <!--class=\"col-md-12 admin-list\">-->\n          <!--<div class=\"row\">-->\n\n            <!--<div class=\"col-md-2\">-->\n              <!--<img data-ng-src=\"{{userProject.mainImgThumbnail}}\"/>-->\n            <!--</div>-->\n\n            <!--<div class=\"col-md-10\">-->\n              <!--<h4 class=\"list-group-item-heading\" data-ng-bind=\"userProject.title\"></h4>-->\n              <!--<small>-->\n                <!--Submitted on <span data-ng-bind=\"userProject.createdOn | date:\'medium\'\"></span>-->\n                <!--<div data-ng-bind=\"userProject.id\"></div>-->\n              <!--</small>-->\n\n            <!--</div>-->\n\n          <!--</div>-->\n        <!--</a>-->\n\n      <!--</div>-->\n    <!--</div>-->\n\n  <!--</div>-->\n\n<!--</section>-->\n\n\n<!--<user-submissions-list></user-submissions-list>-->\n');
		$templateCache.put('modules/users/views/settings/submissions-view.client.view.html', '<section class=\"row\" style=\"height: 600px;\">\n\n    <user-submissions-view></user-submissions-view>\n    <!--<project-status-overview></project-status-overview>-->\n\n    <!--http://localhost:3000/settings/5636e404ec3e7a2b81c3d1b9/status/-->\n\n</section>\n');	}
})();
