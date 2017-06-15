define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        init:function(){
            Page.clickEvent();
        },
        load:function(){
            
        },
        clickEvent:function(){
            
            $(".create").click(function(){
                //进到创建页面
                location.href = "createTeam.html";

            })
            $(".join").click(function(){
                // 随机匹配进入我的团队页
            })
            $(".my").click(function(){
                // 我的团队页面
                location.href = "myTeam.html";
            })
            /*
            // 微信网页授权
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                scope = 'snsapi_userinfo';

            redirectUri = encodeURIComponent(redirectUri);

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURI(redirectUri)+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })
            */
        }
    };

    Page.init();

});
