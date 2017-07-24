//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
var basePath="/program_girl";
var pageId=-1;
var zoneId = getQueryString("id");
$('.jie-add1').unbind().click(function(){
	window.location.href="add.html?pk="+zoneId;
});
shubiao();
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
myAjax2(basePath+"/forum/sections/"+zoneId+"/","get",null,function(result){
	if(result.needbuy==true){
		getPostByType(-1,null,localStorage.page,localStorage.searchPostContent,false,1);
	}else{
		getPostByType(-1,null,localStorage.page,localStorage.searchPostContent,false,0);
	}
});

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function getPostByType(typeId,essence,page,keyword,myposts,buy){
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
	// if(buy==1){
		myAjax(basePath+"/forum/posts/?section="+zoneId,"get",{"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,page:page},function(result){
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
			$.each(result.results,function(i,v){
				// 替换'<'和'>'
				v.content = v.content.replace(/</g,'&lt;');
				v.content = v.content.replace(/>/g,'&gt;');
				v.title = v.title.replace(/>/g,'&gt;');
				v.title = v.title.replace(/</g,'&lt;');
				var name='';
				if(v.userinfo.name){
					name=v.userinfo.name;
				}else{
					name=v.userinfo.owner;
				}
				html+='<li class="fly-list-li">'
					+'<img src="'+dealWithAvatar(v.userinfo.avatar)+'">'
					+'<div class="grade"><img class="gradeImg" src="img/num.png" /><span class=gradeText>'+v.userinfo.grade.current_name+'</span></div>'
					+'<h2 class="fly-tip">'          
					+'<a href="detail.html?id='+v.pk+'&pk='+zoneId+'">'+v.title+'</a>'         
					if(v.istop){
						html+='<span class="fly-tip-stick">置顶</span>'
					}
					if(v.isessence){
						html+='<span class="fly-tip-jing">精帖</span> '
					}          
				    html+='<span class="fly-list-hint">'             
					+'<img class="iconfont replyImg" src="img/reply.png" /><span class="replyCount">'+(v.reply_count)+'</span>'          
					+'<img class="iconfont seeImg" src="img/see.png" /><span class="seeCount">'+v.browse_count +'</span>'      
					+'</span></h2><p>'
				    +'<span class="v_content">'+v.content+'</span>'
				    +'<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
					+'<span>'+name+'</span>'
					+'</p></li>';
			})
			$("#bbsUl").append(html);
			liveTimeAgo();
			})
	// }else{
	// 	myAjax2(basePath+"/forum/posts/?section="+zoneId,"get",{"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,page:page},function(result){
	// 		if(result.count>10){
	// 			$("#pagination").show();
	// 			$("#PageCount").val(result.count);
	// 			// if(page<=1){
	// 				loadpage();
	// 			// }
	// 		}else{
	// 			$("#pagination").hide();
	// 		}
	// 		if(result.results.length==0){
	// 			html='<p style="text-align:center;line-height:500px;color:#999;font-size:18px;letter-spacing:1px;">该类别暂无帖子</p>';
	// 		}
	// 		$.each(result.results,function(i,v){
	// 			// 替换'<'和'>'
	// 			v.content = v.content.replace(/</g,'&lt;');
	// 			v.content = v.content.replace(/>/g,'&gt;');
	// 			v.title = v.title.replace(/>/g,'&gt;');
	// 			v.title = v.title.replace(/</g,'&lt;');
	// 			var name='';
	// 			if(v.userinfo.name){
	// 				name=v.userinfo.name;
	// 			}else{
	// 				name=v.userinfo.owner;
	// 			}
	// 			html+='<li class="fly-list-li">'
	// 				+'<img src="'+dealWithAvatar(v.userinfo.avatar)+'">'
	// 				+'<span class="grade">'+v.userinfo.grade.current_name+'</span>'
	// 				+'<h2 class="fly-tip">'          
	// 				+'<a href="detail.html?id='+v.pk+'&pk='+zoneId+'">'+v.title+'</a>'         
	// 				if(v.istop){
	// 					html+='<span class="fly-tip-stick">置顶</span>'
	// 				}
	// 				if(v.isessence){
	// 					html+='<span class="fly-tip-jing">精帖</span> '
	// 				}          
	// 			    html +='</h2><p>'
	// 			    +'<span class="v_content">'+v.content+'</span>'
	// 				+'<span>'+name+'</span>'
	// 				+'<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
					
	// 				+'<span class="fly-list-hint">'             
	// 				+'<i class="iconfont" title="回帖+回复"></i>'+(v.reply_count)          
	// 				+'<i class="iconfont" title="人气"></i>'+v.browse_count        
	// 				+'</span></p></li>';
	// 		})
	// 		$("#bbsUl").append(html);
	// 		liveTimeAgo();
	// 		});
	// }
	
}

