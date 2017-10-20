//var token="f398c224a8a052bb9ba5fe278acb1128043bfd8e";
var basePath="/program_girl";
var pageId=-1;
var zoneId = getQueryString("id");
$('.fly-tab .searchinput').val(sessionStorage.searchPostContent);
// 进到程序媛计划
$('.logo1').click(function() {
	window.location.href = "../app/home/home.html"
})
// 打开儿童编程窗口
$('.logo2').click(function() {
	window.open("https://www.cxy61.com");
})
$('.jie-add1').unbind().click(function(){
	if (localStorage.token && localStorage.token != null && localStorage.token != '') {
		$.ajax({
	        url: basePath+"/forum/posts_check/",
	        type: "get",
	        headers: {
	            Authorization: 'Token ' + localStorage.token
	        },
	        success: function(result) {
	        	if (result.message == '该用户可以发帖') {
	        		window.location.href="add.html?pk="+getQueryString("id");
	        	}
	        },
	        error:function(XMLHttpRequest){
	        	console.log(XMLHttpRequest.status)
	        	if(XMLHttpRequest.status==400){
	        		layer.msg("当前未解决的帖子数量过多，请先标记它们为已解决或已完成");
	        	}else{
	        		layer.msg("已被禁言");
	        	}
	        }
	    });	
	}else{
	 	layer.msg("请先登录");
	}
	
});

