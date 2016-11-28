/**
 * Created by winty on 2016/11/24.
 */
$(function(){
    var getParam=new UrlSearch();
    //点赞
    $('#praise').click(function(){
        var praise=$('#praise');
        var isLike;
        var userid=$('#personal').attr('data-userid');
        if($(this).hasClass('active')){
            isLike='0';
        }else{
           isLike='1';
        }
        $.ajax({
            url:'/doLike',
            type:'post',
            data:{
                isLike:isLike,
                shareId:getParam.shareId,
                userId:userid
            },
            success:function(data){
                console.log(data.isLike)
                if(data.success==1){
                    if(data.isLike==1){
                        praise.addClass('active');
                    }else{
                        praise.removeClass('active');
                    }
                    praise.find('span').text('赞('+data.likeNum+')');
                }else{
                    alert(data.message);
                }
            }
        })
    })
    //评论
    $('#comment-btn').click(function(){
        var commentN=$('#comment>span').attr('data-num');
        var comment=$('#share-input');
        var userid=$('#personal').attr('data-userid');

        $.ajax({
            url:'/doComment',
            type:'post',
            data:{
                comment:comment.text(),
                shareId:getParam.shareId,
                userId:userid
            },
            success:function(data){
              if(data.success==1){
                  comment.text('');
                  var commentHTML='<div id="discussList" class="clearfix">'+
                      '<div id="discussContent" class="clearfix">'+
                      '<a href="/user?userId='+data.user._id+'"><img src="/image?imageId=' + data.user.portraitUrl+'")</a>'+
                      '<a href="/user?userId='+data.user._id+'"><strong>'+data.user.userName+'</strong></a>'+data.comment.content+
                      '</div><div id="discussDetail">'+
                      '<span>'+moment(data.comment.created).format("YYYY-MM-DD HH:mm:ss")+'</span>'+
                      '<a class="reply">回复</a></div></div>';
                  $('#discussion').append(commentHTML);
                  commentN++;
                  $('#comment>span').text('评论('+commentN+')');
              }else{
                  alert(data.message);
              }

            }
        })
    })

    $('#collect').click(function(){
        var collect=$('#collect');
        var isCollect;
        var userid=$('#personal').attr("data-userid");
        if($(this).hasClass("active")){
            isCollect='0';
        }else{
            isCollect='1';
        }
        $.ajax({
            url:'/doCollect',
            type:'post',
            data:{
                isCollect:isCollect,
                shareId:getParam.shareId,
                userId:userid
            },
            success:function(data){
                console.log(data.isCollect);
                if(data.success==1){
                    if(data.isCollect==1){
                        collect.addClass('active');
                    }else{
                        collect.removeClass('active');
                    }
                    collect.find('span').text('收藏('+data.CollectNum+')');
                }else{
                    alert(data.message);
                }
            }

        })    
    })

})
