var lwip = require('lwip');
var path = require('path');
var fs   = require('fs');
var async = require('async');
var s3upload = require('../core-modules/s3-upload');

module.exports = function(paths, width, height, cb){
	var max = width;
	var filename = path.basename(paths, path.extname(paths)) + '_' + width + '_' + height + path.extname(paths);
	var newPath = path.dirname(paths) + '/' + filename;
	if(height > width) max = height;
	async.waterfall([
		function(callback){
			lwip.open(paths, function(err, image){
				if (err) callback('error',err);
				else callback(null, image);
			})
		},
		function(image, callback){
			image.resize(max , function(err, resImage){
				if (err) callback('error',err);
				else callback(null, resImage);
			})
		},
		function(resImage, callback){
			resImage.crop(width, height, function(err, resImg){
				if (err) callback('error',err);
				else callback(null, resImg);
			})
		},
		function(resImg, callback){
			resImg.writeFile(newPath , function(err){
				if (err) callback('error',err);
				else callback(null, newPath);
			})
		},
		function(path, callback){
	        s3upload(path, function(s3path){
	          callback(null, s3path);
	        });
	     }
	],
		function(err, s3path){
			if(err) throw err;
			cb(newPath, s3path);
		}
	);
}