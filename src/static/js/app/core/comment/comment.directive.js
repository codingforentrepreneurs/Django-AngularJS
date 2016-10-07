'use strict';

angular.module('core.comment').
    directive('commentReplyThread', function(Comment){
        return {
            restrict: "E",
            scope: {
                comment: '=comment',
                slug: '=slug'
            },
            template: "<ul ng-show='replies'><li ng-repeat='reply in replies'>{{ reply.content }}</li></ul>" + 
            "<div class='text-center' ng-show='!replies'>" +
                "<img style='margin: 0 auto;' ng-src='/static/img/ring.gif' class='img-responsive'/>" + 
            "</div>" + 
            "<p style='color:red;' ng-if='reply.content'>Preview: {{ reply.content }}</p>" + 
            "<form ng-submit='addCommentReply(reply, comment)'>" +
                "<textarea class='form-control'  ng-model='reply.content'></textarea>" + 
               " <input class='btn btn-default btn-sm' type='submit' value='Reply'/>" + 
            "</form>",
            link: function(scope, element, attr) {
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