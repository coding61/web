define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var htmlEditor, jsEditor, csEditor;
    var Page = {
        init:function(){
            // Page.configEdit();
            Page.configHtmlEdit();
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
        configHtmlEdit:function(){
            console.log($(".html-edit").children().length);
            if ($(".html-edit").children().length == 2) {
                return;
            }
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
                gutters: ["CodeMirror-lint-markers"],
                lint: true,
                value: ""
            });
            htmlEditor.on('keypress', function() { 
                htmlEditor.showHint(); //满足自动触发自动联想功能 
            });
            // editor.foldCode(CodeMirror.Pos(0, 0));
            // editor.foldCode(CodeMirror.Pos(34, 0));

            // htmlEditor.on("blur", function(Editor){
            //     // localStorage.htmlCode = Editor.getValue();
            // })
            // if(localStorage.htmlCode){
            //     // console.log(localStorage.htmlCode);
            //     htmlEditor.setValue(localStorage.htmlCode);
            // }
        },
        configJsEdit:function(){
            console.log($(".js-edit").children().length);
            if ($(".js-edit").children().length == 2) {
                return;
            }
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
                gutters: ["CodeMirror-lint-markers"],
                lint: true,
                // value:""
            })
            jsEditor.on('keypress', function() { 
                jsEditor.showHint(); //满足自动触发自动联想功能 
            });
            // jsEditor.foldCode(CodeMirror.Pos(13, 0));
            
            // jsEditor.on("blur", function(Editor){
            //     // localStorage.jsCode = Editor.getValue();
            // })
            // if(localStorage.jsCode){
            //     // console.log(localStorage.jsCode);
            //     jsEditor.setValue(localStorage.jsCode);
            // }
        },
        configEdit:function(){
            
            /*
            htmlEditor.on("update", function(Editor){
                // console.log(Editor.getValue());
            });

            htmlEditor.on("change", function(Editor, changes){
                console.log(Editor.getValue());
            })
            */

            // htmlEditor.on("blur", function(Editor){
            //     // localStorage.htmlCode = Editor.getValue();
            // })

            // jsEditor.on("blur", function(Editor){
            //     // localStorage.jsCode = Editor.getValue();
            // })
            
            // if(localStorage.htmlCode){
            //     // console.log(localStorage.htmlCode);
            //     htmlEditor.setValue(localStorage.htmlCode);
            // }
            
            // if(localStorage.jsCode){
            //     // console.log(localStorage.jsCode);
            //     jsEditor.setValue(localStorage.jsCode);
            // }
           
            

            // Page.addListen();
        },
        load:function(htmlValue, cssValue, jsValue){
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
                    // alert(json.pk)
                    // $(".run-result iframe").attr({src:url});
                    var url =  "https://app.bcjiaoyu.com/program_girl"+"/userinfo/exercises/"+json.pk+"/"
                    $(".code-result-shadow-view iframe").attr({src:url})
                    $(".code-result-shadow-view").show();
                    
                    // 关闭运行代码结果窗口
                    $(".code-result .close img").unbind('click').click(function(){
                        $(".code-result-shadow-view").hide();
                    })

                    window.postMessage(json.pk, "*");
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
            $(".tabs .tab").click(function(){
                if ($(this).hasClass("unselect")) {
                    $(".tab").removeClass("select").addClass("unselect");
                    $(this).removeClass("unselect").addClass("select");
                    if ($(this).hasClass("htmlTag")) {
                        // 打开 html，关闭 js
                        $(".edits .html-edit").show();
                        $(".edits .js-edit").hide();

                        Page.configHtmlEdit();
                    }else if ($(this).hasClass("jsTag")) {
                        $(".edits .html-edit").hide();
                        $(".edits .js-edit").show();

                        Page.configJsEdit();
                    }
                }
            })

            $(".result .run").click(function(){
                var htmlV = "";
                var jsV = "";
                var cssV = "";
                if ($(".js-edit").children().length == 2) {
                    jsV = jsEditor.getValue();
                }
                // console.log(jsV);
                if ($(".html-edit").children().length == 2) {
                    htmlV = htmlEditor.getValue();
                }
                // console.log(htmlV);

                Page.load(htmlV, cssV, jsV);

                // $(".code-result-shadow-view").show();
                // // 关闭运行代码结果窗口
                // $(".code-result .close img").unbind('click').click(function(){
                //     $(".code-result-shadow-view").hide();
                // })

            })
        },

    };

    Page.init();

});
