define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    //初始化， 在分页的哪一页还有是全部教师还是我的教师
    var url_page = sessionStorage.getItem('loadPage') ? sessionStorage.getItem('loadPage') : 1;
    var loadMasterType = sessionStorage.getItem('loadMasterType') ? sessionStorage.getItem('loadMasterType') : 'allMaster';

	var Page = {
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
                //全部教师或我的教师
                loadMasterType == 'allMaster' ? (
                    Mananger.getMasterList(url_page, Mananger.pagination),
                    $('.main-tab .btn').removeClass('active'),
                    $('.all-btn').addClass('active')
                ) : (
                    Mananger.getMyMaster(url_page, Mananger.pagination),
                    $('.main-tab .btn').removeClass('active'),
                    $('.mine-btn').addClass('active')
                );

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

            //全部教师  || 我的教师
            $('.all-btn, .mine-btn').click(function(){
                Mananger.masterTypeChange($(this));
            })
            //成为教师
            $('.become-btn').click(function(){
                $('.become-master').show();
            })
            $('.become-master .submit-submit').click(function(){
                Mananger.becomeMaster();
            })
            $('.become-master .submit-cancel').click(function(){
                $('.become-master').hide();
            })

            //去教室个人详情
            $('.master-list').on('click', '.outer-div', function(){
                var this_ = $(this);
                sessionStorage.current_master_pk = this_.attr('data-pk');
                location.href = './masterDetail.html?current_master_pk=' + this_.attr('data-pk');
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
                    //全部教师或我的教师
                    loadMasterType == 'allMaster' ? (
                        Mananger.getMasterList(url_page, Mananger.pagination),
                        $('.main-tab .btn').removeClass('active'),
                        $('.all-btn').addClass('active')
                    ) : (
                        Mananger.getMyMaster(url_page, Mananger.pagination),
                        $('.main-tab .btn').removeClass('active'),
                        $('.mine-btn').addClass('active')
                    );

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
        getMasterList: function(page, callback){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'GET',
                    url: Common.domain + '/teacher/teachers/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    timeout: 8000,
                    success: function(json){
                        if (json.count > 0) {
                            if (json.results[0].isteacher != 'Yes') {
                                $('.become-btn').show();
                            }
                            var html = ArtTemplate('master-list-templete', json.results);
                            $('.master-list').html(html);
                            typeof callback == 'function' ? callback(json.count) : '';
                        } else {
                            $('.master-list').html('<div style="width: 100%; text-align: center; font-size: 18px;">当前没有教师</div>');
                            typeof callback == 'function' ? callback(0) : '';
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
                    },
                    complete: function(){}
                })
            })
        },
        getMyMaster: function(page, callback){
            Common.isLogin(function(token){
                $.ajax({
                    type: 'GET',
                    url: Common.domain + '/teacher/myteachers/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    timeout: 8000,
                    success: function(json){
                        if (json.count > 0) {
                            var html = ArtTemplate('master-list-templete', json.results);
                            $('.master-list').html(html);
                            typeof callback == 'function' ? callback(json.count) : '';
                        } else {
                            $('.master-list').html('<div style="width: 100%; text-align: center; font-size: 18px;">您还没有拜师哦!</div>');
                            typeof callback == 'function' ? callback(0) : '';
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
                    },
                    complete: function(){}
                })
            })
        },
        masterTypeChange: function(this_){
            url_page = 1;
            sessionStorage.setItem('loadPage',url_page);
            $('.main-tab .btn-tab').removeClass('active');
            this_.addClass('active');
            this_.hasClass('all-btn') ? (function(){
                Mananger.getMasterList(1, Mananger.pagination);
                loadMasterType = 'allMaster';
                sessionStorage.setItem('loadMasterType', 'allMaster');
            }()) : (function(){
                Mananger.getMyMaster(1, Mananger.pagination)
                loadMasterType = 'mineMaster';
                sessionStorage.setItem('loadMasterType', 'mineMaster');
            }())
        },
        pagination: function(all){
            if (all == 0) {
                var total = 1;
                var visibleNum = 1;
            } else {
                var total = Math.ceil(all / 10);
                var visibleNum = total > 5 ? 5 : total;            
            }
            $.jqPaginator('#pagination', {
                totalPages: parseInt(total),
                visiblePages: parseInt(visibleNum),
                currentPage: parseInt(url_page),
                // first: '<li class="first"><a href="javascript:;">首页</a></li>',
                prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
                // last: '<li class="last"><a href="javascript:;">末页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function(num, type) {
                    if (type == "change") {
                        loadMasterType == 'allMaster' ? Mananger.getMasterList(num) : Mananger.getMyMaster(num);
                        sessionStorage.setItem('loadPage',num);
                    }
                }
            });
        },
        becomeMaster: function(){
            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type: 'POST',
                    url: Common.domain + '/teacher/become_teacher/',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    data: {
                        'introduction': $.trim($('.become-master textarea').val())
                    },
                    timeout: 8000,
                    success: function(json){
                        console.log(json)
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
                        Common.hideLoading();
                        $('.become-master').hide();
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