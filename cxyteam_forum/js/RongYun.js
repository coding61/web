// 融云单聊
var demo = angular.module("demo", ["RongWebIMWidget"]);
var setSelf = true;
demo.controller("main", ["$scope", "WebIMWidget", "$http", function($scope, WebIMWidget, $http) {
    var basePath="/program_girl";
    $scope.targetType = 1; //1：私聊 更多会话类型查看http://www.rongcloud.cn/docs/api/js/global.html#ConversationType
    // $scope.targetId = 'opSbp1JARhmzgmez9yObTt9aSybs2';
    // myAjax(basePath+"/im/user_get_token/","get",null,function(result) {

    $http({
        url: basePath + "/im/user_get_token/",
        headers: {
            'Authorization': "Token " + localStorage.token
        },
    }).success(function(result){
        if(result){
           //注意实际应用中 appkey 、 token 使用自己从融云服务器注册的。
            var config = {
                appkey: '8w7jv4qb7eqty',  //开发环境
                // appkey: '82hegw5uhf50x',  //生产环境
                token: result.token,
                displayConversationList: true,
                style:{
                    positionFixed: true,
                    conversationListPosition: WebIMWidget.EnumConversationListPosition.left,
                    left:3,
                    // right: 3,
                    bottom:3,
                    width:430,
                },
                onSuccess: function(id) {
                    $scope.user = id;
                    // document.title = '用户：' + id;
                    console.log('连接成功：' + id);

                    //会话面板被关闭时
                    WebIMWidget.onClose = function() {
                      //do something
                      // $('.rongcloud-kefuBtnBox').hide();
                    }
                    //接收到消息时
                    WebIMWidget.onReceivedMessage = function(message) {
                        //message 收到的消息
                        // console.log(message);
                        //判断是否有 @ 自己的消息
                        var mentionedInfo = message.content.mentionedInfo || {};
                        var ids = mentionedInfo.userIdList || [];
                        for(var i=0; i < ids.length; i++){
                            if( ids[i] == id){
                                console.log("有人 @ 了你！");
                            }
                        }
                    }
                    // 活动详情点击头像进行单聊
                    $('body').on("click",'.member-item',function() {
                        var name = $(this).closest('li').attr('data-name');
                        var targetId = $(this).closest('li').attr('data-owner');
                        // console.log(name);
                        // console.log(targetId);
                        // $scope.targetType = 1;
                        // if (targetId == id) { //聊天对象是自己 不作处理
                        // } else {
                        // 设置当前会话
                        WebIMWidget.setConversation(RongIMLib.ConversationType.PRIVATE,targetId,name);
                        //呈现会话面板
                        WebIMWidget.show();
                    })
                    // 联系发布者
                    $('body').on("click",'.join-owner',function() {
                        // 聊天需要
                        var targetId = $(this).attr("owner");
                        var title = $(this).attr("name");
                        // 设置当前会话
                        WebIMWidget.setConversation(RongIMLib.ConversationType.PRIVATE,targetId,title);
                        //呈现会话面板
                        WebIMWidget.show();
                    })
                    // 活动页点击活动进行群聊
                    $('body').on("click",'.join-chat',function() {
                        var targetId = $(this).attr("pk");
                        var title = $(this).attr('name');
                        // console.log(targetId);
                        // console.log(title);
                        // 设置当前会话
                        WebIMWidget.setConversation(RongIMLib.ConversationType.GROUP,targetId,title);
                        //呈现会话面板
                        WebIMWidget.show();
                    })

                    // 设置用户信息
                    WebIMWidget.setUserInfoProvider(function(targetId, obj) {
                        // 根据id获取用户信息
                        $http({
                            url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                        }).success(function(rep){
                            obj.onSuccess({
                                id:targetId,
                                name: rep.name,
                                portraitUri: rep.avatar
                            });
                        }).error(function(err){

                        })
                    });
                },
                onError: function(error) {
                    console.log('连接失败：' + error);
                }
            };
            RongDemo.common(WebIMWidget, config, $scope);  
            
        }else{
        }
    })
    
}]);