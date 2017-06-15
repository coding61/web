define(function(require, exports, module) {
	require("libs/jquery.cookie.js");
	var Common = require('common');
	exports.loginState = false;

	if (!Common.isApp()) {
		if (Common.getQueryString("username") && Common.getQueryString("password")) {
			$.cookie("username", Common.getQueryString("username"), {
				path: "/"
			});
			$.cookie("password", Common.getQueryString("password"), {
				path: "/"
			});

			exports.username = $.cookie("username");
			exports.password = $.cookie("password");
			exports.loginState = true;

		}
		if ($.cookie("username") && $.cookie("password")) {
			exports.username = $.cookie("username");
			exports.password = $.cookie("password");
			exports.loginState = true;
		}
	} else if (Common.isApp()) {
		if (Common.getQueryString("password") && Common.getQueryString("username")) {
			exports.username = Common.getQueryString("username");
			exports.password = Common.getQueryString("password");
			exports.loginState = true;
		}

	} else {
		if (Common.getQueryString("username") && Common.getQueryString("password")) {
			$.cookie("username", Common.getQueryString("username"), {
				path: "/"
			});
			$.cookie("password", Common.getQueryString("password"), {
				path: "/"
			});

			exports.username = $.cookie("username");
			exports.password = $.cookie("password");
			exports.loginState = true;

//			$.ajax({
//				url: "www.haorenao.cn/cmd/",
//				data: "cmd=reg_user&username=" + $.cookie("username") + "&password=" + $.cookie("password"),
//				success: function(d) {
//
//				}
//			});
		}
		if ($.cookie("username") && $.cookie("password")) {
			exports.username = $.cookie("username");
			exports.password = $.cookie("password");
		}
	}
	
	exports.userState = function(){
		if(exports.loginState){
			return true;
		}else{
			return false;
		}
	}

	exports.logout = function() {
		if (!Common.isApp()) {
			exports.username = $.removeCookie("username", {
				path: "/"
			});
			exports.password = $.removeCookie("password", {
				path: "/"
			});
		}else{
			location.href = "aichashuo://logout"
		}
	}

})