// 融云单聊
var demo = angular.module("demo", ["RongWebIMWidget"]);
demo.controller("main", ["$scope", "WebIMWidget", "$http", function($scope, WebIMWidget, $http) {
    // $(document).on("click", '.fly-list-li img', function() {
    	$scope.targetType = 1; //1：私聊 更多会话类型查看http://www.rongcloud.cn/docs/api/js/global.html#ConversationType
	    // $scope.targetId = 'opSbp1JARhmzgmez9yObTt9aSybs2';
	    myAjax(basePath+"/im/user_get_token/","get",null,function(result) {
	        if(result){
	           //注意实际应用中 appkey 、 token 使用自己从融云服务器注册的。
	            var config = {
	                appkey: '8w7jv4qb7eqty',
	                token: result.token,
	                displayConversationList: true,
	                style:{
	                    left:3,
	                    bottom:3,
	                    width:430,
	                },
	                onSuccess: function(id) {
	                	$('.rongcloud-kefuBtnBox').css({"position": "fixed"});
	                	$('.rongcloud-kefuListBox').css({"position": "fixed"});
	                	$('.rongcloud-kefuChatBox.rongcloud-both').css({"position": "fixed"});
	                    $scope.user = id;
	                    // document.title = '用户：' + id;
	                    console.log('连接成功：' + id);
	                    
	                    // $('.rongcloud-kefuChatBoxHide').hide();
	                    WebIMWidget.display = false;
	                    //会话面板被关闭时
	                    WebIMWidget.onClose = function() {
	                      //do something
	                      // $('.rongcloud-kefuBtnBox').hide();
	                    }

	                    //接收到消息时
	                    WebIMWidget.onReceivedMessage = function(message) {
	                        //message 收到的消息
	                        console.log(message);
	                        // 与其他人聊
	                        if (message.targetId) {

	                        } else { //和自己聊
	                        	message.targetId = message.senderUserId;
	                        }
	                        // 根据id获取用户信息
                        	$http({
			                    url: basePath + "/userinfo/username_userinfo/?username=" + message.targetId,
			                }).success(function(rep){
			                	// 设置当前会话
			                	WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE,message.targetId,rep.name);
			                	// 设置会话列表中的用户信息及会话窗口中他人用户信息
		                    	WebIMWidget.setUserInfoProvider(function(targetId,obj){
		                    		var localTalkList = {"userlist":[]};
		                    		if (localStorage.localTalkList) {
		                    			localTalkList = JSON.parse(localStorage.localTalkList);
		                    			var user;
							            if (localTalkList && localTalkList.userlist.length > 0) {
							              	localTalkList.userlist.forEach(function(item){
							                	if(item.id==targetId){
							                  		user=item;
							                	}
							                })
							            }
							            if(user){
								            // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
								            console.log(targetId);
							                obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
						                }else{
						                	$http({
							                    url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
							                }).success(function(rep){
							                	obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
								            	localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
								            	localStorage.localTalkList = JSON.stringify(localTalkList);
							                }).error(function(err) {

							                })
						            		
							            }
		                    		} else {
					            		obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
						            	localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
						            	localStorage.localTalkList = JSON.stringify(localTalkList);
		                    		}
						        });
			                }).error(function(err) {

			                })
	                    }
	                    $(document).on("click", '.fly-list-li img', function() {
	                    	var name = $(this).attr("name");
	                    	var targetId = $(this).attr("ng-model");
	             
	                    	// 设置当前会话
		                    WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE,targetId,name);
		                    //呈现会话面板
	                    	WebIMWidget.show();
	                    	// 设置会话列表中的用户信息及会话窗口中他人用户信息
	                    	WebIMWidget.setUserInfoProvider(function(targetId,obj){
	                    		var localTalkList = {"userlist":[]};
	                    		if (localStorage.localTalkList) {
	                    			localTalkList = JSON.parse(localStorage.localTalkList);
	                    			var user;
						            if (localTalkList && localTalkList.userlist.length > 0) {
						              	localTalkList.userlist.forEach(function(item){
						                	if(item.id==targetId){
						                  		user=item;
						                	}
						                })
						            }
						            if(user){
							            // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
							            console.log(targetId);
						                obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
					                }else{
						            	// 根据id获取用户信息
			                        	$http({
						                    url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
						                }).success(function(rep){
						                	obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
							            	localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
							            	localStorage.localTalkList = JSON.stringify(localTalkList);
						                }).error(function(err){

						                })
						            }
	                    		} else {
	                    			// 根据id获取用户信息
		                        	$http({
					                    url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
					                }).success(function(rep){
					                	obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
						            	localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
						            	localStorage.localTalkList = JSON.stringify(localTalkList);
					                }).error(function(err){

					                })					            		
	                    		}
					        });
	                    });
	                    // 用户信息设置,设置自己的信息
			            WebIMWidget.setUserInfoProvider(function(targetId,obj){
			                var localTalkList = {"userlist":[]};
                    		if (localStorage.localTalkList) {
                    			localTalkList = JSON.parse(localStorage.localTalkList);
                    			var user;
					            if (localTalkList && localTalkList.userlist.length > 0) {
					              	localTalkList.userlist.forEach(function(item){
					                	if(item.id==targetId){
					                  		user=item;
					                	}
					                })
					            }
					            if(user){
						            // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
						            console.log(targetId);
					                obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
				                }else{
				                	$http({
					                    url: basePath + "/userinfo/whoami/",
					                    headers: {
					                        'Authorization': "Token " + localStorage.token
					                    },
					                    params:{
					                        'userId': targetId
					                    }
					                }).success(function(rep){
					                	console.log(rep);
					                    if (rep) {
					                        obj.onSuccess({userId: targetId, name: rep.name, portraitUri: rep.avatar})
					                    }
					                }).error(function(err) {

					                })
					            }
                    		} else {
                    			$http({
				                    url: basePath + "/userinfo/whoami/",
				                    headers: {
				                        'Authorization': "Token " + localStorage.token
				                    },
				                    params:{
				                        'userId': targetId
				                    }
				                }).success(function(rep){
				                	console.log(rep);
				                    if (rep) {
				                    // console.log(targetId);
				                        obj.onSuccess({userId: targetId, name: rep.name, portraitUri: rep.avatar})
				                    }
				                }).error(function(err) {

				                })
                    		}
			            });
	                },
	                onError: function(error) {
	                    console.log('连接失败：' + error);
	                }
	            };
	            RongDemo.common(WebIMWidget, config, $scope);  
	            
	        }else{
	        }
	    })

	// });
}]);


