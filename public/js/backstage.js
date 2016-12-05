(function(){
	$('.btn').click(function(e){
		var target = $(e.target);
		var userId = target.data('id');
		userId = userId.substring(1,userId.length-1);
		//console.log(userId);
		
		$.ajax({
			type: 'POST',
			url: '/back/shield',
			data: {userId: userId},
			dataType: "json"
		})
		.done(function(results){
			console.log(results);
			
			if (results.success == 1) {
				var tr = $('.item-id-' + userId).eq(0);
				var shield = $(tr).find('.shield').eq(0);
				var btn = $(tr).find('.btn').eq(0);

				if (results.isPublic == true) {
					$(shield).html("否");
					$(btn).attr('class', 'btn btn-danger');
					$(btn).html("屏蔽");
				} else {
					$(shield).html("是");
					$(btn).attr('class', 'btn btn-success');
					$(btn).html("解除屏蔽");
				}
			}else {
				console.log(results.message);
			}
		})
	})
})();
