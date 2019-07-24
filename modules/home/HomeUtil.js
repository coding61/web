define(function(require, exports, module) {
    var Common = require('common/common.js');
    var ArtTemplate = require("libs/template.js");
    var Utils = require('common/utils.js?v=1.2');
    
    var EmoticonImgs = {
        "error":[
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/1.gif-500x281",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/2.jpg-1000x1000",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/3.gif-128x128",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/4.gif-427x407",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/5.gif-244x225",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/6.gif-200x200",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/7.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/8.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/9.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/10.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/11.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/12.gif-143x159",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/13.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/14.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/15.gif-300x293",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/16.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/17.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/18.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/19.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/20.gif-500x281",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/21.gif-220x220",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/22.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/23.jpg-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/24.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/25.jpg-440x418",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/26.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/27.jpeg-1200x1236",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/28.jpg-1000x1000",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/29.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/30.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/error/31.gif-300x300"
        ],
        "encourage":[
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/1.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/2.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/3.gif-451x431",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/4.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/5.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/6.gif-600x600",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/7.gif-388x345",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/8.jpg-134x111",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/9.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/10.gif-200x200",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/11.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/12.gif-250x250",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/13.gif-301x301",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/14.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/15.gif-333x333",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/16.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/17.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/18.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/19.gif-296x283",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/20.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/21.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/22.gif-456x462",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/23.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/24.gif-335x335",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/25.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/26.gif-240x240",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/27.gif-300x300",
            "https://resource.bcgame-face2face.haorenao.cn/emoticon_imgs/encourage/28.gif-320x320"
        ]
    }
    // ---------------------4.帮助方法
    var Util = {
        link:"",
        linkType:"",

        // 登录，注册
        phone:"",
        code:"",
        password:"",
        chooseAvatar:"https://static1.bcjiaoyu.com/avatars/1.png",

        balance:"",       //奖学金记录中所使用的到的余额

        waitTime:Common.getQueryString("wt")?10:1000,
        messageTime:Common.getQueryString("mt")?20:2000,

        voiceState:"open",           //默认声音是打开, open/close

        currentCatalogIndex:0,       //当前目录的下标
        currentCountryCode:"+86",    //国家代码
        

        openLink:function(link){
            var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
            params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
            window.open(link, '_blank', params);
        },
        hasVideoStr:function(link){
            var array = ['.mp4', '.mov'];
            var hasVideoStr = false
            for (var i = 0; i < array.length; i++) {
                var item = array[i]
                if (link.indexOf(item) > -1) {
                    // link 字符串含有.mp4等字符串字样
                    hasVideoStr = true
                    break;
                }
            }
            return hasVideoStr
        },
        // 格式化字符串
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
        
        // 设置图片的高
        setMessageImgHeight:function(item){
            // 给消息中的图片设高
            if(item.img){
                // 给图片设高
                var url = item.img;
                var pW = $(".message.img").last().find(".msg-view").width() * 0.50;
                Common.getPhotoWidthHeight(url, function(width, height){
                    var pH = 100;
                    if (width && height) {
                        pH = pW * height / width;
                    }
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
                    var pH = 100;
                    if (width && height) {
                        pH = pW * height / width;
                    }
                    $(".message.img").first().find('img.msg').css({
                        height: pH + "px"
                    })
                    $(".message.img").first().find('.pre-msg').css({
                        height:pH + "px"
                    })
                })
            }
        },

        // 打开右边 iframe
        openRightIframe:function(tag){
            if (tag == "img") {
                $(".right-view>img").show();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if (tag == "courseList") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").show();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if (tag == "codeEdit") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").show();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if (tag == "codeCompile") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").show();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if(tag == "thirdSite"){
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").show();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if(tag == "bigImg"){
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").show();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if(tag == "codeCompileRN"){
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").show();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").hide();

            }else if(tag == "codeCompile"){
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").show();
                $(".right-view .iframe-scroll.activity").hide();

            }else if (tag == "activity") {
                $(".right-view>img").hide();
                $(".right-view .iframe-scroll.courseList").hide();
                $(".right-view .iframe-scroll.codeEdit").hide();
                $(".right-view .iframe-scroll.codeCompileRN").hide();
                $(".right-view .iframe-scroll.thirdSite").hide();
                $(".right-view .iframe-scroll.bigImg").hide();
                $(".right-view .iframe-scroll.codeCompile").hide();
                $(".right-view .iframe-scroll.activity").show();

            }

            //关闭右边工作区的 iframe
            $(".iframe-scroll .close>img").unbind('click').click(function(){
                Util.openRightIframe("img");
            })
            
            // 在窗口中打开右边的 iframe
            $(".iframe-scroll .close>.newopen").unbind('click').click(function(){
                var url = $(this).parents(".iframe-scroll").children("iframe").attr("src");
                window.open(url);
            })
        },

        // 钻石，经验，升级动画
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
            }, 250)
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

        // 更新个人信息
        updateInfo:function(json){
            var avatar = json.avatar?json.avatar.replace("http://", "https://"): "https://static1.bcjiaoyu.com/ChenPic.png";

            localStorage[Utils.LSStrings.avatar] = avatar     //记录用户的头像
            localStorage[Utils.LSStrings.owner] = json.owner
            localStorage[Utils.LSStrings.currentGrade] = json.grade.current_name;    //记录当前等级
            localStorage[Utils.LSStrings.currentExper] = json.experience;   //记录当前经验
            localStorage[Utils.LSStrings.currentZuan] = json.diamond;     //记录当前钻石

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
        },

        //调整团队信息的偏移量
        adjustTeaminfo:function(){
            var a = $(".header .icon4").offset().left;
            var b = $(".header .right-view").offset().left;
            var c = $(".header .team-info").width();
            $(".team-info").css({
                left: (a-b-c/2) + "px"
            })
        },

        //调整 app 二维码的偏移量
        adjustQrCode:function(){
            var a = $(".mobile-app").offset().left;
            var b = $(".mobile-app").width();
            var c = $(".qr-code-view").width();
            $(".qr-code-view").css({
                left:(a - (c-b)/2)+"px",
                display:'flex'
            })
        },

        //调整在线编辑器的偏移量
        adjustCodeEditorsOnline:function(){
            var a = $(".code-online").offset().left;
            var b = $(".code-online").width();
            var c = $(".code-online-editors").width();

            if ($(".code-online-editors").css("display") == "none") {
                $(".code-online-editors").css({
                    left:(a - (c-b)/2)+"px",
                    display:'flex'
                })
            }else{
                $(".code-online-editors").css({
                    left:(a - (c-b)/2)+"px",
                    display:'none'
                })
            }

        },

        // 课程进度相关
        courseProgressUI:function(){
            // 更新课程进度，
            //1.有默认课程，数据的时候，加载 2.选择课程的时候加载 
            if (localStorage[Utils.LSStrings.currentCourse]) {
                var total = parseInt(localStorage[Utils.LSStrings.currentCourseTotal]);
                var studyN = parseInt(localStorage[Utils.LSStrings.currentCourseIndex]);
                var unStudyN = total - studyN;

                var studyHtml = "";
                var unStudyHtml = "";
                for (var i = 0; i < studyN; i++) {
                    studyHtml += '<li class="study cp">\
                                    <img src="../../statics/images/cp1.png" alt="" />\
                                </li>'
                }
                //console.log(i);
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

        // 课程目录，语种列表初始化
        // 课程目录初始化
        courseCatalogsInit:function(response, callback){
            if (response && response.hasOwnProperty("catalogs")) {
                // 课程目录初始化
                var catalogHtml = "";
                // console.log(response["catalogs"]);
                for (var i = 0; i < response["catalogs"].length; i++) {
                    if (i == parseInt(localStorage[Utils.LSStrings.currentCourseIndex])) {
                        // 当前课节被选中
                        response["catalogs"][i]["select"] = true
                    }else{
                        response["catalogs"][i]["select"] = false
                    }
                }
                var catalogHtml = ArtTemplate("course-menu-list-template", response["catalogs"]);
                $(".course-menu-list").html(catalogHtml);

                $(".helps-view .course-menu").css({display:'flex'});
                if (callback) {
                    callback()
                }
                // Page.clickEvent();
            }else{
                $(".helps-view .course-menu").css({display:'none'});
            }
        },
        
        // 消息流
        loadLineHtml:function(item, index){
            var lineHtml = '<div class="sep-line" data-msgIndex="'+index+'"> \
                                <i class="line"></i>\
                                <span class="title">'+item.message+'</span>\
                            </div>';
            return lineHtml;
        },
        loadAnswerHtml:function(item, index){
            var avatar = Utils.getValue(Utils.LSStrings.avatar)? Utils.getValue(Utils.LSStrings.avatar) : "https://static1.bcjiaoyu.com/head1@3x.png";
            var answerHtml = '<div class="answer" data-msgIndex="'+index+'"> \
                                <div class="msg-view">\
                                    <span class="content">'+Util.formatString(item.message)+'</span> \
                                </div>\
                                <img class="avatar" src="'+avatar+'"/>\
                              </div>';
            return answerHtml;
        },
        getActionHtml:function(item){
            var actionHtml = "";
            if (item.hasAction) {
                // 新闻
                actionHtml = '<span class="btn-wx-auth bottom-animation notNews">暂时不看</span>\
                            <span class="btn-wx-auth bottom-animation nextNews">下一条</span>';
            }
            else if (item.type === "blankProblem" || item.type === "sequenceProblem" || item.type === "adaptProblem" || (item.tag && item.exercises)) {
                actionHtml = '<span class="btn-wx-auth beginExercise bottom-animation">开始答题</span>'
            }
            else if (item.action) {
                if (item.exercises == true) {
                    // 如果是选择题，（多按钮）
                    var optionHtml = "";
                    for (var j = 0; j < item.action.length; j++) {
                        var option = item.action[j];
                        optionHtml += '<span class="option unselect" data-index="'+j+'">'+option.content+'</span>'
                    }
                    actionHtml += optionHtml
                    actionHtml += '<span class="btn-wx-auth exercise">ok</span>';

                }else{
                    // 单按钮
                    if (item.action == "点击选择课程") {
                        actionHtml = '<span class="btn-wx-auth wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }else{
                        actionHtml = '<span class="btn-wx-auth bottom-animation">'+Util.formatString(item.action)+'</span>'
                    }
                }
            }
            return actionHtml;
        },
        getLoadingHtml:function(animate, before){
            // animate，是否有动画， before 是在之前还是之后
            var loadingWHtml = "";
            if (animate == true) {
                loadingWHtml = '<div class="loading-chat left-animation">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
            }else{
                loadingWHtml = '<div class="loading-chat">\
                                    <img src="../../statics/images/chat.gif" alt="">\
                                </div>';
            }
            if (before) {
                $(loadingWHtml).prependTo($(".messages"));
            }else{
                $(loadingWHtml).appendTo(".messages");
            }

            // $(".messages").animate({scrollTop:$(".messages")[0].scrollHeight}, 50);
        },

        // 向消息流中添加表情包
        addEmoticonMessage:function(tag, callback){
            var key = "";
            var item = null;
            if (tag === "error") {
                key = "error";
            }else if (tag === "encourage") {
                key = "encourage";
            }
            if (key) {
                // Math.floor(Math.random() * 10);    0~9之间的整数
                var imgs = EmoticonImgs[key];
                var i = Math.floor(Math.random() * imgs.length);
                item = {"img":imgs[i], "type":"emoticon", "detailType":key};
                console.log(imgs[i]);
                // var itemDic = {animate:false, imgI:imgI, item:item, msgIndex:index}
                // var questionHtml = ArtTemplate("message-img-template", itemDic);
                // $(questionHtml).appendTo(".messages");
            }
            if (callback) {
                //表情包需要存储，因此加个回调，原函数自己去存储
                callback(item);
            }
        },

        
    }

    exports.Util = Util;
});