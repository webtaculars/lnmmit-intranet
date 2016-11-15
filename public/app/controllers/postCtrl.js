angular.module('postCtrl', ['postService'])

.controller('AddPostController', function(Post, $location, $window) {

	var vm = this;

	vm.addpost = function() {
		vm.message = '';

		Post.create(vm.postData)
			.then(function(response) {
				vm.postData = {};
				vm.message = response.data.message;
				$location.path('/addPost');
			})
	}

})