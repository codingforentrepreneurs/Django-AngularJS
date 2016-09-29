'use strict';

angular.module('blogDetail').
    component('blogDetail', {
        templateUrl: '/api/templates/blog-detail.html',
        controller: function(Comment, Post, $cookies, $http, $location, $routeParams, $scope){
            var slug = $routeParams.slug
            Post.get({"slug": slug}, function(data){
                $scope.post = data
                // $scope.comments = data.comments
                Comment.query({"slug": slug, "type": "post"}, function(data){
                    console.log(data)
                    $scope.comments = data
                })
            })
            

            $scope.deleteComment = function(comment) {
                comment.$delete({"id": comment.id}, function(data){
                    $scope.comments.splice(comment, 1)
                }, function(e_data){
                    console.log(e_data)
                })
                // Comment.delete()
                // $create
                // $save

            }

            $scope.updateReply = function(comment) {
                Comment.update({
                    "id": comment.id,
                    content: $scope.reply.content,
                    slug: slug,
                    type: "post",
                }, function(data){
                    // console.log(data)
                    // $scope.comments.push(data)
                    // resetReply()
                }, function(e_data){
                    console.log(e_data)
                })
                
            }


            $scope.addReply = function() {
                Comment.create({
                    content: $scope.reply.content,
                    slug: slug,
                    type: "post",
                }, function(data){
                    // console.log(data)
                    $scope.comments.push(data)
                    resetReply()
                }, function(e_data){
                    console.log(e_data)
                })
                
            }

            function resetReply(){
              $scope.reply = {
                          // id: $scope.comments.length + 1,
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