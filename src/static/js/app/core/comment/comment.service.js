'use strict';

angular.
    module('core.comment').
        factory('Comment', function($resource){
            var url = '/api/comments/'
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
                    url: url + ":id/",
                    method: "GET",
                    params: {"id": "@id"},
                    isArray: false,
                    cache: false,
                }

            // var commentCreate = {
            //     url: url + "create/",
            //     method: "post",
            // }

            return $resource(url, {}, {
                query: commentQuery,
                get: commentGet,
                // create: commentCreate,
            })

        });