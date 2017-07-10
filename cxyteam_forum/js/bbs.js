// setCookie("Token","f398c224a8a052bb9ba5fe278acb1128043bfd8e");
// setCookie("username","15007065503");
// setCookie("nickname","豆平");
// setCookie("password","15007065503");
var basePath="/program_girl";
bbsZone();
localStorage.page = 1;
function bbsZone(){
	$("#bbs").empty();
	//var basePath="http://10.144.238.71:8080/wodeworld/";
	// var basePath="http://localhost:8080/api3/server";
	var html='';
	myAjax2(basePath+"/forum/sections/","get",null,function(result){
		//console.log(result);
		$.each(result.results,function(i,v){
			html+='<div class="col-xs-6 col-sm-6 bbsItem"><div class="media">'
				+ '<a class="media-left media-middle" href="bbsList.html?id='+v.pk+'">'
				+ '<img src="'+v.icon+'" alt="...">'
				+ '</a>'
				+ '<div class="media-body"><h5 class="media-heading">'
				+ '<a href="bbsList.html?id='+v.pk+'">'+v.name+'</a></h5>'
				+ '<ul class="list-unstyled"><li>帖数：'+v.total+'</li></ul>'
				+ '<ul class="list-unstyled lastUl">'
				if(v.newposts){
					var date =dealWithTime(v.newposts.create_time);
					html+=	'<li class="titleHandle">'    
						+ '<a href="detail.html?id='+v.newposts.pk+'&pk='+v.pk+'">'+v.newposts.title+'</a></li>'
					    +'<li class="liveTime" title="'+date+'" data-lta-value="'+date+'"></li><li>'+v.newposts.author+'</li>';
				}else{
					html+='<li>暂无</li>'
				}
				html+= '</ul></div></div></div>';
		})
		$("#bbs").append(html);
		liveTimeAgo();
	})
}
