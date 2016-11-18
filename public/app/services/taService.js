angular.module('taService', [])


.factory('Course', function($http) {


	var courseFactory = {};

	courseFactory.create = function(courseData) {
		return $http.post('/api/addcourseforta', courseData);
	}

	courseFactory.allCourses = function(courseData) {
		return $http.get('/api/viewcourseforta', courseData);
	}

	return courseFactory;

})


.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});