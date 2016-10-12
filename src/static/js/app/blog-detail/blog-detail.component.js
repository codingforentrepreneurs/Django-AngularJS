'use strict';

angular.module('blogDetail').
    component('blogDetail', {
        // templateUrl: '/api/templates/blog-detail.html',
        template: "<ng-include src='getTemplateUrl()' />",
        controller: function(Comment, Post, $cookies, $http, $location, $routeParams, $scope){
            $scope.loading = true;
            $scope.post = null;
            $scope.pageError = false;
            $scope.notFound = false;

            $scope.getTemplateUrl = function(){
                if ($scope.loading && $scope.post == null) {
                    return '/api/templates/loading/loading-detail.html'
                } else if ($scope.notFound) {
                     return '/api/templates/error/404.html'
                } else if ($scope.pageError) {
                    return '/api/templates/error/500.html'
                }else {
                    return '/api/templates/blog-detail.html'
                }
            }

            if ($cookies.get("token")) {
                $scope.currentUser = $cookies.get("username")
            }



            function postDataSuccess(data){
                $scope.loading = false;
                $scope.post = data
                // $scope.comments = data.comments
                Comment.query({"slug": slug, "type": "post"}, function(data){
                    // console.log(data)
                    $scope.comments = data
                })
            }

            function postDataError(e_data){
                $scope.loading = false;
                if (e_data.status == 404) {
                     $scope.notFound = true;
                } else {
                    // status code 500
                    $scope.pageError = true;
                }
            }

            var slug = $routeParams.slug
            Post.get({"slug": slug}, postDataSuccess, postDataError)

            $scope.deleteComment = function(comment) {
                comment.$delete({"id": comment.id}, function(data){
                    var index = $scope.comments.indexOf(comment)
                    $scope.comments.splice(index, 1)
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


            $scope.commentOrder = '-timestamp'

            $scope.$watch(function(){
                if ($scope.newComment.content){
                    $scope.commentError = {}
                }
            })
            
            $scope.newComment = {}
            $scope.commentError = {}
            $scope.addNewComment = function() {
                // console.log($scope.reply)
                if (!$scope.newComment.content) {
                    $scope.commentError.content = ["This field is required."]
                } else {


                    Comment.create({
                        content: $scope.newComment.content,
                        slug: slug,
                        type: "post",
                    }, function(data){
                        console.log(data)
                        // data['reply_count'] = 0
                        data.reply_count = 0
                        $scope.comments.push(data)
                         $scope.commentError = ''
                        resetNewComment()
                    }, function(e_data){
                        // console.log(e_data)
                        $scope.commentError = e_data.data
                    })
                 }
                
            }

            function resetNewComment(){
              $scope.newComment = {
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