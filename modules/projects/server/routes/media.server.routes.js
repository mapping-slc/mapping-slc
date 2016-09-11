'use strict';

module.exports = function (app) {
  let express = require('express'),
      router = express.Router(),
      createMedia = require('../controllers/media.post.server.controller.js'),
      updateMedia = require('../controllers/media.put.server.controller.js'),
      getMedia = require('../controllers/media.get.server.controller.js'),
      deleteMedia = require('../controllers/media.delete.server.controller.js'),
      projects = require('../controllers/projects.server.controller.js'),
      middleware = require('../controllers/projects.server.middleware.js'),
      wysiwyg = require('../controllers/wysiwygUploader.server.middleware.js');

  let baseUrl = '/api/v1/projects';
  let imagesApi = baseUrl + '/:projectId/images';
  let videosApi = baseUrl + '/:projectId/videos';


  // Single project routes for different genres

  app.route(videosApi)
    .get(getMedia.findOneVideoId);

  app.route(imagesApi)
    .get(getMedia.getImagesByProjectId)
    .post(middleware.parseFileUpload, middleware.configFileData, middleware.configS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages)
    .patch(updateMedia.setDefaultImage)
    .delete(deleteMedia.deleteImagesByBucket);

  app.route('/api/v1/users/:userId/images')
    .post(middleware.parseFileUpload, middleware.configFileData, middleware.configS3Obj, middleware.mongoObjUserImg, createMedia.uploadProjectImages);

  app.route('/api/v1/projects/:projectId/images/wysiwyg')
    .post(middleware.parseFileUpload, middleware.configFileData, wysiwyg.wysiwygS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages);

  app.route(imagesApi + '/:imageId')
    .get(getMedia.getImageByImageId)
    .delete(deleteMedia.deleteImageByImageId);

  app.route(imagesApi + '/default')
    .get(getMedia.getDefaultImageByProjectId);


  //mount the router on the app
  app.use('/', router);


};
