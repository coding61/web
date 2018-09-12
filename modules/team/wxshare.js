define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    
    function SetShareData(title, desc, url, imgUrl){
        $.ajax({
            type: 'post',
            url: Common.serverDomain + '/userinfo/wx_share_param/',
            data: {
                url: url
            },
            success: function (json) {
                console.log(json);
                ConfigShare(json, title, desc, url, imgUrl);
            },
            fail: function (xhr, textStatus) {
            }
        })
    }
    function ConfigShare(json, title, desc, url, imgUrl){
        wx.config({
          debug: true,                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: json.appid,               // 必填，公众号的唯一标识
          timestamp: json.timestamp,       // 必填，生成签名的时间戳
          nonceStr: json.nonceStr,         // 必填，生成签名的随机串
          signature: json.signature,       // 必填，签名，见附录1
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            // 朋友
            wx.updateAppMessageShareData({ 
                title: title,         // 分享标题
                desc: desc,           // 分享描述
                link: url,            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl        // 分享图标
            }, function(res) { 
                //这里是回调函数 
            }); 
            
            // 朋友圈
            wx.updateTimelineShareData({ 
                title: title,         // 分享标题
                link: url,            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl        // 分享图标
            }, function(res) { 
                //这里是回调函数
            });
            
            // 朋友圈(即将废弃)
            wx.onMenuShareTimeline({
                title: title,         // 分享标题
                link: url,            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl,       // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
            // 朋友(即将废弃)
            wx.onMenuShareAppMessage({
                title: title,        // 分享标题
                desc: desc,          // 分享描述
                link: url,           // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl,      // 分享图标
                type: '',            // 分享类型,music、video或link，不填默认为link
                dataUrl: '',         // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });

        wx.error(function(res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            console.log('weixin 验证失败');
            console.log(res);
            Common.dialog(res);
        });
    }

    exports.SetShareData = SetShareData;

});
