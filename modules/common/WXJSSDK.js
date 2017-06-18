define(function(require, exports, module) {	
	var sha1 = require("common/sha1.js");
	// exports.config = function(){
	// 	wx.config({
	// 	    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	// 	    appId: 'wx58e15a667d09d70f', // 必填，公众号的唯一标识
	// 	    timestamp: , // 必填，生成签名的时间戳
	// 	    nonceStr: '', // 必填，生成签名的随机串
	// 	    signature: '',// 必填，签名，见附录1
	// 	    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	// 	});
	// }

	// exports.http_get = function($url){
	// 	$ch = curl_init();  
	//     curl_setopt($ch, CURLOPT_URL,$url);  
	//     curl_setopt($ch, CURLOPT_HEADER,0);  
	//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
	//     curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);  
	//     $res = curl_exec($ch);  
	//     curl_close($ch);  
	//     return $res;  
	// }

	exports.timestamp = new Date().getTime();
	
	exports.wx = function(){
		var noncestr = exports.getRandomString();
		console.log(noncestr + "---111");
		console.log(exports.timestamp + "---222");
		var sign;
		function jsonpCallback(data) {
			console.log(data);
		      sign = data.sign;
		      wx.config({
		          debug: true,
		          appId: 'wx58e15a667d09d70f',
		          timestamp: exports.timestamp,
		          nonceStr: exports.noncestr,
		          signature: data,
		          jsApiList: [
		              // 所有要调用的 API 都要加到这个列表中
		              'onMenuShareTimeline',
		              'onMenuShareAppMessage',
		              'onMenuShareQQ'
		          ]
		      });
		}
		exports.getToken(noncestr,'https://www.cxy61.com/cxyteam/app/home/myTeam.html', null);
	}
	exports.getToken = function(noncestr, url, fx){
		console.log(noncestr+ "---111");
		console.log(exports.timestamp + "---222");

		$.ajax({
			type:'get',
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx58e15a667d09d70f&secret=APPSECRET',
			success:function(json){
				console.log(json);
				exports.getTicket(json.access_token, url, fx);
			},
			error:function(xhr, textStatus){

			}
		})
	}
	exports.getTicket = function(access_token, url, fx){
		$.ajax({
			type:'get',
			url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi',
			success:function(json){
				exports.getSign(json.ticket, url, fx);
			},
			error:function(xhr, textStatus){

			}
		})
	}
	exports.getSign = function(ticket, url, fx){
		console.log(exports.noncestr + "222");
		var noncestr = exports.noncestr;
		var jsapi_ticket = ticket;
		var timestamp = exports.timestamp;
		var url = url;

		var string = 'jsapi_ticket='+jsapi_ticket+'&noncestr='+noncestr+'&timestamp='+timestamp+'&url=' + url;
		
		var sha = hex_sha1(string);

		fx(sha);

	}

	exports.getRandomString = function(len){
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (i = 0; i < len; i++) {
	　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
	}
	exports.testSign = function(){
		var str = exports.getRandomString(10);
		var newStr = hex_sha1(str);
		console.log(newStr);
	}
	
});
