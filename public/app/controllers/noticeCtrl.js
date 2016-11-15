angular.module('noticeCtrl', ['noticeService'])


	.controller('NoticeController', function(Story, socketio) {


		var vm = this;

		Notice.all()
			.success(function(data) {
				vm.stories = data;
			});


		vm.createNotice = function() {

			vm.processing = true;

   
			vm.message = '';
			Notice.create(vm.NoticeData)
				.success(function(data) {
					vm.processing = false;
					vm.noticeData = {};

					vm.message = data.message;

					
				});

		};

		socketio.on('notice', function(data) {
			vm.notice.push(data);
		})

})

.controller('AllNoticesController', function(notices, socketio) {

	var vm = this;

	vm.notices = notices.data;

	socketio.on('notice', function(data) {
			vm.notices.push(data);
	});



})

.controller('AddNoticeController', function(Notice, $location, $window) {

	var vm = this;

	vm.addnotice = function() {
		vm.message = '';

		Notice.create(vm.userData)
			.then(function(response) {
				vm.userData = {};
				vm.message = response.data.message;
				$location.path('/allNotices');
			})
	}

})