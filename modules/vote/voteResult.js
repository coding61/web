define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	
	// 分享
    var WXShare = require('vote/wxshare.js');
    var title = "活动投票",
        desc = "活动投票",
        link = location.href,
        imgUrl = "https://resource.bcgame-face2face.haorenao.cn/lg1024.png";
    WXShare.SetShareData(title, desc, link, imgUrl);

    var INDEX_URL = "https://www.cxy61.com/girl/app/vote/voteResult.html";
    var pk = Common.getQueryString('pk');
	var Page = {
		token:null,
		init:function(){
			Common.isLogin(function(token){
	            if (token != "null") {
	            	Page.token = token;
	                //获取题目选项详情
	                Page.optionDetail();
	            }else{
	            	if (code) {
	            		Page.getToken();
	            	} else {
	            		// 先微信授权登录
		                // 微信网页授权
		                var redirectUri = INDEX_URL;
		                Common.authWXPageLogin(redirectUri);
	            	}
	            }
	        })
		},
		// 获取题目选项详情
		optionDetail:function(){
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/question/' + pk + '/',
				headers: {
					'Authorization': 'Token ' + Page.token,
					'Content-Type': 'application/json'
				},
				dataType: 'json',
				timeout:6000,
				success: function(json){
					var html = ArtTemplate("option-list-template", json.answer);
					$(".options").html(html);
					$(".main-view").show();
				},
				error: function(xhr, textStatus){
					Page.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 获取 token 请求
        getToken:function(){
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code: code
                },
                timeout:6000,
                success:function(json){
                    Page.setValue("token", json.token);
                    Page.optionDetail();
                },
                error:function(xhr, textStatus){
                    Page.failDealEvent(xhr, textStatus);
                }
            })
        },
		// 请求失败处理方法
        failDealEvent:function(xhr, textStatus){
            Common.hideLoading();
            // $(".wait-loading").hide();
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                // token 失效, 重新授权
                // 先微信授权登录
                // 微信网页授权
                var redirectUri = INDEX_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                Common.dialog("未找到");
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                // if (JSON.parse(xhr.responseText).name) {
                //     Common.dialog('团队名称已被占用');
                // }else{
                    var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                    // if (msg == "已经注册过的用户") return;
                    Common.dialog(msg);
                // }
                // return;
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

