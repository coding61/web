define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

	var Page = {
        isNew: false,
        toPk: null,
        workListClick: false,
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
			// 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {  
            	var a = e.data;  
                if (a == 'closeCodeEdit') {
                    if (Page.isNew) {
                        $('.save-new-work').show();
                    } else {
                        Mananger.editWork();
                    }
                } else {
                    // 打开运行结果窗口，并赋值
                    $(".code-result-shadow-view iframe").attr({src:a});
                    $('.play-in-newwin').attr({href: a});
                    $(".code-result-shadow-view").show();
                }
            }, false);
		},
		load:function(){
            // 判断用户是否登录
            if(localStorage.token){
                // 加载个人信息
                Common.showLoading();
                Mananger.getInfo();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行
                Mananger.getWorkList(); //获取我的作品列表

                Page.clickEvent();
            }else{
                // 弹出登录窗口
                // 打开登录窗口
                $(".login-shadow-view").show();
                Page.clickEvent();
            }
            
        },
        clickEvent:function(){
            // 关闭运行代码结果窗口
            $(".code-result .close img").unbind('click').click(function(){
                $(".code-result-shadow-view").hide();
            })

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
            $(".header .logo1").unbind('click').click(function(){
                location.href = './worksList.html';
            })

            // 鼠标划过用户头像
            $(".header .icon4.avatar").unbind('mouseover').mouseover(function(){
                // $(".header .team-info").show();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行
                Mananger.getWorkList(); //获取我的作品列表

                Util.adjustTeaminfo();
                $(".header .team-info").toggle();
            }).unbind('mouseout').mouseout(function(){
                // $(".header .team-info").show();
                $(".header .team-info").toggle();
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                location.href = './worksList.html';
            })

            //新建
            $('.createNew').click(function(){
                Page.isNew = true;
                localStorage.removeItem('htmlCode');
                localStorage.removeItem('jsCode');
                $('#codeEdit').attr('src', $('#codeEdit').attr('src'));
                $('.right-view img').hide();
                $('.right-view .codeEdit').show();
            })

            //点击某个作品
            $('.works-list').on('click', 'li', function(){
                if (Page.isNew && (!!localStorage.htmlCode || !!localStorage.jsCode)) {
                    $('.save-new-work').show();
                    Page.toPk = $(this).attr('data-pk');
                    Page.isNew = false;
                    Page.workListClick = true;
                } else {
                    Page.toPk = $(this).attr('data-pk');
                    Page.isNew = false;
                    Mananger.getWorkDetail($(this).attr('data-pk'));
                }
            })

            //保存新作品
            $('.save-btn').click(function(){
                Mananger.saveWork();
            })
            $('.save-cancel-btn').click(function(){
                if (!Page.workListClick) {
                    $('.save-new-work').hide();
                } else {
                    $('.save-new-work').hide();
                    Mananger.getWorkDetail(Page.toPk);
                }
                Page.workListClick = false;
            })

            //作品上首页
            $('.works-list').on('click', '.show-home', function(e){
                e.stopPropagation();
                var this_ = $(this);
                Mananger.getWorkDetail($(this).parent().parent().attr('data-pk'), function(){
                    location.href = './workSave.html?work_pk=' + this_.parent().parent().attr('data-pk') + '&work_name=' + this_.attr('data-name');
                });
            })
            //删除作品
            $('.works-list').on('click', '.works-drop', function(e){
                e.stopPropagation();
                var this_ = $(this);
                Common.bcAlert('确定删除此作品？', function(){
                    Mananger.dropWork(this_.parent().parent().attr('data-pk'));
                })
            })

            //鼠标移入事件
            $('.works-list').on('mouseenter','li', function (event) {
				$(this).addClass('active');
			}).on('mouseleave','li',  function(){
				$(this).removeClass('active');
			});
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
                    localStorage.token = json.token;

                    Mananger.getInfo();

                    window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息

                    Mananger.loadMyTeam();  // 获取我的团队信息
                    Mananger.loadTeamBrand();  //获取团队排行
                    Mananger.getWorkList(); //获取我的作品列表
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
                            Common.dialog("您没有团队");
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
                            Common.dialog("您没有团队");
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
        getWorkList: function(){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'get',
                    url: Common.domain + '/userinfo/myexercises/',
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout: 8000,
                    success: function(json){
                        var html = ArtTemplate('works-list-template', json);
                        $('.works-list').html(html);
                    },
                    error: function(xhr, textStatus){
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
        getWorkDetail: function(pk, callback){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'get',
                    url: Common.domain + '/userinfo/myexercises/' + pk + '/',
                    headers:{
                        'Authorization': 'Token ' + token
                    },
                    timeout: 8000,
                    success: function(json){
                        localStorage.htmlCode = json.html;
                        localStorage.jsCode = json.js;
                        localStorage.cssCode = json.css;
                        $('#codeEdit').attr('src', $('#codeEdit').attr('src'));
                        $('.right-view img').hide();
                        $('.right-view .codeEdit').show();
                        typeof callback == 'function' ? callback() : '';
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
        dropWork: function(pk){
            Common.isLogin(function(token) {
                $.ajax({
                    type: 'DELETE',
                    url: Common.domain + '/userinfo/myexercises/' + pk + '/',
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout: 12000,
                    success: function(json){
                        console.log(json);
                        Mananger.getWorkList();
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
        saveWork: function(){
            var work_name = $.trim($('.save-new-work-input').val());
            if (!work_name || work_name == '') {
                Common.dialog('请输入作品名');
                return;
            }
            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type: 'POST',
                    url: Common.domain + '/userinfo/myexercise_create/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    data: {
                        'name': work_name,
                        'html': localStorage.htmlCode ? localStorage.htmlCode : '',
                        'css': localStorage.cssCode ? localStorage.cssCode : '',
                        'js': localStorage.jsCode ? localStorage.jsCode : ''
                    },
                    timeout: 12000,
                    success: function(json){
                        Common.dialog('作品保存成功', function(){
                            Mananger.getWorkList();
                        })
                        Page.toPk = json.pk;
                        Page.isNew = false;
                        Page.workListClick = false;
                    },
                    error: function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail || JSON.parse(xhr.responseText).name[0]);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    },
                    complete: function(){
                        Common.hideLoading();
                        $('.save-new-work').hide();
                    }
                })
            })
        },
        editWork: function(){
            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type: 'PATCH',
                    url: Common.domain + '/userinfo/myexercises/' + Page.toPk + '/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    data: {
                        'html': localStorage.htmlCode ? localStorage.htmlCode : '',
                        'css': localStorage.cssCode ? localStorage.cssCode : '',
                        'js': localStorage.jsCode ? localStorage.jsCode : ''
                    },
                    timeout: 8000,
                    success: function(json){
                        Common.dialog('保存成功');
                    },
                    error: function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail || JSON.parse(xhr.responseText).name[0]);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    },
                    complete: function(){
                        Common.hideLoading();
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