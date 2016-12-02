angular.module('mainCtrl', [])


.controller('MainController', function($rootScope, $location, Auth, $scope) {

	var vm = this;


	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});


	vm.doLogin = function() {

		vm.processing = true;

		vm.error = '';

		Auth.login(vm.loginData.email, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;

				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;

			});
	}
	vm.doForgot = function() {

		vm.processing = true;

		vm.error = '';

		Auth.forgot(vm.forgotData.email)
			.success(function(data) {
				vm.processing = false;


			});
	}

	vm.doReset = function() {

		vm.processing = true;

		vm.error = '';

		Auth.reset(vm.forgotData.email, vm.forgotData.password)
			.success(function(data) {
				vm.processing = false;


			});
	}


	vm.doLogout = function() {
		Auth.logout();
				vm.user = {};

		$location.path('/logout');

	}


});