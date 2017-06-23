define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

	var Page = {
		isScroll: true,
		token: null,
		pageNum: 1,
		allowScroll: true,
		noOthersShowToast: false,
		init: function(){
			var this_ = this;
			//授权登录验证
			Common.isLogin(function(token){
				if (token == "null") {
					if (Common.getQueryString('code')) {
						getToken(Common.getQueryString('code'))
					} else {
						// 微信网页授权
						var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/teamList.html';
						Common.authWXLogin(redirectUri);
					}
				}else{
					//已经授权，请求数据
					this_.token = localStorage.token
					this_.getTeamList(this_.token, this_.pageNum);
					//团队中心
					$('.team-list').on('click', 'li .team-detail', function(){
						var this_ = $(this);
						location.href = '/app/home/myTeam.html?pk=' + this_.attr('data-pk') + '&name=' + this_.attr('data-name') + '&flag=list'
					})
					
					//点赞
					$('.team-list').on('click', 'li .team-zan', function(event){
						var this_ = $(this);
						likeTeam(this_.attr('data-pk'), this_);
					})

					Search.init();
				}
			})
		},
		getTeamList: function(token, page){
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/groups/ranking/',
				headers: {
					Authorization: 'Token ' + token,
					'Content-Type': 'application/json'
				},
				data: {
					page: page
				},
				dataType: 'json',
				timeout: 6000,
				success: function(json){
					if (json.next) {
						Page.pageNum += 1;
					} else {
						Page.noOthersShowToast = true;
					}
					if (json.count > 0) {
        				json.pages = page;
						if (page  == 1) {
							var html = ArtTemplate("team-list-1-template", json);
	            			$(".team-list").html(html);
	            			scroll();
            			} else {
            				var html = ArtTemplate("team-list-2-template", json);
	            			$(".team-list").append(html);
            			}
					}
					Page.allowScroll = true;
				},
				error: function(xhr, textStatus){
	                if (textStatus == "timeout") {
	                    Common.dialog("请求超时");
	                    return;
	                }
	                if (xhr.status == 400 || xhr.status == 403) {
	                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
	                    return;
	                } else {
	                    Common.dialog('服务器繁忙');
	                    return;
	                }
	                console.log(textStatus);	
				}
			})
		}
	}
	var Search = {
		isScroll: false,
		pageNum: 1,
		allowScroll: true,
		noOthersShowToast: false,
		searchData: null,
		init: function(){
			//myTeam
			$('.team-search').on('click', '.search-div', function(){
				var this_ = $(this);
				location.href = '/app/home/myTeam.html?pk=' + this_.attr('data-pk') + '&name=' + this_.attr('data-name') + '&flag=list'
			});

			//搜索
			$('.header .search-btn, .header .input-div img').click(function(){
				var searchData = $.trim($('.input-div .search-team').val());
				if (searchData) {
					Page.isScroll = false;
					Search.isScroll = true;
					Search.allowScroll = true;
					Search.noOthersShowToast = false;
					Search.pageNum = 1;
					$('.team-list').css({'display': 'none'});
					$('.team-search').css({'display': 'block'}).empty();
					Search.getSearchTeam(Page.token, Search.pageNum, searchData);
					scroll();
				} else {
					Search.isScroll = false;
					Page.isScroll = true;
					Page.allowScroll = true;
					Page.noOthersShowToast = false;
					Page.pageNum = 1;
					$('.team-list').css({'display': 'block'}).empty();
					$('.team-search').css({'display': 'none'});
					Page.getTeamList(Page.token, Page.pageNum);
				}
			})
		},
		getSearchTeam: function(token, page, search){
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/groups/ranking/search/',
				headers: {
					Authorization: 'Token ' + token,
					'Content-Type': 'json/application'
				},
				data: {
					page: page,
					search: search
				},
				dataType: 'json',
				success: function(json){
					if (json.next) {
						Search.pageNum += 1;
					} else {
						Search.noOthersShowToast = true;
					}
					if (json.count > 0) {
						var html = ArtTemplate('search-template', json.results);
						$('.team-search').append(html);
					} else {
						if (page == 1) {
							$('.team-search').append('<div class="none-search-team">没有相关战队信息<div>');
						}
					}
					Search.allowScroll = true;
				},
				error: function(xhr, textStatus){
					if (textStatus == "timeout") {
	                    Common.dialog("请求超时");
	                    return;
	                }
	                if (xhr.status == 400 || xhr.status == 403) {
	                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
	                    return;
	                } else {
	                    Common.dialog('服务器繁忙');
	                    return;
	                }
	                console.log(textStatus);	
				}
			})
		}
	}

	//页面滚动事件
	function scroll(){
		$(document).scroll(function(){
			var scroll, win_scroll;
			if (Page.isScroll) {
				if (Page.allowScroll && !Page.noOthersShowToast) {
					Page.allowScroll = false;
					scroll = $(document).scrollTop();
					win_scroll = $(document).height() - $(window).height();
					if (parseInt(win_scroll) - parseInt(scroll) < 30) {
						Page.getTeamList(Page.token, Page.pageNum);
					} else {
						Page.allowScroll = true;
					}
				}
				if (Page.noOthersShowToast && parseInt($(document).height() - $(window).height()) - parseInt($(document).scrollTop()) < 30) {
					Common.showToast('已显示所有团队');
					Page.noOthersShowToast = false;
					$(document).unbind();
				}
			} else if (Search.isScroll) {
				if (Search.allowScroll && !Search.noOthersShowToast) {
					Search.allowScroll = false;
					scroll = $(document).scrollTop();
					win_scroll = $(document).height() - $(window).height();
					if (parseInt(win_scroll) - parseInt(scroll) < 30) {
						Search.getSearchTeam(Page.token, Search.pageNum, Search.searchData);
					} else {
						Search.allowScroll = true;
					}
				}
				if (Search.noOthersShowToast && parseInt($(document).height() - $(window).height()) - parseInt($(document).scrollTop()) < 30) {
					Common.showToast('已显示所有搜索结果');
					Search.noOthersShowToast = false;
					$(document).unbind();
				}
			}
		})
	}

	//点赞
	function likeTeam(pk, event){
		$.ajax({
			type: 'post',
			url: Common.domain + '/userinfo/groups/likes/' + pk + '/',
			headers: {
				Authorization: 'Token ' + Page.token,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				'page': event.attr('data-page')
			}),
			timeout: 6000,
			dataType: 'json',
			success: function(json){
				Common.dialog('点赞成功');
				event.find('p').text(parseInt(event.find('p').text()) + 1);
				event.find('img').attr({
					'src': '../../statics/images/team-zan-p.png'
				});
			},
			error: function(xhr, textStatus){
				if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                } else {
                    Common.dialog('服务器繁忙');
                    return;
                }
                console.log(textStatus);	
			}
		})
	}

	//get Token
	function getToken(code){
		$.ajax({
            type:'post',
            url:Common.domain + "/userinfo/code_login/",
            data:{
                code:code
            },
            timeout:6000,
            success:function(json){
                if(window.localStorage){
                    localStorage.token = json.token;
                }else{
                    $.cookie("token", json.token, {
                        path: "/"
                    });
                }
				
				Page.token = json.token;
                Page.getTeamList(json.token, Page.pageNum);
            },
            error:function(xhr, textStatus){
                $(".wait-loading").hide();

                if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                }else if (xhr.status == 401) {
                    var redirectUri = null;
                    if (Team.pk) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/teamList.html?pk=' + Team.pk + "&name=" + Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/teamList.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }else{
                    Common.dialog('服务器繁忙');
                    return;
                }
                console.log(textStatus);
            }
        })
	}

	Page.init();
})