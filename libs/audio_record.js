window.onload = function(text) {
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
    var startBtn = document.getElementById('audio-record-start');
    var stopBtn = document.getElementById("audio-record-stop");
    startBtn.addEventListener("click", function( event ) {
        audioId.play();
        startBtn.disabled=true;
        stopBtn.disabled = false;
    }, false);

    stopBtn.addEventListener("click", function( event ) {
        audioId.pause();
        startBtn.disabled=false;
        stopBtn.disabled = true;
    }, false);

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
            __log("录制中...");
            console.log(webrtcRecorder);
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
        var fileType = 'audio';
        var fileName = 'audio.mp3';

        var formData = new FormData();
        formData.append('file-type', fileType);
        formData.append(fileType + '-filename', fileName);
        formData.append(fileType + '-blob', blob);
        formData.append('lesson-pk', lesson);
        formData.append('record-type', 'lesson');

        xhr('/program_girl/upload/upload_media/', formData, function (fName) {
            console.log(Date() + " fName: " + fName);
            // console.log(JSON.parse(fName).url);
            // var url = "https://www.cxy61.com" + JSON.parse(fName).url
            var url = "https://app.bcjiaoyu.com" + JSON.parse(fName).url
            $(".input-view textarea").val(url);
            __log("上传成功");
            
        }, function() {
            __log("上传失败");
        });

        function xhr(url, data, callback, errorCallback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                console.log(request.readyState);
                console.log(request.status);
                if (request.readyState == 4 && request.status == 200) {
                    callback(request.responseText);
                } else if (request.status == 400 && errorCallback) {
                    errorCallback();
                } else {
                    __log("上传中...");
                }
            };
            request.open('POST', url);
            request.send(data);
        }
    }
    function __log(e, data) {
        if (log.innerHTML) {
            log.innerHTML += "\n" + e + " " + (data || '');
        }else{
            log.innerHTML += e + " " + (data || '');
        }
        $("#log").animate({scrollTop:$("#log")[0].scrollHeight}, 20);
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
