define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    
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
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+item.action+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+item.action+'</span>'
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
            

            // 存储数据
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            item['question'] = true;
            array.push(item)
            localStorage.chatData = JSON.stringify(array);
                        
            if (item.action) {
                // 存在行为按钮, 不继续执行, 存储当前下标
                Page.index = i;
                Util.storeData();
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
        init:function(){
            // 加载缓存数据， 并展示出来
            var array = JSON.parse(localStorage.chatData)
        
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                ChatStroage.load(item);
            }
            
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
                    if (item.action == "点击微信登录") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+item.action+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+item.action+'</span>'
                    }
                }
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
        },
        load:function(item){
                
            // 等待符号
            var loadingWHtml = null;
            loadingWHtml = '<div class="loading-chat">\
                                <img src="../../statics/images/chat.gif" alt="">\
                            </div>';
            $(loadingWHtml).appendTo(".messages");
            
            var answerHtml = null;
            var questionHtml = null;

            if (!item.question) {
                answerHtml = '<div class="answer"> \
                                <span class="content">'+Util.formatString(item.message)+'</span> \
                              </div>';
            }else{
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

            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
            $(answerHtml).appendTo(".messages");

            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 800);
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
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
                    actionHtml = '<span class="btn-wx-auth bottom-animation">'+item.action+'</span>'
                }
            }
            
            $(".loading-chat").remove();
            $(questionHtml).appendTo(".messages");
            
            setTimeout(function(){
                $(".btns .actions").html(actionHtml);
                Page.clickEvent();
            }, 800)
            
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);

            // 存储数据
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            item['question'] = true
            array.push(item)
            localStorage.chatData = JSON.stringify(array);
                        
            if (item.action) {
                // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
                // 存在行为按钮, 不继续执行
                if (opt == true) {
                    // 问题下的消息, 记录问题下消息的下标
                    Page.optionIndex = i;
                }else{
                    // 普通消息
                    Page.index = i;
                }
                Util.storeData();
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
        loadMessageWithData:function(actionText, arr, i, opt){
            // 存储人工提问
            // 存储数据
            var array = [];
            if (localStorage.chatData) {
                array = JSON.parse(localStorage.chatData);
            }
            var item = {
                message:actionText
            }
            item['question'] = false;
            array.push(item)
            localStorage.chatData = JSON.stringify(array);
            
            $(".actions").html(null);

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
                        Page.requestNextData(actionText, Page.pagenum);
                    }else{
                        Page.loadMessageWithData(actionText, Page.data, Page.index+1, false);                
                    }
                }
                
            }
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
        formatString:function(message){
            return message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
        }

    }

    Page.init();

});
