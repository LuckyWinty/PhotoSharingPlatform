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

})
