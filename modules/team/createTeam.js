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
    
    var CREATE_TEAM_URL = "https://www.cxy61.com/girl/app/team/createTeam.html";
    var batch_type = 2;     //第二批组队, 创建队伍，获取队伍加此字段

    var Page = {
        code:Common.getQueryString('code'),
        init:function(){
            if (Page.code) {
                Page.load();   //登录,根据 code 获取 token
            }
            Page.clickEvent();
        },
        load:function(){
            // alert(Page.code);
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Page.code
                },
                timeout:6000,
                success:function(json){
                    Page.setValue("token", json.token);
                },
                error:function(xhr, textStatus){
                    Page.failDealEvent(xhr, textStatus);
                }
            })
        },
        createTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = CREATE_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/group_create/",
                    headers: {
                        Authorization: "Token " + token
                    },
                    data:{
                        "name":$(".name input").val(),
                        "announcement":$(".intro textarea").val(),
                        "batch_type":2
                    },
                    dataType:"json",
                    timeout:6000,
                    success:function(json){
                        console.log(json);
                        Common.dialog("创建成功");

                        location.href = "myTeam.html?pk=" + json.pk + "&name=" +  encodeURIComponent(json.name);
                    },
                    error:function(xhr, textStatus){
                        Page.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        clickEvent:function(){
            // // textarea编辑框高度自适应
            //  $('.intro textarea').on('input', function(){
            //     this.style.height = 'auto';
            //     this.style.height = this.scrollHeight + "px"

            // })

            $("textarea").focus(function(){
                $(".create").hide();
            }).blur(function(){
                $(".create").show();
            }).click(function(){
                $(".create").hide();
            })

            $("input").focus(function(){
                $(".create").hide();
            }).blur(function(){
                $(".create").show();
            }).click(function(){
                $(".create").hide();
            })
            
            $(".create").click(function(){
                if ($(".name input").val() == "") {
                    Common.dialog("请输入团队名称");
                    return;
                }
                if ($(".intro textarea").val() == "") {
                    Common.dialog("请输入团队介绍");
                    return;
                }
                if ($(".name input").val().length > 10) {
                    Common.dialog("请输入少于10字符的团队名称");
                    return;
                }
                if ($(".intro textarea").val().length > 50) {
                    Common.dialog("请输入少于50字符的团队介绍");
                    return;
                }
                Page.createTeam();
            })
        },
        // 请求失败处理方法
        failDealEvent:function(xhr, textStatus){
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
                var redirectUri = CREATE_TEAM_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                Common.dialog("未找到");
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                if (JSON.parse(xhr.responseText).name) {
                    Common.dialog('团队名称已被占用');
                }else{
                    Common.dialog(msg);
                }
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
    };

    Page.init();

});