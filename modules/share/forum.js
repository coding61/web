var basePath="/program_girl";
var postPk=getQueryString("pk");
var replyPage = 1;

initDetail();
function initDetail(){
	postDetail();
}
function postDetail() {
	myAjax(basePath+"/forum/posts/"+postPk+"/","get",null,function(result) {
		console.log(result);
		if (result) {
			$(".forum-status").text("[" + result.status_display + "]");
			if (result.status_display == '未解决') {
				$(".forum-status").css({"color": 'red'});
			} else if (result.status_display == '已解决') {
				$(".forum-status").css({"color": '#777'});
			} else if (result.status_display == '已关闭') {
				$(".forum-status").css({"color": '#777'});
			}
			$(".forum-title").text(result.title);

			$(".left-view .head").attr("src",dealWithAvatar(result.userinfo.avatar));
			$(".left-view .grade").text(result.userinfo.grade.current_name);
			$(".right-view .name").text(result.userinfo.name);
			$(".right-view .time").text(dealWithTime(result.create_time));
			$(".right-view .type").text("[" + result.types.name +"]");

			// if (result.userinfo.is_staff) {
			// 	$('.manager').show();
			// }forum-content
			if (result.userinfo.top_rank && result.userinfo.top_rank == 'Top10') {
				$('.post-user .top').css({"height": "20px", "background-image": "url(../../cxyteam_forum/img/top10.png)"});
			} else if (result.userinfo.top_rank && result.userinfo.top_rank == 'Top50') {
				$('.post-user .top').css({"height": "20px", "background-image": "url(../../cxyteam_forum/img/top50.png)"});
			} else if (result.userinfo.top_rank && result.userinfo.top_rank == 'Top100') {
				$('.post-user .top').css({"height": "20px","background-image": "url(../../cxyteam_forum/img/top100.png)"});
			}

			$('.forum-content').each(function(){
			    $(this).html(this_fly.content(result.content));
			});

			$(".forum-reply").text("回帖数量（" + result.reply_count + "）");

			getReplys(replyPage);//获取评论回复
		} else {
			layer.msg('请求异常');
		}
	})
}
function getReplys(page){
	myAjax2(basePath+"/forum/replies/","get",{"posts":postPk,"page":page},function(result) {
		if (page == 1) {
			$("#jieda").empty();
		}
		console.log(result);
		var _htm="";
		// 改的要死了
		$.each(result.results,function(k,v){
			_htm+='<li style="border: 1px solid red !important" data-id="'+v.pk+'" class="jieda-daan reply_'+v.pk+'">'
				+'<div class="reply-userinfo">'
				+	'<div class="left-view">'
				+		'<img class="head" src=' + dealWithAvatar(v.userinfo.avatar) + '>'
				+		'<div class="grade">' + v.userinfo.grade.current_name + '</div>'
			    +	'</div>'
				+	'<div class="right-view">'
				+ 		'<div style="width: 100%; height: 50px; margin-top: 10px;">'
				+ 			'<div class="name">' + v.userinfo.name + '</div>'
				+ 			'<div class="time">' + dealWithTime(v.create_time) + '</div>'
				+ 		'</div>'
				+ 	'</div>'
				+'</div>'
				+'<div class="detail-body forum-content">'
				+	this_fly.content(v.content)
				+'</div>'
				+'<div class="reply_content">'
				+	'<ul jieda photos class="reply_mess">';
						$.each(v.replymore,function(k1,v1){
							_htm+=' <li style="background: #f2f3f4;" class="jieda-daan replymore_'+v1.pk+'">'
								+'<div class="name">' + v1.userinfo.name + '</div>'
				            	+'<span class="liveTime"  title="'+dealWithTime(v1.create_time)+'">'+dealWithTime(v1.create_time)+'</span>'
				            	+'<div class="detail-body forum-content">'
				            	+	this_fly.content(v1.content)
				            	+'</div>'
				            	+'</li >';
						});
			_htm+=	'</ul>'
				+'</div>'
				+'</li>';
		});
		$("#jieda").append(_htm);
		liveTimeAgo();
		if (result.next) {
			$("#jieda").append('<a class="moreReply">点击加载更多</a>');
		}
	});
}
