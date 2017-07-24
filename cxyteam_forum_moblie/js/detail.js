//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
// var ArtTemplate = require("../../libs/template.js");
var basePath="/program_girl";
var postId=170;
var postPk=getQueryString("pk");
var zoneId=0;
var toUserId=0;
var replyId=0;
var replyPage = 1;
$('.jie-add1').unbind().click(function(){
	window.location.href="add.html?pk="+postPk;
});

//var user= JSON.parse(sessionStorage.getItem("session_user"));
	$.ajax({
	        url: basePath+"/userinfo/whoami/",
	        type: 'get',
	        headers: {
	            Authorization: 'Token ' + '7bf60add8fa1a96c75ea214afc0e6173478cece1'
	        },
	        data:null,
	        success: function(result){
	        	localStorage.userName=result.name;
	        },
	        error:function(XMLHttpRequest){
	        	console.log(XMLHttpRequest.status)
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
/*myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
	if(result){
		localStorage.userName=result.name;
		$('.avatar img').attr({src: result.avatar});//用户头像
		$('.info .grade').html(result.grade.current_name);//用户段位等级
		$('.info .grade-value').html(result.experience + '/' + result.grade.next_all_experience);
		$('.zuan span').html("x"+result.diamond);
		var percent = (parseInt(result.experience)-parseInt(result.grade.current_all_experience))/(parseInt(result.grade.next_all_experience)-parseInt(result.grade.current_all_experience))*$(".info-view").width();
        $(".progress img").css({
            width:percent
        })
	}else{
		localStorage.userName=null;
	}
})*/
/*

var postUserName;*/
initDetail();
function initDetail(){
	setTimeout(postDetail,200);//获取主帖详情
	//addBrowseTime();
}
//提交回帖
$(".postReply_btn").click(function() {
	var content=$("#L_content").val();
	if(!content) {
		layer.msg("请输入回复内容");
		return false;
	}else {
		$(".postReply_btn").attr({"disabled": true});
		postReplyAdd();
	}
	
})
//提交回复
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
/*	$(this).parent().after(htm);

	$('.post_reply').children('.post_user').each(function() {
		var rightContentHeight = $(this).children('.rightContent').css("height");
		var leftHeight = parseFloat(rightContentHeight) + 50;
		$(this).children('.jie-user').css({"height": leftHeight+'px'});
	})*/
	my_init();
});

function postDetail() {
	myAjax2(basePath+"/forum/posts/"+postId+"/","get",null,function(result) {
		console.log(result);
		zoneId=result.section.pk;
		postUserName=result.userinfo.name;
		$(".callbackToList").attr("href","bbsList.html?id="+zoneId);
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
		if(localStorage.userName!=null&&postUserName==localStorage.userName){
			$(".post_user .post_content").append('<span type="del" onclick="delPost()" class="post_del">删除此帖</span>');
		}
		$(".replyCount").text((result.reply_count));
		$(".browseTime").text(result.browse_count);
		 
		if(result.istop){$(".fly-tip-stick").css("display","inline-block");}
		if(result.isessence){$(".fly-tip-jing").css("display","inline-block");}
		
		getReplys(replyPage);//获取评论回复
	})
}

template.helper("stringChange", function(e) {

	return this_fly.content(e);
})

template.helper("showReplyDel", function(name) {
	if (localStorage.userName!=null&&(name==localStorage.userName)) {
		return true;
	} else {
		return false;
	}
})

function getReplys(page){
	myAjax2(basePath+"/forum/replies/","get",{"posts":postId,"page":page},function(result) {
		if (page == 1) {
			$("#jieda").empty();
		}
		var html = template("post_reply_template", result);
		$('#jieda').append(html);
		$('#jieda .post_content').each(function(){
		    for (var i = 0; i < result.results.length; i++) {
		    	if (result.results[i].pk == $(this).attr("data-pk")) {
		    		$(this).html(this_fly.content(result.results[i].content));
		    		/*$(this).append('<span class="tieReply question_reply" data-user-id='+result.results[i].userinfo.pk+' data-id="'+result.results[i].pk+'">回复</span>');*/
		    		/*$(this).append('<em class="replyContentDate">'+dealWithTime(result.results[i].create_time)+'</em><span class="tieReply question_reply" data-user-id='+result.results[i].userinfo.pk+' data-id="'+result.results[i].pk+'">回复</span>');
					*/if(localStorage.userName!=null&&(result.results[i].userinfo.name==localStorage.userName)){
					    $(this).append('<span type="del" class="huifuDel" onclick="deleteReplyById('+result.results[i].pk+')">删除</span>');
					}
		    	}
		    }
		});
		$('.detail-about #replyWai').each(function() {
			// $(this).parent('.replyDaWai').css({"paddingTop": '0px',"paddingBottom": '0px'});
			if ($(this).children('.replyNei').length == 0) {
				$(this).css({"border": 'none'});
			}
		})
		if (result.next) {
			$("#jieda").append('<a class="moreReply">点击加载更多</a>');

		}
		setTimeout(function() {
			$('.layui-form ').show();
			$('.post_reply').children('.post_user').each(function() {/*
				var rightContentHeight = $(this).children('.rightContent').css("height");
				var leftHeight = parseFloat(rightContentHeight);*/
				/*$(this).children('.jie-user').css({"height": leftHeight+'px'});*/
			})
		}, 1000)
	});
}

// 点击加载更多回帖
$(document).on("click",".moreReply",function() {
	replyPage = replyPage+1;
	getReplys(replyPage);
	$(".moreReply").remove();

})
//回复主贴
function postReplyAdd() {
	myAjax(basePath+"/forum/replies_create/","post",
	{"posts":postId,"content":$("#L_content").val()},function(result) {
		if(result){
			growNumAnimate(result);
			gradeAnimate(result);
			setTimeout("window.location.reload()",2000);
		}else{
			layer.msg("回帖异常");
		}
	})
}
//回复帖子列表
function postReplyMoreAdd() {
	myAjax(basePath+"/forum/replymore_create/","post",
	{"replies":replyId,"content":$("#copy_reply_content").val()},function(result) {
		if(result){
			layer.msg("回复成功");
			setTimeout("window.location.reload()",1000);
		}else{
			layer.msg("回复异常");
		}
	})
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
	layer.open({
		  content: '确定删除该帖子？'
		  ,btn: ['确认', '取消']
		  ,yes: function(index, layero){
			  myAjax(basePath+"/forum/posts/"+postId+"/","DELETE",null,function(result){
			  	//console.log(result)
//				  if(result==1){
						layer.msg("删除成功");
						setTimeout('window.location.href="bbsList.html?id="+zoneId',800);
//					}else{
//						layer.msg("删除失败");
//					}	
				});
		  },btn2: function(index, layero){
		    layer.close();
		  }
		  ,cancel: function(){ 
		    //右上角关闭回调
		  }
		});
}
//删除回帖
function deleteReplyById(replyId){
layer.open({
	  content: '确定删除该回帖？'
	  ,btn: ['确认', '取消']
	  ,yes: function(index, layero){
		  myAjax(basePath+"/forum/replies/"+replyId+"/","DELETE",null,function(result){
//				if(result==1){
					layer.msg("删除成功");
					$(".reply_"+replyId).remove();
//				}else{
//					layer.msg("删除失败");
//				}
				});
	  },btn2: function(index, layero){
	    layer.close();
	  }
	  ,cancel: function(){ 
	    //右上角关闭回调
	  }
	});
}

//删除回复
function deleteReplymoreById(replymoreId){
layer.open({
	  content: '确定删除该回帖？'
	  ,btn: ['确认', '取消']
	  ,yes: function(index, layero){
		  myAjax(basePath+"/forum/replymores/"+replymoreId+"/","DELETE",null,function(result){
//				if(result==1){
					layer.msg("删除成功");
					$(".replymore_"+replymoreId).remove();
//				}else{
//					layer.msg("删除失败");
//				}
			});
	  },btn2: function(index, layero){
	    layer.close();
	  }
	  ,cancel: function(){ 
	    //右上角关闭回调
	  }
	});
}

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

