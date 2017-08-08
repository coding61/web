define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        array:[],
        init:function(){
            
            // 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {  
                var a = e.data;   
                if(a == "loadCourses"){
                    console.log(3232);
                    Page.loadCourseInfo();
                }
            }, false); 

            Common.isLogin(function(token){
                if (token == "null") {
                    return;
                }
                console.log(3131);
                Page.loadCourseInfo();
            })
            // Page.load();
            // Page.loadCourseInfo();

        },
        loadCourseInfo:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/course/courses/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        if (json.next && json.next != "") {
                            // 请求所有数据
                            Page.loadCourseInfo1(json.count);
                        }else{
                            if (json.results) {
                                Page.adjustData(json.results);
                            }else{
                                Page.adjustData(json);
                            }
                        }
                        
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
        loadCourseInfo1:function(num){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/course/courses/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        page_size:num
                    },
                    success:function(json){
                        
                        Page.adjustData(json.results);
                        
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
        adjustData:function(results){
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                item["like"] = true;
                item["like_number"] = 0;
            }
            var categoryArr = [];
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                if (categoryArr.indexOf(item.profession) == -1) {
                    categoryArr.push(item.profession);
                }
            }
            // console.log(categoryArr);
            
            var array = [];
            for (var i = 0; i < categoryArr.length; i++) {
                var category = categoryArr[i];
                var categoryCourses = [];
                for (var j = 0; j < results.length; j++) {
                    var item = results[j];
                    if (item.profession == category) {
                        categoryCourses.push(item);
                    }
                }
                var dic = {"category":category, courses:categoryCourses};
                array.push(dic);
            }
            // console.log(array);

            var html = ArtTemplate("courses-template", array);
            $(".courses").html(html);

            Page.clickEvent();
        },
        load:function(){
            // status， 用户学习课程进度状态；open：课程是否开放；like：用户是否想学该课程；like_number:想学该课程的人数
            var array = [
                {
                    "pk":"html_simple",
                    "name":"HTML5",
                    "images":"../../statics/images/course/c2.png",
                    "content":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。",
                    "learn_extent":{
                        "status":"processing",
                    },
                    "open":true,
                    "like":true, 
                    "like_number":2056        
                },
                {
                    "pk":"css_simple",
                    "name":"CSS",
                    "images":"../../statics/images/course/c4.png",
                    "content":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。",
                    "learn_extent":{
                        "status":"unbegin",
                    },
                    "open":true,
                    "like":true, 
                    "like_number":2056    
                },
                {
                    "pk":"javascript_simple",
                    "name":"JavaScript",
                    "images":"../../statics/images/course/c3.png",
                    "content":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。",
                    "learn_extent":{
                        "status":"unbegin",
                    },
                    "open":false,
                    "like":true, 
                    "like_number":2056    
                },
                {
                    "pk":"python_simple",
                    "name":"Python",
                    "images":"../../statics/images/course/c1.png",
                    "content":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。",
                    "learn_extent":{
                        "status":"unbegin",
                        "last_lesson":0
                    },
                    "open":false,
                    "like":false, 
                    "like_number":3056    
                }
            ]
            var html = ArtTemplate("courses-template", array);
            $(".courses").html(html);

            Page.clickEvent();
        },
        requestData:function(course, courseIndex){
            $.ajax({
                type:'get',
                url:"../../modules/common/data.json",
                success:function(json){
                    var data = json.course;
                    if (data && data.courseIndex) {
                        //如果此课程此小节消息存在
                        localStorage.data = JSON.stringify(data.courseIndex);
                        localStorage.index = 0;
                        localStorage.optionData = JSON.stringify(null);
                        localStorage.optionIndex = 0;
                    }else{
                        Common.dialog("课程还未开放");
                    }
                },
                error:function(xhr, textStatus){

                }
            });
        },
        updateExtent:function(course, courseIndex){
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
        clickEvent:function(){
            $(".course").click(function(e){
                e.stopPropagation();
                if ($(this).hasClass('unopen')) {
                    // 未开放的课程，不能点击
                    return;
                }
                if ($(this).attr("data-status") == "finish") {
                    // Common.dialog("当前课程已经学完了");
                    // return
                    var this_ = $(this);

                    Common.bcAlert("你是否确定要再学一遍?", function(){
                        // 更改服务器进度
                        var course = this_.attr('data-category');
                        Page.updateExtent(course, 0);

                        this_.attr({"data-status":"processing"});
                        this_.find(".status").attr({src:"../../statics/images/course/icon2.png"})
                        this_.attr({"data-course-index":0});
                        
                        localStorage.currentCourse = this_.attr("data-category");            //当前课程
                        localStorage.currentCourseIndex = this_.attr("data-course-index");   //当前课程节下标
                        localStorage.currentCourseTotal = this_.attr("data-course-total");    //当前课程总节数
                        window.parent.postMessage("resetcurrentCourse", '*');

                    })
                }else if($(this).attr("data-status") == "processing"){
                    var this_ = $(this);
                    Common.bcAlert("此课程已经开始学习，请选择重新开始学习，还是继续上次学习？", function(){
                        Util.restartStudy(this_);
                    }, function(){
                        Util.continueStudy(this_);
                    }, "重新开始", "继续上次");
                    
                    /*
                    if ($(this).hasClass("select")) {
                        // $(this).removeClass("select");
                    }else{
                        $(".course").removeClass("select");
                        $(this).addClass("select");
                    }
                    
                    //存储当前学习的课程题目
                    // localStorage.setItem("currentCourse", $(this).attr("data-category"));
                    localStorage.currentCourse = $(this).attr("data-category");            //当前课程
                    localStorage.currentCourseIndex = $(this).attr("data-course-index");   //当前课程节下标
                    localStorage.currentCourseTotal = $(this).attr("data-course-total");    //当前课程总节数
                    window.parent.postMessage("currentCourse", '*');
                    */
                }else{
                    var this_ = $(this);
                    Util.continueStudy(this_);
                }

            })

            $(".like").click(function(e){
                e.stopPropagation();
                if ($(this).hasClass("select-like")) {
                    
                }else if ($(this).hasClass("unselect-like")) {
                    $(this).removeClass("unselect-like").addClass("select-like");
                    $(this).children("img").attr({src:"../../statics/images/zan-select.png"});
                    var n = parseInt($(this).attr("data-like-number")) + 1;
                    $(this).children('span').html(n);
                }
            })

            $(".category-courses").each(function(){
                if ($(this).find(".course[data-status=finish]").length == $(this).find(".course").length) {
                    // 已完成课程的个数等于该分类下所有的课程, 打开查看证书按钮
                    $(this).prev().find(".cer").show();
                }else{
                    $(this).prev().find(".cer").hide();
                }
            })

            $(".cer").click(function(){
                // 查看证书点击事件
            })
        },
        test:function(){
            console.log(123);
        }
    };

    var Util = {
        storeData:function(){
            // 存储实时数据的下标，数据源， 问题中信息下标
            localStorage.data = JSON.stringify(Page.data);
            localStorage.index = Page.index;
            localStorage.optionData = JSON.stringify(Page.optionData);
            localStorage.optionIndex = Page.optionIndex;
            localStorage.pagenum = Page.pagenum;
        },
        continueStudy:function(this_){
            if (this_.hasClass("select")) {
                // $(this).removeClass("select");
            }else{
                $(".course").removeClass("select");
                this_.addClass("select");
            }
            
            //存储当前学习的课程题目
            // localStorage.setItem("currentCourse", $(this).attr("data-category"));
            localStorage.currentCourse = this_.attr("data-category");            //当前课程
            localStorage.currentCourseIndex = this_.attr("data-course-index");   //当前课程节下标
            localStorage.currentCourseTotal = this_.attr("data-course-total");    //当前课程总节数
            window.parent.postMessage("currentCourse", '*');
        },
        restartStudy:function(this_){
            if (this_.hasClass("select")) {
                // $(this).removeClass("select");
            }else{
                $(".course").removeClass("select");
                this_.addClass("select");
            }
            
            // 更改服务器进度
            var course = this_.attr('data-category');
            Page.updateExtent(course, 0);

            this_.attr({"data-status":"processing"});
            this_.find(".status").attr({src:"../../statics/images/course/icon2.png"})
            this_.attr({"data-course-index":0});
            
            localStorage.currentCourse = this_.attr("data-category");            //当前课程
            localStorage.currentCourseIndex = this_.attr("data-course-index");   //当前课程节下标
            localStorage.currentCourseTotal = this_.attr("data-course-total");    //当前课程总节数
            window.parent.postMessage("resetcurrentCourse", '*');
        }
    }

    Page.init();

});
