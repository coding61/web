
var basePath="/program_girl";
var userId=1;
var userName=getCookie("userName");
var zonePk = getQueryString("pk");
//if(userName) {
//	userId=user.pk;
//	userName=user.name;
//}else{
//	alert("请先登录");
//	setTimeout("window.location.href='/s/login.html?targetUrl="+window.location.href+"'",500);
//}
//var basePath="http://10.144.238.71:8080/wodeworld/";
//var basePath="http://www.wodeworld.cn:8080/wodeworld3.0/";

//获取当前社区
var zoneName='';
myAjax(basePath+"/forum/sections/"+zonePk+"/","GET",null,function(result) {
	zoneName=result.name;
});
//$(".zone_content").html('<option value="'+zonePk+'" class="layui-this">'+zoneName+'</option>');
$(function() {
	$(".publish").click(function() {
		var title=$("#L_title").val();
		var content=$("#L_content").val();
		var type_txt=$(".type_content").siblings(".layui-form-select").find(".layui-this");
		var zone_txt=$(".zone_content").siblings(".layui-form-select").find(".layui-this");
		var typeId=type_txt.attr("lay-value");
		var zoneId=zone_txt.attr("lay-value");
		/*alert(zoneId)
		alert(typeId)*/
		
		if(!type_txt.length) {
			layer.msg("请选择类别");
			return false;
		}
		if(!title) {
			layer.msg("请输入标题");
			return false;
		}
		if(!title) {
			layer.msg("请输入标题");
			return false;
		}
		if(!content) {
			layer.msg("请输入内容");
			return false;
		}
		if(!zone_txt.length) {
			layer.msg("请选择专区");
			return false;
		}else {
			$("#L_title").val("");
			$("#L_content").val("");
			$(".main").find(".layui-select-title input").val("");
			publish(title,zoneId,typeId,content)
		}
		
	})
})

function publish(title,zoneId,typeId,content) {
	myAjax(basePath+"/forum/posts_create/","post",{
  "section":zoneId,
  "types":typeId,
  "title":title,
  "content":content
},function(result) {
		//console.log(result)
		$("#L_title").val("");
		$("#L_content").val("");
		$(".main").find(".layui-select-title input").val("");
		localStorage.page = 1;
		window.location.href="detail.html?id="+result.pk+'&pk='+zonePk;
	});
}
initTypes();
function initTypes(){
	myAjax(basePath+"/forum/types/","get",null,function(result){
		//console.log(result);
		$.each(result.results, function(k,v) {
			$(".type_content").append('<option value="'+v.pk+'" >'+v.name+'</option>');
		});
	},false);
}
initSection();
function initSection(){
	myAjax(basePath+"/forum/sections/","get",null,function(result){
		//console.log(result);
		$.each(result.results, function(k,v) {
			var html='';
			if(v.pk==zonePk){
				html='<option value="'+v.pk+'" selected>'+v.name+'</option>';
			}else{
				html='<option value="'+v.pk+'" >'+v.name+'</option>';
			}
			$(".zone_content").append(html);
		});
	},false);
}

