define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var work_pk = Common.getQueryString('work_pk');
    var work_name = Common.getQueryString('work_name');

	var Page = {
		init: function(){
			// 当前浏览器
            if(Common.platform.isMobile){
                alert("请使用电脑打开");
                return;
            }else if(!Common.platform.webKit){
                //当前不是谷歌内核，放出消息流
                var questionHtml = null;
                var message = "本页面仅支持Chrome内核的浏览器，请更换成谷歌浏览器";
                questionHtml = '<div class="message text left-animation"> \
                                    <img class="avatar" src="https://resource.bcgame-face2face.haorenao.cn/binshu.jpg" />\
                                    <div class="msg-view">\
                                        <span class="content">'+message+'</span> \
                                    </div>\
                                </div>';
                $(questionHtml).appendTo(".messages");
            }else{
                Page.load();
            }
		},
		load:function(){
            // 判断用户是否登录
            if(localStorage.token){
                // 加载个人信息
                Common.showLoading();
                Mananger.getInfo();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行
                Mananger.qiniuUpload();  //骑牛上传图片

                Page.clickEvent();
            }else{
                // 弹出登录窗口
                // 打开登录窗口
                $(".login-shadow-view").show();
                Page.clickEvent();
            }
            $('.work-name-input').val(decodeURIComponent(work_name));
        },
        clickEvent:function(){
            // 关闭登录窗口
            $(".login-view .close img").unbind('click').click(function(){
                $(".login-shadow-view").hide();
            })

            // 登录按钮
            $(".login-view .login").unbind('click').click(function(){
                Mananger.login();
            })

            // 退出登录
            $(".quit").unbind('click').click(function(){
                Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                    localStorage.clear();
                    window.location.reload();
                })
            })

            // logo 点击打开一个网站
            $(".header .logo2").unbind('click').click(function(){
                window.open("https://www.coding61.com");
            })

            // 鼠标划过用户头像
            $(".header .icon4.avatar").unbind('mouseover').mouseover(function(){
                // $(".header .team-info").show();
                Mananger.loadMyTeam(); // 获取我的团队信息
                Mananger.loadTeamBrand();  //获取团队排行

                Util.adjustTeaminfo();
                $(".header .team-info").toggle();
            }).unbind('mouseout').mouseout(function(){
                // $(".header .team-info").show();
                $(".header .team-info").toggle();
            })

            // 学习论坛
            $(".header .luntan").unbind('click').click(function(){
                window.open("../../cxyteam_forum/bbs.html");
            })

            //上传作品
            $('.submit-btn').click(function(){
                Mananger.saveWork();
            })
            $('.cancel-btn').click(function(){
                history.back();
            })
        }
	}

	var Mananger = {
        login:function(){
            if($(".account-view .username input").val() == ""){
                Common.dialog("请输入账号");
                return;
            }
            if($(".account-view .password input").val() == ""){
                Common.dialog("请输入密码");
                return;
            }

            Common.showLoading();
            $.ajax({
                type:"post",
                url:Common.domain + "/userinfo/invitation_code_login/",
                data:{
                    code:$(".account-view .username input").val(),
                    password:$(".account-view .password input").val()
                },
                success:function(json){
                    console.log(json);
                    localStorage.token = json.token;

                    Mananger.getInfo();
                    Mananger.loadMyTeam();  // 获取我的团队信息
                    Mananger.loadTeamBrand();  //获取团队排行
                    // Page.loadClickMessage("点击微信登录", false);  //false 代表普通按钮点击事件
                    Mananger.qiniuUpload();  //骑牛上传图片 
                },
                error:function(xhr, textStatus){
                    Common.hideLoading();
                    if (textStatus == "timeout") {
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        Common.dialog('服务器繁忙');
                        return;
                    }
                }
            })
        },
        getInfo:function(){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        Common.hideLoading();
                        $(".login-shadow-view").hide();
                        
                        Util.updateInfo(json);
                    },
                    error:function(xhr, textStatus){
                        Common.hideLoading();
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    }
                })
            })
        },
        loadMyTeam:function(){
             Common.isLogin(function(token){
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:8000,
                    success:function(json){
                       var html = ArtTemplate("team-template", json);
                       $(".header .team").html(html);
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        loadTeamBrand:function(){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/groups/diamond/ranking/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:15000,
                    success:function(json){
                        var html = ArtTemplate("teams-brand-template", json.results);
                        $(".teams-brand").html(html);
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        qiniuUpload: function(){
            Common.isLogin(function(token){
                var Qiniu = new QiniuJsSDK();
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                    browse_button: 'upload-btn',         // 上传选择的点选按钮，必需
                  // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                  // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                  // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                  // uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
                  // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                    domain: 'https://resource.bcgame-face2face.haorenao.cn/',
                    filters:{
                      mime_types : [ //只允许上传图片
                        { title : "Image files", extensions : "jpg,gif,png,jpeg" }, 
                      ],
                      max_file_size : '400kb', //最大只能上传400kb的文件
                      prevent_duplicates : true //不允许选取重复文件
                    },
                    uptoken_func: function() {
                        var ajax = new XMLHttpRequest();
                        ajax.open('POST', Common.domain+'/upload/token/', false);
                        ajax.setRequestHeader("Content-type","application/json");
                        ajax.setRequestHeader("Authorization", "Token " + token);
                        var data='{"filename":"test.png"}';
                        ajax.send(data);
                        if (ajax.status === 200) {
                            var res = JSON.parse(ajax.responseText);
                            console.log('custom uptoken_func:' + res.token);
                            console.log('custom uptoken_func:' + res.key);
                            upkey2=res.key;
                            return res.token;
                        } else {
                            console.log('custom uptoken_func err');
                            return '';
                        }
                    },
                    container: 'upload-container',//上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '1000mb',           //最大文件体积限制
                    flash_swf_url: '../../cxyteam_forum/js/plupload/js/Moxie.swf', //引入flash,相对路径
                    max_retries: 3,
                    get_new_uptoken: false,                  //上传失败最大重试次数
                    dragdrop: true,                
                    drop_element: 'upload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function(up, files) {
                            plupload.each(files, function(file) {
                            });
                        },
                        'BeforeUpload': function(up, file) {
                            $('.upload-loading').show();
                            // $('#layui-input2').hide();
                                 // 每个文件上传前,处理相关的事情
                        },
                        'UploadProgress': function(up, file) {
                                 // 每个文件上传时,处理相关的事情
                                 // $('.loading2 p').html(file.percent+'%');
                              //$('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                        },
                        'FileUploaded': function(up, file, info) {
                            json = jQuery.parseJSON(info);
                            $('.upload-loading').hide();
                            $('#layui-input2').attr('src',json.url).show();
                        },
                        'Error': function(up, err, errTip) {
                            $('.upload-loading').hide();
                            var $progressNumed = $(".progressNum .progressNumed").eq(0);
                            $progressNumed.html($progressNumed.html() - 0 + 1);
                            console.log(up);
                            console.log(err);
                            console.log(errTip);
                            Common.dialog('图片上传失败，请刷新页面重新上传');
                        },
                        'UploadComplete': function() {
                            //队列文件处理完毕后,处理相关的事情
                            $('.upload-loading').hide();
                        },
                        'Key': function(up, file) {
                            var key = upkey2;
                            console.log(key);
                            //date_key='http://app.bcjiaoyu.com/sulfurous/app.html?id='+key+'&turbo=false&full-screen=false&resolution-x=480';
                            return key;
                        },
                    }
                });
                uploader.bind('FileUploaded', function() {
                    console.log('hello man 2,a file is uploaded');
                })
                // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
                // uploader为一个plupload对象，继承了所有plupload的方法
          });
        },
        saveWork: function(){
            var work_name_val = $.trim($('.work-name-input').val());
            var work_banner = $('#layui-input2').attr('src');
            var work_content = $.trim($('.work-detail-textarea').val());
            if (!work_name_val || work_name_val == '') {
                Common.dialog('请输入作品名');
                return;
            }
            if (!work_banner || work_banner == '') {
                Common.dialog('请上传图片，或等待图片上传完成');
                return;
            }
            if (!work_content || work_content == '') {
                Common.dialog('请输入作品简介');
                return;
            }
            Common.showLoading();
            Common.isLogin(function(token){
                $.ajax({
                    type: 'PATCH',
                    url: Common.domain + '/userinfo/myexercises/' + work_pk + '/',
                    headers:{
                        Authorization:"Token " + token
                    },
                    data: {
                        'name': work_name_val,
                        'content': work_content,
                        'images': work_banner,
                        'apply_for_home': true
                    },
                    timeout: 12000,
                    success: function(json){
                        Common.dialog('作品申请上首页成功，请等待审核', function(){
                            location.href = './worksList.html';
                        })
                    },
                    error: function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                    },
                    complete: function(){
                        Common.hideLoading();
                    }
                })
            })
        }
    }

    // ---------------------4.帮助方法
    var Util = {
        waitTime:Common.getQueryString("wt")?10:1000,
        messageTime:Common.getQueryString("mt")?20:2000,
        updateInfo:function(json){

            // Default.olduser = json.olduser;      //记录是新用户还是老用户
            localStorage.avatar = json.avatar.replace("http://", "https://");     //记录用户的头像
            localStorage.currentGrade = json.grade.current_name;    //记录当前等级

            $(".header .item").show();

            $(".header .avatar img").attr({src:json.avatar.replace("http://", "https://")});
            $(".header .info .grade").html(json.grade.current_name);
            $(".header .info .grade-value").html(json.experience+"/"+json.grade.next_all_experience);
            $(".header .zuan span").html("x"+json.diamond);
            
            if(json.grade.current_all_experience != json.grade.next_all_experience){
                var percent = (parseInt(json.experience)-parseInt(json.grade.current_all_experience))/(parseInt(json.grade.next_all_experience)-parseInt(json.grade.current_all_experience))*$(".header .info-view").width();
                $(".header .progress img").css({
                    width:percent
                })
            }
        },
        adjustTeaminfo:function(){
            var a = $(".header .icon4").offset().left;
            var b = $(".header .right-view").offset().left;
            var c = $(".header .team-info").width();
            $(".team-info").css({
                left: (a-b-c/2) + "px"
            })
        },
        formatString:function(message){
            // 方法1，捕获异常
            try {
               var msg = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br/>")
               return msg
            }
            catch(err){
                alert("消息组合格式有问题!");
                return;
            }
        },
        platform:function(){
            // 当前浏览器
            if(Common.platform.webKit){
                //当前不是谷歌内核，放出消息流
                var questionHtml = null;
                var message = "本课堂仅支持Chrome内核的浏览器，请更换成谷歌浏览器，360浏览器或者搜狗浏览器重新打开网站上课。";
                questionHtml = '<div class="message text left-animation"> \
                                    <img class="avatar" src="https://resource.bcgame-face2face.haorenao.cn/binshu.jpg" />\
                                    <div class="msg-view">\
                                        <span class="content">'+message+'</span> \
                                    </div>\
                                </div>';
                $(questionHtml).appendTo(".messages");
            }
        },
        catchJsonParseError:function(str){
            var p = new Promise(function(resolve, reject){
                var cc = JSON.parse(str);
                resolve(cc);
            })
            return p;
        }
    }

	Page.init();
})