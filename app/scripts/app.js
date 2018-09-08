var app = angular.module('X-WalkApp', ['ngRoute', 
											'ui.bootstrap.collapse', 
											'ui.bootstrap', 
											'ngDialog',
											'cgNotify',
											'angularUtils.directives.dirPagination', 
											'oitozero.ngSweetAlert',
											'uitk.component.header', 
											'uitk.component.uitkGlobalNavigation',
											'uitk.component.uitkDynamicTable','uitk.uitkUtility']);

app.config(function($routeProvider) {
	$routeProvider.when('/x-walk', {
		templateUrl : 'views/login.html',
		controller: 'LoginCtrl'
	}).when('/x-walk/dashboard', {
		resolve : {
			"check" : function($location, $rootScope) {
				if(!$rootScope.isLogin)
					$location.path('/x-walk');
			}
		},
		templateUrl : 'views/dashboard.html',
		controller: 'DashboardCtrl'
	}).otherwise({
		redirectTo : '/x-walk'
	});
});
