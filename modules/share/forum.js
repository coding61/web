var basePath="/program_girl";
var postPk=getQueryString("pk");
var replyPage = 1;

initDetail();
function initDetail(){
	$(".collect, .comment, .download").click(function(){
		download();
	})
	postDetail();
}

function getProps(arr) {
	var dict = {'head': null, 'background': null};
	if (arr.length == 0) { return dict; }
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].action == 'background' && arr[i].status == 1) {
			if (arr[i].exchange_product.category_detail.desc) {
				dict.background = arr[i].exchange_product.category_detail.desc;
			}
		} else if (arr[i].action == 'avatar' && arr[i].status == 1) {
			if (arr[i].exchange_product.image) {
				dict.head = arr[i].exchange_product.image;
			}
		}
	}
	return dict;
}

function postDetail() {
	myAjaxInShare(basePath+"/forum/posts/"+postPk+"/","get",null,function(result) {
		if (result) {

			var head = getProps(result.userinfo.props).head,
				background = getProps(result.userinfo.props).background;
			if (head) {
				$('.head-bg').css({"background-image": "url(" + head + ")"});
			}
			if (background) {
				$('.userinfo').css({"background-color": background});
			}

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
	myAjaxInShare(basePath+"/forum/replies/","get",{"posts":postPk,"page":page},function(result) {
		if (page == 1) {
			$("#reply").empty();
		}
		var _htm="";
		// 改的要死了
		$.each(result.results,function(k,v){

			var head = getProps(v.userinfo.props).head,
				background = getProps(v.userinfo.props).background;
			head = head ? '"background-image: url(' + head + ')"' : "";
			background = background ? background : '#fff';

			_htm+='<li data-id="'+v.pk+'" class="reply-item">'
				+'<div class="reply-userinfo" style="background-color: ' + background + '">'
				+	'<div class="reply-left-view">'
				+ 		'<div class="reply-head-bg" style=' + head + '>'
				+			'<img class="reply-head" src=' + dealWithAvatar(v.userinfo.avatar) + '>'
				+ 		'</div>'
				+		'<div class="reply-grade">' + v.userinfo.grade.current_name + '</div>'
			    +	'</div>'
				+	'<div class="reply-right-view">'
				+ 		'<div style="width: 100%; height: 50px; margin-top: 10px;">'
				+ 			'<div class="name">' + v.userinfo.name + '</div>'
				+			'<div style="display: flex;">'
				+	 			'<div class="time">' + dealWithTime(v.create_time) + '</div>'
				+   			'<div class="comment" style="width:40px; height: 26px;">'
				+					'<img style="width: 20px;height: 18px;" src="../../statics/images/comment.png">'
				+   			'</div>'
				+			'</div>'
				+ 		'</div>'
				+ 	'</div>'
				+'</div>'
				+'<div class="detail-body reply-forum-content">'
				+	this_fly.content(v.content)
				+'</div>'
				+'<div class="reply-content">'
				+	'<ul class="reply-more">';
						$.each(v.replymore,function(k1,v1){
							_htm+=' <li style="background: #f2f3f4;" class="reply-more-'+v1.pk+'">'
								+'<div style="display:flex;">'
								+	'<div class="reply-name">' + v1.userinfo.name + '</div>'
				            	+	'<span class="reply-time">'+dealWithTime(v1.create_time)+'</span>'
								+   '<div class="comment" style="width:40px; height: 26px;">'
								+		'<img style="width: 20px;height: 18px;" src="../../statics/images/comment.png">'
								+   '</div>'
								+'</div>'
				            	+'<div class="reply-more-content">'
				            	+	this_fly.content(v1.content)
				            	+'</div>'
				            	+'</li >';
						});
			_htm+=	'</ul>'
				+'</div>'
				+'</li>';
		});
		$("#reply").append(_htm);
		liveTimeAgo();
		if (result.next) {
			$("#reply").append('<div class="more" style="width: 100%; text-align: center; background: #eee;">下载客户端查看更多评论</div>');
		}
		$(".head, .forum-content, .reply-head, .reply-forum-content, .reply-more-content, .comment, .more").unbind("click").click(function() {
			download();
		})
	});
}
