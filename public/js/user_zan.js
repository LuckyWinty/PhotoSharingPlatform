$(function(){

	$('.sharing_footer').delegate('.collect_block','click',function(){
		// var 
	})

	$('.sharing_footer').delegate('.praise_block','click',function(){
		var that=$(this);
		console.log(that);
		var isLike;
		var userid=$('#personal').attr('data-userid');
		if($(this).hasClass('active')){
			isLike='0';
		}else{
			isLike='1';
		}
		console.log( isLike, $(this).parent().parent().parent().parent('.sharing_div').attr('id'),userid);
		 $.ajax({
            url: '/doLike',
            type: 'post',
            data: {
                isLike: isLike,
                shareId:$(this).parent().parent().parent().parent('.sharing_div').attr('id'),
                userId: userid
            },
            success: function (data) {
                console.log(data.isLike)
                if (data.success == 1) {
                    if (data.isLike == 1) {
                        that.addClass('active');
                    } else {
                        that.removeClass('active');
                    }
                    that.find('span').text('赞(' + data.likeNum + ')');
                } else {
                    alert(data.message);
                }
            }
        })
	})
})