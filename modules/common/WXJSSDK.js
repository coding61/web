define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
	var AppBridge = require("common/app-bridge.js");
	
	exports.config = function(){
		wx.config({
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'wx58e15a667d09d70f', // 必填，公众号的唯一标识
		    timestamp: , // 必填，生成签名的时间戳
		    nonceStr: '', // 必填，生成签名的随机串
		    signature: '',// 必填，签名，见附录1
		    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	}

	exports.http_get = function($url){
		$ch = curl_init();  
	    curl_setopt($ch, CURLOPT_URL,$url);  
	    curl_setopt($ch, CURLOPT_HEADER,0);  
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
	    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);  
	    $res = curl_exec($ch);  
	    curl_close($ch);  
	    return $res;  
	}
	
	exports.wx = function(){
		var sign;
		function jsonpCallback(data) {
			console.log(data);
		      sign = data.sign;
		      wx.config({
		          debug: false,
		          appId: 'wx58e15a667d09d70f',
		          timestamp: sign.timestamp,
		          nonceStr: sign.nonceStr,
		          signature: sign.signature,
		          jsApiList: [
		              // 所有要调用的 API 都要加到这个列表中
		              'onMenuShareTimeline',
		              'onMenuShareAppMessage',
		              'onMenuShareQQ'
		          ]
		      });
		}
		var str = "http://test.weixin.bigertech.com/api/sign?appId=wx58e15a667d09d70f&callback=jsonpCallback&url=";
		var href = encodeURIComponent(window.location.href);
		var script_elem = document.createElement("script");
		script_elem.src = str + href;
		document.body.appendChild(script_elem);
	}
	
});
