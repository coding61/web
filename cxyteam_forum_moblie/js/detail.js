$(document).ready(function() {
	var basePath="/program_girl";
	var toUserId=0;
	var replyId=0;
	var replyPage = 1;
	var postUserName;
	/*var postId=170;
	var userName="二十二";*/
	//var token='f0b3897f26417c66c27d6e782724317010694cdc';
	document.addEventListener('message', function(e) {
    	json=JSON.parse(e.data);
    	token=json.token;
    	postId=json.pk;

    	$.ajax({
	        url: basePath+"/userinfo/whoami/",
	        type: 'get',
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:null,
	        success: function(result){
	        	userName=result.name;
	        },
	        error:function(XMLHttpRequest){
	        	alert(XMLHttpRequest)
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("");
	        	}else{
	        		layer.msg("暂未登录")
	        	}
	        }
		});
    	postDetail();
    	getReplys(replyPage);
    })
    /* initDetail();
    function initDetail(){
        setTimeout(postDetail,500);//获取主帖详情
    }
    getReplys(replyPage);*/
//主贴详情信息
function postDetail() {
	$.ajax({
        url: basePath+"/forum/posts/"+postId+"/",
        type: "get",
        data:null,
        success: function(result){
        	zoneId=result.section.pk;
			postUserName=result.userinfo.name;
			$(".forum_types").text("["+result.types.name+"]");
			$(".forum_title").text(result.title);
			$(".info >img").attr("src",dealWithAvatar(result.userinfo.avatar));
			$(".main_forum_reply").attr({"data-id":result.pk,'data-user-id':result.userinfo.pk});
			$(".info >p").text(result.userinfo.grade.current_name);
			$(".info_name").prepend(result.userinfo.name);
			$('.post_content').each(function(){
			    $(this).html(this_fly.content(result.content));
			});
			$(".forum_time").append('<em class="posContentDate">'+dealWithTime(result.create_time)+'</em>');
			if(postUserName==userName){
				$("#reply_detele").append('<p type="del" onclick="delPost()" class="post_del">删除此帖</p>');
				if (result.status == 'unsolved') {
					$('#forum_tag').append('<div><span class="solved" id="solved" style="color:#FF69B4">标记为已解决</span><span class="finish" id="finish" style="color:#FF69B4;margin-left: 20px;">关闭问题</span></div>');
				}else if(result.status == 'solved'){
                    $("#forum_tag").append('<div><span class="unsolved" id="unsolved">标记为未解决</span>');
				}else if(result.status == 'finish'){
                    $("#forum_tag").append('<div><span class="unsolved" id="unsolved">标记为未解决</span>');
                }
			}
			if (result.collect) {
				$(".collectBtn").attr({"src": 'img/hadCollect.png'});
			} else {
				$(".collectBtn").attr({"src": 'img/unCollect.png'});
			}
			$(".replyCount").text((result.reply_count));
			$(".browseTime").text(result.browse_count);
			 
			if(result.istop){$(".fly-tip-stick").css("display","inline-block");}
			if(result.isessence){$(".fly-tip-jing").css("display","inline-block");}
        },
        error:function(XMLHttpRequest){
        	if(XMLHttpRequest.status==403){
        		layer.msg("请求异常");
        	}else{
        		layer.msg("请求异常")
        	}
        }
  });
}

$('.post_content').on('click','img',function () {
	console.log($(this))
    ImgZoomIn($(this))
})
$('.post_reply').on('click','img',function () {
	console.log($(this))
	ImgZoomIn($(this))
})
function ImgZoomIn (param) {
	var _this=param
        bgstr = '<div id="ImgZoomInBG" style=" background:#000000; filter:Alpha(Opacity=70); opacity:0.7; position:fixed; left:0; top:0; z-index:10000; width:100%; height:100%; display:none;"><iframe src="about:blank" frameborder="5px" scrolling="yes" style="width:100%; height:100%;"></iframe></div>';
        imgstr = '<img id="ImgZoomInImage" src="' + _this.attr('src')+'" onclick=$(\'#ImgZoomInImage\').hide();$(\'#ImgZoomInBG\').hide(); style="cursor:pointer; display:none; position:absolute; z-index:10001;" />';
        if ($('#ImgZoomInBG').length < 1) {
            $('body').append(bgstr);
        }
        if ($('#ImgZoomInImage').length < 1) {
            $('body').append(imgstr);
        }
        else {
            $('#ImgZoomInImage').attr('src', _this.attr('src'));
        }
        $('#ImgZoomInImage').css('left', $(window).scrollLeft() + ($(window).width() - $('#ImgZoomInImage').width()) / 2);
        $('#ImgZoomInImage').css('top', $(window).scrollTop() + ($(window).height() - $('#ImgZoomInImage').height()) / 2);
        $('#ImgZoomInBG').show();
        $('#ImgZoomInImage').show();
    };
function getReplys(page){
	myAjax2(basePath+"/forum/replies/","get",{"posts":postId,"page":page},function(result) {
		if (page == 1) {
			$("#jieda").empty();
		}
		var html = template("post_reply_template", result);
		$('#jieda').append(html);
		$('#jieda .post_content').each(function(user){
		    for (var i = 0; i < result.results.length; i++) {
		    	if (result.results[i].pk == $(this).attr("data-pk")) {
		    		$(this).html(this_fly.content(result.results[i].content));
		    		if(result.results[i].userinfo.name==userName){
					    $(this).append('<span type="del" class="huifuDel" data-pk='+result.results[i].pk+'>删除</span>');
					}
		    	}
		    }
		});
		$('.detail-about #replyWai').each(function() {
			if ($(this).children('.replyNei').length == 0) {
				$(this).css({"border": 'none'});
			}
		})
		if (result.next) {
			$("#jieda").append('<a class="moreReply">点击加载更多</a>');
		}
		setTimeout(function() {
			$('.layui-form ').show();
			$('.post_reply').children('.post_user').each(function() {
			})
		}, 1000)
	});
}
function changePostStatus(status) {
	$.ajax({
	        url: basePath+"/forum/posts/"+postId+"/",
	        type: "patch",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:{"status":status},
	        success: function(result) {
				if(result){
					setTimeout("window.location.reload()",100);
				}else{
					layer.msg("标记未成功");
				}
			},
	        error:function(XMLHttpRequest){
	        	
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}
$(document).on('click', '.solved', function(event) {
	event.preventDefault();
	changePostStatus('solved');
	
});
$(document).on("click",".finish",function(event){
        event.preventDefault();
        changePostStatus('finish');
    })
// 标记为未解决
$(document).on("click",".unsolved",function(event){
        event.preventDefault();
        changePostStatus('unsolved');
    })


$(document).on('click', '.post_del', function(event) {
	event.preventDefault();
	delPost();
	
});
$(document).on('click', '.huifuDel', function(event) {
	event.preventDefault();
	var id=$(this).attr("data-pk");
	deleteReplyById(id);
	
});
//提交回帖
$(document).on("click",".postReply_btn",function() {
	var content=$("#copy_reply_content").val();
	if(!content) {
		layer.msg("请输入回复内容");
		return false;
	}else {
		$(".copy_reply_textarea").attr({"disabled": true});
		postReplyAdd();
	}
})
//提交回复回复
$(document).on("click",".postReplyMore_btn",function() {
	var content=$("#copy_reply_content").val();
	toUserId=$(this).attr("data-user-id");
	replyId=$(this).attr("data-id");
	if(!content) {
		layer.msg("请输入回复内容");
		return false;
	}else {
		$(this).attr({"disabled": true});
		postReplyMoreAdd();
	}
});
//点击回复
$(document).on("click",".question_reply",function(){
	if($(this).parent().next(".copy_reply_textarea").length>0){//如果存在
		return;
	}
	if($(".copy_reply_textarea").length>0){
		if($("#copy_reply_content").val()!=null&&$.trim($("#copy_reply_content").val())!=""){
			if(confirm("确定要放弃正在编辑的回复？")){
				$(".copy_reply_textarea").remove();
			}else{
				return;
			}
		}else{
			$(".copy_reply_textarea").remove();
		}
	}
	var htm='<div class="copy_reply_textarea">'
				+'<div class="layui-form layui-form-pane">'
					+' <div class="layui-form-item layui-form-text">'
						+'<div class="layui-input-block">'
							+' <textarea id="copy_reply_content" name="content" required lay-verify="required" placeholder="回复帖子"  class="layui-textarea fly-editor" style="height: 100px;"></textarea>'
						+'</div>'
					+'</div>'
					+'<div class="layui-form-item">'
						+'<input type="hidden" name="jid" value="0">'
						+'<button class="layui-btn btn-left postReplyMore_btn" lay-filter="*" lay-submit data-user-id="'+$(this).attr("data-user-id")+'" data-id="'+$(this).attr("data-id")+'">回复</button>'
					+'</div>'
				+'</div>'
			+'<div>';
	$(".layui-form-pane .fly-edit").remove();
	$("#main").append(htm)
	my_init();
});
//点击主贴回复
$(document).on("click",".main_forum_reply",function(){
	if($(this).parent().next(".copy_reply_textarea").length>0){//如果存在
		return;
	}
	if($(".copy_reply_textarea").length>0){
		if($("#copy_reply_content").val()!=null&&$.trim($("#copy_reply_content").val())!=""){
			if(confirm("确定要放弃正在编辑的回复？")){
				$(".copy_reply_textarea").remove();
			}else{
				return;
			}
		}else{
			$(".copy_reply_textarea").remove();
		}
	}
	var htm='<div class="copy_reply_textarea">'
				+'<div class="layui-form layui-form-pane">'
					+' <div class="layui-form-item layui-form-text">'
						+'<div class="layui-input-block">'
							+' <textarea id="copy_reply_content" name="content" required lay-verify="required" placeholder="回复帖子"  class="layui-textarea fly-editor" style="height: 100px;"></textarea>'
						+'</div>'
					+'</div>'
					+'<div class="layui-form-item">'
						+'<input type="hidden" name="jid" value="0">'
						+'<button class="layui-btn btn-left postReply_btn" lay-filter="*" lay-submit data-user-id="'+$(this).attr("data-user-id")+'" data-id="'+$(this).attr("data-id")+'">回复</button>'
					+'</div>'
				+'</div>'
			+'<div>';
	$(".layui-form-pane .fly-edit").remove();
	$("#main").append(htm)
	my_init();
});

template.helper("stringChange", function(e) {

	return this_fly.content(e);
})

template.helper("showReplyDel", function(name) {
	if (userName!=null&&(name==userName)) {
		return true;
	} else {
		return false;
	}
})

// 点击加载更多回帖
$(document).on("click",".moreReply",function() {
	replyPage = replyPage+1;
	getReplys(replyPage);
	$(".moreReply").remove();

})

//回复主贴
function postReplyAdd() {
	$.ajax({
	        url: basePath+"/forum/replies_create/",
	        type: "post",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:{"posts":postId,"content":$("#copy_reply_content").val()},
	        success: function(result) {
				if(result){
					setTimeout("window.location.reload()",100);
				}else{
					layer.msg("回帖异常");
				}
			},
	        error:function(XMLHttpRequest){
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("当前未解决的帖子数量过多，请先标记它们为已解决或已完成");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}
//回复帖子列表
function postReplyMoreAdd() {
	$.ajax({
	        url: basePath+"/forum/replymore_create/",
	        type: "post",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:{"replies":replyId,"content":$("#copy_reply_content").val()},
	        success: function(result) {

				if(result){
					layer.msg("回复成功");
					setTimeout("window.location.reload()",100);
				}else{
					layer.msg("回复异常");
				}
			},
	        error:function(XMLHttpRequest){
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}
// 经验动画
function growNumAnimate(result) {
	var preEx = $('.info .grade-value').text().split("/")[0];
	var experience = result.userinfo.experience-preEx;
	$(".grow-number-ani").remove();
    var growHtml = '<span class="grow-number-ani fadeInOut">经验 +'+experience+'</span>';
    $("body").append(growHtml);
}

//删除帖子
function delPost(){
	$.ajax({
	        url: basePath+"/forum/posts/"+postId+"/",
	        type: "DELETE",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:null,
	        success: function(result) {
	        	window.postMessage(200)
				layer.msg("删除成功");
			},
	        error:function(XMLHttpRequest){
	        	
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}
//删除回帖
function deleteReplyById(replyId){
	$.ajax({
	        url: basePath+"/forum/replies/"+replyId+"/",
	        type: "DELETE",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:null,
	        success: function(result) {
				layer.msg("删除成功");
				$(".reply_"+replyId).remove();
				setTimeout("window.location.reload()",100);
			},
	        error:function(XMLHttpRequest){
	        	
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}

//删除回复
function deleteReplymoreById(replymoreId){
	myAjax(basePath+"/forum/replymores/"+replymoreId+"/","DELETE",null,function(result){
		layer.msg("删除成功");
		$(".replymore_"+replymoreId).remove();
	});
}
$(document).on("click",".collectBtn",function(){
	$.ajax({
	        url: basePath+"/collect/collection/",
	        type: "put",
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:{"types": "posts","pk": postId},
	        success: function(result) {
				if (result.message == '取消收藏') {
					$(".collectBtn").attr({"src": 'img/unCollect.png'});
					layer.msg(result.message);
				} else if (result.message == '收藏成功') {
					$(".collectBtn").attr({"src": 'img/hadCollect.png'});
					layer.msg(result.message);
				}
			},
	        error:function(XMLHttpRequest){
	        	
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
})
//处理采纳
function updateIsAccept(id,isAccept){
	if(isAccept==1){//采纳
		var oid=$(".isAccept_active").attr("data-id");
				 if(oid){
				 myAjax(basePath+"/forum/replies_canceladopt/"+oid+"/","put",null,function(result1){
				 },false);
				 }
		myAjax(basePath+"/forum/replies_adopt/"+id+"/","put",null,function(result){
			 if(result){
				 $(".isAccept_active").addClass("isAccept").removeClass("isAccept_active");
				 $(".reply_"+oid).find(".jieda-accept").attr("onclick","updateIsAccept("+oid+",1)");
				 $(".reply_"+oid).find(".jieda-accept").text("采纳");
				 $(".reply_"+id).find(".isAccept").removeClass("isAccept").addClass("isAccept_active");
				 $(".reply_"+id).find(".jieda-accept").attr("onclick","updateIsAccept("+id+",0)");
				$(".reply_"+id).find(".jieda-accept").text("取消采纳");
				 layer.msg("已采纳");
			 }else{
				 layer.msg("操作失败");
			 }
		 });
	}else{//取消采纳
		myAjax(basePath+"/forum/replies_canceladopt/"+id+"/","put",null,function(result){
			if(result){
				$(".isAccept_active").addClass("isAccept").removeClass("isAccept_active");
				$(".reply_"+id).find(".jieda-accept").attr("onclick","updateIsAccept("+id+",1)");
				$(".reply_"+id).find(".jieda-accept").text("采纳");
				layer.msg("已取消采纳");
			}else{
				layer.msg("操作失败");	
			}
		 });
	}
}
// 鼠标滑过
// 发布帖子
$('.jie-add1').unbind('mouseover').mouseover(function() {
	$('.jie-add1').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
}).unbind('mouseout').mouseout(function(){
    $(".jie-add1").css({"border": "none", "color": "#4c4c4c"})
})
// 返回列表
$('.jie-add').unbind('mouseover').mouseover(function() {
	$('.jie-add').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
}).unbind('mouseout').mouseout(function(){
    $(".jie-add").css({"border": "none", "color": "#4c4c4c"})
})

});


