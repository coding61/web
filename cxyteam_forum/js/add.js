
var basePath="//app.cxy61.com/program_girl";
var userId=1;
var userName=getCookie("userName");
var zonePk = getQueryString("pk");
//if(userName) {
//	userId=user.pk;
//	userName=user.name;
//}else{
//	alert("请先登录");
//	setTimeout("window.location.href='/s/login.html?targetUrl="+window.location.href+"'",500);
//}
//var basePath="http://10.144.238.71:8080/wodeworld/";
//var basePath="http://www.wodeworld.cn:8080/wodeworld3.0/";
// 进到程序媛计划
$('.logo1').click(function() {
	window.location.href = "../app/home/home.html"
})
// 打开儿童编程窗口
$('.logo2').click(function() {
	window.open("https://www.coding61.com");
})
// 返回论坛
$('.jie-add1').click(function() {
	sessionStorage.removeItem("myPost");
	sessionStorage.removeItem("typeId");
	sessionStorage.removeItem("postStatus");
	sessionStorage.removeItem("myCollect");
	sessionStorage.removeItem("myMessage");
	sessionStorage.removeItem("searchPostContent");
	// window.location.href="bbs.html";
	window.location.href="bbsList.html";
})
myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
	if(result){
		if (result.top_rank && result.top_rank == 'Top10') {
			$('.navTopWai').show();
			$('.navTop').css({"background-image": "url(../cxyteam_forum/img/top10.png)"});
		} else if (result.top_rank && result.top_rank == 'Top50') {
			$('.navTopWai').show();
			$('.navTop').css({"background-image": "url(../cxyteam_forum/img/top50.png)"});
		} else if (result.top_rank && result.top_rank == 'Top100') {
			$('.navTopWai').show();
			$('.navTop').css({"background-image": "url(../cxyteam_forum/img/top100.png)"});
		}
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

//获取当前社区
// var zoneName='';
// myAjax(basePath+"/forum/sections/"+zonePk+"/","GET",null,function(result) {
// 	zoneName=result.name;
// });
//$(".zone_content").html('<option value="'+zonePk+'" class="layui-this">'+zoneName+'</option>');
$(function() {
	$(".publish").click(function() {
		var title=$("#L_title").val();
		var content=$("#L_content").val();
		var type_txt=$(".type_content").siblings(".layui-form-select").find(".layui-this");
		var zone_txt=$(".zone_content").siblings(".layui-form-select").find(".layui-this");
		var typeId=type_txt.attr("lay-value");
		var zoneId=zone_txt.attr("lay-value");
		/*alert(zoneId)
		alert(typeId)*/
		
		if(!type_txt.length) {
			layer.msg("请选择类别");
			return false;
		}
		if(!title) {
			layer.msg("请输入标题");
			return false;
		}
		if(!title) {
			layer.msg("请输入标题");
			return false;
		}
		if(!content) {
			layer.msg("请输入内容");
			return false;
		}
		if(!zone_txt.length) {
			layer.msg("请选择专区");
			return false;
		}else {
			$("#L_title").val("");
			$("#L_content").val("");
			$(".main").find(".layui-select-title input").val("");
			publish(title,zoneId,typeId,content)
		}
		
	})
})

function publish(title,zoneId,typeId,content) {
	myAjax(basePath+"/forum/posts_create/","post",{
  "section":zoneId,
  "types":typeId,
  "title":title,
  "content":content
},function(result) {
		//console.log(result)
		$("#L_title").val("");
		$("#L_content").val("");
		$(".main").find(".layui-select-title input").val("");
		localStorage.page = 1;
		growNumAnimate(result);
		// zuanNumAnimate();
		gradeAnimate(result);
        setTimeout(function() {
        	window.location.href="detail.html?id="+result.pk+'&pk='+zonePk;
        }, 2000)
		
	});
}
// 经验动画
function growNumAnimate(result) {
	var preEx = $('.info .grade-value').text().split("/")[0];
	var experience = result.userinfo.experience-preEx;
	$(".grow-number-ani").remove();
	if (experience == 0) {
		var growHtml = '<span class="grow-number-ani fadeInOut">经验已达上限</span>';
	} else {
		var growHtml = '<span class="grow-number-ani fadeInOut">经验 +'+experience+'</span>';
	}
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
initTypes();
function initTypes(){
	myAjax(basePath+"/forum/types/","get",null,function(result){
		//console.log(result);
		// 默认类别为技术交流
		// $.each(result.results, function(k,v) {
		// 	$(".type_content").append('<option value="'+v.pk+'" >'+v.name+'</option>');
		// });
	},false);
}
initSection();
function initSection(){
	myAjax(basePath+"/forum/sections/","get",null,function(result){
		//console.log(result);
		$.each(result.results, function(k,v) {
			var html='';
			if(v.pk==zonePk){
				html='<option value="'+v.pk+'" selected>'+v.name+'</option>';
			}else{
				html='<option value="'+v.pk+'" >'+v.name+'</option>';
			}
			$(".zone_content").append(html);
		});
	},false);
}

