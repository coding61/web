define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var htmlEditor, jsEditor, csEditor, editor_json;
    var Page = {
        init:function(){
            Page.configEdit();
            Page.addListen();
        },
        addListen:function(){
            // 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {  
                console.log(1);
                var a = e.data;   
                if(a == "json"){
                    console.log(1);
                    var value = localStorage.CourseMessageData;
                    htmlEditor.setValue(value);
                }
            }, false);
        },
        configEdit:function(){
            // var editor_json = CodeMirror.fromTextArea(document.getElementById("json-code"), {
            //     lineNumbers: true,
            //     mode: "application/json",
            //     gutters: ["CodeMirror-lint-markers"],
            //     lint: true
            // });
            htmlEditor = CodeMirror.fromTextArea(document.getElementById("json-code"), {
                mode: "application/json",
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
                gutters: ["CodeMirror-lint-markers"],
                lint: true,
                value: ""
            });

            htmlEditor.setValue(localStorage.CourseMessageData);
        }
    };

    Page.init();

});
