define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    ArtTemplate.config("escape", false);
    // var WXConfig = require('common/WXJSSDK.js');
    
    // 分享
    var WXShare = require('team/wxshare.js');
    var title = "邀请你加入我的团队",
        desc = "程序媛组队第二期，和我一起学编程领100奖学金。",
        link = location.href,
        imgUrl = "https://resource.bcgame-face2face.haorenao.cn/lg1024.png";
    WXShare.SetShareData(title, desc, link, imgUrl);
    
    var pk = Common.getQueryString("pk")?Common.getQueryString("pk"):null,
        name = decodeURIComponent(Common.getQueryString("name"))?decodeURIComponent(Common.getQueryString("name")):"",
        code = Common.getQueryString('code')?Common.getQueryString('code'):'',
        flag = Common.getQueryString("flag")?Common.getQueryString("flag"):'';

    var MY_TEAM_URL = 'https://www.cxy61.com/girl/app/team/myTeam.html?pk='+pk + "&name=" +name;
    var MY_TEAM_URL1 = 'https://www.cxy61.com/girl/app/team/myTeam.html';
    var MY_TEAM_URL_ZAN = 'https://www.cxy61.com/girl/app/team/myTeam.html?pk=' + pk + "&name=" + name + "&flag=" + flag;
    var batch_type = 2;     //第二批组队, 创建队伍，获取队伍加此字段

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

                if (Page.name.length > 10) {
                    Common.dialog('团队名称请控制在10字符以内');
                    return;
                }

                if (Page.intro.length > 50) {
                    Common.dialog('团队介绍请控制在50字符以内');
                    return;
                }

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
                if ($(this).hasClass("action-gray")) return;
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
                    Common.confirm("您确定要加入此战队吗?", function(){
                        // 加入团队
                        Team.joinKnownTeam(this_);
                    })
                }else if ($(this).hasClass('unjoin')) {
                    // 不能加入                 
                }else if ($(this).hasClass('receive-course')) {
                    // 领取课程
                    location.href = "receiveCourse.html";
                }
            })

            // 分享点击取消
            $(".shadow-view").click(function(){
                $(this).hide();
            })

            // 点赞
            $(".zan").click(function(){
                if ($(this).hasClass('unselect')) {
                    // 点赞
                    Team.zanTeam($(this));
                }else if ($(this).hasClass('select')) {
                    // 不能取消赞
                }
            })

            // 修改备注点击
            $(".edit-bz").click(function(){
                var remark = $(this).parents('.member').attr("data-remark");
                // //调整格式
                // if (remark.match(/<[a-zA-Z]+>/g)) {
                // }else{
                //     remark = remark.replace(/\r\n/g, "<br/>");
                //     remark = remark.replace(/\n/g, "<br/>");
                //     remark = remark.replace(/\ /g, "&nbsp"); //替换 空格
                //     remark = remark.replace(/\t/g, "&nbsp");

                // }
                if(remark == "暂无备注"){
                    remark = ""
                }
                $(".bz textarea").val("").focus().val(remark);
                // $(".bz textarea").val(remark);

                $(".bz .item1").hide();
                $(".bz .item").show();
                $(".bz-shadow-view").show();
            })

            // 查看备住点击
            $(".look-bz").click(function(){
                var remark = $(this).parents('.member').attr("data-remark");
                //调整格式
                if (remark.match(/<[a-zA-Z]+>/g)) {
                }else{
                    remark = remark.replace(/\r\n/g, "<br/>");
                    remark = remark.replace(/\n/g, "<br/>");
                    remark = remark.replace(/\ /g, "&nbsp"); //替换 空格
                    remark = remark.replace(/\t/g, "&nbsp");

                }
                
                $(".bz .content span").html(remark);

                $(".bz .item").hide();
                $(".bz .item1").show();
                $(".bz-shadow-view").show();
            })

            // 关闭备注
            $(".bz .close").click(function(){
                $(".bz-shadow-view").hide();
            })

            // 提交备注
            $(".bz .confirm").click(function(){
                if ($(".bz textarea").val() == "") {
                    Common.dialog("请填写备注");
                    return;
                }
                Team.editBz($(".bz textarea").val());
            })
        }
    };

    var Team = {
        pk:Common.getQueryString("pk"),
        name:decodeURIComponent(Common.getQueryString("name")),
        currentUser:null,  //当前用户的 pk
        data:null, //小组数据
        isReceiveCourse:null, //是否领取过课程
        code:Common.getQueryString('code'),
        flag:Common.getQueryString("flag"),
        init:function(){
            
            $("title").html(Team.name);
            $(".header .title").html(Team.name);

            // 打开加载动画
            $(".wait-loading").show();     

            if (Team.code) {
                Team.getToken();
            }else{
                //加载团队信息
                Team.loadInfo(); 
                
                /*
                Team.currentUser = 1;
                var json1 = {
                    likes:5,
                    pk:1,
                    name:"活动名称",
                    announcement:"团队介绍：我们是一支很强的队伍。我们一支 很强的队伍。我们是一支很强的队伍。我们一 支很强的队伍。我们是一支很强的队伍。我是",
                    group_member:[
                        {owner:{pk:1, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小一"}, leader:true},
                        {owner:{pk:2, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小二"}, leader:false},
                        {owner:{pk:3, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小三"}, leader:false},
                        {owner:{pk:4, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小四"}, leader:false}
                    ],
                }
                var json2 = {
                    likes:5,
                    pk:1,
                    name:"活动名称",
                    announcement:"团队介绍：我们是一支很强的队伍。我们一支 很强的队伍。我们是一支很强的队伍。我们一 支很强的队伍。我们是一支很强的队伍。我是",
                    group_member:[
                        {owner:{pk:1, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小一"}, leader:true},
                        {owner:{pk:2, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小二"}, leader:false},
                        {owner:{pk:3, remark:"大家好", avatar:"https://static1.bcjiaoyu.com/440d78344004159d04bda1516f4c3fed_y.jpg-500x500", name:"小三"}, leader:false},
                    ],
                }
                var json = json1;
                Team.data = json;
                Team.adjustData(json);
                */
            }
        },
        // 获取 token 请求
        getToken:function(){
            $.ajax({
                type:'post',
                url:Common.domain + "/userinfo/code_login/",
                data:{
                    code:Team.code
                },
                timeout:6000,
                success:function(json){
                    Team.setValue("token", json.token);
                    Team.loadInfo();
                },
                error:function(xhr, textStatus){
                    Team.failDealEvent(xhr, textStatus);
                }
            })
        },
        // 获取个人信息
        loadInfo:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
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
                        Team.setValue("userinfo", JSON.stringify(json));
                        Team.currentUser = json.pk;
                        
                        Team.dependReceiveCourse(json.owner);
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        // 获取团队信息(pk)
        loadShareTeam:function(){
            Common.isLogin(function(token){
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/group_detail/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Team.data = json;
                        Team.adjustData(json);
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 请求失败处理方法
        failDealEvent:function(xhr, textStatus, tag, my_team_url){
            Common.hideLoading();
            $(".wait-loading").hide();
            if (textStatus == "timeout") {
                Common.dialog("请求超时");
                return;
            }
            if (xhr.status == 401) {
                // token 失效, 重新授权
                // 先微信授权登录
                // 微信网页授权
                var redirectUri = my_team_url?my_team_url:MY_TEAM_URL;
                Common.authWXPageLogin(redirectUri);
                return
            }else if(xhr.status == 404){
                if (tag == "team") {
                    var msg = "还没有一支属于您的团队，先去创建吧。";
                }else{
                    var msg = "未找到";
                }
                Common.dialog(msg);
                return;
            }else if (xhr.status == 400 || xhr.status == 403) {
                if (JSON.parse(xhr.responseText).name) {
                    Common.dialog('团队名称已被占用');
                }else{
                    var msg = JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail;
                    Common.dialog(msg);
                }
                return;
            }else if(xhr.status == 0){
                Common.dialog("网络未连接，请检查网络后重试。");
                return;
            } else{
                Common.dialog('服务器繁忙');
                return;
            }
        },

        adjustData:function(json){
            $(".wait-loading").hide();
            Team.pk = json.pk;
                        
            // leader:true,     //当前用户是组长吗
            // inTeam:true,     //当前用户是否在团队里,
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
            
            dic["isReceiveCourse"] = Team.isReceiveCourse;
            dic['leader'] = leader;
            dic['inTeam'] = inTeam;
            dic['isManyuan'] = isManyuan;
            dic['freeNum'] = 4-parseInt(json.group_member.length);

            
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
                dic.group_member[i]["currentUser"] = Team.currentUser;
                // dic.group_member[i]["remark"] = "暂无备注";
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

            // 从点赞列表进来，取消原有一切权限，team 信息只读
            if (Team.flag == "list") {
                $(".leader").hide();
                $(".action").hide();
            }else{
                $(".zan-view").hide();
            }

            Page.clickEvent();
        },
        // 更新团队信息(队长)
        updateTeam:function(name, intro){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
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
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 解散团队(队长)
        destoryTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
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

                        Common.dialog('还没有一支属于您的团队，先去创建吧。');
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 加入团队
        joinKnownTeam:function(this_){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
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
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 移除成员(队长)
        removeTeamMember:function(this_, pk){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
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
                        Team.failDealEvent(xhr, textStatus, "team");
                    }
                })
            })
        },
        // 点赞团队
        zanTeam:function(this_){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL_ZAN;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"post",
                    url:Common.domain + "/userinfo/groups/likes/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        Common.dialog('点赞成功');

                        var number = this_.parent().children('span').html();
                        this_.parent().children('span').html(parseInt(number) + 1);
                        this_.removeClass("unselect").addClass("select");
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus, "team", MY_TEAM_URL_ZAN);
                    }
                });
            })
        },
        // 编辑备注
        editBz:function(remark){
            Common.isLogin(function(token){
                if (token == "null") {
                    var redirectUri = MY_TEAM_URL;
                    Common.authWXPageLogin(redirectUri);
                    return;
                }
                $.ajax({
                    type:"put",
                    url:Common.domain + "/userinfo/userinfo_update/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    data:{
                        remark:remark
                    },
                    timeout:6000,
                    success:function(json){
                        console.log(json);
                        $(".edit-bz").parents('.member').attr({"data-remark":remark});
                        Common.dialog("备注成功");
                        $(".bz-shadow-view").hide();
                    },
                    error:function(xhr, textStatus){
                        Team.failDealEvent(xhr, textStatus);
                    }
                })
            })
        },
        // 判断是否已经领取课程了
        dependReceiveCourse:function(owner){
            $.ajax({
                type:"get",
                url:Common.face2faceDomain + "/course/group_course_record/?program_girl_owner=" + owner,
                timeout:6000,
                success:function(json){
                    Team.isReceiveCourse = true;
                    Team.loadShareTeam();  
                },
                error:function(xhr, textStatus){
                    Team.isReceiveCourse = false;
                    Team.loadShareTeam();

                    // Team.failDealEvent(xhr, textStatus);
                }
            })
        },


        // ---------帮助方法
        setValue:function(key, value){
            if (window.localStorage) {
                localStorage[key] = value;
            }else{
                $.cookie(key, value, {path:"/"});
            }
        },
    }

    Page.init();

});
