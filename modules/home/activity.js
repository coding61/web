define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var clubs_url = Common.domain + "/club/clubs/";
    var join_url  = Common.domain + "/club/myclub/?types=join";
    var push_url  = Common.domain + "/club/myclub/?types=create"
    var data_list = [];
    var tag = null;

    var Page = {
        init:function(){
            // 监听登录
            window.addEventListener('message', function(e) {
                var a = e.data;
                if(a == "loadClubs"){
                    window.token = localStorage.token;
                    Page.loadData(clubs_url);
                }
            }, false);

            Common.isLogin(function(token){
                window.token = token ? token : localStorage.token;
                if (token != "null") {
                    Page.loadData(clubs_url);
                }
            })

            Page.clickEvent();
        },
        // 获取活动列表
        loadData:function(url) {
            $.ajax({
                type: "get",
                url: url,
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    for (var i = 0; i < json.results.length; i++) {
                        data_list.push(json.results[i]);
                    }
                    if (json.next) {
                        var parm = json.next.split('program_girl')[1];
                        Page.loadData(Common.domain + parm);
                    }
                    var html = template('list-template', data_list);
                    $('.list-view').html(html);

                    Page.templateClickEvent();
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 获取加入的活动
        loadJoinData:function(url) {
            $.ajax({
                type: "get",
                url: url,
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    for (var i = 0; i < json.results.length; i++) {
                        data_list.push(json.results[i]);
                    }
                    if (json.next) {
                        var parm = json.next.split('program_girl')[1];
                        console.log(parm);
                        Page.loadJoinData(Common.domain + parm);
                    }
                    var html = template('join-template', data_list);
                    $('.join-view').html(html);

                    Page.templateClickEvent();
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 获取发布的活动
        loadPushData:function(url) {
            $.ajax({
                type: "get",
                url: url,
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    for (var i = 0; i < json.results.length; i++) {
                        data_list.push(json.results[i]);
                    }
                    if (json.next) {
                        var parm = json.next.split('program_girl')[1];
                        Page.loadPushData(Common.domain + parm);
                    }

                    var html = template('push-template', data_list);
                    $('.push-view').html(html);

                    Page.templateClickEvent();
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 活动详情视图
        showClubDetails:function(pk) {
            Page.loadClubDetails(pk);
            $('.list-view, .join-view, .push-view').hide();
            $('.details-view').show();
            $('.details-back').click(function() {
                $('.details-title, .details-content, .details-name, .details-num').html('');
                $('.details-view').hide();
                switch (tag) {
                    case '0':
                        $('.list-view').show();
                        break;
                    case '1':
                        $('.join-view').show();
                        break;
                    case '2':
                        $('.push-view').show();
                        break;
                    default:
                        $('.list-view').show();
                        break;
                }
            })
        },
        // 获取活动详情
        loadClubDetails:function(pk) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/club_detail/" + pk + "/",
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    $('.details-title').html(
                        '<img class="title-icon" src="../../statics/images/left_icon.png"/>' + '&nbsp;' + json.name + '&nbsp;' + '<img class="title-icon" src="../../statics/images/right_icon.png"/>'
                    );
                    $('.details-content').html("通告：" + json.introduction);

                    var arr = json.club_member;
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i].leader) {
                            $('.details-name').html("发布者：" + arr[i].owner.name);
                            break;
                        }
                    }
                    $('.details-num').html("已报名：" + json.member_number + "人");

                    var html = template('member-template', arr);
                    $('.member-list').html(html);

                    Page.detailsClickEvent(json);
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 踢出成员
        deleteMember:function(member_pk, club_pk) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/delete_clubmember/" + member_pk + "/",
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    Page.loadClubDetails(club_pk);
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 验证密码
        confirm:function(pk, pw) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/join_club/" + pk +"/?password=" + pw,
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    data_list = [];
                    Page.loadData(clubs_url);
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 创建俱乐部
        createClub:function(title, content, password) {
            $.ajax({
                type: "post",
                url: Common.domain + "/club/club_create/",
                headers: {
                    Authorization: "Token " + token
                },
                data:{
                    'name': title,
                    'introduction': content,
                    'password': password
                },
                success:function(json){
                    Common.dialog(json.message);
                    $('.title-input').val('');
                    $('.content-input').val('');
                    $('.password-input').val('');
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        // 点击事件
        clickEvent:function(){
            $('.column').click(function() {
                data_list = [];
                $('.column').css({'background-color': '#FEFFFF','color': '#000'});
                tag = $(this).attr('value');
                switch(tag) {
                    case '0':
                        $('.activity-list').css({'background-color': '#EB6A99', 'color': '#fff'});
                        $('.join-view, .push-view, .create-view, .details-view').hide();
                        $('.list-view').show();
                        clubs_url = Common.domain + "/club/clubs/";
                        Page.loadData(clubs_url);
                        break;
                    case '1':
                        $('.activity-join').css({'background-color': '#EB6A99', 'color': '#fff'});
                        $('.list-view, .push-view, .create-view, .details-view').hide();
                        $('.join-view').show();
                        Page.loadJoinData(join_url);
                        break;
                    case '2':
                        $('.activity-push').css({'background-color': '#EB6A99', 'color': '#fff'});
                        $('.list-view, .join-view, .create-view, .details-view').hide();
                        $('.push-view').show();
                        Page.loadPushData(push_url);
                        break;
                    case '3':
                        $('.activity-create').css({'background-color': '#EB6A99', 'color': '#fff'});
                        $('.list-view, .join-view, .push-view, .details-view').hide();
                        $('.create-view').show();
                        break;
                    default:
                        break;
                }
            })
            $('.search-btn').click(function() {
                var key = $('.key-word').val();
                if (key) {
                    data_list = [];
                    tag = '0';
                    $('.activity-list').css({'background-color': '#EB6A99', 'color': '#fff'});
                    $('.activity-join, .activity-push, .activity-create').css({'background-color': '#fff', 'color': '#000'});
                    $('.join-view, .push-view, .create-view, .details-view').hide();
                    $('.list-view').show();
                    clubs_url = Common.domain + "/club/clubs/?name=" + key;
                    Page.loadData(clubs_url);
                } else {
                    Common.dialog('请输入关键字');
                }
            })
            $('.create-btn').click(function() {
                var title = $('.title-input').val();
                var content = $('.content-input').val();
                var password = $('.password-input').val();
                if (!title) {
                    Common.dialog('请输入标题');
                } else if (!content) {
                    Common.dialog('请输入内容');
                } else if (!password) {
                    Common.dialog('请设置密码');
                } else {
                    Page.createClub(title, content, password);
                }
            })
        },
        // 列表模版中的点击
        templateClickEvent:function() {
            var pk;
            $('.item-join').unbind('click').click(function() {
                $('.verify').hide();
                pk = $(this).closest('li').attr('data-pk');
                $(this).parent().parent().next().show();
                $('.pw-input').val('');
                $('.pw-input').focus();
            })

            // $('.item-info').unbind('click').click(function() {
            //     pk = $(this).closest('li').attr('data-pk');
            //     var title = $(this).closest('li').attr('data-title');
            //     console.log(pk);
            //     console.log(title);
            // })

            $('.pw-confirm').unbind('click').click(function() {
                var pw = $(this).prev().val();
                if (pw) {
                    Page.confirm(pk, pw);
                    $('.verify').hide();
                } else {
                    Common.dialog('请输入密码');
                }
            })

            $('.verify').unbind('click').click(function() {
                $('.verify').hide();
            })

            $('.item-more').unbind('click').click(function() {
                event.stopPropagation();
                pk = $(this).closest('li').attr('data-pk');
                Page.showClubDetails(pk);
            })
        },
        // 活动详情中的点击
        detailsClickEvent:function(json) {
            // $('.join-chat').unbind('click').click(function() {
                $('.join-chat').attr({
                    "name": json.name,
                    "pk": json.pk
                });
            // })
            // $('.member-item').unbind('click').click(function() {
            //     var member_pk = $(this).closest('li').attr('data-pk');
            //     var member_name = $(this).closest('li').attr('data-name');
            //     var member_owner = $(this).closest('li').attr('data-owner');
            //     console.log(member_pk);
            //     console.log(member_name);
            // })
            if (json.isleader) {
                $('.details-edit').show();
                $('.details-edit').unbind('click').click(function() {
                    $('.member-cut').show();
                    $('.member-cut').unbind('click').click(function() {
                        var member_pk = $(this).closest('li').attr('data-pk');
                        var member_name = $(this).closest('li').attr('data-name');
                        Common.bcAlert("确认踢出参与者：" + member_name + "？", function(){
                            Page.deleteMember(member_pk, json.pk);
                        })
                    })
                })
            }
        },
        // 异常处理
        exceptionHandling:function(xhr, textStatus) {
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
    };
    Page.init();

    // startInit();
    function startInit() {
        $.ajax({
            url: Common.domain + "/im/user_get_token/",
            headers: {
                'Authorization': "Token " + localStorage.token
            },
        }).success(function(result){
            var params = {
                appKey : "8w7jv4qb7eqty",
                token : result.token,
            };
            var userId = "";
            var callbacks = {
                getInstance : function(instance){
                    RongIMLib.RongIMEmoji.init();
                    //instance.sendMessage
                    // registerMessage("PersonMessage");
                },
                getCurrentUser : function(userInfo){
                    console.log(userInfo.userId);
                    userId = userInfo.userId;
                    alert("链接成功；userid=" + userInfo.userId);
                    // document.titie = ("链接成功；userid=" + userInfo.userId);
                    
                },
                receiveNewMessage : function(message){
                    console.log(message);
                    //判断是否有 @ 自己的消息
                    var mentionedInfo = message.content.mentionedInfo || {};
                    var ids = mentionedInfo.userIdList || [];
                    for(var i=0; i < ids.length; i++){
                        if( ids[i] == userId){
                            alert("有人 @ 了你！");
                        }
                    }
                    // showResult("show1",message);
                    // messageOutput(message);
                }
            };
            init(params,callbacks);
        })
    }

    function init(params, callbacks, modules){  
        var appKey = params.appKey;
        var token = params.token;
        // var navi = params.navi || "";

        modules = modules || {};
        var RongIMLib = modules.RongIMLib || window.RongIMLib;
        var RongIMClient = RongIMLib.RongIMClient;
        var protobuf = modules.protobuf || null;

        var config = {};

        //私有云切换navi导航，私有云格式 '120.92.10.214:8888'
        // if(navi !== ""){
        //     config.navi = navi;
        // }
        //私有云切换api,私有云格式 '172.20.210.38:81:8888'
        // var api = params.api || "";
        // if(api !== ""){
        //     config.api = api;
        // }

        //support protobuf url + function
        if(protobuf != null){
            config.protobuf = protobuf;
        };
        RongIMLib.RongIMClient.init(appKey,null,config);
        var instance = RongIMClient.getInstance();
        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                // console.log(status);
                switch (status) {
                    case RongIMLib.ConnectionStatus["CONNECTED"]:
                    case 0:
                        console.log("连接成功")
                        callbacks.getInstance && callbacks.getInstance(instance);
                        break;

                    case RongIMLib.ConnectionStatus["CONNECTING"]:
                    case 1:
                        console.log("连接中")
                        break;

                    case RongIMLib.ConnectionStatus["DISCONNECTED"]:
                    case 2:
                        console.log("当前用户主动断开链接")
                        break;

                    case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
                    case 3:
                        console.log("网络不可用")
                        break;

                    case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
                    case 4:
                        console.log("未知原因，连接关闭")
                        break;

                    case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
                    case 6:
                        console.log("用户账户在其他设备登录，本机会被踢掉线")
                        break;

                    case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
                    case 12:
                        console.log("当前运行域名错误，请检查安全域名配置")
                        break;
                }
            }
        });
        // 设置消息监听器
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                // 判断消息类型
                console.log("新消息: " + message.targetId);
                console.log(message);
                callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
            }
        });

        //开始链接
        RongIMClient.connect(token, {
            onSuccess: function(userId) {
                callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
                console.log("链接成功，用户id：" + userId);
                $('.member-item').click(function() {
                        var member_name = $(this).closest('li').attr('data-name');
                        var member_owner = $(this).closest('li').attr('data-owner');
                        var conversationtype = RongIMLib.ConversationType.PRIVATE;
                        var targetId = member_owner; // 目标 Id，根据不同的 ConversationType，可能是用户 Id、讨论组 Id、群组 Id
                    })
            },
            onTokenIncorrect: function() {
                //console.log('token无效');
            },
            onError:function(errorCode){
              console.log("=============================================");
              console.log(errorCode);
            }
        });
    }



    // 点击最近联系人显示联系人列表
    $('.rongBtn').click(function() {
        $('.rongWai').show();
        $('.rongBtn').hide();
    })
    // 点击最近联系人隐藏联系人列表
    $('.rongWai .leftTitle').click(function() {
        $('.rongBtn').show();
        $('.rongWai').hide();
    })
    // 点击联系人
    $('.contactList .contactOne').click(function() {
        $('.rongWai .right').show();
        messageBottom();
    })
    // 聊天最新消息底部显示
    function messageBottom() {
        $('.message').scrollTop($('.message').scrollTop() + 400);
    }
});
