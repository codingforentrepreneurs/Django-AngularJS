'use strict';

angular.module('core.comment').
    directive('commentReplyThread', function(Comment, $cookies){
        return {
            restrict: "E",
            scope: {
                comment: '=comment',
                slug: '=slug'
            },
            template:"<div class='row' ng-repeat='r in replies' style='margin-top:10px;'><div class='col-sm-12'>" +
                         "<div class=\"panel panel-default\"> " +
                                "<div class=\"panel-body \">" + 
                                    "{{ r.content }} <br/>" +  
                                    "<small>via {{ r.user.username }}</small> " +
                                    "<small ng-show='r.user.username == currentUser'>|" + 
                                    " <a confirm-click='Do you want to delete this?' " +
                                     "confirmed-click='deleteComment(r, comment)' href='#'>Remove</a></small>" +
                                "</div>" +    
                            "</div>" + 
                        "</div></div>" + 
                        "<div class='text-center' ng-show='!replies'>" +
                            "<img style='margin: 0 auto;' ng-src='/static/img/ring.gif' class='img-responsive'/>" + 
                        "</div>" + 
                        "<p style='color:red;' ng-if='reply.content'>Preview: {{ reply.content }}</p>" + 
                        "<form ng-submit='addCommentReply(reply, comment)'>" +
                        "<div class=\"form-group\" ng-class=\"{'has-error': replyError.content }\"> " +
                            "<textarea class='form-control' id='replyText-{{ comment.id }}' ng-model='reply.content' placeholder='Write reply'></textarea>" + 
                            "<label class=\"control-label\" for=\"replyText-{{ comment.id }}\" ng-if='replyError.content'>" + 
                               "<span ng-repeat='error in replyError.content'>{{ error }}<br/></span>" + 
                            "</label>" +
                         "</div>" + 
                           " <input class='btn btn-default btn-sm' type='submit' value='Reply'/>" + 
                        "</form>" ,
            link: function(scope, element, attr) {
                if ($cookies.get("token")) {
                    scope.currentUser = $cookies.get("username")
                }
                
                if (scope.comment) {
                    var commentId = scope.comment.id
                    if (commentId){
                        Comment.get({id: commentId}, function(data){
                            scope.replies = data.replies
                        })
                    }
                }
                scope.reply = {}
                scope.replyError = {}
                scope.$watch(function(){
                    if (scope.reply.content) {
                        scope.replyError = {}
                    }
                })
                scope.deleteComment = function(reply, parentComment){
                     Comment.delete({"id": reply.id}, function(data){
                        var index = scope.replies.indexOf(reply)
                        scope.replies.splice(index, 1)
                        parentComment.reply_count -= 1
                    }, function(e_data){
                        console.log(e_data)
                    })

                }
                scope.addCommentReply = function(reply, parentComment) {
                    if (!reply.content) {
                         scope.replyError.content = ['This field is required']
                    } else {
                            Comment.create({
                            content: reply.content,
                            slug: scope.slug,
                            type: "post",
                            parent_id: parentComment.id,
                        }, function(data) {
                            if (parentComment.reply_count) {
                                parentComment.reply_count += 1
                            } else {
                                parentComment.reply_count = 1
                            }
                            
                            scope.replies.push(data)
                            scope.replyError = ""
                            reply.content = ""
                        }, function(e_data){
                            console.log(e_data)
                            scope.replyError = e_data.data
                        })
                    }
                    

                }


            }
        }
    })