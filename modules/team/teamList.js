define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	
	// 分享
    var WXShare = require('team/wxshare.js');
    var title = "程序媛组队",
        desc = "程序媛组队第二期，和我一起学编程领100万奖学金。",
        link = location.href,
        imgUrl = "https://resource.bcgame-face2face.haorenao.cn/lg1024.png";
    WXShare.SetShareData(title, desc, link, imgUrl);
    
	var TEAM_LIST_URL = 'https://www.coding61.com/girl/app/team/teamList.html';
    var batch_type = 2;   //第二批组队, 创建队伍，获取队伍加此字段

	var Page = {
		token: null,
		code:Common.getQueryString('code'),
		init: function(){
			var this_ = this;
			
			//授权登录验证
			Common.isLogin(function(token){
				if (token == "null") {
					if (Page.code) {
						// 获取 token
						Team.getToken(Page.code);
					} else {
						// 微信网页授权
						var redirectUri = TEAM_LIST_URL;
						Common.authWXPageLogin(redirectUri);
					}
				}else{
					//已经授权，请求数据
					Team.batchDeal(function(isAuth){
						if(isAuth == "auth"){
							var redirectUri = TEAM_LIST_URL;
							Common.authWXPageLogin(redirectUri);
						}else{
							Page.token = Team.getValue("token");
							Team.getTeamList(Page.token, 1);
							Page.clickEvent();
						}
					});
				}
			})
			
			// Team.getTeamList(Page.token, 1);
			// Page.clickEvent();
		},
		clickEvent:function(){
			//team 点击事件
			$('.team-list li').unbind('click').click(function(e){
				e.stopPropagation();
				var pk = $(this).find(".team-detail").attr("data-pk"),
					name = $(this).find(".team-detail").attr("data-name");
				location.href = 'myTeam.html?pk=' + pk + '&name=' + name + '&flag=list';
			})
			
			//点赞
			$('.team-list li .team-zan').unbind('click').click(function(e){
				e.stopPropagation();
				var pk = $(this).attr("data-pk");
				if ($(this).hasClass("select")) return;
				Team.likeTeam(pk, $(this));
			})

			//搜索框焦点事件
			$('.search-team').focus(function(){$(this).val('')});

			//搜索出的 team 点击事件
			$('.team-search .search-div').unbind('click').click(function(){
				var pk = $(this).attr("data-pk"),
					name = $(this).attr("data-name");

				location.href = 'myTeam.html?pk=' + pk + '&name=' + name + '&flag=list'
			});

			//搜索点击事件
			$('.header .search-btn, .header .input-div img').unbind('click').click(function(){
				var searchData = $.trim($('.input-div .search-team').val());
				if (searchData) {
					Team.scrollTag = "search";
					Team.page_search = 1;
					Team.allowScroll_search = true;
					Team.noOthersShowToast_search = false;

					$('.team-list').css({'display': 'none'});
					$('.team-search').css({'display': 'block'}).empty();

					Team.getSearchTeam(Page.token, 1, searchData);
					Page.scroll();
				} else {
					Team.scrollTag = "all";
					Team.page = 1;
					Team.allowScroll = true;
					Team.noOthersShowToast = false;

					$('.team-list').css({'display': 'block'}).empty();
					$('.team-search').css({'display': 'none'});
					Team.getTeamList(Page.token, 1);
				}
			})
		},
		// 页面滚动监听
		scroll:function(){
			$(window).scroll(function(){
				var documentHeight = $(document).height();      //文档高度
				var windowHeight = $(window).height();          //可视窗口高度
				var scrollTop = $(window).scrollTop();          //滚动条高度
				
				// console.log("debug:滚动事件监听");
				if (Team.scrollTag == "all") {
					// 团队列表
					if (Team.allowScroll && !Team.noOthersShowToast) {
						Team.allowScroll = false;
						if($(document).height() <= $(window).height() + $(window).scrollTop() + 30){
							//当滚动条到底时,这里是触发内容
					        //异步请求数据,局部刷新dom
					        console.log("debug:到底，继续加载新的数据");
					        Team.getTeamList(Page.token, Team.page);
						}else{
							console.log("debug:没到底，不加载数据");
							Team.allowScroll = true;
						}
					}
					if (Team.noOthersShowToast && $(document).height() <= $(window).height() + $(window).scrollTop() + 30) {
						//当滚动条到底时,这里是触发内容
				        //数据已全部加载完毕
						console.log("debug:数据已全部加载完毕");
						Common.showToast("已显示所有团队");
						Team.noOthersShowToast = false;
						$(window).unbind('scroll');   //取消监听
					}
				}else if (Team.scrollTag === "search"){
					// 搜索列表
					if (Team.allowScroll_search && !Team.noOthersShowToast_search) {
						Team.allowScroll_search = false;
						if($(document).height() <= $(window).height() + $(window).scrollTop() + 30){
							//当滚动条到底时,这里是触发内容
					        //异步请求数据,局部刷新dom
					        console.log("debug:到底，继续加载新的数据");
					        Team.getSearchTeam(Page.token, Team.page_search, $('.input-div .search-team').val());
						}else{
							console.log("debug:没到底，不加载数据");
							Team.allowScroll_search = true;
						}
					}
					if (Team.noOthersShowToast_search && $(document).height() <= $(window).height() + $(window).scrollTop() + 30) {
						//当滚动条到底时,这里是触发内容
				        //数据已全部加载完毕
						console.log("debug:数据已全部加载完毕");
						Common.showToast('已显示所有搜索结果');
						Team.noOthersShowToast_search = false;
						$(window).unbind('scroll');   //取消监听
					}
				}
			})
		}
	}

	var Team = {
		scrollTag:"all",        //当前滚动列表 所有(all)、搜索(search)
		
		// 团队列表
		page:1,                    //分页
		allowScroll:true,          //是否可以滚动
		noOthersShowToast:false,   //没有数据了
		
		// 搜索列表
		page_search:1,
		allowScroll_search:true,
		noOthersShowToast_search:false,
		// 获取 token 请求
		getToken:function(code){
			$.ajax({
	            type:'post',
	            url:Common.domain + "/userinfo/code_login/",
	            data:{
	                code:code
	            },
	            timeout:6000,
	            success:function(json){
					Team.setValue("batch_type", batch_type);
	                Team.setValue("token", json.token);
					
					Page.token = json.token;
	                Team.getTeamList(json.token, Page.pageNum);
	            },
	            error:function(xhr, textStatus){
	                Team.failDealEvent(xhr, textStatus);
	            }
	        })
		},
		// 获取团队列表
		getTeamList: function(token, page){
			/*
			var dic = {
				"name":"活动名称",
				"announcement":"活动介绍-----附件案件发积分积分卡上课了防静电撒附近点击放大卡萨反馈了放假啊是放进阿萨德科技",
				"likes":100,
				"islike":true
			}
			var arr = []
			for (var i = 0; i < 10; i++) {
				arr.push(dic);
			}
			var json = {
				results:arr,
				pages:page,
			}
			if (page  == 1) {
				var html = ArtTemplate("team-list-1-template", json);
    			$(".team-list").html(html);
    			Page.scroll();
			} else {
				var html = ArtTemplate("team-list-2-template", json);
    			$(".team-list").append(html);
			}

			if (page === 3) {
				Team.noOthersShowToast = true;
			}else{
				Team.page += 1;
			}
			
			Team.allowScroll = true;
			
			*/
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/groups/ranking/?batch_type=' + batch_type,
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
						Team.page += 1;
					} else {
						Team.noOthersShowToast = true;
					}
					if (json.count > 0) {
        				json.pages = page;
						if (page  == 1) {
							var html = ArtTemplate("team-list-1-template", json);
	            			$(".team-list").html(html);
	            			Page.scroll();
            			} else {
            				var html = ArtTemplate("team-list-2-template", json);
	            			$(".team-list").append(html);
            			}
					}
					Team.allowScroll = true;

					Page.clickEvent();
				},
				error: function(xhr, textStatus){
	                Team.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 搜索结果团队列表
		getSearchTeam: function(token, page, search){
			/*
			var dic = {
				"name":"活动名称",
				"announcement":"活动介绍-----附件案件发积分积分卡上课了防静电撒附近点击放大卡萨反馈了放假啊是放进阿萨德科技",
				"likes":100,
				"islike":true
			}
			var arr = []
			for (var i = 0; i < 10; i++) {
				arr.push(dic);
			}
			var json = {
				results:arr,
				pages:page
			}
		
			if (json.results.length > 0) {
				var html = ArtTemplate('search-template', json.results);
				$('.team-search').append(html);
			} else {
				if (page == 1) {
					$('.team-search').append('<div class="none-search-team">没有相关战队信息<div>');
				}
			}
			if (page === 2) {
				Team.noOthersShowToast_search = true;
			}else{
				Team.page_search += 1;
			}
			Team.allowScroll_search = true;
			*/
			$.ajax({
				type: 'get',
				url: Common.domain + '/userinfo/groups/ranking/search/?batch_type=' + batch_type,
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
						Team.page_search += 1;
					} else {
						Team.noOthersShowToast_search = true;
					}
					if (json.count > 0) {
						var html = ArtTemplate('search-template', json.results);
						$('.team-search').append(html);
					} else {
						if (page == 1) {
							$('.team-search').append('<div class="none-search-team">没有相关战队信息<div>');
						}
					}
					Team.allowScroll_search = true;
					Page.clickEvent();
				},
				error: function(xhr, textStatus){
					Team.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 点赞
		likeTeam: function(pk, event){
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
					Team.failDealEvent(xhr, textStatus);
				}
			})
		},
		// 请求失败处理方法
        failDealEvent:function(xhr, textStatus, my_team_url){
            Common.hideLoading();
            $(".wait-loading").hide();
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                // token 失效, 重新授权
                // 先微信授权登录
                // 微信网页授权
                var redirectUri = my_team_url?my_team_url:TEAM_LIST_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                Common.dialog("未找到");
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                if (JSON.parse(xhr.responseText).name) {
                    Common.dialog('团队名称已被占用');
                }else{
                    var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                    Common.dialog(msg);
                }
                return;
            }else if(xhr.status == 0){
                Common.dialog("网络未连接，请检查网络后重试。");
                return;
            } else{
                Common.dialog('服务器繁忙');
                return;
            }
        },


		// ---------帮助方法
		// 关于批次处理
        batchDeal:function(callback){
            if(Team.getValue("token")){
                console.log("debug:有 token 的情况,判断是第二批还是第一批的用户");
                // 有 token 的情况,判断是第二批还是第一批的用户
                if(parseInt(Team.getValue("batch_type")) == batch_type){
                    // 第二批用户，不做处理
					console.log("debug:第二批用户，不做处理");
					if(callback){
						callback("noauth");
					}
                }else{
                    // 非第二批用户，移除 token,让其重新授权
                    console.log("debug:非第二批用户，移除 token,让其重新授权");
					Team.reomveValue("token");
					if(callback){
						callback("auth");
					}
                }
            }else{
                // 没有 token，不做处理
				console.log("debug:没有 token，不做处理");
				if(callback){
					callback("auth");
				}
            }
        },
        setValue:function(key, value){
            if (window.localStorage) {
                localStorage[key] = value;
            }else{
                $.cookie(key, value, {path:"/"});
            }
        },
        reomveValue:function(key){
            if(window.localStorage){
                localStorage.removeItem(key);
            }else{
                $.cookie(key, null, {
                    path: "/"
                });
            }
        },
        getValue:function(key){
        	var value = null;
            if (window.localStorage) {
            	value = localStorage[key];
            }else{
				value = $.cookie(key);
            }
            
            try{
            	value = JSON.parse(value)
            }
            catch(error){
            	value = value
            }
            return value;
        }
	}

	Page.init();
})