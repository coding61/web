define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        token:null,
        init:function(){
            
            if(window.localStorage){
                Page.token = localStorage.token;
            }else{
                Page.token = $.cookie("token");
                // $.cookie("token", token, {
                //     path: "/"
                // });
            }

            Page.clickEvent();
        },
        load:function(){
            
        },
        clickEvent:function(){
            
            Page.token = "361e62b004a69a4610acf9f3a5b6f95eaabca3b8";

            $(".create").click(function(){
                if (Page.token) {
                    //进到创建页面
                    location.href = "createTeam.html";
                }else{
                    // 先微信授权登录
                    // 微信网页授权
                    var appId = 'wx58e15a667d09d70f',
                        redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                        scope = 'snsapi_userinfo';

                    redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                    redirectUri = encodeURIComponent(redirectUri);

                    location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
                }
            })
            $(".join").click(function(){
                // 随机匹配进入我的团队页
                $(".wait-loading").show();
            })
            
            $(".my").click(function(){
                if (Page.token) {
                    // 我的团队页面
                    location.href = "myTeam.html";
                }else{
                    // 先微信授权登录
                    // 微信网页授权
                    var appId = 'wx58e15a667d09d70f',
                        redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                        scope = 'snsapi_userinfo';

                    redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    redirectUri = encodeURIComponent(redirectUri);

                    location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
                }
                
            })
        }
    };

    Page.init();

});
