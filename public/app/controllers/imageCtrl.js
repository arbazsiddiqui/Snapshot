angular.module('imageCtrl', [])
  .controller('ImageController', function ($scope, $rootScope, $window, Img) {

    $scope.uploadFlag = 0;
    $scope.helperText = "Preview";
    var _URL = window.URL || window.webkitURL;
    var crop_max_width = 1024;
    var crop_max_height = 1024;

    Img.getUser()
      .success(function (data) {
        $rootScope.user = data;
      });

    Img.getAll()
      .success(function (data) {
        $scope.images = data;
      });

    $scope.displayImages = function (imgID) {
      for (i = 0; i < $scope.images.length; i++) {
        console.log($scope.images[i]._id);
        console.log(imgID)
        if ($scope.images[i]._id == imgID) {

          $scope.displayImage = $scope.images[i];
          return;
        }
      }
    };

    $scope.uploadFile = function () {
      $scope.helperText = "Uploading...";
      var base64 = $("#png").val();
      $("#png").val("");
      var blob = dataURLtoBlob(base64);

      Img.upload(blob)
        .success(function (data) {
          var params = {
            imgId: $scope.imgId,
            type: $scope.types[$scope.state],
            imgUrl: data.url,
            height: data.height,
            width: data.width
          };
          Img.addImage(params)
            .success(function (savedData) {
              if ($scope.state == 4) {
                $scope.state = 1;
                $scope.helperText = "All Images uploaded";
                $scope.images.push(savedData);
                $scope.uploadFlag = 0;
              }
              else {
                $scope.imgId = savedData._id;
                $scope.state = $scope.state + 1;
                $scope.helperText = "Crop for " + $scope.types[$scope.state] + " image";
              }

            })
        });
    };

    $scope.logout = function () {
      Img.logout()
        .success(function () {
          $window.location.href = "/";
        });
    };

    $("#file").change(function (e) {
      var f, i;
      if ((f = this.files[0])) {
        i = new Image();
        i.onload = function () {
          if (this.width == 1024 && this.height == 1024) {
          }
          else {
            alert("Please select a picture of size 1024 x 1024");
            $scope.uploadFlag = 0;
            $scope.helperText = "Preview";
            $scope.$digest();
          }
        };
        i.src = _URL.createObjectURL(f);
      }
      $scope.state = 1;
      $scope.types = {
        1: 'horizontal',
        2: 'vertical',
        3: 'horizontalSmall',
        4: 'gallery'
      };
      $scope.imgId = "";
      $scope.helperText = "Crop for " + $scope.types[$scope.state] + " image";
      picture(this)
    });

    function picture(input) {
      $scope.uploadFlag = 1;
      $scope.$digest();
      console.log("here");
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $("#jcrop, #preview").html("").append("<img src=\"" + e.target.result + "\" alt=\"\" />");
          $("#jcrop  img").Jcrop({
            onChange: canvas,
            onSelect: canvas,
            boxWidth: crop_max_width,
            boxHeight: crop_max_height
          });
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function canvas(coords) {
      var imageObj = $("#jcrop img")[0];
      var canvas = $("#canvas")[0];
      canvas.width = coords.w;
      canvas.height = coords.h;
      var context = canvas.getContext("2d");
      context.drawImage(imageObj, coords.x, coords.y, coords.w, coords.h, 0, 0, canvas.width, canvas.height);
      png();
    }

    function png() {
      var png = $("#canvas")[0].toDataURL('image/png');
      $("#png").val(png);
    }

    function dataURLtoBlob(dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {type: contentType});
      }
      var parts = dataURL.split(BASE64_MARKER);
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;
      var uInt8Array = new Uint8Array(rawLength);
      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], {type: contentType});
    }

  });