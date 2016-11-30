$(document).ready(function () {
	var pics=[];
	var i=0;
	
	$('#picsPanel #row img').each(function(){
		pics.push($(this).attr('src'));
	})
	var l=pics.length;
	
	$('#picsPanel #row img').each(function(){
		$(this).click(function(){
			var k=parseInt($(this).attr('value'));
				$('#picsPanel #big').attr('src',pics[k]);
		});
	})

	$('#left').click(function(){
		var j=parseInt($('#picsPanel #big').attr('value'));
		if(j<l-1){
				$('#picsPanel #big').attr('src',pics[j+1]);
				$('#picsPanel #big').attr('value',j+1);
			}
			else{
				$('#picsPanel #big').attr('src',pics[0]);
				$('#picsPanel #big').attr('value',0);
			}
	})

	$('#right').click(function(){
		var j=parseInt($('#picsPanel #big').attr('value'));
		if(j>0){
				$('#picsPanel #big').attr('src',pics[j-1]);
				$('#picsPanel #big').attr('value',j-1);
			}
			else{
				$('#picsPanel #big').attr('src',pics[5]);
				$('#picsPanel #big').attr('value',5);
			}
	})

})