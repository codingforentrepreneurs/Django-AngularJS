'use strict';

angular.module('loginDetail').
    component('loginDetail', {
        templateUrl: '/api/templates/login-detail.html',
        controller: function(
                $cookies, 
                $http, 
                $location, 
                $routeParams, 
                $rootScope, 
                $scope
            ){
            var loginUrl = '/api/auth/token/'
            $scope.loginError = {}
            $scope.user = {

            }

            $scope.$watch(function(){
                if ($scope.user.password) {
                    $scope.loginError.password = ""
                } else if ($scope.user.username) {
                    $scope.loginError.username = ""
                }
            })

            var tokenExists = $cookies.get("token")
            if (tokenExists) {
                // verify token
                $scope.loggedIn = true;
                $cookies.remove("token")
                $scope.user = {
                    username: $cookies.get("username")
                }
                window.location.reload()
            }

            $scope.doLogin = function(user){
                // console.log(user)
                if (!user.username) {
                    $scope.loginError.username = ["This field may not be blank."]
                } 

                if (!user.password) {
                    $scope.loginError.password = ["This field is required."]
                }

                if (user.username && user.password) {
                    var reqConfig = {
                        method: "POST",
                        url: loginUrl,
                        data: {
                            username: user.username,
                            password: user.password
                        },
                            headers: {}
                    }
                    var requestAction = $http(reqConfig)
                    
                    requestAction.success(function(r_data, r_status, r_headers, r_config){
                            // console.log(r_data) // token
                            $cookies.put("token", r_data.token)
                            $cookies.put("username", user.username)
                            // message
                            $location.path("/")
                            window.location.reload()
                    })
                    requestAction.error(function(e_data, e_status, e_headers, e_config){
                            // console.log(e_data) // error
                            $scope.loginError = e_data

                    })
                }
                

            }
            // $http.post()
        }
})
