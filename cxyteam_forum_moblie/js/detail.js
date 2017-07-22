//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
// var ArtTemplate = require("../../libs/template.js");
var basePath="/program_girl";
var postId=getQueryString("id");
var postPk=getQueryString("pk");
var zoneId=0;
var toUserId=0;
var replyId=0;
var replyPage = 1;
$('.jie-add1').unbind().click(function(){
	window.location.href="add.html?pk="+postPk;
});
//var basePath="http://10.144.238.71:8080/wodeworld/";
//var basePath="http://www.wodeworld.cn:8080/wodeworld3.0/";
//var user= JSON.parse(sessionStorage.getItem("session_user"));

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
	if($(".copy_reply_textarea").length>0){//如果其它地方有
		if($("#copy_reply_content").val()!=null&&$.trim($("#copy_reply_content").val())!=""){//如果有内容
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
		+' <textarea id="copy_reply_content" name="content" required lay-verify="required" placeholder="我要回复"  class="layui-textarea fly-editor" style="height: 150px;"></textarea>'
		+'</div>'
		+'</div>'
		+'<div class="layui-form-item">'
		+' <input type="hidden" name="jid" value="0">'
		+'<button class="layui-btn btn-left postReplyMore_btn" lay-filter="*" lay-submit data-user-id="'+$(this).attr("data-user-id")+'" data-id="'+$(this).attr("data-id")+'">回复</button>'
		+'</div>'
		+'</div>'
		+'<div>';
	$(".layui-form-pane .fly-edit").remove();
	$(this).parent().after(htm);
	// var rightContentHeight = $(this).parent('.post_content').parent('.rightContent').css("height");
	// var leftHeight = parseFloat(rightContentHeight) + 50;
	// $(this).parent('.post_content').parent('.rightContent').parent('.post_user').children('.jie-user').css({"height": leftHeight});
	$('.post_reply').children('.post_user').each(function() {
		var rightContentHeight = $(this).children('.rightContent').css("height");
		var leftHeight = parseFloat(rightContentHeight) + 50;
		$(this).children('.jie-user').css({"height": leftHeight+'px'});
	})
	my_init();
});
//处理空白点击
//$(document).on("click","body",function(){
//	if($(".copy_reply_textarea").val()==null||$.trim($(".copy_reply_textarea").val())==""){
//		$(".copy_reply_textarea").remove();
//	}
//});

//function addBrowseTime(){//浏览次数++
//	$.post(basePath+"hBbsZoneController/addBrowseTime",{"postId":postId},function(result) {	
//	});
//}

function postDetail() {
	myAjax2(basePath+"/forum/posts/"+postId+"/","get",null,function(result) {
		//console.log(result);
		zoneId=result.section.pk;
		postUserName=result.userinfo.name;
		$(".callbackToList").attr("href","bbsList.html?id="+zoneId);
		$(".post_type").text("["+result.types.name+"]");
		$(".post_title").text(result.title);
		$(".post_user .jie-user >img").attr("src",dealWithAvatar(result.userinfo.avatar));
		$(".post_user .grade >span").text(result.userinfo.grade.current_name);
		$(".post_user cite").prepend(result.userinfo.name);
		
		$('.post_content').each(function(){
		    $(this).html(this_fly.content(result.content));
		});
		$(".post_user .post_content").append('<em class="posContentDate">'+dealWithTime(result.create_time)+'</em>');
		if(localStorage.userName!=null&&postUserName==localStorage.userName){
			$(".post_user .post_content").append('<span type="del" onclick="delPost()" class="post_del">删除此帖</span>');
		}
		$("#jiedaCount").text(result.reply_count);
		$(".replyCount").text((result.reply_count));
		$(".browseTime").text(result.browse_count);

		var rightHeight = $('.postTop').children('.post_content').css("height");
		var rightHeightFloat = parseFloat(rightHeight) + 80;
		$('.postTop').children('.postHeadImg').css({"height": rightHeightFloat+'px'});
		 
		$(".detail-hits").append('<span style="color:#FF7200">'+result.types.name+'</span>');
		if(result.istop){$(".fly-tip-stick").css("display","inline-block");}
		if(result.isessence){$(".fly-tip-jing").css("display","inline-block");}
		
		getReplys(replyPage);//获取评论回复
	})
}

