//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
var basePath="/program_girl";
var rankingHadClick = false;
var pageId=-1;
var zoneId = getQueryString("id");
$('.fly-tab .searchinput').val(sessionStorage.searchPostContent);
// 进到程序媛计划
$('.logo1').click(function() {
	window.location.href = "../app/home/home.html"
})
// 打开儿童编程窗口
$('.logo2').click(function() {
	window.open("https://www.cxy61.com");
})
$('.jie-add1').unbind().click(function(){
	if (localStorage.token && localStorage.token != null && localStorage.token != '') {
		$.ajax({
	        url: basePath+"/forum/posts_check/",
	        type: "get",
	        headers: {
	            Authorization: 'Token ' + localStorage.token
	        },
	        success: function(result) {
	        	if (result.message == '该用户可以发帖') {
	        		window.location.href="add.html?pk="+getQueryString("id");
	        	}
	        },
	        error:function(XMLHttpRequest){
	        	console.log(XMLHttpRequest.status)
	        	if(XMLHttpRequest.status==400){
	        		layer.msg("当前未解决的帖子数量过多，请先标记它们为已解决或已完成");
	        	}else{
	        		layer.msg("已被禁言");
	        	}
	        }
	    });	
	}else{
	 	layer.msg("请先登录");
	}
	
});

//var basePath="http://10.144.238.71:8080/wodeworld/";
//var basePath="http://www.wodeworld.cn:8080/wodeworld3.0/";
myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
	if(result){
		$('.avatar img').attr({src: result.avatar});//用户头像
		$('.info .grade').html(result.grade.current_name);//用户段位等级
		$('.info .grade-value').html(result.experience + '/' + result.grade.next_all_experience);
		$('.zuan span').html("x"+result.diamond);
		var percent = (parseInt(result.experience)-parseInt(result.grade.current_all_experience))/(parseInt(result.grade.next_all_experience)-parseInt(result.grade.current_all_experience))*$(".info-view").width();
        $(".progress img").css({
            width:percent
        })
	}else{
	}
})
// myAjax2(basePath+"/forum/sections/"+zoneId+"/","get",null,function(result){
// 	getPostByType(sessionStorage.typeId,null,sessionStorage.page,sessionStorage.searchPostContent,sessionStorage.myPost,null);
// });

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

// 点击消息
$('.message').click(function() {
	window.location.href = "message.html";
})

