define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var Utils = require('common/utils.js');
    
    // ----------------------------------1.默认数据
    var Default = {
        olduser:false,
        init:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    // console.log(json);
                    Page.index = 0;
                    if(Default.olduser == true){
                        Page.data = json.default;
                    }else{
                        Page.data = json.default;
                    }

                    Default.load(Page.data, Page.index);
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        },
        load:function(arr, i){
            // 等待符号
            Util.getLoadingHtml(true, false);

            setTimeout(function(){
                // 2秒后加载信息
                // var item = array[i];
                Default.loadMessage(arr, i);
            }, Util.messageTime)
        },
        loadMessage:function(arr, i){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            var questionHtml = null;
            // 1.普通消息
            if (item.link) {
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
            
            if(item.img){
                var a = "#"+imgI;
                Util.setMessageImgHeight(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            
            
            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                $("html,body").animate({scrollTop:$("html,body")[0].scrollHeight}, 300);

                Page.clickEvent();

            }, 800)
            

            // 1.存储数据(默认数据)
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            item['question'] = true;  //当前消息是否是机器回复
            item['line'] = false;
            array.push(item)
            localStorage.chatData = JSON.stringify(array);
            
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            // 2.存储下标
            Page.index = i;
            Util.storeData();
                        
            if (item.action) {
                // 存在行为按钮, 不继续执行, 存储当前下标
                console.log(i);
                return;
            } else{
                setTimeout(function(){
                    Default.load(arr, i+1);
                }, Util.waitTime)
            }
        }
    }
    // --------------------------------2.缓存数据
    var ChatStroage = {
        numbers:0,    //已加载数据的个数
        length:50,   //默认一组加载多少个
        timer:null,
        timerAgo:null,  
        loadMore:true,  //上拉的时候判断是否可以继续上拉加载
        init:function(){
            // 加载缓存数据， 并展示出来
            var array = JSON.parse(localStorage.chatData)
            
            // 加载存储数据中所有的数据（最新10个数据）
            var arr1 = [];
            for (var i = array.length - 1; i > array.length-1-ChatStroage.length; i--) {
                if (array[i]){
                    arr1.push(array[i]);
                }
            }
            arr1 = arr1.reverse();
            ChatStroage.load(arr1, 0, arr1.length)
        },
        loadLineHtml:function(item){
            var lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">'+item.message+'</span>\
                            </div>';
            return lineHtml;
        },
        loadAnswerHtml:function(item){
            var answerHtml = '<div class="answer"> \
                                <div class="msg-view">\
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                </div>\
                                <img class="avatar" src="'+localStorage.avatar+'"/>\
                              </div>';
            return answerHtml;
        },
        load:function(arr, i, arrLen){
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
                //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                ChatStroage.loadLastItem(arr, arrLen);
                return;
            }
                
            // 等待符号
            Util.getLoadingHtml(false, false);
            
            var answerHtml = null;
            var questionHtml = null;
            var lineHtml = null;

            if (item.line == true) {
                // 加载节分割线
                lineHtml = ChatStroage.loadLineHtml(item);
            }else{
                // 加载消息
                if (!item.question) {
                    // 加载人为回复
                    answerHtml = ChatStroage.loadAnswerHtml(item);
                }else{
                    // 左侧消息
                    // 1.普通消息
                    if (item.link) {
                        // 1.1是链接消息
                        var itemDic = {animate:false, item:item, linkText:"点击打开新网页"}
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
                        var itemDic = {animate:false, item:item}
                        questionHtml = ArtTemplate("message-text-template", itemDic);
                    }
                }
            }

            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
            $(answerHtml).appendTo(".messages");
            $(lineHtml).appendTo(".messages");
            
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数
            
            if(item.img){
                // $('.lazy-img').imageloader();  //打开图片
                Util.setMessageImgHeight(item);  //给图片消息中图片设高
                var a = "#"+imgI;
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }


            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 20);

            ChatStroage.load(arr, i+1, arrLen);

        },
        loadLastItem:function(array, arrLen){

            // 取出上次的数据源，接着执行
            Page.data = JSON.parse(localStorage.data);
            Page.index = parseInt(localStorage.index);
            Page.optionData = JSON.parse(localStorage.optionData);
            Page.optionIndex = parseInt(localStorage.optionIndex);
            Page.pagenum = parseInt(localStorage.pagenum);
            
            // 判断存储的最后一个元素是否有 action
            var item1 = array[arrLen-1]
            var actionHtml = "";
            if (item1.news) {
                // 最后一条是新闻,找到前一条是 action 的
                var array1 = array;
                for (var i = 0; i < array1.length; i++) {
                    if(array1[i].action){
                        item1 = array1[i];
                        actionHtml=Util.getActionHtml(item1);
                    }
                }
            }else if (item1.action) {
                actionHtml=Util.getActionHtml(item1);
            }else{
                
                //当前存储元素加载完，之后，取数据源元素
                // 不含 action，取当前数据源中下一条数据,知道遇到 含action的为止
                if (Page.optionData == null || Page.optionData.length == Page.optionIndex + 1) {
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
            
            ChatStroage.loadFirstItem();

            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            setTimeout(function(){
                // console.log(333);
                $(".btns .actions").html(actionHtml);
                Page.clickEvent();    
            }, 800)
             
            
        },
        loadFirstItem:function(){
            $(".loadAgoMore").remove();
            // 添加一个点击加载更多
            var loadAgoMoreHtml = "";
            var chatData = JSON.parse(localStorage.chatData);
            if (ChatStroage.numbers<chatData.length){
                loadAgoMoreHtml = '<div class="loadAgoMore">点击加载更多</div>';
            }else{
                loadAgoMoreHtml = '<div class="loadAgoNoMore">已经到头了</div>';
            }
            $(loadAgoMoreHtml).prependTo(".messages");
            

            $(".loadAgoMore").unbind('click').click(function(){
                // $(".loadAgoMore").remove();
                // 判断存储数据是否已全部加载完
                var chatData = JSON.parse(localStorage.chatData);
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
                        Util.getLoadingHtml(false, true);
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
            
            var answerHtml = null;
            var questionHtml = null;
            var lineHtml = null;

            if (item.line == true) {
                // 加载节分割线
                lineHtml = ChatStroage.loadLineHtml(item);
            }else{
                // 加载消息
                if (!item.question) {
                    // 加载人为回复
                    answerHtml = ChatStroage.loadAnswerHtml(item);
                }else{
                    // 左侧消息
                    // 1.普通消息
                    if (item.link) {
                        // 1.1是链接消息
                        var itemDic = {animate:false, item:item, linkText:"点击打开新网页"}
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
                        var itemDic = {animate:false, item:item}
                        questionHtml = ArtTemplate("message-text-template", itemDic);
                    }
                }
            }

            $(".loading-chat").remove();
            $(questionHtml).prependTo($(".messages"));
            $(answerHtml).prependTo($(".messages"));
            $(lineHtml).prependTo($(".messages"));
            
            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数
            
            if(item.img){
                var a = "#"+imgI;
                Util.setMessageImgHeightLoadAgo(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            

            ChatStroage.timerAgo = setTimeout(function(){
                // 加载上一条数据
                // 等待符号
                Util.getLoadingHtml(false, true);

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
            Util.getLoadingHtml(true, false);      //等待符号
            var lastNewsId = localStorage.lastNewsId?localStorage.lastNewsId:0;
            Mananger.loadNews(lastNewsId, false);  //请求新闻数据
        },
        loadMessage:function(arr, i){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            var questionHtml = null;
            // 1.普通消息
            if (item.link) {
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
            
            if(item.img){
                var a = "#"+imgI;
                Util.setMessageImgHeight(item);  //给图片消息中图片设高
                Common.showLoadingPreImg1(a);   //打开预加载图片
            }
            
            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                $("html,body").animate({scrollTop:$("html,body")[0].scrollHeight}, 300);

                Page.clickEvent();

            }, 800)
            
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 1.存储数据(默认数据)
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            item['question'] = true;  //当前消息是否是机器回复
            item['line'] = false;
            array.push(item)
            localStorage.chatData = JSON.stringify(array);

            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数
            
            if (item.news) {
                News.newsIndex = i;                 //记录新闻下标
                localStorage.lastNewsId = item.pk;  //存储新闻的阅读下标
            }else{
                // 存储下标
                Page.index = i;
                Util.storeData();
            }
                        
            if (item.action || item.hasAction) {
                // 存在行为按钮, 不继续执行, 存储当前下标
                // Page.index = i;
                // Util.storeData();
                // console.log(Page.index);
                console.log(i);
                return;
            } else{
                setTimeout(function(){
                    // 加载下一条数据
                    Util.getLoadingHtml(true, false);  //等待符号

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
                Util.getLoadingHtml(true, false);  //等待符号
                setTimeout(function(){
                    // 2秒后加载信息
                    News.loadMessage(News.newsData, News.newsIndex);
                }, Util.messageTime)
            }else{
                $(".actions").html(null);
                Util.getLoadingHtml(true, false);  //等待符号
                var lastNewsId = localStorage.lastNewsId?localStorage.lastNewsId:0;
                Mananger.loadNews(lastNewsId, true);  //请求新闻数据
            }
        } 
    }
    // ---------------------------3.正常请求数据
    var Page = {
        index:0,     //接受实时数据的下标
        data:null,   //接受实时数据，

        chatData:null,  //存储会话内容
        pagenum:1,    //请求数据分页
        options:[],  //记录选项
        
        optionData:null,    //记录用户当前选了答案之后的数组会话
        optionIndex:0,   //记录用户当前选了答案之后的数组会话下标
        init:function(){
            // alert(navigator.userAgent);
            // 判断浏览器内核
            // 当前浏览器
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
                    Util.courseProgressUI();   //更新课程进度

                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                    if(localStorage.currentCourse == localStorage.oldCourse){
                        // 回到原来的课程继续
                        var actionHtml = "";
                        var item = Page.data[Page.index];
                        actionHtml = Util.getActionHtml(item);
                        $(".btns .actions").html(actionHtml);
                    }else{
                        // 改变 action 的状态(开始学习)
                        $(".actions").html('<span class="btn-wx-auth begin bottom-animation">开始学习</span>');
                    }
                    Page.clickEvent();    //重新激活 action 点击事件
                }else if(a == "resetcurrentCourse"){
                    // 学完重学的时候
                    Util.courseProgressUI();   //更新课程进度
                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                    $(".actions").html('<span class="btn-wx-auth restart bottom-animation">重新学习</span>');
                    Page.clickEvent();    //重新激活 action 点击事件
                }else if(a == "loadCourses"){

                }else if(a == "closeCodeEdit"){
                    $(".right-view .iframe-scroll").hide();
                    $(".right-view>img").show();
                }else{
                    // 打开运行结果窗口，并赋值
                    $(".code-result-shadow-view iframe").attr({src:a});
                    $(".code-result-shadow-view").show();
                }
            }, false); 
            
        },
        load:function(){

            // 判断用户是否登录
            if(localStorage.token){
                
                Common.showLoading();
                Mananger.getInfo();        // 加载个人信息
                Mananger.loadMyTeam();     // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行

                Page.clickEventTotal();
            }else{
                // 弹出登录窗口
                // 打开登录窗口
                $(".phone-invite-shadow-view").show();
                // $(".login-shadow-view").show();
                Page.clickEvent();
            }

            Mananger.getCountryCode();   //初始化国家代码
            Common.addCopyRight();   //添加版权标识
        },
        loadMessage:function(arr, i, opt){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            var questionHtml = null;
            // 1.普通消息
            if (item.link) {
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
            
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 2.存储数据(当前消息是否是机器消息)
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            item['question'] = true;   //当前消息是否是机器消息
            item['line'] = false;
            array.push(item)
            localStorage.chatData = JSON.stringify(array);

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
            
            if (item.action || item.hasAction) {
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
                
                if ($(this).hasClass("wx-auth")) {
                    //1. 打开选择课程窗口
                    Util.openRightIframe("courseList");
                    
                }else if($(this).hasClass("catalogBegin")){
                    //2. 普通 action 按钮点击事件
                    Util.actionClickEvent($(this));
                }else if($(this).hasClass("begin")){
                    //3. 开始学习，更换课程时，或者初次学习之旅时
                    // 课节目录重置为当前选中课程的进度
                    Util.currentCatalogIndex = localStorage.currentCourseIndex;
                    // 普通 action 按钮点击事件
                    Util.actionClickEvent($(this));
                }else if($(this).hasClass("restart")){
                    //4. 课节目录重置为0
                    Util.currentCatalogIndex = localStorage.currentCourseIndex;
                    // 课程完成，重新开始，课程未完成，重新开始
                    Page.loadClickMessageCourse($(this).html());
                }else if($(this).hasClass("notNews")){
                    // 5.点了新闻暂时不看
                    News.clickNotLook();
                }else if($(this).hasClass("nextNews")){
                    // 6.点了新闻下一条
                    News.clickNextNews();
                }else{
                    // 7.普通按钮
                    // 当前课程的打卡及奖励
                    // 点击按钮，判断是打卡还是奖励钻石，及经验值
                    var item = null;
                    if(Page.optionData){
                        // 问题下的按钮
                        item = Page.optionData[Page.optionIndex];
                    }else{
                        // 消息下的按钮
                        item = Page.data[Page.index];
                    }

                    if(item.record == true){
                        // 打卡
                        var course = localStorage.oldCourse;
                        var courseIndex = localStorage.currentCourseIndex;
                        courseIndex = parseInt(courseIndex) + 1;
                        
                        //判断是否是已经打过最后一节课
                        if(courseIndex > localStorage.currentCourseTotal){
                            //不打卡
                            $(".btn-wx-auth").attr({disabledImg:false});
                            Common.dialog("本课程已结束，选择其它课程，再继续");
                            $(".loading-chat").remove();
                        }else{
                            Mananger.updateExtent(course, courseIndex, $(this));   //更新学习进度
                        }

                    }else{
                        if(item.zuan_number || item.grow_number){
                            // 奖励钻石，经验
                            var course = localStorage.oldCourse;
                            var courseIndex = localStorage.currentCourseIndex;
                            courseIndex = parseInt(courseIndex) + 1;
                            
                            Mananger.addReward(course, courseIndex, item.chapter, item.grow_number, item. zuan_number, $(this));  //奖励钻石
                        }else{
                            // 普通 action 按钮点击事件
                            Util.actionClickEvent($(this));
                        }
                    }
                }
                
                
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
            
            // 消息链接点击
            $(".message.link").unbind('click').click(function(){
                var linkType = $(this).attr("data-link-type");
                var link = $(this).attr("data-link");
                if (link == "www.code.com") {
                    Util.openRightIframe("codeEdit");   //打开编辑器

                }else if (link.indexOf("www.compile.com") > -1){
                    var language = link.split("/")[1]
                    // language = "python";
                    window.frames["codeCompile"].postMessage(language, '*'); // 传递值，告知要获取课程信息
                    Util.openRightIframe("codeCompile"); //打开编译器
                }else{
                    // window.open(link);
                    // 打开消息链接窗口
                    // $(".message-link-shadow-view .message-link #message-link-iframe").attr({src:"http://develop.cxy61.com:8001/s/course1/game7/2.html"});
                    // $(".message-link-shadow-view").show();
                    if (linkType) {
                        //进行编辑器的选择
                        Util.link = link;
                        Util.linkType = linkType;
                        $(".compile-shadow-view").show();
                    }else{
                        var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                        params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                        console.log(params);
                        window.open(link, '_blank', params);
                    }
                }
            })
            // 消息文本点击
            $(".message.text").unbind('click').click(function(){
                // $(".right-view iframe").hide();
                // $(".right-view iframe").attr({src:""});
                // $(".right-view>img").show();
            })
            // 消息图片点击
            $(".message.img").unbind('click').click(function(){
                var url = $(this).find('img.msg').attr('src');
                $(".imgmsg img").attr({src:url});
                $(".imgmsg-shadow-view").show();
            })
            // 消息图片大图的点击
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
            // 更换课程
            $(".helps-view .change-course").unbind('click').click(function(){
                $(".helps-view").hide();
                Util.openRightIframe("courseList");   //打开选择课程
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

            // 关闭运行代码结果窗口
            $(".code-result .close img").unbind('click').click(function(){
                $(".code-result-shadow-view").hide();
            })

            // 关闭消息链接窗口
            $(".message-link-shadow-view .message-link .close img").unbind('click').click(function(){
                $(".message-link-shadow-view").hide();
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
            
            // compile-shadow-view 隐藏
            $(".compile-shadow-view").unbind('click').click(function(){
                $(".compile-shadow-view").hide();
            })
            // reply 编译器
            $(".compile-view .repl").unbind('click').click(function(){
                var link = Util.link;
                var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                console.log(params);
                window.open(link, '_blank', params);

                Util.link = "";
                Util.linkType = "";
                $(".compile-shadow-view").hide();
            })

            // 程序媛编译器
            $(".compile-view .edit").unbind('click').click(function(){
                var type = Util.linkType.split("www.compile.com/")[1];
                if (location.host == "develop.cxy61.com:8001") {
                    var url = "http://"+location.host+"/app/home/codeCompileRN.html?lang="
                }else{
                    var url = "https://"+location.host+"/girl/app/home/codeCompileRN.html?lang="
                }
                url = url + type;
                
                var link = url;
                var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                console.log(params);
                window.open(link, '_blank', params);

                Util.link = "";
                Util.linkType = "";
                $(".compile-shadow-view").hide();
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                window.open("../../cxyteam_forum/bbs.html");
            })
            // 作品中心
            $(".header .works").unbind('click').click(function(){
                window.open("worksList.html");
            })
            // 手机 app
            $(".header .mobile-app").unbind('mouseover').mouseover(function(){
                Util.adjustQrCode();
            }).unbind('mouseout').mouseout(function(){
                $(".qr-code-view").css({display:'none'});
            })
            // 在线编辑器
            $(".header .code-online").unbind('click').click(function(){
                Util.adjustCodeEditorsOnline();
            })
            // 创作课程
            $(".header .edit-course").unbind('click').click(function(){
                window.open("editCourse.html");
            })
            // 编辑器点击事件
            $(".editors .editor").unbind('click').click(function(){
                var url = ""
                if (location.host == "develop.cxy61.com:8001") {
                    url = "http://"+location.host + "/app"
                }else{
                    url = "https://"+location.host + "/girl/app"
                }
                if ($(this).hasClass("html")) {
                    url = url + "/home/codeEditRN.html"
                }else if ($(this).hasClass("c")) {
                    url = url + "/home/compileRN.html?lang=c"
                }else if ($(this).hasClass("python")) {
                    url = url + "/home/compileRN.html?lang=python"
                }else if ($(this).hasClass("java")) {
                    url = url + "/home/compileRN.html?lang=java"
                }
                Util.openLink(url)
                $(".code-online-editors").css({display:'none'})
            })
            

            Page.clickEventLoginRelated();
            
        },
        clickEventLoginRelated:function(){
            // ------------------------------------------- I:以前的登录（废弃）
            /*
            // 关闭登录窗口
            $(".login-view .close img").unbind('click').click(function(){
                $(".login-shadow-view").hide();
            })

            // 登录按钮
            $(".login-view .login").unbind('click').click(function(){
                // 登录成功，请求数据
                Mananger.login();
            })
            */
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
                Mananger.getPhoneCode($(".phone-bind-view"));
            })
            // 手机绑定
            $(".phone-bind-view .bind-btn").unbind('click').click(function(){
                Mananger.lockPhone($(".phone-bind-view"));
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
                    
                }else if ($(this).hasClass("invite")) {
                    $(".invite-account-view").css({display:"flex"})
                    $(".phone-account-view").css({display:"none"})
                }
            })
            
            $(".phone-account-view .login-btn").unbind('click').click(function(){
                // 手机号登录
                Mananger.goLogin($(".phone-account-view"));
            })
            $(".invite-account-view .login-btn").unbind('click').click(function(){
                // 邀请码登录
                Mananger.goLogin($(".invite-account-view"));
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
                Mananger.getPhoneCode($(".phone-reg-view"));
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

                Mananger.phone = this_.find(".phone").children("input").val();
                Mananger.code = this_.find(".verify-code").children("input").val();
                Mananger.password = this_.find(".password").children("input").val();


                // Mananger.regPhone($(".phone-reg-view"));
                // 打开头像窗口
                $(".choose-avatar-shadow-view").show();
                $(".phone-reg-shadow-view").hide();

                var width = $(window).width();
                $(".ui-choose-avatar-view").css({
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
                Mananger.chooseAvatar = $(".choose-avatar-view .choose-avatar img").attr("src");
            })
            $(".choose-avatar-view .reg-btn").unbind('click').click(function(){
                // 注册 btn
                var nickname = $(".choose-avatar-view .nickname input").val();
                if (nickname == "") {
                    Common.dialog("请输入昵称");
                    return
                }
                Mananger.regPhone(Mananger.phone, Mananger.code, Mananger.password, Mananger.chooseAvatar, nickname);
            })


            // -----------------------------4.找回密码
            $(".find-password-view .close img").unbind('click').click(function(){
                $(".find-password-shadow-view").hide();
            })
            $(".find-password-view .get-code").unbind('click').click(function(){
                // 获取手机验证码
                Mananger.getPhoneCode($(".find-password-view"));
            })
            $(".find-password-view .reset-psd-btn").unbind('click').click(function(){
                // 重置密码 btn
                Mananger.resetPassword($(".find-password-view"));
            })

            // ----------------------------5.国家电话代码
            // 国家代码
            $(".code-country").unbind('click').click(function(){

                $(".country-options").toggle();
            })
            // 默认是+86
            $(".country-option").unbind('click').click(function(){
                var code = $(this).attr("data-code");
                Util.currentCountryCode = code;
                $(".country-option.select").removeClass("select");
                $(this).addClass("select");
                $(".code-country span").html(code);

                $(".country-options").hide();
            })
        
        },
        loadMessageWithData:function(actionText, arr, i, opt){
            if (actionText != "") {
                // 去掉加载存储数据是节数据后没有 action，
                // 存储人工提问
                // 3.存储数据(人工回复)
                var array = [];
                if (localStorage.chatData) {
                    array = JSON.parse(localStorage.chatData);
                }
                var item = {
                    message:actionText
                }
                item['question'] = false;  //当前消息是否是机器消息
                item['line'] = false;
                array.push(item)
                localStorage.chatData = JSON.stringify(array);

                ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数
                
                $(".actions").html(null);
            }

            setTimeout(function(){
                Page.loadMessage(arr, i, opt);
            }, Util.messageTime)
        },
        loadClickMessage:function(actionText, exercise){
            if (localStorage.currentCourseIndex) {
                if(localStorage.oldCourse != localStorage.currentCourse || localStorage.currentCourseIndex != Util.currentCatalogIndex){
                    //更换课程数据,  更换课节数据
                    Page.loadClickMessageCourse(actionText);
                    return;
                }
            }
           
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
                    Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);   //true 用来区分，普通消息还是问题下的消息
                    
                }else{
                    Page.optionData = item.correct;
                    Page.optionIndex = 0;
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
        loadClickMessageCourse:function(actionText){
            // 更换课程
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
            
            Page.requestCourseData(actionText, true);  //true 代表课程更换了

        },
        requestCourseData:function(actionText, flag){
            // 请求课程数据
            if(localStorage.currentCourse){
                if (localStorage.oldCourse != localStorage.currentCourse) {
                    // 切换课程学习
                    localStorage.oldCourse = localStorage.currentCourse;
                    Page.requestCategoryCourse(actionText, flag);
                }else{
                    // 当前学习的课程跟用户选的课程一样，继续下一节的课程
                    Page.requestCategoryCourse(actionText, flag);
                }
            }else{
                // 还从未有过选课
                Common.dialog("请选择一个课程");
                $(".loading-chat").remove();
            }    
        },
        requestCategoryCourse:function(actionText, flag){
            if (localStorage.currentCourseIndex != Util.currentCatalogIndex) {
                // 点击目录更换课节数据
                Mananger.getCourseInfoWithPk(actionText, localStorage.oldCourse, true);
            }else{
                Mananger.getCourseInfoWithPk(actionText, localStorage.oldCourse, false);
            }
        },
        loadSepLine:function(number){
            $(".loading-chat").remove();

            // 加载节分割线
            var lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">第'+Utils.numberToChinese(number)+'节</span>\
                            </div>';
            $(lineHtml).appendTo(".messages");

            // 4.存储数据(节数据)
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            var msg = "第" + Utils.numberToChinese(number) + "节";
            var item = {
                message:msg
            }
            item['question'] = false;
            item['line'] = true;   //当前消息是否是分割线
            array.push(item)
            localStorage.chatData = JSON.stringify(array);

            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数
            
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
                        // $(".login-shadow-view").hide();
                        
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
        getPhoneCode:function(this_){
            // var reg = /^[0-9]$/;
            var phone = this_.find(".phone").children("input").val();
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURI(phone)
            }
            
            var url = "";
            if (this_.find(".view-tag").html() == "注册") {
                url = "/userinfo/telephone_signup_request/"
            }else if (this_.find(".view-tag").html() == "绑定手机") {
                url = "/userinfo/bind_telephone_request/"
            }else if (this_.find(".view-tag").html() == "找回密码") {
                url = "/userinfo/reset_password_request/";
            }

            if (this_.find(".get-code").html() == "获取验证码") {
                // 发起获取验证码请求
                Common.isLogin(function(token){
                    $.ajax({
                        type:"get",
                        url:Common.domain + url,
                        data:{
                            telephone:phone
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
        regPhone1:function(this_){
            // 注册手机
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (phone== "") {
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
                    url:Common.domain + "/userinfo/telephone_signup/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode,
                        name:"",
                        avatar:""
                    },
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            Common.dialog("注册成功");
                            this_.parent().hide();
                        }
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
        regPhone:function(phone, code, password, url, nickname){
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURIComponent(phone)
            }

            Common.showLoading();
            // 注册手机
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/telephone_signup/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:code,
                        name:nickname,
                        avatar:url
                    },
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            // Common.dialog("注册成功");

                            $(".choose-avatar-shadow-view").hide();

                            localStorage.token = json.token;

                            Mananger.getInfo();

                            window.frames[1].postMessage('loadCourses', '*'); // 传递值，告知要获取课程信息

                            Mananger.loadMyTeam();  // 获取我的团队信息
                            Mananger.loadTeamBrand();  //获取团队排行
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
                // phone = encodeURIComponent(phone)
            }
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/reset_password/",
                    data:{
                        telephone:phone,
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
            if (this_.attr("data-tag") == "invite") {
                url = "/userinfo/invitation_code_login/"
                data = {
                    code:username,
                    password:password
                }
            }else if (this_.attr("data-tag") == "phone") {

                if (Util.currentCountryCode != "+86") {
                    username = Util.currentCountryCode + username
                    // username = encodeURIComponent(username)
                }

                url = "/userinfo/telephone_login/"
                data = {
                    telephone:username,
                    password:password
                }

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
                                        var actionHtml = Util.getActionHtml(array[array.length-1]);
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
                    var optionHtml = null;
                    for (var j = 0; j < item.action.length; j++) {
                        var option = item.action[j];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth">ok</span>';

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

    Page.init();

});
