angular.module('searchService', [])


.factory('Search', function($http) {


	var SearchFactory = {};

	SearchFactory.find = function(searchData) {
		return $http.post('/api/findstudent', searchData);
	}

	SearchFactory.sendMail = function(rollNo) {
		var data = {
			"rollNo" : rollNo
		}
		return $http.post('/api/sendmail', data);
	}

	return SearchFactory;

})