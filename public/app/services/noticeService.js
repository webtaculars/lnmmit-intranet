angular.module('noticeService', [])


.factory('Notice', function($http) {


	var noticeFactory = {};

	noticeFactory.allNotices = function() {
		return $http.get('/api/all_notices');
	}

	noticeFactory.all = function() {
		return $http.get('/api/');
	}

	noticeFactory.create = function(noticeData) {
		return $http.post('/api/addnotice', noticeData);
	}

	return noticeFactory;

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