define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var Utils = require('common/utils.js?v=1.1');
    ArtTemplate.config("escape", false);

    var HomeRequest = require('home/HomeRequest.js?v=1.1');
    HomeRequest = HomeRequest.Mananger;

    var HomeUtil = require('home/HomeUtil.js?v=1.1');
    HomeUtil = HomeUtil.Util;

    var HomeClickEvent = require("home/HomeClickEvent.js?v=1.1");
    HomeClickEvent = HomeClickEvent.HomeClickEvent;

    // ----------------------------------1.默认数据
    var Default = {
        olduser:false,
        init:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    Page.index = 0;
                    Page.data = json.default;
                    Page.loadMessage(Page.data, Page.index, false);
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        }
    }
    // --------------------------------2.缓存数据
    var ChatStroage = {
        numbers:0,    //已加载数据的个数
        length:50,   //默认一组加载多少个
        timer:null,
        timerAgo:null,
        loadMore:true,  //上拉的时候判断是否可以继续上拉加载
        isLoadingAgoMessage:false,    //标记是否在加载过去的消息，用于限制页面是否滚动
        init:function(callback){
            // 加载缓存数据， 并展示出来
            var array = Utils.getValue(Utils.LSStrings.chatData);

            // 加载存储数据中所有的数据（最新10个数据）
            var arr1 = [];
            for (var i = array.length - 1; i > array.length-1-ChatStroage.length; i--) {
                if (array[i]){
                    arr1.push(array[i]);
                }
            }
            arr1 = arr1.reverse();
            ChatStroage.load(arr1, 0, arr1.length, callback)
        },
        load:function(arr, i, arrLen, callback){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            if (i >= arrLen) {
                /*
                Common.isLogin(function(token){
                    if (token) {
                        if (localStorage.newsTime) {
                            var oldTime = parseInt(localStorage.newsTime);
                            var nowTime = (new Date()).valueOf();
                            var times = nowTime - oldTime;
                            var leave1=times%(24*3600*1000)
                            var hours=Math.floor(leave1/(3600*1000))
                            if (hours < 1) {
                                // 不到1小时,不推送新闻
                                ChatStroage.loadLastItem(arr, arrLen);   //加载最后一条信息
                                return
                            }
                        }
                        News.init();  //加载新闻
                    }else{
                        //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                        ChatStroage.loadLastItem(arr, arrLen);
                    }
                })
                */
               ChatStroage.loadFirstItem();
                //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                if(callback){callback();}
                else{
                    ChatStroage.loadLastItem(arr, arrLen);
                }
                return;
            }

            // 等待符号
            HomeUtil.getLoadingHtml(false, false);
            var msgHtml = Util.getMsgHtml(item, imgI, false, false);
            $(".loading-chat").remove()
            $(msgHtml).appendTo(".messages");

            Util.recordMsgIndex(item, false, true);

            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            if(item.img){
                HomeUtil.setMessageImgHeight(item);  //给图片消息中图片设高
                var a = "#"+imgI;
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            if(item.tag){
                $('.lazy-img').imageloader();
            }

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 20);

            ChatStroage.load(arr, i+1, arrLen, callback);

        },
        loadLastItem:function(array, arrLen){
            // 取出上次的数据源，接着执行
            
            Page.data = Utils.getValue(Utils.LSStrings.data) ? Utils.getValue(Utils.LSStrings.data) : [];
            Page.index = Utils.getValue(Utils.LSStrings.index) ? Utils.getValue(Utils.LSStrings.index) : 0;
            Page.optionData = Utils.getValue(Utils.LSStrings.optionData) ? Utils.getValue(Utils.LSStrings.optionData) : [];
            Page.optionIndex = Utils.getValue(Utils.LSStrings.optionIndex) ? Utils.getValue(Utils.LSStrings.optionIndex) : 0;
            Page.optionDataAnswer = Utils.getValue(Utils.LSStrings.optionDataAnswer) ? Utils.getValue(Utils.LSStrings.optionDataAnswer) : "";

            // 判断存储的最后一个元素是否有 action
            var item1 = array[arrLen-1]
            var actionHtml = "";
            if (Utils.getValue(Utils.LSStrings.currentCourse) != Utils.getValue(Utils.LSStrings.oldCourse)) {
                actionHtml = '<span class="btn-wx-auth begin bottom-animation">开始学习</span>';
            }else if (item1.news || item1.robot) {
                // 最后一条是新闻,找到前一条是 action 的
                // 或
                // 最后一条是图灵机器人消息，找到前一条是 action 的
                var array1 = Utils.getValue(Utils.LSStrings.chatData);
                for(var i=array1.length - 1; i>=0; i--){
                    if(array1[i].action){
                        item1 = array1[i];
                        break;
                    }
                }
                actionHtml = HomeUtil.getActionHtml(item1)
            }else if (item1.action) {
                actionHtml=HomeUtil.getActionHtml(item1);
            }else{
                //当前存储元素加载完，之后，取数据源元素
                // 不含 action，取当前数据源中下一条数据,知道遇到 含action的为止
                if (!Page.optionData.length || Page.optionData.length == Page.optionIndex + 1) {
                    //判断原始数据源
                    if (Page.data.length == Page.index + 1) {
                        // 已有数据源执行完，请求新的

                        // 请求当前课程的下一节课程
                        Page.requestCourseData("", false);
                    }else{
                        Page.loadMessage(Page.data, Page.index+1, false);
                        // ChatStroage.load(Page.data, Page.index+1, Page.data.length, true);
                    }
                }else{
                    // 选项接着执行下去
                    Page.loadMessage(Page.optionData, Page.optionIndex+1, true);
                    // ChatStroage.load(Page.optionData, Page.optionIndex, Page.optionData.length, true);
                }
            }

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                Page.clickEvent();
            }, 800)
        },
        loadFirstItem:function(){
            $(".loadAgoMore").remove();
            // 添加一个点击加载更多
            var loadAgoMoreHtml = "";
            var chatData = Utils.getValue(Utils.LSStrings.chatData);
            if (ChatStroage.numbers<chatData.length){
                loadAgoMoreHtml = '<div class="loadAgoMore">点击加载更多</div>';
            }else{
                loadAgoMoreHtml = '<div class="loadAgoNoMore">已经到头了</div>';
            }
            $(loadAgoMoreHtml).prependTo(".messages");


            $(".loadAgoMore").unbind('click').click(function(){
                ChatStroage.isLoadingAgoMessage = true;
                // $(".loadAgoMore").remove();
                // 判断存储数据是否已全部加载完
                var chatData = Utils.getValue(Utils.LSStrings.chatData);
                if (ChatStroage.numbers<chatData.length){
                    //存储数据源还没有加载完, 继续加载(靠后的10条数据)。 判断已加载数据个数与存储个数是否相同
                    var arr1 = [];
                    var originIndex = chatData.length-1-ChatStroage.numbers,
                        lastIndex = chatData.length-1-ChatStroage.numbers-ChatStroage.length;
                    for (var i = originIndex; i > lastIndex; i--) {
                        if (chatData[i]) {
                            arr1.push(chatData[i]);
                        }
                    }

                    ChatStroage.timerAgo = setTimeout(function(){
                        // 等待符号,加载上一组记录
                        HomeUtil.getLoadingHtml(false, true);
                        ChatStroage.loadAgo(arr1, 0, arr1.length);
                    })
                }
            })
        },
        loadAgo:function(arr, i, arrLen){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            if (i >= arrLen) {
                // 重新赋值点击加载更多
                ChatStroage.loadFirstItem();
                $(".loading-chat").remove();
                Page.clickEvent();

                /*
                ChatStroage.loadMore = true;
                //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                $(".loading-chat").remove();
                Page.clickEvent();
                */
                return;
            }

            var msgHtml = Util.getMsgHtml(item, imgI, false, true);
            $(".loading-chat").remove();
            $(msgHtml).prependTo($(".messages"));

            Util.recordMsgIndex(item, true, true);
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            if(item.img){
                var a = "#"+imgI;
                HomeUtil.setMessageImgHeightLoadAgo(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            if(item.tag){
                $('.lazy-img').imageloader();
            }

            ChatStroage.timerAgo = setTimeout(function(){
                // 加载上一条数据
                // 等待符号
                HomeUtil.getLoadingHtml(false, true);
                ChatStroage.timerAgo=setTimeout(function(){
                    // 2秒后加载信息
                    ChatStroage.loadAgo(arr, i+1, arrLen);
                })
            })
            // ChatStroage.loadAgo(arr, i+1, arrLen);
        },
    }
    var News = {
        newsData:[],
        newsIndex:0,
        init:function(){
            HomeUtil.getLoadingHtml(true, false);      //等待符号
            var lastNewsId = localStorage.lastNewsId?localStorage.lastNewsId:0;
            News.loadNews(lastNewsId, false);  //请求新闻数据
        },
        loadMessage:function(arr, i){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            var questionHtml = Util.getMsgHtml(item, imgI, true, false);
            var actionHtml = HomeUtil.getActionHtml(item);

            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");

            if(item.img){
                var a = "#"+imgI;
                HomeUtil.setMessageImgHeight(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            if(item.tag){
                $('.lazy-img').imageloader();
            }

            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                $("html,body").animate({scrollTop:$("html,body")[0].scrollHeight}, 300);

                Page.clickEvent();
            }, 800)

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 1.存储数据(默认数据)
            var array = [];
            if (Utils.getValue(Utils.LSStrings.chatData)) {
                array = Utils.getValue(Utils.LSStrings.chatData);
            }
            item['question'] = true;  //当前消息是否是机器回复
            item['line'] = false;
            array.push(item)
            Utils.setValue(Utils.LSStrings.chatData, array);

            Util.recordMsgIndex(item, false);
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            if (item.news) {
                News.newsIndex = i;                 //记录新闻下标
                localStorage.lastNewsId = item.pk;  //存储新闻的阅读下标
            }else{
                // 存储下标
                Page.index = i;
            }
            Util.storeData();

            if ((item.action || item.hasAction) && !item.isHide) {
                // 存在行为按钮, 不继续执行, 存储当前下标
                console.log(i);
                return;
            } else{
                setTimeout(function(){
                    // 加载下一条数据
                    HomeUtil.getLoadingHtml(true, false);  //等待符号
                    $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

                    setTimeout(function(){
                        // 2秒后加载信息
                        News.loadMessage(arr, i+1);
                    }, Util.messageTime)
                }, Util.waitTime)
            }
        },
        clickNotLook:function(){
            // 存储当前时间
            var nowTime = (new Date()).valueOf();
            localStorage.newsTime = nowTime;

            $(".loading-chat").remove();
            // 一开始有缓存信息，加载缓存信息的最后一个 action
            var array = JSON.parse(localStorage.chatData);
            ChatStroage.loadLastItem(array, array.length);
        },
        clickNextNews:function(){
            //请求下一条新闻
            if (News.newsData[News.newsIndex+1]) {
                News.newsIndex = News.newsIndex+1;

                $(".actions").html(null);
                // 加载下一条数据
                HomeUtil.getLoadingHtml(true, false);  //等待符号
                setTimeout(function(){
                    // 2秒后加载信息
                    News.loadMessage(News.newsData, News.newsIndex);
                }, Util.messageTime)
            }else{
                $(".actions").html(null);
                HomeUtil.getLoadingHtml(true, false);  //等待符号
                var lastNewsId = localStorage.lastNewsId?localStorage.lastNewsId:0;
                News.loadNews(lastNewsId, true);  //请求新闻数据
            }
        },
        loadNews:function(lastId, isClickNext){
            Common.isLogin(function(token){
                if (token) {
                    $.ajax({
                        type:"get",
                        url:Common.domain + "/news/news/?current_id="+lastId,
                        success:function(json){
                            json.results.sort(compare('pk'));
                            var array = [];

                            for (var i = 0; i < json.results.length; i++) {
                                json.results[i]["news"] = true;     //是否是新闻消息
                                var item = json.results[i];
                                var dic1 = {"pk":item.pk, "news":true}, dic2 = {"pk":item.pk, "news":true};
                                if (item.content) {
                                    dic1["message"] = item.content
                                }
                                if (item.link) {
                                    dic1["link"] = item.link
                                }
                                if (item.images) {
                                    dic2["img"] = item.images
                                    dic2["hasAction"] = true     //图片后紧跟新闻双按钮
                                    array.push(dic1);
                                    array.push(dic2);
                                }else{
                                    dic1["hasAction"] = true     //摘要后紧跟新闻双按钮
                                    array.push(dic1);
                                }
                            }

                            function compare(property){
                                return function(a,b){
                                    var value1 = a[property];
                                    var value2 = b[property];
                                    return value1 - value2;
                                }
                            }

                            // array.sort(compare('pk'));
                            console.log(array);

                            News.newsData = array;
                            News.newsIndex = 0;

                            if (!News.newsData.length) {
                                // 没有新闻数据
                                if (!isClickNext) {
                                    News.clickNotLook();       //1.第一次进入，加载最后一条数据
                                }else{
                                    Common.bcAlert("今日新闻推送已经完了，是否要开始学习？", function(){
                                        News.clickNotLook();   //2.点下一条，加载最后一条数据
                                    }, function(){
                                        $(".loading-chat").remove();
                                        var array = JSON.parse(localStorage.chatData);
                                        var actionHtml = HomeUtil.getActionHtml(array[array.length-1]);
                                        $(".btns .actions").html(actionHtml);
                                        Page.clickEvent();
                                    }, "确定", "取消");
                                }
                            }else{
                                // 有数据，加载新闻信息 UI
                                News.loadMessage(News.newsData, News.newsIndex);
                            }
                        },
                        error:function(xhr, textStatus){
                            News.clickNotLook();       //请求新闻事变的时候，直接加载最后一条
                        }
                    })
                }else{
                    console.log("token 为空，不加载新闻");
                }
            })
        },
    }
    // ---------------------------3.正常请求数据
    var Page = {
        msgLaterIndex:0,  //会话点击加载新数据的数据长度(正)
        msgAgoIndex:1,    //会话点击加载更多的数据源长度(负)
        msgTotalIndex:0,  //会话页面的所有数据的长度(总)
        msgDataSource:[], //会话页面的所有数据源
        msgIndex:0,       //记录消息的下标
        originData:null,  //原始数据源（整个课程的数据,在这里主要针对未登录用户，当其打卡时，不去重新请求数据源）
        index:0,          //接受实时数据的下标
        data:[],          //接受实时数据，

        chatData:[],          //存储会话内容
        pagenum:1,            //请求数据分页
        options:[],           //记录选项

        optionData:[],        //记录用户当前选了答案之后的数组会话
        optionIndex:0,        //记录用户当前选了答案之后的数组会话下标
        optionDataAnswer:"",  //标识是错误答案数组还是正确答案数组
        init:function(){
            // 判断浏览器内核
            if(Common.platform.isMobile && !Common.platform.iPad){
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

            // 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {
                var a = e.data;
                if(a == "currentCourse"){
                    HomeUtil.courseProgressUI();   //更新课程进度

                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                    if(Utils.getValue(Utils.LSStrings.currentCourse) == Utils.getValue(Utils.LSStrings.oldCourse)){
                        // 回到原来的课程继续
                        var actionHtml = "";
                        var item = Page.data[Page.index];
                        actionHtml = HomeUtil.getActionHtml(item);
                        $(".btns .actions").html(actionHtml);
                    }else{
                        // 改变 action 的状态(开始学习)
                        $(".actions").html('<span class="btn-wx-auth begin bottom-animation">开始学习</span>');
                    }
                    Page.clickEvent();    //重新激活 action 点击事件
                }else if(a == "resetcurrentCourse"){
                    // 学完重学的时候
                    HomeUtil.courseProgressUI();   //更新课程进度
                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                    $(".actions").html('<span class="btn-wx-auth restart bottom-animation">重新学习</span>');
                    Page.clickEvent();    //重新激活 action 点击事件
                }else if(a == "loadCourses"){

                }else if(a == "closeCodeEdit"){
                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                }else if(a == "closeRightIframe"){
                    HomeUtil.openRightIframe("img");
                }else{
                    // 打开运行结果窗口，并赋值
                    // $(".code-result-shadow-view iframe").attr({src:a});
                    // $(".code-result-shadow-view").show();
                }
            }, false);
            
            // 快进模式按钮图片判断
            if (Common.getQueryString("wt") && Common.getQueryString("mt")) {
                //  取消快进
                $(".helps-view .fast-mode img").css({display:'block'})
            }else{
                // 快进
                $(".helps-view .fast-mode img").css({display:'none'})
            };
        },
        load:function(){

            // 判断用户是否登录
            if(!Utils.getValue(Utils.LSStrings.token)){
                //没登录
                console.log("debug:login:-->未登录，打开登录窗口");
                $(".phone-invite-shadow-view").show();
                // $(".login-shadow-view").show();
                Page.clickEvent();
            }else{
                //已登录
                console.log("debug:login:-->已登录，请求数据");
                Util.loginSuccessInit();
            }

            console.log("debug:初始化国家代码");
            Mananger.getCountryCode();   //初始化国家代码
            Common.addCopyRight();   //添加版权标识
        },
        loadMessage:function(arr, i, opt){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            if (!item.isHide) {
                var questionHtml = Util.getMsgHtml(item, imgI, true, false)
                var actionHtml = HomeUtil.getActionHtml(item)

                $(".loading-chat").remove();
                $(questionHtml).appendTo(".messages");

                setTimeout(function(){
                    $(".btns .actions").html(actionHtml);
                    Page.clickEvent();
                }, 800)

                if(item.img){
                    var a = "#"+imgI;
                    HomeUtil.setMessageImgHeight(item);  //给图片消息中图片设高
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

                // 2.存储数据(当前消息是否是机器消息)
                var array = [];
                if (Utils.getValue(Utils.LSStrings.chatData)) {
                    array = Utils.getValue(Utils.LSStrings.chatData);
                }
                item['question'] = true;   //当前消息是否是机器消息
                item['line'] = false;
                array.push(item)
                Utils.setValue(Utils.LSStrings.chatData, array);

                Util.recordMsgIndex(item, false);
                ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

                if (item.news) {
                    // 存储新闻下标
                    News.newsIndex = i;                 //记录新闻下标
                    localStorage.lastNewsId = item.pk;  //存储新闻的阅读下标
                }else{
                    // 存储下标
                    if (opt == true) {
                        // 问题下的消息, 记录问题下消息的下标
                        Page.optionIndex = i;
                    }else{
                        // 普通消息
                        Page.index = i;
                    }
                    Util.storeData();
                }
            }

            if ((item.action || item.hasAction) && !item.isHide) {
                // console.log(i);
                return;
            } else{
                setTimeout(function(){
                    // console.log(i);
                    // 加载下一条数据
                    // 等待符号
                    HomeUtil.getLoadingHtml(true, false);

                    $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

                    setTimeout(function(){
                        // 2秒后加载信息
                        if(opt == true && Page.optionData.length == Page.optionIndex + 1){
                            // 选项执行完，但是选项中最后一个元素没有 action 的时候
                            // 选项执行完了， 执行下一条消息, 并重置问题下消息数组及下标
                            Page.optionData = [];
                            Page.optionIndex = 0;
                            Page.optionDataAnswer = "";
                            Page.loadMessage(Page.data, Page.index+1, false);
                        }else{
                            Page.loadMessage(arr, i+1, opt);
                        }

                    }, HomeUtil.messageTime)
                }, HomeUtil.waitTime)
            }
        },
        clickEvent:function(){
            //自适应题中图片懒加载
            $('.lazy-img').imageloader();

            // 根据 action 的高度设置 messages 的底部偏移量
            setTimeout(function(){
                var height = $(".btns").height();
                // console.log(height);
                if (height > 100) {
                    $(".messages").css({"margin-bottom":height+"px"});
                }else{
                    $(".messages").css({"margin-bottom":"100px"});
                }
                if(!ChatStroage.isLoadingAgoMessage){
                    $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
                }
            }, 1000);

            // 顺序题
            $(".sequences").sortable();
            $(".sequence.option").css({cursor: "move"});

            // 动作按钮点击
            $(".btn-wx-auth").unbind('click').click(function(){
                ChatStroage.isLoadingAgoMessage = false;
                if($(this).attr('disabledImg') == "true"){
                    // console.log(000);
                    Common.dialog("当前按钮不能点，可以刷新重试");
                    return;
                }
                $(this).attr({disabledImg:"true"});

                if($(this).hasClass("beginExercise")){
                    // 1.开始答题
                    var typeView = "exercise";
                    var yourAnswerArr = [];
                    var item = Page.msgDataSource[Page.msgDataSource.length-1];

                    QuestionView.init(item, typeView, yourAnswerArr);
                    Page.clickExerciseClickEvent();
                    console.log("debug:btn-wx-auth:-->开始答题");
                }else if ($(this).hasClass("wx-auth")) {
                    //2.选择课程
                    console.log("debug:btn-wx-auth:-->选择课程");
                    HomeUtil.openRightIframe("courseList");
                }else if($(this).hasClass("catalogBegin")){
                    // 3.开始学习(更换目录)
                    console.log("debug:btn-wx-auth:-->课程目录");
                    Page.requestCourseData($(this).html(), true);
                }else if($(this).hasClass("begin")){
                    // 4.开始学习(更换课程)
                    console.log("debug:btn-wx-auth:-->开始学习");
                    HomeUtil.currentCatalogIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);
                    Page.requestCourseData($(this).html(), true);
                }else if($(this).hasClass("restart")){
                    // 5.重新学习
                    console.log("debug:btn-wx-auth:-->重新学习");
                    HomeUtil.currentCatalogIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);
                    Page.requestCourseData($(this).html(), true);
                }else if($(this).hasClass("notNews")){
                    // 6.点了新闻暂时不看
                    News.clickNotLook();
                }else if($(this).hasClass("nextNews")){
                    // 7.点了新闻下一条
                    News.clickNextNews();
                }else{
                    // 8.普通按钮(打卡、添加奖励、普通)
                    var item = null,
                        parentItem = null;
                    if(Page.optionData.length){
                        // 问题下的按钮
                        item = Page.optionData[Page.optionIndex];
                        parentItem = Page.data[Page.index];
                    }else{
                        // 消息下的按钮
                        item = Page.data[Page.index];
                    }
                    var course = Utils.getValue(Utils.LSStrings.oldCourse);
                    var courseIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);
                    var courseTotal = Utils.getValue(Utils.LSStrings.currentCourseTotal);

                    if(item.record == true){
                        // 打卡
                        console.log("debug:btn-wx-auth:-->打卡按钮");
                        courseIndex = parseInt(courseIndex) + 1;

                        //判断是否是已经打过最后一节课
                        if(courseIndex > courseTotal){
                            //不打卡
                            $(".btn-wx-auth").attr({disabledImg:false});
                            Common.dialog("本课程已结束，选择其它课程，再继续");
                            $(".loading-chat").remove();
                        }else{
                            Mananger.updateExtent(course, courseIndex, false, $(this));   //更新学习进度
                        }
                    }else{
                        if(item.hasOwnProperty("zuan_number") || item.hasOwnProperty("grow_number")){
                            // 奖励钻石，经验
                            console.log("debug:btn-wx-auth:-->添加钻石");
                            courseIndex = parseInt(courseIndex) + 1;
                            
                            var tag = item.tag?item.tag:"",
                                status = Page.optionDataAnswer;
                            if(parentItem && parentItem.tag){
                                tag = parentItem.tag;
                                status = Page.optionDataAnswer;
                            }
                            Mananger.addReward(course, courseIndex, item.chapter, item.grow_number, item. zuan_number, tag, status, $(this));  //奖励钻石
                        }else{
                            // 普通 action 按钮点击事件
                            console.log("debug:btn-wx-auth:-->普通按钮");
                            Util.actionClickEvent($(this));
                        }
                    }
                }
            })
            // 选项按钮点击
            $(".actions .option").unbind('click').click(function(){
                var item = Page.data[Page.index];
                if (item.type === "blankProblem") {
                    // 填空题
                    if ($(".message").last().find(".bpDetailDesc").find(".bpoption.blank").length && !$(this).hasClass("blank")) {
                        var content = $(this).html(),
                            index = $(this).attr("data-index");
                        Page.options.push(content); 
                        var eles = $(".message").last().find(".bpDetailDesc").find(".bpoption.blank").eq(0);
                        eles.html(content);
                        eles.attr({"data-index":index});
                        eles.addClass("exist").removeClass("blank");
                        $(this).html("");
                        $(this).addClass("blank");

                        // 填空题选项复原
                        $(".message").last().find(".bpDetailDesc").find(".bpoption.exist").unbind('click').click(function(){
                            if ($(this).hasClass("exist")) {
                                var content = $(this).html(),
                                    index = $(this).attr("data-index");
                                Page.options.splice(Page.options.indexOf(content), 1);
                                $(".actions .option[data-index="+index+"]").html(content);
                                $(".actions .option[data-index="+index+"]").removeClass("blank");
                                $(this).html("");
                                $(this).addClass("blank").removeClass("exist");
                            }
                        })
                    }

                }else if(item.type === "sequenceProblem"){
                    // 顺序题
                    $(".sequences").sortable();
                } else{
                    // 选择题
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
                }
                console.log(Page.options);
            })

            // 消息链接点击
            $(".message.link").unbind('click').click(function(){
                var msgIndex = $(this).attr("data-msgIndex");
                msgIndex = parseInt(msgIndex);
                var i = Page.msgDataSource.length - Page.msgLaterIndex + msgIndex
                console.log(i, Page.msgDataSource[i])
                var item = Page.msgDataSource[i]
                if (item.type === "blankProblem" || item.type === "sequenceProblem" || item.type === "adaptProblem" || item.tag&&item.exercises) {
                    // 点击打开 overlay 答题，链接
                    if (i === Page.msgDataSource.length-1 && $(".btn-wx-auth").html() === "开始答题") {
                        // 最后一条，做题
                        var typeView = "exercise";
                        var yourAnswerArr = []
                    }else{
                        // 展示错题
                        var typeView = "mistake"
                        if (Page.msgDataSource[i + 1]) {
                            var yourAnswer = Page.msgDataSource[i + 1];
                            var yourAnswerArr = yourAnswer.message.split(",");
                        }else{
                            var yourAnswerArr = [];
                        }
                    }

                    QuestionView.init(item, typeView, yourAnswerArr);
                    Page.clickExerciseClickEvent();
                }else{
                    var link = $(this).attr("data-link");
                    var typeEditor = $(this).attr("data-typeEditor");
                    if(link == "www.code.com"){
                        $("#codeEdit").attr({src:"codeEdit.html"});
                        HomeUtil.openRightIframe("codeEdit");   //打开编辑器
                    }else if(link.indexOf("www.compile.com") > -1){
                        var language = link.split("/")[1];
                        // window.frames["codeCompile"].postMessage(language, '*'); // 传递值，告知要获取课程信息
                        // HomeUtil.openRightIframe("codeCompile"); //打开编译器

                        $("#codeCompileRN").attr({src:"codeCompileRN.html?lang="+language})
                        HomeUtil.openRightIframe("codeCompileRN"); //打开编译器
                    }else{
                        var url = link;
                        if (HomeUtil.hasVideoStr(link)) {
                            url = "videoPlayer.html?videoUrl=" + encodeURIComponent(link);
                        }
                        var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                        params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                        //console.log(params);

                        if(url.indexOf("free.bcjiaoyu.com")>-1){
                            window.open(url, '_blank', params);
                        }else{
                            $("#thirdSite").attr({src:url});
                            HomeUtil.openRightIframe("thirdSite");   //打开三方网站
                        }
                    }
                }
            })
            
            HomeClickEvent.clickEvent();
            Page.clickEventTotal();
        },
        clickExerciseClickEvent:function(){
            // 提交习题点击
            $(".question-submit-view").unbind('click').click(function(){
                if ($(".question-exercise-view").find(".choice-problem-view").length) {
                    console.log(QuestionView.options);
                    if (!QuestionView.options.length) {
                        alert("需要明确的答案，才可以交卷哦！")
                        return;
                    }
                }else if($(".question-exercise-view").find(".blank-problem-view").length){
                    if ($(".blank-question-option.blank-question-option-blank").length) {
                        alert("需要明确的答案，才可以交卷哦！")
                        return;
                    }
                    console.log(QuestionView.options);
                }else if ($(".question-exercise-view").find(".sequence-problem-view").length) {
                    var myAnswers = [];
                    $(".sequence-question-option").each(function(item, i){
                        var content = $(this).attr("data-content");
                        myAnswers.push(content);
                    })
                    QuestionView.options = myAnswers;
                    console.log(QuestionView.options);
                }
                
                var msg = QuestionView.options.join(',');
                QuestionView.options = [];
                $(".question-shadow-view").css({display:'none'})
                Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
            })
            // 图片放大处理
            $(".question-shadow-view .img").unbind('click').click(function(){
                var url = $(this).attr("src");
                $("#bigImg").attr({src:"imageScaleBig.html"});
                HomeUtil.openRightIframe("bigImg");   //打开三方网站
                
                document.getElementById("bigImg").onload = function () {
                    console.log(1);
                    $("#bigImg").contents().find(".imgdiv").children("img").attr({src:url});    
                }
            })
        },
        clickEventTotal:function(){
            HomeClickEvent.clickEventTotal(Page.clickEvent);
            Page.clickEventLoginRelated();
        },
        clickEventLoginRelated:function(){
            HomeClickEvent.clickEventLoginRelated();

            // ---------------------------------------------II:新的登录
            // -------------------------------2.手机/邀请码登录
            $(".phone-account-view .login-btn").unbind('click').click(function(){
                // 手机号登录
                Mananger.goLogin($(".phone-account-view"));
            })
            $(".invite-account-view .login-btn").unbind('click').click(function(){
                // 邀请码登录
                Mananger.goLogin($(".invite-account-view"));
            })
            $(".yzm-account-view .login-btn").unbind('click').click(function(){
                // 验证码登录
                Mananger.goLogin($(".yzm-account-view"));
            })

            // -----------------------------3.手机注册
            $(".choose-avatar-view .reg-btn").unbind('click').click(function(){
                // 注册 btn
                var nickname = $(".choose-avatar-view .nickname input").val();
                if (nickname == "") {
                    Common.dialog("请输入昵称");
                    return
                }
                Mananger.regPhone(HomeUtil.phone, HomeUtil.code, HomeUtil.password, HomeUtil.chooseAvatar, nickname);
            })        


            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){

                    var CourseMessageData = localStorage.CourseMessageData?localStorage.CourseMessageData:"";
                    var CourseData = localStorage.CourseData ? localStorage.CourseData : "";

                    localStorage.clear();
                    window.location.reload();

                    if (CourseMessageData) {
                        localStorage.CourseMessageData = CourseMessageData;
                    }
                    if (CourseData) {
                        localStorage.CourseData = CourseData;
                    }
                })
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
        },
        loadMessageWithData:function(actionText, arr, i, opt){
            if (actionText != "") {
                // 去掉加载存储数据是节数据后没有 action，
                // 存储人工提问
                // 3.存储数据(人工回复)
                var array = [];
                if (Utils.getValue(Utils.LSStrings.chatData)) {
                    array = Utils.getValue(Utils.LSStrings.chatData);
                }
                var item = {"message":actionText, "question":false, "line":false};
                array.push(item)
                Utils.setValue(Utils.LSStrings.chatData, array);
                
                Util.recordMsgIndex(item, false);
                ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

                $(".actions").html(null);
            }

            setTimeout(function(){
                Page.loadMessage(arr, i, opt);
            }, Util.messageTime)
        },
        loadClickMessage:function(actionText, exercise){
            //展示回复信息
            var imgI = "i_"+ChatStroage.numbers;
            var item = {"message":actionText, "question":false, "line":false};
            var answerHtml = Util.getMsgHtml(item, imgI, false, false);
            $(answerHtml).appendTo(".messages");

            // 展示等待信息
            HomeUtil.getLoadingHtml(true, false);
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 当前 message，
            var item = Page.data[Page.index];
            if (exercise == true) {
                // 点了习题提交按钮， 选择答对/答错数组
                if (item.type === "blankProblem" || item.type === "sequenceProblem") {
                    var answer = item.answer.join(",");
                }else{
                    // 将选择题的答案排序
                    var answer = item.answer.split(",").sort().join(",");
                }
                if (answer != actionText) {
                    // 错误答案
                    // 加载错误的表情包
                    HomeUtil.addEmoticonMessage("error", function(itemEmoticon){
                        // 加载答错的消息组
                        Page.optionData = item.wrong;
                        Page.optionIndex = 0;
                        Page.optionDataAnswer = "wrong";   //标识是错误答案数组还是正确答案数组
                        Page.optionYourAnswer = actionText;//标识用户选择的答案
                        if(itemEmoticon && HomeUtil.waitTime == 1000 && HomeUtil.messageTime == 2000){Page.optionData.unshift(itemEmoticon);}
                        Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);   //true 用来区分，普通消息还是问题下的消息
                    });
                }else{
                    // 加载答对的表情包
                    HomeUtil.addEmoticonMessage("encourage", function(itemEmoticon){
                        // 加载答对的消息组
                        Page.optionData = item.correct;
                        Page.optionIndex = 0;
                        Page.optionDataAnswer = "right";   //标识是错误答案数组还是正确答案数组
                        Page.optionYourAnswer = actionText;//标识用户选择的答案
                        if(itemEmoticon && HomeUtil.waitTime == 1000 && HomeUtil.messageTime == 2000){Page.optionData.unshift(itemEmoticon);}
                        Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);
                    });
                }
            }else{
                // 点了普通按钮
                if (Page.optionData.length) {
                    // 问题下的普通按钮
                    if (Page.optionData.length == Page.optionIndex + 1) {
                        // 选项执行完了， 执行下一条消息, 并重置问题下消息数组及下标
                        var cc = Page.optionData[Page.optionIndex];   //取出选项最后一个元素
                        Page.optionData = [];
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
                        Page.requestCourseData(actionText, false);
                    }else{
                        Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);
                    }
                }
            }
        },
        requestCourseData:function(actionText, flag){
            if(flag == true){
                // 展示回复(一般是开始学习，重新学习这种，还有未登录用户打卡的情形)
                var imgI = "i_"+ChatStroage.numbers;
                var item = {"message":actionText, "question":false, "line":false};
                var answerHtml = Util.getMsgHtml(item, imgI, false, false);
                $(answerHtml).appendTo(".messages");

                // 展示等待信息
                HomeUtil.getLoadingHtml(true, false);
                $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
            }

            // 请求课程数据
            var currentCourse = Utils.getValue(Utils.LSStrings.currentCourse);
            var oldCourse = Utils.getValue(Utils.LSStrings.oldCourse);
            var courseIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);
            if(currentCourse){
                if (oldCourse != currentCourse) {
                    // 切换课程学习
                    oldCourse = currentCourse;
                    Utils.setValue(Utils.LSStrings.oldCourse, oldCourse);
                }
                if (courseIndex != HomeUtil.currentCatalogIndex) {
                    // 点击目录更换课节数据
                    Mananger.getCourseInfoWithPk(actionText, oldCourse, true);
                }else{
                    Mananger.getCourseInfoWithPk(actionText, oldCourse, false);
                }
            }else{
                // 还从未有过选课
                Common.dialog("请选择一个课程");
                $(".loading-chat").remove();
            }    
        },
        loadSepLine:function(number){
            var msg = "第" + Utils.numberToChinese(number) + "节";
            $(".loading-chat").remove();

            // 存储节数据
            var array = [];
            if (Utils.getValue(Utils.LSStrings.chatData)) {
                array = Utils.getValue(Utils.LSStrings.chatData);
            }
            var item = {"message":msg, "question":false, "line":true};
            array.push(item)
            Utils.setValue(Utils.LSStrings.chatData, array);
            
            // 存储下标
            Util.recordMsgIndex(item, false);
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            // 展示节信息
            var imgI = "i_"+ChatStroage.numbers;
            var lineHtml = Util.getMsgHtml(item, imgI, false, false);
            $(lineHtml).appendTo(".messages");

            // 展示等待信息
            HomeUtil.getLoadingHtml(true, false);
            
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        }
    };
    var Mananger = {
        timer:null,
        getInfo:function(){
            HomeRequest.getInfo(function(json){
                // 存储个人信息
                Utils.setValue(Utils.LSStrings.userInfo, json);
                
                var oldCourse = Utils.getValue(Utils.LSStrings.oldCourse);
                if(oldCourse){
                    //有缓存课程
                    console.log("debug:有缓存课程，则先更改课程数据，再加载缓存信息流");
                    Mananger.getCourse(oldCourse);  //更改缓存数据源后，加载会话消息
                }else{
                    // 没有缓存课程, 加载欢迎语
                    
                    if(Utils.getValue(Utils.LSStrings.chatData)){
                        console.log("debug:无缓存课程，有缓存信息，加载缓存信息流");
                        ChatStroage.init();
                    }else{
                        console.log("debug:无缓存课程，无缓存信息，加载欢迎语");
                        Default.init();
                    }
                   
                }
            })
        },
        getCourseInfoWithPk:function(actionText, course, catalogChange){
            // catalogChange， 是否点击目录切换的数据
            HomeRequest.getCourse(course, function(data){
                Mananger.adjustCourseData(data, actionText, catalogChange, "getCourseInfoWithPk");
            });
        },
        getCourse:function(course){
            //网页每次刷新的时候，更改数据源，Page.data
            HomeRequest.getCourse(course, function(data){
                Mananger.adjustCourseData(data, "", false, "getCourse");
            })
        },
        adjustCourseData:function(data, actionText, catalogChange, tag){
            HomeRequest.adjustCourseData(data, actionText, catalogChange, function(){
                Page.clickEvent();
            }, function(array, courseIndex){
                if(array == "fail"){
                    if(tag == "getCourse"){
                        Mananger.startAdaptCourse(data.pk, "getCourse");
                    }else{
                        Mananger.startAdaptCourse(data.pk, "getCourseInfoWithPk", actionText, catalogChange);
                    }
                }else{
                    if(tag == "getCourse"){
                        if(array[courseIndex+1]){
                            Page.data = array[courseIndex + 1];
                            Page.optionData = [];
                            Page.optionIndex = 0;
                            Page.optionDataAnswer = "";
                            Utils.setValue(Utils.LSStrings.data, Page.data);
                            Utils.setValue(Utils.LSStrings.optionData, Page.optionData);
                            Utils.setValue(Utils.LSStrings.optionIndex, Page.optionIndex);
                            Utils.setValue(Utils.LSStrings.optionDataAnswer, Page.optionDataAnswer);
                        }
                        console.log("debug:加载缓存信息流");
                        ChatStroage.init();    //加载缓存会话消息
                    }else{
                        Page.index = 0;
                        Page.data = array[courseIndex+1];

                        Page.loadSepLine(courseIndex+1);
                        Page.loadMessageWithData(actionText, Page.data, Page.index, false);
                    }
                }
            }, tag);
        },

        startAdaptCourse:function(pk, flag, actionText, catalogChange){
            // 如果自适应课程，中 mycourse_json 是空的，则调该方法给他添加一套自己的课程
            // flag 用于区分是来自getCourseInfoWithPk 还是 getCourse
            HomeRequest.startAdaptCourse(pk, function(){
                if (flag == "getCourseInfoWithPk") {
                    Mananger.getCourseInfoWithPk(actionText, pk, catalogChange);
                }else{
                    Mananger.getCourse(pk);
                }
            })
        },

        addReward:function(course, courseIndex, chapter, growNum, zuanNum, tag, status, this_){
            // 奖励
            if (!chapter || chapter == "") {
                // 普通 action 按钮点击事件
                Util.actionClickEvent(this_);
                return;
            }
            HomeRequest.addReward(course, courseIndex, chapter, growNum, zuanNum, tag, status, this_, Page.optionYourAnswer, function(){
                Util.actionClickEvent(this_);
            })
        },
        updateExtent:function(course, courseIndex, catalog, this_){
            HomeRequest.updateExtent(course, courseIndex, catalog, function(result){
                if (result === "fail") {
                    // 重新激活点击事件
                    Page.clickEvent();
                }else{
                    if (!catalog) {
                        //console.log(json);
                        HomeUtil.updateCourseProgress();   //更新课程进度
                        
                        // 普通 action 按钮点击事件
                        Util.actionClickEvent(this_);
                    }
                }
            });
        },

        getPhoneCode:function(this_){
            // 获取验证码
            HomeRequest.getPhoneCode(this_);
        },
        lockPhone:function(this_){
            // 绑定手机
            HomeRequest.lockPhone(this_);
        },
        regPhone:function(phone, code, password, url, nickname){
            //注册手机
            console.log(phone, code, password, url, nickname);
            HomeRequest.regPhone(phone, code, password, url, nickname, function(json){
                // Common.dialog("注册成功");
                Util.loginSuccessInit();
            })
        },
        resetPassword:function(this_){
            // 重置密码
            HomeRequest.resetPassword(this_);
        },
        goLogin:function(this_){
            // 登录
            HomeRequest.goLogin(this_, function(){
                Util.loginSuccessInit();
            })
        },
        getCountryCode:function(){
            HomeRequest.getCountryCode(function(json){
                var html = ArtTemplate("country-option-template", json);
                $(".country-options").html(html);
                Page.clickEventLoginRelated();
            })
        },
    }
    // ---------------------4.帮助方法
    var Util = {
        currentCatalogIndex:0,     //当前目录的下标
        storeData:function(){
            // 存储实时数据的下标，数据源， 问题中信息下标
            Utils.setValue(Utils.LSStrings.data, Page.data);
            Utils.setValue(Utils.LSStrings.index, Page.index);
            Utils.setValue(Utils.LSStrings.optionData, Page.optionData);
            Utils.setValue(Utils.LSStrings.optionIndex, Page.optionIndex);
            Utils.setValue(Utils.LSStrings.optionDataAnswer, Page.optionDataAnswer);
        },
        // 登录成功初始化
        loginSuccessInit:function(){
            $(".messages").html("");
            Common.showLoading();
            Mananger.getInfo();        // 加载个人信息
            window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息

            Page.clickEventTotal();

            HomeRequest.loadMyTeam();     // 获取我的团队信息
            HomeRequest.loadTeamBrand();  //获取团队排行

            window.frames[3].postMessage('loadClubs', '*'); // 通知活动页面
            $(".right-view>img").show();
            // $(".right-view .iframe-scroll.activity").hide();
        },
        // 普通 action 按钮点击事件
        actionClickEvent:function(this_){
            // 普通 action 按钮点击事件
            if (this_.hasClass("sequence")) {
                // 顺序题
                $(".actions .option").each(function(item, i){
                    var content = $(this).html();
                    Page.options.push(content);
                })
                var msg = Page.options.join(',');
                Page.options = [];
                Page.loadClickMessage(msg, true);   //true 代表点了习题提交答案的按钮
            }
            else if (this_.hasClass("exercise")) {
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
                
                /*
                //点 ok 按钮时，判断如果带 tag，通知服务器答对还是答错了
                var item = Page.data[Page.index];
                if(item.hasOwnProperty("tag")){
                    var course = localStorage.oldCourse;
                    var courseIndex = localStorage.currentCourseIndex;
                    courseIndex = parseInt(courseIndex) + 1;
                    if(msg == item.answer){
                        Mananger.addRewardOnlyTagProblem(course, courseIndex, item.tag, "right");  //对了
                    }else{
                        Mananger.addRewardOnlyTagProblem(course, courseIndex, item.tag, "wrong");  //错了
                    }
                }
                */
            }else{
                // 普通的 action 按钮
                Page.loadClickMessage(this_.html(), false);  //false 代表普通按钮点击事件
            }
        },
        //分割线、左侧、右侧消息集
        getMsgHtml:function(item, imgI, animate, ago){
            if (item.robot === true) {
                // 机器消息
                var index = "robot";
            }
            else if (ago) {
                var index = -parseInt(Page.msgAgoIndex);
            }else{
                var index = Page.msgLaterIndex;
            }
            var msgHtml = "";
            if (item.line == true) {
                // 加载节分割线
                msgHtml = HomeUtil.loadLineHtml(item, index);
            }else{
                // 加载消息
                if (item.question === false) {
                    // 加载人为回复
                    msgHtml = HomeUtil.loadAnswerHtml(item, index);
                }else{
                    // 左侧消息
                    // 1.普通消息
                    if (item.type === "blankProblem" || item.type === "sequenceProblem" || item.type === "adaptProblem" || item.tag && item.exercises) {
                        // 习题（ 特殊的链接信息）
                        var text = "点击打开新网页";
                        var msg = ""
                        if (item.type==="blankProblem" || item.type==="sequenceProblem" || item.type==="adaptProblem" || (item.tag && item.exercises)) {
                            if (item.type === "blankProblem") {
                                text = "点击打开填空题"
                                msg = "这是一道填空题"
                            }else if (item.type === "sequenceProblem") {
                                text = "点击打开顺序题"
                                msg = "这是一道顺序题"
                            }else if (item.type === "adaptProblem" || (item.tag && item.exercises)) {
                                text = "点击打开选择题"
                                msg = "这是一道选择题"
                            }
                        }else if (item.news) {
                            text = "点击打开新闻"
                            msg = item.message
                        }else if (item.link == "www.code.com") {
                            text = "点击打开编辑器";
                            msg = item.message;
                        }else if (item.link.indexOf("www.compile.com") > -1) {
                            text = "点击打开编译器"
                            msg = item.message;
                        }else if (HomeUtil.hasVideoStr(item.link)) {
                            text = "点击播放视频"
                            msg = item.message;
                        }else if (item.link.indexOf("free.coding61.com") > -1 || item.link.indexOf("free.bcjiaoyu.com") > -1) {
                            text = "点击打开游戏页"
                            msg = item.message;
                        }else{
                            msg = item.message;
                        }
                        var itemDic = {item:item, animate:animate, msg:msg, linkText:text, msgIndex:index};
                        msgHtml = ArtTemplate("message-link-template", itemDic);
                    }
                    else if(item.tag){
                        // 1.1带 tag 的自适应题    
                        if(item.link){
                            var itemDic = {animate:animate, item:item, msgIndex:index}
                            msgHtml = ArtTemplate("message-link-problem-template", itemDic);
                        }else{                     
                            var itemDic = {animate:animate, item:item, msgIndex:index}
                            msgHtml = ArtTemplate("message-choice-problem-template", itemDic);
                        }
                    }else if (item.link) {
                        // 1.1是链接消息
                        var itemDic = {animate:animate, item:item, msg:item.message, linkText:"点击打开新网页", msgIndex:index}
                        if (HomeUtil.hasVideoStr(item.link)) {
                            itemDic["linkText"] = "点击打开视频";
                        }else if (item.news) {
                            itemDic["linkText"] = "点击打开新闻";
                        }
                        msgHtml = ArtTemplate("message-link-template", itemDic);
                    }else if (item.img) {
                        // 1.2是图片消息
                        var itemDic = {imgI:imgI, item:item, msgIndex:index}
                        msgHtml = ArtTemplate("message-img-template", itemDic);
                    }else{
                        // 1.3是文本消息
                        var itemDic = {animate:animate, item:item, msgIndex:index}
                        msgHtml = ArtTemplate("message-text-template", itemDic);
                    }
                }
            }
            return msgHtml
        },
        // 记录消息下标
        recordMsgIndex:function(item, ago, chatMsg){
            //每加载一条消息，就更新一下消息的下标，这里的作用是为了定位并复看消息流前面的习题消息。
            if (item.robot == true) {
            }else{
                if (ago === true) {
                    Page.msgDataSource.unshift(item);
                    Page.msgAgoIndex++;
                }else{
                    Page.msgDataSource.push(item);
                    Page.msgLaterIndex++;
                }
                Page.msgTotalIndex++;
            }
        },
    }
    //模板帮助方法 
    ArtTemplate.helper('TheMessage', function(message){
        try {
           var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
           return msg
        }
        catch(err){
            return message;
        }
    });
    Page.init();

});
