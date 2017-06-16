define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        code:Common.getQueryString('code'),
        init:function(){
            if (Page.code) {
                Page.load();   //登录,根据 code 获取 token
            }
            Page.clickEvent();
        },
        load:function(){

            alert(Page.code);
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Page.code
                },
                success:function(json){
                    if(window.localStorage){
                        localStorage.token = json.token;
                    }else{
                        $.cookie("token", json.token, {
                            path: "/"
                        });
                    }
                },
                error:function(xhr, textStatus){
                    if (textStatus == "timeout") {
                        Common.showToast("服务器开小差了");
                    }
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    console.log(textStatus);
                }
            })
        },
        createTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog('请先授权登录');
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/group_create/",
                    headers: {
                        Authorization: "Token " + token
                    },
                    data:{
                        name:$(".name input").val(),
                        announcement:$(".intro textarea").val()
                    },
                    dataType:"json",
                    success:function(json){
                        console.log(json);
                        Common.showToast("创建成功");
                    },
                    err:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        clickEvent:function(){

            $(".create").click(function(){
                Page.createTeam();
                
                // // 先微信授权登录
                // // 微信网页授权
                // var appId = 'wx58e15a667d09d70f',
                //     redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                //     scope = 'snsapi_userinfo';

                // redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                // redirectUri = encodeURIComponent(redirectUri);

                // location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })
        }
    };

    Page.init();

});
