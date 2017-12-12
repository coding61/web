
if(/Mobile/i.test(navigator.userAgent)){
    // location.href = 'http://www.cxy61.com/cxyteam/cxyteam_forum/bbs.html';
}
dealWithLogin();
function getQueryString(name) { //解析地址栏
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}
//时间处理（处理.0）
function dealWithTime(time){
	if(time.indexOf(".")>0){
	time=time.substring(0,time.lastIndexOf("."));
	}
	time=time.replace(/T/g," ");
	return time;
}
//时间处理（并去掉年和秒）
function dealWithTime_short(time){
		time=time.substring(5,16);
		time=time.replace(/T/g," ");
	return time;
}
function liveTimeAgo(){
	$('.liveTime').liveTimeAgo({
		translate : {
			'year' : '%年前',
			'years' : '%年前',
			'month' : '%个月前',
			'months' : '%个月前',
			'day' : '%天前',
			'days' : '%天前',
			'hour' : '%小时前',
			'hours' : '%小时前',
			'minute' : '%分钟前',
			'minutes' : '%分钟前',
			'seconds' : '几秒钟前',
			'error' : '未知的时间',
		}
	});
}
function myAjax(url,type,data,success,async){
	// localStorage.token = 'a1c7ba96fedd788f3551f8120c6033c8f2a35859';
	if (localStorage.token && localStorage.token != null && localStorage.token != '') {
		$.ajax({
	        url: url,
	        type: type,
	        async:async==null?true:async,
	        headers: {
	            Authorization: 'Token ' + localStorage.token
	        },
	        data:data,
	        success: success,
	        error:function(XMLHttpRequest){
	        	console.log(XMLHttpRequest.status)
	        	if(XMLHttpRequest.status==403){
	        		layer.msg("当前未解决的帖子数量过多，请先标记它们为已解决或已完成");
	        	}else{
	        		layer.msg("请求异常")
	        	}
	        }
	    });
	}else{
	 	layer.msg("请先登录");
	}
}
function myAjax2(url,type,data,success,async){
	$.ajax({
        url: url,
        type: type,
        async:async==null?true:async,
        data:data,
        success: success,
        error:function(XMLHttpRequest){
        	console.log(XMLHttpRequest.status)
        	if(XMLHttpRequest.status==403){
        		layer.msg("请先购买课程");
        	}else{
        		layer.msg("请求异常")
        	}
        }
  });
}
function myAjaxInShare(url,type,data,success,async){
    $.ajax({
        url: url,
        type: type,
        async:async==null?true:async,
        data:data,
        success: success,
        error:function(XMLHttpRequest){
            console.log(XMLHttpRequest.status)
            if(XMLHttpRequest.status==403){
                layer.msg("当前未解决的帖子数量过多，请先标记它们为已解决或已完成");
            }else{
                layer.msg("请求异常")
            }
        }
    });
}
	// 统计页面浏览量
	var _hmt = _hmt || [];
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?0e1f2afd2def9daf664e5504d146965a";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);

function dealWithAvatar(url){
	if(url!=null&&url.indexOf("*")>0){
		url=url.substring(0,url.indexOf("*"));
	}
	if(url==null || url==''){
		url="img/user/boy-1.png";
	}
	return url;
}
//JS操作cookies方法!

//写cookies

function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg)){
    	var v=arr[2];
    	 if (v != null && v != "" && v != "undefined")
            return decodeURIComponent(v);
    	return "";
    }


    else
        return null;
}

//删除cookies
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/";
}
//处理登录信息

function dealWithLogin(){
	$(".login-inner").empty();
	if(getCookie("Token")){//已登录
		$(".login-inner").append('<p><a href="/static/html/home/home.html">Hi,'+ getCookie("nickname")+'</a><button class="btn logoutBtn" onclick="logout()">退出</button></p>');
	}else{
		$(".login-inner").append('<a href="/static/html/login-reg/login.html" class="login-btn btn-normal bgc-bright">登陆</a>&nbsp;'
							+'<a href="/static/html/login-reg/reg.html" class="reg-btn btn-normal bgc-orange">注册</a>');

	}
}
function logout(){
	delCookie("Token");
	delCookie("nickname");
	delCookie("password");
	delCookie("username");
	dealWithLogin();
}

// 分享页判断设备，跳转下载
function download() {
	// 应用宝
	window.location.href = "http://sj.qq.com/myapp/detail.htm?apkName=com.cxy61.girls";
	// if (checkIsAppleDevice()) {
	// 	window.location.href = "https://itunes.apple.com/us/app/%E7%A8%8B%E5%BA%8F%E5%AA%9B-%E8%AE%A9%E6%9B%B4%E5%A4%9A%E5%A5%B3%E6%80%A7%E5%AD%A6%E4%BC%9A%E7%BC%96%E7%A8%8B/id1273955617?l=es&mt=8";
	// } else {
	// 	alert('安卓版本正在开发中...');
	// }
}

function checkIsAppleDevice() {
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