template.helper("stringChange", function(e) {
	// if (e.indexOf("img") != -1) {
	// 	var imgArr = e.match(/\[[^\]]+\]/g);
	// 	if (imgArr == null) {
	// 		return e;
	// 	} 
	// 	for (var i = 0; i < imgArr.length; i++) {
	// 		var arrChange = imgArr[i].replace('[', '<img src="');
	// 		arrChange = arrChange.replace(']', '" />');
	// 		e = e.replace(imgArr[i], arrChange);
	// 	}
	// 	// console.log(e);
	// 	var strArr = e.split("<img ");
	// 	console.log(strArr);
	// 	var str = '';
	// 	for (var i = 0; i < strArr.length; i++) {
	// 		if (strArr[i].indexOf("img") != -1) {
	// 			str = str + strArr[i].substring(0,strArr[i].length-3) + '<img ';
	// 		} else {
	// 			str = str + strArr[i];
	// 		}
	// 	}
	// 	console.log(str);
	// 	return str;
	// } else {
		// return e;

		return this_fly.content(e);
		// $('.jieda-body').html(this_fly.content(e));

		
	// }
	
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
		    		$(this).append('<em class="replyContentDate">'+dealWithTime(result.results[i].create_time)+'</em><span class="tieReply question_reply" data-user-id='+result.results[i].userinfo.pk+' data-id="'+result.results[i].pk+'">回复</span>');
					if(localStorage.userName!=null&&(result.results[i].userinfo.name==localStorage.userName)){
					    $(this).append('<span type="del" class="huifuDel" onclick="deleteReplyById('+result.results[i].pk+')">删除</span>');
					}
		    	}
		    }
		});
		$('.detail-about #replyWai').each(function() {
			// console.log($(this).children(".replyNei").length);
			// $(this).parent('.replyDaWai').css({"paddingTop": '0px',"paddingBottom": '0px'});
			if ($(this).children('.replyNei').length == 0) {
				$(this).css({"border": 'none'});
			}
		})
		if (result.next) {
			$("#jieda").append('<a class="moreReply">点击加载更多</a>');
			// getReplys(page+1);
		}
		// console.log($('#replyWai .replyNei').length);
		setTimeout(function() {
			$('.layui-form ').show();
			$('.post_reply').children('.post_user').each(function() {
				var rightContentHeight = $(this).children('.rightContent').css("height");
				var leftHeight = parseFloat(rightContentHeight) + 50;
				$(this).children('.jie-user').css({"height": leftHeight+'px'});
			})
		}, 1000)
		
		
		//console.log(result);
		// $("#jieda").empty();
		// var _htm="";
		// $.each(result.results,function(k,v){
		// 	_htm+='<li data-id="'+v.pk+'" class="jieda-daan reply_'+v.pk+'">'
		// 		+'<div class="detail-about detail-about-reply">'
		// 	  +'<a class="jie-user" href="javascript:void(0)">'
		// 	   +' <img src="'+dealWithAvatar(v.userinfo.avatar)+'" alt="">'
		// 	   +'<cite><i class="reply_name">'+v.userinfo.name+'</i></cite>'
		// 	   +'<span class="grade"><img class="gradeImg" src="img/num.png" />'
		// 	   +'<span class="reGrade">'+v.userinfo.grade.current_name+'</span></span>'
		// 	  +'</a>'
		// 	 + '<div class="detail-hits reply_time">'
		// 	   +' <span>'+dealWithTime(v.create_time)+'</span>'
		// 	   +'<span class="liveTime">'+dealWithTime(v.create_time)+'</span>'
		// 	  +'</div>';
		// 	  if(v.adopt){
		// 		  _htm+=' <i data-id="'+v.pk+'" class="iconfont icon-caina isAccept_active" title="最佳答案"></i>';
		// 		}else{
		// 			_htm+=' <i data-id="'+v.pk+'" class="iconfont icon-caina isAccept" title="最佳答案"></i>';
		// 		}
		// 	  _htm+='</div>'
		// 	+'<div class="detail-body jieda-body">'
		// 	 +this_fly.content(v.content)
		// 	+'</div>'
		// 	+'<div class="jieda-reply" style="text-align:right;">'
		// 	/* +' <span class="jieda-zan zanok" type="zan"><i class="iconfont icon-zan"></i><em>12</em></span>'*/
		// 	_htm+='<span type="reply" class="question_reply" data-user-id="'+v.userinfo.pk+'" data-id="'+v.pk+'"><i class="iconfont icon-svgmoban53"></i>回复('+v.replymore.length+')</span>';
		// 	 /* +'<div class="jieda-admin">'*/
		// 	  /* +' <span type="edit">编辑</span>'*/
		// 	  if(localStorage.userName!=null&&(v.userinfo.name==localStorage.userName)){
		// 	  _htm+='<span type="del" onclick="deleteReplyById('+v.pk+')">删除</span>';
		// 	  }
		// 	    if(localStorage.userName!=null&&postUserName==localStorage.userName){
		// 	    	if(v.adopt){
		// 	    	_htm+='<span class="jieda-accept" type="accept"  onclick="updateIsAccept('+v.pk+',0)">取消采纳</span>';
		// 	    	}else{
		// 	    	_htm+='<span class="jieda-accept" type="accept"  onclick="updateIsAccept('+v.pk+',1)">采纳</span>';	
		//     		}
		// 	    }
		// 	/*  +'</div>'*/
		// 	    _htm+='</div>'
		// 	+'<div class="reply_content">'
		// 	+'<ul jieda photos class="reply_mess">';
		// 	$.each(v.replymore,function(k1,v1){
		// 		_htm+=' <li  class="jieda-daan replymore_'+v1.pk+'"><div class="detail-about detail-about-reply">'
		//             +'<a class="jie-user" href="javascript:void(0)">'
		//             +'<img src="'+dealWithAvatar(v1.userinfo.avatar)+'" alt="">'
		//             +'<span class="reGrade">'+v1.userinfo.grade.current_name+'</span>'
		//             +' <cite><i class="reply_name">'+v1.userinfo.name+'</i></cite>'
		//             +' </a>'
		//             +' <div class="detail-hits reply_time">'
		//             +'<span class="liveTime"  title="'+dealWithTime(v1.create_time)+'">'+dealWithTime(v1.create_time)+'</span>'
		//             +' </div>'
		// 			+'</div>'
		//             +'<div class="detail-body jieda-body">'
		//             +this_fly.content(v1.content)
		//             +'</div>'
		//             +'<div class="jieda-reply" style="text-align:right;">'
		//            // +'<span type="reply"  class="question_reply" data-user-id="'+v1.userinfo.pk+'" data-id="'+v.pk+'"><i class="iconfont icon-svgmoban53"></i>回复</span>';
		//            /* +'<span class="jieda-zan zanok" type="zan"><i class="iconfont icon-zan"></i><em>12</em></span>'*/
		//             /*+'<div class="jieda-admin">'*/
		//            /* +' <span type="edit">编辑</span>'*/
		//            if(localStorage.userName!=null&&(v1.userinfo.name==localStorage.userName)){
		//             	_htm+=' <span type="del" onclick="deleteReplymoreById('+v1.pk+')">删除</span>';
		//             }
		//            /* +' <span class="jieda-accept" type="accept">采纳</span>'*/
		//            /* +'</div>'*/
		//             _htm+='</div></li >';
		// 	});
		// 	_htm+='</ul>'
		// 	+'</div>'
		// 	+'</li>';
		// });
		// $("#jieda").append(_htm);
		// liveTimeAgo();
	});
}

