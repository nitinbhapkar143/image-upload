angular.module('imgUpload', ['ngFileUpload'])
    .controller('uploadCtrl', ['Upload', '$location','imgFactory', function(Upload, $location, imgFactory){
        var vm = this;
        vm.submit = function(){ 
            if (vm.upload_form.file.$valid && vm.file) { 
                vm.upload(vm.file); 
            }
        }
        vm.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/api/upload', 
                method: 'post',
                data:{ file: file } 
            }).then(function (res) { 
                vm.successMsg = res.data.message;
                imgFactory.setPath(res.data.paths);
                $location.path('/image');
            }, function (res) { 
                vm.errorMsg = res.data.message;
            }, function (evt) { 
                vm.progress = 'Uploading.. Please wait.. ';
            });
        };
    }])
    .controller('viewCtrl', ['imgFactory', function(imgFactory){
        var vm = this;
        vm.paths = imgFactory.getPath();
        vm.images = vm.paths.images.paths;
        vm.resolution = vm.paths.resolution;
    }]);