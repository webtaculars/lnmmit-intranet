angular.module('taService', [])


.factory('Course', function($http) {


	var courseFactory = {};

	courseFactory.create = function(courseData) {
		return $http.post('/api/addcourseforta', courseData);
	}

	courseFactory.allCourses = function(courseData) {
		return $http.get('/api/viewcourseforta', courseData);
	}
	
	courseFactory.apply = function(courseData) {
		return $http.post('/api/applicationforta', courseData);
	}



	return courseFactory;

})

.factory('Application', function($http) {


	var courseFactory = {};

	courseFactory.allApplications = function(applicationData) {
		return $http.get('/api/viewapplicationforta', applicationData);
	}
	courseFactory.approve = function(id) {
		var idData = {
			"_id" : id
		}
		        console.log(' ervicessapproved bc')

		return $http.post('/api/approvestatus', idData);
	}

	courseFactory.reject = function(id) {
		var idData = {
			"_id" : id
		}
		return $http.post('/api/rejectstatus', idData);
	}
	courseFactory.sendMail = function(id) {
		console.log(id)
		var idData = {
			"_id" : id
		}
		return $http.post('/api/sendapprovalmail', idData);
	}
	courseFactory.allAcceptedApplications = function(applicationData) {
		return $http.get('/api/acceptedapplicationforta', applicationData);
	}

	courseFactory.allRejectedApplications = function(applicationData) {
		return $http.get('/api/rejectedapplicationforta', applicationData);
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