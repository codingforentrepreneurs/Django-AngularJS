'use strict';

angular.module('core.comment').
    directive('commentReplyThread', function(Comment){
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
                                    "via {{ user }} | <a href='#'>Remove</a>" +
                                "</div>" +    
                            "</div>" + 
                        "</div></div>" + 
                        "<div class='text-center' ng-show='!replies'>" +
                            "<img style='margin: 0 auto;' ng-src='/static/img/ring.gif' class='img-responsive'/>" + 
                        "</div>" + 
                        "<p style='color:red;' ng-if='reply.content'>Preview: {{ reply.content }}</p>" + 
                        "<form ng-submit='addCommentReply(reply, comment)'>" +
                            "<textarea class='form-control'  ng-model='reply.content' placeholder='Write reply'></textarea>" + 
                           " <input class='btn btn-default btn-sm' type='submit' value='Reply'/>" + 
                        "</form>" ,
            link: function(scope, element, attr) {
                scope.user = 'jmitchel3'
                if (scope.comment) {
                    var commentId = scope.comment.id
                    if (commentId){
                        Comment.get({id: commentId}, function(data){
                            scope.replies = data.replies
                        })
                    }
                }
                scope.addCommentReply = function(reply, parentComment) {
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
                        reply.content = ""
                    }, function(e_data){
                        console.log(e_data)
                    })

                }


            }
        }
    })