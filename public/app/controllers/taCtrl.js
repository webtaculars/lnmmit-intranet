angular.module('taCtrl', ['taService'])

.controller('AddCourseForTaController', function(Course, $location, $window) {

    var vm = this;

    vm.addcourse = function() {
        vm.message = '';

        Course.create(vm.courseData)
            .then(function(response) {
                vm.postData = {};
                vm.message = response.data.message;
                $location.path('/applyForTa');
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


.controller('ApplyFormController', function(Course, $location, $window) {


    var vm = this;

    vm.applicationForTa = function() {
        vm.message = '';

        Course.apply(vm.courseData)
            .then(function(response) {
                vm.postData = {};
                console.log(response)
                vm.message = response.data.message;
                $location.path('/applyForTa');
            })

    }

})

.controller('AcceptedApplicationForTaController', function(applications, Application, $location, $window) {

    var vm = this;

    vm.applications = applications.data;

    vm.sendMail = function(id) {
        Application.approve(id)
            .then(function(response) {
                vm.postData = {};
                console.log(response)
                vm.message = response.data.message;
                $location.path('/viewApplicationForTa');
            })

    }

})


.controller('ViewApplicationForTaController', function(applications, Application, $location, $window) {

    var vm = this;

    vm.applications = applications.data;

    vm.approve = function(id) {
        Application.approve(id)
            .then(function(response) {
                vm.postData = {};
                console.log(response)
                vm.message = response.data.message;
                $location.path('/viewApplicationForTa');
            })


/*    socketio.on('application', function(data) {
        vm.applications.push(data);
    });

*/    }

    vm.reject = function(id) {
        Application.approve(id)
            .then(function(response) {
                vm.postData = {};
                console.log(response)
                vm.message = response.data.message;
                $location.path('/viewApplicationForTa');
            })
    }


})
