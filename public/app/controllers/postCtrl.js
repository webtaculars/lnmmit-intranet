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

.controller('ViewPostController', function(Post, socketio, posts) {

	var vm = this;
	vm.posts = posts.data;

	socketio.on('post', function(data) {
			vm.posts.push(data);
	});

})