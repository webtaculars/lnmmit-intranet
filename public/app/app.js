angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective','noticeService','noticeCtrl','postService','postCtrl','searchService','searchCtrl'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})