angular.module('searchService', [])


.factory('Search', function($http) {


	var SearchFactory = {};

	SearchFactory.find = function(searchData) {
		return $http.post('/api/findstudent', searchData);
	}

	return SearchFactory;

})