getPostByType(null,null,sessionStorage.page,sessionStorage.searchPostContent,sessionStorage.myPost,null);

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function getPostByType(typeId,essence,page,keyword,myposts,status){
	$("#bbsUl").empty();
	var html="";
	if(typeId==-1){
		essence=null;
		typeId=null;
	}else if(typeId==0){
		essence=true;
		typeId=null;
	}else{
		essence=null;
	}
	if (myposts == 'true') {
		zoneId = null;
	} else {
		zoneId = getQueryString("id");
	}
	// 查询帖子接口
	var url = "/forum/posts/";
	var data = {"section":zoneId,"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,"page":page,"status":sessionStorage.postStatus};
	if (sessionStorage.myPost == 'true') {
		document.getElementById("cars").options[1].selected=true;
		url = "/forum/posts/";
		data = {"section":zoneId,"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,"page":page,"status":sessionStorage.postStatus};
	} else if (sessionStorage.myCollect == 'true') {
		document.getElementById("cars").options[2].selected=true;
		// 收藏接口
		url = "/collect/collections/";
		data = null;
	} else if (sessionStorage.myMessage == 'true') {
		document.getElementById("cars").options[3].selected=true;
		// 消息列表接口
		url = "/message/messages/";
		data = {"types":"forum","status":status};
	}
		myAjax(basePath+url,"get",data,function(result){
			if(result.count>10){
				$("#pagination").show();
				$("#PageCount").val(result.count);
				// if(page<=1){
					loadpage();
				// }
			}else{
				$("#pagination").hide();
			}
			if(result.results.length==0){
				html='<p style="text-align:center;line-height:500px;color:#999;font-size:18px;letter-spacing:1px;">该类别暂无帖子</p>';
			}
			// 帖子列表
			if (url == '/forum/posts/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					if (v.content) {
						v.content = v.content.replace(/</g,'&lt;');
						v.content = v.content.replace(/>/g,'&gt;');
					}
					if (v.title) {
						v.title = v.title.replace(/>/g,'&gt;');
						v.title = v.title.replace(/</g,'&lt;');
					}
					var name='';
					if(v.userinfo.name){
						name=v.userinfo.name;
					}else{
						name=v.userinfo.owner;
					}
					html+='<li class="fly-list-li">'
						+'<img src="'+dealWithAvatar(v.userinfo.avatar)+'"ng-model="'+v.userinfo.owner+'"name="'+v.userinfo.name+'">'
						if (v.userinfo.is_staff) {
							html+='<span class="manager">管理员</span>'
						}
						html+='<span class="grade">'+v.userinfo.grade.current_name+'</span>'
						if (v.userinfo.top_rank && v.userinfo.top_rank =='Top10') {
							html+='<div class="top" style="position: absolute;margin-top: 100px;background-image: url(img/top10@2x.png);width: 57px;height: 22px;background-size: contain;background-position: 50% 50%;background-repeat: no-repeat;"></div>'
						} else if (v.userinfo.top_rank && v.userinfo.top_rank =='Top50') {
							html+='<div class="top" style="position: absolute;margin-top: 100px;background-image: url(img/top50@2x.png);width: 57px;height: 22px;background-size: contain;background-position: 50% 50%;background-repeat: no-repeat;"></div>'
						} else if (v.userinfo.top_rank && v.userinfo.top_rank =='Top100') {
							html+='<div class="top" style="position: absolute;margin-top: 100px;background-image: url(img/top100@2x.png);width: 57px;height: 22px;background-size: contain;background-position: 50% 50%;background-repeat: no-repeat;"></div>'
						}
						html+='<h2 class="fly-tip">'
						if (v.status_display == '未解决') {
							html+='<span class="unsolved">[未解决]</span>'
						} else if (v.status_display == '已解决') {
							html+='<span class="solved">[已解决]</span>'
						} else if (v.status_display == '已关闭') {
							html+='<span class="finish">[已关闭]</span>'
						}          
						html+='<a href="detail.html?id='+v.pk+'&pk='+getQueryString("id")+'">'+v.title+'</a>'         
						if(v.istop){
							html+='<span class="fly-tip-stick">置顶</span>'
						}
						if(v.isessence){
							html+='<span class="fly-tip-jing">精帖</span> '
						}          
					    html +='</h2><h5>所属专区：'+v.section.name+'</h5><p>'
					    if (v.content) {
					    	html+='<span class="v_content">'+v.content+'</span>'
					    }
						html+='<span>'+name+'</span>'
						if (v.last_replied) {
							html+='<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.last_replied)+'</span>'
						} else {
							html+='<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
						}						
						html+='<span class="fly-list-hint">'             
						+'<i class="iconfont" title="回帖+回复"></i>'+(v.reply_count)          
						+'<i class="iconfont" title="人气"></i>'+v.browse_count        
						+'</span></p></li>';
				})
			}
			// 收藏列表
			else if (url == '/collect/collections/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					if (v.posts.content) {
						v.posts.content = v.posts.content.replace(/</g,'&lt;');
						v.posts.content = v.posts.content.replace(/>/g,'&gt;');
					}
					if (v.posts.title) {
						v.posts.title = v.posts.title.replace(/>/g,'&gt;');
						v.posts.title = v.posts.title.replace(/</g,'&lt;');
					}
					var name='';
					if(v.posts.userinfo.name){
						name=v.posts.userinfo.name;
					}else{
						name=v.posts.userinfo.owner;
					}
					html+='<li class="fly-list-li">'
						+'<img src="'+dealWithAvatar(v.posts.userinfo.avatar)+'">'
						if (v.posts.userinfo.is_staff) {
							html+='<span class="manager">管理员</span>'
						}
						html+='<span class="grade">'+v.posts.userinfo.grade.current_name+'</span>'
						+'<h2 class="fly-tip">'          
						+'<a href="detail.html?id='+v.posts.pk+'&pk='+getQueryString("id")+'">'+v.posts.title+'</a>'         
						if(v.posts.istop){
							html+='<span class="fly-tip-stick">置顶</span>'
						}
						if(v.posts.isessence){
							html+='<span class="fly-tip-jing">精帖</span> '
						}          
					    html +='</h2><p>'
					    if (v.posts.content) {
					    	html+='<span class="v_content">'+v.posts.content+'</span>'
					    }
				
						html+='<span>'+name+'</span>'
						+'<span class="liveTime"  title="'+dealWithTime(v.posts.create_time)+'">'+dealWithTime(v.posts.create_time)+'</span>'
						
						+'<span class="fly-list-hint">'             
						+'<i class="iconfont" title="回帖+回复"></i>'+(v.posts.reply_count)          
						+'<i class="iconfont" title="人气"></i>'+v.posts.browse_count        
						+'</span></p></li>';
				})
			}
			// 消息列表
			else if (url == '/message/messages/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					v.text = v.text.replace(/</g,'&lt;');
					v.text.content = v.text.replace(/>/g,'&gt;');
					html+='<li class="messageLi">'
						if (v.status == 'read') {
							html+='<div class="readMessage">[已读]</div>'
						} else if (v.status == 'unread') {
							html+='<div class="unreadMessage">[未读]</div>'
						}
					html+='<h2 class="content">'          
						+'<a href="#" class="messageTitle" message-pk="'+v.pk+'">'+v.text+'</a>'         
					    +'</h2>'
						+'<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
						+'</li>';
				})
			}
			$("#bbsUl").append(html);
			liveTimeAgo();
			})
	
}

