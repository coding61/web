define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        array:[],
        this_:null,  //当前选中课程
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
            console.log(array);

            var html = ArtTemplate("courses-template", array);
            $(".courses").html(html);

            Page.clickEvent();
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
        getCourse:function(pk){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url: Common.domain + "/course/courses/"+pk+"/",
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
                        // 打开课程详情/目录弹框
                        $(".course-detail-catalogs-shadow-view").show();
                        $(".course-detail-view .top-view .avatar").attr({src:data.images});
                        $(".course-detail-view .top-view h3").html(data.name);
                        var version = data.my_version?data.my_version:data.version;
                        version = "版本:"+String(version);
                        $(".course-detail-view .top-view .version").html(version);
                        $(".course-detail-view .top-view .total-grow .number").html(data.total_experience);
                        $(".course-detail-view .top-view .total-zuan .number").html(data.total_diamond);
                        $(".course-detail-view .desc-view span").html(data.content);

                        
                        if (array["catalogs"]) {
                            var catalogHtml = "";
                            for (var i = 0; i < array["catalogs"].length; i++) {
                                var item = array["catalogs"][i];
                                catalogHtml += '<span class="catalog">'+parseInt(i+1)+'. '+item.title+'</span>'
                            }
                            $(".course-catalogs-view .catalogs").html(catalogHtml);
                        }else{
                            var errorHtml = '<span>暂无目录数据</span>';
                            $(".course-catalogs-view .catalogs").html(errorHtml);
                        }
                                
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
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
        searchCourse:function(name){
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
                    data:{
                        name:name
                    },
                    success:function(json){
                        $(".header .search-course input").val("");
                        $(".header .search-course").css({display:'none'});
                        $(".header .back").css({display:'flex'});
                        $(".courses").css({display:'none'});
                        $(".search-courses-list").css({display:'flex'});

                        var html = ArtTemplate("search-courses-list-template", json);
                        $(".search-courses-list").html(html);

                        Page.clickEvent();
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
            // 课程点击事件
            $(".course").unbind('click').click(function(e){
                e.stopPropagation();
                if ($(this).hasClass('unopen')) {
                    // 未开放的课程，不能点击
                    return;
                }
                
                // 获取课程详情信息
                var pk = $(this).attr("data-category");
                Page.this_ = $(this);
                Page.getCourse(pk);
            })
            
            // 想学习
            $(".like").unbind('click').click(function(e){
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

            $(".cer").unbind('click').click(function(){
                // 查看证书点击事件
            })
            
            // 搜索按钮点击
            $(".search-course .search").unbind('click').click(function(){
                // console.log($(".search-course input").val());
                Page.searchCourse($(".search-course input").val());

            })
            // 返回按钮点击
            $(".back").unbind('click').click(function(){
                $(".header .search-course").css({display:'flex'});
                $(".header .back").css({display:'none'});
                $(".courses").css({display:'flex'});
                $(".search-courses-list").css({display:'none'});

            })

            // 课程详情/目录点击
            $(".tabs .tab").unbind('click').click(function(){
                if ($(this).hasClass("course-detail")) {
                    $(".tab.select").removeClass("select").addClass("unselect");
                    $(this).removeClass("unselect").addClass("select");

                    $(".course-detail-view").show();
                    $(".course-catalogs-view").hide();
                }else if ($(this).hasClass("course-catalogs")) {
                    $(".tab.select").removeClass("select").addClass("unselect");
                    $(this).removeClass("unselect").addClass("select");

                    $(".course-detail-view").hide();
                    $(".course-catalogs-view").show();
                }
            })
            // 关闭课程弹框
            $(".close img").unbind('click').click(function(){
                $(".course-detail-catalogs-shadow-view").hide();
            })

            // 开始学习点击
            $(".bottom-view .start").unbind('click').click(function(){
                Page.beginResetContinueEvent();
            })

            // 继续学习点击
            $(".bottom-view .continue").unbind('click').click(function(){
                
            })
            // 重新学习点击
            $(".bottom-view .restart").unbind('click').click(function(){
                
            })
        },
        beginResetContinueEvent:function(){
            $(".course-detail-catalogs-shadow-view").hide();
            var this_ = Page.this_;
            var pk = this_.attr("data-category");
            if (this_.attr("data-status") == "finish") {
                Common.bcAlert("你是否确定要再学一遍?", function(){
                    // 学完了，重新学习
                    if (this_.attr("data-course-isAdapt") == "true") {
                        console.log("点了自适应课程", pk);
                        Page.resetAdaptCourse(this_, pk);
                    }else{
                        console.log("点了普通课程", pk);
                        Util.restartStudy(this_);
                    }
                })
            }else if(this_.attr("data-status") == "processing"){
                // 学习中，重新开始，继续
                Common.bcAlert("此课程已经开始学习，请选择重新开始学习，还是继续上次学习？", function(){
                    if (this_.attr("data-course-isAdapt") == "true") {
                        console.log("点了自适应课程", pk);
                        Page.resetAdaptCourse(this_, pk);
                    }else{
                        console.log("点了普通课程", pk);
                        Util.restartStudy(this_);
                    }
                }, function(){
                    Util.continueStudy(this_);
                }, "重新开始", "继续上次");
            }else{
                // 第一次学习
                if (this_.attr("data-course-isAdapt") == "true") {
                    console.log("点了自适应课程", pk);
                    Page.startAdaptCourse(this_, pk);
                }else{
                    console.log("点了普通课程", pk);
                    Util.continueStudy(this_);
                }
            }    
        },
        startAdaptCourse:function(this_, pk){
            Common.isLogin(function(token){
                if (token == "null") {
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/course/begin_mycourse/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        course:pk
                    },
                    success:function(json){
                        console.log(json);
                        Util.continueStudy(this_);
                    },
                    error:function(xhr, textStatus){
                        Page.errorDeal(xhr, textStatus, "start");
                    }
                })
            })
        },
        resetAdaptCourse:function(this_, pk){
            Common.isLogin(function(token){
                if (token == "null") {
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/course/reset_mycourse/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        course:pk
                    },
                    success:function(json){
                        console.log(json);
                        Util.restartStudy(this_);
                    },
                    error:function(xhr, textStatus){
                        Page.errorDeal(xhr, textStatus, "reset");
                    }
                })
            })
        },
        errorDeal:function(xhr, textStatus, flag){
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 400 || xhr.status == 403) {
                if(flag == "start"){
                    Util.continueStudy(Page.this_);
                }else{
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                }
                return;
            }else{
                Common.dialog('服务器繁忙');
                return;
            }
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
            localStorage.currentCourse = this_.attr("data-category");               //当前课程
            localStorage.currentCourseIndex = this_.attr("data-course-index");      //当前课程节下标
            localStorage.currentCourseTotal = this_.attr("data-course-total");      //当前课程总节数
            localStorage.currentCourseIsAdapt = this_.attr("data-course-isAdapt");  //当前课程是否是自适应课程
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
            
            localStorage.currentCourse = this_.attr("data-category");               //当前课程
            localStorage.currentCourseIndex = this_.attr("data-course-index");      //当前课程节下标
            localStorage.currentCourseTotal = this_.attr("data-course-total");      //当前课程总节数
            localStorage.currentCourseIsAdapt = this_.attr("data-course-isAdapt");  //当前课程是否是自适应课程
            window.parent.postMessage("resetcurrentCourse", '*');
        }
    }

    Page.init();

});
