define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
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
                        for (var i = 0; i < json.results.length; i++) {
                            var item = json.results[i];
                            item["open"] = true;
                            item["like"] = true;
                            item["like_number"] = 0;
                            
                            /*
                            // 1:Python 2:HTML5 3.CSS 4.JavaScript
                            // item.learn_extent.last_lesson
                            // 1:Python 2:HTML5 3.CSS 4.JavaScript
                            if(item.pk == 1){
                                localStorage.pythonSimpleIndex = item.learn_extent.last_lesson;
                            }else if(item.pk == 2){
                                localStorage.htmlSimpleIndex = item.learn_extent.last_lesson;
                            }else if(item.pk == 3){
                                localStorage.cssSimpleIndex = item.learn_extent.last_lesson;
                            }else if(item.pk == 4){
                                localStorage.jsSimpleIndex = item.learn_extent.last_lesson;
                            }
                            */
                        }

                        var html = ArtTemplate("courses-template", json.results);
                        $(".courses").html(html);

                        Page.clickEvent();
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
                localStorage.currentCourse = $(this).attr("data-category");
                localStorage.currentCourseIndex = $(this).attr("data-course-index");
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
