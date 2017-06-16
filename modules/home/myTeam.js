define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');

    var Page = {
        name:null,
        intro:null,
        init:function(){

            Page.load();
        },
        load:function(){
            // 1.组长
            var dic = {
                leader:true,   //当前用户是组长吗
                inTeam:true,  //当前用户是否在团队里,
                isManyuan:true,  //团队是否满员
                name:'百变小樱',
                announcement:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                group_member:[{    //团队成员,共4个
                    pk:1,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:true,     //此用户是组长吗
                },{
                    pk:2,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:3,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:4,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                }],
                
            }
            
            // 2.未满员,不在团里
            var dic1 = {
                leader:false,   //当前用户是组长吗
                inTeam:false,  //当前用户是否在团队里,
                isManyuan:false,  //团队是否满员
                name:'百变小樱',
                announcement:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                group_member:[{    //团队成员,共4个
                    pk:1,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:true,     //此用户是组长吗
                },{
                    pk:2,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:3,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },null],
                
            }
            
            // 3.满员
            var dic2 = {
                leader:false,   //当前用户是组长吗
                inTeam:false,  //当前用户是否在团队里,
                isManyuan:true,  //团队是否满员
                name:'百变小樱',
                announcement:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                group_member:[{    //团队成员,共4个
                    pk:1,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:true,     //此用户是组长吗
                },{
                    pk:2,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:3,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:4,
                    name:'张三美',
                    avatar:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                }],
                
            }
            
            // 4.不是组长, 在团里
            var dic3 = {
                leader:false,   //当前用户是组长吗
                inTeam:true,  //当前用户是否在团队里,
                isManyuan:false,  //团队是否满员
                name:'百变小樱',
                announcement:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                group_member:[{    //团队成员,共4个
                    pk:1,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:true,     //此用户是组长吗
                },{
                    pk:2,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },{
                    pk:3,
                    owner:{
                        name:'张小美',
                        avatar:'../../statics/images/11.jpg',
                    },
                    leader:false,     //此用户是组长吗
                },null],
            }

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
        clickEvent:function(){
            var appId = 'wx58e15a667d09d70f',
                redirectUri = "https://www.cxy61.com/mobile/html/wechatHB.html?v=1.0.7",
                scope = 'snsapi_userinfo';

            redirectUri = encodeURIComponent(redirectUri);

            $(".btn-wx-auth").click(function(){
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURI(redirectUri)+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
            })

            // textarea编辑框高度自适应
             $('.main-view .team .intro textarea').on('input', function(){
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + "px"
            })

            // 解散点击
            $(".header .quit").click(function(){
                // 解散团队
                Team.destoryTeam();
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
                var str1 = $('.main-view .team .intro textarea').html();
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
                Team.removeTeamMember($(this), $(this).parents('.member').attr("data-pk"));

            })

            
            // 底部按钮点击
            $(".action").click(function(){
                if ($(this).hasClass('share')) {
                    // 邀请分享
                    $(".shadow-view").show();

                }else if ($(this).hasClass('join')) {
                    // 申请加入
                    Common.confirm("您确定要加入此战队吗?", function(){

                        // 加入团队
                        Team.joinTeam($(this));

                        /*
                        var parent =  $(".default-avatar").eq(0).parent();
                        parent.children('.default-avatar').children('img').attr({src:'../../statics/images/11.jpg'});
                        parent.children('.default-avatar').removeClass("default-avatar").addClass('avatar');
                        parent.children('.name').html("张三美");

                        // 当前用户加入后, 变邀请
                        $(this).children('span').html('邀请好友加入');
                        $(this).removeClass('join').addClass('share');
                        */

                    })
                    
                }else if ($(this).hasClass('unjoin')) {
                    // 不能加入
                    
                    Common.dialog('网络失败');
                    
                }
            })
        }
    };

    var Team = {
        pk:null,
        currentUser:null,  //当前用户的 pk
        data:null, //小组数据
        init:function(){
            Team.loadInfo();
        },
        loadInfo:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog('请先授权');
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/whoami/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        Team.currentUser = json.pk;

                        Team.load();
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        load:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog('请先授权');
                    return;
                }
                $.ajax({
                    type:'get',
                    url: Common.domain + "/userinfo/mygroup/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        console.log(json);

                        Team.pk = json.pk;
                        
                        // leader:true,   //当前用户是组长吗
                        // inTeam:true,  //当前用户是否在团队里,
                        // isManyuan:true,  //团队是否满员
                        var leader=false,
                            inTeam=false, 
                            isManyuan=false;
                        if (json.member_number == 4) {
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
                            if(members[i].leader=true){
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
                        
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        updateTeam:function(name, intro){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
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
                    success:function(json){
                        Common.showToast('修改成功');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        destoryTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
                    return;
                }
                $.ajax({
                    type:"delete",
                    url:Common.domain + "/userinfo/groups/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        $(".body-view").html(null)
                        $(".quit").remove();

                        Common.dialog('没有团队');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        joinKnownTeam:function(this_){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/join_group/"+Team.pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                        Common.showToast('加入成功');

                        var parent =  $(".default-avatar").eq(0).parent();
                        parent.children('.default-avatar').children('img').attr({src:'../../statics/images/11.jpg'});
                        parent.children('.default-avatar').removeClass("default-avatar").addClass('avatar');
                        parent.children('.name').html("张三美");

                        // 当前用户加入后, 变邀请
                        this_.children('span').html('邀请好友加入');
                        this_.removeClass('join').addClass('share');
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        joinUnknownTeam:function(){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/random_join_group/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){
                       
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        },
        removeTeamMember:function(this_, pk){
            Common.isLogin(function(token){
                if (token == "null") {
                    Common.dialog("请先授权");
                    return;
                }
                $.ajax({
                    type:"get",
                    url:Common.domain + "/userinfo/delete_groupmember/"+pk+"/",
                    headers:{
                        Authorization:"Token " + token
                    },
                    success:function(json){

                        this_.parents('.member').children('.avatar').children('img').attr({src:'../../statics/images/default-avatar.png'});
                        this_.parents('.member').children('.avatar').removeClass('avatar').addClass('default-avatar');
                        this_.parents('.member').children('.name').html('待加入')
                        this_.parents('.member').children('.delete-icon').remove();
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            Common.showToast("服务器开小差了");
                            return;
                        }
                        Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        console.log(textStatus);
                    }
                })
            })
        }
    }

    Page.init();

});
