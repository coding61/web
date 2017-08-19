$(document).ready(function() {
    var domain = "/program_girl";
    var htmlEditor;
    var editModes = {
        c:{mode:{name:"text/x-csrc"}, language:7},
        oc:{mode:{name:"text/x-objectivec"}, language:12},
        java:{mode:{name:"text/x-java"}, language:8},
        cpp:{mode:{name:"text/x-c++src"}, language:7},
        python:{mode:{name: "text/x-cython", version: 2, singleLineStringErrors: false}, language:0}
    }
    function getQueryString(key){
        var ls = location.search;
        //var reg = eval("new RegExp('[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$','g')");
        var reg = eval("new RegExp('[\?&]+(" + key + ")=[^&]+&|[\?&]+(" + key + ")=[^&]+$')");
        var args = ls.match(reg);
        if (args) {
            return args[0].split("=")[1].replace(/&$/, "");
        } else {
            console.log(key + "不存在");
            return null;
        }
    }

    var Page = {
        lang:getQueryString("lang"),
        language:0,
        init:function(){
            Page.configEdit();
            Page.clickEvent();
            
            if (Page.lang) {
                var str = "";
                if (Page.lang == "c") {
                    str = "C 语言编译器" 
                }else if (Page.lang == "python") {
                    str = "Python 语言编译器"
                }
               
                $("title").html(str);
                $(".html-edit .tag").html(str);

                Page.language = editModes[Page.lang].language;
            }
            // 监听父窗口传过来的语言
            document.addEventListener('message', function(e) {  
                var a = e.data;   
                console.log(a);
                // alert(a);
                htmlEditor.setOption("mode", editModes[a].mode);
                htmlEditor.setValue("");
                Page.language = editModes[a].language;
                console.log(htmlEditor.getOption("mode"));
                
                var str = "";
                if (a == "c") {
                    str = "C 语言编译器" 
                }else if (a == "python") {
                    str = "Python 语言编译器"
                }
                var b = document.getElementsByClassName("html-edit")[0]
                var c = b.firstElementChild
                c.innerText=str

                $("title").html(str);
                $(".html-edit .tag").html(str);

            }, false);
        },
        configEdit:function(){
            htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
                mode: Page.lang?editModes[Page.lang].mode : editModes.python.mode,
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
            // alert("124");
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
                    // layer.closeAll('loading');
                    $("body").mLoading("hide");//隐藏loading组件
                    console.log(json);
                    if (json.errors) {
                        $(".compile-result .content").html(json.errors);
                    }else{
                        $(".compile-result .content").html(json.output);
                    }
                    // console.log(url);

                    // $(".run-result iframe").attr({src:url});
                },
                error:function(xhr, textStatus){
                    // layer.closeAll('loading');
                    $("body").mLoading("hide");//隐藏loading组件
                    if (textStatus == "timeout") {
                        layer.alert("请求超时, 请稍后重试");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        layer.alert(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        layer.alert('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        },
        clickEvent:function(){
            $(".result .run").click(function(){
                if (htmlEditor.getValue() == "") {
                    layer.alert("请输入一些代码，再运行");
                    return
                }
                
                $("body").mLoading("show"); //显示loading组件
                
                $(".compile-result .content").html("运行结果加载中...");
                Page.load(htmlEditor.getValue());
            })
        },

    };

    Page.init();
});


