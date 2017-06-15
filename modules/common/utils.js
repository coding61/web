define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	var AppBridge = require("common/app-bridge.js");

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
