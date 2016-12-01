angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'app/views/pages/home.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .when('/login', {
            templateUrl: 'app/views/pages/login.html'
        })
        .when('/signup', {
            templateUrl: 'app/views/pages/signup.html'
        })

    .when('/allStories', {
            templateUrl: 'app/views/pages/allStories.html',
            controller: 'AllStoriesController',
            controllerAs: 'story',
            resolve: {
                stories: function(Story) {
                    return Story.allStories();
                }
            }

        })
        .when('/allNotices', {
            templateUrl: 'app/views/pages/allNotices.html',
            controller: 'AllNoticesController',
            controllerAs: 'notice',
            resolve: {
                notices: function(Notice) {
                    return Notice.allNotices();
                }
            }
        })

    .when('/addNotice', {
        templateUrl: 'app/views/pages/addNewNotice.html',
        controller: 'AddNoticeController',
        controllerAs: 'notice',
        resolve: {
            notices: function(Notice) {
                return Notice.allNotices();
            }
        }

    })

    .when('/addPost', {
        templateUrl: 'app/views/pages/addNewPost.html',
        controller: 'AddPostController'

    })

    .when('/searchStudent', {
        templateUrl: 'app/views/pages/searchStudent.html',
        controller: 'SearchStudentController'

    })

    .when('/addCourseForTa', {
        templateUrl: 'app/views/pages/addCourseForTa.html',
        controller: 'AddCourseForTaController'

    })

    .when('/applyForTa', {
        templateUrl: 'app/views/pages/applyForTa.html',
    })

    .when('/resultForTa', {
        templateUrl: 'app/views/pages/resultForTa.html',
    })

    .when('/viewCourseForTa', {
        templateUrl: 'app/views/pages/viewCourseForTa.html',
        controller: 'ViewCourseForTaController',
        controllerAs: 'course',
        resolve: {
            courses: function(Course) {
                return Course.allCourses();
            }
        }

    })

    .when('/applyForm', {
        templateUrl: 'app/views/pages/applyForm.html',
        controller: 'ApplyFormController'

    })

    .when('/viewApplicationForTa', {
        templateUrl: 'app/views/pages/viewApplicationForTa.html',
        controller: 'ViewApplicationForTaController',
        controllerAs: 'application',
        resolve: {
            applications: function(Application) {
                return Application.allApplications();
            }
        }
    })
    .when('/acceptedApplicationForTa', {
        templateUrl: 'app/views/pages/acceptedApplication.html',
        controller: 'AcceptedApplicationForTaController',
        controllerAs: 'application',
        resolve: {
            applications: function(Application) {
                return Application.allAcceptedApplications();
            }
        }
    })
    $locationProvider.html5Mode(true);

})
