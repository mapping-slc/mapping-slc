(function () {
  'use strict';

  angular
  .module('core')
  .service('getLists', getLists);

  getLists.$inject = [];


  function getLists() {
    return {

      listStates: function listStates() {
        return this.states = ('UT AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' + 'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX VT VA WA WV WI WY').split(' ').map(function (state) {
          return {abbrev: state};
        });
      },

      listPrefixes: function listPrefixes() {
        return this.roles = ['', 'Mr.', 'Ms.', 'Dr.']
        .map(function (prefix) {
          return {userPrefix: prefix};
        });
      },

      listRoles: function listRoles() {
        return this.roles = [
          { name: 'User', value: 'user' },
          { name: 'Blocked', value: 'blocked' },
          { name: 'Unregistered', value: 'unregistered' },
          { name: 'Registered', value: 'registered' },
          { name: 'Contributor', value: 'contributor' },
          { name: 'Admin', value: 'admin' },
          { name: 'Super Admin', value: 'superAdmin' },
        ]
        .map(function (role) {
          return {
            name: role.name,
            value: role.value
          };
        });
      },

      listStatuses: function listStatuses() {
        return this.statuses = [
          { auth: 'public', name: 'Received', value: 'received' },
          { auth: 'public', name: 'Pending', value: 'pending' },
          { auth: 'public', name: 'Rejected', value: 'rejected' },
          { auth: 'private', name: 'Soft Rejection', value: 'soft_rejection', publicName: '' },
          { auth: 'public', name: 'Revise', value: 'revise' },
          { auth: 'public', name: 'Pulled by User', value: 'userPulled' },
          { auth: 'private', name: 'Pulled by Admin', value: 'adminPull', publicName: '' },
          { auth: 'public', name: 'Published', value: 'published' },
          { auth: 'public', name: 'Accepted', value: 'accepted' }
        ]
        .map(function (status) {
          return {
            name: status.name,
            value: status.value,
            auth: status.auth
          };
        });
      },

      listCategories: function listCategories() {
        return this.categories = [
          { category: 'sortOrder', name: 'Essay', value: 'essay' },
          { category: 'sortOrder', name: 'Multimedia', value: 'multimedia' },
          { category: 'sortOrder', name: 'Video', value: 'video' },
          { category: 'sortOrder', name: 'Audio', value: 'audio' },
          { category: 'sortOrder', name: 'Photography', value: 'photography' },
          { category: 'sortOrder', name: 'This Was Here', value: 'this-was-here' }
        ];
        // .map(function (category) {
        //   return { category: category }
        // });
      },

      listProjectSorts: function listProjectSorts() {
        return this.projectSorts = [
          { category: 'sortOrder', name: 'Date Submitted', value: 'createdOn' },
          { category: 'sortOrder', name: 'Title', value: 'title' },
          { category: 'sortOrder', name: 'Author Name', value: 'user.lastName' },
          { category: 'sortOrder', name: 'Submission Status', value: 'status' }
        ];
      },

      listFeaturedProjects: function featuredProjects() {
        return this.featuredProjects = [
          { category: 'sortOrder', name: 'Featured', value: 'true' },
          { category: 'sortOrder', name: 'Not Featured', value: 'false' }
        ];
      },

      listYesNo: function listYesNo() {
        return this.yesNo = [
          { category: 'sortOrder', name: 'Yes', value: 'true' },
          { category: 'sortOrder', name: 'No', value: 'false' }
        ];
      }

    };
  }

  return getLists;

}());
