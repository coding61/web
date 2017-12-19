define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js?v=1.1');
    var Utils = require('common/utils.js');
    ArtTemplate.config("escape", false);

    var Course = {
        index:-1,  //当前点的那个消息后面的加号、或者减号, 默认-1,点了底部的加号
        lesson:1,  //当前所选的课节下标
        init:function(){

            Course.load();              //加载中间的会话列表
            $(".lesson-list").html("");
            Course.initLessonData();    //加载课程节数据

        },
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
        openInputView:function(tag, tagHtml){
            $(".msg-header .type").html(tagHtml);
            $(".msg-header .type").attr({tag:tag});
            if (tag == "photo") {
                //图片消息
                $(".input-view textarea").attr({placeholder:"图片消息地址"});
                $(".input-view input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").hide();
                $(".input-view #upload-container #uploadImg").css({display:'inline-block'});

                $("#audio-record-view").hide();
                $("#log").show();
            }else if (tag == "text") {
                //纯文本
                $(".input-view textarea").attr({placeholder:"文本消息内容"});
                $(".input-view input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
            }else if (tag == "link-text") {
                //链接文本
                $(".input-view textarea").attr({placeholder:"链接消息内容"});
                $(".input-view input").show();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
            }else if (tag == "action") {
                //action 文本
                $(".input-view textarea").attr({placeholder:"回复按钮上的文字"})
                $(".input-view input").hide();
                $(".input-view #upload-container").hide();
                $("#audio-record-view").hide();
                $("#log").hide();
            }else if (tag == "record") {
                //录制音频
                $(".input-view textarea").attr({placeholder:"消息音频地址"});
                $(".input-view input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").hide();
                $(".input-view #upload-container #uploadImg").hide();

                $("#audio-record-view").show();
                $("#log").show();
            }else if (tag == "local") {
                //本地音频
                $(".input-view textarea").attr({placeholder:"消息音频地址"});
                $(".input-view input").hide();
                $(".input-view #upload-container").show();

                $(".input-view #upload-container #uploadAudio").css({display:'inline-block'});
                $(".input-view #upload-container #uploadImg").hide();

                $("#audio-record-view").hide();
                $("#log").show();
            }
            $(".message-input-view").css({display:'flex'});
        },
        openAudioInputView:function(tag, tagHtml){
            $(".msg-header .type").html(tagHtml);
            $(".msg-header .type").attr({tag:tag});
            if (tag == "record") {
                
            }else if (tag == "local") {
                
            }
            $(".audio-input-view").css({display:'flex'});
        },
        showContentInView:function(arr, i){
            var item = arr[i];
            var questionHtml = "",
                answerHtml = "";

            var itemDic = {index:i, item:item};
            if (item.link) {
                // 2.1是链接消息
                item.message = Course.formatString(item.message);
                questionHtml = ArtTemplate("message-link-template", itemDic);
            }else if(item.img){
                // 2.2是图片消息
                questionHtml = ArtTemplate("message-img-template", itemDic);
            }else{
                // 2.3是文本消息
                item.message = Course.formatString(item.message);
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
        refreshAddMessage:function(tag){
            // 当前元素后面的元素 index+1
            var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];
            var originIndex = Course.index == -1 ? parseInt(array.length-2):parseInt(Course.index)
            for (var i = originIndex+1; i < array.length-1; i++) {
                // 更改当前元素后面所有的 data-index, +1
                $(".message[data-index="+i+"]").attr({"data-index":parseInt(i+1)});
                $(".answer[data-index="+i+"]").attr({"data-index":parseInt(i+1)});
            }

            // 当前元素的处理
            if (tag == "action") {
                // 当前元素后添加一个 action 用户回复消息
                var dic1 = {index:originIndex, item:array[originIndex]};
                var answerHtml = ArtTemplate("answer-text-template", dic1);
                $(".message[data-index="+originIndex+"]").after(answerHtml);

            }else{
                // 当前元素后面追加一个消息
                var dic1 = {index:originIndex+1, item:array[originIndex+1]};
                var questionHtml = ""
                if (tag == "text") {

                    questionHtml = ArtTemplate("message-text-template", dic1);
                }else if (tag == "photo") {
                    questionHtml = ArtTemplate("message-img-template", dic1)
                }else if (tag == "link-text") {
                    questionHtml = ArtTemplate("message-link-template", dic1);
                }
                $(".message[data-index="+originIndex+"]").after(questionHtml);

                if (array[originIndex].img) {
                    try {
                        Course.setImgHeight(array[originIndex].img);
                    }
                    catch(err){
                         Common.dialog("图片格式不合法");
                    }
                }
            }


        },
        refreshReduceMessage:function(){
            // 当前元素删除
            $(".message[data-index="+Course.index+"]").remove();
            $(".answer[data-index="+Course.index+"]").remove();

            // 当前元素后面的元素 index-1
            var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];
            for (var i = Course.index+1; i < array.length+1; i++) {
                // 更改当前元素后面所有的 data-index, +1
                $(".message[data-index="+i+"]").attr({"data-index":parseInt(i-1)});
                $(".answer[data-index="+i+"]").attr({"data-index":parseInt(i-1)});
            }
        },
        clickEvent:function(){
            //---------------------------中间的消息列表的公共处理事件
            // console.log(1);
            // 清空数据重来
            $(".chat .add .reset").unbind('click').click(function(){
                // 重置整个课程数据为空
                Common.bcAlert("当前课程是否已完全编辑完？您保存好数据了吗？是否要开始一个新课程？", function(){
                    var totalDic = {};
                    localStorage.CourseData = JSON.stringify(totalDic);

                    Course.init();  //刷新页面
                    window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
                })
                
            })
            // 打开类型选择框
            $(".chat .add .left-add").unbind('click').click(function(){
                Course.index = -1;
                if (!$(".lesson").length) {
                    Common.dialog("请先添加一个小节");
                    return;
                }
                $(".message-types").css({display:'flex'});
            })
            
            // 打开消息输入框
            $(".message-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag");
                var tagHtml = $(this).html();
                if (tag == "action" && !$(".message").length) {
                    Common.dialog("请先输入一条消息");
                    return;
                }
                Course.openInputView(tag, tagHtml);
                $(".message-types").css({display:'none'});

            })
            
            // 关闭消息输入框
            $(".msg-header img").unbind('click').click(function(){
                $(".message-input-view").css({display:"none"});
                $(".audio-input-view").css({display:"none"});
            })
            
            // 确认添加内容
            $(".input-view .input-submit").unbind('click').click(function(){
                // 提交内容
                var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];

                // var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
                var dic = {};       //当前消息
                var originIndex = parseInt(Course.index);

                var tag = $(".msg-header .type").attr("tag");
                if (tag == "action") {
                    //当前消息加动作按钮
                    if (originIndex == -1) {
                        //最后一条消息添加 action
                        dic = array[array.length - 1];
                        dic["action"] = $(".input-view textarea").val();
                    }else{
                        // 当前消息添加 action
                        dic = array[originIndex];
                        dic["action"] = $(".input-view textarea").val();
                    }
                }else if(tag == "record" || tag == "local"){
                    //当前消息加音频
                    dic = array[originIndex];
                    dic["audio"] = $(".input-view textarea").val();
                }else if (tag == "photo") {
                    //新增图片
                    dic["img"] = $(".input-view textarea").val();
                    if (originIndex == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(originIndex+1, 0, dic);  
                    }
                }else if (tag == "text"){
                    //新增文本
                    dic["message"] = $(".input-view textarea").val();
                    if (originIndex == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(originIndex+1, 0, dic);
                    }
                }else if (tag == "link-text") {
                    //新增链接文本
                    dic["message"] = $(".input-view textarea").val();
                    dic["link"] = $(".input-view input").val();
                    if (originIndex == -1) {
                        //最后一条消息
                        array.push(dic);
                    }else{
                        //当前消息之后
                        array.splice(originIndex+1, 0, dic);
                    }
                }
                
                totalDic[Course.lesson] = array;
                localStorage.CourseData = JSON.stringify(totalDic);

                // localStorage.CourseMessageData = JSON.stringify(array);
                
                Course.load();  //1.刷新会话列表

                // 2:刷新页面
                // Course.refreshAddMessage(tag);
                
                // 隐藏输入框
                $(".message-input-view").css({display:'none'});
                $(".input-view textarea").val("");
                $(".input-view input").val("");
                $("#log").html("");

                // 滚动到最底部
                $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
                
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值，
                // jsonCourse.window.setEditorValue();                   // 传递值，

                Course.clickDeleteEvent();

            })
            
            // 导出课程数据
            $("#export").unbind('click').click(function(){
                // var content = localStorage.CourseMessageData;
                // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    
                var content = JSON.prase(localStorage.CourseData)
                var blob = new Blob([content], {type:"application/json;charset=utf-8"});
                saveAs(blob, "course.json");//saveAs(blob,filename)
            })

            //-------------音频相关
            //音频类型点击
            $(".audio-types li").unbind('click').click(function(){
                var tag = $(this).attr("data-tag");
                var tagHtml = $(this).html();
                if (tag == "record") {
                    //1.初始化录音环境
                    // Utils.audioInit();
                }
                Course.openInputView(tag, tagHtml);                
                // Course.openAudioInputView(tag, tagHtml);
                $(".audio-types").css({display:'none'});
            })
            //开始录制
            $("#audio-record-start").unbind('click').click(function(){
                //2.开始录制
                // Utils.startRecord($(this));
            })
            //结束录制
            $("#audio-record-stop").unbind('click').click(function(){
                //3.结束录制
                // Utils.stopRecord($(this));
            })
            
            Course.clickDeleteEvent();
            
        },
        clickDeleteEvent:function(){
            //---------------------------消息的处理事件(追加消息，删除消息，添加音频)
            // 删除消息内容
            $(".message .reduce").unbind('click').click(function(){
                var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
                var array = totalDic[Course.lesson]?totalDic[Course.lesson]:[];

                // var array = localStorage.CourseMessageData?JSON.parse(localStorage.CourseMessageData):[];     //存放所有消息
                Course.index = $(this).parents(".message").attr("data-index");

                var index = Course.index;
                index = parseInt(index);
                array.splice(index, 1);  //删除当前元素 数据

                totalDic[Course.lesson] = array;
                localStorage.CourseData = JSON.stringify(totalDic);

                // localStorage.CourseMessageData = JSON.stringify(array);
                
                // 方法1:刷新页面
                Course.load();

                // 方法2:刷新页面
                // Course.refreshReduceMessage();
                
                window.frames["jsonCourse"].postMessage('json', '*'); // 传递值
            })

            // 消息后面添加消息
            $(".message .left-add").unbind('click').click(function(){
                $(".message-types").css({display:'flex'});
                Course.index = $(this).parents(".message").attr("data-index");
            })

            //消息录音类型
            $(".message .audio").unbind('click').click(function(){
                $(".audio-types").css({display:'flex'});
                Course.index = $(this).parents(".message").attr("data-index");
            })
            //播放音频
            $(".message .audio-play").unbind('click').click(function(){
                var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
                if (url) {
                    Common.playMessageSoun2(url);  //播放音频
                }
            })

        },
        initLessonData:function(){
            
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            for(var key in dic){
                var lessonHtml = ""
                if (key == Course.lesson) {
                    //1节
                    lessonHtml += '<li class="select lesson">'
                }else{
                    lessonHtml += '<li class="unselect lesson">'
                }
                var str = "第"+key+"节";
                lessonHtml += '<span data-lesson="'+key+'">'+str+'</span>'
                                +'<img src="../../statics/images/editCourse/reduce.png">'
                            +'</li>';
                $(lessonHtml).appendTo(".lesson-list");
            }

            Course.clickLessonEvent();

        },
        clickLessonEvent:function(){
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
                                +'<img src="../../statics/images/editCourse/reduce.png">'
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
            $(".lesson img").unbind('click').click(function(e){
                e.stopPropagation();
                var this_ = $(this);
                Common.bcAlert("您是否确定要删除本小节数据？", function(){
                    Course.newDeleteLesson(this_);
                })
            })
        },
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
                        +'<img src="../../statics/images/editCourse/reduce.png">'
                        +'</li>';
            $(lessonHtml).appendTo(".lesson-list");
            Course.clickDeleteLessonEvent();
            
            // --------2.改变存储数据
            // 存储节数字数据
            var key = String(parseInt(count+1));
            var dic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            dic[key] = [];
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
                                        <img src="../../statics/images/editCourse/reduce.png">\
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
                    filename: filename,
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
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png,jpeg"},
            ]
        },
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
                    __log("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    $(".input-view textarea").val(json.private_url);
                    __log("上传完成")
               },
               'Error': function(up, err, errTip) {
                    // Common.dialog("上传失败");
                    __log("上传失败")
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

    Course.init();

    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadAudio',                     //上传选择的点选按钮，**必需**
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
                    filename: filename,
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
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "audio files", extensions : "mp3,wav"},
            ]
        },
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
                    __log("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    $(".input-view textarea").val(json.private_url);
                    __log("上传完成")
               },
               'Error': function(up, err, errTip) {
                    __log("上传失败")
                    // Common.dialog("上传失败");
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

    function __log(e, data) {
        if (log.innerHTML) {
            log.innerHTML += "\n" + e + " " + (data || '');
        }else{
            log.innerHTML += e + " " + (data || '');
        }
        $("#log").animate({scrollTop:$("#log")[0].scrollHeight}, 20);
    }
});
