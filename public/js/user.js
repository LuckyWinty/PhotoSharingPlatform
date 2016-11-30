window.onload = function(){
	$('#pic_form').submit(function(e){
		var data = new FormData($('#pic_form')[0]);
		console.log(data);

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/user',
			data: data,
			contentType: false,  
			processData: false
		})
		.done(function(results){
			if (results.success == 1) {
				//console.log(results.img);
				$('#user_pic_lg img')[0].src = '/image?imageId=' + results.img;
				$('#user_pic_sm img')[0].src = '/image?imageId=' + results.img;
			}
		})

		return false;
	});

	$('#share_form').submit(function(e){
		var inputImg = document.getElementById('inputImg');
		var imgLen = inputImg.files.length;
		console.log(imgLen);
		var textarea = document.getElementById('share_content');
		if (textarea.value == '') {
			alert('分享内容不能为空哦~');
			return false;
		}

		if (imgLen >= 1 && imgLen <= 6) {
			var data = new FormData($('#share_form')[0]);
			console.log(data);

			$.ajax({
				type: 'POST',
				data: data,
				dataType: 'json',
				url: '/user/declare',
				contentType: false,  
				processData: false
			})
			.done(function(results){
				console.log(results);
				if (results.success == 1) {
					console.log("ok");
					window.location.href = '/share?shareId=' + results.share._id;


					/*textarea.value = '';

					var sharing_div = document.createElement('div');
					sharing_div.id = results.share._id;
					sharing_div.className = 'sharing_div';

					//头像部分
					var sharing_user_pic = document.createElement('a');
					sharing_user_pic.href = '/user?userId=' + results.share.userId._id;
					sharing_user_pic.className = 'sharing_user_pic';
					var sharing_user_pic_img = document.createElement('img');
					if (results.share.userId.portraitUrl) {
						sharing_user_pic_img.src = '/image?imageId=' + results.share.userId.portraitUrl;
			        }else {
			        	sharing_user_pic_img.src = '../img/user/user.jpg';
			        }
			        sharing_user_pic.appendChild(sharing_user_pic_img);
			        sharing_div.appendChild(sharing_user_pic);

			        //内容部分
			        var sharing_content = document.createElement('div');
			        sharing_content.className = 'sharing_content';
			        //用户名
			        var share_content_a = document.createElement('a');
			        share_content_a.href = '/user?userId=' + results.share.userId._id;
			        var share_content_a_h4 = document.createElement('h4');
			        share_content_a_h4.className = 'sharing_user_name';
			        share_content_a_h4.innerHTML = results.share.userId.userName;
			        share_content_a.appendChild(share_content_a_h4);
			        sharing_content.appendChild(share_content_a);
			        //时间
			        var sharing_time = document.createElement('div');
			        sharing_time.className = 'sharing_time';
			        sharing_time.innerHTML = moment(results.share.created).format("YYYY-MM-DD HH:mm:ss");
			        sharing_content.appendChild(sharing_time);
			        //内容
			        var sharing_text = document.createElement('p');
			        sharing_text.className = 'sharing_text';
			        sharing_text.innerHTML = results.share.content;
			        sharing_content.appendChild(sharing_text);
					//图片展示
					if (results.share.images.length == 1){
						var picPanel = document.createElement('div');
						picPanel.id = 'picPanel';
						var picPanel_img = document.createElement('img');
						picPanel_img.src = '/image?imageId=' + results.share.images[0];
						picPanel_img.id = 'singlePic';
						picPanel.appendChild(picPanel_img);
						sharing_content.appendChild(picPanel);
					}else {
						var picsPanel = document.createElement('div');
						picsPanel.id = 'picsPanel';
						var picsPanel_img = document.createElement('img');
						picsPanel_img.src = '/image?imageId=' + results.share.images[0];
						picsPanel_img.id = 'singlePic';
						picsPanel.appendChild(picsPanel_img);
						var picsPanel_row = document.createElement('div');
						picsPanel_row.id = 'row';
						for (var i = 1; i < results.share.images.length; i++) {
							var imgItem = document.createElement('img');
							imgItem.id = 'singlePic';
							imgItem.src = '/image?imageId=' + results.share.images[i];
							picsPanel_row.appendChild(imgItem);
						}
						picsPanel.appendChild(picsPanel_row);
						sharing_content.appendChild(picsPanel);
					}
					sharing_div.appendChild(sharing_content);

					//footer部分
					var sharing_footer = document.createElement('div');
					sharing_footer.className = 'sharing_footer';
					var sharing_footer_ul = document.createElement('ul');
					//赞
					var sharing_footer_li_1 = document.createElement('li');
					if (results.isLike == true) {
			        	sharing_footer_li_1.innerHTML = '<a class="praise_block active"><span><span>赞('+ results.share.likeNum +')</span></span></a>';
			        }else {
			        	sharing_footer_li_1.innerHTML = '<a class="praise_block"><span><span>赞('+ results.share.likeNum +')</span></span></a>';
			        }
			        sharing_footer_ul.appendChild(sharing_footer_li_1);
			        //评论
			        var sharing_footer_li_2 = document.createElement('li');
			        sharing_footer_li_2.innerHTML = '<a href="/share?shareId='+ results.share._id +'" class="comment_block"><span><span>评论('+ results.share.comment.length +')</span></span></a>';
			        sharing_footer_ul.appendChild(sharing_footer_li_2);
			        //收藏
			        var sharing_footer_li_3 = document.createElement('li');
			        if (results.isCollect == true) {
			        	sharing_footer_li_3.innerHTML = '<a class="collect_block active"><span><span>收藏('+ results.share.collectionNum +')</span></span></a>';
			        }else {
			        	sharing_footer_li_3.innerHTML = '<a class="collect_block"><span><span>收藏('+ results.share.collectionNum +')</span></span></a>';
			        }
			        sharing_footer_ul.appendChild(sharing_footer_li_3);
			        sharing_footer.appendChild(sharing_footer_ul);
			        sharing_div.appendChild(sharing_footer);


			        var user_display = document.getElementById('user_display');
					var user_display_block = user_display.querySelectorAll('#user_display_block')[0];
					if (user_display_block) {
						var sharing_div_first = user_display_block.querySelectorAll('.sharing_div')[0];
						user_display_block.insertBefore(sharing_div,sharing_div_first);
					}else {
						user_display.className = '';
						user_display.innerHTML = '';

						user_display_block = document.createElement('div');
						user_display_block.id = 'user_display_block';
						user_display_block.appendChild(sharing_div);

						user_display.appendChild(user_display_block);
					}*/

				}
			})
		}else if (imgLen < 1) {
			alert("至少要分享1张图片哦~");
		}else {
			alert("最多只能分享6张图片哦~");
		}
		return false;
	})

	/*$("#share_content").keyup(function(e){
		var maxLen = 10;
		var obj = e.target;
		var len = obj.value.length;
		var bet = 0;  //字节数
		var str = 0;  //汉字个数
		for(var i=0; i<len; i++){
			//[^\x00-\xff]全角字符 //[\u4e00-\u9fa5]汉字
			var pattern = /[^\x00-\xff]/;
			if (pattern.test(obj.value[i])) {
				bet+=2; //全角字符加2
				str++;
			}else {
				bet++; //半角加1
			}
		}
		if (bet > maxLen) {
			obj.value = obj.value.substring(0,maxLen-str); //超出时截取100字符
		}else{
			var remlen = maxLen-bet;
			$('#input_num')[0].innerHTML = remlen;
		}
	})*/

	$("#share_content").keyup(function(e){
		var maxLen = 300;  //最大字符个数
		var obj = e.target;
		var len = obj.value.length;  //当前已用字符数
		if (len > maxLen) {
			obj.value = obj.value.substring(0,maxLen); //超出时截取掉字符
		}else{
			var remlen = maxLen-len;
			$('#input_num')[0].innerHTML = remlen;
		}
	})

	$('#ignore').click(function(e){
		var obj = e.target;

		$.ajax({
			url: '/user/ignore',
			type: 'GET',
			dataType: 'json'
		})
		.done(function(results){
			if (results.success === 1) {
				if (results.isPublic === true) {
					obj.innerHTML = "屏蔽";
				}else {
					obj.innerHTML = "已屏蔽";
				}
			}
		})
	})

	$('#concern').click(function(e){
		var obj = e.target;
		var isConcern; //表示是否关注
		if (obj.innerHTML === '关注我') {
			isConcern = false;
		}else {
			isConcern = true;
		}
		var userId = $('#user_pic_lg').attr('data-userId');
		var data = {
			userId: userId,
			isConcern: isConcern
		};
		console.log(data);


		$.ajax({
			url: '/user/focus',
			type: 'POST',
			dataType: 'json',
			data: data
		})
		.done(function(results){
			if (results.success === 1) {
				if (results.isConcern === true) {
					obj.innerHTML = "取消关注";
				}else {
					obj.innerHTML = "关注我";
				}
				console.log(results.message);
			}else{
				console.log(results.message);
			}
		})
	})
}
