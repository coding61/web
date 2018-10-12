// setCookie("Token","f398c224a8a052bb9ba5fe278acb1128043bfd8e");
// setCookie("username","15007065503");
// setCookie("nickname","豆平");
// setCookie("password","15007065503");
var basePath="//app.cxy61.com/program_girl";
var rankingHadClick = false;
bbsZone();
// 进到程序媛计划
$('.logo1').click(function() {
	window.location.href = "../app/home/home.html"
})
// 打开儿童编程窗口
$('.logo2').click(function() {
	window.open("https://www.coding61.com");
})
$('.avatar .item').click(function() {
	window.location.href = "./RongYun.html"
})
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

myAjax(basePath+"/message/messages/","get",{"types":"forum","status":"unread"},function(result){
	if (result.count != 0) {
		$('.message').show();
		$('.message').html("您有"+result.count+"条消息未读！");
		var width = $('.container').css("width");
		var t = parseFloat(width)/2 + "px";
		$('.message').css({"width":width,"marginLeft":"calc(50% - "+t+")"});
	} else {
		$('.message').hide();
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
		if (result.next) {
			getmoreSection(result.next.split("program_girl")[1], result.results);
		} else {
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
					if (v.newposts.last_replied) {
						var date =dealWithTime(v.newposts.last_replied);
					} else {
						var date =dealWithTime(v.newposts.create_time);
					}
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
		}
		
	})
}

function getmoreSection(url, data) {
	myAjax2(basePath+url,"get",null,function(result) {
		$("#bbs").empty();
		var html='';
		for (var i = 0; i < result.results.length; i++) {
			data.push(result.results[i]);
		}
		if (result.next) {
			getmoreSection(result.next.split("program_girl")[1], data);
		} else {
			$.each(data, function(i,v){
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
					if (v.newposts.last_replied) {
						var date =dealWithTime(v.newposts.last_replied);
					} else {
						var date =dealWithTime(v.newposts.create_time);
					}
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
		}
	})
}

// 鼠标划过排行榜
// $(".right-view .ranking").unbind('mouseover').mouseover(function(){
//     getRanking();
// }).unbind('mouseout').mouseout(function(){
//     $('.rankingView').hide();
// })

// 点击消息
$('.message').click(function() {
	window.location.href = "message.html";
})

// 排行榜
$(".right-view .ranking").click(function() {
	if (rankingHadClick) {
		// 隐藏排名
		$('.rankingView').hide();
		rankingHadClick = false;
	} else {
		$('#loading').show();
		// 显示排名
		$('.rankingView').show();
		var a = $(".ranking").offset().left;
        var b = $(".right-view").offset().left;
        var c = $(".rankingView").width();
        $(".rankingView").css({
            left: (a-b-c/2)+20 + "px"
        })
		rankingHadClick = true;
		getRanking();
	}
})

function getRanking() {
	myAjax(basePath+"/userinfo/userinfo/diamond/ranking/","get",null,function(result) {
		if(result){
			$('.rankList').empty();
			var html = template("rankList-template", result);
			$('.rankList').html(html);
			$('#loading').hide();
			var a = $(".ranking").offset().left;
            var b = $(".right-view").offset().left;
            var c = $(".rankingView").width();
            $(".rankingView").css({
                left: (a-b-c/2)+20 + "px"
            })
		}else{
		}
	})
}