// 点击加载更多回帖
$(document).on("click",".moreReply",function() {
	replyPage = replyPage+1;
	getReplys(replyPage);
	$(".moreReply").remove();

})

function postReplyAdd() {
	myAjax(basePath+"/forum/replies_create/","post",
	{"posts":postId,"content":$("#L_content").val()},function(result) {
		if(result){
			//console.log(result)
			// layer.msg("回帖成功");
			growNumAnimate(result);
			// zuanNumAnimate();
			gradeAnimate(result);
			setTimeout("window.location.reload()",2000);
		}else{
			layer.msg("回帖异常");
		}
	})
}
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
// 钻石动画
function zuanNumAnimate() {
	// 钻石出现，然后2秒后飞到右上角消失
    $(".zuan-shadow-view").show();
    $(".zuan-shadow-view .img").css({
        "margin-top": ($(window).height() - 200) / 2 + "px"
    });

    setTimeout(function(){
        $(".zuan-shadow-view .img").animate({
            marginTop:"1%",
            marginLeft:"88%",
            width:20,
            height:20,
            opacity:0
        }, "slow", function(){
            // 恢复原样
            $(".zuan-shadow-view").hide();
            $(this).css({
                width:200,
                height:200,
                "margin-left":"calc(50% - 100px)",
                "margin-top": ($(window).height() - 200) / 2 + "px",
                opacity:1
            })
            // 钻石加10
            $(".zuan span").html("x" + 10);

            $(".zuan").css({
                transform:'scale(2)'
            })
            
            setTimeout(function(){
                $(".zuan").css({
                    transform:'scale(1)'
                })
            }, 200)
        })
    }, 1000)
}
// 等级动画
function gradeAnimate(result) {
	if (result.userinfo.experience == result.userinfo.grade.next_all_experience) {
		$(".up-grade-shadow-view").show();
	    $(".up-grade-shadow-view .img").css({
	        "margin-top": ($(window).height() - 200) / 2 + "px"
	    });
	    setTimeout(function(){
	        // 更改等级信息
	        $(".up-grade-shadow-view").hide();
	    }, 1000)
	}
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
//最近热帖
myAjax2(basePath+"/forum/browse_posts_list/","get",null,function(result){
	var htm="";
	$.each(result.results,function(k,v){
		htm+='<li>'
	        +'<a href="detail.html?id='+v.pk+'">'+v.title+'</a>'
	        +'<span><i class="iconfont">&#xe60b;</i> '+v.browse_count+'</span>'
	        +'</li>';
	});
	$(".orderByBrowseTime").append(htm);
});
//近期热议
myAjax2(basePath+"/forum/reply_posts_list/","get",null,function(result){
	var htm="";
	$.each(result.results,function(k,v){
		htm+='<li>'
	        +'<a href="detail.html?id='+v.pk+'">'+v.title+'</a>'
	        +'<span><i class="iconfont">&#xe60c;</i> '+v.reply_count+'</span>'
	        +'</li>';
	}); 
	$(".orderByReplyCount").append(htm);
	var topHeight = $('.wrap .postTop').css("height");
	var topHeightFloat = parseFloat(topHeight) + 50;
	$('.wrap .edge').css({"top": topHeightFloat+'px'});
});

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

//调用分页
/*laypage({
     	skin: 'molv',                        //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
     	skip: true,                         //是否开启跳页
     	groups: 6 ,                        //连续显示分页数
      cont: 'share-page',                  //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="pageDiv"></div>
      pages: result.pages,             //通过后台拿到的总页数
      curr: curr || 1,                //当前页
      jump: function(obj, first){    //触发分页后的回调
         if(!first){                //点击跳页触发函数自身，并传递当前页：obj.curr
      	   getShareList(obj.curr,pageSize);
         }
      }
  }) */
