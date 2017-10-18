var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", "$http", function($scope, WebIMWidget, $http) {

    $scope.targetType = 1; //1：私聊 更多会话类型查看http://www.rongcloud.cn/docs/api/js/global.html#ConversationType
    $scope.targetId = 'opSbp1JARhmzgmez9yObTt9aSybs2';

    var basePath="/program_girl";

    myAjax(basePath+"/im/user_get_token/","get",null,function(result) {
        if(result){
           //注意实际应用中 appkey 、 token 使用自己从融云服务器注册的。
            var config = {
                appkey: '8w7jv4qb7eqty',
                token: result.token,
                displayConversationList: false,
                style:{
                    left:3,
                    bottom:3,
                    width:430
                },
                onSuccess: function(id) {
                    $scope.user = id;
                    // document.title = '用户：' + id;
                    console.log('连接成功：' + id);
                    // 设置当前会话
                    WebIMWidget.setConversation(WebIMWidget.EnumConversationType.PRIVATE,$scope.targetId,"三十三");
                    //呈现会话面板
                    WebIMWidget.show();

                    //会话面板被关闭时
                    WebIMWidget.onClose = function() {
                      //do something
                    }
                    //接收到消息时
                    WebIMWidget.onReceivedMessage = function(message) {
                      //message 收到的消息
                    }
                },
                onError: function(error) {
                    console.log('连接失败：' + error);
                }
            };
            RongDemo.common(WebIMWidget, config, $scope);  
            // 用户信息设置
            WebIMWidget.setUserInfoProvider(function(targetId,obj){
                $http({
                    url: basePath + "/userinfo/whoami/",
                    headers: {
                        'Authorization': "Token " + localStorage.token
                    },
                    params:{
                        'userId': targetId
                    }
                }).success(function(rep){
                    if (rep) {
                        obj.onSuccess({userId: targetId, name: rep.name, portraitUri: rep.avatar})
                    }
                })
            });
            
        }else{
        }
    })
}]);