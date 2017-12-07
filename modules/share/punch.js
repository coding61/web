var basePath="/program_girl";
var pk=getQueryString("pk");
var username=getQueryString("username");
var name=getQueryString("name");
var head=getQueryString("head");
console.log(name);
console.log(head);
myInitDetail();
function myInitDetail(){
	$(".pk-btn, .comment, .download").click(function(){
		download();
	})
    getUserInfo();
	getRecord();
}

function getUserInfo() {
	myAjax(basePath + '/userinfo/username_userinfo/?username=' + username,"get",null,function(result) {
		if (result) {
            $('.name').html(result.name);
            $('.head').attr('src',result.avatar);
		} else {
			layer.msg('请求异常');
		}
	})
}

function getRecord() {
	myAjax(basePath + '/club/myclub_punch/' + String(pk) + '/?username=' + username,"get",null,function(result) {
		if (result) {
            todayCount = result.my_punch ? result.my_punch.today_punch : 0;
            totalCount = result.my_punch ? result.my_punch.all_punch : 0;
            title = result.name;
            $('.count-today').html(todayCount);
            $('.count-total').html(totalCount);
            $('.title').html(title);
		    $('.content').html(this_fly.content(result.introduction));
		} else {
			layer.msg('请求异常');
		}
	})
}
