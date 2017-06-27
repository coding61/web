define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var Utils = require('common/utils.js');
    
    // ----------------------------------1.默认数据
    var Default = {
        init:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    console.log(json);
                    Page.index = 0;
                    Page.data = json.default;

                    Default.load(Page.data, Page.index);
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        },
        load:function(arr, i){
            // 加载默认数据
            // 等待符号
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat left-animation">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';
            $(".messages").append(loadingWHtml);

            setTimeout(function(){
                // 2秒后加载信息
                // var item = array[i];
                Default.loadMessage(arr, i);
            }, 2000)
        },
        loadMessage:function(arr, i){
            var item = arr[i];
            var questionHtml = null;
            if (item.link) {
                // 带链接的
                questionHtml = '<div class="message link left-animation"> \
                                    <div class="link-text"> \
                                        <span class="link-content">'+Util.formatString(item.message)+'<br/></span>\
                                        <span style="color: rgb(84, 180,225);">'+item.link+'</span>\
                                    </div>\
                                    <img class="arrow" src="../../statics/images/arrow.png" alt="">\
                                </div>';
            }else if(item.img){
                // 图片
                questionHtml = '<div class="message img">\
                                    <img src="'+item.img+'" alt="">\
                                </div>';
            }else{
                // 文本
                questionHtml = '<div class="message text left-animation"> \
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                </div>';
            }


            var actionHtml = null;
            if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = null;
                    for (var i = 0; i < item.action.length; i++) {
                        var option = item.action[i];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth">ok</span>';

                } else{
                    // 单按钮
                    if (item.action == "点击微信登录") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }
                }
            }
            
            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
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
            

            // 存储下标
            Page.index = i;
            Util.storeData();
                        
            if (item.action) {
                // 存在行为按钮, 不继续执行, 存储当前下标
                // Page.index = i;
                // Util.storeData();
                // console.log(Page.index);
                console.log(i);
            } else{
                setTimeout(function(){
                    Default.load(arr, i+1);
                }, 1000)
            }
        }
    }
    // --------------------------------2.缓存数据
    var ChatStroage = {
        numbers:0,    //已加载数据的个数
        length:50,   //默认一组加载多少个
        timerAgo:null,  
        init:function(){
            // 加载缓存数据， 并展示出来
            var array = JSON.parse(localStorage.chatData)
            
            /*
            // 一次取5条记录
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                ChatStroage.load(array, i, array.length);
            }
            
            // 判断存储的最后一个元素是否有 action
            var item1 = array[array.length-1]
            var actionHtml = "";
            if (item1.action) {
                if (item1.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var i = 0; i < item1.action.length; i++) {
                        var option = item1.action[i];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                } else{
                    // 单按钮
                    if (item1.action == "点击微信登录") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+item1.action+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+item1.action+'</span>'
                    }
                }
            }else{
                // 不含 action，取当前数据源中下一条数据

            }

            setTimeout(function(){
                $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

                $(".btns .actions").html(actionHtml);

                // 取出上次的数据源，接着执行
                Page.data = JSON.parse(localStorage.data);
                Page.index = parseInt(localStorage.index);
                Page.optionData = JSON.parse(localStorage.optionData);
                Page.optionIndex = parseInt(localStorage.optionIndex);
                Page.pagenum = parseInt(localStorage.pagenum);
                
                Page.clickEvent();
            }, 800)   
            */         


            // 加载存储数据中所有的数据（最新10个数据）
            var arr1 = [];
            for (var i = array.length - 1; i > array.length-1-ChatStroage.length; i--) {
                if (array[i]){
                    arr1.push(array[i]);
                }
            }
            arr1 = arr1.reverse();
            ChatStroage.load(arr1, 0, arr1.length)

            ChatStroage.initScroll(array, i, array.length);


            // ChatStroage.load(array, 0, array.length);   //加载全部


        },
        load:function(arr, i, arrLen){
            var item = arr[i];
            if (i >= arrLen) {
                //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                ChatStroage.loadLastItem(arr, arrLen);
                return;
            }
                
            // 等待符号
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';
            $(loadingWHtml).appendTo(".messages");
            
            var answerHtml = null;
            var questionHtml = null;
            var lineHtml = null;

            if (item.line == true) {
                // 加载节分割线
                lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">'+item.message+'</span>\
                            </div>';
            }else{
                // 加载消息
                if (!item.question) {
                    // 加载人为回复
                    answerHtml = '<div class="answer"> \
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                  </div>';
                }else{
                    // 加载机器回复
                    if (item.link) {
                        // 带链接的
                        questionHtml = '<div class="message link"> \
                                            <div class="link-text"> \
                                                <span class="link-content">'+Util.formatString(item.message)+'<br/></span>\
                                                <span style="color: rgb(84, 180,225);">'+item.link+'</span>\
                                            </div>\
                                            <img class="arrow" src="../../statics/images/arrow.png" alt="">\
                                        </div>';
                    }else if(item.img){
                        // 图片
                        questionHtml = '<div class="message img">\
                                            <img src="'+item.img+'" alt="">\
                                        </div>';
                    }else{
                        // 文本
                        questionHtml = '<div class="message text"> \
                                            <span class="content">'+Util.formatString(item.message)+'</span> \
                                        </div>';
                    }
                }
            }

            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
            $(answerHtml).appendTo(".messages");
            $(lineHtml).appendTo(".messages");

            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 800);
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

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
            if (item1.action) {
                if (item1.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var i = 0; i < item1.action.length; i++) {
                        var option = item1.action[i];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                } else{
                    // 单按钮
                    if (item1.action == "点击微信登录") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+Util.formatString(item1.action)+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item1.action)+'</span>'
                    }
                }
            }else{
                
                //当前存储元素加载完，之后，取数据源元素
                // 不含 action，取当前数据源中下一条数据,知道遇到 含action的为止
                if (Page.optionData == null || Page.optionData.length == Page.optionIndex + 1) {
                    //判断原始数据源
                    if (Page.data.length == Page.index + 1) {
                        // 已有数据源执行完，请求新的

                        // 请求当前课程的下一节课程
                        Page.requestCourseData("");
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
            $(".btns .actions").html(actionHtml);
            
            Page.clickEvent();     
            
        },
        initScroll:function(array, i, arrLen){
            
            $('.messages').on('scroll',function(){
                // div 滚动了
                var top = $(".messages").scrollTop();  
                var win = $(".messages")[0].scrollHeight;  
                var doc = $(".messages").height();  
                
                if (top == 0) {
                    //用户向上滚动查看以前的聊天信息
                    // console.log("top--->"+top);
                    // console.log("sh--->"+win);
                    // console.log("h--->"+doc);

                    //判断存储数据是否已全部加载完
                    var chatData = JSON.parse(localStorage.chatData)
                    if (ChatStroage.numbers<chatData.length){
                        // ChatStroage.numbers = parseInt(ChatStroage.numbers) + ChatStroage.length;

                        //存储数据源还没有加载完, 继续加载(靠后的10条数据)。 判断已加载数据个数与存储个数是否相同
                        var arr1 = [];
                        var originIndex = chatData.length-1-ChatStroage.numbers,
                            lastIndex = chatData.length-1-ChatStroage.numbers-ChatStroage.length;
                        for (var i = originIndex; i > lastIndex; i--) {
                            if (chatData[i]) {
                                arr1.push(chatData[i]);
                            }
                        } 

                        // 等待符号,加载上一组记录
                        var loadingWHtml = null;
                        loadingWHtml = '<div class="loading-chat">\
                                            <img src="../../statics/images/chat.gif" alt="">\
                                        </div>';
                        $(loadingWHtml).prependTo($(".messages"));

                        ChatStroage.loadAgo(arr1, 0, arr1.length);
                    }

                }else{
                    // console.log("top1--->"+top);
                    // console.log("sh1--->"+win);
                    // console.log("h1--->"+doc);
                    Page.clickEvent(); 
                    clearTimeout(ChatStroage.timerAgo);
                }
            });
        },
        loadAgo:function(arr, i, arrLen){
            var item = arr[i];
            if (i >= arrLen) {
                //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
                $(".loading-chat").remove();
                Page.clickEvent(); 
                return;
            }
            
            var answerHtml = null;
            var questionHtml = null;
            var lineHtml = null;

            if (item.line == true) {
                // 加载节分割线
                lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">'+item.message+'</span>\
                            </div>';
            }else{
                // 加载消息
                if (!item.question) {
                    // 加载人为回复
                    answerHtml = '<div class="answer"> \
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                  </div>';
                }else{
                    // 加载机器回复
                    if (item.link) {
                        // 带链接的
                        questionHtml = '<div class="message link"> \
                                            <div class="link-text"> \
                                                <span class="link-content">'+Util.formatString(item.message)+'<br/></span>\
                                                <span style="color: rgb(84, 180,225);">'+item.link+'</span>\
                                            </div>\
                                            <img class="arrow" src="../../statics/images/arrow.png" alt="">\
                                        </div>';
                    }else if(item.img){
                        // 图片
                        questionHtml = '<div class="message img">\
                                            <img src="'+item.img+'" alt="">\
                                        </div>';
                    }else{
                        // 文本
                        questionHtml = '<div class="message text"> \
                                            <span class="content">'+Util.formatString(item.message)+'</span> \
                                        </div>';
                    }
                }
            }

            $(".loading-chat").remove();
            $(questionHtml).prependTo($(".messages"));
            $(answerHtml).prependTo($(".messages"));
            $(lineHtml).prependTo($(".messages"));

            ChatStroage.numbers = parseInt(ChatStroage.numbers) + 1;  //计算已加载的数据个数

            ChatStroage.timerAgo = setTimeout(function(){
                // 加载上一条数据
                // 等待符号
                var loadingWHtml = null;
                loadingWHtml = '<div class="loading-chat">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
                $(loadingWHtml).prependTo($(".messages"));

                setTimeout(function(){
                    // 2秒后加载信息
                    ChatStroage.loadAgo(arr, i+1, arrLen);
                }, 2000)
            }, 1000)
            
            // ChatStroage.loadAgo(arr, i+1, arrLen);
        },
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
            Page.load();
        },
        load:function(){
            // 判断本地是否有缓存, 有就把缓存加载出来，否则加载默认
            if (localStorage.chatData) {
                ChatStroage.init();
            }else{
                Default.init();
            }
        },
        loadMessage:function(arr, i, opt){
            var item = arr[i];
            var questionHtml = null;
            if (item.link) {
                // 带链接的
                questionHtml = '<div class="message link left-animation"> \
                                    <div class="link-text"> \
                                        <span class="link-content">'+Util.formatString(item.message)+'<br/></span>\
                                        <span style="color: rgb(84, 180,225);">'+item.link+'</span>\
                                    </div>\
                                    <img class="arrow" src="../../statics/images/arrow.png" alt="">\
                                </div>';
            }else if(item.img){
                // 图片
                questionHtml = '<div class="message img">\
                                    <img src="'+item.img+'" alt="">\
                                </div>';
            }else{
                // 文本
                questionHtml = '<div class="message text left-animation"> \
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                </div>';
            }


            var actionHtml = "";
            if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var i = 0; i < item.action.length; i++) {
                        var option = item.action[i];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                } else{
                    // 单按钮
                    actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                }
            }
            
            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
            
            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                Page.clickEvent();
            }, 800)
            
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

            // 存储下标
            if (opt == true) {
                // 问题下的消息, 记录问题下消息的下标
                Page.optionIndex = i;
            }else{
                // 普通消息
                Page.index = i;
            }
            Util.storeData();
                        
            if (item.action) {
                // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
                // // 存在行为按钮, 不继续执行
                // if (opt == true) {
                //     // 问题下的消息, 记录问题下消息的下标
                //     Page.optionIndex = i;
                // }else{
                //     // 普通消息
                //     Page.index = i;
                // }
                // Util.storeData();
                console.log(i);
            } else{
                setTimeout(function(){
                    // 加载下一条数据
                    // 等待符号
                    var loadingWHtml = null;
                    loadingWHtml = '<div class="loading-chat left-animation">\
                                        <img src="../../statics/images/chat.gif" alt="">\
                                    </div>';
                    $(loadingWHtml).appendTo(".messages");
                    $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

                    setTimeout(function(){
                        // 2秒后加载信息
                        Page.loadMessage(arr, i+1, opt);
                    }, 2000)
                }, 1000)
            }
        },
        clickEvent:function(){
            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            $(".btn-wx-auth").click(function(){
                // if ($(this).hasClass("wx-auth")) {
                //     // 微信授权登录
                //     var redirectUri = "https://www.cxy61.com/cxyteam/app/home/home.html";
                //     Common.authWXSiteLogin(redirectUri);
                    
                //     // $(".wx-code").show();
                //     // $(".wx-code iframe").attr({src:Common.authWXSiteLogin(redirectUri)});
                // }else{
                    // 普通 action 按钮点击事件
                    if ($(this).hasClass("exercise")) {
                        // 点了习题的，提交答案的按钮
                        Page.loadClickMessage(Page.options.join(','), true);   //true 代表点了习题提交答案的按钮
                    }else{
                        // 普通的 action 按钮
                        Page.loadClickMessage($(this).html(), false);  //false 代表普通按钮点击事件 
                    }
                // }
            })
            
            $(".option").click(function(){
                // 选项点击
                if ($(this).hasClass("unselect")) {
                    //  选中，将选项放到数组中
                    $(this).removeClass("unselect").addClass("select");
                    Page.options.push($(this).html()); 
                }else if ($(this).hasClass("select")) {
                    // 取消选中
                    $(this).removeClass("select").addClass("unselect");
                    Page.options.pop($(this).html()); 
                }else{

                }
            })
            

            $(".message.link").click(function(){
                $(".right-view>img").hide();
                $(".right-view iframe").attr({src:'codeEdit.html'});
                $(".right-view iframe").show();
            })

            $(".message.text").click(function(){
                $(".right-view iframe").hide();
                $(".right-view>img").show();
            })

            $(".help").click(function(){
                $(".right-view>img").hide();
                $(".right-view iframe").attr({src:'courseList.html'});
                $(".right-view iframe").show();

                // Util.zuanAnimate();
                
            })
        },
        requestNextData:function(actionText, pagenum){
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    if (pagenum == 1) {
                        if (json.first) {
                            Page.index = 0;
                            Page.data = json.first;
                            Page.pagenum ++;
                            
                            Page.loadSepLine(Page.pagenum - 1);
                            Page.loadMessageWithData(actionText, Page.data, Page.index, false);
                        }else{
                            Common.dialog('暂无数据');
                            $(".loading-chat").remove();
                            // $(".actions").show(); 
                        }
                    }else if (pagenum == 2) {
                        if (json.second) {
                            Page.index = 0;
                            Page.data = json.second;
                            Page.pagenum ++;
                            
                            Page.loadSepLine(Page.pagenum - 1);
                            Page.loadMessageWithData(actionText, Page.data, Page.index, false);
                        }else{
                            Common.dialog('暂无数据');
                            $(".loading-chat").remove();
                            // $(".actions").show(); 
                        }
                    }else if (pagenum == 3) {
                        if (json.third) {
                            Page.index = 0;
                            Page.data = json.third;
                            Page.pagenum ++;
                            
                            Page.loadSepLine(Page.pagenum - 1);
                            Page.loadMessageWithData(actionText, Page.data, Page.index, false);
                        }else{
                            Common.dialog('暂无数据');
                            $(".loading-chat").remove();
                            // $(".actions").show(); 
                        }
                    }
                },
                error:function(xhr, textStatus){

                }
            });
        },
        requestCourseNextData:function(actionText, course, courseIndex){
            // 请求当前课程的节数据
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    var data = json[course];
                    if (data) {
                        if (data[courseIndex]) {
                            //如果此课程此小节消息存在
                            Page.index = 0;
                            Page.data = data[courseIndex];
                            
                            if (course == "html_simple") {
                                localStorage.htmlSimpleIndex = courseIndex;
                            }else if (course == "css_simple") {
                                localStorage.cssSimpleIndex = courseIndex;
                            }else if (course == "javascript_simple") {
                                localStorage.jsSimpleIndex = courseIndex;
                            }else if (course == "python_simple") {
                                localStorage.pythonSimpleIndex = courseIndex;
                            }
                            
                            Page.loadSepLine(courseIndex);
                            Page.loadMessageWithData(actionText, Page.data, Page.index, false);

                        }else{
                            Common.dialog("此课程已结束");
                            $(".loading-chat").remove();
                        }
                    }else{
                        Common.dialog("课程还未开放");
                        $(".loading-chat").remove();
                    }
                },
                error:function(xhr, textStatus){

                }
            });
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
            }, 2000)
        },
        loadClickMessage:function(actionText, exercise){
            // $(".actions").hide(); 

            // 人工提问
            var answerHtml ='<div class="answer"> \
                                <span class="content">'+actionText+'</span> \
                            </div>';
            $(answerHtml).appendTo(".messages");
            
            // 等待机器答复
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat left-animation">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';

            $(loadingWHtml).appendTo(".messages");
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
                        Page.optionData = null;
                        Page.optionIndex = 0;
                        Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);
                    }else{
                        // 选项接着执行下去
                        Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex+1, true)
                    }
                }else{
                    // 消息里面的普通按钮
                    // 先判断数组元素执行完了没有，完了发请求, 没有，对数组操作
                    if (!Page.data[Page.index + 1] || Page.data.length == Page.index + 1) {
                        // 已有数据源已显示完，重新请求数据， 并重新复制 Page.data, Page.index
                        // Page.requestNextData(actionText, Page.pagenum);

                        // 请求当前课程的下一节课程
                        Page.requestCourseData(actionText);
                    }else{
                        Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);                
                    }
                }
                
            }
        },
        requestCourseData:function(actionText){
            // 请求课程数据
            if (localStorage.currentCourse) {
                if (localStorage.currentCourse == "html_simple") {
                    var htmlSimpleIndex = 0;
                    if (localStorage.htmlSimpleIndex) {
                        htmlSimpleIndex = localStorage.htmlSimpleIndex;
                    }
                    htmlSimpleIndex = parseInt(htmlSimpleIndex) + 1;
                    Page.requestCourseNextData(actionText, localStorage.currentCourse, htmlSimpleIndex);
                }else if (localStorage.currentCourse == "css_simple") {
                    var cssSimpleIndex = 0;
                    if (localStorage.cssSimpleIndex) {
                        cssSimpleIndex = localStorage.cssSimpleIndex;
                    }
                    cssSimpleIndex = parseInt(cssSimpleIndex) + 1;
                    Page.requestCourseNextData(actionText, localStorage.currentCourse, cssSimpleIndex);
                }else if (localStorage.currentCourse == "javascript_simple") {
                    var jsSimpleIndex = 1;
                    if (localStorage.jsSimpleIndex) {
                        jsSimpleIndex = localStorage.jsSimpleIndex;
                    }
                    jsSimpleIndex = parseInt(jsSimpleIndex) + 1;
                    Page.requestCourseNextData(actionText, localStorage.currentCourse, jsSimpleIndex);
                }else if (localStorage.currentCourse == "python_simple") {
                    var pythonSimpleIndex = 1;
                    if (localStorage.pythonSimpleIndex) {
                        pythonSimpleIndex = localStorage.pythonSimpleIndex;
                    }
                    pythonSimpleIndex = parseInt(pythonSimpleIndex) + 1;
                    Page.requestCourseNextData(actionText, localStorage.currentCourse, pythonSimpleIndex);
                }
            }else{
                Common.dialog("请选择一个课程");
                $(".loading-chat").remove();
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
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat left-animation">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';

            $(loadingWHtml).appendTo(".messages");
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        }
    };
    
    // ---------------------4.帮助方法
    var Util = {
        storeData:function(){
            // 存储实时数据的下标，数据源， 问题中信息下标
            localStorage.data = JSON.stringify(Page.data);
            localStorage.index = Page.index;
            localStorage.optionData = JSON.stringify(Page.optionData);
            localStorage.optionIndex = Page.optionIndex;
            localStorage.pagenum = Page.pagenum;
        },
        zuanAnimate:function(){
            // 钻石出现，然后2秒后飞到右上角消失
            $(".zuan-shadow-view").show();
            $(".zuan-shadow-view .img").css({
                "margin-top": ($(window).height() - 200) / 2 + "px"
            });

            setTimeout(function(){
                $(".zuan-shadow-view .img").animate({
                    marginTop:"0.5%",
                    marginLeft:"73%",
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
                    
                    var number = $(".zuan span").html().split('x')[1];
                    number = parseInt(number) + 1;
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
        formatString:function(message){
            return message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
        }

    }

    Page.init();

});
