define(function(require, exports, module) {
	require("libs/jquery.cookie.js");

	exports.Token = null;
	exports.username = null;

	exports.domain = "/";
	// exports.domain = "https://childhood.haorenao.cn/";
	exports.domain = "/program_girl";

	// exports.domain = "https://app.bcjiaoyu.com/program_girl"
	exports.authWXSiteLogin = function(url){
		// 微信网站登录
		var appId = 'wx54e11ffd1df6b8c3',
			scope = 'snsapi_login',
			redirectUri = url;
		redirectUri = encodeURIComponent(redirectUri);

		href = "https://open.weixin.qq.com/connect/qrconnect?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect";
		location.href = href;

		// appId = "wx58e15a667d09d70f";
		// scope = "snsapi_userinfo";
		// href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
		// location.href = href;
		
		// return href;
	}
	exports.authWXLogin = function(url){
		// 先微信授权登录
        // 微信网页授权
        var appId = 'wx58e15a667d09d70f',
            redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
            scope = 'snsapi_userinfo';

        redirectUri = url;
        redirectUri = encodeURIComponent(redirectUri);

        location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
	}

	exports.isWeixin = function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}

	exports.getQueryString = function(key) {
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
		//var args = ls.match(/[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$/g);
	}
	exports.setQueryString = function(key, value) {
		var ls = location.search;
		var reg = eval("new RegExp('[\?&]+(" + key + ")=[^&]+&|[\?&]+(" + key + ")=[^&]+$')");
		var args = ls.match(reg);
		if (args) {
			location.search = ls.replace(args[0].replace(/&$/, ""), key + "=" + value);
		} else {
			console.log(key + "不存在");
			location.search = ls + "&" + key + "=" + value;
		}
	}
	exports.getHashString = function(key) {
		var lh = location.hash;
		//var reg = eval("new RegExp('[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$','g')");
		var reg = eval("new RegExp('/(" + key + ")/[^/]+/|/+(" + key + ")/[^/]+$')");
		var args = lh.match(reg);
		if (args) {
			return args[0].split("=")[1];
		} else {
			console.log(key + "不存在");
			return null;
		}
		//var args = ls.match(/[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$/g);
	}
	exports.setHashString = function(key, value) {
		var lh = location.hash;
		var reg = eval("new RegExp('/(" + key + ")/[^/]+/|/+(" + key + ")/[^/]+$')");
		var args = lh.match(reg);
		if (args) {
			location.hash = lh.replace(args[0], key + "/" + value);
		} else {
			console.log(key + "不存在");
			//			location.hash = lh + "" + key+"/"+value + /);
		}
	}
	//根据图片地址，获取图片的宽高
	exports.getPhotoWidthHeight = function(url, fx){
		var new_url = null;
		var width = null;
		var height = null;
		url = decodeURIComponent(url);

		// 123.jpg-30x30
		var array = ['.jpg-', '.png-', '.jpeg-', '.JPG-', '.PNG-', '.JPEG-', '.webp-', '.gif-', '.GIF-'];
		var string = null;
		for (var i = 0; i < array.length; i++) {
			var item = array[i]
			if (url.split(array[i])[1]) {
				string = array[i];
				break;
			}
		}

		var str = url.split(string)[1]; //45x36
		width = str.split('x')[0];  //45
		height = str.split('x')[1];  //36
		fx(width, height);
	}
	// 预加载图片的隐藏
	exports.showLoadingPreImg = function(){
		$(".message.img").each(function(){
			var img = new Image();
			img.src = $(this).find("img.msg").attr('src');
			
			if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
				$(this).find("img.msg").show();  //打开加载的图片，关闭预加载
				$(this).find(".pre-msg").hide();
				return; // 直接返回，不用再处理onload事件 
			} 
			img.onload = function(){ //图片下载完毕时异步调用callback函数。 
				$(this).find("img.msg").show();  //打开加载的图片，关闭预加载
				$(this).find(".pre-msg").hide();
			}; 

			var this_ = $(this);
			this_.find("img.msg").error(function() {  
			    $(this).hide();  
			    this_.find(".pre-msg").children('img').attr({src:"../../statics/images/error.png"});
				this_.find(".pre-msg").show();
			});
			
		})
	}
	// 预加载图片的隐藏
	exports.showLoadingPreImg1 = function(b){
		/*
		var img = new Image();
		img.src = $(b).attr("src");
		
		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
			$(b).show();
			$(b).parents('.msg-view').find('.pre-msg').hide();
			return; // 直接返回，不用再处理onload事件 
		} 
		img.onload = function(){ //图片下载完毕时异步调用callback函数。
			$(b).show(); 
			$(b).parents('.msg-view').find('.pre-msg').hide();
		}; 
		img.error = function(){
			$(b).hide();
			$(b).parents('.msg-view').find('.pre-msg').show();
			$(b).parents('.msg-view').find('.pre-msg').children('img').attr({src:"../../statics/images/error.png"});
		}*/
		
		
		if(b.complete){
			$(b).show();
			$(b).parents('.msg-view').find('.pre-msg').hide();
			return; // 直接返回，不用再处理onload事件 
		}
		$(b).bind('load', function(){
			$(b).show(); 
			$(b).parents('.msg-view').find('.pre-msg').hide();
		})
		$(b).bind('error', function(){
			$(b).hide();
			$(b).parents('.msg-view').find('.pre-msg').show();
			$(b).parents('.msg-view').find('.pre-msg').children('img').attr({src:"../../statics/images/error.png"});
		})
		
		/*
		var imgdefereds=[];
		var dfd=$.Deferred();

		$(b).bind('load',function(){
			dfd.resolve();
		}).bind('error',function(){
		    //图片加载错误，加入错误处理
		    // dfd.resolve();
		    $(b).hide();
			$(b).parents('.msg-view').find('.pre-msg').show();
			$(b).parents('.msg-view').find('.pre-msg').children('img').attr({src:"../../statics/images/error.png"});
		})

	 	if($(b).complete){
		 	setTimeout(function(){
				dfd.resolve();
			},1000);
	 	}
		imgdefereds.push(dfd);
			
		$.when.apply(null,imgdefereds).done(function(){
			// callback && callback.call(null);
			$(b).show(); 
			$(b).parents('.msg-view').find('.pre-msg').hide();
		});
		*/
	}
	// 播放音效
	exports.playSoun = function(url){
	    var borswer = window.navigator.userAgent.toLowerCase();
	    if ( borswer.indexOf( "ie" ) >= 0 )
	    {//IE内核浏览器
	    	$( "body" ).find( "embed" ).remove();
	        var strEmbed = '<embed name="embedPlay" src="'+url+'" autostart="true" hidden="true" loop="false"></embed>';
	        // if ( $( "body" ).find( "embed" ).length <= 0 )
	          $( "body" ).append( strEmbed );
	        var embed = document.embedPlay;
	        //浏览器不支持 audion，则使用 embed 播放
	        embed.volume = 100;
	        //embed.play();这个不需要
	    }else{
	        //非IE内核浏览器
	        $( "body" ).find( "audio" ).remove();
	        var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
	        // if ( $( "body" ).find( "audio" ).length <= 0 )
	        $( "body" ).append( strAudio );
	        var audio = document.getElementById( "audioPlay" );

	        //浏览器支持 audion
	        audio.play();
	    }
	}
	// 播放消息音频
	exports.playMessageSoun = function(url){
		var borswer = window.navigator.userAgent.toLowerCase();
		if (borswer.indexOf("ie") >= 0) {
			// IE 内核
		}else{
			// 非 IE 内核
			if ($("body").find("audio").length <= 0) {
				var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
				$( "body" ).append( strAudio );
				var audio = document.getElementById( "audioPlay");
				audio.play();
			}else{
				var audio = document.getElementById( "audioPlay");
				var oldUrl = audio.getAttribute("src");
				if (oldUrl == url) {
					if(audio.paused){
			            audio.play();
			        }else{
			            audio.pause();
			        }
				}else{
					$("body").find("audio").remove();
					var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
					$( "body" ).append( strAudio );
					var audio = document.getElementById( "audioPlay");
					audio.play();
				}
			}
		}
	}
	// 自动播放暂停、播放某一具体音频
	exports.playMessageSoun2 = function(url){
		// 中断自动播放
		playSouns.status = true;
		playSouns.queue = [];
		playSouns.queueLength = 0;
		
		if($("body").find("audio").length <= 0){
			var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
			$( "body" ).append( strAudio );
			var audio = document.getElementById( "audioPlay");
			audio.play();
		}else{
			var audio = document.getElementById( "audioPlay");
			var oldUrl = audio.getAttribute("src");
			if (oldUrl == url) {
				if(audio.paused){
		            audio.play();
		        }else{
		            audio.pause();
		        }
		    }else{
		    	$("#audioPlay").attr({"src":url});
				audio.play();
		    }
		}
		
	}
	exports.playMessageSoun1 = function(url){

		playSouns.queue.push(url);
		if (playSouns.status) {
			if (!playSouns.inited) {
				playSouns.inited = true;
				if($("body").find("audio").length <= 0){
					var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
					$( "body" ).append( strAudio );

					$("#audioPlay").bind('ended',function () {
						setTimeout(function(){
							if (playSouns.status == false) {
								playSouns.status = true;
							    console.log(1111);
								playSouns.queue.shift();
								playSouns.queueLength = playSouns.queue.length;
								if (playSouns.queue.length > 0) {
									audioPlay();
								}
							}else{
								console.log(2222)
							}
						    
						}, 0)
						
					});
				}
			}
			audioPlay();

			function audioPlay(){
				console.log(playSouns.queue);
				playSouns.status = false;
				var audio = document.getElementById( "audioPlay");
				$("#audioPlay").attr({"src":playSouns.queue[0]});
				audio.currentTime = 0;
				audio.pause();
				audio.autoplay = true;
				var playPromise = audio.play();
				playPromiseFunc(playPromise);
				function playPromiseFunc(playPromise){
					if (playPromise !== undefined) {
				    	playPromise.then(_ => {
					      // Automatic playback started!
					      // Show playing UI.
					      console.log($("#audioPlay").attr("src"));
					      console.log('success');
					    })
				    	.catch(error => {
					      // Auto-play was prevented
					      // Show paused UI.
					      console.log($("#audioPlay").attr("src"));
					        console.log('error');
					        audio.currentTime = 0;
							var pp = audio.play();
							playPromiseFunc(pp);
					    });
					}
				}
			}
		}
	}
	// 自动顺序播放音频文件
	exports.playMessageSoun3 = function(url){
		var borswer = window.navigator.userAgent.toLowerCase();
		if (borswer.indexOf("ie") >= 0) {

		}else{
			playSouns.queue.push(url);
			if (playSouns.status) {
				if (!playSouns.inited) {
					playSouns.inited = true;
					if($("body").find("audio").length <= 0){
						var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
						$( "body" ).append( strAudio );
					}
				}
				audioPlay();

				function audioPlay(){
					playSouns.status = false;
					$("#audioPlay").attr({"src":playSouns.queue[0]});
					var audio = document.getElementById( "audioPlay");
					audio.play();

					$("#audioPlay").bind('ended',function () {
					    playSouns.status = true;
						playSouns.queue.shift();
						playSouns.queueLength = playSouns.queue.length;
						if (playSouns.queue.length > 0) {
							audioPlay();
						}
					});

					// audio.addEventListener("ended", function() {
					// 	playSouns.status = true;
					// 	playSouns.queue.shift();
					// 	playSouns.queueLength = playSouns.queue.length;
					// 	if (playSouns.queue.length > 0) {
					// 		audioPlay();
					// 	}
				 //    }, false)
				}
			}
		}
	}
	var playSouns = {
		status: true,
		queue: [],
		inited: false,
		queueLength: 0
	};
	// bc alert弹出框
	exports.bcAlert = function(text, submitCallback, cancelCallback, textSubmit, textCancel){
		exports.bcSubmitCB = submitCallback;
		exports.bcCancelCB = cancelCallback;
		textSubmit = textSubmit ? textSubmit : "确&nbsp定";
		textCancel = textCancel ? textCancel : "取&nbsp消";
		
		if(! $(".bc-alert-shadow-view").length){
			var html = '<div class="bc-alert-shadow-view">\
							<div class="bc-alert-view">\
								<div class="bc-alert-msg">\
									<span class="bc-msg">'+text+'</span>\
								</div>\
								<div class="bc-alert-btns">\
									<span class="bc-alert-submit-btn">'+textSubmit+'</span>\
									<span class="bc-alert-cancel-btn">'+textCancel+'</span>\
								</div>\
							</div>\
						</div>';
			$(html).appendTo("body");

			// 确定事件
			$(".bc-alert-submit-btn").unbind('click').click(function(){
				$(".bc-alert-shadow-view").hide();
				exports.bcSubmitCB();
			})
			// 取消事件
			$(".bc-alert-cancel-btn").unbind('click').click(function(){
				$(".bc-alert-shadow-view").hide();
				if (exports.bcCancelCB) {
					exports.bcCancelCB();
				}
			})
		}else{
			$(".bc-alert-view .bc-alert-msg .bc-msg").html(text);
			$(".bc-alert-submit-btn").html(textSubmit);
			$(".bc-alert-cancel-btn").html(textCancel);
		}
		$(".bc-alert-shadow-view").show();

	}
	exports.bcSubmitCB = function(){};
	exports.bcCancelCB = function(){};

	
	exports.changePhotoSrc = function(url, fx){
		var new_url = null;
		var width = null;
		var height = null;

		//123.jpg-45x36-w1000?cc
		var array = ['.jpg-', '.png-', '.jpeg-', '.JPG-', '.PNG-', '.JPEG-', '.webp-'];
		var string = null;

		for (var i = 0; i < array.length; i++) {
			var item = array[i]
			if (url.split(array[i])[1]) {
				string = array[i];
				break;
			}
		}
		/*
		var string = null;
		if (url.split('.jpg-')[1]) {
			string = '.jpg-';
		}else if(url.split('.png-')[1]){
			string = '.png-';
		}else if(url.split('.JPG-')[1]){
			string = '.JPG-';
		}else if(url.split('.PNG-')[1]){
			string = '.PNG-';
		}-w1000?e=1487315998&token=9ku9Ad9Nr0ZzrA9hy3zhFA-a5wfJqjzB0wVoZxoD:l4t-Ff7joJv4g8aUtye-LH9JyFE=
		*/

		new_url = url;
		var str = url.split(string)[1]; //45x36-w1000?cc
		var str1 = str.split('?')[0];  //45x36-w1000
		var array = str1.split('-');  //[45x36, w1000]
		width = array[0].split('x')[0];
		height = array[0].split('x')[1];
		
		fx(width, height);

	}
	
	exports.showLoadingDivImage = function(flag){
		$(".loading-image").css({"background-color":"gray"});
		$('.loading-image .loading-image-complete').each(function(){
			var img = new Image();
			var url = $(this).css('background-image');

			if (url.split('url("')[1]) {
				img.src = url.split('url("')[1].split('")')[0];
			} else if (url.split('url(')[1]) {
				img.src = url.split('url(')[1].split(')')[0];
			}
			if (img.complete) {
				// $(this).fadeIn(1000);
				$(this).show();
				if (flag == "hideColor") {
					$(this).parents(".loading-image").css({"background-color":"initial"});
				}
			} else {
				var this_ = $(this);
				setTimeout(function(){
					this_.show();
					if (flag == "hideColor") {
						this_.parents(".loading-image").css({"background-color":"initial"});
					}
				},500);
			}
		});
	}
	exports.showLoadingImgImage = function(flag){
		$(".loading-image").css({"background-color":"gray"});
		$('.loading-image .loading-image-complete').each(function(){
			var img = new Image();
			img.src = $(this).attr('src');

			if (img.complete) {
				$(this).show();
				if (flag == "hideColor") {
					$(this).parents(".loading-image").css({"background-color":"initial"});
				}
			} else {
				var this_ = $(this);
				setTimeout(function(){
					this_.show();
					if (flag == "hideColor") {
						this_.parents(".loading-image").css({"background-color":"initial"});
					}
				},500);
			}
		});
	}
	exports.showLoadingImage = function(){
		// $(".loading-image").css({"background-color":"rgba(245,245,245,1)"});
		$(".loading-image-complete").css({"background-color":"gray"});
		$('.loading-image-complete').each(function(){
			var img = new Image();
			img.src = $(this).attr('src');

			if (img.complete) {
				$(this).show();
			} else {
				var this_ = $(this);
				setTimeout(function(){
					this_.show();
				},500);
			}
		});
	}

	exports.showWaitingLoading = function(c){
		var waitingHtml = '<div class="waitloading"><img src="../../statics/images/loading.gif"/></div>';

		var height = null;
		if (c) {
			height = $(c).height();
			$(c).append(waitingHtml);
		}else{
			height = $(window).height();
			$(waitingHtml).appendTo("body");
		}
		
		if (c) {
			$(".waitloading").css({
				"width":"60px",
				"height":"60px",
				"position":"relative",
				"margin":"auto",
				"padding-top": (height - 60 )/2 + "px",
				"padding-bottom": (height - 60)/2 + "px"
			});
		}else{
			$(".waitloading").css({
				"width":"60px",
				"height":"60px",
				"position": "fixed",
			    "top": (height - 60) / 2 + "px",
			    left: "calc(50% - 30px)"
			});
		}
	}

	exports.hideWaitingLoading = function(c){
		//设置延迟2秒
		// setTimeout(function(){
			$(".waitloading").remove();
			// location.href = "aichashuo://loadcomplete";
		// }, 10);
	}

	exports.showLoading = function() {
		exports.showMask();
		if ($(".loading").get(0)) {
			$(".loading").show();
		} else {
			$('<div class="loading"></div>').appendTo("body");
			$(".loading").css({
				"left": $(window).width() / 2 - 30 + "px",
				"top": $(window).height() / 2 - 30 + "px"
			});
		}
	}

	exports.hideLoading = function() {
		$(".loading").hide();
		exports.hideMask();
		// location.href = "aichashuo://loadcomplete/";
	}

	exports.showLoginPanel = function() {
		var Switch = true;
		var loginHtml = '<div id="login-panel">' +
			'<div class="title"><span>使用社交账号登录</span></div>' +
			'<span class="weibo-login"></span>' +
			'<span class="weixin-login"></span>' +
			'<span class="qq-login"></span>' +
			'</div>';
		$(loginHtml).appendTo("body");
		$("#login-panel").animate({
			"bottom": "0"
		});
		$(".weixin-login").click(function() {
			//			location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5bb2ed5654adbdb1&redirect_uri=http%3A%2F%2Fold.haorenao.cn%2Fweixin_login%2F&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
			location.href = "http://www.haorenao.cn/static/newweb/app/login/login.html";
		});

		exports.showMask();
		exports.maskClickCallback = function() {
			if (!Switch) {
				return false;
			}
			Switch = false;
			$("#login-panel").animate({
				"bottom": "-200px"
			}, function() {
				$("#mask").fadeOut();
			});
		}
	}

	exports.login = function() {

	}

	exports.showMask = function() {
		if (!$("#mask").get(0)) {
			$('<div id="mask"></div>').appendTo("body");
		}
		$("body").css({
			"overflow": "hidden"
		});
		$("#mask").height($(window).height())
			.fadeIn();
		$("#mask").tap(function() {
			exports.hideMask();
			exports.maskClickCallback();
		});
	}

	exports.hideMask = function() {
		$("#mask").fadeOut();
		$("body").css({
			"overflow": "auto"
		});
	}

	exports.maskClickCallback = null;

	exports.initView = function(top) {
		if (!exports.isWeixin()) {
			$("header").remove();
			$(".share-download-app").remove();
		} else {
			$("header").show();
			$(".category").show();
			$(".share-download-app").show();
		}
		$(".main-viewer").css({
			"margin-top": top + "px"
		});
	}

	exports.isApp = function() {
//		exports.dialog(navigator.userAgent);
		if (navigator.userAgent.match("aichashuo")) {
			return true;
		} else {
			return false;
		}
	}
	
	exports.showToast = function(text, bot, fx) {
		showToastControler.queue.push(text);
		var bottom = bot ? bot + "px" : "40px";
		if (showToastControler.status) {

			if (!showToastControler.inited) {
				showToastControler.inited = true;
				$("<div class=\"toast\">" + text + "</div>").appendTo("body");
			}
			show();

			function show() {
				showToastControler.status = false;
				$(".toast").html(showToastControler.queue[0]);
				$(".toast").css({
					"left": ($(window).width() - $(".toast").width() - 20) / 2 + "px"
				});

				$(".toast").show()
					.animate({
						"opacity": "1",
						"bottom": bottom
					}, function() {
						setTimeout(function() {
							$(".toast").fadeOut(function() {
								$(this).css({
									"bottom": "-36px"
								});

								showToastControler.status = true;
								showToastControler.queue.shift();
								showToastControler.queueLength = showToastControler.queue.length;
								if (showToastControler.queue.length > 0) {
									show();
								} else {
									if (fx) {
										fx();
									}
								}
							});
						}, 600)
					});
			}
		}
	}

	var showToastControler = {
		status: true,
		queue: [],
		inited: false,
		queueLength: 0
	};

	exports.jumping = function() {
		$("<div class='jumping'><span>正在跳转</span></div>").appendTo("body");
	}

	if (exports.isApp()) {
//		location.href = "aichashuo://start_load/";
		
	} else {
		$(".tabbar").show();
		$("header").show();
		$(".foot-view").show();
		$(".head-view").show();
		$(".share-download-app").show();
	}

	exports.inputBoard = {
		show: function(value, callback, placeholder, type) {

			var this_ = this;
			this.type = type;
			if (type == "textarea") {
				$("#ui-input-board .ui-input-board-input").hide();
				$("#ui-input-board .ui-input-board-textarea")
					.show()
					.val(value)
					.attr({
						"placeholder": placeholder ? placeholder : ""
					});
			} else {
				$("#ui-input-board .ui-input-board-textarea").hide();
				$("#ui-input-board .ui-input-board-input")
					.show()
					.val(value)
					.attr({
						"placeholder": placeholder ? placeholder : ""
					});
			}

			$("#ui-input-board").fadeIn(function() {
				this_.status = true;
			});
			this.callback = callback;
			if (!this.inited) {
				this.inited = true;
				$("#ui-input-board .ui-input-board-done").tap(function() {
					if (!this_.status) return;
					if (exports.inputBoard.type == "textarea") {
						var val = $("#ui-input-board .ui-input-board-textarea").val();
					} else {
						var val = $("#ui-input-board .ui-input-board-input").val();
					}

					this_.callback(val);
				});
				$("#ui-input-board .ui-input-board-cancel").tap(function() {
					if (!this_.status) return;
					this_.hide();
				});
			}
		},
		hide: function() {
			$("#ui-input-board").fadeOut(function() {
				exports.inputBoard.status = false;
			});

		},
		inited: false,
		callback: null,
		status: false,
		type: null
	}

	exports.setRule = function(selector, property, value) {
		var stylesheets = document.styleSheets;
		loopStyleSheets:
			for (var i in stylesheets) {
				var s = stylesheets[i];
				for (var j in s.cssRules) {
					if (s.cssRules[j].selectorText == selector) {
						s.cssRules[j].style[property] = value;
						break loopStyleSheets;
					}
				}
			}
	}

	exports.loadComplete = function() {
		// location.href = "aichashuo://loadcomplete/";
	}

	exports.consoleLog = function(log) {
		if ($(".my-console").length) {
			$(".my-console").show();
		} else {
			$('<div class="my-console" style="position:absolute;top:0;left:0;width:100%;z-index:10010;background:rgba(0,0,0,0.6);color:#ffff00;padding:15px;box-sizing:border-box;font-size:12px;"></div>').appendTo("body");
			$(".my-console").click(function() {
				$(this).hide();
			});
		}
		$(".my-console").html(log);
	}

	exports.dialog = function(text, callback) {
		if (callback) {
			exports.dialogCB = callback;
		} else {
			exports.dialogCB = null;
		}
		if (!$(".ui-dialog").length) {
			$('<div class="ui-dialog" role="alert"><div class="ui-dialog-container"><p>' + text + '</p><a id="close-dialog">确&nbsp;定</a></div></div>').appendTo("body");
			$('#close-dialog').on('click', function(event) {
				$(".ui-dialog").removeClass('is-visible');
				if (exports.dialogCB) {
					exports.dialogCB();
				}
			});
		} else {
			$(".ui-dialog .ui-dialog-container p").html(text);
		}
		$('.ui-dialog').addClass('is-visible');
	}
	exports.dialogCB = null;

	exports.confirmAlert = function(text, sureCallback, cancelCallback, textConfirm, textCancel) {
		exports.sureCB = sureCallback;
		exports.cancelCB = cancelCallback;
		textConfirm = textConfirm?textConfirm:"确&nbsp;定";
		textCancel = textCancel?textCancel:"取&nbsp;消";
		var channel = "alipay";
		if (!$(".ui-confirm").length) {
			$('<div class="ui-confirm" role="alert"><div class="ui-confirm-container"><p class="amount">' + text + '</p><div class="pay-channel">\
						<div class="alipay"><i class="select-radio"></i><span>支付宝</span></div>\
						<div class="wx"><i class="unselect-radio"></i><span>微信</span></div>\
						<div class="balance"><i class="unselect-radio"></i><span>余额</span></div>\
						</div><a id="ui-confirm-confirm">'+textConfirm+'</a><a id="ui-confirm-cancel">'+textCancel+'</a></div></div>').appendTo("body");

			$(".pay-channel i").click(function(){
				channel = $(this).parent().attr('class');
				console.log(channel);
				$(".select-radio").removeClass("select-radio").addClass("unselect-radio");
				$(this).removeClass("unselect-radio").addClass("select-radio");
			});
			/*
			$(".alipay i").click(function(){
				if ($(".alipay i").hasClass("select-radio")) {
					$(".alipay i").removeClass("select-radio").addClass("unselect-radio");
					$(".wx i").removeClass("unselect-radio").addClass("select-radio");
					channel = "wx";
				}else if($(".alipay i").hasClass("unselect-radio")){
					$(".alipay i").removeClass("unselect-radio").addClass("select-radio");
					$(".wx i").removeClass("select-radio").addClass("unselect-radio");
					channel = "alipay";
				}
			});
			$(".wx i").click(function(){
				if ($(".wx i").hasClass("select-radio")) {
					$(".wx i").removeClass("select-radio").addClass("unselect-radio");
					$(".alipay i").removeClass("unselect-radio").addClass("select-radio");
					channel = "alipay";
				}else if($(".wx i").hasClass("unselect-radio")){
					$(".wx i").removeClass("unselect-radio").addClass("select-radio");
					$(".alipay i").removeClass("select-radio").addClass("unselect-radio");
					channel = "wx";
				}
			});
			*/

			$('#ui-confirm-confirm').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
				exports.sureCB(channel);
			});
			$('#ui-confirm-cancel').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
				exports.cancelCB();
			});
		} else {
			$(".ui-confirm .ui-confirm-container p").html(text);
			$("#ui-confirm-confirm").html(textConfirm);
			$("#ui-confirm-cancel").html(textCancel);
		}
		$('.ui-confirm').addClass('is-visible');
	}

	exports.sureCB = function(channel) {};
	exports.cancelCB = function(){};

	exports.confirm = function(text, callback, textConfirm, textCancel) {
		exports.confirmCB = callback;
		textConfirm = textConfirm?textConfirm:"确&nbsp;定";
		textCancel = textCancel?textCancel:"取&nbsp;消";
		if (!$(".ui-confirm").length) {
			$('<div class="ui-confirm" role="alert"><div class="ui-confirm-container"><p>' + text + '</p><a id="ui-confirm-confirm">'+textConfirm+'</a><a id="ui-confirm-cancel">'+textCancel+'</a></div></div>').appendTo("body");
			$('#ui-confirm-confirm').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
				exports.confirmCB();
			});
			$('#ui-confirm-cancel').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
			});
		} else {
			$(".ui-confirm .ui-confirm-container p").html(text);
			$("#ui-confirm-confirm").html(textConfirm);
			$("#ui-confirm-cancel").html(textCancel);
		}
		$('.ui-confirm').addClass('is-visible');
	}

	exports.confirmCB = function() {};

	exports.platform = function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			//移动终端浏览器版本信息 
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			isMobile:u.indexOf('Mobile') > -1   //是否为手机
		};
	}();
	
	exports.isLogin = function(fx, type) {
		if (exports.isApp()) {
			AppBridge.getValue("login_token", function(key, token) {
				if (!token.match(/[0-9a-z]{40}/g)) {
					if (type == "notLogin") {
						
					} else {
						if (fx) {
							fx("null");
						}
					}
				} else {
					if (fx) {
						fx(token);
					}

				}
			});
		} else {
			
			if(window.localStorage){
				var token = localStorage.token?localStorage.token:"";
			}else{
			 	var token = $.cookie("token")?$.cookie("token"):"";
			}
			if (!token.match(/[0-9a-z]{40}/g)) {
				if (type == "notLogin") {
					
				} else {
					if (fx) {
						fx("null");
					}
				}
			} else {
				if (fx) {
					fx(token);
				}

			}
		}

	};
	exports.adapteWX = function(obj){
		if (navigator.userAgent == 'GoldRN') {
			$('header').hide();
			$('.head-view').hide();
		} else if(!exports.isApp()){
			obj = obj?obj:"body";
			$(obj).addClass("adapte-weixin");
		}
	};
	exports.getCurrentUserName = function(){
		 exports.checkLoginStatus(function(token){
			$.ajax({
				type: "get",
				url: exports.domain + "account/whoami/",
				headers:{
					Authorization: "Token " + token
				},
				async : false,
				dataType: "json",
				success: function(result) {
					if(null==result){
						exports.usernames = "";
					}else{
						exports.username = result.username;
					}
				},
				error: function(xhr, textStatus) {
					if (textStatus == "timeout") {
						exports.showToast("服务器开小差了");
					}	
					exports.dialog(JSON.parse(xhr.responseText).detail);
					console.log(textStatus);
				}
			});
		},"notLogin")
	};
	
	exports.tabBar = {
		currentId:null,
		init:function(cid){
			$(".adapte-weixin").css({
				"padding-bottom": "70px",
				"padding-top": "0px"
			});
			this.currentId = cid;
			$("#tabbar").on("click",".tab",function(){
				var id = $(this).attr("id");
				if(id != exports.tabBar.currentId){
					switch (id){
						case "tabbar-tab-home": location.href = "../home/home.html";break;
						case "tabbar-tab-shop": location.href = "../shop/home.html";break;
						case "tabbar-tab-manager": location.href = "../manager/home.html";break;
						case "tabbar-tab-find": location.href = "../find/home.html";break;
						case "tabbar-tab-me": location.href = "../me/home.html";break;
					}
				}
			});
		}
	};
	// 统计页面浏览量
	var _hmt = _hmt || [];
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?0e1f2afd2def9daf664e5504d146965a";
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);


	(function() {
		// var img = new Image();
		// img.src = "http://meiyin.haorenao.cn/static/meiyin/statics/images/loading.gif";
		$("#back-btn").click(function(){
			history.back();
		});
	})();
	
	$.ajaxSetup({
        statusCode: {
            401: function () {
                // location.href="../login/login.html";
            }
        }
    });

});
