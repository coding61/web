define(function(require, exports, module) {
    var ArtTemplate = require("libs/template.js");
    var Common = require('common/common.js?v=1.1');
    var Utils = require('common/utils.js');
    var Page = {
        init:function(){
            // alert(navigator.userAgent);
            // 判断浏览器内核
            // 当前浏览器
            if(Common.platform.isMobile){
                alert("请使用电脑打开");
                return;
            }else if(!Common.platform.webKit){
                //当前不是谷歌内核，放出消息流
                var questionHtml = null;
                var message = "本课堂仅支持Chrome内核的浏览器，请更换成谷歌浏览器，360浏览器或者搜狗浏览器重新打开网站上课。";
                questionHtml = '<div class="message text left-animation"> \
                                    <img class="avatar" src="https://static1.bcjiaoyu.com/binshu.jpg" />\
                                    <div class="msg-view">\
                                        <span class="content">'+message+'</span> \
                                    </div>\
                                </div>';
                $(questionHtml).appendTo(".messages");
            }else{
                Page.load();
            }
            // Util.platform();
        },
        load:function(){
            // 判断用户是否登录
            if(localStorage.token){
                // 加载个人信息
                Common.showLoading();
                Mananger.getInfo();

                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行

                Page.clickEventTotal();
            }else{
                // 弹出登录窗口
                // 打开登录窗口
                $(".login-shadow-view").show();
                Page.clickEvent();
            }
            
        },
        clickEvent:function(){
            // Common.showLoadingPreImg();
        
            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
            //文章封面图片上传
            $("#file_upload").change(function() {
                var $file = $(this);
                var fileObj = $file[0];
                var windowURL = window.URL || window.webkitURL;
                var dataURL;
                var $img = $("#file_img");
                if(fileObj && fileObj.files && fileObj.files[0]){
                    dataURL = windowURL.createObjectURL(fileObj.files[0]);
                    $img.attr('src',dataURL);
                }else{
                    dataURL = $file.val();
                    var imgObj = document.getElementById("file_img");
                    // 两个坑:
                    // 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
                    // 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
                    imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
                }
            });



            $(".message.link").unbind('click').click(function(){
                var link = $(this).attr("data-link");
                if (link == "www.code.com") {
                    $(".right-view>img").hide();
                    $(".right-view iframe.courseList").hide();
                    $(".right-view iframe.codeEdit").show();
                }else{
                    // window.open(link);
                    // 打开消息链接窗口
                    // $(".message-link-shadow-view .message-link #message-link-iframe").attr({src:"http://develop.cxy61.com:8001/s/course1/game7/2.html"});
                    // $(".message-link-shadow-view").show();

                    var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                    params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                    console.log(params);
                    window.open(link, '_blank', params);
                }
            })

            $(".message.img").unbind('click').click(function(){
                var url = $(this).find('img.msg').attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
            })

            $(".imgmsg-shadow-view").unbind('click').click(function(){
                $(".imgmsg img").attr({src:""});
                $(".imgmsg-shadow-view").hide();
            })

            $(".help").unbind('click').click(function(){
                if($(".helps-view").css("display") == "none"){
                    $(".helps-view").show();
                }else{
                    $(".helps-view").hide();
                }
                
            })
            $(".helps-view .change-course").unbind('click').click(function(){

                $(".helps-view").hide();
                
                $(".right-view>img").hide();
                $(".right-view iframe.codeEdit").hide();
                $(".right-view iframe.courseList").show();

            })
            // 钻石动画
            $(".helps-view .zuan-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Common.playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
                Util.zuanAnimate(2);
            })
            // 联系我们
            $(".helps-view .contact-us").unbind('click').click(function(){
                $(".helps-view").hide();
                Common.playSoun('https://static1.bcjiaoyu.com/2.mp3');  //播放钻石音效
            })
            // 经验值
            $(".helps-view .grow-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Util.growAnimate(2);
            })
            // 升级
            $(".helps-view .up-grade-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Common.playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
                Util.gradeAnimate();
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

            // 关闭登录窗口
            $(".login-view .close img").unbind('click').click(function(){
                $(".login-shadow-view").hide();
            })

            // 登录按钮
            $(".login-view .login").unbind('click').click(function(){
                // 登录成功，请求数据
                Mananger.login();
            })

            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                    localStorage.clear();
                    window.location.reload();
                })

                // Common.confirm("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                //     localStorage.clear();
                //     window.location.reload();
                // })
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
            // 作品中心
            $(".header .works").unbind('click').click(function(){
                window.open("worksList.html");
            })
            

            // 消息音频播放
            $(".msg-view-parent .audio").unbind('click').click(function(){
                console.log('cc');
                var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
                if (url) {
                    // 'https://static1.bcjiaoyu.com/2.mp3'
                    Common.playMessageSoun2(url);  //播放钻石音效
                }
            })
        },
        clickEventTotal:function(){
            $(".help").unbind('click').click(function(){
                if($(".helps-view").css("display") == "none"){
                    $(".helps-view").show();
                }else{
                    $(".helps-view").hide();
                }
                
            })
            $(".helps-view .change-course").unbind('click').click(function(){

                $(".helps-view").hide();
                
                $(".right-view>img").hide();
                $(".right-view iframe.codeEdit").hide();
                $(".right-view iframe.courseList").show();

            })
            // 钻石动画
            $(".helps-view .zuan-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Common.playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
                Util.zuanAnimate(2);
            })
            // 联系我们
            $(".helps-view .contact-us").unbind('click').click(function(){
                $(".helps-view").hide();
            })
            // 经验值
            $(".helps-view .grow-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Util.growAnimate(2);
            })
            // 升级
            $(".helps-view .up-grade-ani").unbind('click').click(function(){
                $(".helps-view").hide();
                Common.playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
                Util.gradeAnimate();
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


            // 关闭登录窗口
            $(".login-view .close img").unbind('click').click(function(){
                $(".login-shadow-view").hide();
            })

            // 登录按钮
            $(".login-view .login").unbind('click').click(function(){
                // 登录成功，请求数据
                Mananger.login();
            })

            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                    localStorage.clear();
                    window.location.reload();
                })
                // Common.confirm("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                //      localStorage.clear();
                //      window.location.reload();
                // })
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
            // 作品中心
            $(".header .works").unbind('click').click(function(){
                window.open("worksList.html");
            })
            
        }
    };
    
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

                    window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息

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
                        
                        /*
                        $(".header .avatar img").attr({src:json.avatar});
                        $(".header .info .grade").html(json.grade.current_name);
                        $(".header .info .grade-value").html(json.experience+"/"+json.grade.next_all_experience);
                        $(".header .zuan span").html("x"+json.diamond);

                        var percent = parseInt(json.experience)/parseInt(json.grade.next_all_experience)*$(".header .info-view").width();
                        $(".header .progress img").css({
                            width:percent
                        })
                        */
                        Util.updateInfo(json);

                        Util.courseProgressUI();   //更新课程进度
                        
                        
                        // Mananger.loadMyTeam(); // 获取我的团队信息
                        // window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息


                        // 判断本地是否有缓存, 有就把缓存加载出来，否则加载默认                        
                        if (localStorage.chatData) {
                            if(localStorage.currentCourse){
                                Mananger.getCourse(localStorage.currentCourse);  //更改缓存数据源后，加载会话消息
                            }else{
                                ChatStroage.init();
                            }
                        }else{
                            Default.init();
                        }

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
        getCourseInfoWithPk:function(actionText, course){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url: Common.domain + "/course/courses/"+course+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(data){

                        if(!data.json || data.json == ""){
                            $(".btn-wx-auth").attr({disabledImg:false});
                            Common.dialog("课程还未开放，敬请期待");
                            $(".loading-chat").remove();
                            return;
                        }
                        
                        // 方法1，捕获异常
                        try {
                           var array = JSON.parse(data.json);
                           // console.log(array);
                        }
                        catch(err){
                            // console.log(err);
                            $(".btn-wx-auth").attr({disabledImg:false});
                            alert("数据格式有问题!");
                            $(".loading-chat").remove();
                            return;
                        }
                        
                        /*
                        // 方法2：捕获异常
                        Util.catchJsonParseError(data.json).then(function(b){
                            var array = b;
                        }).catch(function(err){
                            // console.log(err);
                            $(".btn-wx-auth").attr({disabledImg:false});
                            alert("数据格式有问题!");
                            $(".loading-chat").remove();
                            return;
                        })
                        */
                        // var array = JSON.parse(data.json);
                        
                        var courseIndex = data.learn_extent.last_lesson;
                        localStorage.currentCourseIndex = courseIndex;  //记录课程下标
                        courseIndex = parseInt(courseIndex);

                        // 课程列表窗口, 当前课程的下标进度 data-course-index:
                        $("#courseList").contents().find(".course[data-category="+data.pk+"]").attr({"data-course-index":courseIndex});
                        
                        if(array){
                            if (array[courseIndex+1]) {
                                //如果此课程此小节消息存在
                                Page.index = 0;
                                Page.data = array[courseIndex+1];
                                
                                Page.loadSepLine(courseIndex+1);
                                Page.loadMessageWithData(actionText, Page.data, Page.index, false);

                            }else{
                                $(".btn-wx-auth").attr({disabledImg:false});
                                Common.dialog("恭喜，您已经完成本课程的学习。您可以选择其它课程，再继续");
                                $(".loading-chat").remove();

                                // 打开课程列表窗口, 更改课程学习状态 为已完成, data-status:finish, data-course-index:
                                $(".right-view>img").hide();
                                $(".right-view iframe.codeEdit").hide();
                                $(".right-view iframe.courseList").show();
                                $("#courseList").contents().find(".course[data-category="+data.pk+"]").attr({"data-status":"finish"});
                                $("#courseList").contents().find(".course[data-category="+data.pk+"]").find(".status").attr({src:"../../statics/images/course/icon1.png"})
                            }
                        }else{
                            $(".btn-wx-auth").attr({disabledImg:false});
                            Common.dialog("课程还未开放，敬请期待");
                            $(".loading-chat").remove();
                        }
                        
                    },
                    error:function(xhr, textStatus){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        $(".loading-chat").remove();

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
        getCourse:function(course){
            //网页每次刷新的时候，更改数据源，Page.data
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url: Common.domain + "/course/courses/"+course+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(data){
                        // 方法1，捕获异常
                        try {
                           var array = JSON.parse(data.json);
                           // console.log(array);
                        }
                        catch(err){
                            // console.log(err);
                            alert("数据格式有问题!");
                            return;
                        }
                        
                        var courseIndex = parseInt(localStorage.currentCourseIndex);
                        // 更改数据源
                        if(array[courseIndex+1]){
                            Page.data = array[courseIndex + 1];
                            localStorage.data = JSON.stringify(Page.data);   //更改缓存数据源

                            Page.optionData = null;
                            Page.optionIndex = 0;
                            localStorage.optionData = JSON.stringify(Page.optionData);
                            localStorage.optionIndex = Page.optionIndex;
                        }
                        ChatStroage.init();    //加载缓存会话消息
                    
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
                
            })
        },
        addReward:function(course, courseIndex, chapter, growNum, zuanNum, this_){
            // 奖励
            if (!chapter || chapter == "") {
                //不发奖励请求
                /*
                // 普通 action 按钮点击事件
                if (this_.hasClass("exercise")) {
                    // 点了习题的，提交答案的按钮
                    var msg = Page.options.join(',');
                    Page.options = [];
                    Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
                }else{
                    // 普通的 action 按钮
                    Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件 
                }
                */
                // 普通 action 按钮点击事件
                Util.actionClickEvent(this_);
                return;
            }
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/add_reward/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        course:course,
                        lesson:courseIndex,
                        chapter:chapter,
                        experience_amount:growNum,
                        diamond_amount:zuanNum
                    },
                    success:function(json){
                        console.log(json);
                        if (json.diamond > localStorage.currentZuan) {
                            // 打开钻石动画
                            Common.playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
                            Util.zuanAnimate(json.diamond);
                        }

                        if (json.experience > localStorage.currentExper) {
                            // 打开经验动画
                            var growNum = parseInt(json.experience) - localStorage.currentExper;
                            Util.growAnimate(growNum);
                        }
                        

                        if(localStorage.currentGrade != json.grade.current_name){
                            // 打开升级动画
                            setTimeout(function(){
                                Common.playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
                                Util.gradeAnimate();
                            }, 500);
                            
                        }

                        // 更新个人信息
                        Util.updateInfo(json);
                    
                        /*    
                        // 普通 action 按钮点击事件
                        if (this_.hasClass("exercise")) {
                            // 点了习题的，提交答案的按钮
                            var msg = Page.options.join(',');
                            Page.options = [];
                            Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
                        }else{
                            // 普通的 action 按钮
                            Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件 
                        }
                        */
                        // 普通 action 按钮点击事件
                        Util.actionClickEvent(this_);
                        
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            // 重复领取，不奖励，接着走消息
                            // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            /*
                            // 普通 action 按钮点击事件
                            if (this_.hasClass("exercise")) {
                                // 点了习题的，提交答案的按钮
                                var msg = Page.options.join(',');
                                Page.options = [];
                                Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
                            }else{
                                // 普通的 action 按钮
                                Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件 
                            }
                            */
                            // 普通 action 按钮点击事件
                            Util.actionClickEvent(this_);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
            })
        },
        updateExtent:function(course, courseIndex, this_){
            // 学习进度
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/update_learnextent/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        course:course,
                        lesson:courseIndex
                    },
                    success:function(json){
                        console.log(json);
                        
                        //记录当前课程的当前节下标
                        // localStorage.currentCourseIndex = courseIndex;

                        // // 记录学习下标
                        // Util.setCourseIndex(course, courseIndex);

                        Util.updateCourseProgress();   //更新课程进度
                        
                        /*
                        // 普通 action 按钮点击事件
                        if (this_.hasClass("exercise")) {
                            // 点了习题的，提交答案的按钮
                            var msg = Page.options.join(',');
                            Page.options = [];
                            Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
                        }else{
                            // 普通的 action 按钮
                            Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件 
                        }
                        */
                        // 普通 action 按钮点击事件
                        Util.actionClickEvent(this_);
                        
                    },
                    error:function(xhr, textStatus){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        $(".loading-chat").remove();
                        
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
        },
        loadTeamBrand:function(){
            /*
            var array = [
                {name:'nozuonodie', diamond_amount:237},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:220},
                {name:'nozuonodie', diamond_amount:210},
                {name:'nozuonodie', diamond_amount:130}
            ]
            var html = ArtTemplate("teams-brand-template", array);
            $(".teams-brand").html(html);
            */
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
        
    }
    Page.init();

});
