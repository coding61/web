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

    var INDEX_URL = "https://www.cxy61.com/girl/app/vote/vote.html";
    var code = Common.getQueryString('code');
	var Page = {
		countryCode:"+86",
		token:null,
		questionPk: null,
		answerPk: null,
		init:function(){
			Page.getCountryCode();
			Common.isLogin(function(token){
	            if (token != "null") {
	            	Page.token = token;
	            	// 查看是否已经投票
	            	Page.getVoteInfo();
	                //获取题目选项
	                // Page.optionList();
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
		clickEvent:function(){
			// 课程点击事件
			$(".option").unbind('click').click(function(){
				var pk = $(this).attr("data-pk");
				if ($(this).children('.select').hasClass("active")) {
					// 取消选中
					$(this).children('.select').removeClass("active");
					$(this).css({"color": "#5B5B5B"});
					Page.answerPk = null;
				}else{
					// 选中
					$('.select').removeClass("active");
					$(this).children('.select').addClass("active");
					$('.options').children().css({"color": "#5B5B5B"});
					$(this).css({"color": "#FA5083"});
					Page.answerPk = pk;
				}
			})

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

			// 提交点击事件
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
				if (!Page.answerPk) {
					Common.dialog("请选择一个选项");
					return
				}
				Page.submitRequest(phone, verify);
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
		getVoteInfo: function() {
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/whoami/',
				headers: {
					'Authorization': 'Token ' + token,
					'Content-Type': 'application/json'
				},
				dataType: 'json',
				timeout:6000,
				success: function(json){
					console.log(json);
					if (json.survey["1"]) {
						console.log(1);
						// 投票过，跳转投票结果页
						
					} else {
						Page.optionList();	
					}			
				},
				error: function(xhr, textStatus){
					Page.failDealEvent(xhr, textStatus);
				}
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
		// 获取题目选项
		optionList:function(){
			Common.isLogin(function(token){
                if (token == "null") {
                	if (code) {
	            		Page.getToken();
	            	} else {
	            		// 先微信授权登录
		                // 微信网页授权
		                var redirectUri = INDEX_URL;
		                Common.authWXPageLogin(redirectUri);
		                return;
	            	}
                } else {
                	Page.token = token;
                }
				$.ajax({
					type: 'get',
					url: Common.domain + '/userinfo/questions/',
					headers: {
						'Authorization': 'Token ' + token,
						'Content-Type': 'application/json'
					},
					dataType: 'json',
					timeout:6000,
					success: function(json){
						var arr = json.results;
						if (arr.length > 0) {
							Page.questionPk = arr[0].pk;
							var html = ArtTemplate("option-list-template", arr[0].answer);
							$(".options").html(html);
							
							Page.clickEvent();
							$(".main-view").show();
						} else {
							Common.dialog("未找到题目");
						}
					},
					error: function(xhr, textStatus){
						Page.failDealEvent(xhr, textStatus);
					}
				})
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
				url: Common.domain + '/userinfo/bind_new_openid_request/?telephone=' + phone,
				headers: {
					'Authorization': 'Token ' + Page.token,
					'Content-Type': 'application/json'
				},
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
		// 提交请求
		submitRequest:function(phone, code){
			if (Page.countryCode != "+86") {
                phone = Page.countryCode + phone
                // phone = encodeURIComponent(phone)
            }
			$.ajax({
				type: 'post',
				url: Common.domain + '/userinfo/bind_new_openid/',
				data:JSON.stringify({
					"telephone": phone,
					"verification_code": code,
					"question": Page.questionPk,
					"answer":Page.answerPk
				}),
				headers: {
					'Authorization': 'Token ' + Page.token,
					'Content-Type': 'application/json'
				},
				dataType: 'json',
				timeout:6000,
				success: function(json){
					console.log(json);
					// if (json.token) {
					// 	Page.setValue("face2face_token", json.token);
					// }
					// if (json.message == "领取成功") {
					// 	Page.receiveCourseRegister(phone, pk);
					// }else{
					// 	Common.dialog(json.message);
					// }
				},
				error: function(xhr, textStatus){
					Page.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 注册
		receiveCourseRegister:function(phone, pk){
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
					location.href = "receiveCourseResult.html";
				},
				error: function(xhr, textStatus){
					location.href = "receiveCourseResult.html";
					// Page.failDealEvent(xhr, textStatus);
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
                    Page.getVoteInfo();
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

