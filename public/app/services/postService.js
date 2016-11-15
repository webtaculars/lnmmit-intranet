angular.module('postService', [])


.factory('Post', function($http) {


	var postFactory = {};

	postFactory.allPost = function() {
		return $http.get('/api/allpost');
	}

	postFactory.all = function() {
		return $http.get('/api/');
	}

	postFactory.create = function(postData) {
		return $http.post('/api/addpost', postData);
	}

	return postFactory;

})