// 搜索
$('.fly-tab .searchTiezi').click(function() {
	var searchContent = $('.fly-tab .searchinput').val();
	console.log(searchContent);
	if (searchContent == '') {
		layer.msg("请输入帖子主题");
	} else {
		sessionStorage.searchPostContent = searchContent;
		sessionStorage.page = 1;
		sessionStorage.removeItem("myPost");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("myCollect");
		sessionStorage.removeItem("myMessage");
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		document.getElementById("cars").options[0].selected=true;
		getPostByType(-1,null,sessionStorage.page,searchContent);
	}
})

// 我的下拉菜单选择
function mySelectHadChange(mySelect) {
	if (mySelect == 'myTie') {
		$('.fly-tab .searchinput').val('');
		sessionStorage.removeItem("searchPostContent");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("myCollect");
		sessionStorage.removeItem("myMessage");
		sessionStorage.page = 1;
		sessionStorage.myPost = true;
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		getPostByType(-1,null,sessionStorage.page,null,sessionStorage.myPost);
	} else if (mySelect == 'myCollect') {
		$('.fly-tab .searchinput').val('');
		sessionStorage.removeItem("searchPostContent");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("myPost");
		sessionStorage.removeItem("myMessage");
		sessionStorage.page = 1;
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		sessionStorage.myCollect = true;
		// getMyCollect();
		getPostByType();
	} else if (mySelect == 'myMessage') {
		// $('.fly-tab .searchinput').val('');
		// sessionStorage.removeItem("searchPostContent");
		// sessionStorage.removeItem("postStatus");
		// sessionStorage.removeItem("typeId");
		// sessionStorage.removeItem("myPost");
		// sessionStorage.removeItem("myCollect");
		// sessionStorage.page = 1;
		// $(".fly-tab-span a").each(function() {
		// 	$(this).removeClass("tab-this");
		// });
		// sessionStorage.myMessage = true;
		// getPostByType();
		document.getElementById("cars").options[0].selected=true;
		window.location.href = "message.html";
	} 
}

