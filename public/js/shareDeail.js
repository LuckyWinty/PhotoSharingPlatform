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
                    praise.find('span').text(data.likeNum);
                }
            }
        })
    })
    //评论
    $('#comment-btn').click(function(){
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
                      '<img src="/img/woman.png">'+
                      '<strong>'+data.user.userName+'</strong>'+data.comment.content+
                      '</div><div id="discussDetail">'+
                      '<span>'+moment(data.comment.created).format("YYYY-MM-DD HH:mm:ss")+'</span>'+
                      '<a class="reply">回复</a></div></div>';
                  $('#discussion').append(commentHTML);
              }

            }
        })
    })

})
