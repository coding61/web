define(function(require, exports, module) {
    var Common = require('common/common.js');    
    var Utils = require('common/utils.js');
    var ArtTemplate = require("libs/template.js");
    ArtTemplate.config("escape", false);
    
    var HomeUtil = require('home/HomeUtil.js');
    HomeUtil = HomeUtil.Util;

    var Mananger = {
        timer:null,
        failDealEvent:function(xhr, textStatus){
            console.log(xhr, textStatus);
            Common.hideLoading();
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                localStorage.clear();
                // var url = "/html/login-reg/login.html?ret=/face2face/app/home/homeClass.html"
                // location.href=url;
                $(".phone-invite-shadow-view").show();
                return
            }
            else if (xhr.status == 400 || xhr.status == 403) {
                var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                if(msg == "添加奖励失败"){

                }else{
                    Common.dialog(msg);
                }
                return;
            }else if(xhr.status == 0){
                Common.dialog("网络未连接，请检查网络后重试。");
                return;
            }else if(xhr.status == 404){
                console.log(404);
            } else{
                Common.dialog('服务器繁忙');
                return;
            }
        },
        getPhoneCode:function(this_){
            // 获取验证码
            var phone = this_.find(".phone").children("input").val();
            var url = "";
            if (this_.find(".view-tag").html() == "注册") {
                url = "/userinfo/telephone_signup_request/"
            }else if (this_.find(".view-tag").html() == "绑定手机") {
                url = "/userinfo/bind_telephone_request/"
            }else if (this_.find(".view-tag").html() == "找回密码") {
                url = "/userinfo/reset_password_request/";
            }else if(this_.attr("data-tag") == "yzm"){
                url = "/userinfo/vcode_login_request/";
                phone = this_.find(".username").children("input").val();
            }
            if(phone == ""){
                Common.dialog("请输入手机号");
                return;
            }
            if (HomeUtil.currentCountryCode != "+86") {
                phone = HomeUtil.currentCountryCode + phone;
            }

            if (this_.find(".get-code").html() == "获取验证码") {
                // 发起获取验证码请求
                Common.isLogin(function(token){
                    $.ajax({
                        type:"get",
                        url:Common.domain + url,
                        data:{
                            telephone:phone
                        },
                        timeout:6000,
                        success:function(json){
                            if (json.status == 0) {
                                var time = 60;
                                Mananger.timer = setInterval(function(){
                                    --time;
                                    if (time > 0) {
                                        this_.find(".get-code").html(time+'s后重试');
                                    }else{
                                        this_.find(".get-code").html("获取验证码");
                                        clearInterval(Mananger.timer);
                                        Mananger.timer = null;
                                    }
                                },1000);
                            }else if (json.detail) {
                                Common.dialog(json.detail);
                            }else if (json.message) {
                                Common.dialog(json.message);
                            }
                        },
                        error:function(xhr, textStatus){
                            Mananger.failDealEvent(xhr, textStatus);
                        }
                    })
                })
            }
        },
        lockPhone:function(this_){
            // 绑定手机
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (veriCode == "") {
                Common.dialog("请输入验证码");
                return
            }
            if (password == "") {
                Common.dialog("请输入密码");
                return
            }

            if (phone == "") {
                Common.dialog("请输入手机号");
                return
            }
            if (HomeUtil.currentCountryCode != "+86") {
                phone = HomeUtil.currentCountryCode + phone;
            }
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/bind_telephone/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            Common.dialog("绑定成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        regPhone:function(phone, code, password, url, nickname, callback){
            if (HomeUtil.currentCountryCode != "+86") {
                phone = HomeUtil.currentCountryCode + phone
            }

            // 注册手机
            var dic ={
                telephone:phone,
                password:password,
                verification_code:code,
                name:nickname,
                avatar:url
            }

            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/signup/",
                    data:JSON.stringify(dic),
                    contentType:"application/json",
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            $(".choose-avatar-shadow-view").hide();
                            Utils.setValue(Utils.LSStrings.token, json.token);
                            $.cookie("Token", json.token, {path: "/"});
                            if (callback) {
                                callback();
                            }
                        }
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        resetPassword:function(this_){
            // 重置密码
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (veriCode == "") {
                Common.dialog("请输入验证码");
                return
            }
            if (password == "") {
                Common.dialog("请输入密码");
                return
            }

            if (phone == "") {
                Common.dialog("请输入手机号");
                return
            }
            if (HomeUtil.currentCountryCode != "+86") {
                phone = HomeUtil.currentCountryCode + phone
            }
            
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/reset_password/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            Common.dialog("修改密码成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        goLogin:function(this_, callback){
            // 登录
            var username = this_.find(".username").children("input").val(),
                password = this_.find(".password").children("input").val();
                vericode = this_.find(".password").children("input").val();

            if(username == ""){
                Common.dialog("请输入账号");
                return;
            }
            if(password == ""){
                Common.dialog("请输入密码");
                return;
            }
            if(vericode == ""){
                Common.dialog("请输入验证码");
                return;
            }

            var url = "",
                data = {};
            if (this_.attr("data-tag") == "invite") {
                url = "/userinfo/invitation_code_login/"
                data = {
                    code:username,
                    password:password
                }
            }else if (this_.attr("data-tag") == "phone") {
                if (HomeUtil.currentCountryCode != "+86") {
                    username = HomeUtil.currentCountryCode + username
                }
                url = "/userinfo/telephone_login/"
                data = {
                    telephone:username,
                    password:password
                }
            }else if(this_.attr("data-tag") == "yzm"){
                if (HomeUtil.currentCountryCode != "+86") {
                    username = HomeUtil.currentCountryCode + username
                }
                url = "/userinfo/vcode_login/"
                data = {
                    telephone:username,
                    verification_code:vericode
                }
            }

            Common.showLoading();
            $.ajax({
                type:"post",
                url:Common.domain + url,
                data:data,
                success:function(json){
                    Utils.setValue(Utils.LSStrings.token, json.token);
                    $.cookie("Token", json.token, {path: "/"});
                    if (callback) {
                        callback();
                    }
                },
                error:function(xhr, textStatus){
                    Mananger.failDealEvent(xhr, textStatus);
                }
            })
        },
        getCountryCode:function(callback){
            $.ajax({
                type:'get',
                url:"../../modules/common/country.json",
                success:function(json){
                    if (callback) {
                        // var html = ArtTemplate("country-option-template", json);
                        // $(".country-options").html(html);
                    
                        // Page.clickEventLoginRelated();
                        callback(json);
                    }
                    
                },
                error:function(xhr, textStatus){
                    Mananger.failDealEvent(xhr, textStatus);
                }
            })
        },

        updateExtent:function(course, courseIndex, catalog, callback){
            // 学习进度
            var data ={ 
                "course":course,
                "lesson":courseIndex
            }
            if (catalog) {
                data["types"] = "reset";
            }
            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/update_learnextent/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:data,
                    timeout:6000,
                    success:function(json){
                        if (callback) {
                            callback(json);
                        }
                    },
                    error:function(xhr, textStatus){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        $(".loading-chat").remove();
                        
                        if (callback) {
                            callback("fail");
                        }
                                    
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            localStorage.clear();
                            var url = "/html/login-reg/login.html?ret=/face2face/app/home/homeClass.html"
                            location.href=url;
                            return
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                            Common.dialog(msg);
                            return;
                        }else if(xhr.status == 0){
                            Common.dialog("网络未连接，请检查网络后重试。");
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
            })
        },
        addReward:function(course, courseIndex, chapter, growNum, zuanNum, tag, status, this_, optionYourAnswer, callback){
            // 奖励
            var dic = {
                course:course,
                lesson:courseIndex,
                chapter:chapter,
                experience_amount:growNum,
                diamond_amount:zuanNum,
                tag:tag,
                status:status
            }
            if (tag) {
                dic["answer"] = optionYourAnswer;
            }
            Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/add_reward/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:dic,
                    timeout:6000,
                    success:function(json){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        $(".loading-chat").remove();
                        //console.log(json);
                        if (json.status == -4) {
                            // 普通 action 按钮点击事件
                            if (callback) {
                                callback();
                            }
                            // Util.actionClickEvent(this_);
                            return;
                        }
                        if (json.diamond > Utils.getValue(Utils.LSStrings.currentZuan) && HomeUtil.waitTime == 1000 && HomeUtil.messageTime == 2000) {
                            // 打开钻石动画
                            Common.playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
                            HomeUtil.zuanAnimate(json.diamond);
                        }

                        if (json.experience > Utils.getValue(Utils.LSStrings.currentExper) && HomeUtil.waitTime == 1000 && HomeUtil.messageTime == 2000) {
                            // 打开经验动画
                            var growNum = parseInt(json.experience) - Utils.getValue(Utils.LSStrings.currentExper);
                            HomeUtil.growAnimate(growNum);
                        }
                        if(json.experience > Utils.getValue(Utils.LSStrings.currentExper) && Utils.getValue(Utils.LSStrings.currentGrade) != json.grade.current_name){
                            // 打开升级动画
                            setTimeout(function(){
                                Common.playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
                                HomeUtil.gradeAnimate();
                            }, 500);
                        }

                        // 更新个人信息
                        HomeUtil.updateInfo(json);
                        
                        if (callback) {
                            callback();
                        }
                        // 普通 action 按钮点击事件
                        // Util.actionClickEvent(this_);
                    },
                    error:function(xhr, textStatus){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        $(".loading-chat").remove();
                        if (callback) {
                            callback();
                        }
                        if (textStatus == "timeout") {
                            var msg = "Woops！网络请求超时，请点击按钮重试~";
                            Common.dialog(msg);
                            return;
                        }
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        startAdaptCourse:function(pk, callback){
            // 如果自适应课程，中 mycourse_json 是空的，则调该方法给他添加一套自己的课程
            // flag 用于区分是来自getCourseInfoWithPk 还是 getCourse
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
                        if(json.message === "添加成功"){
                            // 重新调 getCourse 接口
                            console.log("自适应课程添加成功,重新获取课程信息");
                            if (callback) {
                                callback();
                            }
                        }else{
                            Common.dialog("自适应课程添加失败");
                        }
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        getInfo:function(callback){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        console.log("debug:更新用户信息");
                        Common.hideLoading();
                        $(".phone-invite-shadow-view").hide();
                        
                        HomeUtil.balance=json.balance;
                        HomeUtil.updateInfo(json);     //更新用户信息
                        HomeUtil.courseProgressUI();   //更新课程进度
                        
                        if (callback) {
                            callback(json);
                        }
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        getCourse:function(course, callback){
            //网页每次刷新的时候，更改数据源，Page.data
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url: Common.domain + "/course/courses/"+course+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(data){
                        if(callback){callback(data);}
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },

        // ------------------课程数据帮助方法
        // 调整课程数据
        adjustCourseData:function(data, actionText, catalogChange, clickEventCB, callback, tag){
            /*
            data:请求到的课程详情数据
            actionText:用于存储回复信息(开始学习，重新学习这种) actionText：有就传，没有传空，在这里并没有用到。
            catalogChange:是否点了目录引起的课程刷新
            clickEventCB:homeClass.js中的 Page.clickEvent();
            callback:getCourseInfoWithPk 中的下一节课程信息流加载、getCourse 中的当前数据源的刷新及加载缓存信息流
            tag:getCourse(刷新缓存课程信息流)、getCourseInfoWithPk(正常请求课程数据), tag 不传默认走、getCourseInfoWithPk
            */
            // 捕获异常
            try {
                if(Utils.getValue(Utils.LSStrings.token) && data.iszishiying){
                    //自适应
                    if(!data.mycourse_json || data.mycourse_json == ""){
                        // 添加自适应课程
                        console.log("添加自适应课程:getCourseInfoWithPk");
                        if (callback) {
                            callback("fail");
                        }
                        // Mananger.startAdaptCourse(course, "getCourseInfoWithPk", actionText, catalogChange);
                        return;
                    }
                    var array = JSON.parse(data.mycourse_json);
                    $(".look-learn-result").show();
                    Utils.setValue(Utils.LSStrings.currentCourseIsAdapt, data.iszishiying);
                }else{
                    //普通
                    if(!data.json || data.json == ""){
                        $(".btn-wx-auth").attr({disabledImg:false});
                        Common.dialog("课程还未开放，敬请期待");
                        $(".loading-chat").remove();
                        return;
                    }
                    var array = JSON.parse(data.json);
                    $(".look-learn-result").hide();
                }
            }
            catch(err){
                // console.log(err);
                $(".btn-wx-auth").attr({disabledImg:false});
                $(".loading-chat").remove();
                alert("数据格式有问题!");
                return;
            }

            // 记录总课节数，展示进度用，记录课程名称，发证用, 记录课程 tag，分享用
            Utils.setValue(Utils.LSStrings.currentCourseTotal, data.total_lesson);
            Utils.setValue(Utils.LSStrings.currentCourseName, data.name);
            Utils.setValue(Utils.LSStrings.courseTag, data.tag);
            Utils.setValue(Utils.LSStrings.oldCourse, data.pk);

            var course = data.pk;
            if(tag === "getCourse"){
                // 1.刷新数据源(getcourse)
                HomeUtil.currentCatalogIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);  //记录目录下标
                var courseIndex = Utils.getValue(Utils.LSStrings.currentCourseIndex);
            }else{
                // 2.请求课程(getCourseInfoWithPk)
                if(Utils.getValue(Utils.LSStrings.token)){
                    var courseIndex = catalogChange == true ? HomeUtil.currentCatalogIndex : data.learn_extent.last_lesson;
                }else{
                    var courseIndex = catalogChange == true ? HomeUtil.currentCatalogIndex : Utils.getValue(Utils.LSStrings.currentCourseIndex)?Utils.getValue(Utils.LSStrings.currentCourseIndex):0;
                }
                Utils.setValue(Utils.LSStrings.currentCourseIndex, courseIndex);

                if (catalogChange == true) {
                    // 更新课程进度（目录）
                    if(Utils.getValue(Utils.LSStrings.token)){
                        Mananger.updateExtent(course, courseIndex, true);   //更新服务器的进度
                    }
                }else{
                    // 更新课程进度(打卡)
                    HomeUtil.currentCatalogIndex = courseIndex;  //记录目录下标
                }
            }

            // 2.更新课程目录、刷新练习、语种列表、课节进度
            HomeUtil.courseProgressUI();
            HomeUtil.courseCatalogsInit(array, function(){
                if(clickEventCB){clickEventCB();}
                // Page.clickEvent();
            });

            if(tag == "getCourse"){
                // 1.刷新数据源(getcourse)
                if(callback){callback(array, courseIndex);}
            }else{
                $("#courseList").contents().find(".course[data-category="+course+"]").attr({"data-course-index":courseIndex});
                
                // 6.取当前小节的课程数据
                if(array){
                    if (array[courseIndex+1]) {
                        if(callback){callback(array, courseIndex);}
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
            }
        },

        // -----获取奖学金记录相关 api------
        getRecord:function(page,type){
            Common.isLogin(function(token){
                url = "/asset/record/"
                $.ajax({
                    type:'get',
                    url: Common.domain + url,
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        page:page,
                        page_size:5
                    },
                    timeout:6000,
                    success:function(json){
                        if(json.count===0){
                            $('.scholarship-bottom').html('您还没有奖学金记录');
                        }else if(json.count>0){
                            var lis="";
                            
                            for(var i=0 ; i<json.results.length;i++){
                                var time=json.results[i].create_time;
                                var timeStr=time.replace(/T/,' ')
                                timeStr = timeStr.split(".")[0];
                                if(json.results[i].amount>0){
                                    json.results[i].amount='+'+json.results[i].amount
                                }
                                lis+= '<li class="record-lis'+i+'"><span class="record-date">'+timeStr+'</span><span class="record-content">'+json.results[i].record_type+'</span><span class="record-amount">'+json.results[i].amount+'</span></li><i class="bottom-line"></i>';
                            }
                            $('.record-uls').html(lis);
                            $('.scholarship-amount').html(HomeUtil.balance.toFixed(2));
                            if(type==='init'){
                                var a= Math.ceil(parseInt(json.count)/5);
                                Mananger.loadpage(a);
                                
                            }
                        }  
                    },
                    error:function(xhr, textStatus){
                        console.log(textStatus);
                    }
                }) 
            })
        },
        // 分页
        loadpage:function(totalPages) {
            $('#pagination').jqPaginator({
                totalPages: totalPages,//总页数
                visiblePages: 1,//列表显示页数
                currentPage: 1,//当前页
                prev: '<li class="prev pages"><a href="javascript:;"><i class="arrow arrow2"></i>&lt;</a></li>',
                next: '<li class="next pages"><a href="javascript:;">&gt;<i class="arrow arrow3"></i></a></li>',
                page: '<li class="page .scholarship-page pages"><a href="javascript:;">{{page}}</a></li>',
                onPageChange:function(num, type) {
                    if (type !== 'init') {
                        Mananger.getRecord(num, type);
                    }
                }
            });
        },

        // -------组队相关 api-------
        loadMyTeam:function(){
            Common.isLogin(function(token){
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/?batch_type=2",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                       var html = ArtTemplate("team-template", json);
                       $(".header .team").html(html);
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        loadTeamBrand:function(){
            /*
            var array = [
                {name:'nozuonodie', diamond_amount:237},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:230},
                {name:'nozuonodie', diamond_amount:220},
                {name:'nozuonodie', diamond_amount:210},
                {name:'nozuonodie', diamond_amount:130}
            ]
            var html = ArtTemplate("teams-brand-template", array);
            $(".teams-brand").html(html);
            */
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/groups/diamond/ranking/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:15000,
                    success:function(json){
                        var html = ArtTemplate("teams-brand-template", json.results);
                        $(".teams-brand").html(html);
                    },
                    error:function(xhr, textStatus){
                        Mananger.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
    }

    exports.Mananger = Mananger;
})