//var basePath="http://10.144.238.71:8080/wodeworld/";
//var basePath="http://www.wodeworld.cn:8080/wodeworld3.0/";
myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
	if(result){
		$('.avatar img').attr({src: result.avatar});//用户头像
		$('.info .grade').html(result.grade.current_name);//用户段位等级
		$('.info .grade-value').html(result.experience + '/' + result.grade.next_all_experience);
		$('.zuan span').html("x"+result.diamond);
		var percent = (parseInt(result.experience)-parseInt(result.grade.current_all_experience))/(parseInt(result.grade.next_all_experience)-parseInt(result.grade.current_all_experience))*$(".info-view").width();
        $(".progress img").css({
            width:percent
        })
	}else{
	}
})
myAjax2(basePath+"/forum/sections/"+zoneId+"/","get",null,function(result){
	getPostByType(sessionStorage.typeId,null,sessionStorage.page,sessionStorage.searchPostContent,sessionStorage.myPost,null);
});

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function getPostByType(typeId,essence,page,keyword,myposts,status){
	$("#bbsUl").empty();
	var html="";
	if(typeId==-1){
		essence=null;
		typeId=null;
	}else if(typeId==0){
		essence=true;
		typeId=null;
	}else{
		essence=null;
	}
	if (myposts == 'true') {
		zoneId = null;
	} else {
		zoneId = getQueryString("id");
	}
	// 查询帖子接口
	var url = "/forum/posts/";
	var data = {"section":zoneId,"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,"page":page,"status":sessionStorage.postStatus};
	if (sessionStorage.myPost == 'true') {
		document.getElementById("cars").options[1].selected=true;
		url = "/forum/posts/";
		data = {"section":zoneId,"types":typeId,"isessence":essence,"keyword":keyword,"myposts":myposts,"page":page,"status":sessionStorage.postStatus};
	} else if (sessionStorage.myCollect == 'true') {
		document.getElementById("cars").options[2].selected=true;
		// 收藏接口
		url = "/collect/collections/";
		data = null;
	} else if (sessionStorage.myMessage == 'true') {
		document.getElementById("cars").options[3].selected=true;
		// 消息列表接口
		url = "/message/messages/";
		data = {"types":"forum","status":status};
	}
		myAjax(basePath+url,"get",data,function(result){
			if(result.count>10){
				$("#pagination").show();
				$("#PageCount").val(result.count);
				// if(page<=1){
					loadpage();
				// }
			}else{
				$("#pagination").hide();
			}
			if(result.results.length==0){
				html='<p style="text-align:center;line-height:500px;color:#999;font-size:18px;letter-spacing:1px;">该类别暂无帖子</p>';
			}
			// 帖子列表
			if (url == '/forum/posts/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					if (v.content) {
						v.content = v.content.replace(/</g,'&lt;');
						v.content = v.content.replace(/>/g,'&gt;');
					}
					if (v.title) {
						v.title = v.title.replace(/>/g,'&gt;');
						v.title = v.title.replace(/</g,'&lt;');
					}
					var name='';
					if(v.userinfo.name){
						name=v.userinfo.name;
					}else{
						name=v.userinfo.owner;
					}
					html+='<li class="fly-list-li">'
						+'<img src="'+dealWithAvatar(v.userinfo.avatar)+'"ng-model="'+v.userinfo.owner+'"name="'+v.userinfo.name+'">'
						if (v.userinfo.is_staff) {
							html+='<span class="manager">管理员</span>'
						}
						html+='<span class="grade">'+v.userinfo.grade.current_name+'</span>'
						+'<h2 class="fly-tip">'
						if (v.status_display == '未解决') {
							html+='<span class="unsolved">[未解决]</span>'
						} else if (v.status_display == '已解决') {
							html+='<span class="solved">[已解决]</span>'
						} else if (v.status_display == '已关闭') {
							html+='<span class="finish">[已关闭]</span>'
						}          
						html+='<a href="detail.html?id='+v.pk+'&pk='+getQueryString("id")+'">'+v.title+'</a>'         
						if(v.istop){
							html+='<span class="fly-tip-stick">置顶</span>'
						}
						if(v.isessence){
							html+='<span class="fly-tip-jing">精帖</span> '
						}          
					    html +='</h2><p>'
					    if (v.content) {
					    	html+='<span class="v_content">'+v.content+'</span>'
					    }
						html+='<span>'+name+'</span>'
						if (v.last_replied) {
							html+='<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.last_replied)+'</span>'
						} else {
							html+='<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
						}						
						html+='<span class="fly-list-hint">'             
						+'<i class="iconfont" title="回帖+回复"></i>'+(v.reply_count)          
						+'<i class="iconfont" title="人气"></i>'+v.browse_count        
						+'</span></p></li>';
				})
			}
			// 收藏列表
			else if (url == '/collect/collections/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					if (v.posts.content) {
						v.posts.content = v.posts.content.replace(/</g,'&lt;');
						v.posts.content = v.posts.content.replace(/>/g,'&gt;');
					}
					if (v.posts.title) {
						v.posts.title = v.posts.title.replace(/>/g,'&gt;');
						v.posts.title = v.posts.title.replace(/</g,'&lt;');
					}
					var name='';
					if(v.posts.userinfo.name){
						name=v.posts.userinfo.name;
					}else{
						name=v.posts.userinfo.owner;
					}
					html+='<li class="fly-list-li">'
						+'<img src="'+dealWithAvatar(v.posts.userinfo.avatar)+'">'
						if (v.posts.userinfo.is_staff) {
							html+='<span class="manager">管理员</span>'
						}
						html+='<span class="grade">'+v.posts.userinfo.grade.current_name+'</span>'
						+'<h2 class="fly-tip">'          
						+'<a href="detail.html?id='+v.posts.pk+'&pk='+getQueryString("id")+'">'+v.posts.title+'</a>'         
						if(v.posts.istop){
							html+='<span class="fly-tip-stick">置顶</span>'
						}
						if(v.posts.isessence){
							html+='<span class="fly-tip-jing">精帖</span> '
						}          
					    html +='</h2><p>'
					    if (v.posts.content) {
					    	html+='<span class="v_content">'+v.posts.content+'</span>'
					    }
				
						html+='<span>'+name+'</span>'
						+'<span class="liveTime"  title="'+dealWithTime(v.posts.create_time)+'">'+dealWithTime(v.posts.create_time)+'</span>'
						
						+'<span class="fly-list-hint">'             
						+'<i class="iconfont" title="回帖+回复"></i>'+(v.posts.reply_count)          
						+'<i class="iconfont" title="人气"></i>'+v.posts.browse_count        
						+'</span></p></li>';
				})
			}
			// 消息列表
			else if (url == '/message/messages/') {
				$.each(result.results,function(i,v){
					// 替换'<'和'>'
					v.text = v.text.replace(/</g,'&lt;');
					v.text.content = v.text.replace(/>/g,'&gt;');
					html+='<li class="messageLi">'
						if (v.status == 'read') {
							html+='<div class="readMessage">[已读]</div>'
						} else if (v.status == 'unread') {
							html+='<div class="unreadMessage">[未读]</div>'
						}
					html+='<h2 class="content">'          
						+'<a href="#" class="messageTitle" message-pk="'+v.pk+'">'+v.text+'</a>'         
					    +'</h2>'
						+'<span class="liveTime"  title="'+dealWithTime(v.create_time)+'">'+dealWithTime(v.create_time)+'</span>'
						+'</li>';
				})
			}
			$("#bbsUl").append(html);
			liveTimeAgo();
			})
	
}
// 点击消息
$(document).on("click", ".messageTitle", function() {
	var messagePk = $(this).attr("message-pk");
	$.ajax({
		url: basePath+"/message/messages/"+messagePk+"/",
		type: "get",
		headers:{
			Authorization: 'Token ' + localStorage.token
		},
		success: function(result){
			console.log(result);
			if (result) {
				var p = result.url.split("cxyteam_forum/")[1];
				window.location.href = p;
			}
		},
		error: function(XMLHttpRequest){
			console.log(XMLHttpRequest);
			if (XMLHttpRequest.status == 403) {
				layer.msg('该帖子已删除');
			}
		}
	})
})

