define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        token:null,
        init:function(){
            Page.clickEvent();
        },
        load:function(){
            
        },
        clickEvent:function(){
            $(".main-view .repl").click(function(){

            })
            $(".main-view .edit").click(function(){
                
            })
        }
    };
    
    Page.init();

});
