define(function(require, exports, module) {
    var ArtTemplate = require("libs/template.js");
    var Common = require('common/common.js');

    exports.init = function(courseCallBack) {
        function GetCookie(sName) {
            var aCookie = document.cookie.split("; ");
            for (var i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return decodeURI(aCrumb[1]);
            }
            return null;
        }

        //获取一个随机数
        var min = 0x1;
        var max = 0xffffffff;
        function getInstanceId() {                                      
            min = Math.ceil(min);
            max = Math.floor(max);
            return (Math.floor(Math.random() * (max - min + 1)) + min).toString(16);
        }  

        var lesson = getInstanceId();

        /* EasyRTC 配置项、初始化函数 */
        var webrtcRecorder = null;
        var audioId = document.getElementById('audioView');
        

        easyrtc.setSocketUrl(location.origin, null);
        function rtcInit() {
            data = {
                audioSendBitrate:10,
                videoSendBitrate:100,
                audioRecvBitrate:10,
                videoRecvBitrate:100,
            };
            var remoteFilter = easyrtc.buildRemoteSdpFilter(data);
            var localFilter = easyrtc.buildLocalSdpFilter(data);
            easyrtc.setSdpFilters(localFilter, remoteFilter);
            easyrtc.enableVideo(false);
            easyrtc.enableVideoReceive(false);
         
            easyrtc.easyApp('easyrtc.audioOnly', 'audioView', [], function(easyrtcid) {
                easyrtc.joinRoom(lesson, null, function() {
                    easyrtc.setRoomOccupantListener(callEverybodyElse);
                    audioId.autoplay = false;
                    audioId.paused = true;
                    audioId.load();
                    audioId.onplay = startRecorder;
                    audioId.onpause = stopRecorder;
                });
            });
        }

        function callEverybodyElse(roomName, otherPeople) {
            console.log(roomName);
            easyrtc.setRoomOccupantListener(null);
            for (var easyrtcid in otherPeople) {
                easyrtc.call(easyrtcid);
            }
        }

        rtcInit();
        easyrtc.setOnCall(function(easyrtcid, slot){
            console.log("call with " + easyrtcid + "established");
        });

        function startRecorder() {
            // 开始记录
            if (webrtcRecorder == null) {
                webrtcRecorder = easyrtc.recordToBlob(easyrtc.getLocalStream(), uploadBlob);
                // __log("录制中...");
                // Common.dialog("录制中...")
                // console.log(webrtcRecorder);
                var lastAudioIndex = audioId.getAttribute("data-lastAudioIndex");
                __log($(".message[data-index="+lastAudioIndex+"]").find(".log"), "录音中...");
            }
        }

        function stopRecorder() {
            if (webrtcRecorder != null) {
                webrtcRecorder.stop();
                webrtcRecorder = null;
            }
        }

        /* 上传音频到服务器 */
        function uploadBlob(blob) {
            var lastAudioIndex = audioId.getAttribute("data-lastAudioIndex");
            var lesson = audioId.getAttribute("data-lesson");
            var totalDic = localStorage.CourseData?JSON.parse(localStorage.CourseData):{};
            var array = totalDic[lesson]?totalDic[lesson]:[];
            var item = array[lastAudioIndex];
            var sha1Item = sha1(item.message);
            var langid = $(".audioLang>input").val();
            var number = $(".audioTeacherNum>input").val();

            console.log("md5:", sha1(item.message))
            console.log($(".audioTeacherNum>input").val());
            console.log($(".audioLang>input").val());


            var fileType = 'audio';
            var fileName = 'audio.wav';

            var formData = new FormData();
            formData.append('file-type', fileType);
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-blob', blob);
            formData.append('lesson-pk', lesson);
            formData.append('record-type', 'lesson');

            formData.append('lang-id', langid);
            formData.append('sha1-code', sha1Item);
            formData.append('number', number);

            console.log("md5:", sha1Item, "langid:", langid, "number:", number);

            xhr('/program_girl/upload/upload_media/', formData, function (fName) {
                console.log(Date() + " fName: " + fName);
                // console.log(JSON.parse(fName).url);
                // var url = "https://www.cxy61.com" + JSON.parse(fName).url
                var domain = "https://www.cxy61.com";
                if (location.host.indexOf("bcjiaoyu.com") > -1) {
                    domain = "https://app.bcjiaoyu.com";
                }else if(location.host.indexOf("develop.cxy61.com") > -1){
                    domain = "https://app.bcjiaoyu.com";
                } else{
                    domain = "https://www.cxy61.com";
                }
                var url = domain + JSON.parse(fName).url;

                courseCallBack(url, sha1Item);
                // __log("上传成功");
                
            }, function() {
                // __log("上传失败");
                courseCallBack(null, null)
            });

            function xhr(url, data, callback, errorCallback) {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    // console.log(request.readyState);
                    // console.log(request.status);
                    if (request.readyState == 4 && request.status == 200) {
                        callback(request.responseText);
                    } else if (request.status == 400 && errorCallback) {
                        errorCallback();
                    } else {
                        // __log("上传中...");
                        var lastAudioIndex = audioId.getAttribute("data-lastAudioIndex");
                        __log($(".message[data-index="+lastAudioIndex+"]").find(".log"), "上传中...");
                    }
                };
                request.open('POST', url);
                request.send(data);
            }
        }
        function __log(this_, e, data) {
            // if (log.innerHTML) {
            //     log.innerHTML += "\n" + e + " " + (data || '');
            // }else{
            //     log.innerHTML += e + " " + (data || '');
            // }
            // $("#log").animate({scrollTop:$("#log")[0].scrollHeight}, 20);

            if (this_.html()) {
                var a = this_.html() + "\n" + e + " " + (data || '');
                this_.html(a);
            }else{
                var a = this_.html() + e + " " + (data || '');
                this_.html(a);
            }
            this_.animate({scrollTop:this_[0].scrollHeight}, 20);
        }
        var Loading = {
            init:function(parent){
                var html = '<div class="waitloadingShadow">\
                        <div class="waitloading">\
                            <img src="../../statics/images/loading.gif"/>\
                            <p></p>\
                            </div></div>'
                if (parent) {
                    $(html).appendTo(parent);
                }else{
                    $(html).appendTo("body");
                }
                $(".waitloadingShadow").css({
                    position: 'absolute',
                    left: 0,
                    top:0,
                    width: '100%',
                    height: '100%',
                    'background-color': 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'flex-direction': 'column',
                    'z-index':'10000',
                    display:'none'
                })
                $(".waitloading").css({
                    background: '#f8f8f8',
                    'border-radius': '5px',
                    'font-size': '13px',
                    padding: '20px 30px',
                    'text-align': 'center'
                })
            },
            msg:function(text){
                $(".waitloadingShadow p").html(text);
            },
            hide:function(){
                $(".waitloadingShadow").css({display:'none'});
            },
            show:function(text, callback){
                $(".waitloadingShadow").css({display:'flex'});
                if (text) {
                    $(".waitloadingShadow p").html(text);
                }
                if (callback) {
                    callback();
                }
            },
        }
        // Loading.init(".chat");
    }
});
