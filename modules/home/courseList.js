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

            // Page.load();

        },
        loadCourseInfo:function(){
            Common.isLogin(function(token){
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
                            Page.adjustData(json.results);
                        }
                        
                    },
                    error:function(xhr, textStatus){
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
            console.log(array);

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
        clickEvent:function(){
            $(".course").click(function(e){
                e.stopPropagation();
                if ($(this).hasClass('unopen')) {
                    // 未开放的课程，不能点击
                    return;
                }
                if ($(this).attr("data-status") == "finish") {
                    Common.dialog("当前课程已经学完了");
                    return;
                }
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

                // if ($(this).attr("data-category") == "html_simple") {
                //     // 判断此课程的上次学习进度的下标
                //     var htmlSimpleIndex = 1;
                //     if (localStorage.htmlSimpleIndex) {
                //         htmlSimpleIndex = localStorage.htmlSimpleIndex;
                //     }

                //     Page.requestData(localStorage.currentCourse, htmlSimpleIndex);
                // }
                
                /*
                // 更改浏览器地址
                var category = null;
                if($(this).attr("data-category") == "html_simple"){
                    category = "html_simple";
                }else if ($(this).attr("data-category") == "css_simple") {
                    category = "css_simple";
                }else if ($(this).attr("data-category") == "javascript_simple") {
                    category = "javascript_simple";
                }else if ($(this).attr("data-category") == "python_simple") {
                    category = "python_simple";
                }
                var url = window.location.href.split('?')[0] + "?category=" + category;
                history.pushState({"category":category}, null, url);
                */
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
    }

    Page.init();

});
