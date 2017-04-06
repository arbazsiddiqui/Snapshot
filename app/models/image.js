var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  user: String,
  images: mongoose.Schema.Types.Mixed
});

var Image = mongoose.model('Image', imageSchema);

exports.getAll = function (email, callback) {
  Image.find({user: email}, function (err, docs) {
    if (err) {
      console.log(err);
      return callback(null)
    }
    return callback(docs)
  })
};

exports.addImage = function (imgId, type, imgUrl, height, width, email, callback) {
  if (type == 'horizontal') {
    var newImage = new Image();
    newImage.images = {};
    newImage.images[type] = {};
    newImage.images[type].url = imgUrl;
    newImage.images[type].height = height;
    newImage.images[type].width = width;
    newImage.user = email;
    newImage.save(function (err) {
      if (err)
        return callback(null);
      return callback(newImage)
    });
  }
  else {
    Image
      .findOne({_id: imgId})
      .exec(function (error, imgDoc) {
        if (error) {
          console.log(error);
          return callback(null)
        }
        if (!imgDoc) {
          return callback(null);
        }
        imgDoc.images[type] = {};
        imgDoc.images[type].url = imgUrl;
        imgDoc.images[type].height = height;
        imgDoc.images[type].width = width;

        imgDoc.markModified('images');
        imgDoc.save(function (err, savedDoc) {
          if (err) {
            console.error(err);
            return callback(null)
          }
          return callback(savedDoc)
        })
      })
  }
};

