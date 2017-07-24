angular.module('appRoute', ['ngRoute'])
	.config(function ($routeProvider, $locationProvider){
		$routeProvider
		.when('/',{
			templateUrl : '../views/upload.html'
		})
		.when('/image',{
			templateUrl : '../views/image-view.html',
			controller : 'viewCtrl',
			controllerAs : 'viewImage'
		})
		.otherwise({
			redirectTo : '/'
		})

		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	});