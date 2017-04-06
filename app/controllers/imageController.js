var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var fileParser = require('connect-multiparty')();
var secret = require('../../secret');
var Image = require('../models/image');
var isLoggedIn = require('../middlewares/isLoggedIn');
var authenticatedUsing = require('../helpers/authenticatedUsing');

cloudinary.config({
  cloud_name: secret.cloudinaryCloudName,
  api_key: secret.cloudinaryApiKey,
  api_secret: secret.cloudinaryApiSecret
});

//api to get all images of a user
router.get('/getall', isLoggedIn, function (req, res) {
  authUser = authenticatedUsing(req);
  Image.getAll(authUser.email, function (images) {
    return res.send(images);
  })
})

//api to upload the image to cloudinary server
router.post('/upload', isLoggedIn, fileParser, function (req, res) {
  console.log(req.files);
  var imageFile = req.files.cropped_image[0];

  cloudinary.uploader.upload(imageFile.path, function (result) {
    if (result.url) {
      console.log(result);
      return res.send(result);
    } else {
      console.log('Error uploading to cloudinary: ', result);
      res.send('did not get url');
    }
  });
});

//api to add image details to database
router.post('/addimage', isLoggedIn, function (req, res) {
  var imgId = req.body.imgId;
  var type = req.body.type;
  var imgUrl = req.body.imgUrl;
  var height = req.body.height;
  var width = req.body.width;
  authUser = authenticatedUsing(req);
  Image.addImage(imgId, type, imgUrl, height, width, authUser.email, function (imgDoc) {
    return res.send(imgDoc);
  })
});

module.exports = router;