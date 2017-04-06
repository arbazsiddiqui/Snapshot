angular.module('imageService', [])
  .factory('Img', function ($http) {
    var imageFactory = {};

    imageFactory.getUser = function () {
      return $http.get('/me');
    };

    imageFactory.getAll = function () {
      return $http.get('/image/getall');
    };

    imageFactory.upload = function (blob) {
      formData = new FormData();
      formData.append("cropped_image[]", blob);
      return $http.post('/image/upload', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
    };

    imageFactory.addImage = function (body) {
      return $http.post('/image/addimage', body);
    };

    imageFactory.logout = function () {
      return $http.post('/logout');
    };
    
    return imageFactory;
  });
