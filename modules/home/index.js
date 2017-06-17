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
        clickEvent:function(){
            
            // var token = null;
            // if(window.localStorage){
            //     localStorage.clear();
            // }else{
            //     $.cookie("token", token, {
            //         path: "/"
            //     });
            // }

            $(".create").click(function(){
                Common.isLogin(function(token){
                    if (token != "null") {
                        //进到创建页面
                        location.href = "createTeam.html";
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                        Common.authWXLogin(redirectUri);
                    }
                })
            });
                
                    
            $(".join").click(function(){
                Common.isLogin(function(token){
                    if (token != 'null') {
                        // 随机匹配进入我的团队页
                        $(".wait-loading").show();
                        Team.joinUnknownTeam();
                    }else{
                         // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                        Common.authWXLogin(redirectUri);
                    }
                })
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
                        Common.authWXLogin(redirectUri);
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
                        $(".wait-loading").hide();

                        location.href = "myTeam.html";
                       
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        $(".wait-loading").hide();

                        if (xhr.status == 401) {
                            // token 失效, 重新授权
                            // 先微信授权登录
                            // 微信网页授权
                            var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                            Page.authLogin(redirectUri);
                            return;
                        }else if (xhr.status == 400) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        
    }
    Page.init();

});
