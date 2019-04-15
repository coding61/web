var LanguageList = {
    "python2":{lang:17, name:"python2"},
    "python":{lang:0, name:"python3"},
    "ruby":{lang:1, name:"ruby"},
    "clojure":{lang:2, name:"clojure"},
    "php":{lang:3, name:"php"},
    "nodejs":{lang:4, name:"nodejs"},
    "scala":{lang:5, name:"scala"},
    "golang":{lang:6, name:"golang"},
    "cpp":{lang:7, name:"c++"},
    "java":{lang:8, name:"java"},
    "vb":{lang:9, name:"vb"},
    "gmcs":{lang:10, name:"gmcs"},
    "bash":{lang:11, name:"bash"},
    "oc":{lang:12, name:"object-c"},
    "mysql":{lang:13, name:"mysql"},
    "perl":{lang:14, name:"perl"},
    "rues":{lang:15, name:"rues"},
    "c":{lang:16, name:"C"}
}

var WebSocketData = {
    number:0,
    // init: webSocketInit,
    init:function(OpenCallBack, Messagecallback){
        if ('WebSocket' in window) {
            if (WebSocketData.ws) {
                try {
                  WebSocketData.ws.close();
                  WebSocketData.ws = null;
                } catch(error) {
                  console.error(error);
                }
            }
            
            var ws = new WebSocket('wss://app.coding61.com/compile2/');
            WebSocketData.ws = ws;

            ws.onopen = function(){
                $(".sendInput").css("pointer-events", "auto");
                console.log("正在连接 socket")
                if (OpenCallBack) {
                    OpenCallBack();
                }
            }

            ws.onmessage = function(e){
                var data = JSON.parse(e.data);
                if (data.output) {
                    WebSocketData.number = WebSocketData.number + 1;
                    console.log("WebSocketData.number:",WebSocketData.number);
                    if (WebSocketData.number > 100) {
                        console.log("超出100条，断开连接，不回调");
                        ws.close();
                        WebSocketData.ws = null;
                        WebSocketData.number = 0;
                        return;
                    }
                }

                if (Messagecallback) {
                    Messagecallback(e);
                }
            };

            ws.onclose = function() {
                console.log("连接已断开，请重新点击运行");
                // $(".sendInput").css("pointer-events", "none");
                // alert("连接已断开，请重新点击运行")
                // WebSocketData.ws = null;
            };

        } else {
            alert('WebSocket NOT supported by your Browser!');
        }
    },
    closeWebSocket:function(){
        if (WebSocketData.ws) {
            try {
              WebSocketData.ws.close();
              WebSocketData.ws = null;
            } catch(error) {
              console.error(error);
            }
        }
    },
    sendCode:function(codeValue, lang, callback){
        WebSocketData.init(function(){
            var codeData = {
                type: 0,
                code: codeValue,
                language: LanguageList[lang]["lang"]
            }
            // console.log(codeData);
            WebSocketData.ws.send(JSON.stringify(codeData));
        }, callback);
        
        // if (!WebSocketData.ws) {
        //     WebSocketData.init(function(){
        //         var codeData = {
        //             type: 0,
        //             code: codeValue,
        //             language: LanguageList[lang]["lang"]
        //         }
        //         console.log(codeData);
        //         WebSocketData.ws.send(JSON.stringify(codeData));
        //     }, callback);
        // }else{
        //     WebSocketData.ws.close();
        //     var codeData = {
        //         type: 0,
        //         code: codeValue,
        //         language: LanguageList[lang]["lang"]
        //     }
        //     console.log(codeData);
        //     WebSocketData.ws.send(JSON.stringify(codeData));
        // }
    },
    sendStdin:function(inputValue, lang, callback){
        if (!WebSocketData.ws) {
            WebSocketData.init(function(){
                var val = inputValue;
                val = val.trimEnd('\n');
                val += "\n";
                var stdinData = {
                    type: 1,
                    stdin: val, 
                    language: LanguageList[lang]["lang"]
                }
                console.log(stdinData);
                WebSocketData.ws.send(JSON.stringify(stdinData));
            }, callback);
        }else{
            var val = inputValue;
            val = val.trimEnd('\n');
            val += "\n";
            var stdinData = {
                type: 1,
                stdin: val, 
                language: LanguageList[lang]["lang"]
            }
            // console.log(stdinData);
            // console.log(WebSocketData.ws);
            if (WebSocketData.ws.readyState === 3) {
                alert("连接已断开，请重新点击运行")
            }else{
                WebSocketData.ws.send(JSON.stringify(stdinData));
            }
        }
    },
    formatCode:function(codeValue, lang, callback){
        WebSocketData.init(function(){
            var codeData = {
                type: 3,
                code: codeValue,
                language: LanguageList[lang]["lang"]
            }
            // console.log(codeData);
            WebSocketData.ws.send(JSON.stringify(codeData));
        }, callback);
    }
};
