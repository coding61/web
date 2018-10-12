define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	
	// 分享
    var WXShare = require('team/wxshare.js');
    var title = "程序媛组队",
        desc = "程序媛组队第二期，和我一起学编程领100万奖学金。",
        link = location.href,
        imgUrl = "https://resource.bcgame-face2face.haorenao.cn/lg1024.png";
    WXShare.SetShareData(title, desc, link, imgUrl);

    var INDEX_URL = "https://www.coding61.com/girl/app/team/index.html";

	var Page = {
		countryCode:"+86",
		owner:null,
		token:null,
		init:function(){
			Page.token = Page.getValue("token");
			Page.getCountryCode();
		},
		clickEvent:function(){
			// 获取验证码
			$(".verify-view .verify-text").unbind('click').click(function(){
				var phone = $(".phone-view input").val();
				if (phone == "") {
					Common.dialog("请输入手机号");
					return
				}
				if ($(this).html() == "获取验证码") {
					Page.getVerifyCode(phone);
				}
			})

			// 领取点击事件
			$(".submit").unbind('click').click(function(){
				var phone = $(".phone-view input").val(),
					verify = $(".verify-view input").val();

				if (phone == "") {
					Common.dialog("请输入手机号");
					return
				}
				if (verify == "") {
					Common.dialog("请输入验证码");
					return
				}
				Page.receiveCourse(phone, verify);
			})

			// ----------------------------国家电话代码
            // 国家代码
            $(".country-code").unbind('click').click(function(){
                $(".country-options-view").toggle();
            })
            // 默认是+86
            $(".country-option").unbind('click').click(function(){
                var code = $(this).attr("data-code");
                Page.countryCode = code;
                $(".country-option.select").removeClass("select");
                $(this).addClass("select");
                $(".country-code span").html(code);

                $(".country-options-view").hide();
            })
            // 关闭
            $(".close").unbind('click').click(function(){
            	$(".country-options-view").hide();
            })
		},
		// 国家代码
		getCountryCode:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/country.json",
                success:function(json){
                    var html = ArtTemplate("country-option-template", json);
                    $(".country-options").html(html);
                    Page.clickEvent();
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        },
		// 获取验证码
		getVerifyCode:function(phone){
			if (Page.countryCode != "+86") {
                phone = Page.countryCode + phone
                phone = encodeURIComponent(phone)
                console.log(phone);
            }
            var time = 60;
            Page.timer = setInterval(function(){
                --time;
                if (time > 0) {
                	$(".verify-view .verify-text").html(time+'s后重试');
                }else{
                	$(".verify-view .verify-text").html('获取验证码');
                    clearInterval(Page.timer);
                    Page.timer = null;
                }
            },1000);
            
			$.ajax({
				type: 'get',
				url: Common.face2faceDomain + '/userinfo/login_request/?username=' + phone,
				dataType: 'json',
				timeout:6000,
				success: function(json){
					if (json.status == 0) {
                    
                    }else if (json.detail || json.message) {
                        Common.dialog(json.detail || json.message);
                    }
				},
				error: function(xhr, textStatus){
					Page.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 立即领取
		receiveCourse:function(phone, code){
			if (Page.countryCode != "+86") {
                phone = Page.countryCode + phone
                // phone = encodeURIComponent(phone)
            }
			$.ajax({
				type: 'post',
				url: Common.face2faceDomain + '/userinfo/login_verifycode/',
				data:JSON.stringify({
					"username": phone,
					"verification_code": code,
					"userinfo": {}
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				dataType: 'json',
				timeout:6000,
				success: function(json){
                    Common.dialog("绑定成功");
                    Page.receiveCourseRegister(phone);
				},
				error: function(xhr, textStatus){
					Page.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 注册
		receiveCourseRegister:function(phone){
			// if (Page.countryCode != "+86") {
   //              phone = Page.countryCode + phone
   //              // phone = encodeURIComponent(phone)
   //          }
			$.ajax({
				type: 'post',
				url: Common.domain + '/userinfo/register_or_login/',
				headers:{
					Authorization:"Token " + Page.token
				},
				data:{
					"username": phone,
				},
				dataType: 'json',
				timeout:6000,
				success: function(json){
				},
				error: function(xhr, textStatus){
					// Page.failDealEvent(xhr, textStatus);
				}
			})
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
                    if (msg == "已经注册过的用户") return;
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

