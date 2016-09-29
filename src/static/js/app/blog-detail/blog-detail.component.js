'use strict';

angular.module('blogDetail').
    component('blogDetail', {
        templateUrl: '/api/templates/blog-detail.html',
        controller: function(Post, $cookies, $http, $location, $routeParams, $scope){
            
            var slug = $routeParams.slug
            Post.get({"slug": slug}, function(data){
                $scope.post = data
                $scope.comments = data.comments
            })
            
            // Post.query(function(data){
            //   $scope.notFound = true
              
            //   $scope.comments = []
            //    angular.forEach(data, function(post){
            //         if (post.id == $routeParams.id){
            //           $scope.notFound = false
            //           $scope.post = post
            //           if (post.comments) {
            //             $scope.comments = post.comments
    
            //           }
            //           resetReply()
            //         }
            //   })
            // })



            $scope.deleteComment = function(comment) {
                $scope.$apply(
                    $scope.comments.splice(comment, 1)
                )
                // someResource.$delete()
            }

// "Authorization: JWT " '{"content":"some reply to another try"}' ''


            $scope.addReply = function() {
                console.log($scope.reply)
                var token = $cookies.get("token")
                if (token){
                    var req = {
                        method: "POST",
                        url: 'http://127.0.0.1:8000/api/comments/create/',
                        data: {
                            content: $scope.reply.content,
                            slug: slug,
                            type: "post",
                        },
                        headers: {
                            authorization: "JWT " + token
                        }
                    }

                    var requestAction = $http(req)

                    requestAction.success(function(r_data, r_status, r_headers, r_config){
                         $scope.comments.push($scope.reply)
                         resetReply()
                    })
                    requestAction.error(function(e_data,e_status, e_headers, e_config){
                        console.log(e_data)
                    })

                    // $scope.post.comments.push("abc")
                    

                } else {
                    console.log("no token")
                }
                
            }

            function resetReply(){
              $scope.reply = {
                          id: $scope.comments.length + 1,
                          content: "",
              }
            }

            if ($scope.notFound) {
                console.log("Not found")
                // change location
                $location.path("/")
            }




    }
});