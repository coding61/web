// setCookie("Token","f398c224a8a052bb9ba5fe278acb1128043bfd8e");
// setCookie("username","15007065503");
// setCookie("nickname","豆平");
// setCookie("password","15007065503");
var basePath="/program_girl";
var rankingHadClick = false;
bbsZone();
myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
	if(result){
		$('.avatar img').attr({src: result.avatar});//用户头像
		$('.info .grade').html(result.grade.current_name);//用户段位等级
		$('.info .grade-value').html(result.experience + '/' + result.grade.next_all_experience);
		$('.zuan span').html("x"+result.diamond);
		var wid = $(".info-view").width();
		var percent = (parseInt(result.experience)-parseInt(result.grade.current_all_experience))/(parseInt(result.grade.next_all_experience)-parseInt(result.grade.current_all_experience))*$(".info-view").width();
        $(".progress img").css({
            width:percent
        })
	}else{
	}
})

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
					v.newposts.title = v.newposts.title.replace(/</g,'&lt;');
					v.newposts.title = v.newposts.title.replace(/>/g,'&gt;');
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

// 鼠标划过排行榜
// $(".right-view .ranking").unbind('mouseover').mouseover(function(){
//     getRanking();
// }).unbind('mouseout').mouseout(function(){
//     $('.rankingView').hide();
// })

$(".right-view .ranking").click(function() {
	if (rankingHadClick) {
		// 隐藏排名
		$('.rankingView').hide();
		rankingHadClick = false;
	} else {
		rankingHadClick = true;
		getRanking();
	}
})

function getRanking() {
	myAjax(basePath+"/userinfo/userinfo/diamond/ranking/","get",null,function(result) {
		if(result){
			var arr = {results:[]};
			for (var i = 0; i < result.results.length; i++) {
				arr.results.push(result.results[i]);
			}
			for (var i = 0; i < result.results.length; i++) {
				arr.results.push(result.results[i]);
			}
			// 显示排名
			$('.rankingView').show();
			var html = template("rankList-template", result);
			$('.rankList').html(html);
			var a = $(".ranking").offset().left;
			var b = $(".right-view").offset().left;
			var c = $(".rankingView").width();
			$(".rankingView").css({
                            left: (a-b-c/2)+30 + "px"
			})
		}else{
		}
	})
}
