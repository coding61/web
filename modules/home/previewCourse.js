define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js?v=1.1');
    var Utils = require('common/utils.js');
    ArtTemplate.config("escape", false);
    
    // ---------------------------3.正常请求数据
    var Page = {
        index:0,     //接受实时数据的下标
        data:null,   //接受实时数据，

        chatData:null,  //存储会话内容
        options:[],  //记录选项
        
        optionData:null,    //记录用户当前选了答案之后的数组会话
        optionIndex:0,   //记录用户当前选了答案之后的数组会话下标
        optionDataAnswer:"",  //标识是错误答案数组还是正确答案数组
        numbers:0,

        currentCourseIndex:1,      //当前课程的课节
        totalCourseData:null,      //课程的总数据
        init:function(){
            Page.totalCourseData = JSON.parse(localStorage.CourseData);
            Page.load();
        },
        load:function(){
            Page.index = 0;
            Page.data = Page.totalCourseData[Page.currentCourseIndex];

            // 开始加载数据
            Page.loadSepLine(Page.currentCourseIndex);
            Page.loadMessage(Page.data, Page.index, false);
            
            Common.addCopyRight();   //添加版权标识
        },
        loadMessage:function(arr, i, opt){
            var item = arr[i];
            var imgI = "i_"+Page.numbers;

            var questionHtml = null;
            // 1.普通消息
            if(item.tag){
                // 1.1带 tag 的自适应题
                if(item.link){
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-link-problem-template", itemDic);
                }else{                         
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
                }
            }else if (item.link) {
                // 1.1是链接消息
                var itemDic = {animate:true, item:item, linkText:"点击打开新网页"}
                if (item.news) {
                    itemDic["linkText"] = "点击打开新闻";
                }
                questionHtml = ArtTemplate("message-link-template", itemDic);
            }else if (item.img) {
                // 1.2是图片消息
                var itemDic = {imgI:imgI, item:item}
                questionHtml = ArtTemplate("message-img-template", itemDic);
            }else{
                // 1.3是文本消息
                var itemDic = {animate:true, item:item}
                questionHtml = ArtTemplate("message-text-template", itemDic);
            }

            var actionHtml = Util.getActionHtml(item);

            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");

            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                Page.clickEvent();
            }, 800)

            if(item.img){
                var a = "#"+imgI;
                Util.setMessageImgHeight(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            if (item.audio) {
                var url = item.audio;
                Common.playMessageSoun1(url);
            }
            if(item.tag){
                $('.lazy-img').imageloader();
            }

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);


            Page.numbers = parseInt(Page.numbers) + 1;  //计算已加载的数据个数

            // 存储下标
            if (opt == true) {
                // 问题下的消息, 记录问题下消息的下标
                Page.optionIndex = i;
            }else{
                // 普通消息
                Page.index = i;
            }
            // Util.storeData();
            
            if (item.action) {
                console.log(i);
                return;
            } else{
                setTimeout(function(){
                    console.log(i);
                    // 加载下一条数据
                    // 等待符号
                    Util.getLoadingHtml(true, false);

                    $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

                    setTimeout(function(){
                        // 2秒后加载信息
                        if(opt == true && Page.optionData.length == Page.optionIndex + 1){
                            // 选项执行完，但是选项中最后一个元素没有 action 的时候
                            // 选项执行完了， 执行下一条消息, 并重置问题下消息数组及下标
                            Page.optionData = null;
                            Page.optionIndex = 0;
                            Page.optionDataAnswer = "";
                            Page.loadMessage(Page.data, Page.index+1, false);
                        }else{
                            Page.loadMessage(arr, i+1, opt);
                        }

                    }, Util.messageTime)
                }, Util.waitTime)
            }
        },
        clickEvent:function(){
            // 动作按钮点击
            $(".btn-wx-auth").unbind('click').click(function(){

                if($(this).attr('disabledImg') == "true"){
                    console.log(000);
                    return;
                }
                console.log(111);
                $(this).attr({disabledImg:"true"});
                
                
                // 普通 action 按钮点击事件
                Util.actionClickEvent($(this));
            })

            // 选项按钮点击
            $(".option").unbind('click').click(function(){
                // 选项点击
                if ($(this).hasClass("unselect")) {
                    //  选中，将选项放到数组中
                    $(this).removeClass("unselect").addClass("select");
                    Page.options.push($(this).html()); 
                }else if ($(this).hasClass("select")) {
                    // 取消选中
                    $(this).removeClass("select").addClass("unselect");
                    Page.options.splice(Page.options.indexOf($(this).html()), 1);
                }else{

                }
                Page.options.sort();
                console.log(Page.options);
            })
            
            // 链接消息点击
            $(".message.link").unbind('click').click(function(){
                var link = $(this).attr("data-link");
                if (link == "www.code.com") {
                    Util.openRightIframe("codeEdit");   //打开编辑器

                }else if (link.indexOf("www.compile.com") > -1){
                    var language = link.split("/")[1]
                    // language = "python";
                    window.frames["codeCompile"].postMessage(language, '*'); // 传递值，告知要获取课程信息
                    Util.openRightIframe("codeCompile"); //打开编译器
                }else{
                    window.open(link);
                }
            })
            // 文本消息点击
            $(".message.text").unbind('click').click(function(){
            })
            // 图片消息点击
            $(".message.img").unbind('click').click(function(){
                var url = $(this).find('img.msg').attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
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
                var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
                if (url) {
                    // 'https://static1.bcjiaoyu.com/2.mp3'
                    Common.playMessageSoun2(url);  //播放钻石音效
                }
            })

            Page.clickEventTotal();
        },
        clickEventTotal:function(){
            // 帮助点击
            $(".help").unbind('click').click(function(){
                if($(".helps-view").css("display") == "none"){
                    $(".helps-view").show();
                }else{
                    $(".helps-view").hide();
                }
                $(".course-menu-view").hide();
            })

            // 课程目录
            $(".helps-view .course-menu").unbind('click').click(function(){
                $(".helps-view").hide();
                $(".course-menu-view").show();
            })
            // 课程目录点击事件
            $("li.catalog").unbind('click').click(function(){
                if ($(this).hasClass("select")) {
                    return;
                }
                // action 按钮变为开始学习
                $(".actions").html('<span class="btn-wx-auth catalogBegin bottom-animation">开始学习</span>');
                // 隐藏目录列表
                $(".course-menu-view").hide();
                // 记录当前点击的目录的下标，和对象
                Util.currentCatalogIndex = $(this).attr("data-index");
                // 重新激活点击事件
                Page.clickEvent();

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

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                window.open("https://www.cxy61.com");
            })           
        },
        loadMessageWithData:function(actionText, arr, i, opt){
            if (actionText != "") {
                // 去掉加载存储数据是节数据后没有 action，
                // 存储人工提问
                // 3.存储数据(人工回复)
                Page.numbers = parseInt(Page.numbers) + 1;  //计算已加载的数据个数
                $(".actions").html(null);
            }

            setTimeout(function(){
                Page.loadMessage(arr, i, opt);
            }, Util.messageTime)
        },
        loadClickMessage:function(actionText, exercise){
            // 本课程继续学
            // 人工提问
            var answerHtml ='<div class="answer"> \
                                <div class="msg-view">\
                                    <span class="content">'+actionText+'</span> \
                                </div>\
                                <img class="avatar" src="'+localStorage.avatar+'" />\
                            </div>';
            $(answerHtml).appendTo(".messages");
            
            // 等待机器答复
            Util.getLoadingHtml(true, false);

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);


            // 当前 message，
            var item = Page.data[Page.index];
            if (exercise == true) {
                // 点了习题提交按钮， 选择答对/答错数组
                if (item.answer != actionText) {
                    // 错误答案
                    Page.optionData = item.wrong;
                    Page.optionIndex = 0;
                    Page.optionDataAnswer = "wrong";   //标识是错误答案数组还是正确答案数组
                    Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);   //true 用来区分，普通消息还是问题下的消息
                }else{
                    Page.optionData = item.correct;
                    Page.optionIndex = 0;
                    Page.optionDataAnswer = "right";   //标识是错误答案数组还是正确答案数组
                    Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);
                }
            }else{
                // 点了普通按钮
                if (Page.optionData) {
                    // 问题下的普通按钮
                    if (Page.optionData.length == Page.optionIndex + 1) {
                        // 选项执行完了， 执行下一条消息, 并重置问题下消息数组及下标
                        var cc = Page.optionData[Page.optionIndex];   //取出选项最后一个元素
                        Page.optionData = null;
                        Page.optionIndex = 0;
                        Page.optionDataAnswer = ""
                        if(cc.again == true){
                            // 重做一遍习题
                            Page.loadMessageWithData(actionText, Page.data, Page.index, false);
                        }else{
                            Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);
                        }
                    }else{
                        // 选项接着执行下去
                        Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex+1, true)
                    }
                }else{
                    // 消息里面的普通按钮
                    // 先判断数组元素执行完了没有，完了发请求, 没有，对数组操作
                    if (!Page.data[Page.index + 1] || Page.data.length == Page.index + 1) {
                        // 已有数据源已显示完，重新请求数据， 并重新复制 Page.data, Page.index
                        // 请求当前课程的下一节课程
                        Page.requestCourseNextLessonData();
                    }else{
                        Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);                
                    }
                }
                
            }
        },
        requestCourseNextLessonData:function(){
            if (!Page.totalCourseData[Page.currentCourseIndex+1]) {
                $(".loading-chat").remove();
                $(".btn-wx-auth").attr({disabledImg:false});
                Common.dialog("当前课程已经学完.");
                return;
            }
            // 请求当前课程的下一节数据
            Page.currentCourseIndex += 1;
            Page.index = 0;
            Page.data = Page.totalCourseData[Page.currentCourseIndex];
            
            // 开始加载数据
            Page.loadSepLine(Page.currentCourseIndex);                              //加载节分割线
            Page.loadMessage(Page.data, Page.index, false);  //加载节数据
        },
        
        loadSepLine:function(number){
            $(".loading-chat").remove();

            // 加载节分割线
            var lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">第'+Utils.numberToChinese(number)+'节</span>\
                            </div>';
            $(lineHtml).appendTo(".messages");

            Page.numbers = parseInt(Page.numbers) + 1;  //计算已加载的数据个数
            
            // 等待机器答复
            Util.getLoadingHtml(true, false);

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        }
    };

    var Mananger = {
        phone:"",
        code:"",
        password:"",
        chooseAvatar:"https://static1.bcjiaoyu.com/avatars/1.png",
        timer:null,
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
                        $(".phone-invite-shadow-view").hide();
                       
                        Util.updateInfo(json);     //更新用户信息
                        Util.courseProgressUI();   //更新课程进度

                        // 判断本地是否有缓存, 有就把缓存加载出来，否则加载默认                        
                        if (localStorage.chatData) {
                            if(localStorage.currentCourse){
                                Mananger.getCourse(localStorage.currentCourse);  //更改缓存数据源后，加载会话消息
                            }else{
                                ChatStroage.init();                              //加载本地存储
                            }
                        }else{
                            Default.init();                                      //加载默认存储
                        }

                    },
                    error:function(xhr, textStatus){
                        Common.hideLoading();
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        getCourseInfoWithPk:function(actionText, course, catalogChange){
            // catalogChange， 是否点击目录切换的数据
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
                        
                        var courseIndex = data.learn_extent.last_lesson;
                        if (catalogChange == true) {
                            localStorage.currentCourseIndex = Util.currentCatalogIndex;
                            Util.courseCatalogsInit(array);   //更新目录
                            Util.courseProgressUI();          //更新课程进度
                            Mananger.updateExtentWithCatalog(course, localStorage.currentCourseIndex);  //更新服务器的进度
                        }else{
                            localStorage.currentCourseIndex = courseIndex;  //记录课程下标
                            Util.currentCatalogIndex = localStorage.currentCourseIndex;  //记录目录下标
                            Util.courseCatalogsInit(array);
                        }
                        courseIndex = parseInt(localStorage.currentCourseIndex);
                        
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
                                Util.openRightIframe("courseList");  //打开选择课程
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
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
                        
                        Util.currentCatalogIndex = localStorage.currentCourseIndex;  //记录目录下标
                        Util.courseCatalogsInit(array);

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
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
                        if (json.status == -4) {
                            // 普通 action 按钮点击事件
                            Util.actionClickEvent(this_);
                            return;
                        }
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
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        updateExtentWithCatalog:function(course, courseIndex){
            // 目录选择的时候，点开始学习更新服务器的进度
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
                        // console.log(json);
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
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        getPhoneCode:function(this_){
            // 获取验证码
            var phone = this_.find(".phone").children("input").val();
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
            }
            
            var url = "";
            if (this_.find(".view-tag").html() == "注册") {
                url = "/userinfo/signup_request/"
            }else if (this_.find(".view-tag").html() == "绑定手机") {
                url = "/userinfo/bind_telephone_request/"
            }else if (this_.find(".view-tag").html() == "找回密码") {
                url = "/userinfo/reset_password_request/";
            }

            if (this_.find(".get-code").html() == "获取验证码") {
                Common.isLogin(function(token){
                    $.ajax({
                        type:"get",
                        url:Common.domain + url,
                        data:{
                            username:phone
                        },
                        timeout:6000,
                        success:function(json){
                            if (json.status == 0) {
                                var time = 60;
                                Mananger.timer = setInterval(function(){
                                    --time;
                                    if (time > 0) {
                                        this_.find(".get-code").html(time+'s后重试');
                                    }else{
                                        this_.find(".get-code").html("获取验证码");
                                        clearInterval(Mananger.timer);
                                        Mananger.timer = null;
                                    }
                                },1000);
                            }else if (json.detail) {
                                Common.dialog(json.detail);
                            }else if (json.message) {
                                Common.dialog(json.message);
                            }
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
            }
        },
        lockPhone:function(this_){
            // 绑定手机
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (phone == "") {
                Common.dialog("请输入手机号");
                return
            }
            if (veriCode == "") {
                Common.dialog("请输入验证码");
                return
            }
            if (password == "") {
                Common.dialog("请输入密码");
                return
            }

            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURIComponent(phone)
            }
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/bind_telephone/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            Common.dialog("绑定成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        regPhone:function(phone, code, password, url, nickname){
            // 注册手机
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
            }
            var dic ={
                username:phone,
                password:password,
                verification_code:code,
                userinfo:{
                    name:nickname,
                    avatar:url
                }
            }

            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/signup/",
                    data:JSON.stringify(dic),
                    contentType:"application/json",
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            $(".choose-avatar-shadow-view").hide();
                            localStorage.token = json.token;
                            Mananger.getInfo();

                            window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息
                        }
                    },
                    error:function(xhr, textStatus){
                        Common.hideLoading();
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时,请重试");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        resetPassword:function(this_){
            // 重置密码
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (phone == "") {
                Common.dialog("请输入手机号");
                return
            }
            if (veriCode == "") {
                Common.dialog("请输入验证码");
                return
            }
            if (password == "") {
                Common.dialog("请输入密码");
                return
            }

            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
            }
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/reset_password/",
                    data:{
                        username:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            Common.dialog("修改密码成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
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
        goLogin:function(this_){
            // 登录
            var username = this_.find(".username").children("input").val(),
                password = this_.find(".password").children("input").val();
            if(username == ""){
                Common.dialog("请输入账号");
                return;
            }
            if(password == ""){
                Common.dialog("请输入密码");
                return;
            }
            var url = "",
                data = {};
           
            if (Util.currentCountryCode != "+86") {
                username = Util.currentCountryCode + username
            }

            url = "/userinfo/login/"
            data = {
                username:username,
                password:password
            }

            Common.showLoading();
            $.ajax({
                type:"post",
                url:Common.domain + url,
                data:data,
                success:function(json){
                    console.log(json);
                    localStorage.token = json.token;

                    Mananger.getInfo();

                    window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息
                },
                error:function(xhr, textStatus){
                    Common.hideLoading();
                    if (textStatus == "timeout") {
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 401) {
                        //去登录
                        localStorage.clear();
                        window.location.reload();
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
        getCountryCode:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/country.json",
                success:function(json){
                    var html = ArtTemplate("country-option-template", json);
                    $(".country-options").html(html);
                    
                    Page.clickEventLoginRelated();
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        }
    }
    // ---------------------4.帮助方法
    var Util = {
        link:"",
        linkType:"",
        waitTime:Common.getQueryString("wt")?10:1000,
        messageTime:Common.getQueryString("mt")?20:2000,
        currentCatalogIndex:0,     //当前目录的下标
        currentCountryCode:"+86", 
        storeData:function(){
            // 存储实时数据的下标，数据源， 问题中信息下标
            localStorage.data = JSON.stringify(Page.data);
            localStorage.index = Page.index;
            localStorage.optionData = JSON.stringify(Page.optionData);
            localStorage.optionIndex = Page.optionIndex;
            localStorage.optionDataAnswer = JSON.stringify(Page.optionDataAnswer);
            localStorage.pagenum = Page.pagenum;
        },
        setCourseIndex:function(course, courseIndex){
            if(course == 1){
                localStorage.pythonSimpleIndex = courseIndex;
            }else if(course == 2){
                localStorage.htmlSimpleIndex = courseIndex;
            }else if(course == 3){
                localStorage.cssSimpleIndex = courseIndex;
            }else if(course == 4){
                localStorage.jsSimpleIndex = courseIndex;
            }
        },
        getCourseIndex:function(){
            var course = localStorage.oldCourse;
            var courseIndex = 0;
            if(course == 1){
                courseIndex = localStorage.pythonSimpleIndex;
            }else if(course == 2){
                courseIndex = localStorage.htmlSimpleIndex;
            }else if(course == 3){
                courseIndex = localStorage.cssSimpleIndex;
            }else if(course == 4){
                courseIndex = localStorage.jsSimpleIndex;
            }
            courseIndex = parseInt(courseIndex) + 1;
            return courseIndex
        },
        setMessageImgHeight:function(item){
            // 给消息中的图片设高
            if(item.img){
                // 给图片设高
                var url = item.img;
                var pW = $(".message.img").last().find(".msg-view").width() * 0.50;
                Common.getPhotoWidthHeight(url, function(width, height){
                    var pH = 100;
                    if (width && height) {
                        pH = pW * height / width;
                    }
                    $(".message.img").last().find('img.msg').css({
                        height: pH + "px"
                    })
                    $(".message.img").last().find('.pre-msg').css({
                        height:pH + "px"
                    })
                })
            }
        },
        setMessageImgHeightLoadAgo:function(item){
            // 给消息中的图片设高
            if(item.img){
                // 给图片设高
                var url = item.img;
                var pW = $(".message.img").first().find(".msg-view").width() * 0.50;
                Common.getPhotoWidthHeight(url, function(width, height){
                    var pH = 100;
                    if (width && height) {
                        pH = pW * height / width;
                    }
                    $(".message.img").first().find('img.msg').css({
                        height: pH + "px"
                    })
                    $(".message.img").first().find('.pre-msg').css({
                        height:pH + "px"
                    })
                })
            }
        },
        updateInfo:function(json){

            Default.olduser = json.olduser;      //记录是新用户还是老用户
            localStorage.avatar = json.avatar.replace("http://", "https://");     //记录用户的头像
            localStorage.currentGrade = json.grade.current_name;    //记录当前等级
            localStorage.currentExper = json.experience;   //记录当前经验
            localStorage.currentZuan = json.diamond;     //记录当前钻石

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
        adjustQrCode:function(){
            var a = $(".mobile-app").offset().left;
            var b = $(".mobile-app").width();
            var c = $(".qr-code-view").width();
            $(".qr-code-view").css({
                left:(a - (c-b)/2)+"px",
                display:'flex'
            })
        },
        adjustCodeEditorsOnline:function(){
            var a = $(".code-online").offset().left;
            var b = $(".code-online").width();
            var c = $(".code-online-editors").width();

            if ($(".code-online-editors").css("display") == "none") {
                $(".code-online-editors").css({
                    left:(a - (c-b)/2)+"px",
                    display:'flex'
                })
            }else{
                $(".code-online-editors").css({
                    left:(a - (c-b)/2)+"px",
                    display:'none'
                })
            }

        },
        courseCatalogsInit:function(response){
            if (response["catalogs"]) {
                // 课程目录初始化
                var catalogHtml = "";
                console.log(response["catalogs"]);
                for (var i = 0; i < response["catalogs"].length; i++) {
                    if (i == parseInt(localStorage.currentCourseIndex)) {
                        // 当前课节被选中
                        response["catalogs"][i]["select"] = true
                    }else{
                        response["catalogs"][i]["select"] = false
                    }
                }
                var catalogHtml = ArtTemplate("course-menu-list-template", response["catalogs"]);
                $(".course-menu-list").html(catalogHtml);

                $(".helps-view .course-menu").show();
            }else{
                $(".helps-view .course-menu").hide();
            }
        },
        zuanAnimate:function(number){
            // 钻石出现，然后2秒后飞到右上角消失
            $(".zuan-shadow-view").show();
            $(".zuan-shadow-view .img").css({
                "margin-top": ($(window).height() - 200) / 2 + "px"
            });

            setTimeout(function(){
                $(".zuan-shadow-view .img").animate({
                    marginTop:"1%",
                    marginLeft:"88%",
                    width:20,
                    height:20,
                    opacity:0
                }, "slow", function(){
                    // 恢复原样
                    $(".zuan-shadow-view").hide();
                    $(this).css({
                        width:200,
                        height:200,
                        "margin-left":"calc(50% - 100px)",
                        "margin-top": ($(window).height() - 200) / 2 + "px",
                        opacity:1
                    })

                    $(".zuan span").html("x" + number);

                    $(".zuan").css({
                        transform:'scale(2)'
                    })

                    setTimeout(function(){
                        $(".zuan").css({
                            transform:'scale(1)'
                        })
                    }, 200)
                })
            }, 1000)
        },
        growAnimate:function(number){
            $(".grow-number-ani").remove();
            var growHtml = '<span class="grow-number-ani fadeInOut">经验 +'+number+'</span>';
            $(".chat").append(growHtml);
        },
        gradeAnimate:function(){
            $(".up-grade-shadow-view").show();
            $(".up-grade-shadow-view .img").css({
                "margin-top": ($(window).height() - 200) / 2 + "px"
            });
            setTimeout(function(){
                // 更改等级信息
                $(".up-grade-shadow-view").hide();
            }, 2000)
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
                                    <img class="avatar" src="https://static1.bcjiaoyu.com/binshu.jpg" />\
                                    <div class="msg-view-parent">\
                                        <div class="msg-view">\
                                            <span class="content">'+message+'</span> \
                                        </div>\
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
        },
        courseProgressUI:function(){
            // 更新课程进度，
            //1.有默认课程，数据的时候，加载 2.选择课程的时候加载
            if (localStorage.currentCourse) {
                var total = parseInt(localStorage.currentCourseTotal);
                var studyN = parseInt(localStorage.currentCourseIndex);
                var unStudyN = total - studyN;

                var studyHtml = "";
                var unStudyHtml = "";
                for (var i = 0; i < studyN; i++) {
                    studyHtml += '<li class="study cp">\
                                    <img src="../../statics/images/cp1.png" alt="" />\
                                </li>'
                }
                console.log(i);
                for (var j = 0; j < unStudyN; j++) {
                    unStudyHtml += '<li class="unstudy cp">\
                                    <img src="../../statics/images/cp2.png" alt="" />\
                                </li>'
                }

                $(".courseProgressView .cp").remove();     //移除以前的所有进程
                $(studyHtml).appendTo(".courseProgressView");
                $(unStudyHtml).appendTo(".courseProgressView");

                var cp = $(".courseProgressView .cp").eq(0).height();
                var unStudyH = cp * ($(".courseProgressView .cp").length-1);
                var studyH = cp * ($(".courseProgressView .cp.study").length-1);

                $(".courseProgressView img.studyp").css({
                    height:studyH + "px"
                })
                $(".courseProgressView img.unstudyp").css({
                    height:unStudyH + "px"
                })


                $(".main-view").css({
                    "margin-left":0
                })
                $(".main-view .left-view .chat").css({
                    width:"calc(90%)"
                })
                $(".courseProgress").show();

            }else{
                $(".main-view").css({
                    "margin-left":"2%"
                })
                $(".courseProgress").hide();

                $(".main-view .left-view .chat").css({
                    width:"calc(100%)"
                })
            }
        },
        updateCourseProgress:function(){
            //3.更新进度的时候加载
            if ($(".courseProgressView .unstudy").length) {
                var unstudy = $(".courseProgressView .unstudy").eq(0);
                $(unstudy).children("img").attr({src:"../../statics/images/cp1.png"});
                $(unstudy).removeClass("unstudy").addClass("study");

                var cp = $(".courseProgressView .cp").eq(0).height();
                var unStudyH = cp * ($(".courseProgressView .cp").length-1);
                var studyH = cp * ($(".courseProgressView .cp.study").length-1);

                $(".courseProgressView img.studyp").css({
                    height:studyH + "px"
                })
                $(".courseProgressView img.unstudyp").css({
                    height:unStudyH + "px"
                })
            }
        },
        actionClickEvent:function(this_){
            // 普通 action 按钮点击事件
            if (this_.hasClass("exercise")) {
                // 点了习题的，提交答案的按钮
                if (!Page.options || !Page.options.length) {
                    Common.dialog("请选择一个选项");
                    $(".btn-wx-auth").attr({disabledImg:false});
                    $(".loading-chat").remove();
                    return;
                }
                var msg = Page.options.join(',');
                Page.options = [];
                Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
            }else{
                // 普通的 action 按钮
                Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件 
            }
        },
        openRightIframe:function(tag){
            if (tag == "img") {
                $(".right-view>img").show();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
            }else if (tag == "courseList") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").show();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
            }else if (tag == "codeEdit") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").show();
                $(".right-view .iframe-scroll.codeCompile").hide();
            }else if (tag == "codeCompile") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompile").show();
            }
        },
        openLink:function(link){
            var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
            params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
            console.log(params);
            window.open(link, '_blank', params);
        },
        getActionHtml:function(item){
            var actionHtml = "";
            if (item.hasAction) {
                // 新闻
                actionHtml = '<span class="btn-wx-auth bottom-animation notNews">暂时不看</span>\
                            <span class="btn-wx-auth bottom-animation nextNews">下一条</span>';
            }else if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var j = 0; j < item.action.length; j++) {
                        var option = item.action[j];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                }else{
                    // 单按钮
                    if (item.action == "点击选择课程") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }
                }
            }
            return actionHtml;
        },
        getLoadingHtml:function(animate, before){
            // animate，是否有动画， before 是在之前还是之后
            var loadingWHtml = "";
            if (animate == true) {
                loadingWHtml = '<div class="loading-chat left-animation">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
            }else{
                loadingWHtml = '<div class="loading-chat">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
            }
            if (before) {
                $(loadingWHtml).prependTo($(".messages"));
            }else{
                $(loadingWHtml).appendTo(".messages");
            }

            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        }
    }
    //模板帮助方法 
    ArtTemplate.helper('TheMessage', function(message){
        try {
           var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
           console.log(msg);
           return msg
        }
        catch(err){
            console.log(error);
            return message;
        }
    });
    Page.init();

});
