define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var signs = [
        "[",
        "]",
        "{",
        "}",
        "(",
        ")",
        "<",
        ">",
        "/",
        "\\",
        "'",
        '"',
        "-",
        "_",
        ":",
        ";",
        "$",
        "#",
        "%",
        "^",
        "@",
        ".",
        ",",
        "?",
        "!",
        "*",
        "+",
        "=",
        "|",
        "~",
        "¢",
        "£",
        "￥"
    ]
    var htmlEditor;
    var editModes = {
        c:{mode:{name:"text/x-csrc"}, language:16},
        oc:{mode:{name:"text/x-objectivec"}, language:12},
        java:{mode:{name:"text/x-java"}, language:8},
        cpp:{mode:{name:"text/x-c++src"}, language:7},
        python:{mode:{name: "text/x-cython", version: 2, singleLineStringErrors: false}, language:0}
    }
    var Page = {
        lang:Common.getQueryString("lang"),
        language:0,
        init:function(){
            Page.configEdit();
            Page.clickEvent();
            
            /*
            // 监听RN传过来的语言
            document.addEventListener('message', function(e) {  
                var a = e.data;   
                console.log(a);
                alert(a);

                // htmlEditor.setOption("mode", editModes[a].mode);
                // htmlEditor.setValue("");
                // Page.language = editModes[a].language;
                // console.log(htmlEditor.getOption("mode"));
                
                // var str = "";
                // if (a == "c") {
                //     str = "C 语言编译器" 
                // }else if (a == "python") {
                //     str = "Python 语言编译器"
                // }
                // var b = document.getElementsByClassName("html-edit")[0]
                // var c = b.firstElementChild
                // c.innerText=str

                // $("title").html(str);
                // $(".html-edit .tag").html(str);

            }, false); 
            */

            var str = "";
            if (Page.lang == "c") {
                str = "C 语言编译器" 
            }else if (Page.lang == "python") {
                str = "Python 语言编译器"
            }else if(Page.lang == "java"){
                str = "Java 语言编译器"
            }else{
                str = Page.lang + "语言编译器"
            }
           
            $("title").html(str);
            $(".html-edit .tag").html(str);

            Page.language = editModes[Common.getQueryString("lang")].language;
            console.log(Page.language);
        },
        configEdit:function(){
            htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
                mode: editModes[Page.lang].mode,
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
                inputStyle:"textarea",
                value: ""
            });

            if (Page.lang == "python") {
                htmlEditor.setValue("#!encoding: utf-8");
            }

            // htmlEditor.on('keypress', function() { 
            //     htmlEditor.showHint(); //满足自动触发自动联想功能 
            // });
            // Page.addListen();
            
            // htmlEditor.on("change", function(Editor, changes){
            //     // console.log(Editor.getValue());
            //     var mode = htmlEditor.getOption("mode")["name"];
            //     var editValue = Editor.getValue();
            //     // console.log(mode, editValue);
            //     if (mode == "text/x-cython") {
            //         //python
            //         if(editValue.indexOf("input")>-1 || editValue.indexOf("raw_input") > -1){
            //             Common.dialog("程序媛编辑器不支持scanf, raw_input, input这类输入操作，建议使用repl编辑器哈！");
            //         }
            //     }else if (mode == "text/x-csrc"){
            //         //c
            //         if(editValue.indexOf("scanf")>-1){
            //             Common.dialog("程序媛编辑器不支持scanf, raw_input, input这类输入操作，建议使用repl编辑器哈！");
            //         }
            //     }
            // })
            
            // console.log(htmlEditor.getOption("mode"));
            // var mode = htmlEditor.getOption("mode")["name"];
            // if (mode == "text/x-cython" || mode == "text/x-csrc") {
            //     //python, c
            //     Common.dialog("程序媛编辑器不支持scanf, raw_input, input这类输入操作，建议使用repl编辑器哈！");
            // }
        },
        load:function(value){

            console.log(value);
            console.log("语言", Page.language);
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
                    Common.hideLoading();
                    console.log(json);

                    if (json.errors) {
                        var str = json.errors;
                    }else{
                        var str = json.output;
                    }
                    str = str.replace(/\r\n/g, "<br/>");
                    str = str.replace(/\n/g, "<br/>");
                    str = str.replace(/\ /g, "&nbsp"); //替换 空格
                    str = str.replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp");
                    $(".compile-result .content").html(str);
                    // console.log(url);

                    // $(".run-result iframe").attr({src:url});
                },
                error:function(xhr, textStatus){
                    Common.hideLoading();
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
                    $(".compile-result .content").html("运行失败");
                    console.log(textStatus);
                }
            })
        },
        clickEvent:function(){
            $(".result .run").click(function(){
                if (htmlEditor.getValue() == "") {
                    Common.dialog("请输入一些代码，再运行");
                    return
                }
                Page.dependInput();
                Common.showLoading();
                $(".compile-result .content").html("运行结果加载中...");
                Page.load(htmlEditor.getValue());
            })

            Page.punctuationRelatedMethod();
        },
        punctuationRelatedMethod:function(){
            Page.punctuationsInit();
            $(".insert-pun").click(function () {            
                $(".punctuation-view").show();
            })
            $(".punctuation-view .close img").click(function(){
                $(".punctuation-view").hide();
            })
            $(".punctuation").click(function(){
                var item = $(this).html();
                if (item == "&lt;") {
                    item = "<";
                }else if (item == "&gt;") {
                    item = ">"
                }
                htmlEditor.replaceSelection(item);

                // var value = htmlEditor.getValue();
                // value+=item
                // htmlEditor.setValue(value);
            })
        },
        punctuationsInit:function(){
            var html = "";
            for (var i = 0; i < signs.length; i++) {
                var item = signs[i];
                html += '<span class="punctuation">'+item+'</span>'
            }
            $(".punctuations").html(html);

            var btnW = $(".insert-pun").width();
            var btnL = $(".insert-pun").offset().left;
            var pvW = $(".punctuation-view").width();
            var pvH = $(".punctuation-view").height();
            
            var left = btnL-(pvW-btnW)/2
            left = ($(window).width() - pvW)/2

            var top = ($(window).height() - pvH) / 2

            $(".punctuation-view").css({
                left:left+ "px",
                top:top + "px"
            })
        },
        dependInput:function(){
            var mode = htmlEditor.getOption("mode")["name"];
            var editValue = htmlEditor.getValue();
            // console.log(mode, editValue);
            if (mode == "text/x-cython") {
                //python
                if(editValue.indexOf("input")>-1 || editValue.indexOf("raw_input") > -1){
                    Common.dialog("程序媛编辑器不支持scanf, raw_input, input这类输入操作，建议使用repl编辑器哈！");
                }
            }else if (mode == "text/x-csrc"){
                //c
                if(editValue.indexOf("scanf")>-1){
                    Common.dialog("程序媛编辑器不支持scanf, raw_input, input这类输入操作，建议使用repl编辑器哈！");
                }
            }
        }

    };

    Page.init();

});
