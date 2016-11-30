/**
 * Created by winty on 2016/11/24.
 */
$(function() {
    var getParam = new UrlSearch();
    //点赞
    $('#praise').click(function () {
        var praise = $('#praise');
        var isLike;
        var userid = $('#personal').attr('data-userid');
        if ($(this).hasClass('active')) {
            isLike = '0';
        } else {
            isLike = '1';
        }
        $.ajax({
            url: '/doLike',
            type: 'post',
            data: {
                isLike: isLike,
                shareId: getParam.shareId,
                userId: userid
            },
            success: function (data) {
                console.log(data.isLike)
                if (data.success == 1) {
                    if (data.isLike == 1) {
                        praise.addClass('active');
                    } else {
                        praise.removeClass('active');
                    }
                    praise.find('span').text('赞(' + data.likeNum + ')');
                } else {
                    alert(data.message);
                }
            }
        })
    })
    //评论
    $('#comment-btn').click(function () {
        var commentN = $('#comment>span').attr('data-num');
        var comment = $(this).parent().find('.share-input');
        var userid = $('#personal').attr('data-userid');

        $.ajax({
            url: '/doComment',
            type: 'post',
            data: {
                comment: comment.text(),
                shareId: getParam.shareId,
                userId: userid
            },
            success: function (data) {
                if (data.success == 1) {
                    comment.text('');
                    var commentHTML = '<div id="discussList" class="clearfix">' +
                        '<div id="discussContent" class="clearfix">' +
                        '<a href="/user?userId=' + data.user._id + '"><img src="/image?imageId=' + data.user.portraitUrl + '")</a>' +
                        '<a href="/user?userId=' + data.user._id + '"><strong>' + data.user.userName + '</strong></a>' + data.comment.content +
                        '</div><div class="reply-list"></div><div id="discussDetail">' +
                        '<span>' + moment(data.comment.created).format("YYYY-MM-DD HH:mm:ss") + '</span>' +
                        '<a class="reply">展开回复</a></div>'+
                        '<div class="reply-wrap">'+
                        '<div class="share-input" contenteditable=true></div>'+
                        '<input class="reply-btn btn btn-danger btn-sm pull-right" type="button" value="回复" data-commentId='+data.comment._id+'>'+
                        '</div>';
                    $('#discussion').append(commentHTML);
                    commentN++;
                    $('#comment>span').text('评论(' + commentN + ')');
                } else {
                    alert(data.message);
                }

            }
        })
    })
//收藏
    $('#collect').click(function () {
        var collect = $('#collect');
        var isCollect;
        var userid = $('#personal').attr("data-userid");
        if ($(this).hasClass("active")) {
            isCollect = '0';
        } else {
            isCollect = '1';
        }
        $.ajax({
            url: '/doCollect',
            type: 'post',
            data: {
                isCollect: isCollect,
                shareId: getParam.shareId,
                userId: userid
            },
            success: function (data) {
                console.log(data.isCollect);
                if (data.success == 1) {
                    if (data.isCollect == 1) {
                        collect.addClass('active');
                    } else {
                        collect.removeClass('active');
                    }
                    collect.find('span').text('收藏(' + data.CollectNum + ')');
                } else {
                    alert(data.message);
                }
            }

        })
    })
//回复
    $(document).on('click', '.reply', function () {
        console.log('......................')
        if ($(this).parent().parent().find('.reply-wrap').is(":hidden")) {
            $(this).text('收起回复')
            $(this).parent().parent().find('.reply-wrap').show();
        } else {
            $(this).text('展开回复')
            $(this).parent().parent().find('.reply-wrap').hide();
        }
    });
    $(document).on('click','.reply-btn',function(){
        var contentDiv=$(this).parent().find('.share-input');
        var addTo=$(this).parent().parent().find('.reply-list');
        var replyWrap=$(this).parent();
        var wordChange=$(this).parent().parent().find('#discussDetail>a');
        $.ajax({
            url: '/doReply',
            type: 'post',
            data: {
                shareId: getParam.shareId,
                commentId:$(this).attr('data-commentId'),
                content:$(this).parent().find('.share-input').text()
            },
            success: function (data) {
                console.log(data);
                if(data.success==1){
                    contentDiv.text('');
                    var replyHTML='<div class="reply-detail">'+
                        '<div class="replay-user">'+data.user.portraitUrl+'</div>'+
                        '<div class="reply-userName">'+data.user.userName+'</div>'+
                        '<div class="reply-time">'+moment(data.reply.created).format("YYYY-MM-DD HH:mm:ss")+'</div>'+
                        '<div class="reply-content">'+data.reply.content+'</div></div>';
                    addTo.append(replyHTML);
                    replyWrap.hide();
                    wordChange.text('展开回复');
                }
            }
        })
    })
})