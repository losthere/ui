var server_host = "http://localhost:9081/X-Walk-Rest/app";
var app = angular.module('X-WalkApp');

app.controller('LoginCtrl', function($scope, $http, $location, $rootScope, ngDialog, notify) {
	
	$scope.userPojo = ["emailId", "username", "password", "userrole", "operation"];
	$scope.closeDialog = function() {
		console.log('closeDialog');
		ngDialog.close();
	};
	
	$scope.dummyFunctionToMaintainBrowserSessions = function() {
		console.log('dummyFunctionToMaintainBrowserSessions');
		if($rootScope.cameFromDashboard)
			$rootScope.isLogin = false;
	};
	
	$scope.newRegistration = function() {
		console.log('newRegistration');
		
		$scope.userToAdd = {};
		$scope.allRoles = ["Developer", "Optum Admin"];
		$scope.userToAdd.isAuthorize = 0;
		
		ngDialog.open({
	        template:  'views/newregistration.html',
	        controller : 'DummyCtrl',
	        className: 'ngdialog-theme-default custom-width-400',
	        scope: $scope
        });  
	};
	
	$scope.onLogin = function() {
		console.log('onLogin');
		$http({
			url : server_host + "/dashboard/getUsersCredentials",
			dataType : "json",
			method : "POST"
		})
		.success(function(data, status, headers) {
		//	usSpinnerService.stop('spinner-1');	
			$rootScope.isLogin = false;
			var numberOfUsers = data.length;
			console.log(data);
			for (var i = 0; i < numberOfUsers; ++i) {
				var username = data[i][1];
				var password = data[i][2];		
				var userrole = data[i][3];
				var isAuthorize = data[i][4];
				
				if ($scope.username == username && $scope.password == password && isAuthorize == 1) 
				{
					$rootScope.isLogin = true;
					$rootScope.signInName = username;
					$rootScope.userRole = userrole;
					break;
				}
			}
			
			if ($rootScope.isLogin) {
				$location.path('/x-walk/dashboard');
			}
			else
				notify({
					message : 'invalid credentials or still you are not authorised by an optum admin',
					classes : 'alert-danger'
				});
		}).error(function(data, status, headers) {
			notify({
				message : 'users credentials retrieval failed!',
				classes : 'alert-danger'
			});
		});
	};
	
	$scope.saveOnAddNewUser = function(confirmPassword) {
		console.log('saveOnAddNewUser');
		
		if(confirmPassword != $scope.userToAdd.password)
			notify('passwords not matched');
		else
		{
			$http({
				method : "POST",
				url : server_host + "/dashboard/saveNewUser", 
				data : $scope.userToAdd
			}).success(function(data, status, headers) {						  
				$scope.closeDialog();
				notify('registered successfully but need to be authorized by an optum admin');
			}).error(function(data, status, headers) {
				notify({
					message : 'adding new user failed!',
					classes : 'alert-danger'
				});
			});
		}
	};
	
	$scope.dummyFunctionToMaintainBrowserSessions();
});
