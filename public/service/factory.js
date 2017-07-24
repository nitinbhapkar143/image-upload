angular.module('imgService',[])
	.factory('imgFactory', function (){
		var imgData = {};
		var resolution = ['755*450','365*450','365*212','380*380'];

		imgData.setPath = function(images){
			imgData.images = images;
			imgData.resolution = resolution;
		}

		imgData.getPath =function(){
			return imgData;
		}

		return imgData;
	})

	