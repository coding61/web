define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
    var Common = require('common/common.js');
    
    var CREATE_TEAM_URL = "https://www.coding61.com/girl/app/home/createTeam.html";

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
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else if (xhr.status == 401) {
                        var redirectUri = CREATE_TEAM_URL;
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
        createTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = CREATE_TEAM_URL;
                    Common.authWXLogin(redirectUri);
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
                    timeout:6000,
                    success:function(json){
                        console.log(json);
                        Common.dialog("创建成功");

                        location.href = "myTeam.html?pk=" + json.pk + "&name=" +  encodeURIComponent(json.name);
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            if (JSON.parse(xhr.responseText).name) {
                                Common.dialog('团队名称已被占用');
                            }else{
                                Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            }
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = CREATE_TEAM_URL;
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
        }
    };

    Page.init();

});
