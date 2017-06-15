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
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                scope = 'snsapi_userinfo';

            redirectUri = encodeURIComponent(redirectUri);

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURI(redirectUri)+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            $(".share").click(function(){
                Common.confirm("您确定要加入此战队吗?", function(){
                    console.log('111');
                })
            })
        }
    };

    Page.init();

});
