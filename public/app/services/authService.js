angular.module('authService', [])



.factory('Auth', function($http, $q, AuthToken) {


    var authFactory = {};


    authFactory.login = function(email, password) {

        return $http.post('/api/login', {
                email: email,
                password: password
            })
            .success(function(data) {
                AuthToken.setToken(data.token);
                return data;
            })
    }

    authFactory.forgot = function(email) {

        return $http.post('/api/forgotpassword', {
                email: email,
            })
            .success(function(data) {
                return data;
            })
    }

    authFactory.reset = function(email, password) {

        return $http.post('/api/reset', {
                email: email,
                password: password
            })
            .success(function(data) {
                return data;
            })
    }

    authFactory.logout = function() {
        AuthToken.setToken();
    }

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken())
            return true;
        else
            return false;
    }
    authFactory.isAdminLoggedIn = function() {
        if (AuthToken.getToken()) {

            $http.get('/api/me')
                .then(function(response) {
                    if (response.data.tag === 'admin') {
                        console.log('1')
                        return true;
                    } else {
                        console.log('2')
                        return false;
                    }

                });
            return true
        } else {
            console.log('3')
            return false;
        }
    }

    authFactory.getUser = function() {
        if (AuthToken.getToken())
            return $http.get('/api/me');
        else
            return $q.reject({ message: "User has no token" });

    }


    return authFactory;

})


.factory('AuthToken', function($window) {

    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    }

    authTokenFactory.setToken = function(token) {

        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');

    }

    return authTokenFactory;

})


.factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};


    interceptorFactory.request = function(config) {

        var token = AuthToken.getToken();

        if (token) {

            config.headers['x-access-token'] = token;

        }

        return config;

    };




    return interceptorFactory;
});
