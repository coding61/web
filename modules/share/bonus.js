define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	var pk = Common.getQueryString("pk");

    var Page = {
        init:function(){
			$('.download').click(function() {
				Common.download();
			})
            Page.loadCompeteDetails(pk)
        },

        loadCompeteDetails:function(pk) {
            $.ajax({
                type: "get",
                url: Common.domain + "/contest/" + pk + "/question",
                headers: {
                },
                success:function(json){
                    if (json.results.length == 0) {
                        alert('该竞赛下暂无题目');
                    } else {
                        // 可能有多个题目，但目前还未设计对应 UI，先展示一个题目
                        var dataList = [];
                        dataList.push(json.results[0]);
                        var html = template('details-template', dataList);
                        $('.details').html(html);
                        $('.answer').click(function() {
							Common.download();
    					})

                        var question = null;
                        question = json.results[0].title.replace(/\r\n/g,"<br>");
    					question = json.results[0].title.replace(/\n/g,"</br>");
                        $('.item-content').html(question);
                    }
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },

        // 异常处理
        exceptionHandling:function(xhr, textStatus) {
    		if (textStatus == "timeout") {
    			Common.dialog("请求超时");
    			return;
    		}
    		if (xhr.status == 400 || xhr.status == 403) {
    			Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
    			return;
    		}else{
    			Common.dialog('服务器繁忙');
    			return;
    		}
        }
    };
    Page.init();
});
