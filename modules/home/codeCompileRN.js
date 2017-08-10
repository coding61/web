define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var htmlEditor;
    var editModes = {
        c:{mode:{name:"text/x-csrc"}, language:7},
        oc:{mode:{name:"text/x-objectivec"}, language:12},
        java:{mode:{name:"text/x-java"}, language:8},
        cpp:{mode:{name:"text/x-c++src"}, language:7},
        python:{mode:{name: "text/x-cython", version: 2, singleLineStringErrors: false}, language:0}
    }
    var Page = {
        language:0,
        init:function(){
            Page.configEdit();
            Page.clickEvent();

            // 监听父窗口传过来的语言
            window.addEventListener('message', function(e) {  
                var a = e.data;   
                console.log(a);
                alert(JSON.stringify(a));

                // htmlEditor.setOption("mode", editModes[a].mode);
                // htmlEditor.setValue("");
                // Page.language = editModes[a].language;
                // console.log(htmlEditor.getOption("mode"));

            }, false); 
        },
        configEdit:function(){
            htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
                mode: editModes.python.mode,
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
            // htmlEditor.on('keypress', function() { 
            //     htmlEditor.showHint(); //满足自动触发自动联想功能 
            // });
            // Page.addListen();
            console.log(htmlEditor.getOption("mode"));
        },
        load:function(value){
            console.log(value);
            $.ajax({
                type:"post",
                url: "/compile/",
                data:JSON.stringify({
                    code:value,
                    language:Page.language
                }),
                contentType:"application/json",
                timeout:6000,
                success:function(json){
                    console.log(json);
                    // console.log(url);

                    // $(".run-result iframe").attr({src:url});
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
            $(".result .run").click(function(){
                Page.load(htmlEditor.getValue());
            })
        },

    };

    Page.init();

});
