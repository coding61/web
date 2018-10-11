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

    var CREATE_TEAM_URL = "https://www.coding61.com/girl/app/team/createTeam.html";
    var INDEX_URL = "https://www.coding61.com/girl/app/team/index.html";
    var batch_type = 2;   //第二批组队, 创建队伍，获取队伍加此字段

    var Page = {
        token:null,
        init:function(){
            Team.init();
            Page.clickEvent();
        },
        clickEvent:function(){
            
            //创建团队点击事件
            $(".create").click(function(){
                Common.isLogin(function(token){
                    if (token != "null") {
                        //进到创建页面
                        location.href = "createTeam.html";
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = CREATE_TEAM_URL;
                        Common.authWXPageLogin(redirectUri);
                    }
                })
            });
               
            //随机分配团队点击事件     
            $(".join").click(function(){
                // Common.dialog("自由组队暂未开放,请6月25号再来");
                // return;
                
                Team.setValue("joinTeam", true);    //存储点了随机分配
                Common.isLogin(function(token){
                    if (token != 'null') {
                        // 随机匹配进入我的团队页
                        $(".wait-loading").show();
                        Team.joinRandomTeam();
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = INDEX_URL;
                        Common.authWXPageLogin(redirectUri);
                    }
                })
            })
            
            //我的团队点击事件
            $(".my").click(function(){
                // 打开加载动画
                $(".wait-loading").show();
                $(".wait-loading span").hide();

                Team.setValue("myTeam", true)   // 存储点了我的团队按钮
                Common.isLogin(function(token){
                    if (token != "null") {
                        //获取我的团队信息 pk, 进到我的团队页
                        console.log("debug:获取我的团队信息");
                        Team.load();
                    }else{
                        // 先微信授权登录
                        // 微信网页授权
                        var redirectUri = INDEX_URL;
                        Common.authWXPageLogin(redirectUri);
                    }
                })                
            });

            // 邀请码点击事件
            $(".inviteCode").click(function(){
                Common.isLogin(function(token){
                    if (token == "null") {
                        var redirectUri = INDEX_URL;
                        Common.authWXPageLogin(redirectUri);
                        return;
                    }else{
                        $(".wait-loading").show();
                        $(".wait-loading span").hide();
                        Team.getInfo();
                    }
                })
            })

            // 邀请码点击事件
            $(".bindPhoneAgain").click(function(){
                Common.isLogin(function(token){
                    if (token == "null") {
                        var redirectUri = INDEX_URL;
                        Common.authWXPageLogin(redirectUri);
                        return;
                    }else{
                        location.href = "bindPhone.html";
                    }
                })
            })

            Page.idCodeClickEvent();
        },
        //身份识别码相关点击事件
        idCodeClickEvent:function(){
            $(".idCode").click(function(){
                $(".idCode-shadow").show();

                Common.isLogin(function(token){
                    if (token == "null") {
                        $(".idCode-view input").val("");
                        $(".idCode-view textarea").val("");
                        $(".idCode-shadow").hide();
                        
                        var redirectUri = INDEX_URL;
                        Common.authWXPageLogin(redirectUri);
                        return;
                    }else{
                        $(".idCode-view input").val(token);
                        $(".idCode-view textarea").val(token);
                    }
                })
            })
             
            $(".idCode-shadow .cancel").click(function(){
                $(".idCode-shadow").hide();
            })
        },
    };
    
    var Team = {
        myTeam:null,  //是否点了我的团队
        joinTeam:null, //是否点了随机按钮
        code:Common.getQueryString('code'),
        init:function(){
            Team.myTeam = Team.getValue("myTeam");
            Team.joinTeam = Team.getValue("joinTeam");

            if (Team.code) {
                // 没有 token，那就正常授权，存储批次
                console.log("debug:没有 token，那就正常授权，存储批次");
                console.log("debug:拉取授权");
                Team.getToken();
            }else{
               Team.batchDeal(); 
            }
        },
        // 获取 token 请求
        getToken:function(){
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Team.code
                },
                timeout:6000,
                success:function(json){
                    Team.setValue("batch_type", batch_type);   //存储批次
                    Team.setValue("token", json.token);        //存储 token
                    if (Team.myTeam == true) {
                        // 我的团队
                        console.log("debug:获取我的团队信息");
                        Team.load();
                    }else if(Team.joinTeam == true){
                        // 随机
                        console.log("debug:随机组队");
                        $(".wait-loading").show();
                        Team.joinRandomTeam();
                    }

                    Page.idCodeClickEvent();
                },
                error:function(xhr, textStatus){
                    if (Team.myTeam == true) {
                        Team.setValue("myTeam", false);
                    }
                    if (Team.joinTeam == true) {
                        // 随机组队
                        Team.setValue("joinTeam", false);
                    }
                    Team.failDealEvent(xhr, textStatus);
                }
            })
        },
        // 获取我的团队请求
        load:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = INDEX_URL;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/?batch_type=" + batch_type,
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        console.log("debug:获取我的团队信息(success)");
                        // console.log(json);
                        // 隐藏动画,并跳转
                        Team.setValue("myTeam", false);
                        $(".wait-loading").hide();
                        if (json.pk) {
                            location.href = "myTeam.html?pk=" + json.pk + "&name=" + encodeURIComponent(json.name);
                        }else{
                            Common.dialog("还没有一支属于您的团队，先去创建吧。");
                        }
                    },
                    error:function(xhr, textStatus){
                        console.log("debug:获取我的团队信息(failure)");
                        Team.setValue("myTeam", false);
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 随机组队请求
        joinRandomTeam:function(){
            // 加入随机队列
             Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = INDEX_URL;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/random_group/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        "batch_type":batch_type
                    },
                    timeout:6000,
                    success:function(json){
                        console.log("debug:随机组队(success)");
                        Team.setValue("joinTeam", false);
                        $(".wait-loading").hide();
                        // Common.dialog("随机组队登记成功，请过会来查看组队结果");
                        if (json.pk) {
                            location.href = "myTeam.html?pk=" + json.pk + "&name=" + encodeURIComponent(json.name);
                        }else{
                            Common.dialog("组队失败");
                        }
                    },
                    error:function(xhr, textStatus){
                        console.log("debug:随机组队(failure)");
                        Team.setValue("joinTeam", false);
                        Team.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        // 获取个人信息请求
        getInfo:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = INDEX_URL;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        $(".wait-loading").hide();
                        
                        if(json.invitation_code){
                            $(".inviteCode-view .username .user").html(json.invitation_code.code);
                            $(".inviteCode-view .password .pass").html(json.invitation_code.password)
                            $(".inviteCode-shadow").show();
                            $(".inviteCode-shadow").click(function(){
                                $(".inviteCode-shadow").hide();
                            })
                        }else{
                            Common.dialog("请先组队");
                        }  
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        failDealEvent:function(xhr, textStatus, tag){
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
                var redirectUri = INDEX_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                if (tag == "team") {
                    var msg = "还没有一支属于您的团队，先去创建吧。";
                }else{
                    var msg = "未找到";
                }
                Common.dialog(msg);
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                Common.dialog(msg);
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
        // 关于批次处理
        batchDeal:function(callback){
            if(Team.getValue("token")){
                console.log("debug:有 token 的情况,判断是第二批还是第一批的用户");
                // 有 token 的情况,判断是第二批还是第一批的用户
                if(parseInt(Team.getValue("batch_type")) == batch_type){
                    // 第二批用户，不做处理
                    console.log("debug:第二批用户，不做处理");
                    if(callback){
                        callback("noauth");
                    }
                }else{
                    // 非第二批用户，移除 token,让其重新授权
                    console.log("debug:非第二批用户，移除 token,让其重新授权");
                    Team.reomveValue("token");
                    if(callback){
                        callback("auth");
                    }
                }
            }else{
                // 没有 token，不做处理
                console.log("debug:没有 token，不做处理");
                if(callback){
                    callback("auth");
                }
            }
        },
        setValue:function(key, value){
            if (window.localStorage) {
                localStorage[key] = value;
            }else{
                $.cookie(key, value, {path:"/"});
            }
        },
        reomveValue:function(key){
            if(window.localStorage){
                localStorage.removeItem(key);
            }else{
                $.cookie(key, null, {
                    path: "/"
                });
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
