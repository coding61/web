define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    
    var INDEX_URL = "https://www.cxy61.com/cxyteam/app/team/index.html";

    var Page = {
    	init:function(){
			Page.courseDetail();
    	},
    	// 获取课程详情
		courseDetail:function(){
            var token = Page.getValue("face2face_token");
            if (token != undefined) {
                //token没有
    			$.ajax({
    				type: 'get',
    				url: Common.face2faceDomain + '/course/group_course_record/',
                    headers:{
                        Authorization:"Token " + token
                    },
    				dataType: 'json',
    				timeout:6000,
    				success: function(json){
    					
    					$(".avatar img").attr({src:json.group_course.images});
    					$(".title").html(json.group_course.name);

    					$(".wait-loading").hide();
    					$(".main-view").css({display:'flex'});

    				},
    				error: function(xhr, textStatus){
    					Page.failDealEvent(xhr, textStatus);
    				}
    			})
            }
		},
		// 请求失败处理方法
        failDealEvent:function(xhr, textStatus, my_team_url){
            Common.hideLoading();
            $(".wait-loading").hide();
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                // token 失效, 重新授权
                // 先微信授权登录
                // 微信网页授权
                var redirectUri = my_team_url?my_team_url:INDEX_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                Common.dialog("未找到");
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                if (JSON.parse(xhr.responseText).name) {
                    Common.dialog('团队名称已被占用');
                }else{
                    var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                    Common.dialog(msg);
                }
                return;
            }else if(xhr.status == 0){
                Common.dialog("网络未连接，请检查网络后重试。");
                return;
            } else{
                Common.dialog('服务器繁忙');
                return;
            }
        },


        // ---------帮助方法
        setValue:function(key, value){
            if (window.localStorage) {
                localStorage[key] = value;
            }else{
                $.cookie(key, value, {path:"/"});
            }
        },
        getValue:function(key){
            var value = null;
            if (window.localStorage) {
                value = localStorage[key];
            }else{
                value = $.cookie(key);
            }
            
            try{
                value = JSON.parse(value)
            }
            catch(error){
                value = value
            }
            return value;
        }
    }

    Page.init();
});
