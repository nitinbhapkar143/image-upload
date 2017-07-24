var S3FS = require('s3fs');
var fs = require('fs');
var path = require('path');
var bucketPath = 'image-upload-bucket-aws';
var s3Options = {
  region: 'ap-south-1',
  accessKeyId : 'YOUR_ACCESS_KEY_ID',
  secretAccessKey : 'YOUR_SECRET_ACCESS_KEY'
};
var fsImpl = new S3FS(bucketPath, s3Options);

module.exports = function(paths, cb){
	var stream = fs.createReadStream(paths);
	var filename = 'uploads/' + path.basename(paths);
	fsImpl.writeFile(filename, stream, function (err) {
		if (err) throw err;
		cb('https://s3.ap-south-1.amazonaws.com/image-upload-bucket-aws/' + filename);
	});
	
}