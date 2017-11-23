var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", "$http", function($scope, WebIMWidget, $http) {

    $scope.targetType = 1; //1：私聊 更多会话类型查看http://www.rongcloud.cn/docs/api/js/global.html#ConversationType
    $scope.targetId = 'bb';

    var basePath="/program_girl";

    $http({
        url: basePath + "/im/user_get_token/",
        headers: {
            'Authorization': "Token " + localStorage.token
        },
    }).success(function(result){
        if(result){
            //注意实际应用中 appkey 、 token 使用自己从融云服务器注册的。
            var config = {
                appkey: '8w7jv4qb7eqty',
                token: result.token,
                displayConversationList: true,
                style:{
                    left:3,
                    bottom:3,
                    width:430
                },
                onSuccess: function(id) {
                    $scope.user = id;
                    document.title = '用户：' + id;
                    console.log('连接成功：' + id);
                },
                onError: function(error) {
                    console.log('连接失败：' + error);
                }
            };
            RongDemo.common(WebIMWidget, config, $scope);
        }
    })

}]);