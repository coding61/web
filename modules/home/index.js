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
                Common.dialog("自由组队暂未开放,请6月25号再来");
                return;
                
                /*
                // 存储是否点了随机按钮
                if(window.localStorage){
                    localStorage.joinTeam = true
                }else{
                    $.cookie("joinTeam", true, {
                        path: "/"
                    });
                }
                
                Common.isLogin(function(token){
                    if (token != 'null') {
                        // 随机匹配进入我的团队页
                        $(".wait-loading").show();
                        Team.joinRandomTeam();
                        // Team.joinUnknownTeam();
                    }else{
                         // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                        Common.authWXLogin(redirectUri);
                    }
                })
                */
                
            })
            
            $(".my").click(function(){
                // 打开加载动画
                $(".wait-loading").show();
                $(".wait-loading span").hide();

                // 存储是否点了我的团队按钮
                if(window.localStorage){
                    localStorage.myTeam = true
                }else{
                    $.cookie("myTeam", true, {
                        path: "/"
                    });
                }
                Common.isLogin(function(token){
                    if (token != "null") {
                        //获取我的团队信息 pk, 进到我的团队页
                        Team.load();

                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                        Common.authWXLogin(redirectUri);
                    }
                })                
            });
        }
    };
    
    var Team = {
        myTeam:null,  //是否点了我的团队
        joinTeam:null, //是否点了随机按钮
        code:Common.getQueryString('code'),
        init:function(){
            
            if(window.localStorage){
                Team.myTeam = localStorage.myTeam
            }else{
                Team.myTeam = $.cookie("myTeam");
            }

            if(window.localStorage){
                Team.joinTeam = localStorage.joinTeam
            }else{
                Team.joinTeam = $.cookie("joinTeam");
            }


            if (Team.code) {
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
                timeout:6000,
                success:function(json){
                    if(window.localStorage){
                        localStorage.token = json.token;
                    }else{
                        $.cookie("token", json.token, {
                            path: "/"
                        });
                    }

                    if (Team.myTeam == 'true') {
                        // 我的团队
                        Team.load();
                    }else if(Team.joinTeam == 'true'){
                        /*
                        // 随机
                        $(".wait-loading").show();
                        Team.joinRandomTeam();
                        // Team.joinUnknownTeam();
                        */
                    }
                    
                },
                error:function(xhr, textStatus){
                    if (Team.myTeam == 'true') {
                         Team.storeMyTeam();
                    }
                    if (Team.joinTeam == 'true') {
                        // 随机组队
                        Team.storeJoinTeam();
                    }
                    (".wait-loading").hide();

                    if (textStatus == "timeout") {
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else if (xhr.status == 401) {
                        var redirectUri = null;
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                        Common.authWXLogin(redirectUri);
                        return;
                    }else{
                        Common.dialog('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        },
        load:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        // console.log(json);
                        // 隐藏动画,并跳转
                        Team.storeMyTeam();
                        $(".wait-loading").hide();
                        location.href = "myTeam.html?pk=" + json.pk + "&name=" + encodeURIComponent(json.name);
                    },
                    error:function(xhr, textStatus){
                        Team.storeMyTeam();
                        $(".wait-loading").hide();
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                            Common.authWXLogin(redirectUri);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        joinUnknownTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/random_join_group/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Team.storeJoinTeam();
                        $(".wait-loading").hide();

                        location.href = "myTeam.html?pk=" + json.pk + "&name=" + encodeURIComponent(json.name);
                       
                    },
                    error:function(xhr, textStatus){
                        Team.storeJoinTeam();
                        $(".wait-loading").hide();
                        
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        
                        if (xhr.status == 401) {
                            // token 失效, 重新授权
                            // 先微信授权登录
                            // 微信网页授权
                            var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                            Common.authWXLogin(redirectUri);
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog("服务器繁忙");
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        joinRandomTeam:function(){
            // 加入随机队列
             Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/rabdom_member/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Team.storeJoinTeam();
                        $(".wait-loading").hide();
                        Common.dialog("随机组队登记成功，请后天来查看组队结果");
                        // location.href = "myTeam.html?pk=" + json.pk + "&name=" + encodeURIComponent(json.name);
                       
                    },
                    error:function(xhr, textStatus){
                        Team.storeJoinTeam();
                        $(".wait-loading").hide();
                        
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        
                        if (xhr.status == 401) {
                            // token 失效, 重新授权
                            // 先微信授权登录
                            // 微信网页授权
                            var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/index.html';
                            Common.authWXLogin(redirectUri);
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog("服务器繁忙");
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        storeMyTeam:function(){
            // 我的团队
            if(window.localStorage){
                localStorage.myTeam = false;
            }else{
                $.cookie("myTeam", false, {
                    path: "/"
                });
            }
        },
        storeJoinTeam:function(){
            if(window.localStorage){
                localStorage.joinTeam = false;
            }else{
                $.cookie("joinTeam", false, {
                    path: "/"
                });
            }
        },
        errorMessage:function(xhr){

        }
        
    }
    Page.init();

});
