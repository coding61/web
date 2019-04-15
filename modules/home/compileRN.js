define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        lang:Common.getQueryString("lang"),
        init:function(){
            Page.clickEvent();
        },
        load:function(){
            
        },
        clickEvent:function(){
            $(".main-view .repl").click(function(){
                var link = "https://repl.it/languages/" + Page.lang;
                if(Page.lang == "python2"){
                    link = "https://repl.it/repls/SmoggyWretchedEfficiency"
                }else if(Page.lang == "python"){
                    link = "https://repl.it/repls/UniqueCleanSpreadsheet"
                }
                var params = 'resizable=no, scrollbars=auto, location=no, titlebar=no,';
                params += 'width='+screen.width*0.60 +',height='+screen.height*0.90+',top='+screen.height*0.05+',left='+screen.width*0.40;
                console.log(params);
                window.open(link, '_blank', params);
            })
            $(".main-view .edit").click(function(){
                var link = "../home/codeCompileRN.html?lang=" + Page.lang;
                location.href = link;
            })
        }
    };
    
    Page.init();

});