// 返回论坛
$('.jie-add').click(function() {
	sessionStorage.removeItem("searchPostContent");
	sessionStorage.removeItem("myPost");
	sessionStorage.removeItem("page");
	sessionStorage.removeItem("typeId");
	sessionStorage.removeItem("postStatus");
	sessionStorage.removeItem("myCollect");
	sessionStorage.removeItem("myMessage");
	window.location.href="bbs.html";
})
// 点击帖子类型
$(document).ready(function(){
	$(".fly-tab-span>a").click(function(){
		$(this).addClass("tab-this").siblings().removeClass("tab-this");
	})
})
initTypes();
function initTypes(){
	// 不显示类型，只显示全部和精帖
	// myAjax2(basePath+"/forum/types/","get",null,function(result){
	// 	console.log(result);
	// 	$.each(result.results, function(k,v) {
	// 		$(".fly-tab-span").append('<a href="javascript:void(0);" data-pk="'+v.pk+'">'+v.name+'</a>');
	// 	});
		// 已解决状态
		// $(".fly-tab-span").append('<a class="solved">已解决</a>');
		// 未解决状态
		// $(".fly-tab-span").append('<a class="unsolved">未解决</a>');
	// },false);
	
	$(".fly-tab-span a").each(function() {
		if (sessionStorage.typeId) {
			if ($(this).attr("data-pk") == sessionStorage.typeId) {
				$(this).addClass("tab-this").siblings().removeClass("tab-this");
			}
		} else if (sessionStorage.postStatus == 'solved') {
			$(this).addClass("tab-this").siblings().removeClass("tab-this");
		} else if (sessionStorage.postStatus == 'unsolved') {
			$(this).addClass("tab-this").siblings().removeClass("tab-this");
		}
	})
}
$('.fly-tab-span a').unbind().click(function(){
	$('.fly-tab .searchinput').val('');
	sessionStorage.removeItem("searchPostContent");
	sessionStorage.removeItem("myPost");
	sessionStorage.removeItem("myCollect");
	sessionStorage.removeItem("myMessage");
	sessionStorage.page = 1;
	// var mySelect = document.getElementById("cars");
	// console.log(document.getElementById("cars").options[mySelect.selectedIndex].value);
	// select value为第一个
	document.getElementById("cars").options[0].selected=true;
	if($(this).attr('data-pk')==-1){
		sessionStorage.removeItem("postStatus");
		getPostByType(-1,null,sessionStorage.page);
		pageId=-1;
		sessionStorage.typeId = -1;
	}
	// else if($(this).attr('data-pk')==0){
	// 	sessionStorage.typeId = 0;
	// 	sessionStorage.removeItem("postStatus");
	// 	getPostByType(0,true,sessionStorage.page);
	// 	pageId=0;
	// }else if ($(this).attr('class') == 'solved') {
	// 	sessionStorage.postStatus = 'solved';
	// 	sessionStorage.removeItem("typeId");
	// 	getPostByType(null,null,sessionStorage.page,null,null,'solved');
	// }else if ($(this).attr('class') == 'unsolved') {
	// 	sessionStorage.postStatus = 'unsolved';
	// 	sessionStorage.removeItem("typeId");
	// 	getPostByType(null,null,sessionStorage.page,null,null,'unsolved');
	// }
	else{
		getPostByType($(this).attr('data-pk'),null,sessionStorage.page,sessionStorage.searchPostContent);
		pageId=$(this).attr('data-pk');
	} 
});

function exeData(num, type) {
	//alert(num);
	getPostByType(pageId,null,num,sessionStorage.searchPostContent,sessionStorage.myPost)
}

function loadpage() {
    var myPageCount = parseInt($("#PageCount").val());
    var myPageSize = parseInt($("#PageSize").val());
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    $("#countindex").val(countindex);
    if (sessionStorage.page) {
    } else {
    	sessionStorage.page = 1;
    }
    $.jqPaginator('#pagination', {
        totalPages: parseInt($("#countindex").val()),
        visiblePages: parseInt($("#visiblePages").val()),
        currentPage: parseInt(sessionStorage.page),
        // first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
        // last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                exeData(num, type);
                sessionStorage.page = num;
            }
        }
    });
}

// 排行榜
// $(document).on("click",".nav .right-view .ranking", function() {
$('.ranking').click(function() {
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
