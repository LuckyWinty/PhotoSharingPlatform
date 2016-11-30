$(document).ready(function(){
	$('#share-input').keyup(function(e){
		var maxlen=100;//最大字数
		var remlen;//剩余字数
		var content=$('#share-input').text();//获取内容
		var len=content.length;//当前对象的长度
		if(len>maxlen){
			$('#share-input').html(content.substring(0,maxlen));
		}else{
			remlen=maxlen-len;
			$('#shareRemlen').html(remlen);
		}
	})
})
