window.onload = function(){
	$('#pic_form').submit(function(e){
		var data = new FormData($('#pic_form')[0]);

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
}