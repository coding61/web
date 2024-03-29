define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    // 存储键值
    exports.setValue = function(key, value){
        if(typeof value != "string"){
            // "a" --> ""a""
            value = JSON.stringify(value);
        }
        if (window.localStorage) {
            localStorage[key] = value;
        }else{
            $.cookie(key, value, {path:"/"});
        }
    }
    // 移除键值
    exports.removeValue = function(key){
        if(window.localStorage){
            localStorage.removeItem(key);
        }else{
            $.cookie(key, null, {
                path: "/"
            });
        }
    }
    // 获取键值
    exports.getValue = function(key){
        var value = null;
        if (window.localStorage) {
            value = localStorage[key];
        }else{
            value = $.cookie(key);
        }
        
        try{
            value = JSON.parse(value)
        }
        catch(error){
            value = value
        }
        return value;
    }

    //  定义存储到 LocalStorage 中的键值
    exports.LSStrings = {
        chatData:"chatData",                              //缓存数据
        owner:"owner",                                    //用户账号
        avatar:"avatar",                                  //头像
        courseTag:"courseTag",                            //课程 tag
        leadCourse:"leadCourse",                          //引导课程的pk
        currentCourse:"currentCourse",                    //当前课程 pk
        currentCourseIndex:"currentCourseIndex",          //当前课程的课节下标
        currentCourseTotal:"currentCourseTotal",          //当前课程的总节数
        currentCourseIsAdapt:"currentCourseIsAdapt",      //当前课程是否是自适应课程
        currentCourseName:"currentCourseName",            //当前课程的名称
        learnCourses:"learnCourses",                      //已学课程的 pk 组
        oldCourse:"oldCourse",                            //上一次课程的 pk                        
        currentExper:"currentExper",                      //经验值
        currentGrade:"currentGrade",                      //等级
        currentZuan:"currentZuan",                        //钻石
        data:"data",                                      //数据源
        index:"index",                                    //数据源 item 下标
        optionData:"optionData",                          //选项数据源
        optionIndex:"optionIndex",                        //选项下标
        optionDataAnswer:"optionDataAnswer",              //选项答对还是答错了
        token:"token",                                    //用户 token
        userInfo:"userInfo",                              //记录用户信息

        CourseMessageData:"CourseMessageData",            //编辑课程数据
        CourseData:"CourseData",                          //编辑课程数据
        htmlCode:"htmlCode",                              //html存储
        jsCode:"jsCode",                                  //js 存储
        CCode:"CCode",                                    //C 存储
        OCCode:"OCCode",                                  //OC 存储
        CPPCode:"CPPCode",                                //CPP 存储
        PythonCode:"PythonCode",                          //Python 存储
        PythonCode2:"PythonCode2",                        //Python2 存储

        showMonkey:"showMonkey",                          //是否显示 monkey
        isDoExercise:"isDoExercise",                      //是否是刷题训练
        doExerciseIndex:"doExerciseIndex",                //刷题训练的课节下标

        learnKPoints:"learnKPoints",                      //记录学生本节课已学知识点
        learnHomework:"learnHomework",                    //记录学生本节课作业列表
        DailyReviewDate:"DailyReviewDate",                //记录每日复习的日期，一天提醒一次
    }

    var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitSection = ["","万","亿","万亿","亿亿"];
    var chnUnitChar = ["","十","百","千"];

    function SectionToChinese(section){
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }
    
    // 数字转中文
    exports.numberToChinese = function(num){
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;

        if(num === 0){
            return chnNumChar[0];
        }

        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        
        // 将一十一这种变成十一
        if (chnStr.indexOf("一十") != -1) {
            chnStr = "十"+chnStr.split("一十")[1];
        }
        return chnStr;
    }

    // 获取当前时间
	exports.getCurrentTime = function(){
		var time = null;
		var current = new Date();
		var year = current.getFullYear();       //年
        var month = current.getMonth() + 1;     //月
        var day = current.getDate();            //日
        var hour = current.getHours();   		//时
        var minute = current.getMinutes();		//分
        var second = current.getSeconds();		//秒

        var clock = year + "-";
        if (month < 10) {
        	clock += "0";
        }
        clock += month + "-";

        if (day < 10) {
        	clock += "0";
        }
        clock += day;

        clock += " ";

        if (hour < 10) {
        	clock += "0";
        }
        clock += hour +":";

        if (minute < 10) {
        	clock += "0";
        }
        clock += minute + ":";

        if (second < 10) {
        	clock += "0";
        }
        clock += second;

        time = clock;
		
		time = time.replace(/\//g, "-");
		// console.log(time);
		return time;
	}

    // 获取原图片的图片格式
	exports.getOriginUrlExt = function(url){
		var string = null;
		if (url.split('.jpg-')[1]) {
			string = '.jpg';
		}else if(url.split('.png-')[1]){
			string = '.png';
		}else if(url.split('.JPG-')[1]){
			string = '.JPG';
		}else if(url.split('.PNG-')[1]){
			string = '.PNG';
		}

		return string;
	}

    // 放大图片
    exports.scaleBigPhotoUI = function(url){
        var url = url;
        // console.log(url);
        Common.showMask();

        var html = '<div class="big-image"><img src='+url+'></div>';
        $(html).appendTo("body");

        $(".big-image").css({
            "position":"fixed",
            "top":0,
            "left":0,
            "right":0,
            "bottom":0,
            "z-index":99999,
            "overflow":"hidden"
        });
        var bigWidth = $(".big-image").width();
        var bigHeight = $(".big-image").height();
        var Imgheight, Imgwidth, marginTop;
        Common.changePhotoSrc(url, function(width, height){
            Imgwidth = parseInt(width);
            Imgheight = parseInt(height);

        });
        if (!Imgwidth || !Imgheight) {
            //不合法数据,宽高没写
            $(".big-image").children("img").css({
                "width": bigWidth + "px"
            });
        }else{
            //================第1种方法:按照图片的宽高比例,宽大,宽100%,上下居中,高大,高100%,左右居中
            if (Imgheight <= Imgwidth) {
                //宽100%
                var imageHeight = (Imgheight / Imgwidth) * bigWidth;
                marginTop = (bigHeight - imageHeight) / 2;
                $(".big-image").children("img").css({
                    "width": bigWidth + "px",
                    "margin-top": marginTop + "px" 
                });
            }else{
                //高100%
                var imageWidth = (Imgwidth / Imgheight) * bigHeight;
                marginTop = (bigWidth - imageWidth) / 2;
                $(".big-image").children("img").css({
                    "height": bigHeight + "px",
                    "margin-left":marginTop + "px"
                });
            }
        }

        $(document).bind("touchmove",function(e){ 
            e.preventDefault(); 
        });

        $(".big-image").unbind().click(function(){
            Common.hideMask();
            $(".big-image").remove();
            $(document).unbind("touchmove");
        });
    }

    // input 框键盘升起，页面上移
    exports.keyBoardUp = function(upCallback, downCallback){
        $("input").focus(function(){
            setTimeout(function(){
                // console.log('fdfdfd');
                location.href = "aichashuo://keyboard_up/";
                exports.keyBoardUpCallback = upCallback;
                exports.keyBoardDownCallback = downCallback;
            }, 0);
        });
    }
    exports.keyBoardUpMyCB = function(kbHeight){
        if(exports.keyBoardUpCallback){
            exports.keyBoardUpCallback(kbHeight);
        }
    };
    exports.keyBoardDownMyCB = function(){
        if(exports.keyBoardDownCallback){
            exports.keyBoardDownCallback();
            exports.keyBoardDownCallback = null;
        }
    };
    exports.keyBoardUpCallback = null;
    exports.keyBoardDownCallback = null;
    keyBoardUpCB = function(kbHeight){
        exports.keyBoardUpMyCB(kbHeight);
    };
    keyBoardDownCB = function(){
        exports.keyBoardDownMyCB();
    }

});
