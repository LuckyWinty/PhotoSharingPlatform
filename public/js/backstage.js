(function(){
	var userM=document.getElementById('userManagement');
	var shareM=document.getElementById('shareManagement');
	var userB=document.getElementById('userBlock');
	var shareB=document.getElementById('shareBlock');
	userM.addEventListener('click',function(){
		userB.style.display="block";
		shareB.style.display="none";
	})
	shareM.addEventListener('click',function(){
		userB.style.display="none";
		shareB.style.display="block";
	})
})()
