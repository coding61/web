define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        token:null,
        init:function(){
            
            Team.init();

            Page.clickEvent();
        },
        load:function(){
            
        },
        authLogin:function(url){
            // 先微信授权登录
            // 微信网页授权
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                scope = 'snsapi_userinfo';

            redirectUri = url;
            redirectUri = encodeURIComponent(redirectUri);

            location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
        },
        clickEvent:function(){
            
            var token = "361e62b004a69a4610acf9f3a5b6f95eaabca3b8";
            if(window.localStorage){
                localStorage.token = token
            }else{
                $.cookie("token", token, {
                    path: "/"
                });
            }

            $(".create").click(function(){
                Common.isLogin(function(token){
                    if (token != "null") {
                        //进到创建页面
                        location.href = "createTeam.html";
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                        Page.authLogin(redirectUri);
                    }
                })
            });
                
                    
            $(".join").click(function(){
                // 随机匹配进入我的团队页
                $(".wait-loading").show();

                // 先微信授权登录
                // 微信网页授权
                var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                Page.authLogin(redirectUri);
            })
            
            $(".my").click(function(){
                Common.isLogin(function(token){
                    if (token != "null") {
                        //进到创建页面
                        location.href = "myTeam.html";
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                        Page.authLogin(redirectUri);
                    }
                })                
            });
        }
    };
    
    var Team = {
        code:Common.getQueryString('code'),
        init:function(){

            if (Team.code) {
                $(".wait-loading").show();
                Team.getToken();
            }
        },
        getToken:function(){
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Team.code
                },
                success:function(json){
                    if(window.localStorage){
                        localStorage.token = json.token;
                    }else{
                        $.cookie("token", json.token, {
                            path: "/"
                        });
                    }
                    Team.joinUnknownTeam();
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
        joinUnknownTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
                    return;
                }
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/random_join_group/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){

                       location.href = "myTeam.html";
                    },
                    error:function(xhr, textStatus){
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
        
    }
    Page.init();

});
