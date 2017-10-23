(function () {
/*
    将相同代码拆出来方便维护
 */
window.RongDemo = {
    common: function (WebIMWidget, config, $scope) {
        WebIMWidget.init(config);
        var basePath="/program_girl";
        WebIMWidget.setUserInfoProvider(function(targetId, obj) {
            // 根据id获取用户信息
            $.ajax({
                url: basePath + "/userinfo/username_userinfo/?username=" + "opSbp1JARhmzgmez9yObTt9aSybs1",
            }).success(function(rep){
                console.log(rep);
                obj.onSuccess({
                    name: targetId,
                    id: targetId,
                    portraitUri: rep.avatar
                });
            }).error(function(err) {

            })
        });

        WebIMWidget.setGroupInfoProvider(function(targetId, obj){
            obj.onSuccess({
                name:'群组：' + targetId
            });
        })

        $scope.show = function() {
            WebIMWidget.show();
        };

        $scope.hidden = function() {
            WebIMWidget.hidden();
        };

        // WebIMWidget.show();
        

        $('body').on("click",'.member-item',function() {
            var targetId = $(this).closest('li').attr('data-owner');  
            if (!!targetId) {
                WebIMWidget.setConversation(Number($scope.targetType), targetId, "用户：" + targetId);
                WebIMWidget.show();
            }
        })

        // 示例：获取 userinfo.json 中数据，根据 targetId 获取对应用户信息
        // WebIMWidget.setUserInfoProvider(function(targetId,obj){
        //     $http({
        //       url:"/userinfo.json"
        //     }).success(function(rep){
        //       var user;
        //       rep.userlist.forEach(function(item){
        //         if(item.id==targetId){
        //           user=item;
        //         }
        //       })
        //       if(user){
        //         obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
        //       }else{
        //         obj.onSuccess({id:targetId,name:"用户："+targetId});
        //       }
        //     })
        // });

        // 示例：获取 online.json 中数据，根据传入用户 id 数组获取对应在线状态
        // WebIMWidget.setOnlineStatusProvider(function(arr, obj) {
        //     $http({
        //         url: "/online.json"
        //     }).success(function(rep) {
        //         obj.onSuccess(rep.data);
        //     })
        // });
    }
}

})()