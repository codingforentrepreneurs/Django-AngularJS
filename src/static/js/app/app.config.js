'use strict';

angular.module('try').
    config(
        function(
          $locationProvider,
          $resourceProvider,
          $routeProvider
          ){


          $locationProvider.html5Mode({
              enabled:true
            })

          $resourceProvider.defaults.stripTrailingSlashes = false;
          $routeProvider.
              when("/", {
                template: "<blog-list></blog-list>"
              }).
              when("/about", {
                templateUrl: "/api/templates/about.html"
              }).
              when("/blog", {
                  template: "<blog-list></blog-list>",
                  // redirectTo: '/'
              }).
              when("/blog/:slug", {
                  template: "<blog-detail></blog-detail>"
              }).
              when("/login", {
                  template: "<login-detail></login-detail>",
                  // redirectTo: '/'
              }).
              when("/logout", {
                  // template: "<login-detail></login-detail>",
                  redirectTo: '/login'
              }).
               when("/register", {
                  template: "<register-detail></register-detail>",
                  // redirectTo: '/'
              }).
              // when("/blog/:id/:abc", {
              //     template: "<blog-list></blog-list>"
              // }).
              // when("/blog/2", {
              //     template: "<blog-list></blog-list>"
              // }).
              otherwise({
                  template: "Not Found"
              })

    });