$(document).ready(function() {
	var basePath="/program_girl";
	var userId=1;
	//var zonePk=3;
	document.addEventListener('message', function(e) {
    	json=JSON.parse(e.data);
    	token=json.token;
    	zonePk=json.pk;
    	initTypes();
    	$.ajax({
	        url: basePath+"/forum/sections/",
	        type: "get",
	        //async:async==null?true:async,
	        data:null,
	        success: function(result){
	        	//alert(result)
				$.each(result.results, function(k,v) {
					var html='';
					if(v.pk==zonePk){
						html='<option value="'+v.pk+'" selected>'+v.name+'</option>';
					}else{
						html='<option value="'+v.pk+'" >'+v.name+'</option>';
					}
					$(".zone_content").append(html);
				});
			},
	        error:function(XMLHttpRequest){
	     
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg(XMLHttpRequest.status)
	        	}
	        }
	  	});
    }); 
	initTypes();
    	$.ajax({
	        url: basePath+"/forum/sections/",
	        type: "get",
	        //async:async==null?true:async,
	        data:null,
	        success: function(result){
	        	//alert(result)
				$.each(result.results, function(k,v) {
					var html='';
					if(v.pk==zonePk){
						html='<option value="'+v.pk+'" selected>'+v.name+'</option>';
					}else{
						html='<option value="'+v.pk+'" >'+v.name+'</option>';
					}
					$(".zone_content").append(html);
				});
			},
	        error:function(XMLHttpRequest){
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg(XMLHttpRequest.status)
	        	}
	        }
	  	});
//获取当前社区
$(".publish").click(function() {
		var title=$("#L_title").val();
		var content=$("#L_content").val();
		var type_txt=$(".type_content").siblings(".layui-form-select").find(".layui-this");
		var zone_txt=$(".zone_content").siblings(".layui-form-select").find(".layui-this");
		var typeId=type_txt.attr("lay-value");
		var zoneId=zone_txt.attr("lay-value");
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

function publish(title,zoneId,typeId,content) {
	
	$.ajax({
	        url: basePath+"/forum/posts_create/",
	        type: "post",
	        //async:async==null?true:async,
	        headers: {
	            Authorization: 'Token ' + token
	        },
	        data:{
		  		"section":zoneId,
		  		"types":typeId,
		  		"title":title,
		  		"content":content
			},
	        success: function(result) {
				$("#L_title").val("");
				$("#L_content").val("");
				$(".main").find(".layui-select-title input").val("");
				page = 1;
				//growNumAnimate(result);
				// zuanNumAnimate();
				//gradeAnimate(result);
		       	setTimeout(function() {
		        	window.postMessage(JSON.stringify({data:data}))
		        }, 200)	
			},
	        error:function(XMLHttpRequest){
	        	console.log(XMLHttpRequest.status)
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("请求异常");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });	
}
// 经验动画
/*function growNumAnimate(result) {
	var preEx = $('.info .grade-value').text().split("/")[0];
	var experience = result.userinfo.experience-preEx;
	$(".grow-number-ani").remove();
    var growHtml = '<span class="grow-number-ani fadeInOut">经验 +'+experience+'</span>';
    $("body").append(growHtml);

}*/
// 钻石动画
/*function zuanNumAnimate() {
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
}*/
// 等级动画
/*function gradeAnimate(result) {
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
}*/

function initTypes(){
	myAjax2(basePath+"/forum/types/","get",null,function(result){
		$.each(result.results, function(k,v) {
			$(".type_content").append('<option value="'+v.pk+'" >'+v.name+'</option>');
		});
	},false);
}
//initSection();
/*	function initSection(zonePk){
		myAjax2(basePath+"/forum/sections/","get",null,function(result){
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
*/})
