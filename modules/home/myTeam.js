define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    // var WXConfig = require('common/WXJSSDK.js');

    var Page = {
        name:null,
        intro:null,
        init:function(){
            Team.init();
        },
        clickEvent:function(){

            // textarea编辑框高度自适应
             $('.main-view .team .intro textarea').on('input', function(){
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + "px"
            })

            // 解散点击
            $(".header .quit").click(function(){
                // 解散团队
                Common.confirm("您真的确定要解散团队吗?", function(){
                    Team.destoryTeam();
                })
                
            })
            
            // 编辑按钮点击
            $(".main-view .team img.edit-icon").click(function(){
                $(this).hide();
                $(".main-view .team .avatar span").hide();
                $(".main-view .team .intro span.text").hide();
                $(".main-view .team img.end-icon").show();
                $(".main-view .team .avatar input").show();
                $(".main-view .team .intro textarea").show();
                
                // input 聚焦
                var str = $(".main-view .team .avatar input").val();
                $(".main-view .team .avatar input").val("").focus().val(str);
                

                // textarea 布置
                var str1 = $('.main-view .team .intro span').html();
                $('.main-view .team .intro textarea').html(str1);

                var scrollHeight = $('.main-view .team .intro textarea')[0].scrollHeight;
                $('.main-view .team .intro textarea').css({
                    height:scrollHeight + 'px'
                })
            })

            // 结束按钮点击
            $(".main-view .team img.end-icon").click(function(){
                Page.name = $(".main-view .team .avatar input").val();
                Page.intro = $(".main-view .team .intro textarea").val();


                $(this).hide();
                $(".main-view .team .avatar input").hide();
                $(".main-view .team .intro textarea").hide();
                
                $(".main-view .team img.edit-icon").show();
                $(".main-view .team .avatar span").show();
                $(".main-view .team .intro span.text").show();

                
                $(".main-view .team .avatar span").html(Page.name);
                $(".main-view .team .intro span.text").html(Page.intro);

                // 修改战队信息
                Team.updateTeam(Page.name, Page.intro);

            })
            
            // 删除成员按钮点击
            $(".delete-icon").click(function(){
                // 删除小组成员
                var this_ = $(this);
                Common.confirm("您真的确定要删除该队员?", function(){
                    Team.removeTeamMember(this_, this_.parents('.member').attr("data-pk"));
                })

            })

            
            // 底部按钮点击
            $(".action").click(function(){
                if ($(this).hasClass('share')) {
                    // 邀请分享
                    $(".shadow-view").show();

                    // 分享点击取消
                    $(".shadow-view").click(function(){
                        $(this).hide();
                    })
                    
                    /*
                    var url = window.location.href;
                    if (url.indexOf("pk") != -1) {
                        // $(".shadow-view").show();
                    }else{
                        // var newUrl = url.split('?')[0] + "?pk=" + Team.pk;
                        // // newUrl = url.split('?')[0] + "#pk=" + Team.pk;
                        // history.pushState({pk:Team.pk}, null, newUrl);
                        // // history.replaceState({pk:Team.pk}, null, '?pk=' + Team.pk);
                        // window.location.replace(newUrl);
                        // Common.dialog(window.location.href);
                        // location.href = url.split('?')[0] + "?pk=" + Team.pk;
                    }
                    */

                }else if ($(this).hasClass('join')) {
                    var this_ = $(this);
                    // 申请加入
                    // if (Team.pk && !Team.code) {
                    //     // 分享进来的页面, 点加入要先授权
                    //     // 微信网页授权
                    //     var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk='+Team.pk;
                    //     Common.authWXLogin(redirectUri);

                    // }else{
                        Common.confirm("您确定要加入此战队吗?", function(){

                            // 加入团队
                            Team.joinKnownTeam(this_);
                        })
                    // }
                    
                    
                }else if ($(this).hasClass('unjoin')) {
                    // 不能加入
                                        
                }
            })

            // 分享点击取消
            $(".shadow-view").click(function(){
                $(this).hide();
            })
        }
    };

    var Team = {
        pk:Common.getQueryString("pk"),
        name:decodeURIComponent(Common.getQueryString("name")),
        currentUser:null,  //当前用户的 pk
        data:null, //小组数据
        code:Common.getQueryString('code'),
        init:function(){
            
            $("title").html(Team.name);
            $(".header .title").html(Team.name);

            // 打开加载动画
            $(".wait-loading").show();

            // setTimeout(function(){
            //     if (!Team.data) {
            //         // 6秒之后还没有数据, 弹出请求超时
            //         Common.dialog('请求超时');
            //         $(".wait-loading").hide();
            //         return;
            //     }
            // }, 6000);      

            if (Team.code && !Team.pk) {
                // 上一页进来的, 未授权
                Team.getToken();
            } else if(!Team.code && !Team.pk){
                // 上一页进来, 已授权
                Team.loadInfo();
            }else if(Team.pk && !Team.code){
                // 从分享进来,加载 team 信息
                Common.isLogin(function(token){
                    if (token == "null") {
                        // 分享进来的页面
                        // 微信网页授权
                        var redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk='+Team.pk + "&name=" +Team.name;
                        Common.authWXLogin(redirectUri);

                        // Team.loadShareTeam();   //用户还不曾加入
                    }else{
                        Team.loadInfo();   //用户已经加入, 再次从分享进来
                    }
                })
                
            }else if(Team.pk && Team.code){
                // 分享进来, 点击加入,先授权,在加载team信息
                Team.getToken();
            }else{
                Team.loadInfo();
            }
        },
        getToken:function(){
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Team.code
                },
                timeout:6000,
                success:function(json){
                    if(window.localStorage){
                        localStorage.token = json.token;
                    }else{
                        $.cookie("token", json.token, {
                            path: "/"
                        });
                    }

                    Team.loadInfo();
                },
                error:function(xhr, textStatus){
                    $(".wait-loading").hide();

                    if (textStatus == "timeout") {
                        Common.dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else if (xhr.status == 401) {
                        var redirectUri = null;
                        if (Team.pk) {
                            redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Team.pk + "&name=" + Team.name;
                        }else{
                            redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                        }
                        Common.authWXLogin(redirectUri);
                        return;
                    }else{
                        Common.dialog('服务器繁忙');
                        return;
                    }
                    console.log(textStatus);
                }
            })
        },
        loadInfo:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    if (Common.getQueryString("pk")) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" + Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Team.currentUser = json.pk;
                        
                        if (Team.pk) {
                            Team.loadShareTeam();   
                        }else{
                            Team.load();
                        }
                        
                    },
                    error:function(xhr, textStatus){
                        $(".wait-loading").hide();

                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            if (Common.getQueryString("pk")) {
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                            }else{
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            }
                            Common.authWXLogin(redirectUri);
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
        loadShareTeam:function(){
            Common.isLogin(function(token){
                // if (token == "null") {
                //     Common.dialog('请先授权');
                //     return;
                // }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/group_detail/"+Team.pk+"/",
                    timeout:6000,
                    success:function(json){
                        // Team.joinKnownTeam($(".join"));
                        Team.data = json;
                        Team.adjustData(json);
                    },
                    error:function(xhr, textStatus){
                        $(".wait-loading").hide();

                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("此团队已解散");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Team.pk + "&name=" +Team.name;
                            Common.authWXLogin(redirectUri);
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
        load:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        // console.log(json);
                        Team.data = json;
                        Team.adjustData(json);
                    },
                    error:function(xhr, textStatus){
                        $(".wait-loading").hide();

                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            Common.authWXLogin(redirectUri);
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
        adjustData:function(json){

            $(".wait-loading").hide();

            Team.pk = json.pk;
                        
            // leader:true,   //当前用户是组长吗
            // inTeam:true,  //当前用户是否在团队里,
            // isManyuan:true,  //团队是否满员
            var leader=false,
                inTeam=false, 
                isManyuan=false;
            if (json.group_member.length == 4) {
                isManyuan = true;
            }else{
                isManyuan = false;
            }
            
            var members = json.group_member;
            for (var i = 0; i < members.length; i++) {
                if (members[i].owner.pk == Team.currentUser){
                    inTeam = true;
                    break;
                }
            }
            for (var i = 0; i < members.length; i++) {
                if(members[i].leader==true){
                    if (members[i].owner.pk == Team.currentUser) {
                        //当前用户是组长
                        leader = true;
                    }else{
                        leader = false;
                    }

                    break;
                }
            }

            var dic = json;

            dic['leader'] = leader;
            dic['inTeam'] = inTeam;
            dic['isManyuan'] = isManyuan;

            
            // 将队长放到最前面
            var number = null,
                targent = null;
            for (var i = 0; i < dic.group_member.length; i++) {
                if(dic.group_member[i].leader == true){
                    number = i;
                    targent = dic.group_member[i];
                    break;
                }
            }
            if (number != null && targent != null) {
                dic.group_member.splice(number,1);
                dic.group_member.unshift(targent);  //将队长放到第一位
            }else{
            }
            
            var array = [null, null, null, null];
            for (var i = 0; i < dic.group_member.length; i++) {
                array[i] = dic.group_member[i];
            }

            dic.group_member = array;
            
            
            console.log(dic);

            var html = ArtTemplate("main-view-template", dic);
            $(".body-view").html(html);

            if (dic.inTeam == true && dic.leader == true) {
                $(".leader").show();

                $(".leader.editing").hide();  //关闭点编辑出来的元素
            }else{
                $(".leader").hide();
            }

            Page.clickEvent();
        },
        updateTeam:function(name, intro){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    if (Common.getQueryString("pk")) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/groups/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        name:name,
                        announcement:intro
                    },
                    dataType:"json",
                    timeout:6000,
                    success:function(json){
                        Common.dialog('修改成功');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            if (Common.getQueryString("pk")) {
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                            }else{
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            }
                            Common.authWXLogin(redirectUri);
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
        destoryTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    if (Common.getQueryString("pk")) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"delete",
                    url:Common.domain + "/userinfo/groups/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        $(".body-view").html(null)
                        $(".quit").remove();

                        Common.dialog('您没有团队');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            if (Common.getQueryString("pk")) {
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                            }else{
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            }
                            Common.authWXLogin(redirectUri);
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
        joinKnownTeam:function(this_){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    if (Common.getQueryString("pk")) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/join_group/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Common.dialog('加入成功');
                        // this_.removeClass('join').addClass('unjoin');

                        Team.adjustData(json);

                        /*
                        var parent =  $(".default-avatar").eq(0).parent();
                        parent.children('.default-avatar').children('img').attr({src:'../../statics/images/11.jpg'});
                        parent.children('.default-avatar').removeClass("default-avatar").addClass('avatar');
                        parent.children('.name').html("张三美");

                        // 当前用户加入后, 变邀请
                        this_.children('span').html('邀请好友加入');
                        this_.removeClass('join').addClass('share');
                        */
                        
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            if (Common.getQueryString("pk")) {
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                            }else{
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            }
                            Common.authWXLogin(redirectUri);
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
        removeTeamMember:function(this_, pk){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = null;
                    if (Common.getQueryString("pk")) {
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                    }else{
                        redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                    }
                    Common.authWXLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/delete_groupmember/"+pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){

                        this_.parents('.member').children('.avatar').children('img').attr({src:'../../statics/images/default-avatar.png'});
                        this_.parents('.member').children('.avatar').removeClass('avatar').addClass('default-avatar');
                        this_.parents('.member').children('.name').html('待加入')
                        this_.parents('.member').children('.delete-icon').remove();

                        $(".action").removeClass("unjoin").addClass('share');
                        $(".action span").html('邀请好友加入');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 404) {
                            Common.dialog("找不到该成员");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else if (xhr.status == 401) {
                            var redirectUri = null;
                            if (Common.getQueryString("pk")) {
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html?pk=' + Common.getQueryString("pk") + "&name=" +Team.name;
                            }else{
                                redirectUri = 'https://www.cxy61.com/cxyteam/app/home/myTeam.html';
                            }
                            Common.authWXLogin(redirectUri);
                            return;
                        }else{
                            Common.dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        }
    }

    Page.init();

});
