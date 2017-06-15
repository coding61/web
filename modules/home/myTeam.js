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
            var dic = {
                leader:true,   //当前用户是组长吗
                inTeam:true,  //当前用户是否在团队里,
                isManyuan:true,  //团队是否满员
                team:{
                    name:'百变小樱',
                    intro:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                },
                members:[{    //团队成员,共4个
                    name:'张小美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:true,     //此用户是组长吗
                },{
                    name:'张一美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'张二美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'张三美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                }],
                
            }

            var dic1 = {
                leader:false,   //当前用户是组长吗
                inTeam:false,  //当前用户是否在团队里,
                isManyuan:false,  //团队是否满员
                team:{
                    name:'百变小樱',
                    intro:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                },
                members:[{    //团队成员,共4个
                    name:'张小美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:true,     //此用户是组长吗
                },{
                    name:'张一美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'张二美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'待加入',
                    avatar_url:'../../statics/images/default-avatar.png',
                    leader:false,     //此用户是组长吗
                }],
                
            }

            var dic1 = {
                leader:false,   //当前用户是组长吗
                inTeam:false,  //当前用户是否在团队里,
                isManyuan:true,  //团队是否满员
                team:{
                    name:'百变小樱',
                    intro:'我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.我们是一直很强的队伍.',
                },
                members:[{    //团队成员,共4个
                    name:'张小美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:true,     //此用户是组长吗
                },{
                    name:'张一美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'张二美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                },{
                    name:'张三美',
                    avatar_url:'../../statics/images/11.jpg',
                    leader:false,     //此用户是组长吗
                }],
                
            }

            var html = ArtTemplate("main-view-template", dic);
            $(".main-view").html(html);

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

            $(".share").click(function(){
                Common.confirm("您确定要加入此战队吗?", function(){
                    console.log('111');
                })
            })

            // textarea编辑框高度自适应
             $('.main-view .team .intro textarea').on('input', function(){
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + "px"
            })

            // 解散点击
            $(".header .quit").click(function(){

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

            })
            
            // 删除成员按钮点击
            $(".delete-icon").click(function(){
                $(this).parents('.member').children('.avatar').attr({src:'../../statics/images/11.jpg'});
                $(this).parents('.member').children('.name').html('待加入')
            })
            
            
        }
    };

    Page.init();

});
