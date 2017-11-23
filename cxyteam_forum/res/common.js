(function () {
/*
    将相同代码拆出来方便维护
 */
window.RongDemo = {
    common: function (WebIMWidget, config, $scope) {
        WebIMWidget.init(config);
        var basePath="/program_girl";
        
        WebIMWidget.setUserInfoProvider(function(targetId, obj) { 
            if (localStorage.userlist) {
                var userlist = JSON.parse(localStorage.userlist);
                var user;
                userlist.result.forEach(function(item) {
                    if (item.id == targetId) {
                        user = item;
                    }
                })
                if (user) {
                    obj.onSuccess({name: user.name, id: user.id, portraitUri: user.portraitUri});
                } else {
                    var id = targetId;
                    if (targetId.indexOf("+") != -1) {
                        id = "%2b" + id.substr(1)
                    }
                    // 根据id获取用户信息
                    $.ajax({
                        async: false,
                        url: basePath + "/userinfo/username_userinfo/?username=" + id,
                    }).success(function(rep){
                        // console.log(rep);
                        var userJson = {"id": targetId,"name": rep.name, "portraitUri": rep.avatar};
                        userlist.result.push(userJson);
                        localStorage.userlist = JSON.stringify(userlist);
                        obj.onSuccess({name: rep.name, id: targetId, portraitUri: rep.avatar});
                    }).error(function(err) {

                    })
                }
            } else {
                var userlist = {"result":[]};
                var id = targetId;
                if (targetId.indexOf("+") != -1) {
                    id = "%2b" + id.substr(1)
                }
                // 根据id获取用户信息
                $.ajax({
                    async: false,
                    url: basePath + "/userinfo/username_userinfo/?username=" + id,
                }).success(function(rep){
                    // console.log(rep);
                    
                    var userJson = {"id": targetId,"name": rep.name, "portraitUri": rep.avatar};
                    userlist.result.push(userJson); //存用户信息
                    localStorage.userlist = JSON.stringify(userlist);
                    obj.onSuccess({name: rep.name, id: targetId, portraitUri: rep.avatar});
                }).error(function(err) {

                })
            }
            
        });

        WebIMWidget.setGroupInfoProvider(function(targetId, obj){
            if (localStorage.userlist) {
                var userlist = JSON.parse(localStorage.userlist);
                var user;
                userlist.result.forEach(function(item) {
                    if (item.id == targetId) {
                        user = item;
                    }
                })
                if (user) {
                    obj.onSuccess({name: user.name, id: user.id});
                } else {
                    $.ajax({
                        async: false,
                        url: basePath + "/club/club_detail/" + targetId + "/",
                        headers: {
                            'Authorization': "Token " + localStorage.token
                        }
                    }).success(function(rep){
                        // console.log(rep);
                        var userJson = {"id": targetId,"name": rep.name};
                        userlist.result.push(userJson);
                        localStorage.userlist = JSON.stringify(userlist);
                        obj.onSuccess({id: targetId, name: rep.name});
                    }).error(function(err) {

                    })
                }
            } else {
                var userlist = {"result":[]};
                $.ajax({
                    async: false,
                    url: basePath + "/club/club_detail/" + targetId + "/",
                    headers: {
                        'Authorization': "Token " + localStorage.token
                    }
                }).success(function(rep){
                    // console.log(rep);
                    
                    var userJson = {"id": targetId,"name": rep.name};
                    userlist.result.push(userJson); //存用户信息
                    localStorage.userlist = JSON.stringify(userlist);
                    obj.onSuccess({id: targetId, name: rep.name});
                }).error(function(err) {

                })
            }
        })

        $scope.show = function() {
            WebIMWidget.show();
        };

        $scope.hidden = function() {
            WebIMWidget.hidden();
        };

        // WebIMWidget.show();
        

        // $('body').on("click",'.member-item',function() {
        //     var targetId = $(this).closest('li').attr('data-owner');  
        //     if (!!targetId) {
        //         WebIMWidget.setConversation(Number($scope.targetType), targetId, "用户：" + targetId);
        //         WebIMWidget.show();
        //     }
        // })

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