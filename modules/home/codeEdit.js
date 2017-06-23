define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var htmlEditor, jsEditor, csEditor;
    var Page = {
        init:function(){
            Page.configEdit();

            $(".btn-blue").click(function(){
                $(".web-page").attr({src:'https://www.baidu.com'});
            })
            
            $(".btn-red").click(function(){
                $(".web-page").attr({src:'http://free.bcjiaoyu.com/'});
            })

            Page.clickEvent();



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
        },
        load:function(){
            
        },
        clickEvent:function(){
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "http://free.bcjiaoyu.com",
                scope = 'snsapi_login';

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            $(".result .run").click(function(){
                console.log(htmlEditor.getValue());
                console.log(csEditor.getValue());
                // console.log(htmlEditor.getTextArea().value);
                // console.log(htmlEditor.toTextArea());
            })
        }
    };

    Page.init();

});
