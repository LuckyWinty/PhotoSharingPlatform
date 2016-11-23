(function(){
	var head=document.getElementById('head');
	head.addEventListener('click',function(e){
		if(e.target.className!="active"&&e.target.nodeName=="A"){
			for(var i=0;i<e.target.parentNode.childNodes.length;i++){
				e.target.parentNode.childNodes[i].className="";
			}
			e.target.className="active";
		}
	})
})()
