angular.module('searchCtrl', ['searchService'])

.controller('SearchStudentController', function(Search, $location, $window, $scope) {

	var vm = this;
	vm.searchStudent = function() {
		vm.message = '';

		Search.find(vm.searchData)
			.then(function(response) {
				vm.searchData = {};
				vm.message = response.data.message;
				$location.path('/searchStudent');
 				$scope.results = response.data
				console.log(results[0])
			})
	}

})