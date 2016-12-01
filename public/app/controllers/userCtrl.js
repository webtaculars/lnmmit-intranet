 angular.module('userCtrl', ['userService'])


 .controller('UserController', function(User) {


     var vm = this;


     User.all()
         .success(function(data) {
             vm.users = data;
         })


 })


 .controller('UserCreateController', function(User, $location, $window, $scope) {

     var vm = this;

     vm.signupUser = function() {
         vm.message = '';
         var str = vm.userData.email
         var sub = str.substring(str.length - 13, str.length)
         if (sub == "@lnmiit.ac.in") {
             console.log('validate')
             User.create(vm.userData)
                 .then(function(response) {
                     vm.userData = {};
                     vm.message = response.data.message;

                     $location.path('/');
                 })

         } else {
             vm.message = "Email not valid"
         }

     }

 })
