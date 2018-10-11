var basePath="//app.cxy61.com/program_girl";
var userId=1;
var userName=getCookie("userName");
var zonePk = getQueryString("pk");
myAjax(basePath+"/userinfo/whoami/","get",null,function(result) {
    if(result){
        $('.avatar img').attr({src: result.avatar});//用户头像
        $('.info .grade').html(result.grade.current_name);//用户段位等级
        $('.info .grade-value').html(result.experience + '/' + result.grade.next_all_experience);
        $('.zuan span').html("x"+result.diamond);
        var percent = (parseInt(result.experience)-parseInt(result.grade.current_all_experience))/(parseInt(result.grade.next_all_experience)-parseInt(result.grade.current_all_experience))*$(".info-view").width();
        $(".progress img").css({
            width:percent
        })
    }else{
    }
})
//获取当前社区
var zoneName='';
myAjax(basePath+"/forum/sections/","GET",null,function(result) {
    zoneName=result.name;
});
//$(".zone_content").html('<option value="'+zonePk+'" class="layui-this">'+zoneName+'</option>');
$(function() {
    $(".publish").click(function() {
        var title=$("#L_title").val();
        var content=$("#L_content").val();
        var images=$('#fengmian').val();
        var diamond_amount=$('.article_zuan_span').val();
        if(!title) {
            layer.msg("请输入标题");
            return false;
        }
        if(!content) {
            layer.msg("请输入内容");
            return false;
        }
        if(!images) {
            layer.msg("请选取封面");
            return false;
        }
        if(!diamond_amount){
            layer.msg("请输入钻石数量");
        }
        else {
            $("#L_title").val("");
            $("#L_content").val("");
            $('#fengmian').val("");
            $('.article_zuan_span').val("");
            publish(title,content,images,diamond_amount)
        }
        
    })
})

function publish(title,content,images,diamond_amount) {
    myAjax(basePath+"/teacher/create_article/","post",{
  "title":title,
  "content":content,
  "images":images,
  "diamond_amount":diamond_amount
},function(result) {
        console.log(result)
        $("#L_title").val("");
        $("#L_content").val("");
        $('#fengmian').val("");
        $('.article_zuan_span').val("");
        $(".main").find(".layui-select-title input").val("");
        $('succ_after').show();
        $('.main').prepend($('.succ_after'));
        $('.succ_after').show();
        $('.succ_after span').on('click',function(){
            $('.succ_after').hide();
        })
    });
}
//独立方法，
 // 学习论坛
$(".header .luntan").unbind('click').click(function(){
    window.open("../../cxyteam_forum/bbs.html");
})
// 作品中心
$(".header .works").unbind('click').click(function(){
    window.open("worksList.html");
})
// 钻石动画
$(".helps-view .zuan-ani").unbind('click').click(function(){
    $(".helps-view").hide();
    playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
    zuanAnimate(2);
})
function zuanAnimate(number){
    // 钻石出现，然后2秒后飞到右上角消失
    $(".zuan-shadow-view").show();
    $(".zuan-shadow-view .img").css({
        "margin-top": ($(window).height() - 200) / 2 + "px"
    });

    setTimeout(function(){
        $(".zuan-shadow-view .img").animate({
            marginTop:"1%",
            marginLeft:"88%",
            width:20,
            height:20,
            opacity:0
        }, "slow", function(){
            // 恢复原样
            $(".zuan-shadow-view").hide();
            $(this).css({
                width:200,
                height:200,
                "margin-left":"calc(50% - 100px)",
                "margin-top": ($(window).height() - 200) / 2 + "px",
                opacity:1
            })
            
            $(".zuan span").html("x" + number);

            $(".zuan").css({
                transform:'scale(2)'
            })
            
            setTimeout(function(){
                $(".zuan").css({
                    transform:'scale(1)'
                })
            }, 200)
        })
    }, 1000)
};
// 联系我们
$(".helps-view .contact-us").unbind('click').click(function(){
    $(".helps-view").hide();
    playSoun('https://static1.bcjiaoyu.com/2.mp3');  //播放钻石音效
})
function playSoun(url){
    var borswer = window.navigator.userAgent.toLowerCase();
    if ( borswer.indexOf( "ie" ) >= 0 )
    {//IE内核浏览器
        $( "body" ).find( "embed" ).remove();
        var strEmbed = '<embed name="embedPlay" src="'+url+'" autostart="true" hidden="true" loop="false"></embed>';
        // if ( $( "body" ).find( "embed" ).length <= 0 )
          $( "body" ).append( strEmbed );
        var embed = document.embedPlay;
        //浏览器不支持 audion，则使用 embed 播放
        embed.volume = 100;
        //embed.play();这个不需要
    }else{
        //非IE内核浏览器
        $( "body" ).find( "audio" ).remove();
        var strAudio = "<audio id='audioPlay' src='"+url+"' hidden='true'>";
        // if ( $( "body" ).find( "audio" ).length <= 0 )
        $( "body" ).append( strAudio );
        var audio = document.getElementById( "audioPlay" );

        //浏览器支持 audion
        audio.play();
    }
}
// 经验值
$(".helps-view .grow-ani").unbind('click').click(function(){
    $(".helps-view").hide();
    growAnimate(2);
})
function growAnimate(number){
    $(".grow-number-ani").remove();
    var growHtml = '<span class="grow-number-ani fadeInOut">经验 +'+number+'</span>';
    $(".chat").append(growHtml);
};
// 升级
$(".helps-view .up-grade-ani").unbind('click').click(function(){
    $(".helps-view").hide();
    playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
    gradeAnimate();
})
function gradeAnimate(){
    $(".up-grade-shadow-view").show();
    $(".up-grade-shadow-view .img").css({
        "margin-top": ($(window).height() - 200) / 2 + "px"
    });
    setTimeout(function(){
        // 更改等级信息
        $(".up-grade-shadow-view").hide();
    }, 2000)
};
// logo 点击打开一个网站
$(".header .logo2").unbind('click').click(function(){
    window.open("https://www.coding61.com");
})
// 消息音频播放
$(".msg-view-parent .audio").unbind('click').click(function(){
    console.log('cc');
    var url = $(this).parents('.msg-view-parent').attr("data-audio-url");
    if (url) {
        // 'https://static1.bcjiaoyu.com/2.mp3'
        Common.playMessageSoun2(url);  //播放钻石音效
    }
})
