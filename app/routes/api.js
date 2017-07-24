var multer = require('multer');
var sizeOf = require('image-size');
var path = require('path');
var fs = require('fs');
var resize = require('../core-modules/resize-image');
var s3upload = require('../core-modules/s3-upload');
var async = require('async');

var uploadPath = path.normalize(__dirname + '/../../uploads/');
var newFileName;
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        newFileName = path.basename(file.originalname, path.extname(file.originalname)) + '_' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});
var upload = multer({ storage: storage }).single('file');

module.exports = function (router) {
  router.post('/upload', function(req, res) {
	  var resp = { paths : [] };
	  var del = [];
      upload(req,res,function(err){
          if(err){
            res.json({success : false, message : 'Error while uploading image. Please try again.'});
          }
          var imgPath = req.file.path;
          var dimensions = sizeOf(imgPath);
          if(dimensions.width !=1024 &&  dimensions.height != 1024){
              fs.unlink(req.file.path)
            res.json({success : false, message : 'Image resolution should be 1024*1024. Please use another image.'});
          }
          else{
            async.waterfall([
              function(callback){
                resize(imgPath, 755, 450, function(localpath, s3Path1){
                	resp.paths.push(s3Path1);
                	del.push(localpath);
                	resize(imgPath, 365, 450, function(localpath, s3Path2){
	                	resp.paths.push(s3Path2);
                		del.push(localpath);
                		resize(imgPath, 365, 212, function(localpath, s3Path3){
		                	resp.paths.push(s3Path3);
                			del.push(localpath);
                			resize(imgPath, 380, 380, function(localpath, s3Path4){
			                	resp.paths.push(s3Path4);
                				del.push(localpath);
                  				callback(null, del, resp)
                  			});
                  		})
                  	})
                })
              },
              function(localpath, resp, callback){

				for(var i = 0; i < 4 ; i++){
					fs.unlink(localpath[i], function(err){
						if (err) throw err;
					});
				}
				callback(null, resp);
              }
            ],
            function(err, resp){
              	res.json({success : true, paths : resp, message : 'Image uploaded successfully.'});
            })
          }
      })
  });
  
  return router;
}
