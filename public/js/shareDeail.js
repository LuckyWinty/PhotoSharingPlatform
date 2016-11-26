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
                    collect.find('span').text(data.CollectNum);
                }
            }

        })    
    })

})
