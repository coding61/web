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

            // alert(Page.code);
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
                    if (xhr.status == 400) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else if (xhr.status == 401) {
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                        Common.authWXLogin(redirectUri);
                        return;
                    }else{
                        Common.showToast('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        },
        createTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
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
                    success:function(json){
                        console.log(json);
                        Common.showToast("创建成功");
                    },
                    err:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        if (xhr.status == 400) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/createTeam.html';
                            Common.authWXLogin(redirectUri);
                            return;
                        }else{
                            Common.showToast('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        clickEvent:function(){

            $(".create").click(function(){
                Page.createTeam();
            })
        }
    };

    Page.init();

});