// 搜索
$('.fly-tab .searchTiezi').click(function() {
	var searchContent = $('.fly-tab .searchinput').val();
	console.log(searchContent);
	if (searchContent == '') {
		layer.msg("请输入帖子主题");
	} else {
		sessionStorage.searchPostContent = searchContent;
		sessionStorage.page = 1;
		sessionStorage.removeItem("myPost");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("myCollect");
		sessionStorage.removeItem("myMessage");
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		document.getElementById("cars").options[0].selected=true;
		getPostByType(-1,null,sessionStorage.page,searchContent);
	}
})
// 我的帖子
// $('.myTie').click(function() {

// 	$('.fly-tab .searchinput').val('');
// 	sessionStorage.removeItem("searchPostContent");
// 	sessionStorage.removeItem("postStatus");
// 	sessionStorage.page = 1;
// 	sessionStorage.myPost = true;
// 	$(".fly-tab-span a").each(function() {
// 		$(this).removeClass("tab-this");
// 	});
// 	getPostByType(-1,null,sessionStorage.page,null,sessionStorage.myPost);
// })
// 我的下拉菜单选择
function mySelectHadChange(mySelect) {
	if (mySelect == 'myTie') {
		$('.fly-tab .searchinput').val('');
		sessionStorage.removeItem("searchPostContent");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("myCollect");
		sessionStorage.removeItem("myMessage");
		sessionStorage.page = 1;
		sessionStorage.myPost = true;
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		getPostByType(-1,null,sessionStorage.page,null,sessionStorage.myPost);
	} else if (mySelect == 'myCollect') {
		$('.fly-tab .searchinput').val('');
		sessionStorage.removeItem("searchPostContent");
		sessionStorage.removeItem("postStatus");
		sessionStorage.removeItem("typeId");
		sessionStorage.removeItem("myPost");
		sessionStorage.removeItem("myMessage");
		sessionStorage.page = 1;
		$(".fly-tab-span a").each(function() {
			$(this).removeClass("tab-this");
		});
		sessionStorage.myCollect = true;
		// getMyCollect();
		getPostByType();
	} else if (mySelect == 'myMessage') {
		// $('.fly-tab .searchinput').val('');
		// sessionStorage.removeItem("searchPostContent");
		// sessionStorage.removeItem("postStatus");
		// sessionStorage.removeItem("typeId");
		// sessionStorage.removeItem("myPost");
		// sessionStorage.removeItem("myCollect");
		// sessionStorage.page = 1;
		// $(".fly-tab-span a").each(function() {
		// 	$(this).removeClass("tab-this");
		// });
		// sessionStorage.myMessage = true;
		// getPostByType();
		document.getElementById("cars").options[0].selected=true;
		window.location.href = "message.html";
	} 
}
// 获取我的收藏
// function getMyCollect() {
// 	myAjax(basePath+"/collect/collections/","get",null,function(result){
// 		$("#bbsUl").empty();
// 		var html="";
// 		if(result.count>10){
// 			$("#pagination").show();
// 			$("#PageCount").val(result.count);
// 			// if(page<=1){
// 				loadpage();
// 			// }
// 		}else{
// 			$("#pagination").hide();
// 		}
// 		if(result.results.length==0){
// 			html='<p style="text-align:center;line-height:500px;color:#999;font-size:18px;letter-spacing:1px;">无收藏帖子</p>';
// 		}
// 		$.each(result.results,function(i,v){
// 			// 替换'<'和'>'
// 			v.posts.content = v.posts.content.replace(/</g,'&lt;');
// 			v.posts.content = v.posts.content.replace(/>/g,'&gt;');
// 			v.posts.title = v.posts.title.replace(/>/g,'&gt;');
// 			v.posts.title = v.posts.title.replace(/</g,'&lt;');
// 			var name='';
// 			if(v.posts.userinfo.name){
// 				name=v.posts.userinfo.name;
// 			}else{
// 				name=v.posts.userinfo.owner;
// 			}
// 			html+='<li class="fly-list-li">'
// 				+'<img src="'+dealWithAvatar(v.posts.userinfo.avatar)+'">'
// 				+'<span class="grade">'+v.posts.userinfo.grade.current_name+'</span>'
// 				+'<h2 class="fly-tip">'          
// 				+'<a href="detail.html?id='+v.posts.pk+'&pk='+getQueryString("id")+'">'+v.posts.title+'</a>'         
// 				if(v.posts.istop){
// 					html+='<span class="fly-tip-stick">置顶</span>'
// 				}
// 				if(v.posts.isessence){
// 					html+='<span class="fly-tip-jing">精帖</span> '
// 				}          
// 			    html +='</h2><p>'
// 			    +'<span class="v_content">'+v.posts.content+'</span>'
// 				+'<span>'+name+'</span>'
// 				+'<span class="liveTime"  title="'+dealWithTime(v.posts.create_time)+'">'+dealWithTime(v.posts.create_time)+'</span>'
				
