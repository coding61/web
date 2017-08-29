define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js?v=1.1');
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
                    Page.data = json.defaultProblem;

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
            }, Util.messageTime)
        },
        loadMessage:function(arr, i){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;
            
            var questionHtml = null;
            if (item.tag) {
                // 1.是习题
                if (item.link) {
                    // 1.1是编程题
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-link-problem-template", itemDic);

                }else{
                    // 1.2是选择题
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
                }
            }else{
                // 2.普通消息
                if (item.link) {
                    // 2.1是链接消息
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-link-template", itemDic);
                }else if(item.img){
                    // 2.2是图片消息
                    var itemDic = {item:item, imgI:imgI}
                    questionHtml = ArtTemplate("message-img-template", itemDic);
                }else{
                    // 2.3是文本消息
                    var itemDic = {animate:true, item:item}
                    questionHtml = ArtTemplate("message-text-template", itemDic);
                }

            }


            var actionHtml = "";
            if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var j = 0; j < item.action.length; j++) {
                        var option = item.action[j];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth">ok</span>';

                } else{
                    // 单按钮
                    if (item.action == "点击选择课程") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }
                }
            }
            
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
                $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

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
        load:function(arr, i, arrLen){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

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
                                    <div class="msg-view">\
                                        <span class="content">'+Util.formatString(item.message)+'</span> \
                                    </div>\
                                    <img class="avatar" src="'+localStorage.avatar+'"/>\
                                  </div>';
                }else{
                    // 左侧消息
                    if (item.tag) {
                        // 1.是习题
                        if (item.link) {
                            // 1.1是编程题
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-link-problem-template", itemDic);

                        }else{
                            // 1.2是选择题
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
                        }
                    }else{
                        // 2.普通消息
                        if (item.link) {
                            // 2.1是链接消息
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-link-template", itemDic);
                        }else if(item.img){
                            // 2.2是图片消息
                            var itemDic = {item:item, imgI:imgI}
                            questionHtml = ArtTemplate("message-img-template", itemDic);
                        }else{
                            // 2.3是文本消息
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-text-template", itemDic);
                        }
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
                    if (item1.action == "点击选择课程") {
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
                        var loadingWHtml = null;
                        loadingWHtml = '<div class="loading-chat">\
                                            <img src="../../statics/images/chat.gif" alt="">\
                                        </div>';
                        $(loadingWHtml).prependTo($(".messages"));

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
                lineHtml = '<div class="sep-line"> \
                                <i class="line"></i>\
                                <span class="title">'+item.message+'</span>\
                            </div>';
            }else{
                // 加载消息
                if (!item.question) {
                    // 加载人为回复
                    answerHtml = '<div class="answer"> \
                                    <div class="msg-view">\
                                        <span class="content">'+Util.formatString(item.message)+'</span> \
                                    </div>\
                                    <img class="avatar" src="'+localStorage.avatar+'" />\
                                  </div>';
                }else{
                    // 左侧消息
                    if (item.tag) {
                        // 1.是习题
                        if (item.link) {
                            // 1.1是编程题
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-link-problem-template", itemDic);

                        }else{
                            // 1.2是选择题
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
                        }
                    }else{
                        // 2.普通消息
                        if (item.link) {
                            // 2.1是链接消息
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-link-template", itemDic);
                        }else if(item.img){
                            // 2.2是图片消息
                            var itemDic = {item:item, imgI:imgI}
                            questionHtml = ArtTemplate("message-img-template", itemDic);
                        }else{
                            // 2.3是文本消息
                            var itemDic = {"animate":false, item:item}
                            questionHtml = ArtTemplate("message-text-template", itemDic);
                        }
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
                var loadingWHtml = null;
                loadingWHtml = '<div class="loading-chat">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
                $(loadingWHtml).prependTo($(".messages"));

                ChatStroage.timerAgo=setTimeout(function(){
                    // 2秒后加载信息
                    ChatStroage.loadAgo(arr, i+1, arrLen);
                })
            })
            
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
        
        },
        load:function(){

            // // 判断用户是否登录
            // if(localStorage.token){
            //     // 加载个人信息
            //     Common.showLoading();
            //     // Mananger.getInfo();
            //     Page.clickEventTotal();
            // }else{
            //     // 弹出登录窗口
            //     // 打开登录窗口
            //     $(".phone-invite-shadow-view").show();
            //     // $(".login-shadow-view").show();
            //     Page.clickEvent();
            // }
            // Common.addCopyRight();   //添加版权标识

        },
        loadMessage:function(arr, i, opt){
            var item = arr[i];
            var imgI = "i_"+ChatStroage.numbers;

            var questionHtml = null;
            if (item.tag) {
                // 1.是习题
                if (item.link) {
                    // 1.1是编程题
                    var itemDic = {"animate":true, item:item}
                    questionHtml = ArtTemplate("message-link-problem-template", itemDic);

                }else{
                    // 1.2是选择题
                    var itemDic = {"animate":true, item:item}
                    questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
                }
            }else{
                // 2.普通消息
                if (item.link) {
                    // 2.1是链接消息
                    var itemDic = {"animate":true, item:item}
                    questionHtml = ArtTemplate("message-link-template", itemDic);
                }else if(item.img){
                    // 2.2是图片消息
                    var itemDic = {item:item, imgI:imgI}
                    questionHtml = ArtTemplate("message-img-template", itemDic);
                }else{
                    // 2.3是文本消息
                    var itemDic = {"animate":true, item:item}
                    questionHtml = ArtTemplate("message-text-template", itemDic);
                }
            }


            var actionHtml = "";
            if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var j = 0; j < item.action.length; j++) {
                        var option = item.action[j];
                        optionHtml += '<span class="option unselect">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                } else{
                    // 单按钮
                    if (item.action == "点击选择课程") {
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
                return;
            } else{
                setTimeout(function(){
                    console.log(i);
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
            // Common.showLoadingPreImg();
        
            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
            $(".btn-wx-auth").unbind('click').click(function(){
                
                if($(this).attr('disabledImg') == "true"){
                    console.log(000);
                    return;
                } 
                console.log(111);
                $(this).attr({disabledImg:"true"});
                
                
                
                if ($(this).hasClass("wx-auth")) {
                    // 打开选择课程窗口
                    Util.openRightIframe("courseList");
                    
                }else if($(this).hasClass("begin")){
                    // 开始学习，更换课程时，或者初次学习之旅时
                    // 普通 action 按钮点击事件
                    Util.actionClickEvent($(this));
                }else if($(this).hasClass("restart")){
                    // 课程完成，重新开始，课程未完成，重新开始
                    Page.loadClickMessageCourse($(this).html());
                }else{
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
                        // 打卡, 提交试卷
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
                            Mananger.submitExam(1);   //提交试卷
                        }

                    }else{
                        // 普通 action 按钮点击事件
                        Util.actionClickEvent($(this));
                    }
                }
                
                
            })
            
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

            $(".message.text").unbind('click').click(function(){
                // $(".right-view iframe").hide();
                // $(".right-view iframe").attr({src:""});
                // $(".right-view>img").show();
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
                Util.openRightIframe("courseList");   //打开选择课程
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

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                window.open("https://www.cxy61.com");
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

            
            Page.clickEventLoginRelated();
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
                Util.openRightIframe("courseList");   //打开选择课程

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

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                window.open("https://www.cxy61.com");
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                window.open("../../cxyteam_forum/bbs.html");
            })
            // 作品中心
            $(".header .works").unbind('click').click(function(){
                window.open("worksList.html");
            })

            Page.clickEventLoginRelated();
            
        },
        clickEventLoginRelated:function(){
            // ------------------------------------------- I:以前的登录（废弃）
            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                    localStorage.clear();
                    window.location.reload();
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
            $(".choose-avatar-view .submit-avatar").unbind('click').click(function(){
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
            if(localStorage.oldCourse != localStorage.currentCourse){
                //更换课程数据
                Page.loadClickMessageCourse(actionText);
                return;
            }
            // 本课程继续学
            // $(".actions").hide(); 
            // 人工提问
            var answerHtml ='<div class="answer"> \
                                <div class="msg-view">\
                                    <span class="content">'+actionText+'</span> \
                                </div>\
                                <img class="avatar" src="'+localStorage.avatar+'" />\
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
                    
                    // 答错了，创建记录
                    // 创建知识点记录
                    Mananger.createKonwRecord(item.tag, item.message, "unfinish");
                }else{
                    Page.optionData = item.correct;
                    Page.optionIndex = 0;
                    Page.loadMessageWithData(actionText, Page.optionData, Page.optionIndex, true);
                    
                    // 答对了，奖励并记录
                    // 奖励钻石，经验 
                    if (item.zuan_number) {
                        Mananger.addReward(item.tag, item.zuan_number, $(this));
                    }
                    // 创建知识点记录
                    Mananger.createKonwRecord(item.tag, item.message, "finish");
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
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat left-animation">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';

            $(loadingWHtml).appendTo(".messages");
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
            
            Page.requestCourseData(actionText, true);  //true 代表课程更换了

        },
        requestCourseData:function(actionText, flag){
    
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
            Mananger.getCourseInfoWithPk(actionText, localStorage.oldCourse);
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
                            </div>';f

            $(loadingWHtml).appendTo(".messages");
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        }
    };
    
    var Mananger = {
        phone:"",
        code:"",
        password:"",
        chooseAvatar:"https://static1.bcjiaoyu.com/avatars/1.png",
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

                        Default.init();
                        
                        // // 判断本地是否有缓存, 有就把缓存加载出来，否则加载默认                        
                        // if (localStorage.chatData) {
                        //     if(localStorage.currentCourse){
                        //         Mananger.getCourse(localStorage.currentCourse);  //更改缓存数据源后，加载会话消息
                        //     }else{
                        //         ChatStroage.init();
                        //     }
                        // }else{
                        //     Default.init();
                        // }

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
        addReward:function(kn, zuanNum, this_){
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/add_reward/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        knowledgepoint:kn,
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
                    
                        // 普通 action 按钮点击事件
                        Util.actionClickEvent(this_);
                        
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            // 重复领取，不奖励，接着走消息
                            // 普通 action 按钮点击事件
                            Util.actionClickEvent(this_);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
            })
        },
        submitExam:function(pk){
            // 提交试卷
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/exercise/myexercises/"+pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        Common.dialog("本次试卷作答完毕，请选择其它试卷继续!");
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
        createKonwRecord:function(kn, qTitle, status){
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/exercise/myknowledgepoint_create/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        knowledgepoint:kn,
                        question_title:qTitle,
                        status:status
                    },
                    success:function(json){
                        console.log(json);
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            // 重复领取，不奖励，接着走消息
                            // 普通 action 按钮点击事件
                            // Util.actionClickEvent(this_);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
            })
        },

        getPhoneCode:function(this_){
            var reg = /^1[0-9]{10}$/;
            var phone = this_.find(".phone").children("input").val();
            
            var url = "";
            if (this_.find(".view-tag").html() == "注册") {
                url = "/userinfo/signup_request/"
            }else if (this_.find(".view-tag").html() == "找回密码") {
                url = "/userinfo/reset_password_request/";
            }

            if (this_.find(".get-code").html() == "获取验证码" && reg.test(phone)) {
                // 发起获取验证码请求
                Common.isLogin(function(token){
                    $.ajax({
                        type:"get",
                        url:Common.domain + url,
                        headers:{
                            Authorization:"Token " + token
                        },
                        data:{
                            username:phone
                        },
                        timeout:6000,
                        success:function(json){
                            if (json.status == 0) {
                                var time = 60;
                                this.timer = setInterval(()=>{
                                    --time;
                                    if (time > 0) {
                                        this_.find(".get-code").html(time+'s后重试');
                                    }else{
                                        this_.find(".get-code").html("获取验证码");
                                        clearInterval(this.timer);
                                    }
                                },1000);
                                }else if (json.detail) {
                                    Common.dialog(json.detail);
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
            }else if (!reg.test(phone)) {
                // 手机号不合法
                Common.dialog("手机号不合法");
            }
        },
        regPhone:function(phone, code, password, url, nickname){
            var dic = {
                username:phone,
                password:password,
                verification_code:code,
                userinfo:{
                    name:nickname,
                    avatar:url
                }
            };
            Common.showLoading();
            // 注册手机
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/signup/",
                    data:JSON.stringify(dic),
                    contentType:"application/json",
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            // Common.dialog("注册成功");

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
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/reset_password/",
                    data:{
                        username:this_.find(".phone").children("input").val(),
                        password:this_.find(".password").children("input").val(),
                        verification_code:this_.find(".verify-code").children("input").val()
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
            if(this_.find(".username").children("input").val() == ""){
                Common.dialog("请输入账号");
                return;
            }
            if(this_.find(".password").children("input").val() == ""){
                Common.dialog("请输入密码");
                return;
            }
            var url = "",
                data = {};
            if (this_.attr("data-tag") == "invite") {
                url = "/userinfo/invitation_code_login/"
                data = {
                    code:this_.find(".username").children("input").val(),
                    password:this_.find(".password").children("input").val()
                }
            }else if (this_.attr("data-tag") == "phone") {
                url = "/userinfo/login/"
                data = {
                    username:this_.find(".username").children("input").val(),
                    password:this_.find(".password").children("input").val()
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
    }
    // ---------------------4.帮助方法
    var Util = {
        waitTime:Common.getQueryString("wt")?10:1000,
        messageTime:Common.getQueryString("mt")?20:2000,
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
                    var pH = pW * height / width;
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
                    var pH = pW * height / width;
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
            /*
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
            */
            localStorage.owner = json.owner;                                      //记录用户的 username
            localStorage.avatar = json.avatar.replace("http://", "https://");     //记录用户的头像
            $(".header .item").show();
            $(".header .avatar img").attr({src:json.avatar.replace("http://", "https://")});
            $(".header .nickname span").html(json.name);

        },
        adjustTeaminfo:function(){
            var a = $(".header .icon4").offset().left;
            var b = $(".header .right-view").offset().left;
            var c = $(".header .team-info").width();
            $(".team-info").css({
                left: (a-b-c/2) + "px"
            })
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
                $(".right-view iframe.courseList").hide();
                $(".right-view iframe.codeEdit").hide();
                $(".right-view iframe.codeCompile").hide();
            }else if (tag == "courseList") {
                $(".right-view>img").hide();
                $(".right-view iframe.courseList").show();
                $(".right-view iframe.codeEdit").hide();
                $(".right-view iframe.codeCompile").hide();
            }else if (tag == "codeEdit") {
                $(".right-view>img").hide();
                $(".right-view iframe.courseList").hide();
                $(".right-view iframe.codeEdit").show();
                $(".right-view iframe.codeCompile").hide();
            }else if (tag == "codeCompile") {
                $(".right-view>img").hide();
                $(".right-view iframe.courseList").hide();
                $(".right-view iframe.codeEdit").hide();
                $(".right-view iframe.codeCompile").show();
            }
        }
    }

    var Course = {
        index:-1,  //当前点的那个消息后面的加号、或者减号, 默认-1,点了底部的加号
        init:function(){
            $(".messages").html("");
            var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
            if (array.length) {
                Course.showContentInView(array, 0);
                $(".item").show();
            }else{
                $(".item").show();
            }

            Course.clickEvent();

            Common.addCopyRight();   //添加版权标识

        },
        openInputView:function(tag, tagHtml){
            $(".msg-header .type").html(tagHtml);
            $(".msg-header .type").attr({tag:tag});
            if (tag == "photo") {
                $(".input-view textarea").attr({placeholder:"图片消息地址"});
                $(".input-view input").hide();
                $(".input-view #upload-container").show();
            }else if (tag == "text") {
                $(".input-view textarea").attr({placeholder:"文本消息内容"});
                $(".input-view input").hide();
                $(".input-view #upload-container").hide();
            }else if (tag == "link-text") {
                $(".input-view textarea").attr({placeholder:"链接消息内容"});
                $(".input-view input").show();
                $(".input-view #upload-container").hide();
            }else if (tag == "action") {
                $(".input-view textarea").attr({placeholder:"回复按钮上的文字"})
                $(".input-view input").hide();
                $(".input-view #upload-container").hide();
            }
            $(".message-input-view").css({display:'flex'});
        },
        showContentInView:function(arr, i){
            var item = arr[i];
            var questionHtml = "",
                answerHtml = "";

            var itemDic = {index:i, item:item};
            if (item.link) {
                // 2.1是链接消息
                questionHtml = ArtTemplate("message-link-template", itemDic);
            }else if(item.img){
                // 2.2是图片消息
                questionHtml = ArtTemplate("message-img-template", itemDic);
            }else{
                // 2.3是文本消息
                questionHtml = ArtTemplate("message-text-template", itemDic);
            }

            if (item.action) {
                answerHtml = ArtTemplate("answer-text-template", itemDic);
            }
            $(questionHtml).appendTo(".messages");
            $(answerHtml).appendTo(".messages");
            
            if (item.img) {
                try {
                    Course.setImgHeight(item.img);
                }
                catch(err){
                    console.log("图片格式不合法");
                }
            }
            
            // 滚动到最底部
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 点击事件
            Course.clickEvent();

            setTimeout(function(){
                if (i+1 == arr.length) {
                    return;
                }
                Course.showContentInView(arr, i+1);
            }, 10)
        },
        refreshAddMessage:function(){
            // 当前元素后面的元素 index+1
            // 当前元素的处理
            if (tag == "action") {
                // 当前元素后添加一个 action 用户回复消息
                var dic1 = {index:Course.index, item:array[Course.index]};
                var answerHtml = ArtTemplate("answer-text-template", dic1);
                $(answerHtml).appendTo(".messages");

            }else{
                // 当前元素后面追加一个消息
                var dic1 = {index:Course.index+1, item:array[Course.index+1]};
                var questionHtml = ""
                if (tag == "text") {
                    questionHtml = ArtTemplate("message-text-template", dic1);
                }else if (tag == "photo") {
                    questionHtml = ArtTemplate("message-img-template", dic1)
                }else if (tag == "link-text") {
                    questionHtml = ArtTemplate("message-link-template", dic1);
                }
                $(questionHtml).appendTo(".messages");

                if (array[Course.index+1].img) {
                    try {
                        Course.setImgHeight(array[Course.index+1].img);
                    }
                    catch(err){
                         Common.dialog("图片格式不合法");
                    }
                }
            }
        },
        refreshReduceMessage:function(){
            // 当前元素删除
            // 当前元素后面的元素 index-1
        },
        clickEvent:function(){
            // console.log(1);
            $(".add .reset").unbind('click').click(function(){
                // 清空数据重来
                var array = [];
                localStorage.CourseMessageData = JSON.stringify(array);
                Course.init();  //刷新页面
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
            })
            $(".add .left-add").unbind('click').click(function(){
                Course.index = -1;
                $(".message-types").css({display:'flex'});
            })
            $(".add .right-add").unbind('click').click(function(){
                Course.openInputView("action", "按钮文本");
            })
            $(".message-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag");
                var tagHtml = $(this).html();
                Course.openInputView(tag, tagHtml);
                $(".message-types").css({display:'none'});

            })

            $(".msg-header img").unbind('click').click(function(){
                $(".message-input-view").css({display:"none"});
            })
            
            // 确认添加内容
            $(".input-view .input-submit").unbind('click').click(function(){
                // 提交内容
                var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
                var dic = {};       //当前消息

                var tag = $(".msg-header .type").attr("tag");
                if (tag == "action") {
                    /*
                    // 取出数组中最后一个元素,给最后一条消息加 action
                    dic = array[array.length - 1];
                    if (dic.action) {
                        dic["action"] = $(".input-view textarea").val();
                        $(".answer .content").html(dic.action);
                    }else{
                        dic["action"] = $(".input-view textarea").val();
                        // 1.（用户回复）界面显示添加的内容
                        var dic1 = {index:array.length-1, item:dic};
                        var answerHtml = ArtTemplate("answer-text-template", dic1);
                        $(answerHtml).appendTo(".messages");
                    }
                    */
                    if (Course.index == -1) {
                        //最后一条消息添加 action
                        dic = array[array.length - 1];
                        dic["action"] = $(".input-view textarea").val();
                    }else{
                        // 当前消息添加 action
                        dic = array[Course.index];
                        dic["action"] = $(".input-view textarea").val();
                    }


                }else if (tag == "photo") {
                    dic["img"] = $(".input-view textarea").val();
                    if (Course.index == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(Course.index+1, 0, dic);  
                    }
                    
                    
                    /*
                    // 2.（图片消息）界面显示添加的内容
                    var dic1 = {index:array.length-1, item:dic};
                    var questionHtml = ArtTemplate("message-img-template", dic1);
                    $(questionHtml).appendTo(".messages");
                    
                    try {
                        Course.setImgHeight($(".input-view textarea").val());
                    }
                    catch(err){
                         Common.dialog("图片格式不合法");
                    }
                    */

                }else if (tag == "text"){
                    dic["message"] = $(".input-view textarea").val();
                    if (Course.index == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(Course.index+1, 0, dic);
                    }
                    

                    /*
                    // 3.（文本消息）界面显示添加的内容
                    var dic1 = {index:array.length-1, item:dic};
                    var questionHtml = ArtTemplate("message-text-template", dic1);
                    $(questionHtml).appendTo(".messages");
                    */

                }else if (tag == "link-text") {
                    dic["message"] = $(".input-view textarea").val();
                    dic["link"] = $(".input-view input").val();
                    if (Course.index == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(Course.index+1, 0, dic);
                    }
                    
                    
                    /*
                    // 4.（链接文本）界面显示添加的内容
                    var dic1 = {index:array.length-1, item:dic};
                    var questionHtml = ArtTemplate("message-link-template", dic1);
                    $(questionHtml).appendTo(".messages");
                    */
                }
                localStorage.CourseMessageData = JSON.stringify(array);
                
                Course.init();  //1.刷新页面

                // 2:刷新页面
                // Course.refreshAddMessage();
                
                // 隐藏输入框
                $(".message-input-view").css({display:'none'});
                $(".input-view textarea").val("");
                $(".input-view input").val("");


                // 滚动到最底部
                $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
                
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

                Course.clickDeleteEvent();

            })

            $("#export").unbind('click').click(function(){
                var content = localStorage.CourseMessageData;
                var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    
                // var content = JSON.prase(localStorage.CourseMessageData)
                // var blob = new Blob([content], {type:"application/json;charset=utf-8"});
                saveAs(blob, "course.json");//saveAs(blob,filename)

            })
            
            Course.clickDeleteEvent();
            
        },
        clickDeleteEvent:function(){
            // 删除消息内容
            $(".message .reduce").unbind('click').click(function(){
                var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
                Course.index = $(this).parents(".message").attr("data-index");
                // alert(Course.index);

                var index = Course.index;
                index = parseInt(index);

                array.splice(Course.index, 1);  //删除当前元素 数据
                localStorage.CourseMessageData = JSON.stringify(array);
                
                // 方法1:刷新页面
                Course.init();

                // 方法2:刷新页面
                // Course.refreshReduceMessage();
                

                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值
                
                /*
                // 方法2：逐个更改
                // 如果当前元素存在 action 的话，则当前元素的 action 下标-1，当前元素的上一个元素的 action 删除（如果存在的话）
                if (item.action && index != 0) {
                    // 不是第一个元素
                    $(".answer[data-index="+parseInt(index-1)+"]").remove();
                    $(".answer[data-index="+index+"]").attr({"data-index":parseInt(index-1)});
                    $(this).parent().remove();  //删除当前元素 
                }else{
                    // 是第一个元素
                    $(".answer[data-index="+index+"]").remove();
                    $(this).parent().remove();  //删除当前元素
                }
                for (var i = originIndex+1; i < lastIndex; i++) {
                    // 更改当前元素后面所有的 data-index, -1
                    $(".message[data-index="+i+"]").attr({"data-index":parseInt(i-1)});
                    $(".answer[data-index="+i+"]").attr({"data-index":parseInt(i-1)});
                }
                */

            })
            // 删除消息 action 内容
            $(".answer .reduce").unbind('click').click(function(){
                var index = $(this).parent().attr("data-index");
                var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
                var item = array[index];
                delete item["action"];   //删除此消息中的 action

                localStorage.CourseMessageData = JSON.stringify(array);
                $(this).parent().remove();

                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

            })

            // 消息后面添加消息
            $(".message .left-add").unbind('click').click(function(){
                $(".message-types").css({display:'flex'});
                Course.index = $(this).parents(".message").attr("data-index");
                // alert(Course.index);
            })

        },
        setImgHeight:function(url){
            // 给消息中的图片设高
            // 给图片设高
            var pW = $(".message.img").last().find(".msg-view").width() * 0.50;
            Common.getPhotoWidthHeight(url, function(width, height){
                var pH = pW * height / width;
                $(".message.img").last().find('img.msg').css({
                    height: pH + "px"
                })
            })
        }
    }
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadImg',                     //上传选择的点选按钮，**必需**
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //uptoken : 'xxxxxxxxxxxxxx',
        //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'https://static1.bcjiaoyu.com',         //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                async: false,
                type: "POST",
                url:Common.domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ "361e62b004a69a4610acf9f3a5b6f95eaabca3b"
                },
                data: {
                    filename: filename ? filename : 'dfhu.png',
                },
                dataType: "json",
                success: function(json) {
                  upToken = json.token;
                  upkey = json.key;
                }
              });
              return upToken;
        },
        container: 'upload-container',                     //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '10mb',                        //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        mime_types: [
            {title : "Image files", extensions : "jpg,gif,png,jpeg"},
        ],
        init: {
               'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        filename = file.name;
                    });
               },
               'BeforeUpload': function(up, file) {
                    // console.log(file);
                    // console.log(file);
                    //alert('e');
                    // 每个文件上传前,处理相关的事情
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    $(".input-view textarea").val(json.private_url);
               },
               'Error': function(up, err, errTip) {
                    Common.dialog("上传失败");
                    // var $progressNumed = $(".progressNum .progressNumed").eq(0);
                    //     $progressNumed.html($progressNumed.html() - 0 + 1);
                    //     console.log(up);
                    //     console.log(err);
                    //     console.log(errTip);
               },
               'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
               },
               'Key': function(up, file) {
                    var key = upkey;
                    return key;
                },
          }
      });

    // Page.init();
    Course.init();

});
