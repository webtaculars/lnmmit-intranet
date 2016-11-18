angular.module('taCtrl', ['taService'])

.controller('AddCourseForTaController', function(Course, $location, $window) {

	var vm = this;

	vm.addcourse = function() {
		vm.message = '';

		Course.create(vm.courseData)
			.then(function(response) {
				vm.postData = {};
				vm.message = response.data.message;
				$location.path('/addCourseForTa');
			})
	}

})

.controller('ViewCourseForTaController', function(courses, socketio) {

	var vm = this;

	vm.courses = courses.data;

	socketio.on('course', function(data) {
			vm.courses.push(data);
	});



})
