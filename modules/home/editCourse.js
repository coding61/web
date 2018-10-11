define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js?v=1.1');
	var Utils = require('common/utils.js');
	ArtTemplate.config("escape", false);
    var Audio = require('home/audio_record1.js');
    
    var serverDomain = '//app.cxy61.com/server'

    //模板帮助方法 
    ArtTemplate.helper('TheMessage', function(message){
        message = "" + message;
        try {
           // var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
           var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\n/g, "<br/>");
           return msg
        }
        catch(err){
            return message;
        }
    });

    // 连续录音
    Audio.init(function(url, sha1Item){
        if (!url) {
            // Common.dialog("上传失败", Course.lastAudioIndex);
            __log($(".message[data-index="+Course.lastAudioIndex+"]").find(".log"), "上传录音失败");
            return;
        }
        var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
        var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];
        // var originIndex = parseInt(Course.index);
        var originIndex = parseInt(Course.lastAudioIndex);
        // console.log(Course.lastAudioIndex, Course.currentAudioIndex);
        console.log("录音上传成功:", Course.lastAudioIndex)
        __log($(".message[data-index="+Course.lastAudioIndex+"]").find(".log"), "上传录音成功");

        dic = array[originIndex];
        dic["audio"] = url;
        dic["sha1Code"] = sha1Item;

        totalDic[Course.lesson] = array;
        localStorage.CourseData = JSON.stringify(totalDic);

        // localStorage.CourseMessageData = JSON.stringify(array);
        
        if (Course.chatRefresh) {
            //1.刷新会话列表
            Course.load();  
        }else{
            // 2.更新当前会话, 音频，或者文本
            if (Course.editSubmitMessage === true) {
                // 编程题编辑提交
                $(".message[data-index="+Course.lastAudioIndex+"]").find(".content").html(dic.message)
            }else{
                // 音频编辑提交
                $(".message[data-index="+Course.lastAudioIndex+"]").find(".audio-play").remove();
                var html = '<img class="audio-play" style="width: 25px;margin-left: 10px;" src="../../statics/images/audioPlay.png">'
                $(".message[data-index="+Course.lastAudioIndex+"]").find(".add-reduce-view").append(html);
                $(".message[data-index="+Course.lastAudioIndex+"]").find(".msg-view-parent").attr({"data-audio-url":dic["audio"]});
            }
        }
        

        // 2:刷新页面
        // Course.refreshAddMessage(tag);
        
        // 隐藏输入框
        $(".message-input-view").css({display:'none'});
        $(".input-view textarea").val("");
        $(".input-view input").val("");
        $("#log").html("");

        // 编程题置为初始
        $(".isCodeQuestion img").attr({src:"../../statics/images/icon-unselect.png"});
        $(".codeEditor.select img").attr({src:"../../statics/images/icon-unselect.png"});
        $(".codeEditor").removeClass("select");

        // 滚动到最底部
        // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 0);
        
        window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

        Course.clickDeleteEvent();

        var audioId = document.getElementById('audioView');
        if (Course.currentAudioIndex != Course.lastAudioIndex) {
            Course.lastAudioIndex = Course.currentAudioIndex;

            console.log("开始录音:", Course.lastAudioIndex);
            __log($(".message[data-index="+Course.lastAudioIndex+"]").find(".log"), "开始录音");

            $(".message[data-index="+Course.lastAudioIndex+"]").find(".audioRecord").removeClass("audio-record-start").addClass("audio-record-stop");
            $(".message[data-index="+Course.lastAudioIndex+"]").find(".audioRecord").attr({src:"../../statics/images/editCourse/stop.png"})
            
            audioId.setAttribute("data-lastAudioIndex", Course.lastAudioIndex);
            audioId.setAttribute("data-lesson", Course.lesson);
            audioId.play();
        }else{
            Course.lastAudioIndex = null;   //点的本身停止的录音，将上一条置空
        }
    });

    var Course = {
        index:-1,                    //当前点的那个消息后面的加号、或者减号, 默认-1,点了底部的加号
        lesson:1,                    //当前所选的课节下标
        catalogLesson:1,             //当前编辑的课节目录的下标
        editSubmitMessage:false,     //是否是编辑消息的提交还是添加消息的提交, 默认是添加小
        submitBtn:"add",             //add(新增消息), sub(删除消息), edit(编辑消息), audio(录制音频), action(消息按钮文本)
        chatRefresh:true,            //中间会话列表是否刷新, 添加、删除刷新， 编辑、录音不刷新
        currentAudioIndex:null,
        lastAudioIndex:null,

        // 1.页面初始化
        init:function(){
            Course.load();              //加载中间的会话列表
            $(".lesson-list").html("");
            Course.initLessonData();    //加载课程节数据
        },
        // 2.加载会话列表
        load:function(){
            console.log("lesson", Course.lesson); 
            $(".messages").html("");
            var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
            // 默认把以前的 CourseMessageData 归为第一节课,
            // 默认展示第一节课的数据
            if (array.length) {
                totalDic[Course.lesson] = array
                localStorage.CourseData = JSON.stringify(totalDic);
                array = [];
                localStorage.CourseMessageData = JSON.stringify(array);
            }
            if (totalDic[Course.lesson]) {
                array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];
            }

            if (array.length) {
                Course.showContentInView(array, 0);
            }
            Course.clickEvent();
        },
        // 3.打开编辑输入框, 添加消息、添加音频、编辑消息
        openInputView:function(tag, tagHtml, isEdit){
            if (isEdit && isEdit === "edit") {
                Course.editSubmitMessage = true;   //编辑消息
            }else{
                Course.editSubmitMessage = false;  //添加消息
            }
            
            // 习题是否隐藏
            $(".isHideView>img").removeClass("select");
            $(".isHideView>img").attr({src:"../../statics/images/icon-unselect.png"})
            $(".choiceType>img").removeClass("select");
            $(".choiceType>img").attr({src:"../../statics/images/icon-unselect.png"})
            if (tag == "problem" || tag == "adapt") {
                // 自适应题
                // $(".problem-types").css({display:'flex'});
                $(".problem-question-view").css({display:'flex'})
                $(".problem-question-view .problem-header .type").html(tagHtml);

                //打开自适应题框
                $(".problem-girl-content-view").hide();
                $(".problem-adapt-content-view").show();
                
                $(".problem-adapt-content-view").removeClass("sequence");
                $(".problem-adapt-content-view .options-view textarea").attr({placeholder:'[{"content": "A","message": "1+1=2","imgs": []}]'});
                $(".problem-adapt-content-view .action-view textarea").attr({placeholder:'[{"type": "text","content": "A"}]'});
                $(".problem-adapt-content-view .right-answer-choose input").attr({placeholder:'A(必填)'});
                $(".problem-option-view .option-input-view input").attr({placeholder:"A(必填)"});
                
                $(".problem-adapt-content-view .choiceType").css({display:'flex'});
                return;
            }else if (tag === "blank") {
                // 填空题
                $(".problem-blank-view").css({display:'flex'})
                return;
            }else if (tag === "sequence") {
                $(".problem-question-view").css({display:'flex'})
                $(".problem-question-view .problem-header .type").html(tagHtml);

                //打开自适应题框(顺序提)
                $(".problem-girl-content-view").hide();
                $(".problem-adapt-content-view").show();
                
                $(".problem-adapt-content-view").addClass("sequence");
                $(".problem-adapt-content-view .options-view textarea").attr({placeholder:'[{"content": "1","message": "打开冰箱","imgs": []}]'});
                $(".problem-adapt-content-view .action-view textarea").attr({placeholder:'[{"type": "text","content": "1"}]'});
                $(".problem-adapt-content-view .right-answer-choose input").attr({placeholder:'[1,2,3](必填)'});
                $(".problem-option-view .option-input-view input").attr({placeholder:"1(必填)"});

                $(".problem-adapt-content-view .choiceType").css({display:'none'});
                return;
            }
            $(".msg-header .type").html(tagHtml);
            $(".msg-header .type").attr({tag:tag});
            if (tag == "video") {
                //视频消息
                $(".input-view>textarea").attr({placeholder:"视频缩略图地址"});
                $(".input-view>input").attr({placeholder:"视频链接地址"});
                $(".input-view #upload-container").show();
                
                $(".input-view #upload-container #uploadAudio").hide();
                $(".input-view #upload-container #uploadImg").css({display:'inline-block'});
                $(".input-view #upload-container #uploadVideo").css({display:'inline-block'});

                $("#audio-record-view").hide();
                $("#log").show();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }
            else if (tag == "photo") {
                //图片消息
                $(".input-view>textarea").attr({placeholder:"图片消息地址"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").hide();
                $(".input-view #upload-container #uploadImg").css({display:'inline-block'});
                $(".input-view #upload-container #uploadVideo").hide();

                $("#audio-record-view").hide();
                $("#log").show();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if (tag == "text") {
                //纯文本
                $(".input-view>textarea").attr({placeholder:"文本消息内容"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
                $(".editorView").show();
                $(".isCodeQuestion").show();
            }else if (tag == "link-text") {
                //链接文本
                $(".input-view>textarea").attr({placeholder:"链接消息内容"});
                $(".input-view>input").show();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if (tag == "action") {
                //action 文本
                $(".input-view>textarea").attr({placeholder:"回复按钮上的文字(最多10个字符)"})
                $(".input-view>input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if (tag == "record") {
                //录制音频
                $(".input-view>textarea").attr({placeholder:"消息音频地址"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").hide();
                $(".input-view #upload-container #uploadImg").hide();

                $("#audio-record-view").show();
                $("#log").show();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if (tag == "local") {
                //本地音频
                $(".input-view>textarea").attr({placeholder:"消息音频地址"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").css({display:'inline-block'});
                $(".input-view #upload-container #uploadImg").hide();

                $("#audio-record-view").hide();
                $("#log").show();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if(tag == "manytext"){
                // 大段文本
                $(".input-view>textarea").attr({placeholder:"大段文本内容"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
                $(".editorView").hide();
                $(".isCodeQuestion").hide();
            }else if (tag == "manyCode") {
                // 大段代码文本
                $(".input-view>textarea").attr({placeholder:"大段代码文本内容"});
                $(".input-view>input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
                $(".editorView").show();
                $(".isCodeQuestion").hide();
            }

            // 每次打开输入框清空
            $(".input-view>textarea").val("");
            $(".input-view>input").val("");
            $("#log").html("");

            // 编程题置为初始
            $(".isCodeQuestion img").attr({src:"../../statics/images/icon-unselect.png"});
            $(".codeEditor.select img").attr({src:"../../statics/images/icon-unselect.png"});
            $(".codeEditor").removeClass("select");

            $(".message-input-view").css({display:'flex'});

            KeyBoard.inputTextareaFoucus(tag);
        },
        // 4.将一节的数据展示到页面上
        showContentInView:function(arr, i){
            var item = arr[i];
            var questionHtml = "",
                answerHtml = "";

            var itemDic = {index:i, item:item};
            if (item.type === "blankProblem") {
                // 填空题
                questionHtml = ArtTemplate("message-blankProblem-template", itemDic);
            }
            else if(item.tag){
                // 1.自适应习题
                // item.message = Course.formatString(item.message);
                questionHtml = ArtTemplate("message-choice-problem-template", itemDic);
            }else if (item.link) {
                // 2.1是链接消息
                questionHtml = ArtTemplate("message-link-template", itemDic);
            }else if(item.img){
                // 2.2是图片消息
                questionHtml = ArtTemplate("message-img-template", itemDic);
            }else{
                // 2.3是文本消息
                // item.message = Course.formatString(item.message);
                questionHtml = ArtTemplate("message-text-template", itemDic);
            }

            if (item.action) {
                answerHtml = ArtTemplate("answer-text-template", itemDic);
            }

            $(".messages").append(questionHtml);
            $(".messages").append(answerHtml);
            
            if (item.img) {
                try {
                    Course.setImgHeight(item.img);
                }
                catch(err){
                    console.log("图片格式不合法");
                }
            }
            
            // 滚动到最底部
            $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 0);
            // $(".messages").css({scrollTop:$(".messages")[0].scrollHeight+"px"});

            // 点击事件
            Course.clickEvent();

            setTimeout(function(){
                if (i+1 == arr.length) {
                    return;
                }
                Course.showContentInView(arr, i+1);
            }, 0)
        },

        // 5.添加新的消息时，刷新页面
        refreshAddMessage:function(tag, originIndex, array){
            if (tag === "action") {
                if (originIndex === -1) {
                    // 判断是否是操作最后一条消息
                    originIndex = array.length - 1;
                }
                // 给当前消息加回复文本
                if ($(".answer[data-index="+originIndex+"]").length >0) {
                    // 更改回复文本
                    console.log("debug:当前消息回复更改文本");
                    $(".answer[data-index="+originIndex+"]").find(".content").html(Course.formatString(array[originIndex].action));
                }else{
                    // 追加回复文本
                    console.log("debug:当前消息追加回复文本");
                    var dic = {"index":originIndex, "item":array[originIndex]}
                    var answerHtml = ArtTemplate("answer-text-template", dic);
                    $(".message[data-index="+originIndex+"]").after(answerHtml);
                }
            }else if (tag === "add"){
                if (originIndex === -1) {
                    // 判断是否是操作最后一条消息, 因为此时数据源已经增加了一条新数据，页面还没开始渲染最新的一条，所以页面展示的最后一条数据下标是-2.
                    originIndex = array.length - 2;
                }
                if (array.length != 1) {
                    // 新增消息
                    console.log("debug:当前消息追加新消息");
                    // 将当前元素的后面的所有消息 index都加1，然后再在当前元素后插入一条新数据
                    var nextAll = $(".message[data-index="+originIndex+"]").nextAll();
                    for (var i = 0; i < nextAll.length; i++) {
                        var index = parseInt($(nextAll[i]).attr("data-index"));
                        if (index === originIndex) {
                            // 当前消息的按钮文本不做处理
                        }else{
                            // 之后的消息 index+1
                            $(nextAll[i]).attr({"data-index":index+1});
                        }
                    }
                }else{
                    console.log("debug:第一条消息");
                }

                var dic = {"index":originIndex+1, "item":array[originIndex+1]};
                var questionHtml = "";
                var item = array[originIndex+1];
                if (item.type === "blankProblem") {
                    // 填空题
                    questionHtml = ArtTemplate("message-blankProblem-template", dic);
                }else if(item.tag){
                    // 1.自适应习题
                    // item.message = Course.formatString(item.message);
                    questionHtml = ArtTemplate("message-choice-problem-template", dic);
                }else if (item.link) {
                    // 2.1是链接消息
                    questionHtml = ArtTemplate("message-link-template", dic);
                }else if(item.img){
                    // 2.2是图片消息
                    questionHtml = ArtTemplate("message-img-template", dic);
                }else{
                    // 2.3是文本消息
                    // item.message = Course.formatString(item.message);
                    questionHtml = ArtTemplate("message-text-template", dic);
                }
                
                if (array.length != 1) {
                    if ($(".answer[data-index="+originIndex+"]").length > 0) {
                        $(".answer[data-index="+originIndex+"]").after(questionHtml);
                    }else{
                        $(".message[data-index="+originIndex+"]").after(questionHtml);
                    }
                }else{
                    $(".messages").append(questionHtml);
                }

                if (item.img) {
                    try {
                        Course.setImgHeight(item.img);
                    }
                    catch(err){
                        console.log("图片格式不合法");
                    }
                }
                // 点击事件
                Course.clickEvent();
            }else if (tag === "sub") {
                // 删除消息
            }

        },
        // 6.减少消息时，刷新页面
        refreshReduceMessage:function(originIndex){            
            var currentEleMsg = $(".message[data-index="+originIndex+"]");
            var currentEleAns = $(".answer[data-index="+originIndex+"]");
            var currentEle = currentEleMsg;
            if ($(".answer[data-index="+originIndex+"]").length > 0) {
                currentEle = $(".answer[data-index="+originIndex+"]");
                currentEleAns = currentEle;
            }
            
            var nextAll = currentEle.nextAll();
            for (var i = 0; i < nextAll.length; i++) {
                var index = parseInt($(nextAll[i]).attr("data-index"));
                $(nextAll[i]).attr({"data-index": index-1});
            }
            
            currentEleMsg.remove();
            currentEleAns.remove();
        },

        // 7.添加消息，确定添加内容时，(1)更改数据(2)刷新会话(3)所有回到初始
        getLocalStorageData:function(){
            var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];

            // var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
            var dic = {};       //当前消息
            var originIndex = parseInt(Course.index);
            return [totalDic, array, dic, originIndex]
        },
        // 更改数据源
        updateLocalStorageData:function(totalDic, array, dic, originIndex, isAdd){
            // totalDic(总数据)， array(节数据), dic(当前消息/新消息), originIndex(当前消息的下标), isAdd(是否是新增消息)
            if (isAdd) {
                if (originIndex == -1) {
                    //最后一条消息
                    array.push(dic);
                }else{
                    //当前消息之后
                    array.splice(originIndex+1, 0, dic);
                }
            }

            // ----------------------------------------1.更改缓存数据
            totalDic[Course.lesson] = array;
            localStorage.CourseData = JSON.stringify(totalDic);
            

            // ----------------------------------------2.刷新页面
            console.log("debug:当前消息所属功能（add、sub、action、edit、audio）:", Course.submitBtn);
            if (Course.submitBtn === "action") {
                // 当前消息添加回复文本
                // Course.load()
                Course.refreshAddMessage("action", originIndex, array);
            }else if (Course.submitBtn === "add") {
                // 新增一条消息
                // Course.load();
                Course.refreshAddMessage("add", originIndex, array);
            }else if (Course.submitBtn === "edit") {
                // 编辑一条消息（文本消息）
                $(".message[data-index="+Course.index+"]").find(".content").html(Course.formatString(dic.message))
            }else if (Course.submitBtn === "audio") {
                // 给消息添加音频
                var html = '<img class="audio-play" style="width: 25px;margin-left: 10px;" src="../../statics/images/audioPlay.png">'
                $(".message[data-index="+Course.index+"]").find(".add-reduce-view").append(html);
                $(".message[data-index="+Course.index+"]").find(".msg-view-parent").attr({"data-audio-url":dic["audio"]});
            }

            // ----------------------------------------3.所有输入框置为初始
            // 隐藏输入框
            $(".message-input-view").css({display:'none'});
            $(".input-view textarea").val("");
            $(".input-view input").val("");
            $("#log").html("");

            // 编程题置为初始
            $(".isCodeQuestion img").attr({src:"../../statics/images/icon-unselect.png"});
            $(".codeEditor.select img").attr({src:"../../statics/images/icon-unselect.png"});
            $(".codeEditor").removeClass("select");

            // 选择题输入框
            $(".problem-question-view").css({display:'none'});
            $('.problem-view textarea[class="reset"]').val("");
            $('.problem-view input[class="reset"]').val("");
            $("#log1").html("");
            $("#log2").html("");


            // 填空题输入框
            $(".problem-blank-view").css({display:'none'});
            $('.problem-blank-content-view .question-view textarea').val("");
            $(".problem-blank-content-view .options-view textarea").val("");
            $(".problem-blank-content-view .action-view textarea").val("");
            $(".problem-blank-content-view .right-answer-choose input").val("");
            // $(".problem-blank-content-view .wrongAnswerMsgView textarea").val("");
            // $(".problem-blank-content-view .rightAnswerMsgView textarea").val("");

            $(".answer-options").html("");


            // 习题是否隐藏(选择题/填空题)
            $(".isHideView>img").removeClass("select");
            $(".isHideView>img").attr({src:"../../statics/images/icon-unselect.png"})
            
            if (isAdd) {
                // 滚动到最底部
                // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 0);
            }
            
            // ----------------------------------------4.更改编辑器数据源
            window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

            Course.clickDeleteEvent();  
        },
        // 8.中间会话的各种弹框的点击事件、左下角的添加、打卡、重置
        clickEvent:function(){
            //---------------------------中间的消息列表的公共处理事件
            // 打卡按钮点击事件
            $(".chat .add .record").unbind('click').click(function(){
                Course.chatRefresh = true;
                Course.submitBtn = "add";
                Common.bcAlert("您是否确定本小节课程数据已编写完毕？", function(){
                    // 提交内容
                    var totalDic = Course.getLocalStorageData()[0],
                        array = Course.getLocalStorageData()[1],
                        dic = Course.getLocalStorageData()[2],
                        originIndex = Course.getLocalStorageData()[3];

                    dic["message"] = "打卡炫耀下"
                    dic["action"] = "打卡炫耀下"
                    dic["record"] = true
                    
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, true);
                })
            })

            // 重置按钮的点击事件
            $(".chat .add .reset").unbind('click').click(function(){
                // 重置整个课程数据为空
                Course.chatRefresh = true;
                Common.bcAlert("当前课程是否已完全编辑完？您保存好数据了吗？是否要开始一个新课程？", function(){
                    var totalDic = {};
                    localStorage.CourseData = JSON.stringify(totalDic);

                    Course.init();  //刷新页面
                    window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
                })
            })

            // 左下角添加按钮的点击事件
            $(".chat .add .left-add").unbind('click').click(function(){
                Course.index = -1;
                if (!$(".lesson").length) {
                    Common.dialog("请先添加一个小节");
                    return;
                }
                $(".message-types").css({display:'flex'});
            })
            
            // 各消息类型的点击事件
            $(".message-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag");
                var tagHtml = $(this).html();
                if (tag == "action" && !$(".message").length) {
                    Common.dialog("请先输入一条消息");
                    return;
                }
                //增加习题判断
                var totalDic = Course.getLocalStorageData()[0],
                    array = Course.getLocalStorageData()[1],
                    dic = Course.getLocalStorageData()[2],
                    originIndex = Course.getLocalStorageData()[3];

                //当前消息加动作按钮
                if (originIndex == -1) {
                    //最后一条消息添加 action
                    dic = array[array.length - 1];
                }else{
                    // 当前消息添加 action
                    dic = array[originIndex];
                }
                if (tag == "action" && dic.exercises == true) {
                    Common.dialog("这是习题，无法添加 action 文本");
                    return;
                }

                Course.openInputView(tag, tagHtml);
                $(".message-types").css({display:'none'});
            })
    
            // 关闭消息添加窗口的点击事件
            $(".msg-header img").unbind('click').click(function(){
                $(".message-input-view").css({display:"none"});
                $(".audio-input-view").css({display:"none"});
            })

            //是否是编程题的点击事件
            $(".isCodeQuestion").unbind('click').click(function(){
                if ($(".isCodeQuestion img").attr("src") === "../../statics/images/icon-unselect.png") {
                    // 变成选中
                    $(".isCodeQuestion img").attr({src:"../../statics/images/icon-select.png"});
                }else if ($(".isCodeQuestion img").attr("src") === "../../statics/images/icon-select.png") {
                    // 变成未选中
                    $(".isCodeQuestion img").attr({src:"../../statics/images/icon-unselect.png"});
                }
            })
            // 编程题的类型的点击事件
            $(".codeEditor").unbind('click').click(function(){
                if ($(this).hasClass("select")) {
                    $(this).removeClass("select");
                    $(this).find("img").attr({src:"../../statics/images/icon-unselect.png"})
                    return;
                }
                $(".codeEditor").removeClass("select");
                $(".codeEditor img").attr({src:"../../statics/images/icon-unselect.png"});
                $(this).addClass("select");
                $(this).find("img").attr({src:"../../statics/images/icon-select.png"})
            })

            // 确认添加消息的点击事件(不包括选择题)
            $(".input-view .input-submit").unbind('click').click(function(){
                // 提交内容
                var totalDic = Course.getLocalStorageData()[0],
                    array = Course.getLocalStorageData()[1],
                    dic = Course.getLocalStorageData()[2],
                    originIndex = Course.getLocalStorageData()[3];

                var isAdd = true;   //默认是添加一条消息

                var tag = $(".msg-header .type").attr("tag");
                if (tag == "action") {
                    //当前消息加动作按钮
                    if ($(".input-view textarea").val().length > 10) {
                        Common.dialog("按钮文本最多只能有10个字符");
                        return;
                    }
                    if (originIndex == -1) {
                        //最后一条消息添加 action
                        dic = array[array.length - 1];
                        dic["action"] = $(".input-view textarea").val();
                    }else{
                        // 当前消息添加 action
                        dic = array[originIndex];
                        dic["action"] = $(".input-view textarea").val();
                    }
                    isAdd = false;
                    Course.submitBtn = "action";
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if(tag == "record" || tag == "local"){
                    //当前消息加音频
                    dic = array[originIndex];
                    dic["audio"] = $(".input-view textarea").val();
                    isAdd = false;
                    Course.submitBtn = "audio";
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if (tag == "photo") {
                    //新增图片
                    dic["img"] = $(".input-view textarea").val();
                    isAdd = true;
                    Course.submitBtn = "add";
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if(tag == "video"){
                    // 新增视频
                    if ($(".input-view textarea").val() == "" || $(".input-view input").val() == "") {
                        Common.dialog("视频缩略图，链接不能为空");
                        return;
                    }
                    dic["img"] = $(".input-view textarea").val();
                    dic["video"] = $(".input-view input").val();
                    isAdd = true;
                    Course.submitBtn = "add";
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if (tag == "text"){
                    //新增文本
                    if ($(".input-view textarea").val() === ""){
                        Common.dialog("请输入一些内容");
                        return;
                    }
                    // if ($(".input-view textarea").val().length > 50) {
                    //     Common.dialog("文本最多只能有50个字符");
                    //     return;
                    // }

                    dic["message"] = $(".input-view textarea").val();
                    if ($(".isCodeQuestion img").attr("src") === "../../statics/images/icon-unselect.png") {
                        // 不是编程题
                    }else if ($(".isCodeQuestion img").attr("src") === "../../statics/images/icon-select.png") {
                        // 是编程题
                        var editorType = $(".codeEditor.select").attr("data-type");
                        dic["codeQuestion"] = true;
                        dic["typeEditor"] = editorType;
                        dic["udid"] = Course.getudid();
                    }
                    if (Course.editSubmitMessage == true) {
                        // 编辑文本
                        array[originIndex]["message"] = dic.message;
                        array[originIndex]["codeQuestion"] = dic.codeQuestion;
                        array[originIndex]["typeEditor"] = dic.typeEditor;
                        array[originIndex]["udid"] = dic.udid;
                        isAdd = false;
                        Course.submitBtn = "edit";
                    }else{
                        // 添加, 新增文本
                        isAdd = true;
                        Course.submitBtn = "add";
                    }
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if (tag == "link-text") {
                    //新增链接文本
                    dic["message"] = $(".input-view textarea").val();
                    dic["link"] = $(".input-view input").val();
                    isAdd = true;
                    Course.submitBtn = "add";
                    Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                }else if(tag == "manytext"){
                    // 新增大段文本
                    // 向服务器存储该文本内容，然后存链接文本
                    var content = $(".input-view textarea").val();
                    if (content === "") {
                        Common.dialog("请输入一些内容");
                        return;
                    }
                    storeHtmlText(content, function(link){
                        if (link) {
                            dic["message"] = "点击阅读大段文本";
                            dic["link"] = link;
                            isAdd = true;
                            Course.submitBtn = "add";
                            Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                        }else{
                            Common.dialog("请求失败");
                        }
                    })
                }else if (tag == "manyCode") {
                    // 新增大段代码文本
                    // 向服务器存储该文本内容，然后存链接文本
                    var content = $(".input-view textarea").val();
                    if (content === "") {
                        Common.dialog("请输入一些内容");
                        return;
                    }
                    if (!$(".codeEditor.select").length) {
                        Common.dialog("请选择一种语言类型");
                        return
                    }
                    var editorType = $(".codeEditor.select").attr("data-type");
                    storeHtmlText(content, function(link){
                        if (link) {
                            dic["message"] = "点击阅读大段代码文本";
                            dic["link"] = link;
                            dic["typeEditor"] = editorType;
                            isAdd = true;
                            Course.submitBtn = "add";
                            Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
                        }else{
                            Common.dialog("请求失败");
                        }
                    })
                }
                
            })
            
            // 导出课程数据的点击事件(废弃)
            $("#export").unbind('click').click(function(){
                // var content = localStorage.CourseMessageData;
                // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    
                var content = JSON.prase(localStorage.CourseData)
                var blob = new Blob([content], {type:"application/json;charset=utf-8"});
                saveAs(blob, "course.json");//saveAs(blob,filename)
            })


            //-------------音频相关
            //音频类型的点击事件(废弃) (现只有录制音频项)
            $(".audio-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag");
                var tagHtml = $(this).html();
                if (tag == "record") {
                    //1.初始化录音环境
                    // Utils.audioInit();
                }
                Course.openInputView(tag, tagHtml);                
                $(".audio-types").css({display:'none'});
            })
            //开始录制(废弃)(录音相关文件在 libs/audio_record.js 文件中)
            $("#audio-record-start").unbind('click').click(function(){
                //2.开始录制
                // Utils.startRecord($(this));
            })
            //结束录制(废弃)(录音相关文件在 libs/audio_record.js 文件中)
            $("#audio-record-stop").unbind('click').click(function(){
                //3.结束录制
                // Utils.stopRecord($(this));
            })


            // ---------------选择题相关
             // 打开选择题种类选择框(将废弃)(现只有自适应题)
            $(".problem-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag"),
                    tagHtml = $(this).html();

                $(".problem-question-view").css({display:'flex'})
                $(".problem-question-view .problem-header .type").html(tagHtml);

                if (tag == "adapt") {
                    //打开自适应题框
                    $(".problem-girl-content-view").hide();
                    $(".problem-adapt-content-view").show();
                }else{
                    //打开程序媛题框
                    $(".problem-girl-content-view").show();
                    $(".problem-adapt-content-view").hide();
                }
                $(".problem-types").css({display:'none'});
            })
            // 关闭消息添加窗口的点击事件(选择题)
            $(".problem-header img").unbind('click').click(function(){
                $(this).parent().parent().css({display:'none'});
            })
            // 添加选择器submit(选择题)
            $(".problem-submit").unbind('click').click(function(){
                // 提交内容
                var totalDic = Course.getLocalStorageData()[0],
                    array = Course.getLocalStorageData()[1],
                    dic = Course.getLocalStorageData()[2],
                    originIndex = Course.getLocalStorageData()[3];

                if ($(this).parent().hasClass("problem-adapt-content-view")) {
                    //自适应
                    var msg3 = $('.problem-adapt-content-view .question-view textarea[name="text"]').val(),
                        photo3 = $('.problem-adapt-content-view .question-view textarea[name="photos"]').val(),
                        options3 = $(".problem-adapt-content-view .options-view textarea").val(),
                        action3 = $(".problem-adapt-content-view .action-view textarea").val(),
                        answer3 = $(".problem-adapt-content-view .right-answer-choose input").val(),
                        wrong3 = $(".problem-adapt-content-view .wrongAnswerMsgView textarea").val(),
                        right3 = $(".problem-adapt-content-view .rightAnswerMsgView textarea").val();

                    if(!answer3 || !action3 || !options3){
                        Common.dialog("有必填项没填");
                        return
                    }
                    if (!msg3 && !photo3) {
                        Common.dialog("文字描述、图片描述至少要有一项不为空");
                        return;
                    }
                    try {
                        options3 = JSON.parse(options3)
                        action3 = JSON.parse(action3)
                        photo3 = photo3?JSON.parse(photo3):[]
                        wrong3 = wrong3?JSON.parse(wrong3):[]
                        right3 = right3?JSON.parse(right3):[]
                    }
                    catch(err){
                        alert("数据格式有问题!");
                        return;
                    }
                    if ($(".problem-adapt-content-view").hasClass("sequence")) {
                        if (JSON.parse(answer3).length != action3.length) {
                            Common.dialog("顺序题答案个数要与选项个数保持一致");
                            return;
                        }
                        dic["type"] = "sequenceProblem";
                        dic["answer"] = JSON.parse(answer3);
                    }else{
                        dic["type"] = "adaptProblem";
                        dic["answer"] = answer3;
                    }
                    dic["tag"] = "1";
                    dic["exercises"] = true;
                    dic["message"] = msg3;
                    dic["imgs"] = photo3;
                    dic["options"] = options3;
                    dic["action"] = action3;
                    dic["wrong"] = wrong3;
                    dic["correct"] = right3;
                    if ($(".problem-adapt-content-view .isHideView>img").hasClass("select")) {
                        dic["isHide"] = true
                    }
                    if ($(".problem-adapt-content-view").hasClass("sequence")) {
                        
                    }else{
                        if ($(".problem-adapt-content-view .choiceType>img").hasClass("select")) {
                            dic["choiceType"] = "single";
                        }
                    }

                }else if ($(this).parent().hasClass("problem-girl-content-view")) {
                    //程序媛
                    var msg1 = $(".problem-girl-content-view .question-view textarea").val(),
                        action1 = $(".problem-girl-content-view .action-view textarea").val(),
                        answer1 = $(".problem-girl-content-view .right-answer-choose input").val(),
                        wrong1 = $(".problem-girl-content-view .wrongAnswerMsgView textarea").val(),
                        right1 = $(".problem-girl-content-view .rightAnswerMsgView textarea").val();
                    if(!msg1 || !action1 || !answer1){
                        Common.dialog("有必填项没填");
                        return;
                    }
                    try {
                        action1 = JSON.parse(action1)
                        wrong1 = wrong1?JSON.parse(wrong1):[]
                        right1 = right1?JSON.parse(right1):[]
                    }
                    catch(err){
                        alert("数据格式有问题!");
                        return;
                    }
                    dic["exercises"] = true;
                    dic["message"] = msg1;
                    dic["action"] = action1;
                    dic["answer"] = answer1;
                    dic["wrong"] = wrong1;
                    dic["correct"] = right1;
                    if ($(".problem-girl-content-view .isHideView>img").hasClass("select")) {
                        dic["isHide"] = true
                    }
                    if ($(".problem-adapt-content-view .choiceType>img").hasClass("select")) {
                        dic["choiceType"] = "single";
                    }
                }
                var isAdd = true;
                Course.submitBtn = "add";
                Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
            })

            // 打开选择题option的输入框（自适应选择题）
            $(".option-add").unbind('click').click(function(){
                if ($(this).hasClass("blank")) {
                    // 填空题，选项的添加
                    $(this).next().show();
                    $(this).hide();
                    return;
                }
                $(".problem-option-view").css({display:'flex'});
            })
            // 选择题option的添加和 action 的添加（自适应选择题）
            $(".option-submit").unbind('click').click(function(){
                var msg2 = $('.problem-option-view textarea[name="text"]').val(),
                    content2 = $(".problem-option-view input").val(),
                    photo2 = $('.problem-option-view textarea[name="photos"]').val();
                if(!msg2 && !photo2){
                    Common.dialog("文字描述、图片描述至少要有一项不为空");
                    return;
                }
                var options2 = $(".problem-adapt-content-view .options-view textarea").val(),
                    actions2 = $(".problem-adapt-content-view .action-view textarea").val();
                try {
                    options2 = options2?JSON.parse(options2):[]
                    actions2 = actions2?JSON.parse(actions2):[]
                    photo2 = photo2?JSON.parse(photo2):[]
                }
                catch(err){
                    alert("数据格式有问题!");
                    return;
                }
                if (!content2) {
                    Common.dialog("必填项未填写");
                    return
                }
            
                var dic = {}
                dic["message"] = msg2
                dic["imgs"] = photo2
                dic["content"] = content2
                options2.push(dic);
                $(".problem-adapt-content-view .options-view textarea").val(JSON.stringify(options2))

                var dic1 = {}
                dic1["type"] = "text"
                dic1["content"] = content2
                actions2.push(dic1)
                $(".problem-adapt-content-view .action-view textarea").val(JSON.stringify(actions2))
                
                // 顺序题
                if ($(".problem-adapt-content-view").hasClass("sequence")) {
                    // right-answer 正确答案选项列表
                    var html = ArtTemplate("problem-answer-options-template", actions2);
                    $(".problem-adapt-content-view .answer-options").html(html);
                    // right-answer 选择
                    rightAnswer();
                }
                
                $(".problem-option-view").css({display:'none'});
                // https://static1.bcjiaoyu.com/0854865591cb522edde1cdb8bdc0b752_k.gif-120x120
            })

            // 打开选择题action输入框（程序媛选择题）
            $(".action-add").unbind('click').click(function(){
                if($(this).parent().parent().hasClass("problem-girl-content-view")){
                    //程序媛
                    $(this).next().show();
                    $(this).hide();
                }
            })
            // 选择题action的添加（程序媛选择题）
            $("#action-add-submit").unbind('click').click(function(){
                if($(this).parents(".action-view").parent().hasClass("problem-girl-content-view")){
                    //程序媛
                    var actions4 = $(".problem-girl-content-view .action-view textarea").val()
                    try {
                        actions4 = actions4?JSON.parse(actions4):[]
                    }
                    catch(err){
                        alert("数据格式有问题!");
                        return;
                    }

                    var content4 = $(this).parent().find("input").val();
                    var dic = {}
                    dic["type"] = "text"
                    dic["content"] = content4
                    actions4.push(dic)
                    $(".problem-girl-content-view .action-view textarea").val(JSON.stringify(actions4))

                    $(this).parent().prev().show();
                    $(this).parent().hide();
                }
            })


            // -------------填空题相关
            // detailDesc的已知选块添加
            $("#detailDesc-add-blank").unbind('click').click(function(){
                var detailDescBlank = $('.problem-blank-content-view .question-view textarea[name="detailDesc"]').val();
                try {
                    detailDescBlank = detailDescBlank?JSON.parse(detailDescBlank):[]
                }
                catch(err){
                    alert("数据格式有问题!");
                    return;
                }
                var content = $(this).parent().find("input").val();
                if (!content) {
                    // 待选模块
                    detailDescBlank.push("");
                }else{
                    // 已选模块
                    detailDescBlank.push(content);
                }
                
                $('.problem-blank-content-view .question-view textarea[name="detailDesc"]').val(JSON.stringify(detailDescBlank));

                $(this).parent().prev().show();
                $(this).parent().hide();
            })

            // 填空题option的添加
            $("#option-add-blank").unbind('click').click(function(){
                var optionBlank = $(".problem-blank-content-view .options-view textarea").val(),
                    actionBlank = $(".problem-blank-content-view .action-view textarea").val();
                try {
                    optionBlank = optionBlank?JSON.parse(optionBlank):[]
                    actionBlank = actionBlank?JSON.parse(actionBlank):[]
                }
                catch(err){
                    alert("数据格式有问题!");
                    return;
                }

                var content = $(this).parent().find("input").val();
                if (!content) {
                    Common.dialog("请填写选项内容");
                    return
                }

                var dic = {}
                dic["message"] = content;
                optionBlank.push(dic)
                $(".problem-blank-content-view .options-view textarea").val(JSON.stringify(optionBlank))

                var dic1 = {}
                dic1["type"] = "text"
                dic1["content"] = content;
                actionBlank.push(dic1)
                $(".problem-blank-content-view .action-view textarea").val(JSON.stringify(actionBlank))
                
                // right-answer 正确答案选项列表
                var html = ArtTemplate("answer-options-template", actionBlank);
                $(".answer-options").html(html);
                // right-answer 选择
                rightAnswer();

                $(this).parent().prev().show();
                $(this).parent().hide();
            })

            function rightAnswer(){
                // right-answer 选择
                $(".answer-option").unbind('click').click(function(){
                    if ($(this).parents(".problem-adapt-content-view").length) {
                        var answer = $(".problem-adapt-content-view .right-answer-choose input").val();
                    }else{
                        var answer = $(".problem-blank-content-view .right-answer-choose input").val();
                    }
                    try {
                        answer = answer?JSON.parse(answer):[]
                    }
                    catch(err){
                        alert("数据格式有问题!");
                        return;
                    }
                    var content = $(this).children("span").html();

                    if ($(this).children("img").hasClass("select")) {
                        // 取消选中
                        answer.splice(answer.indexOf(content), 1);
                        $(this).children("img").removeClass("select");
                        $(this).children("img").attr({src:"../../statics/images/icon-unselect.png"})
                    }else{
                        // 选中
                        answer.push(content);
                        $(this).children("img").addClass("select");
                        $(this).children("img").attr({src:"../../statics/images/icon-select.png"})
                    }
                    if ($(this).parents(".problem-adapt-content-view").length) {
                        $(".problem-adapt-content-view .right-answer-choose input").val(JSON.stringify(answer));
                    }else{
                        $(".problem-blank-content-view .right-answer-choose input").val(JSON.stringify(answer));
                    }
                })
            }

            // 添加填空题submit
            $(".blank-problem-submit").unbind('click').click(function(){
                // 提交内容
                var totalDic = Course.getLocalStorageData()[0],
                    array = Course.getLocalStorageData()[1],
                    dic = Course.getLocalStorageData()[2],
                    originIndex = Course.getLocalStorageData()[3];
                // console.log(totalDic, array, dic, originIndex);

                var msg = $('.problem-blank-content-view .question-view textarea[name="text"]').val(),
                    detailMsg = $('.problem-blank-content-view .question-view textarea[name="detailDesc"]').val(),
                    option = $(".problem-blank-content-view .options-view textarea").val(),
                    action = $(".problem-blank-content-view .action-view textarea").val(),
                    answer = $(".problem-blank-content-view .right-answer-choose input").val(),
                    wrong = $(".problem-blank-content-view .wrongAnswerMsgView textarea").val(),
                    right = $(".problem-blank-content-view .rightAnswerMsgView textarea").val();

                if(!answer || !action || !option){
                    Common.dialog("有必填项没填");
                    return
                }
                if (!msg || !detailMsg) {
                    Common.dialog("题干和详情描述不能为空");
                    return;
                }
                try {
                    option = JSON.parse(option)
                    action = JSON.parse(action)
                    detailMsg = detailMsg?JSON.parse(detailMsg):[]
                    answer = JSON.parse(answer)
                    wrong = wrong?JSON.parse(wrong):[]
                    right = right?JSON.parse(right):[]
                }
                catch(err){
                    alert("数据格式有问题!");
                    return;
                }
                dic["tag"] = "1";
                dic["type"] = "blankProblem";
                dic["message"] = msg;
                dic["detailMessage"] = detailMsg;
                dic["options"] = option;
                dic["action"] = action;
                dic["answer"] = answer;
                dic["exercises"] = true;
                dic["wrong"] = wrong;
                dic["correct"] = right;
                if ($(".problem-blank-content-view .isHideView>img").hasClass("select")) {
                    dic["isHide"] = true
                }
                // console.log(dic)
                var isAdd = true;
                Course.submitBtn = "add";
                Course.updateLocalStorageData(totalDic, array, dic, originIndex, isAdd);
            })

            // -------------------是否隐藏习题
            $(".isHideView>img").unbind('click').click(function(){
                if ($(this).hasClass("select")) {
                    // 取消选中
                    $(this).removeClass("select");
                    $(this).attr({src:"../../statics/images/icon-unselect.png"})
                }else{
                    // 选中
                    $(this).addClass("select");
                    $(this).attr({src:"../../statics/images/icon-select.png"})
                }
            })
            $(".choiceType>img").unbind('click').click(function(){
                if ($(this).hasClass("select")) {
                    // 取消选中
                    $(this).removeClass("select");
                    $(this).attr({src:"../../statics/images/icon-unselect.png"})
                }else{
                    // 选中
                    $(this).addClass("select");
                    $(this).attr({src:"../../statics/images/icon-select.png"})
                }
            })
            
            Course.clickDeleteEvent();
        },
        clickDeleteEvent:function(){
            //---------------------------消息的处理事件(追加消息，删除消息，添加音频)
            // 删除消息内容
            $(".message .reduce").unbind('click').click(function(){
                Course.chatRefresh = true;
                Course.submitBtn = "sub";

                // ----------------------------------------1.更改缓存数据
                var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];
                
                Course.index = $(this).parents(".message").attr("data-index");

                var index = Course.index;
                index = parseInt(index);
                array.splice(index, 1);  //删除当前元素 数据

                totalDic[Course.lesson] = array;
                localStorage.CourseData = JSON.stringify(totalDic);
                

                // ----------------------------------------1.更改编辑器数据源
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值
                
                // 方法1:刷新页面
                // Course.load();

                // 方法2:删除消息
                Course.refreshReduceMessage(index);
            })

            // 消息后面添加消息
            $(".message .left-add").unbind('click').click(function(){
                Course.chatRefresh = true;
                $(".message-types").css({display:'flex'});
                Course.index = $(this).parents(".message").attr("data-index");
            })

            // 消息编辑
            $(".message .edit").unbind('click').click(function(){
                Course.chatRefresh = false;
                // 打开编程习题文本框
                Course.openInputView("text", "文本", "edit");
                Course.index = $(this).parents(".message").attr("data-index");

                var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];
                
                var index = parseInt(Course.index);
                var dic = array[index];       //当前消息
                console.log(dic);
                $(".message-input-view textarea").val(dic.message);
                if (dic.udid) {
                    $(".isCodeQuestion img").attr({src:"../../statics/images/icon-select.png"});
                }else{
                    $(".isCodeQuestion img").attr({src:"../../statics/images/icon-unselect.png"});
                }
                $(".codeEditor.select img").attr({src:"../../statics/images/icon-unselect.png"});
                $(".codeEditor").removeClass("select");
                if (dic.typeEditor) {
                    // console.log(dic.typeEditor);
                    $(".codeEditor[data-type="+dic.typeEditor+"]").addClass("select");
                    $(".codeEditor[data-type="+dic.typeEditor+"] img").attr({src:"../../statics/images/icon-select.png"});
                }

            })

            //消息录音类型(单个录音，有弹框)
            $(".message .audio").unbind('click').click(function(){
                Course.chatRefresh = false;
                // $(".audio-types").css({display:'flex'});
                Course.index = $(this).parents(".message").attr("data-index");

                Course.openInputView("record", "录制音频");
            })
            //播放音频
            $(".message .audio-play").unbind('click').click(function(){
                var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
                if (url) {
                    url += "?v="+ Course.getRandomNum();
                    Common.playMessageSoun2(url);  //播放音频
                }
            })

            // 录音(连续录音，没有弹框)
            $(".audioRecord").unbind('click').click(function(){
                if ($(".audioTeacherNum>input").val()=="" || $(".audioLang>input").val() == "") {
                    Common.dialog("请填写录音师编号和语种");
                    return;
                }
                Course.chatRefresh = false;
                Course.index = $(this).parents(".message").attr("data-index");
                var audioId = document.getElementById('audioView');
                Course.currentAudioIndex = Course.index;
                // console.log(Course.currentAudioIndex, Course.lastAudioIndex);
                if ($(this).hasClass("audio-record-start")) {
                    if (!Course.lastAudioIndex) {
                        Course.lastAudioIndex = Course.index;

                        audioId.setAttribute("data-lastAudioIndex", Course.currentAudioIndex);
                        audioId.setAttribute("data-lesson", Course.lesson);
                        audioId.play();

                        console.log("开始录音:", Course.currentAudioIndex)
                        __log($(".message[data-index="+Course.currentAudioIndex+"]").find(".log"), "开始录音");

                        $(this).removeClass("audio-record-start").addClass("audio-record-stop");
                        $(this).attr({src:"../../statics/images/editCourse/stop.png"})
                    }else if (Course.currentAudioIndex != Course.lastAudioIndex) {
                        audioId.pause();

                        console.log("停止录音:", Course.lastAudioIndex)
                        __log($(".message[data-index="+Course.lastAudioIndex+"]").find(".log"), "停止录音");

                        $(".message[data-index="+Course.lastAudioIndex+"]").find(".audioRecord").removeClass("audio-record-stop").addClass("audio-record-start");
                        $(".message[data-index="+Course.lastAudioIndex+"]").find(".audioRecord").attr({src:"../../statics/images/editCourse/start.png"})
                    }else{
                        audioId.setAttribute("data-lastAudioIndex", Course.currentAudioIndex);
                        audioId.setAttribute("data-lesson", Course.lesson);
                        audioId.play();

                        console.log("开始录音1:", Course.currentAudioIndex)
                        __log($(".message[data-index="+Course.currentAudioIndex+"]").find(".log"), "开始录音");

                        $(this).removeClass("audio-record-start").addClass("audio-record-stop");
                        $(this).attr({src:"../../statics/images/editCourse/stop.png"})
                    }
                }else{
                    audioId.pause();

                    console.log("停止录音:", Course.currentAudioIndex);
                    __log($(".message[data-index="+Course.currentAudioIndex+"]").find(".log"), "停止录音");

                    $(".message[data-index="+Course.currentAudioIndex+"]").find(".audioRecord").removeClass("audio-record-stop").addClass("audio-record-start");
                    $(".message[data-index="+Course.currentAudioIndex+"]").find(".audioRecord").attr({src:"../../statics/images/editCourse/start.png"})
                }
            })

        },
        // ----------------------------初始化课程小节 相关方法
        initLessonData:function(){
            
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            var hasCatalogs = true;
            var catalogs = dic["catalogs"]?dic["catalogs"]:[];
            if(!dic.hasOwnProperty("catalogs")){
                //初始化这个 catalogs
                hasCatalogs = false
            }

            for(var key in dic){
                if(key == "catalogs") continue;
                var lessonHtml = ""
                if (key == Course.lesson) {
                    //1节
                    lessonHtml += '<li class="select lesson">'
                }else{
                    lessonHtml += '<li class="unselect lesson">'
                }
                var str = "第"+key+"节";
                lessonHtml += '<span data-lesson="'+key+'">'+str+'</span>'
                                +'<div class="imgs"><img class="delete" src="../../statics/images/editCourse/reduce.png">'
                                +'<img class="edit" src="../../statics/images/editCourse/edit.png"></div>'
                                +'<div class="arrowImgs"><img class="arrow-down" src="../../statics/images/editCourse/arrow-down.png"><img class="arrow-up" src="../../statics/images/editCourse/arrow-up.png"></div>'
                            +'</li>';
                $(lessonHtml).appendTo(".lesson-list");

                if(!hasCatalogs){
                    //初始化这个 catalogs
                    var catalog = {"title":str}
                    catalogs.push(catalog);
                    dic["catalogs"] = catalogs;
                    localStorage.CourseData = JSON.stringify(dic);
                    // --------3.改变右侧 iframe
                    // 通知右边的iframe 改变代码内容
                    window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
                }
            }

            Course.clickLessonEvent();

        },
        clickLessonEvent:function(){
            /*
            // 关闭节数输入框
            $(".lesson-input-header img").unbind('click').click(function(){
                $(".lesson-input-view").css({display:'none'});
            })

            // 打开节数输入框
            $(".lessons .add").unbind('click').click(function(){
                // $(".lesson-input-view").css({display:'flex'});

                Course.newAddLesson();
            })

            // 确认添加课节数
            $(".lesson-submit").unbind('click').click(function(){
                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};

                var str = $(".lesson-input input").val();
                var r = /^\+?[1-9][0-9]*$/;　　//正整数
                if (!r.test(str)) {
                    Common.dialog("请输入一个正整数");
                    return;
                }
                if (dic[str]) {
                    Common.dialog("已经存在该节数");
                    return;
                }
                var lessonHtml = ""
                if (!$(".lesson").length) {
                    //课节为0
                    lessonHtml += '<li class="select lesson">'
                }else{
                    lessonHtml += '<li class="unselect lesson">'
                }
                lessonHtml += '<span>'+str+'</span>'
                                +'<div class="imgs"><img class="delete" src="../../statics/images/editCourse/reduce.png">'
                                +'<img class="edit" src="../../statics/images/editCourse/edit.png"></div>'
                            +'</li>';
                $(lessonHtml).appendTo(".lesson-list");

                $(".lesson-input-view").css({display:'none'});
                $(".lesson-input input").val("");

                Course.clickDeleteLessonEvent();

                // 存储节数字数据
                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                dic[str] = [];
                localStorage.CourseData = JSON.stringify(dic);

                // 通知右边的iframe 改变代码内容
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

            })
            */

            // 1.添加课节
            $(".lessons .add").unbind('click').click(function(){
                Course.newAddLesson();
            })
            // 2.关闭课程目录输入框
            $(".lesson-input-header img").unbind('click').click(function(){
                $(".lesson-input-view").css({display:'none'});
            })
            // 3.确认添加课程目录
            $(".lesson-submit").unbind('click').click(function(){
                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var catalogs = dic["catalogs"]?dic["catalogs"]:[];
                
                var str = $(".lesson-input input").val();
                
                var lessonTitle = {"title":str}
                console.log("正在编辑的目录课节下标是:", Course.catalogLesson);
                catalogs[parseInt(Course.catalogLesson)-1] = lessonTitle;

                $(".lesson-input-view").css({display:'none'});
                $(".lesson-input input").val("");

                Course.clickDeleteLessonEvent();

                // 存储节目录标题
                dic["catalogs"] = catalogs;
                localStorage.CourseData = JSON.stringify(dic);

                // 通知右边的iframe 改变代码内容
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，

            })

            Course.clickDeleteLessonEvent();

        },
        clickDeleteLessonEvent:function(){
            /*
            // 节点击事件
            $(".lesson").unbind('click').click(function(e){
                e.stopPropagation();
                Course.lesson = $(this).children("span").html();
                $(".lesson.select").removeClass("select").addClass("unselect");
                $(this).removeClass("unselect").addClass("select");

                // 改变中间的会话列表
                Course.load();
            })

            // 节删除
            $(".lesson img").unbind('click').click(function(e){
                e.stopPropagation();
                var this_ = $(this);
                Common.bcAlert("您是否确定要删除本小节数据？可能会导致您的课程节下标不连续，是否继续？", function(){
                    Course.deleteLesson(this_);
                })
            })
            */
            
            // 节点击事件
            $(".lesson").unbind('click').click(function(e){
                e.stopPropagation();
                Course.lesson = $(this).children("span").attr("data-lesson");
                $(".lesson.select").removeClass("select").addClass("unselect");
                $(this).removeClass("unselect").addClass("select");

                console.log("course-lesson", Course.lesson);

                // 改变中间的会话列表
                Course.load();
            })

            // 节删除
            $(".lesson img.delete").unbind('click').click(function(e){
                e.stopPropagation();
                var this_ = $(this);
                Common.bcAlert("您是否确定要删除本小节数据？", function(){
                    Course.newDeleteLesson(this_);
                })
            })
            // 节编辑
            $(".lesson img.edit").unbind('click').click(function(e){
                e.stopPropagation();
                Course.catalogLesson = $(this).parents(".lesson").children("span").attr("data-lesson");

                $(".lesson-input-view").css({display:'flex'});

                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var catalogs = dic["catalogs"]?dic["catalogs"]:[];
                var title = catalogs[parseInt(Course.catalogLesson)-1]["title"];
                $(".lesson-input input").val(title);
                
            })
            // 节上移
            $(".lesson img.arrow-up").unbind('click').click(function(e){
                e.stopPropagation();
                var parent = $(this).parents(".lesson");
                console.log($(".lesson").index(parent));
                var index = $(".lesson").index(parent);
                if (index === 0) {
                    Common.dialog("已经是第一节了，无法再继续上调");
                    return
                }
                
                var prevLesson = parent.prev();
                var prevLessonIndex = prevLesson.children("span").attr("data-lesson"),
                    currentLessonIndex = parent.children("span").attr("data-lesson");

                // --------2.改变存储数据
                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                // 1.改变节数据
                var tempDic = dic[prevLessonIndex];
                dic[prevLessonIndex] = dic[currentLessonIndex];
                dic[currentLessonIndex] = tempDic;
                // 2.改变目录(交换两者位置)
                var x = currentLessonIndex,
                    y = prevLessonIndex,
                    arr = dic["catalogs"]?dic["catalogs"]:[];
                arr.splice(x - 1, 1, ...arr.splice(y - 1, 1, arr[x - 1]))
                dic["catalogs"] = arr;
                // 3.改变存储的课程数据
                localStorage.CourseData = JSON.stringify(dic);
                

                // --------3.改变右侧 iframe
                // 通知右边的iframe 改变代码内容
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，


                if (parent.hasClass("select")) {
                    // 当前 lesson 是否处于选中状态
                    $(".lesson").removeClass("select").addClass("unselect");
                    prevLesson.removeClass("unselect").addClass("select");
                }else if (prevLesson.hasClass("select")) {
                    // 前一个 lesson 是否处于选中状态
                    $(".lesson").removeClass("select").addClass("unselect");
                    parent.removeClass("unselect").addClass("select");
                }

                var msg = "第" + parseInt(index+1)+"节数据和第" + parseInt(index)+ "数据交换位置成功";
                Common.dialog(msg);
            
            })
            // 节下移
            $(".lesson img.arrow-down").unbind('click').click(function(e){
                e.stopPropagation();
                var parent = $(this).parents(".lesson");
                console.log($(".lesson").index(parent));
                var index = $(".lesson").index(parent);
                if (index === $(".lesson").length - 1) {
                    Common.dialog("已经是最后一节了，无法再继续下调");
                    return
                }
                var nextLesson = parent.next();
                var nextLessonIndex = nextLesson.children("span").attr("data-lesson"),
                    currentLessonIndex = parent.children("span").attr("data-lesson");

                // --------2.改变存储数据
                var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                // 1.改变节数据
                var tempDic = dic[nextLessonIndex];
                dic[nextLessonIndex] = dic[currentLessonIndex];
                dic[currentLessonIndex] = tempDic;
                // 2.改变目录(交换两者位置)
                var x = currentLessonIndex,
                    y = nextLessonIndex,
                    arr = dic["catalogs"]?dic["catalogs"]:[];
                arr.splice(x - 1, 1, ...arr.splice(y - 1, 1, arr[x - 1]))
                dic["catalogs"] = arr;
                // 3.改变存储的课程数据
                localStorage.CourseData = JSON.stringify(dic);
                

                // --------3.改变右侧 iframe
                // 通知右边的iframe 改变代码内容
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，


                if (parent.hasClass("select")) {
                    // 当前 lesson 是否处于选中状态
                    $(".lesson").removeClass("select").addClass("unselect");
                    nextLesson.removeClass("unselect").addClass("select");
                }else if (nextLesson.hasClass("select")) {
                    // 前一个 lesson 是否处于选中状态
                    $(".lesson").removeClass("select").addClass("unselect");
                    parent.removeClass("unselect").addClass("select");
                }
                
                var msg = "第" + parseInt(index+1)+"节数据和第" + parseInt(index+2)+ "数据交换位置成功";
                Common.dialog(msg);
            })
        },
        
        // 删除小节（已废弃）
        deleteLesson:function(this_){
            var lessonNum = this_.parents(".lesson").children("span").html();
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            delete dic[lessonNum];
            localStorage.CourseData = JSON.stringify(dic);

            // 如果删除的刚好是选中,则默认lesson 中的第一个的课节
            if (this_.parents(".lesson").hasClass("select")) {
                this_.parents(".lesson").remove();
                if (!$(".lesson").length) {
                    Course.lesson = 1;
                }else{
                    $(".lesson").eq(0).addClass("select").removeClass("unselect");
                    Course.lesson = $(".lesson").eq(0).children("span").html();
                }
            }else{
                this_.parents(".lesson").remove();
            }

            // 刷新中间的会话列表
            Course.load();

            // 通知右边的iframe 改变代码内容
            window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
        },

        newAddLesson:function(){
            // --------1.改变 UI
            var count = 0;
            if (!$(".lesson").length){
                // 长度为0时
            }else{
                count = $(".lesson").length;
            }
            var str = "第"+parseInt(count+1)+"节";
            
            var lessonHtml = ""
            if (count == 0) {
                lessonHtml += '<li class="select lesson">'
            }else{
                lessonHtml += '<li class="unselect lesson">'
            }
            lessonHtml += '<span data-lesson="'+parseInt(count+1)+'">'+str+'</span>'
                        +'<div class="imgs"><img class="delete" src="../../statics/images/editCourse/reduce.png">'
                        +'<img class="edit" src="../../statics/images/editCourse/edit.png"></div>'
                        +'<div class="arrowImgs"><img class="arrow-down" src="../../statics/images/editCourse/arrow-down.png"><img class="arrow-up" src="../../statics/images/editCourse/arrow-up.png"></div>'
                        +'</li>';
            $(lessonHtml).appendTo(".lesson-list");
            Course.clickDeleteLessonEvent();
            
            // --------2.改变存储数据
            // 存储节数字数据
            var key = String(parseInt(count+1));
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            dic[key] = [];
            //存储目录
            var catalog = {"title":str},
                catalogs = dic["catalogs"]?dic["catalogs"]:[];
            catalogs.push(catalog);
            dic["catalogs"] = catalogs;
            localStorage.CourseData = JSON.stringify(dic);
            

            // --------3.改变右侧 iframe
            // 通知右边的iframe 改变代码内容
            window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
        },
        newDeleteLesson:function(this_){
            var lessonNum = this_.parents(".lesson").children("span").attr("data-lesson");
            this_.parents(".lesson").remove();

            // ------1.改变存储数据
            var length = $(".lesson").length;
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            delete dic[lessonNum];  //删除当前课节数据

            var catalogs = dic["catalogs"]?dic["catalogs"]:[];
            catalogs.splice(parseInt(lessonNum)-1, 1);    //删除此课节对应的目录描述
            dic["catalogs"] = catalogs;

            for (var i = 1; i <= length; i++) {
                var key = String(i);
                if (!dic[key]) {
                    //不是最后一个元素时
                    var nextKey = String(i+1);
                    dic[key] = dic[nextKey];
                    delete dic[nextKey];
                }
            }
            localStorage.CourseData = JSON.stringify(dic);


            // --------2.改变 UI
            // 重新初始化节下标
            if (!$(".lesson").length) {
                Course.lesson = 1;
            }else{
                $(".lesson-list").html("");
                for (var i = 0; i < length; i++) {
                    var str = "第"+parseInt(i+1)+"节";
                    var lessonHtml='<li class="unselect lesson">\
                                        <span data-lesson="'+parseInt(i+1)+'">'+str+'</span>\
                                        <div class="imgs"><img class="delete" src="../../statics/images/editCourse/reduce.png">\
                                        <img class="edit" src="../../statics/images/editCourse/edit.png"></div>\
                                        <div class="arrowImgs"><img class="arrow-down" src="../../statics/images/editCourse/arrow-down.png"><img class="arrow-up" src="../../statics/images/editCourse/arrow-up.png"></div>\
                                    </li>';
                    $(lessonHtml).appendTo(".lesson-list");
                }
                $(".lesson").eq(0).addClass("select").removeClass("unselect");
                Course.lesson = $(".lesson").eq(0).children("span").attr("data-lesson");
                console.log("course-lesson", Course.lesson);
                Course.clickDeleteLessonEvent();
            }


            // --------3.刷新中间的会话列表
            Course.load();


            // --------4.改变右侧 iframe
            // 通知右边的iframe 改变代码内容
            window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
        },
        

        // ----------------------------帮助方法
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
        },
        formatString:function(message){
            message = "" + message;
            // 方法1，捕获异常
            try {
               // var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
              var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\n/g, "<br/>");
               return msg
            }
            catch(err){
                alert("消息组合格式有问题!");
                return;
            }
        },
        
        getudid:function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },
        getRandomNum:function(){
            //获取一个随机数
            var min = 0x1;
            var max = 0xffffffff;
            function getInstanceId() {                                      
                min = Math.ceil(min);
                max = Math.floor(max);
                return (Math.floor(Math.random() * (max - min + 1)) + min).toString(16);
            }  

            var lesson = getInstanceId();
            return lesson;
        }
    }
    Course.init();
    
    // 上传操作
    QiniuForUpload();   

    
    // 键盘监听操作
    var KeyBoard = {
        key:false,
        init:function(){
            //键盘操作
            document.addEventListener("keydown", function(event){
                // console.log("keydown:",event);
                var e = event || window.event;
                var k = e.keyCode || e.which;
                
                if(e.keyCode == 13 && e.ctrlKey){
                    console.log("按了组合键");
                    KeyBoard.ctrlEnterKeyPress();
                    return
                }
                if(k == 65 || k==66 || k==80 || k==76 || k==81 || k==84 || k==77 || k==68 || k==67 || k==83 || k==86){
                    if ($(".lesson-input-view").css('display') == "flex") {
                        return;
                    }
                    if ($(".message-types").css('display') == "flex") {
                        return;
                    }
                    if ($(".audio-types").css('display') == "flex") {
                        return;
                    }
                    if ($(".message-input-view").css('display') == "flex") {
                        return;
                    }
                    if ($(".problem-types").css('display') == "flex") {
                        return;
                    }
                    if ($(".problem-view").css('display') == "flex") {
                        return;
                    }
                    if ($(".problem-blank-view").css('display') == "flex") {
                        return;
                    }
                    if (!$(".lesson").length) {
                        Common.dialog("请先添加一个小节");
                        return;
                    } 
                }
                console.log(k);
                if(k == 65 || k==66 || k==80 || k==76 || k==81 || k==84 || k==77 || k==68 || k==67 || k==83 || k==86){
                    // 键盘按键触发弹框
                    console.log("keyCode:",k);
                    console.log("courseIndex:",Course.index);

                    KeyBoard.key = false;
                    Course.index = -1;            //键盘快捷键操作，只能在消息末尾追加消息
                    Course.chatRefresh = true;
                    KeyBoard.dealKeyCode(k);
                } 
            })
        
            // document.addEventListener("keyup", function(event){
            //     var e = event || window.event;
            // 　　 var k = e.keyCode || e.which;
            //     // console.log("keyup:",event);
            //     if(!KeyBoard.key){
            //         $(".message-input-view textarea").focus();
            //         KeyBoard.key = true;
            //         var values = $(".message-input-view textarea").val();
            //         $(".message-input-view textarea").val(values.substr(0, values.length - 1))
            //         if (k == 80) {
            //             $("#uploadImg").click();
            //         }
            //     }else{
            //         // $(".message-input-view textarea").blur(function(){
            //         //     KeyBoard.key = true
            //         // });
            //     }
            // })
        },
        dealKeyCode:function(k){
            switch(k) {
        　　　　 case 65:
                    //文本(A)
                    KeyBoard.clickEvent("text", "文本")
            　　　　break;
        　　　　 case 66:
                    //按钮文本(B)
                    KeyBoard.clickEvent("action", "按钮文本")
            　　　　break;
                case 80:
                    //图片(P)
                    KeyBoard.clickEvent("photo", "图片")
            　　　　break;
                case 86:
                    //视频(V)
                    KeyBoard.clickEvent("video", "视频")
            　　　　break;
        　　　　  case 76:
                    //链接文本(L)
                    KeyBoard.clickEvent("link-text", "链接文本")
            　　　　break;
                case 81:
                    //习题程序媛(Q)
                    KeyBoard.clickEvent("girl", "程序媛选择题")
            　　　　break;
        　　　　 case 84:
                    //习题自适应(T)
                    KeyBoard.clickEvent("adapt", "自适应选择题")
            　　　　break;
                case 77:
                    //大段文本(M)
                    KeyBoard.clickEvent("manytext", "大段文本")
                    break;
                case 68:
                    //大段代码文本(D)
                    KeyBoard.clickEvent("manyCode", "大段代码文本")
            　　　　break;
                case 67:
                    // 填空题(C)
                    KeyBoard.clickEvent("blank", "填空题")
                    break;
                case 83:
                    // 顺序题(S)
                    KeyBoard.clickEvent("sequence", "顺序题");
                    break;
        　　 }
        },
        clickEvent:function(tag, tagHtml){
            var tag = tag;
            var tagHtml = tagHtml;
            if (tag == "action" && !$(".message").length) {
                Common.dialog("请先输入一条消息");
                return;
            }
            //增加习题判断
            var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];
            var dic = {};       //当前消息
            var originIndex = parseInt(Course.index);

            //当前消息加动作按钮
            if (originIndex == -1) {
                //最后一条消息添加 action
                dic = array[array.length - 1];
            }else{
                // 当前消息添加 action
                dic = array[originIndex];
            }
            if (tag == "action" && dic.exercises == true) {
                Common.dialog("这是习题，无法添加 action 文本");
                return;
            }
            if (tag == "girl" || tag == "adapt" || tag == "blank" || tag == "sequence") {
                // 选择题、填空题
                // KeyBoard.clickProblemEvent(tag, tagHtml);
                Course.openInputView(tag, tagHtml);
            }else{
                Course.openInputView(tag, tagHtml);
            }
            $(".message-types").css({display:'none'});
        },
        clickProblemEvent:function(tag, tagHtml){
            var tag = tag,
                tagHtml = tagHtml;
            
            // 习题是否隐藏
            $(".isHideView>img").removeClass("select");
            $(".isHideView>img").attr({src:"../../statics/images/icon-unselect.png"})

            if (tag == "blank") {
                // 填空题
                $(".problem-blank-view").css({display:'flex'})
                return;
            }

            $(".problem-question-view").css({display:'flex'})
            $(".problem-question-view .problem-header .type").html(tagHtml);

            if (tag == "adapt") {
                //打开自适应题框
                $(".problem-girl-content-view").hide();
                $(".problem-adapt-content-view").show();
            }else{
                //打开程序媛题框
                $(".problem-girl-content-view").show();
                $(".problem-adapt-content-view").hide();
            }
            $(".problem-types").css({display:'none'});
        },
        inputTextareaFoucus:function(tag){
            var tags = ["text", "action", "photo", "video", "link-text"]
            if (tags.indexOf(tag) > -1) {
                console.log("聚焦");
                // $(".message-input-view textarea").focus();  //这种要配合 keyup 使用,否则按键字母会出现在输入框中
                setTimeout(function(){
                    $(".message-input-view textarea").focus(); //延迟聚焦，输入框不会出现按键内容
                    if(tag == "photo"){
                        $("#uploadImg").click();
                    }
                }, 500)
                
            }else{
                console.log("无法聚焦");
            }
        },
        ctrlEnterKeyPress:function(){
            if($(".problem-option-view").css('display') == 'flex'){
                // 自适应选项确定
                console.log("自适应选项确定---复合键");
                $(".option-submit").click();
                return;
            }
            if($(".problem-question-view").css('display') == 'flex'){
                // 程序媛选择题，自适应选择题确定
                console.log("程序媛选择题，自适应选择题确定---复合键")
                if($(".problem-girl-content-view").css('display') == 'block'){
                    // 程序媛
                    $(".problem-girl-content-view .problem-submit").click();
                }else if ($(".problem-adapt-content-view").css('display') == 'block'){
                    // 自适应
                    $(".problem-adapt-content-view .problem-submit").click();
                }
                return;
            }
            if($(".message-input-view").css('display') == "flex"){
                // 文本、图片、链接文本、按钮、音频，输入框中的确定按钮
                console.log("文本、图片、链接文本、按钮、音频，输入框中的确定按钮---复合键")
                $(".input-view .input-submit").click();
                return;
            }
        },
    }
    KeyBoard.init();


    //通过服务器向七牛存储大段文本的 HTML 文件
    function storeHtmlText(content, callback){
        var content = content;
        if (content.match(/<[a-zA-Z]+>/g)) {
        }else{
            content = content.replace(/\r\n/g, "<br/>");
            content = content.replace(/\n/g, "<br/>");
            content = content.replace(/\ /g, "&nbsp"); //替换 空格
            content = content.replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp");
        }

        var html = '<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><p>'+content+'</p></body></html>'
        $.ajax({
            type:"post",
            url:serverDomain + "/upload/html_file/",
            data:{
                html:html,
            },
            success:function(json){
                if (json.hasOwnProperty("url")) {
                    var link = json.url;
                    callback(link);
                }else{
                    callback('');
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
    }

    function __log(this_, e, data) {
        if (this_.html()) {
            var a = this_.html() + "\n" + e + " " + (data || '');
            this_.html(a);
        }else{
            var a = this_.html() + e + " " + (data || '');
            this_.html(a);
        }
        this_.animate({scrollTop:this_[0].scrollHeight}, 20);
    }
});
