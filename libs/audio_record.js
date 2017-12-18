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

    var lesson = GetCookie('lesson');
    var authToken = GetCookie('Token');

    /* EasyRTC 配置项、初始化函数 */
    var webrtcRecorder = null;
    var audioId = document.getElementById('audioView');
    var startBtn = document.getElementById('audio-record-start');
    var stopBtn = document.getElementById("audio-record-stop");
    startBtn.addEventListener("click", function( event ) {
        audioId.play();
        stopBtn.disabled = false;
    }, false);

    stopBtn.addEventListener("click", function( event ) {
        audioId.pause();
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
            $('#upload-status').text('Recording...');
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
        var fileName = 'audio.opus';

        var formData = new FormData();
        formData.append('file-type', fileType);
        formData.append(fileType + '-filename', fileName);
        formData.append(fileType + '-blob', blob);
        formData.append('lesson-pk', lesson);
        formData.append('record-type', 'lesson');

        xhr('/server/upload/', formData, function (fName) {
            console.log(Date() + " fName: " + fName);
            $('#upload-status').text('Upload Finished.');
        }, function() {
            $('#upload-status').text('Upload Failure.');
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
                    $('#upload-status').text('Upload...');
                }
            };
            request.open('PUT', url);
            request.setRequestHeader('Authorization', 'Token ' + authToken);
            request.send(data);
        }
    }
}
