define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var current_master_pk = Common.getQueryString('current_master_pk') ? Common.getQueryString('current_master_pk') : 'no_pk';

	var Page = {
        ismyteacher: false,
		init: function(){
			// 当前浏览器
            if(Common.platform.isMobile){
                alert("请使用电脑打开");
                return;
            }else if(!Common.platform.webKit){
                //当前不是谷歌内核，放出消息流
                var questionHtml = null;
                var message = "本页面仅支持Chrome内核的浏览器，请更换成谷歌浏览器";
                questionHtml = '<div class="message text left-animation"> \
                                    <img class="avatar" src="https://resource.bcgame-face2face.haorenao.cn/binshu.jpg" />\
                                    <div class="msg-view">\
                                        <span class="content">'+message+'</span> \
                                    </div>\
                                </div>';
                $(questionHtml).appendTo(".messages");
            }else{
                Page.load();
            }
		},
		load:function(){
            // 判断用户是否登录
            if(localStorage.token){
                // 加载个人信息
                Common.showLoading();
                Mananger.getInfo();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行
                
                Page.clickEvent();
            }else{
                // 弹出登录窗口
                // 打开登录窗口
                $(".login-shadow-view").show();
                Page.clickEvent();
            }
            
        },
        clickEvent:function(){
            // 关闭登录窗口
            $(".login-view .close img").unbind('click').click(function(){
                $(".login-shadow-view").hide();
            })

            // 登录按钮
            $(".login-view .login").unbind('click').click(function(){
                Mananger.login();
            })

            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                    localStorage.clear();
                    window.location.reload();
                })
            })

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                window.open("https://www.cxy61.com");
            })
            $('.header .logo1').unbind('click').click(function(){
                window.open('../../app/home/home.html');
            })

            // 鼠标划过用户头像
            $(".header .icon4.avatar").unbind('mouseover').mouseover(function(){
                // $(".header .team-info").show();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行

                Util.adjustTeaminfo();
                $(".header .team-info").toggle();
            }).unbind('mouseout').mouseout(function(){
                // $(".header .team-info").show();
                $(".header .team-info").toggle();
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                window.open("../../cxyteam_forum/bbs.html");
            })

            //购买文章
            $('.article-list .info-body').on('click', '.tobuy-btn', function(){
                var num = $(this).attr('data-diamond_amount');
                var article_pk = $(this).attr('data-article_pk');
                $('.buy-window .zuanshi-buy-num span').text(num);
                $('.buy-window .buy-submit button').attr({
                    'data-article_pk': article_pk
                });
                $('.buy-window').show();
            })
            $('.buy-window .buy-submit button').click(function(){
                Mananger.buyArticle($(this).attr('data-article_pk'));
            })

            //阅读文章
            $('.article-list .info-body').on('click', '.bought-btn', function(){
                // console.log('to read artical', $(this).attr('data-article_pk'));
                if (!Page.ismyteacher) {
                    Common.dialog('请先拜师');
                    return;
                }
                location.href = '../../cxyteam_forum/content.html?current_master_pk=' + current_master_pk + '&current_article_pk=' + $(this).attr('data-article_pk');
            })

            //关闭购买窗口
            $('.buy-window .win-title span').click(function(){
                $('.buy-window').hide();
            })

            //拜师
            $('.master-info').on('click', '.baishi-btn', function(){
                $('.baishi-window').show();
            })
            $('.baishi-window .win-title span').click(function(){
                $('.baishi-window').hide();
            })
            $('.baishi-window .buy-submit button').click(function(){
                Mananger.baishiFn();
            })

            //跳转文章列表
            $('.more-article').click(function(){
                location.href = './articleList.html?current_master_pk=' + current_master_pk + '&ismyself=' + (sessionStorage.ismyself ? sessionStorage.ismyself : 'No');
            })
        }
	}

	var Mananger = {
        login:function(){
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

                    Mananger.getInfo();
                    Mananger.loadMyTeam();  // 获取我的团队信息
                    Mananger.loadTeamBrand();  //获取团队排行

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
        },
        getInfo:function(){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        Common.hideLoading();
                        $(".login-shadow-view").hide();
                        
                        Util.updateInfo(json);

                        Mananger.getMasterInfo();  //获取教师详情
                        Mananger.getAllArticle();  //获取文章列表
                        Mananger.getAllStudents(); //获取学生列表
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
        },
        loadMyTeam:function(){
             Common.isLogin(function(token){
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:8000,
                    success:function(json){
                       var html = ArtTemplate("team-template", json);
                       $(".header .team").html(html);
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
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
        loadTeamBrand:function(){
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
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
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
        getMasterInfo: function(who){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'GET',
                    url: Common.domain + '/teacher/teachers/' + current_master_pk + '/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    timeout: 8000,
                    success: function(json){
                        if (json.ismyself == 'Yes') {
                            $('.middle-view p').text('个人中心');
                            $('title').text('个人中心')
                            sessionStorage.ismyself = 'Yes';
                        } else {
                            $('.middle-view p').text('教师详情');
                            sessionStorage.ismyself = 'No';
                        }
                        var html = ArtTemplate('master-info-template', json);
                        $('.master-info .info-body').html(html);

                        $('.baishi-window .zuanshi-buy-num span').text(json.owner.name);
                        Page.ismyteacher = json.ismyteacher == 'Yes' ? true : false;
                    },
                    error: function(xhr, textStatus){
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
        },
        getAllStudents: function(){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'GET',
                    url: Common.domain + '/teacher/students/' + current_master_pk + '/',
                    timeout: 8000,
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    success: function(json){
                        if (json.count > 0) {
                            var html = ArtTemplate('student-list-template', json.results);
                            $('.student-list .info-body').html(html);
                            $('.student-list .title .head-title').html('学员(' + json.count + '人)');
                        } else {
                            $('.student-list .info-body').html('<p style="font-size:14px">没有学生</p>')
                        }
                    },
                    error: function(xhr,textStatus){
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
        },
        getAllArticle: function(who){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'GET',
                    url: Common.domain + '/teacher/articles/' + current_master_pk + '/',
                    timeout: 8000,
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    success: function(json){
                        if (json.count > 0) {
                            var html = ArtTemplate('article-list-template', json);
                            $('.article-list .info-body').html(html);
                        } else {
                            $('.article-list .info-body').html('<p style="font-size:14px">还没有发表的文章</p>')
                        }
                    },
                    error: function(xhr, textStatus){
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
        },
        buyArticle: function(article_pk){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'POST',
                    url: Common.domain + '/teacher/buy_article/',
                    timeout: 8000,
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    data: {
                        'article': article_pk
                    },
                    success: function(json){
                        Common.dialog('购买成功', function(){
                            Mananger.getAllArticle();
                        })
                    },
                    error: function(xhr, textStatus){
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
                    },
                    complete: function(){
                        $('.buy-window').hide();
                    }
                })
            })
        },
        baishiFn: function(){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'POST',
                    url: Common.domain + '/teacher/become_student/' + current_master_pk + '/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    timeout: 8000,
                    success: function(json){
                        Common.dialog('恭喜您拜师成功', function(){
                            Page.ismyteacher = true;
                            $('.baishi-btn').hide();
                        })
                    },
                    error: function(xhr, textStatus){
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
                    },
                    complete: function(){
                        $('.baishi-window').hide();
                    }
                })
            })
        }
    }

    // ---------------------4.帮助方法
    var Util = {
        waitTime:Common.getQueryString("wt")?10:1000,
        messageTime:Common.getQueryString("mt")?20:2000,
        updateInfo:function(json){

            // Default.olduser = json.olduser;      //记录是新用户还是老用户
            localStorage.avatar = json.avatar.replace("http://", "https://");     //记录用户的头像
            localStorage.currentGrade = json.grade.current_name;    //记录当前等级

            $(".header .item").show();

            $(".header .avatar img").attr({src:json.avatar.replace("http://", "https://")});
            $(".header .info .grade").html(json.grade.current_name);
            $(".header .info .grade-value").html(json.experience+"/"+json.grade.next_all_experience);
            $(".header .zuan span").html("x"+json.diamond);
            
            if(json.grade.current_all_experience != json.grade.next_all_experience){
                var percent = (parseInt(json.experience)-parseInt(json.grade.current_all_experience))/(parseInt(json.grade.next_all_experience)-parseInt(json.grade.current_all_experience))*$(".header .info-view").width();
                $(".header .progress img").css({
                    width:percent
                })
            }
        },
        adjustTeaminfo:function(){
            var a = $(".header .icon4").offset().left;
            var b = $(".header .right-view").offset().left;
            var c = $(".header .team-info").width();
            $(".team-info").css({
                left: (a-b-c/2) + "px"
            })
        },
        formatString:function(message){
            // 方法1，捕获异常
            try {
               var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
               return msg
            }
            catch(err){
                alert("消息组合格式有问题!");
                return;
            }
        },
        platform:function(){
            // 当前浏览器
            if(Common.platform.webKit){
                //当前不是谷歌内核，放出消息流
                var questionHtml = null;
                var message = "本课堂仅支持Chrome内核的浏览器，请更换成谷歌浏览器，360浏览器或者搜狗浏览器重新打开网站上课。";
                questionHtml = '<div class="message text left-animation"> \
                                    <img class="avatar" src="https://resource.bcgame-face2face.haorenao.cn/binshu.jpg" />\
                                    <div class="msg-view">\
                                        <span class="content">'+message+'</span> \
                                    </div>\
                                </div>';
                $(questionHtml).appendTo(".messages");
            }
        },
        catchJsonParseError:function(str){
            var p = new Promise(function(resolve, reject){
                var cc = JSON.parse(str);
                resolve(cc);
            })
            return p;
        }
    }

	Page.init();
})