// 				+'<span class="fly-list-hint">'             
// 				+'<i class="iconfont" title="回帖+回复"></i>'+(v.posts.reply_count)          
// 				+'<i class="iconfont" title="人气"></i>'+v.posts.browse_count        
// 				+'</span></p></li>';
// 		})
// 		$("#bbsUl").append(html);
// 		liveTimeAgo();
// 	})
// }
// 返回论坛
$('.jie-add').click(function() {
	sessionStorage.removeItem("searchPostContent");
	sessionStorage.removeItem("myPost");
	sessionStorage.removeItem("page");
	sessionStorage.removeItem("typeId");
	sessionStorage.removeItem("postStatus");
	sessionStorage.removeItem("myCollect");
	sessionStorage.removeItem("myMessage");
	window.location.href="bbs.html";
})
// 点击帖子类型
$(document).ready(function(){
	$(".fly-tab-span>a").click(function(){
		$(this).addClass("tab-this").siblings().removeClass("tab-this");
	})
})
initTypes();
function initTypes(){
	// 不显示类型，只显示全部和精帖
	// myAjax2(basePath+"/forum/types/","get",null,function(result){
	// 	console.log(result);
	// 	$.each(result.results, function(k,v) {
	// 		$(".fly-tab-span").append('<a href="javascript:void(0);" data-pk="'+v.pk+'">'+v.name+'</a>');
	// 	});
		// 已解决状态
		$(".fly-tab-span").append('<a class="solved">已解决</a>');
		// 未解决状态
		$(".fly-tab-span").append('<a class="unsolved">未解决</a>');
	// },false);
	
	$(".fly-tab-span a").each(function() {
		if (sessionStorage.typeId) {
			if ($(this).attr("data-pk") == sessionStorage.typeId) {
				$(this).addClass("tab-this").siblings().removeClass("tab-this");
			}
		} else if (sessionStorage.postStatus == 'solved') {
			$(this).addClass("tab-this").siblings().removeClass("tab-this");
		} else if (sessionStorage.postStatus == 'unsolved') {
			$(this).addClass("tab-this").siblings().removeClass("tab-this");
		}
	})
}
$('.fly-tab-span a').unbind().click(function(){
	$('.fly-tab .searchinput').val('');
	sessionStorage.removeItem("searchPostContent");
	sessionStorage.removeItem("myPost");
	sessionStorage.removeItem("myCollect");
	sessionStorage.removeItem("myMessage");
	sessionStorage.page = 1;
	// var mySelect = document.getElementById("cars");
	// console.log(document.getElementById("cars").options[mySelect.selectedIndex].value);
	// select value为第一个
	document.getElementById("cars").options[0].selected=true;
	if($(this).attr('data-pk')==-1){
		sessionStorage.removeItem("postStatus");
		getPostByType(-1,null,sessionStorage.page);
		pageId=-1;
		sessionStorage.typeId = -1;
	}else if($(this).attr('data-pk')==0){
		sessionStorage.typeId = 0;
		sessionStorage.removeItem("postStatus");
		getPostByType(0,true,sessionStorage.page);
		pageId=0;
	}else if ($(this).attr('class') == 'solved') {
		sessionStorage.postStatus = 'solved';
		sessionStorage.removeItem("typeId");
		getPostByType(null,null,sessionStorage.page,null,null,'solved');
	}else if ($(this).attr('class') == 'unsolved') {
		sessionStorage.postStatus = 'unsolved';
		sessionStorage.removeItem("typeId");
		getPostByType(null,null,sessionStorage.page,null,null,'unsolved');
	}else{
		getPostByType($(this).attr('data-pk'),null,sessionStorage.page,sessionStorage.searchPostContent);
		pageId=$(this).attr('data-pk');
	} 
});

function exeData(num, type) {
	//alert(num);
	getPostByType(pageId,null,num,sessionStorage.searchPostContent,sessionStorage.myPost)
}

function loadpage() {
    var myPageCount = parseInt($("#PageCount").val());
    var myPageSize = parseInt($("#PageSize").val());
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    $("#countindex").val(countindex);
    if (sessionStorage.page) {
    } else {
    	sessionStorage.page = 1;
    }
    $.jqPaginator('#pagination', {
        totalPages: parseInt($("#countindex").val()),
        visiblePages: parseInt($("#visiblePages").val()),
        currentPage: parseInt(sessionStorage.page),
        // first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
        // last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                exeData(num, type);
                sessionStorage.page = num;
            }
        }
    });
}
