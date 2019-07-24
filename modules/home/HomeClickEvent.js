define(function(require, exports, module) {
    var Common = require('common/common.js');
    var Utils = require('common/utils.js?v=1.1');
	
	var HomeUtil = require('home/HomeUtil.js?v=1.1');
    HomeUtil = HomeUtil.Util;

    var HomeRequest = require('home/HomeRequest.js?v=1.1');
    HomeRequest = HomeRequest.Mananger;
    
    var mouseXY = ()=> {
        var x,y;   
        var e = e||window.event;   
        return {   
           x:e.clientX+document.body.scrollLeft + document.documentElement.scrollLeft,   
           y:e.clientY+document.body.scrollTop + document.documentElement.scrollTop   
        };  
    }

	var HomeClickEvent = {
		clickEvent:function(){
			// 普通图片消息点击
            $(".message.img").unbind('click').click(function(){
                var video = $(this).attr("data-video");
                if (video && video != "") {
                    // 视频消息
                    var url = "videoPlayer.html?videoUrl=" + encodeURIComponent(video);

                    $("#thirdSite").attr({src:url});
                    HomeUtil.openRightIframe("thirdSite");   //打开三方网站
                    return
                }
                
                //小图在左边放大
                var url = $(this).find('img.msg').attr('src');
                $("#bigImg").attr({src:"imageScaleBig.html"});
                HomeUtil.openRightIframe("bigImg");   //打开三方网站
                document.getElementById("bigImg").onload = function () {
                    console.log(1);
                    $("#bigImg").contents().find(".imgdiv").children("img").attr({src:url});    
                }
            })
            // 链接问题图片点击
            $(".link-imgs img").unbind('click').click(function(e){
                e.stopPropagation();
                var url = $(this).attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
            })
            // 选择题题目图片点击
            $(".problem-imgs img").unbind('click').click(function(e){
                e.stopPropagation();
                var url = $(this).attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
            })
            // 选择题选项图片点击
            $(".option-imgs img").unbind('click').click(function(e){
                e.stopPropagation();
                var url = $(this).attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
            })
            // 大图点击
            $(".imgmsg-shadow-view").unbind('click').click(function(){
                $(".imgmsg img").attr({src:""});
                $(".imgmsg-shadow-view").hide();
            })

            // 消息音频播放
            $(".msg-view-parent .audio").unbind('click').click(function(){
                console.log('cc');
                var sha1Code = $(this).parents(".msg-view-parent").attr("data-sha1Code");
                var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
                // if (sha1Code) {
                    // 采用新的录音方式
                    // https://app.bcjiaoyu.com/program_girl/media/001/cn/0e/a143deafedd405b778207c33ba3da1916391b4.mp3
                    // url = "https://www.coding61.com/program_girl/media/" + HomeUtil.reocrdTeacherNum + "/" + HomeUtil.recordLang + "/" + sha1Code.substring(0, 2) + "/" + sha1Code.substring(2) + ".mp3"
                    // Common.playMessageSoun5(url);
                // }else{
                    Common.playMessageSoun2(url);  //播放钻石音效
                // }
            })

            // 打开编辑器的编程题文本
            $(".codeEditor").unbind('click').click(function(){
                var type = $(this).attr("data-type"),
                    udid = $(this).attr("data-udid"),
                    message = $(this).attr("data-content");
                var dic = {
                    message:message,
                    udid:udid
                }
                var url = "codeCompileRN.html?lang=" + type + "&udid=" + udid + "&message=" + encodeURIComponent(message);
                $("#thirdSite").attr({src:url});
                HomeUtil.openRightIframe("thirdSite");
            })

		},
		clickEventTotal:function(clickEventForPage){
            // 帮助点击
            $(".help").unbind('click').click(function(){
                if($(".helps-view").css("display") == "none"){
                    $(".helps-view").show();
                }else{
                    $(".helps-view").hide();
                }
                $(".course-menu-view").hide();
            })
        
            // 更换课程
            $(".helps-view .change-course").unbind('click').click(function(){
                $(".helps-view").hide();
                $("#courseList").attr({src:"courseList.html"});
                HomeUtil.openRightIframe("courseList");   //打开选择课程
            })
            // 快进模式
            $(".helps-view .fast-mode").unbind('click').click(function(){
                if (Common.getQueryString("wt") && Common.getQueryString("mt")) {
                    //  取消快进
                    var url = location.href.split("?")[0]
                    $(".helps-view .fast-mode img").css({display:'none'})
                }else{
                    // 快进
                    var url = location.href.split("?")[0]
                    url = url + "?wt=1&mt=2";
                    $(".helps-view .fast-mode img").css({display:'block'})
                }
                $(".helps-view").hide();
                // history.replaceState(null, "快进模式", url);
                history.pushState({}, "页面标题", url);

                HomeUtil.waitTime = Common.getQueryString("wt")?10:1000;
                HomeUtil.messageTime = Common.getQueryString("mt")?20:2000;
            })
            //查看学习成果
            $(".helps-view .look-learn-result").unbind('click').click(function(){
                var url = "learnResult.html?course=" + localStorage[Utils.LSStrings.currentCourse];
                $("#third-site-iframe").attr({src:url});
                $(".third-site-shadow-view").show();
            })
            
            // 课程目录
            $(".helps-view .course-menu").unbind('click').click(function(){
                $(".helps-view").hide();
                $(".course-menu-view").show();
            })
            
            // 课程目录点击事件
            $("li.catalog").unbind('click').click(function(){
                $(".helps-view").hide();
                if ($(this).hasClass("select")) {
                    return;
                }
                // action 按钮变为开始学习
                $(".actions").html('<span class="btn-wx-auth catalogBegin bottom-animation">开始学习</span>');
                // 隐藏目录列表
                $(".course-menu-view").hide();
                // 记录当前点击的目录的下标，和对象
                var index = $(this).attr("data-index");
                HomeUtil.currentCatalogIndex = parseInt(index);
                // 重新激活点击事件
                // Page.clickEvent();
                clickEventForPage()
            })

            
            // 寻找帮助
            $(".helps-view .find-help").unbind('click').click(function(){
                $(".helps-view").hide();
                $(".find-help-shadow-view").show();
            })
            // 关闭寻找帮助窗口
            $(".find-help-shadow-view").unbind('click').click(function(){
                $(".find-help-shadow-view").hide();
            })

            // 关闭运行代码结果窗口
            $(".code-result .close img").unbind('click').click(function(){
                $(".code-result-shadow-view").hide();
            })

            // 关闭消息链接窗口
            $(".message-link-shadow-view .message-link .close img").unbind('click').click(function(){
                $(".message-link-shadow-view").hide();
            })

            // 关闭学习效果窗口（三方地址）
            $(".third-site-view .close img").unbind('click').click(function(){
                $(".third-site-shadow-view").hide();
            })

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                if(location.host.indexOf("develop.cxy61.com") > -1){
					var url = 'http://develop.cxy61.com:8004/index-image/index.html';
				}else{
					var url = '/index-image/index.html';
				}
                window.open(url);
            })
            
            // 鼠标划过用户头像
            $(".header .icon4.avatar").unbind('mouseover').mouseover(function(){
                // $(".header .team-info").show();
                HomeRequest.loadMyTeam(); // 获取我的团队信息
                HomeRequest.loadTeamBrand();  //获取团队排行

                HomeUtil.adjustTeaminfo();
                $(".header .team-info").toggle();
            }).unbind('mouseout').mouseout(function(){
                // $(".header .team-info").show();
                $(".header .team-info").toggle();
            })

            // compile-shadow-view 隐藏
            $(".compile-shadow-view").unbind('click').click(function(){
                $(".compile-shadow-view").hide();
            })
            // reply 编译器
            $(".compile-view .repl").unbind('click').click(function(){
                var link = HomeUtil.link;
                var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                console.log(params);
                window.open(link, '_blank', params);

                HomeUtil.link = "";
                HomeUtil.linkType = "";
                $(".compile-shadow-view").hide();
            })

            // 程序媛编译器
            $(".compile-view .edit").unbind('click').click(function(){
                var type = HomeUtil.linkType.split("www.compile.com/")[1];
                url = "../home/codeCompileRN.html?lang=" + type;

                var link = url;
                var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                console.log(params);
                window.open(link, '_blank', params);

                HomeUtil.link = "";
                HomeUtil.linkType = "";
                $(".compile-shadow-view").hide();
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                window.open("../../cxyteam_forum/bbsList.html");
            })
			$(".header .activity").unbind('click').click(function(){
                window.open("activity.html");
            })
            // 作品中心
            $(".header .works").unbind('click').click(function(){
                window.open("worksList.html");
            })
            // 手机 app
            $(".header .mobile-app").unbind('mouseover').mouseover(function(){
                HomeUtil.adjustQrCode();
            }).unbind('mouseout').mouseout(function(){
                $(".qr-code-view").css({display:'none'});
            })
            // 在线编辑器
            $(".header .code-online").unbind('click').click(function(){
                HomeUtil.adjustCodeEditorsOnline();
            })
            // 创作课程
            $(".header .edit-course").unbind('click').click(function(){
                window.open("editCourse.html");
            })
            //我的奖学金
            $(".scholar-ship").unbind('click').click(function(){
                $(".scholarship").css({display:'block'});
                HomeRequest.getRecord(1,'init');
            })
            //奖学金记录弹框关闭
            $(".scholarship-cls").unbind('click').click(function(){
                $(".scholarship").css({display:'none'});
            })
            // 编辑器点击事件
            $(".editors .editor").unbind('click').click(function(){
                var url = ""
                if ($(this).hasClass("html")) {
                    url = "../home/codeEditRN.html"
                }else if ($(this).hasClass("c")) {
                    url = "../home/compileRN.html?lang=c"
                }else if ($(this).hasClass("python")) {
                    url = "../home/compileRN.html?lang=python"
                }else if ($(this).hasClass("python2")) {
                    url = "../home/compileRN.html?lang=python2"
                }else if ($(this).hasClass("java")) {
                    url = "../home/compileRN.html?lang=java"
                }
                HomeUtil.openLink(url)
                $(".code-online-editors").css({display:'none'})
            })
            
        },
        clickEventLoginRelated:function(){   
            /**
             *  通过获取手机验证码登录
             */
           
            $(".yzm-account-view .get-code").unbind('click').click(function(){
                // 获取手机验证码
                HomeRequest.getPhoneCode($(".yzm-account-view"));
            })

            // ---------------------------------------------II:新的登录
            // --------------------------------1.绑定手机
            //打开绑定窗口
            $(".lock-phone").unbind('click').click(function(){
                $(".helps-view").hide();
                $(".phone-bind-shadow-view").show();
            })
            // 获取手机验证码
            $(".phone-bind-view .get-code").unbind('click').click(function(){
                // 获取手机验证码
                HomeRequest.getPhoneCode($(".phone-bind-view"));
            })
            // 手机绑定
            $(".phone-bind-view .bind-btn").unbind('click').click(function(){
                HomeRequest.lockPhone($(".phone-bind-view"));
            })
            // 关闭绑定窗口
            $(".phone-bind-view .close img").unbind('click').click(function(){
                $(".phone-bind-shadow-view").hide();
            })

            // -------------------------------2.手机/邀请码登录
            $(".phone-invite-view .tabs .tab").unbind('click').click(function(){
                // 选择手机/邀请码登录
                if ($(this).hasClass("unselect")) {
                    $(".phone-invite-view .tabs .tab").removeClass("select").addClass("unselect");

                    $(this).removeClass("unselect").addClass("select");
                }
                if ($(this).hasClass("phone")){
                    $(".phone-account-view").css({display:"flex"})
                    $(".invite-account-view").css({display:"none"})
                    $(".yzm-account-view").css({display:"none"})

                }else if ($(this).hasClass("yzm")) {
                    $(".yzm-account-view").css({display:"flex"})
                    $(".invite-account-view").css({display:"none"})
                    $(".phone-account-view").css({display:"none"})
                }else if ($(this).hasClass("invite")) {
                    $(".invite-account-view").css({display:"flex"})
                    $(".phone-account-view").css({display:"none"})
                    $(".yzm-account-view").css({display:"none"})
                }
            })
            $(".phone-invite-view .go-reg").unbind('click').click(function(){
                // 打开手机注册窗口
                $(".phone-reg-shadow-view").show();
                $(".phone-invite-shadow-view").hide();
            })
            $(".phone-invite-view .forgot-psd").unbind('click').click(function(){
                // 打开找回密码窗口
                $(".find-password-shadow-view").show();
            })


            // -----------------------------3.手机注册
            $(".phone-reg-view .close img").unbind('click').click(function(){
                // 关闭手机注册窗口
                $(".phone-reg-shadow-view").hide();
                $(".phone-invite-shadow-view").show();
            })
            $(".phone-reg-view .get-code").unbind('click').click(function(){
                // 获取手机验证码
                HomeRequest.getPhoneCode($(".phone-reg-view"));
            })
            $(".phone-reg-view .reg-next-btn").unbind('click').click(function(){
                // 注册下一步 btn
                var this_ = $(".phone-reg-view");
                if (this_.find(".phone").children("input").val() == "") {
                    Common.dialog("请输入手机号");
                    return
                }
                if (this_.find(".verify-code").children("input").val() == "") {
                    Common.dialog("请输入验证码");
                    return
                }
                if (this_.find(".password").children("input").val() == "") {
                    Common.dialog("请输入密码");
                    return
                }

                HomeUtil.phone = this_.find(".phone").children("input").val();
                HomeUtil.code = this_.find(".verify-code").children("input").val();
                HomeUtil.password = this_.find(".password").children("input").val();


                // 打开头像窗口
                $(".choose-avatar-shadow-view").show();
                $(".phone-reg-shadow-view").hide();

                var width = $(window).width();
                $(".ui-choose-avatar-view").css({
                    "width":width*0.35+"px"
                })
                $(".avatars-view").css({
                    "width":width*0.35+"px"
                })
            })

            // -----------------------------4.选择头像
            $(".choose-avatar-view .close img").unbind('click').click(function(){
                // 关闭选择头像窗口
                $(".choose-avatar-shadow-view").hide();
                $(".phone-reg-shadow-view").show();

            })
            
            $(".choose-avatar-view .choose-avatar").unbind('click').click(function(){
                $(".choose-avatar-view .avatars-view").css({
                    display:"flex"
                });
            })

            $(".choose-avatar-view .avatars .avatar").unbind('click').click(function(){
                // 头像选择
                var url = $(this).children("img").attr("src");
                $(".choose-avatar-view .choose-avatar img").attr({src:url})
            })
            $(".choose-avatar-view .submit-avatar .submit").unbind('click').click(function(){
                $(".choose-avatar-view .avatars-view").css({
                    display:"none"
                });
                HomeUtil.chooseAvatar = $(".choose-avatar-view .choose-avatar img").attr("src");
            })


            // -----------------------------4.找回密码
            $(".find-password-view .close img").unbind('click').click(function(){
                $(".find-password-shadow-view").hide();
            })
            $(".find-password-view .get-code").unbind('click').click(function(){
                // 获取手机验证码
                HomeRequest.getPhoneCode($(".find-password-view"));
            })
            $(".find-password-view .reset-psd-btn").unbind('click').click(function(){
                // 重置密码 btn
                HomeRequest.resetPassword($(".find-password-view"));
            })

            // ----------------------------5.国家电话代码
            // 国家代码
            $(".code-country").unbind('click').click(function(){
                $(".country-options").toggle();
            })
            // 默认是+86
            $(".country-option").unbind('click').click(function(){
                var code = $(this).attr("data-code");
                HomeUtil.currentCountryCode = code;
                $(".country-option.select").removeClass("select");
                $(this).addClass("select");
                $(".code-country span").html(code);

                $(".country-options").hide();
            })
        
        },
	}

	exports.HomeClickEvent = HomeClickEvent;
});