define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        init:function(){

            $(".btn-blue").click(function(){
                $(".web-page").attr({src:'https://www.baidu.com'});
            })
            
            $(".btn-red").click(function(){
                $(".web-page").attr({src:'http://free.bcjiaoyu.com/'});
            })

            Page.clickEvent();



        },
        load:function(){
            
        },
        clickEvent:function(){
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "http://free.bcjiaoyu.com",
                scope = 'snsapi_login';

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            $(".course").click(function(){
                if ($(this).hasClass("select")) {
                    $(this).removeClass("select");
                }else{
                    $(".course").removeClass("select");
                    $(this).addClass("select");
                }
            })
        }
    };

    Page.init();

});
