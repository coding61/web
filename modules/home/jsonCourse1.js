var htmlEditor;
$(document).ready(function() {
    var Page = {
        init:function(){
            Page.configEdit();
            Page.addListen();
            Page.clickEvent();
        },
        addListen:function(){
            // 监听课程列表那里传过来的点击事件
            window.addEventListener('message', function(e) {  
                console.log(1);
                var a = e.data;   
                if(a == "json"){
                    console.log(1);
                    var value = localStorage.CourseData;
                    // var value = localStorage.CourseMessageData;
                    htmlEditor.setValue(value);
                }
            }, false);
        },
        configEdit:function(){
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
            
            if (localStorage.CourseData) {
                htmlEditor.setValue(localStorage.CourseData);
            }
            htmlEditor.on("change", function(Editor, changes){
                localStorage.CourseData = Editor.getValue();
            })
        },
        clickEvent:function(){
            $(".preview").click(function(){
                window.open("previewCourse.html?wt=1&mt=2");
            })
        }
    };

    Page.init();
});

function setEditorValue(){
    var value = localStorage.CourseData;
    htmlEditor.setValue(value);
}

