define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js?v=1.1');
    var Utils = require('common/utils.js');

    var Page = {
        init:function(){
            clickEvent();
            if(localStorage.token){
                Common.showLoading();
                getInfo();
                loadMyTeam();
                loadTeamBrand();
                loadData();
            }else{
                $(".login-shadow-view").show();
            }

        }
    }
    Page.init();

    function loadData() {
		var isMySelf = false;
        var dict = {
            "count": 10,
            "next": null,
            "results": [
                {"pk": 1, "img": "https://static1.bcjiaoyu.com/cxy/js&jquery/0-1.jpg-640x640", "title": "我是测试题目", "content": "我是测试我是测试内容内容啊啊啊啊嗷嗷啊啊啊我是测试内容内容啊啊啊啊嗷嗷啊啊啊我是测试内容内容啊啊啊啊嗷嗷啊啊啊我是测试内容内容啊啊啊啊嗷嗷啊啊啊我是测试内容内容啊啊啊啊嗷嗷啊啊啊内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 2, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 3, "img": "https://static1.bcjiaoyu.com/cxy/js&jquery/0-1.jpg-640x640", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 4, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 5, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 6, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 7, "img": "https://static1.bcjiaoyu.com/cxy/js&jquery/0-1.jpg-640x640", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 8, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 9, "img": "https://static1.bcjiaoyu.com/cxy/js&jquery/0-1.jpg-640x640", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"},
                {"pk": 0, "img": "https://facebook.github.io/react/img/logo_og.png", "title": "我是测试题目", "content": "我是测试内容内容啊啊啊啊嗷嗷啊啊啊"}
            ]
        }

		var html = template('list-template', dict.results);
        $('.list-view').html(html);

		if (!isMySelf) {
			$('.push').hide();
			$('.item-buy').show();
		} else {
			$('.push').show();
			$('.item-buy').hide();
		}

        $(".item-info").unbind('click').click(function(){
            var id = $(this).closest('li').attr('data-id');
            alert("看文章" + String(id));
        })
        $(".cover").unbind('click').click(function(){
            var id = $(this).closest('li').attr('data-id');
            alert("看文章" + String(id));
        })

        $(".item-buy").click(function(){
            var id = $(this).closest('li').attr('data-id');
            alert("购买" + String(id));
        })

        $(".item-buy").mouseover(function(){
            var id = $(this).closest('li').attr('data-id');
            // alert("鼠标在上" + String(id));
            $(this).css("background-color","#E66689");
            $(this).css("color", "#fff");
        });

        $(".item-buy").mouseout(function(){
            var id = $(this).closest('li').attr('data-id');
            // alert("鼠标移除" + String(id));
            $(this).css("background-color","#fff");
            $(this).css("color", "#000");
        });

        $('#pagination').jqPaginator({
            totalPages: 10,
            visiblePages: 10,
            currentPage: 1,
            onPageChange: function (num, type) {
                $('#text').html('当前第' + num + '页');
            }
        });
    }
    function loadMyTeam() {
        Common.isLogin(function(token){
           $.ajax({
               type:'get',
               url: Common.domain + "/userinfo/mygroup/",
               headers:{
                   Authorization:"Token " + token
               },
               timeout:6000,
               success:function(json){
                  var html = ArtTemplate("team-template", json);
                  $(".header .team").html(html);
               },
               error:function(xhr, textStatus){

                   if (textStatus == "timeout") {
                       // Common.dialog("请求超时");
                       return;
                   }
                   if (xhr.status == 404) {
                       // Common.dialog("您没有团队");
                       return;
                   }else if (xhr.status == 400 || xhr.status == 403) {
                       // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                       return;
                   }else{
                       // Common.dialog('服务器繁忙');
                       return;
                   }
                   console.log(textStatus);
               }
           })
       })
    }
    function loadTeamBrand() {
        Common.isLogin(function(token){
            $.ajax({
                type:"get",
                url:Common.domain + "/userinfo/groups/diamond/ranking/",
                headers:{
                    Authorization:"Token " + token
                },
                timeout:15000,
                success:function(json){
                    var html = ArtTemplate("teams-brand-template", json.results);
                    $(".teams-brand").html(html);
                },
                error:function(xhr, textStatus){
                    if (textStatus == "timeout") {
                        // Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 404) {
                        // Common.dialog("您没有团队");
                        return;
                    }else if (xhr.status == 400 || xhr.status == 403) {
                        // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        // Common.dialog('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        })
    }
    function login(){
        if($(".account-view .username input").val() == ""){
            Common.dialog("请输入账号");
            return;
        }
        if($(".account-view .password input").val() == ""){
            Common.dialog("请输入密码");
            return;
        }

        Common.showLoading();
        $.ajax({
            type:"post",
            url:Common.domain + "/userinfo/invitation_code_login/",
            data:{
                code:$(".account-view .username input").val(),
                password:$(".account-view .password input").val()
            },
            success:function(json){
                console.log(json);
                localStorage.token = json.token;

                getInfo();

                loadMyTeam();  // 获取我的团队信息
                loadTeamBrand();  //获取团队排行
                // Page.loadClickMessage("点击微信登录", false);  //false 代表普通按钮点击事件
            },
            error:function(xhr, textStatus){
                Common.hideLoading();
                if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                }else{
                    Common.dialog('服务器繁忙');
                    return;
                }
            }
        })
    }
    function getInfo(){
        Common.isLogin(function(token){
            $.ajax({
                type:"get",
                url:Common.domain + "/userinfo/whoami/",
                headers:{
                    Authorization:"Token " + token
                },
                success:function(json){
					console.log(json);
                    Common.hideLoading();
                    $(".header .avatar img").attr({src:json.avatar});
                    $(".header .info .grade").html(json.grade.current_name);
                    $(".header .info .grade-value").html(json.experience+"/"+json.grade.next_all_experience);
                    $(".header .zuan span").html("x"+json.diamond);

                    var percent = parseInt(json.experience)/parseInt(json.grade.next_all_experience)*$(".header .info-view").width();
                    $(".header .progress img").css({
                        width:percent
                    })
                    $(".login-shadow-view").hide();
                },
                error:function(xhr, textStatus){
                    Common.hideLoading();
                    if (textStatus == "timeout") {
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        Common.dialog('服务器繁忙');
                        return;
                    }
                }
            })
        })
    }
    function clickEvent() {
        // 登录按钮
        $(".login-view .login").unbind('click').click(function(){
            login();
        })

        // 退出登录
        $(".quit").unbind('click').click(function(){
            Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                localStorage.clear();
                window.location.reload();
            })
        })

        $(".push").unbind("click").click(function(){
            alert("发布文章");
        })

        $(".push").mouseover(function(){
            $(this).css("background-color","#ED8AAB");
        });

        $(".push").mouseout(function(){
            $(this).css("background-color","#E66689");
        });
    }
});
