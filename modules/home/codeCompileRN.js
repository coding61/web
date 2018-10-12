define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    // 配置页面域名
    var NORMAL_DOMAIN = "https://www.coding61.com";
    var TEST_DOMAIN = "https://app.bcjiaoyu.com";
    var DEPEND_DOMAIN_TEST = "app.bcjiaoyu.com";
    var DEPEND_DOMAIN_LOCAL = "develop.cxy61.com";

    var udid = Common.getQueryString("udid");
    var message = decodeURIComponent(Common.getQueryString("message"));
    //console.log(studentOwner,classRoomId)

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
        c:{mode:{name:"text/x-csrc"}, language:7},
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
            Page.hideBottomResultView();

            if (udid) {
                $(".go-qa").show();
                console.log(message);
            }else{
                $(".go-qa").hide();
            }
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
                if(localStorage["PythonCode"]){
                    htmlEditor.setValue(localStorage["PythonCode"]);
                }else{
                htmlEditor.setValue("#!encoding: utf-8");
            }
            }else if(Page.lang == "c"){
                if(localStorage["CCode"]){
                    htmlEditor.setValue(localStorage["CCode"]);
                }
            }else if(Page.lang == "oc"){
                if(localStorage["OCCode"]){
                    htmlEditor.setValue(localStorage["OCCode"]);
                }  
            }else if(Page.lang == "cpp"){
                if(localStorage["CPPCode"]){
                    htmlEditor.setValue(localStorage["CPPCode"]);
                }
            }

            htmlEditor.on("change", function(Editor, changes){
                var currentMode = htmlEditor.getOption("mode").name;
                //htmlEditor.lastLine()
                if (currentMode == "text/x-csrc") {
                    //存 c
                    localStorage["CCode"] = Editor.getValue();
                    //console.log(Editor.getValue())
                }else if (currentMode == "text/x-objectivec"){
                    //存 oc
                    localStorage["OCCode"] = Editor.getValue();
                }else if (currentMode == "text/x-c++src"){
                    //存 cpp
                    localStorage["CPPCode"] = Editor.getValue();
                }else if (currentMode == "text/x-cython"){
                    //存 Python
                    localStorage["PythonCode"] = Editor.getValue();
                }
            })
        },
        load:function(value){
            //console.log(value);
            //console.log("语言", Page.language);
            $.ajax({
                type:"post",
                url: Common.compileDomain + '/',
                data:JSON.stringify({
                    code:value,
                    language:Page.language
                }),
                contentType:"application/json",
                timeout:6000,
                success:function(json){
                    Common.hideLoading();
                    // if (json.errors) {
                    //     var str = json.errors;
                    // }else{
                    //     var str = json.output;
                    // }

                    var str = json.output + "\n" + json.errors;
                    str = str.replace(/\r\n/g, "<br/>");
                    str = str.replace(/\n/g, "<br/>");
                    str = str.replace(/\ /g, "&nbsp"); //替换 空格
                    str = str.replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp");
                    $(".compile-result .content").html(str);
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
                        Common.dialog('服务器繁忙11');
                        return;
                    }
                    $(".compile-result .content").html("运行失败");
                    console.log(textStatus);
                }
            })
        },
        fetchAddForum:function(code){
            var dic = {
              types:"2",
              section: String(13),
              title:message,
              content:code,
              udid:udid
            }

            var content = "问题描述:\n##############\n练习:" + message + "代码:\n-------\n[pre]\n" + code + "\n[/pre]\n-------\n##############\n"
            var codeQuestionForForum = {
                content:content,
                udid:udid,
            }
            localStorage.codeQuestionForForum = JSON.stringify(codeQuestionForForum);
            Common.hideLoading();
            if (location.host.indexOf(DEPEND_DOMAIN_LOCAL)> -1 || location.host.indexOf(DEPEND_DOMAIN_TEST) > -1) {
                var url = TEST_DOMAIN + "/cxyteam_forum/add.html?pk=13";
            }else{
                var url = NORMAL_DOMAIN + "/cxyteam_forum/add.html?pk=13";
            }
            window.open(url);
            // Common.isLogin(function(token){
            //     if (token) {
            //         $.ajax({
            //             type:'post',
            //             url: Common.domain + "/forum/posts_create/",
            //             data:JSON.stringify(dic),
            //             contentType:"application/json",
            //             headers:{
            //                 Authorization:"Token " + token
            //             },
            //             success:function(json){
            //                 Common.hideLoading();
            //                 Common.dialog("提交成功");
            //             },
            //             error:function(xhr, textStatus){
            //                 Common.hideLoading();
            //                 if (textStatus == "timeout") {
            //                     Common.dialog("请求超时");
            //                     return;
            //                 }
            //                 if (xhr.status == 403 || xhr.status == 400) {
            //                     Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
            //                     return;
            //                 }else{
            //                     Common.dialog('服务器繁忙');
            //                     return;
            //                 }
            //             }
            //         })
            //     }
            // })
        },
        clickEvent:function(){
            function compileResult(e){
                $(".inputHeader input").val("");
                console.log(e.data);
                var data = JSON.parse(e.data);
                if (data.code) {
                    htmlEditor.setValue(data.code);
                    return;
                }else{
                    var str;
                    if ($(".compile-result .content").html() == "运行结果加载中...") {
                        str=""
                    }else{
                        str = $(".compile-result .content").html();
                        str = str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/<br\/>/g, "\n").replace(/<br>/g, "\n");
                        // console.log("str1", str);
                    }
                    if (data.output) {
                        str += data.output
                    }
                    if (data.errors) {
                        str += data.errors
                    }
                    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\n/g, "<br/>");
                    $(".compile-result .content").html(str);
                    Common.hideLoading();
                }
            }

            // 发送按钮
            $(".sendInput").click(function(){
                if ($(".inputHeader input").val() == "") {
                    Common.dialog("请输入一些内容");
                    return
                }
                WebSocketData.sendStdin($(".inputHeader input").val(), Page.lang, (e)=>{
                    compileResult(e);
                });
            })
            // 运行按钮
            $(".run").click(function(){
                if (htmlEditor.getValue() == "") {
                    Common.dialog("请输入一些代码，再运行");
                    return
                }
                Page.openBottomResultView();
                $(".resultHeader .resultAction").attr({src:"../../statics/images/codeCompileRN/arrow-down.png"});
                $(".resultHeader .resultAction").removeClass("show");

                Common.showLoading();
                $(".compile-result .content").html("运行结果加载中...");
                // Page.load(htmlEditor.getValue());
                WebSocketData.formatCode(htmlEditor.getValue(), Page.lang, (e)=>{
                    compileResult(e);
                    var data = JSON.parse(e.data);
                    WebSocketData.sendCode(data.code, Page.lang, (e)=>{
                        compileResult(e);
                    });
                });
                
            })
            $(".resultHeader .resultAction").unbind('click').click(function(){
                if ($(this).hasClass("show")) {
                    console.log("打开底部输出")
                    Page.openBottomResultView();
                    $(".resultHeader .resultAction").attr({src:"../../statics/images/codeCompileRN/arrow-down.png"});
                    $(this).removeClass("show");
                }else{
                    console.log("隐藏底部输出");
                    Page.hideBottomResultView();
                    $(".resultHeader .resultAction").attr({src:"../../statics/images/codeCompileRN/arrow-up.png"});
                    $(this).addClass("show");
                }
            })
            
            $(".header-tag .close").unbind('click').click(function(){
                window.parent.postMessage("closeRightIframe", '*');
            })
            
            // 去提问
            $(".go-qa").unbind('click').click(function(){
                if (htmlEditor.getValue() == "") {
                    Common.dialog("请输入一些代码，再提问");
                    return
                }
                Common.showLoading();
                var code = htmlEditor.getValue();
                Page.fetchAddForum(code);
            })

            Page.punctuationRelatedMethod();
        },
        hideBottomResultView:function(){
            $(".edits .compile-result").css({height:'41px'});
            // $(".edits .html-edit").css({height:'calc(100% - 41px)'});
        },
        openBottomResultView:function(){
            $(".edits .compile-result").css({height:'50%'});
            // $(".edits .html-edit").css({height:'50%'});
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

            // $(".punctuation-view").css({
            //     left:left+ "px",
            //     top:top + "px"
            // })
        }

    };

    Page.init();

});
