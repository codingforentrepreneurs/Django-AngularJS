'use strict';


angular.module("tryNav").
  directive('tryNav', function(Post, $cookies, $location){
    return {    
        restrict: "E",
        templateUrl: "/api/templates/try-nav.html",
        link: function (scope, element, attr) { 
            scope.items = Post.query()
            scope.selectItem = function($item, $model, $label){
                // console.log($item)
                // console.log($model)
                // console.log($label)
                $location.path("/blog/" + $item.slug) // $item.slug was added after completion of content
                scope.searchQuery = ""
            }
            scope.seachItem = function(){
                console.log(scope.searchQuery)
                $location.path("/blog/").search("q", scope.searchQuery)
                scope.searchQuery = ""
            }

            scope.userLoggedIn = false
            scope.$watch(function(){
                var token = $cookies.get("token")
                if (token) {
                    scope.userLoggedIn = true
                } else {
                    scope.userLoggedIn = false
                }
            })
            

        }
    }
});