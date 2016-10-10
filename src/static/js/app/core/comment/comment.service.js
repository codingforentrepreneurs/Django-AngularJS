'use strict';

angular.
    module('core.comment').
        factory('Comment', function($cookies, $httpParamSerializer, $location, $resource){
            var url = '/api/comments/:id/'
            var commentQuery = {
                url: url,
                method: "GET",
                params: {},
                isArray: true,
                cache: false,
                transformResponse: function(data, headersGetter, status){
                    // console.log(data)
                    var finalData = angular.fromJson(data)
                    return finalData.results
                }
            }

            var commentGet = {
                    method: "GET",
                    params: {"id": "@id"},
                    isArray: false,
                    cache: false,
                }

             var commentCreate = {
                    url: '/api/comments/create/',
                    method: "POST",
                    interceptor: {responseError: function(response){
                        //console.log("interceptor error")
                        //console.log(response)
                        if (response.status == 401){
                            var currentPath = $location.path();
                            console.log(currentPath)
                            if (currentPath == "/login") {
                                $location.path("/login")
                            } else {
                                $location.path("/login").search("next", currentPath)
                            }
                        }
                    }}
                    // params: {"id": "@id"},
                    // isArray: false,
                    // cache: false,
                }
            var commentUpdate = {
                    url: '/api/comments/:id/',
                    method: "PUT",
                    // params: {"id": "@id"},
                    // isArray: false,
                    // cache: false,
                }

             var commentDelete = {
                    url: '/api/comments/:id/',
                    method: "DELETE",
                    // params: {"id": "@id"},
                    // isArray: false,
                    // cache: false,
                }

            var token = $cookies.get("token")
            if (token){
                commentCreate["headers"] = {"Authorization": "JWT " + token}
                commentDelete["headers"] = {"Authorization": "JWT " + token}
                commentUpdate["headers"] = {"Authorization": "JWT " + token}
            }

            return $resource(url, {}, {
                query: commentQuery,
                get: commentGet,
                create: commentCreate,
                delete: commentDelete,
                update: commentUpdate,
            })

        });