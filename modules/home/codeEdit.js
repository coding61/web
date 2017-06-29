define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var htmlEditor, jsEditor, csEditor;
    var Page = {
        init:function(){
            Page.configEdit();
            Page.clickEvent();

        },
        addListen:function(){
            // 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {  
                var a = e.data;   
                if(a == "codeEdit"){
                    console.log(222);
                    // htmlEditor.setValue(localStorage.htmlCode);
                    // jsEditor.setValue(localStorage.jsCode);
                }
            }, false);
        },
        configEdit:function(){
            htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
                mode: "text/html",
                lineNumbers: true,
                lineWrapping: true,
                indentUnit:4,
                styleActiveLine: true,
                matchBrackets: true,
                // autoCloseBrackets: true,
                // autoCloseTags: true,
                theme: "monokai",
                // foldGutter: true,
                // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                value: ""
            });
            htmlEditor.on('keypress', function() { 
                htmlEditor.showHint(); //满足自动触发自动联想功能 
            });
            // editor.foldCode(CodeMirror.Pos(0, 0));
            // editor.foldCode(CodeMirror.Pos(34, 0));

            jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
                mode: "javascript",
                lineNumbers: true,
                lineWrapping: true,
                indentUnit:4,
                styleActiveLine: true,
                matchBrackets: true,
                // autoCloseBrackets: true,
                theme: "monokai",
                // foldGutter: true,
                // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                // value:""
            })
            jsEditor.on('keypress', function() { 
                jsEditor.showHint(); //满足自动触发自动联想功能 
            });
            // jsEditor.foldCode(CodeMirror.Pos(13, 0));
            

            csEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
                mode: "css",
                lineNumbers: true,
                lineWrapping: true,
                indentUnit:4,
                styleActiveLine: true,
                matchBrackets: true,
                // autoCloseBrackets: true,
                theme: "monokai",
                // foldGutter: true,
                // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                // value:""
            })
            csEditor.on('keypress', function() { 
                csEditor.showHint(); //满足自动触发自动联想功能 
            });

            
            /*
            htmlEditor.on("update", function(Editor){
                // console.log(Editor.getValue());
            });

            htmlEditor.on("change", function(Editor, changes){
                console.log(Editor.getValue());
            })
            */

            htmlEditor.on("blur", function(Editor){
                // console.log(Editor.getValue());
                localStorage.htmlCode = Editor.getValue();
            })

            jsEditor.on("blur", function(Editor){
                localStorage.jsCode = Editor.getValue();
            })
            
            if(localStorage.htmlCode){
                // console.log(localStorage.htmlCode);
                htmlEditor.setValue(localStorage.htmlCode);
            }
            
            if(localStorage.jsCode){
                // console.log(localStorage.jsCode);
                jsEditor.setValue(localStorage.jsCode);
            }
           
            

            // Page.addListen();
        },
        load:function(htmlValue, cssValue, jsValue){
            console.log(htmlValue);
            console.log(cssValue);
            console.log(jsValue);

            $.ajax({
                type:"post",
                url:Common.domain + "/userinfo/exercise_create/",
                data:{
                    html:htmlValue,
                    css:cssValue,
                    js:jsValue
                },
                timeout:6000,
                success:function(json){
                    console.log(json);
                    var url =  "https://app.bcjiaoyu.com/program_girl"+"/userinfo/exercises/"+json.pk+"/"
                    // console.log(url);

                    $(".run-result iframe").attr({src:url});
                },
                error:function(xhr, textStatus){

                    if (textStatus == "timeout") {
                        Common.dialog("请求超时, 请稍后重试");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        Common.dialog('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        },
        clickEvent:function(){
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "http://free.bcjiaoyu.com",
                scope = 'snsapi_login';

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            $(".result .run").click(function(){
                // console.log(htmlEditor.getValue());
                // console.log(csEditor.getValue());
                // console.log(jsEditor.getValue());
                // var htmlV = "<html><head></head><body>";
                // htmlV += htmlEditor.getValue();
                // htmlV += "</body></html>"
                // console.log(htmlV);

                Page.load(htmlEditor.getValue(), csEditor.getValue(), jsEditor.getValue());

                // console.log(htmlEditor.getTextArea().value);
                // console.log(htmlEditor.toTextArea());
            })
        },

    };

    Page.init();

});