// 搜索
$('.fly-tab .searchTiezi').click(function() {
	var searchContent = $('.fly-tab .searchinput').val();
	console.log(searchContent);
	if (searchContent == '') {
		layer.msg("请输入帖子主题");
	} else {
		localStorage.searchPostContent = searchContent;
		localStorage.page = 1;
		getPostByType(-1,null,localStorage.page,searchContent);
	}
})
// 我的帖子
$('.myTie').click(function() {
	$(this).addClass("had-click").siblings().removeClass("had-click");
	$('.myTie').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
	$('.fly-tab-span>a').each(function() {
		$(this).removeClass("tab-this");
	})
	localStorage.page = 1;
	getPostByType(-1,null,localStorage.page,null,true);
})

$(document).ready(function(){
	$(".fly-tab-span>a").click(function(){
		$('.myTie').removeClass("had-click");
		$(".myTie").css({"border": "none", "color": "#4c4c4c"})
		$(this).addClass("tab-this").siblings().removeClass("tab-this");
	})
})
initTypes();
function initTypes(){
	myAjax2(basePath+"/forum/types/","get",null,function(result){
		//console.log(result);
		$.each(result.results, function(k,v) {
			$(".fly-tab-span").append('<a href="javascript:void(0);" data-pk="'+v.pk+'">'+v.name+'</a>');
		});
	},false);
}
$('.fly-tab-span a').unbind().click(function(){
	$('.fly-tab .searchinput').val('');
	localStorage.removeItem("searchPostContent");
	localStorage.page = 1;
	if($(this).attr('data-pk')==-1){
		getPostByType(-1,null,localStorage.page,localStorage.searchPostContent);
		pageId=-1;
	}else if($(this).attr('data-pk')==0){
		getPostByType(0,true,localStorage.page), localStorage.searchPostContent;
		pageId=0;
	}else{
		getPostByType($(this).attr('data-pk'),null,localStorage.page,localStorage.searchPostContent);
		pageId=$(this).attr('data-pk');
	}
});

// 鼠标滑过
function shubiao() {
	// 我的帖子
	$('.myTie').unbind('mouseover').mouseover(function() {
		if (!$(this).hasClass('had-click')) {
			if ($('.myTie').css("border") == "0px none rgb(76, 76, 76)") {
				$('.myTie').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
			}
		}
	}).unbind('mouseout').mouseout(function(){
		if (!$(this).hasClass('had-click')) {
			if ($('.myTie').css("border") != "0px none rgb(76, 76, 76)") {
			    $(".myTie").css({"border": "none", "color": "#4c4c4c"})
			}
		}
	})
	$('.had-click').unbind('mouseover').mouseover(function() {
		if ($('.myTie').css("border") == "0px none rgb(76, 76, 76)") {
			$('.myTie').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
		}
	}).unbind('mouseout').mouseout(function(){
		if ($('.myTie').css("border") != "0px none rgb(76, 76, 76)") {
		    $(".myTie").css({"border": "none", "color": "#4c4c4c"})
		}
	})
	// 发布帖子
	$('.jie-add1').unbind('mouseover').mouseover(function() {
		$('.jie-add1').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
	}).unbind('mouseout').mouseout(function(){
	    $(".jie-add1").css({"border": "none", "color": "#4c4c4c"})
	})
	// 返回论坛
	$('.jie-add').unbind('mouseover').mouseover(function() {
		$('.jie-add').css({"border": "1px solid rgb(250, 80, 131)", "color": "rgb(250, 80, 131)"})
	}).unbind('mouseout').mouseout(function(){
	    $(".jie-add").css({"border": "none", "color": "#4c4c4c"})
	})
}

function exeData(num, type) {
	//alert(num);
	getPostByType(pageId,null,num,localStorage.searchPostContent)
}

function loadpage() {
    var myPageCount = parseInt($("#PageCount").val());
    var myPageSize = parseInt($("#PageSize").val());
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    $("#countindex").val(countindex);

    $.jqPaginator('#pagination', {
        totalPages: parseInt($("#countindex").val()),
        visiblePages: parseInt($("#visiblePages").val()),
        currentPage: parseInt(localStorage.page),
        // first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
        // last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                exeData(num, type);
                localStorage.page = num;
            }
        }
    });
}
