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
            })
            Page.loadData(clubs_url);
            Page.clickEvent();
        },
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

                    var pk;
                    $('.item-join').unbind('click').click(function() {
                        $('.verify').hide();
                        pk = $(this).closest('li').attr('data-pk');
                        $(this).parent().parent().next().show();
                        $('.pw-input').val('');
                        $('.pw-input').focus();
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
                        pk = $(this).closest('li').attr('data-pk');
                        Page.showClubDetails(pk);
                    })
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        loadJoinData:function(url) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/myclub/?types=join",
                headers: {
                    Authorization: "Token " + token
                },
                success:function(json){
                    for (var i = 0; i < json.results.length; i++) {
                        data_list.push(json.results[i]);
                    }
                    if (json.next) {
                        var parm = json.next.split('program_girl')[1];
                        Page.loadJoinData(Common.domain + parm);
                    }
                    var html = template('join-template', data_list);
                    $('.join-view').html(html);

                    $('.item-more').unbind('click').click(function() {
                        var pk = $(this).closest('li').attr('data-pk');
                        Page.showClubDetails(pk);
                    })
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
        loadPushData:function(url) {
            $.ajax({
                type: "get",
                url: Common.domain + "/club/myclub/?types=create",
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

                    $('.item-more').unbind('click').click(function() {
                        var pk = $(this).closest('li').attr('data-pk');
                        Page.showClubDetails(pk);
                    })
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
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

                    // 容云聊天要用的 name owner
                    $('.member-item').unbind('click').click(function() {
                        var member_pk = $(this).closest('li').attr('data-pk');
                        var member_name = $(this).closest('li').attr('data-name');
                        var member_owner = $(this).closest('li').attr('data-owner');
                        console.log(member_name);
                        console.log(member_owner);
                    })
                    if (json.isleader) {
                        $('.details-edit').show();
                        $('.details-edit').unbind('click').click(function() {
                            $('.member-cut').show();
                            $('.member-cut').unbind('click').click(function() {
                                var member_pk = $(this).closest('li').attr('data-pk');
                                var member_name = $(this).closest('li').attr('data-name');
                                Common.bcAlert("确认踢出参与者：" + member_name + "？", function(){
                                    Page.deleteMember(member_pk, pk);
                                })
                            })

                        })
                    }
                },
                error:function(xhr, textStatus){
                    Page.exceptionHandling(xhr, textStatus);
                }
            })
        },
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
});
