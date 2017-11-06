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
                    // $('.rongcloud-kefuBtnBox').css({"position": "fixed"});
                    // $('.rongcloud-kefuListBox').css({"position": "fixed"});
                    // $('.rongcloud-kefuChatBox.rongcloud-both').css({"position": "fixed"});
                    $scope.user = id;
                    // document.title = '用户：' + id;
                    console.log('连接成功：' + id);
                    
                    // $('.rongcloud-kefuChatBoxHide').hide();
                    // WebIMWidget.display = false;

                    //会话面板被关闭时
                    WebIMWidget.onClose = function() {
                      //do something
                      // $('.rongcloud-kefuBtnBox').hide();
                    }
                    //接收到消息时
                    WebIMWidget.onReceivedMessage = function(message) {
                        //message 收到的消息
                        console.log(message);
                       
                        // 根据id获取用户信息
                        // $http({
                        //     url: basePath + "/userinfo/username_userinfo/?username=" + message.targetId,
                        // }).success(function(rep){
                        //     // // 设置当前会话
                        //     WebIMWidget.setConversation($scope.targetType,message.targetId,rep.name);
                        //     // 设置会话列表中的用户信息及会话窗口中他人用户信息
                        //     WebIMWidget.setUserInfoProvider(function(targetId,obj){
                        //         var localTalkList = {"userlist":[]};
                        //         if (localStorage.localTalkList) {
                        //             localTalkList = JSON.parse(localStorage.localTalkList);
                        //             var user;
                        //             if (localTalkList && localTalkList.userlist.length > 0) {
                        //                 localTalkList.userlist.forEach(function(item){
                        //                     if(item.id==targetId){
                        //                         user=item;
                        //                     }
                        //                 })
                        //             }
                        //             if(user){
                        //                 // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
                        //                 console.log(targetId);
                        //                 obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
                        //             }else{
                        //                 $http({
                        //                     url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                        //                 }).success(function(rep){
                        //                     obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
                        //                     localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
                        //                     localStorage.localTalkList = JSON.stringify(localTalkList);
                        //                 }).error(function(err) {

                        //                 })     
                        //             }
                        //         } else {
                        //             obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
                        //             localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
                        //             localStorage.localTalkList = JSON.stringify(localTalkList);
                        //         }
                        //     });
                        // }).error(function(err) {
                        // })
                    }
                    // 活动详情点击头像进行单聊
                    $('body').on("click",'.member-item',function() {
                        // var name = $(this).closest('li').attr('data-name');
                        var targetId = $(this).closest('li').attr('data-owner');
                        // console.log(name);
                        // console.log(targetId);
                        // $scope.targetType = 1;
                        // if (targetId == id) { //聊天对象是自己 不作处理
                        // } else {
                        //     // 设置当前会话
                        //     WebIMWidget.setConversation(Number($scope.targetType),targetId,name);
                            
                        //     // 设置会话列表中的用户信息及会话窗口中他人用户信息
                        //     WebIMWidget.setUserInfoProvider(function(targetId,obj){
                        //         var localTalkList = {"userlist":[]};
                        //         if (localStorage.localTalkList) {
                        //             localTalkList = JSON.parse(localStorage.localTalkList);
                        //             var user;
                        //             if (localTalkList && localTalkList.userlist.length > 0) {
                        //                 localTalkList.userlist.forEach(function(item){
                        //                     if(item.id==targetId){
                        //                         user=item;
                        //                     }
                        //                 })
                        //             }
                        //             if(user){
                        //                 // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
                        //                 console.log(targetId);
                        //                 obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
                        //             }else{
                        //                 // 根据id获取用户信息
                        //                 $http({
                        //                     url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                        //                 }).success(function(rep){
                        //                     obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
                        //                     localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
                        //                     localStorage.localTalkList = JSON.stringify(localTalkList);
                        //                 }).error(function(err){

                        //                 })
                        //             }
                        //         } else {
                        //             // 根据id获取用户信息
                        //             $http({
                        //                 url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                        //             }).success(function(rep){
                        //                 obj.onSuccess({id:targetId,name:rep.name,portraitUri:rep.avatar})
                        //                 localTalkList.userlist.push({id:targetId,name:rep.name,portraitUri:rep.avatar});
                        //                 localStorage.localTalkList = JSON.stringify(localTalkList);
                        //             }).error(function(err){

                        //             })                                      
                        //         }
                        //     });
                        //     //呈现会话面板
                        //     WebIMWidget.show();
                            
                            if (!!targetId) {
                                WebIMWidget.setConversation(Number($scope.targetType), targetId, "用户：" + targetId);
                                WebIMWidget.show();
                            }
                         
                    })
                    // 活动页点击活动进行群聊
                    $('body').on("click",'.join-chat',function() {
                        var targetId = $(this).attr("pk");
                        var title = $(this).attr('name');
                        console.log(targetId);
                        console.log(title);
                        $scope.targetType = 3;
                        // 设置当前会话
                        WebIMWidget.setConversation(Number($scope.targetType),targetId,title);
                        
                        if ($scope.targetType == 3) {
                            // 设置会话列表中的用户信息及会话窗口中他人用户信息
                            WebIMWidget.setGroupInfoProvider(function(targetId,obj){
                                var localTalkList = {"userlist":[]};
                                if (localStorage.localTalkList) {
                                    localTalkList = JSON.parse(localStorage.localTalkList);
                                    var user;
                                    if (localTalkList && localTalkList.userlist.length > 0) {
                                        localTalkList.userlist.forEach(function(item){
                                            if(item.id==targetId){
                                                user=item;
                                            }
                                        })
                                    }
                                    if(user){
                                        // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
                                        console.log(targetId);
                                        obj.onSuccess({id:user.id,name:user.name});
                                    }else{
                                        // 根据id获取用户信息
                                        // $http({
                                        //     url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                                        // }).success(function(rep){
                                            obj.onSuccess({id:targetId,name:title})
                                            localTalkList.userlist.push({id:targetId,name:title});
                                            localStorage.localTalkList = JSON.stringify(localTalkList);
                                        // }).error(function(err){

                                        // })
                                    }
                                } else {
                                    // 根据id获取用户信息
                                    // $http({
                                    //     url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                                    // }).success(function(rep){
                                        obj.onSuccess({id:targetId,name:title})
                                        localTalkList.userlist.push({id:targetId,name:title});
                                        localStorage.localTalkList = JSON.stringify(localTalkList);
                                    // }).error(function(err){

                                    // })                                      
                                }
                            });
                        }

                    })

                    // 用户信息设置,设置自己的信息
                    // WebIMWidget.setUserInfoProvider(function(targetId,obj){
                    //     if (setSelf) {
                    //         var localTalkList = {"userlist":[]};
                    //         if (localStorage.localTalkList) {
                    //             localTalkList = JSON.parse(localStorage.localTalkList);
                    //             var user;
                    //             if (localTalkList && localTalkList.userlist.length > 0) {
                    //                 localTalkList.userlist.forEach(function(item){
                    //                     if(item.id==targetId){
                    //                         user=item;
                    //                     }
                    //                     obj.onSuccess({id:item.id,name:item.name,portraitUri:item.portraitUri});
                    //                 })
                    //             }
                    //             if(user){
                    //                 // 拿本地会话列表遍历，如果列表不为空，如果targetId等于列表中item的id，则设置成item的信息，否则根据id获取用户信息，然后将用户信息添加到本地会话列表
                    //                 console.log(targetId);
                    //                 obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
                    //             }else{
                    //                 $http({
                    //                     url: basePath + "/userinfo/whoami/",
                    //                     headers: {
                    //                         'Authorization': "Token " + localStorage.token
                    //                     },
                    //                     params:{
                    //                         'userId': targetId
                    //                     }
                    //                 }).success(function(rep){
                    //                     console.log(rep);
                    //                     if (rep) {
                    //                         obj.onSuccess({userId: targetId, name: rep.name, portraitUri: rep.avatar})
                    //                     }
                    //                 }).error(function(err) {

                    //                 })
                    //             }
                    //         } else {
                    //             $http({
                    //                 url: basePath + "/userinfo/whoami/",
                    //                 headers: {
                    //                     'Authorization': "Token " + localStorage.token
                    //                 },
                    //                 params:{
                    //                     'userId': targetId
                    //                 }
                    //             }).success(function(rep){
                    //                 console.log(rep);
                    //                 if (rep) {
                    //                 // console.log(targetId);
                    //                     obj.onSuccess({userId: targetId, name: rep.name, portraitUri: rep.avatar})
                    //                 }
                    //             }).error(function(err) {

                    //             })
                    //         }
                    //         setSelf = false;
                    //     }
                    // });    
                    WebIMWidget.setUserInfoProvider(function(targetId, obj) {
                        // 根据id获取用户信息
                        $http({
                            url: basePath + "/userinfo/username_userinfo/?username=" + targetId,
                        }).success(function(rep){
                            obj.onSuccess({
                                id:targetId,
                                name: "用户：" + rep.name,
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