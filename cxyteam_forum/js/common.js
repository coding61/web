
if(/Mobile/i.test(navigator.userAgent)){
    location.href = 'http://www.cxy61.com/cxyteam/cxyteam_forum/bbs.html';
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
	        		layer.msg("请先购买课程");
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

