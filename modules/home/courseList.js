define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        init:function(){

            Page.load();

        },
        load:function(){
            var array = [
                {
                    "category":"html_simple",
                    "title":"HTML5",
                    "img":"../../statics/images/course/c2.png",
                    "desc":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。"
                },
                {
                    "category":"css_simple",
                    "title":"CSS",
                    "img":"../../statics/images/course/c4.png",
                    "desc":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。"
                },
                {
                    "category":"javascript_simple",
                    "title":"JavaScript",
                    "img":"../../statics/images/course/c3.png",
                    "desc":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。"
                },
                {
                    "category":"python_simple",
                    "title":"Python",
                    "img":"../../statics/images/course/c1.png",
                    "desc":"其主要的目标是将互联网语义化，一边更好地被人类和机器阅读。"
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
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "http://free.bcjiaoyu.com",
                scope = 'snsapi_login';

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            $(".course").click(function(){
                if ($(this).hasClass("select")) {
                    $(this).removeClass("select");
                }else{
                    $(".course").removeClass("select");
                    $(this).addClass("select");
                }
                
                //存储当前学习的课程题目
                localStorage.currentCourse = $(this).attr("data-category");

                // if ($(this).attr("data-category") == "html_simple") {
                //     // 判断此课程的上次学习进度的下标
                //     var htmlSimpleIndex = 1;
                //     if (localStorage.htmlSimpleIndex) {
                //         htmlSimpleIndex = localStorage.htmlSimpleIndex;
                //     }

                //     Page.requestData(localStorage.currentCourse, htmlSimpleIndex);
                // }
                
                // 更改浏览器地址
                var url = window.location.href + "?category=123";
                history.pushState({}, null, url);
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
