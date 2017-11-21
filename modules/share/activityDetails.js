define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var clubs_url = Common.domain + "/club/clubs/";
    var join_url  = Common.domain + "/club/myclub/?types=join";
    var push_url  = Common.domain + "/club/myclub/?types=create"
    var data_list = [];
    var tag = null;

    var Page = {
        init:function(){

            Page.loadClubDetails(35);
        },

        // 获取活动详情
        loadClubDetails:function(pk) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/club_detail/" + pk + "/",
                headers: {
                },
                success:function(json){
                    for (var i = 0; i < json.club_member.length; i++) {
                        if (json.club_member[i].leader) {
                            json.leader_name = json.club_member[i].owner.name;
                            break;
                        }
                    }



                    var dataList = [];
                    dataList.push(json);
                    var html = template('details-template', dataList);
                    $('.details').html(html);

                    json.introduction = json.introduction.replace(/\r\n/g,"<br>");
					json.introduction = json.introduction.replace(/\n/g,"");
                    $('.item-content').html(json.introduction);

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
        },
    };
    Page.init();

});
