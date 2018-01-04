define(function(require, exports, module){
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var Utils = require('common/utils.js');
    ArtTemplate.config("escape", false);
	var $d = (id) => {
		return document.getElementById(id);
	}
	var mouseXY = ()=> {
		var x,y;   
	  	var e = e||window.event;   
		return {   
		   x:e.clientX+document.body.scrollLeft + document.documentElement.scrollLeft,   
		   y:e.clientY+document.body.scrollTop + document.documentElement.scrollTop   
		};  
	}

	var Page = {
		course:Common.getQueryString("course"),
		init:function(pagenum){
			//自适应习题列表
			Common.isLogin(function(token){
				$.ajax({
					type:'get',
					url:Common.domain + "/course/myquestions/?course="+Page.course+"&page="+pagenum,
					headers:{
                        Authorization:"Token " + token
                    },
					dataType:'json',
					success:function(json){
						// console.log(json);
						var lessonArr = [];
						for (var i = 0; i < json.length; i++) {
							if(lessonArr.indexOf(json[i].lesson) > -1){
								continue
							}else{
								lessonArr.push(json[i].lesson);
							}
						}
						// console.log(lessonArr);
						lessonArr.sort();
						var array = [];
						for (var i = 0; i < lessonArr.length; i++) {
							var dic = {"lesson":lessonArr[i]}
							var exercisesArr = [];
							for (var j = 0; j < json.length; j++) {
								if (lessonArr[i] == json[j].lesson) {
									exercisesArr.push(json[j])
								}
							}
							dic["exercises"] = exercisesArr
							array.push(dic);
						}
						console.log(array);

						var html = ArtTemplate("course_data_template", array);
						$("#course_list_content").append(html);

						$(".states").each(function(){
							$(this).mouseover(function(){
								//鼠标划过
								var prompt = '<div class="prompt">'+$(this).attr("stateName")+'</div>';
								$("body").append(prompt);
								
								// var mouse = mouseXY();
								// $(".prompt").css({
								// 	top:mouse.y + "px",
								// 	left:mouse.x+"px"
								// })

								var top = $(this).offset().top + $(this).width(),
									left = $(this).offset().left + $(this).height()*2/3;
								$(".prompt").css({
									top:top + "px",
									left:left+"px"
								})
				            }).mouseout(function(){
				            	//鼠标离开
				            	$(".prompt").remove();
				            })
						})
					},
					error:function(xhr, textStatus){
						Page.errorDeal(xhr, textStatus);
					}
				})
			})
			
		},
		errorDeal:function(xhr, textStatus){
			if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                //去登录
                return;
            }
            if (xhr.status == 400 || xhr.status == 403) {
                Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                return;
            }else{
                Common.dialog('服务器繁忙');
                return;
            }
		},
	}
	//模板帮助方法 
    ArtTemplate.helper('TheTitle', function(lesson){
    	return Utils.numberToChinese(lesson);
    });
	Page.init(1);
});




