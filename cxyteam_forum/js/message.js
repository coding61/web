//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
var basePath="/program_girl";
var pageId=-1;

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

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
getMessage(sessionStorage.page);

function getMessage(page){
	$("#bbsUl").empty();
	var html="";
		myAjax(basePath+"/message/messages/","get",{"types":"forum","page":page},function(result){
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
			$("#bbsUl").append(html);
			liveTimeAgo();
		})
	
}

// 点击消息
$(document).on("click", ".messageTitle", function() {
	var messagePk = $(this).attr("message-pk");
	$.ajax({
		url: basePath+"/message/messages/"+messagePk+"/",
		type: "get",
		headers:{
			Authorization: 'Token ' + localStorage.token
		},
		success: function(result){
			console.log(result);
			if (result) {
				var p = result.url.split("cxyteam_forum/")[1];
				window.location.href = p;
			}
		},
		error: function(XMLHttpRequest){
			console.log(XMLHttpRequest);
			if (XMLHttpRequest.status == 403) {
				layer.msg('该帖子已删除');
			}
		}
	})
})

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

function exeData(num, type) {
	//alert(num);
	getMessage(num);
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
