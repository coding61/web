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
                // $('.column').css({'background-color': '#FEFFFF','color': '#000'});
                tag = $(this).attr('value');
                switch(tag) {
                    case '0':
                        $('.activity-list').css({'background-color': '#EB6A99', 'color': '#fff'});
						$('.activity-join, .activity-push').css({'background-color': '#FEFFFF','color': '#000'});
                        $('.join-view, .push-view, .create-view, .details-view').hide();
                        $('.list-view').show();
                        clubs_url = Common.domain + "/club/clubs/";
                        Page.loadData(clubs_url);
                        break;
                    case '1':
                        $('.activity-join').css({'background-color': '#EB6A99', 'color': '#fff'});
						$('.activity-list, .activity-push').css({'background-color': '#FEFFFF','color': '#000'});
                        $('.list-view, .push-view, .create-view, .details-view').hide();
                        $('.join-view').show();
                        Page.loadJoinData(join_url);
                        break;
                    case '2':
                        $('.activity-push').css({'background-color': '#EB6A99', 'color': '#fff'});
						$('.activity-list, .activity-join').css({'background-color': '#FEFFFF','color': '#000'});
                        $('.list-view, .join-view, .create-view, .details-view').hide();
                        $('.push-view').show();
                        Page.loadPushData(push_url);
                        break;
                    case '3':
						$('.activity-list, .activity-join, .activity-push').css({'background-color': '#FEFFFF','color': '#000'});
                        // $('.activity-create').css({'background-color': '#EB6A99', 'color': '#fff'});
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
                $(this).parent().next().show();
                $('.pw-input').val('');
                $('.pw-input').focus();
            })

            $('.item-info').unbind('click').click(function() {
                pk = $(this).closest('li').attr('data-pk');
                var title = $(this).closest('li').attr('data-title');
                console.log(pk);
                console.log(title);
            })

			$('.password').unbind('click').click(function() {
				event.stopPropagation();
            })

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
                // });
            })
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
            } else {
            	$('.details-edit').hide();
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
    var myTargetId; //我的id
    // var conversationtype; //会话类型
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
                    clickPersonOrGroup(); //点击头像或加入群聊
                },
                getCurrentUser : function(userInfo){
                    console.log(userInfo.userId);
                    userId = userInfo.userId;
                    // alert("链接成功；userid=" + userInfo.userId);
                    myTargetId = userInfo.userId;
                    var contactJson = !!localStorage.contactList ? JSON.parse(localStorage.contactList) : false;
                    if (contactJson) { //本地有没有账号记录
                        if (contactJson[userInfo.userId]) { //有自己的记录
                            for(item in contactJson[userInfo.userId]) {
                                if (contactJson[userInfo.userId][item][3] == 0) {
                                    $('.rongBtn .redPoint').show();
                                    break;
                                }
                            }
                        } else { //没有的话，创建一个自己空的记录
                            contactJson[userInfo.userId] = {};
                            localStorage.contactList = JSON.stringify(contactJson);
                            var talkListJson = {};
                            talkListJson[userInfo.userId] = {};
                            localStorage.talkList = JSON.stringify(talkListJson);
                        }
                    } else { //没有账号记录的话，存一个自己空的记录
                        var json = {};
                        json[userInfo.userId] = {};
                        localStorage.contactList = JSON.stringify(json);
                         var talkListJson = {};
                        talkListJson[userInfo.userId] = {};
                        localStorage.talkList = JSON.stringify(talkListJson);
                    }
                    refreshContact();
                },
                receiveNewMessage : function(message){
                    // console.log(message);
                    //判断是否有 @ 自己的消息
                    // var mentionedInfo = message.content.mentionedInfo || {};
                    // var ids = mentionedInfo.userIdList || [];
                    // for(var i=0; i < ids.length; i++){
                    //     if( ids[i] == userId){
                    //         // alert("有人 @ 了你！");
                    //     }
                    // }
                    saveToLocal(message, 0, message.conversationType, function(){//消息和联系人存本地 0代表存未读
                        // 如果融云窗口未打开
                        if ($('.rongWai').css("display") == "none") {
                            $('.rongBtn .redPoint').show();
                        } else {
                            refreshMessage(); //刷新聊天窗口信息
                        }
                    });


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
                        console.log("网络不可用");
                        // alert("网络不可用");
                        if ($('.rongWai .right').css("display") == "block") {
                            $('.rongWai .message').append('<p style="text-align: center;">连接已断开, 请刷新重试。</p>');
                        }
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

    function clickPersonOrGroup() {
        // 点头像单聊
        $(document).on("click", '.member-item', function() {
            var member_name = $(this).closest('li').attr('data-name');
            var member_owner = $(this).closest('li').attr('data-owner');
            $('.rongWai').show();
            $('.rongWai .right').show();
            $('.rongWai .right .contacter').html(member_name); //设置当前会话
            $('.rongWai .right .contacter').attr({"data-id": member_owner});
            $('.rongWai .right .contacter').attr({"data-type": "private"});
            showMessageWindow(member_owner, RongIMLib.ConversationType.PRIVATE);
        })
        // 点击联系人
        $(document).on("click", '.rongWai .contactItem', function() {
            var name = $(this).children('.contactName').attr("data-id");
            var owner = $(this).attr('data-id');
            $('.rongWai').show();
            $('.rongWai .right').show();
            $('.rongWai .right .contacter').html(name); //设置当前会话
            $('.rongWai .right .contacter').attr({"data-id": owner});
            if ($(this).attr('data-type') == 'private') { //联系人为人
                $('.rongWai .right .contacter').attr({"data-type": "private"});
                showMessageWindow(owner, RongIMLib.ConversationType.PRIVATE);
            } else { //联系人为群
                $('.rongWai .right .contacter').attr({"data-type": "group"});
                showMessageWindow(owner, RongIMLib.ConversationType.GROUP);
            }
            $('.allEmoji').hide();
        })
        // 点击加入群聊
        // $('.join-chat').unbind('click').click(function() {
        // $('.join-chat').click(function() {
        $(document).on("click", '.join-chat', function() {
            var targetId = $(this).attr("pk");
            var title = $(this).attr('name');
            $('.rongWai').show();
            $('.rongWai .right').show();
            $('.rongWai .contacter').html(title);
            $('.rongWai .right .contacter').attr({"data-id": targetId});
            $('.rongWai .right .contacter').attr({"data-type": "group"});
            showMessageWindow(targetId, RongIMLib.ConversationType.GROUP);
        })
    }
    // 显示会话窗口
    function showMessageWindow(owner, conversationType) {
        refreshMessage();
        $('.send').unbind().click(function() { //点击发送
            $('.allEmoji').hide();
            var textContent = $('.textarea').val();
            if (textContent != '') {
                var msg = new RongIMLib.TextMessage({content:textContent,extra:"附加信息"});
                var targetId = owner; // 目标 Id，根据不同的 ConversationType，可能是用户 Id、讨论组 Id、群组 Id
                sendMessage(conversationType, targetId, msg)
            } else {
                alert("请输入内容");
            }
        })
    }
    // 发送消息
    function sendMessage(conversationType, targetId, msg) {
        RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function (message) {
                //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                console.log("Send successfully");
                if (message.messageType == "TextMessage") {
                    var html = '<div class="messageRight"><div class="time">'+ new Date(message.sentTime).toLocaleString()+'</div><div class="messageRightItem"><span>'+message.content.content+'</span><img class="chatHeaderRight" src="'+localStorage.avatar+'" /></div></div>';
                    $('.message').append(html);
                } else if (message.messageType == "ImageMessage") {
                    var html = '<div class="messageRight"><div class="time">'+ new Date(message.sentTime).toLocaleString()+'</div><div class="messageRightItem"><img style="max-width: 300px; max-height: 150px;" src="'+message.content.imageUri+'"/img><img class="chatHeaderRight" src="'+localStorage.avatar+'" /></div></div>';
                    $('.message').append(html);
                }

                messageBottom();
                $('.textarea').val('');
                saveToLocal(message, 1, conversationType); //消息和联系人存本地，1代表存已读
            },
            onError: function (errorCode,message) {
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        info = '在黑名单中，无法向对方发送消息';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                        info = '不在讨论组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        info = '不在群组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                        info = '不在聊天室中';
                        break;
                    default :
                        info = x;
                        break;
                }
                console.log('发送失败:' + info);
            }
        });
    }
    //消息和联系人存本地
    function saveToLocal(message,status,conversationType,callback) { //status 代表消息读取状态
        if (message.senderUserId != myTargetId) { //收到消息
            $.ajax({
                url: Common.domain + "/userinfo/username_userinfo/?username=" + message.senderUserId
            }).success(function(rep){
                // 存联系人
                var contactJson = !!localStorage.contactList ? JSON.parse(localStorage.contactList) : {};
                // 存历史消息
                var talkListJson = !!localStorage.talkList ? JSON.parse(localStorage.talkList) : {};
                if (conversationType == 1) {
                    // 存联系人
                    contactJson[myTargetId][message.targetId] = [message.targetId, rep.name, rep.avatar, status, "private"];
                    localStorage.contactList = JSON.stringify(contactJson);
                    typeof callback == 'function' ? callback() : '';
                } else {
                    $.ajax({
                        url: Common.domain + "/club/club_detail/" + message.targetId + "/"
                    }).success(function(rep) {
                        // 存联系人
                        contactJson[myTargetId][message.targetId] = [message.targetId, rep.name, "https://static1.bcjiaoyu.com/groupHeader.jpg", status, "group"];
                        localStorage.contactList = JSON.stringify(contactJson);
                        typeof callback == 'function' ? callback() : '';
                    }).error(function(err) {

                    })
                }
                if (talkListJson[myTargetId][message.targetId]) { //判断有没有对方的聊天记录
                    // talkListJson[myTargetId][message.targetId].push({"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": message.content.content});
                    if (message.messageType == "TextMessage") {
                        talkListJson[myTargetId][message.targetId].push({"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"textMessage": message.content.content}});
                    } else if (message.messageType == "ImageMessage") {
                        talkListJson[myTargetId][message.targetId].push({"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"imgMessage": message.content.imageUri}});
                    }
                } else {
                    // talkListJson[myTargetId][message.targetId] = [{"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": message.content.content}];
                    if (message.messageType == "TextMessage") {
                        talkListJson[myTargetId][message.targetId] = [{"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"textMessage": message.content.content}}];
                    } else if (message.messageType == "ImageMessage") {
                        talkListJson[myTargetId][message.targetId] = [{"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"imgMessage": message.content.imageUri}}];
                    }
                }
                localStorage.talkList = JSON.stringify(talkListJson);
            }).error(function() {

            })
        } else { //发送消息
            $.ajax({
                url: Common.domain + "/userinfo/username_userinfo/?username=" + message.senderUserId
            }).success(function(rep){
                // 存历史消息
                var talkListJson = !!localStorage.talkList ? JSON.parse(localStorage.talkList) : {};
                if (talkListJson[myTargetId][message.targetId]) { //判断有没有对方的聊天记录
                    if (message.messageType == "TextMessage") {
                        talkListJson[myTargetId][message.targetId].push({"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"textMessage": message.content.content}});
                    } else if (message.messageType == "ImageMessage") {
                        talkListJson[myTargetId][message.targetId].push({"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"imgMessage": message.content.imageUri}});
                    }
                } else {
                    if (message.messageType == "TextMessage") {
                        talkListJson[myTargetId][message.targetId] = [{"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"textMessage": message.content.content}}];
                    } else if (message.messageType == "ImageMessage") {
                        talkListJson[myTargetId][message.targetId] = [{"id": message.senderUserId, "name": rep.name, "avatar": rep.avatar, "sentTime": message.sentTime, "content": {"imgMessage": message.content.imageUri}}];
                    }
                }
                localStorage.talkList = JSON.stringify(talkListJson);
                if (conversationType == 1) {
                    $.ajax({
                        url: Common.domain + "/userinfo/username_userinfo/?username=" + message.targetId
                    }).success(function(rep){
                        // 存联系人
                        var contactJson = !!localStorage.contactList ? JSON.parse(localStorage.contactList) : {};
                        // 存联系人
                        contactJson[myTargetId][message.targetId] = [message.targetId, rep.name, rep.avatar, status, "private"];
                        localStorage.contactList = JSON.stringify(contactJson);
                        refreshContact();
                    }).error(function(err) {

                    })
                } else {
                    // 存联系人
                    var contactJson = !!localStorage.contactList ? JSON.parse(localStorage.contactList) : {};
                    // 存联系人
                    contactJson[myTargetId][message.targetId] = [message.targetId, $('.rongWai .contacter').text(), "https://static1.bcjiaoyu.com/groupHeader.jpg", status, "group"];
                    localStorage.contactList = JSON.stringify(contactJson);
                    refreshContact();
                }

            }).error(function() {

            })
        }
    }

    // 点击最近联系人显示联系人列表
    $('.rongBtn').click(function() {
        $('.rongWai').show();
        $('.rongBtn').hide();
        refreshMessage()
    })
    // 刷新消息
    function refreshMessage() {
        var currentContact = $('.rongWai .contacter').attr("data-id");
        if (currentContact != '') {
            var contactJson = JSON.parse(localStorage.contactList);
            for (item in contactJson[myTargetId]) {
                if (item == currentContact) {
                    contactJson[myTargetId][item][3] = 1;
                    localStorage.contactList = JSON.stringify(contactJson);
                    break;
                }
            }
            // 刷新消息
            var talkListJson = JSON.parse(localStorage.talkList);
            $('.rongWai .message').empty();
            var html = ArtTemplate("messageTemplate", talkListJson[myTargetId][currentContact]);
            $('.rongWai .message').html(html);
            messageBottom();
        }
        // 刷新联系人
        refreshContact();
    }
    // 点击最近联系人隐藏联系人列表
    $('.rongWai .leftTitle').click(function() {
        $('.rongBtn').show();
        $('.rongWai').hide();
        $('.allEmoji').hide();
        refreshContact();
    })

    // 刷新联系人
    function refreshContact() {
        // 刷新联系人
        var contactJson = JSON.parse(localStorage.contactList);
        $('.rongWai .contactList').empty();
        var html = ArtTemplate("contactTemplate", contactJson[myTargetId]);
        $('.rongWai .contactList').html(html);
        var i = 0;
        for (item in contactJson[myTargetId]) {
            if (contactJson[myTargetId][item][3] == 0) {
                i++;
                $('.rongBtn .redPoint').show();
                break;
            }
        }
        if (i == 0) {
            $('.rongBtn .redPoint').hide();
        }
    }

    // 上传图片
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'upLoad',       //上传选择的点选按钮，**必需**
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: 'https://static1.bcjiaoyu.com',   //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function(file) {
            $.ajax({
                async: false,
                type: "POST",
                url:Common.domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ localStorage.token
                },
                data: {
                    filename: filename ? filename : 'dfhu.png',
                },
                dataType: "json",
                success: function(json) {
                  uptoken = json.token;
                  upkey = json.key;
                }
              });
              return uptoken;
        },
        get_new_uptoken: true,  //设置上传文件的时候是否每次都重新获取新的token
        container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
        // max_file_size: '100mb',           //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',  //引入flash,相对路径
        // max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
           // Maximum file size
           max_file_size : '10mb',
           // Specify what files to browse for
           mime_types: [
                   {title : "Image files", extensions : "jpg,gif,png,jpeg"},
           ]
        },
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                    $('.allEmoji').hide();
                    filename = file.name;
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                var json = JSON.parse(info.response);
                var targetId = $('.rongWai .contacter').attr("data-id");
                var str = $('.rongWai .contacter').attr("data-type");
                var image = new Image();
                image.src = json.url;
                var imgBase64 = getBase64Image(image);
                var msg = new RongIMLib.ImageMessage({content:imgBase64,imageUri:json.url});
                if (str == "private") {
                     sendMessage(1, targetId, msg) //发送单聊图片消息
                } else {
                     sendMessage(3, targetId, msg) //发送群聊图片消息
                }
            },
            'Error': function(up, err, errTip) {
                   //上传出错时,处理相关的事情
                   alert("上传失败");
            },
            'UploadComplete': function() {
                   //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = upkey;
                return key;
            }
        }
    });

    //将图片转为base64
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
    }
    // 显示所有表情
    $('.emoji').click(function() {
        if ($('.allEmoji').css("display") == "none") {
            var emojis = RongIMLib.RongIMEmoji.emojis; //获取所有表情
            for (var i = 0; i < emojis.length; i++) {
                $('.allEmoji').append(emojis[i].innerHTML);
            }
            $('.allEmoji').show();
        } else {
            $('.allEmoji').hide();
        }
    })
    // 点击表情
    $(document).on('click', '.allEmoji span', function() {
        $('.allEmoji').hide();
        var message = $(this).text();
        // message = RongIMLib.RongIMEmoji.emojiToSymbol(message);
        $('.textarea').val($('.textarea').val() + message);
    })
    // 聊天最新消息底部显示
    function messageBottom() {
        // $('.message').scrollTop($('.message').scrollTop() + 400);
        $('.message').scrollTop(document.getElementsByClassName('message')[0].scrollHeight);
    }

    ArtTemplate.helper('isMe', function(value){
        if (value == myTargetId) {
            return true;
        } else {
            return false;
        }
    })
    ArtTemplate.helper('formatTime', function(value) {
        return new Date(value).toLocaleString();
    })

});
