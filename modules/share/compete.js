define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	var pk = Common.getQueryString("pk");

    var Page = {
        init:function(){
			$('.download').click(function() {
				Page.download();
			})
            // Page.loadClubDetails(pk);
            Page.loadCompeteDetails(pk)
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
					$('.item-connect, .item-more').click(function() {
						Page.download();
					})
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
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
    						Page.download();
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
        },

		download: function () {
	        if (Page.checkIsAppleDevice()) {
	            window.location.href = "https://itunes.apple.com/us/app/%E7%A8%8B%E5%BA%8F%E5%AA%9B-%E8%AE%A9%E6%9B%B4%E5%A4%9A%E5%A5%B3%E6%80%A7%E5%AD%A6%E4%BC%9A%E7%BC%96%E7%A8%8B/id1273955617?l=es&mt=8";
	        } else {
	            alert('安卓版本正在开发中...');
	        }
	    },

		checkIsAppleDevice: function() {
	        var u = navigator.userAgent, app = navigator.appVersion;
	        var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	        var iPad = u.indexOf('iPad') > -1;
	        var iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
	        if (ios || iPad || iPhone) {
	            return true;
	        } else {
	            return false;
	        }
	    }
    };
    Page.init();

});
