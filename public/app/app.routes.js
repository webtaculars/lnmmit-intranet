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

	$locationProvider.html5Mode(true);

})