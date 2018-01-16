function QiniuForUpload(){
    var domain = "/program_girl";

	// uploadImg（图片）
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadImg',                     //上传选择的点选按钮，**必需**
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //uptoken : 'xxxxxxxxxxxxxx',
        //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'https://static1.bcjiaoyu.com',         //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                async: false,
                type: "POST",
                url:domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ "361e62b004a69a4610acf9f3a5b6f95eaabca3b"
                },
                data: {
                    filename: filename,
                },
                dataType: "json",
                success: function(json) {
                  upToken = json.token;
                  upkey = json.key;
                }
              });
              return upToken;
        },
        container: 'upload-container',                     //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png,jpeg"},
            ]
        },
        init: {
               'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        filename = file.name;
                    });
               },
               'BeforeUpload': function(up, file) {
                    // console.log(file);
                    // console.log(file);
                    //alert('e');
                    // 每个文件上传前,处理相关的事情
                    __log("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    $(".input-view textarea").val(json.private_url);
                    __log("上传完成")
               },
               'Error': function(up, err, errTip) {
                    // Common.dialog("上传失败");
                    __log("上传失败")
                    // var $progressNumed = $(".progressNum .progressNumed").eq(0);
                    //     $progressNumed.html($progressNumed.html() - 0 + 1);
                    //     console.log(up);
                    //     console.log(err);
                    //     console.log(errTip);
               },
               'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
               },
               'Key': function(up, file) {
                    var key = upkey;
                    return key;
                },
          }
      });
    
    // uploadAudio (音频)
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadAudio',                     //上传选择的点选按钮，**必需**
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //uptoken : 'xxxxxxxxxxxxxx',
        //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'https://static1.bcjiaoyu.com',         //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                async: false,
                type: "POST",
                url:domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ "361e62b004a69a4610acf9f3a5b6f95eaabca3b"
                },
                data: {
                    filename: filename,
                },
                dataType: "json",
                success: function(json) {
                  upToken = json.token;
                  upkey = json.key;
                }
              });
              return upToken;
        },
        container: 'upload-container',                     //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "audio files", extensions : "mp3,wav"},
            ]
        },
        init: {
               'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        filename = file.name;
                    });
               },
               'BeforeUpload': function(up, file) {
                    // console.log(file);
                    // console.log(file);
                    //alert('e');
                    // 每个文件上传前,处理相关的事情
                    __log("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    $(".input-view textarea").val(json.private_url);
                    __log("上传完成")
               },
               'Error': function(up, err, errTip) {
                    __log("上传失败")
                    // Common.dialog("上传失败");
                    // var $progressNumed = $(".progressNum .progressNumed").eq(0);
                    //     $progressNumed.html($progressNumed.html() - 0 + 1);
                    //     console.log(up);
                    //     console.log(err);
                    //     console.log(errTip);
               },
               'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
               },
               'Key': function(up, file) {
                    var key = upkey;
                    return key;
                },
          }
      });
	
	// uploadQuestionPhoto（图片）
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadQuestionPhoto',                     //上传选择的点选按钮，**必需**
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //uptoken : 'xxxxxxxxxxxxxx',
        //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'https://static1.bcjiaoyu.com',         //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                async: false,
                type: "POST",
                url:domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ "361e62b004a69a4610acf9f3a5b6f95eaabca3b"
                },
                data: {
                    filename: filename,
                },
                dataType: "json",
                success: function(json) {
                  upToken = json.token;
                  upkey = json.key;
                }
              });
              return upToken;
        },
        container: 'upload-container',                     //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png,jpeg"},
            ]
        },
        init: {
               'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        filename = file.name;
                    });
               },
               'BeforeUpload': function(up, file) {
                    // console.log(file);
                    // console.log(file);
                    //alert('e');
                    // 每个文件上传前,处理相关的事情
                    __log1("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log1("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    var photos = $('.question-view textarea[name="photos"]').val();
                    var photosArr = photos?JSON.parse(photos):[];
                    photosArr.push(json.private_url);
                    $('.question-view textarea[name="photos"]').val(JSON.stringify(photosArr));
                    __log1("上传完成")
               },
               'Error': function(up, err, errTip) {
                    // Common.dialog("上传失败");
                    __log1("上传失败")
                    // var $progressNumed = $(".progressNum .progressNumed").eq(0);
                    //     $progressNumed.html($progressNumed.html() - 0 + 1);
                    //     console.log(up);
                    //     console.log(err);
                    //     console.log(errTip);
               },
               'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
               },
               'Key': function(up, file) {
                    var key = upkey;
                    return key;
                },
          }
      });
	
	// uploadOptionPhoto（图片）
    var filename = ''    //选择的文件的名字
    var uploader = Qiniu.uploader({
        runtimes: 'HTML5,flash,html4',                  //上传模式,依次退化
        browse_button: 'uploadOptionPhoto',                     //上传选择的点选按钮，**必需**
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        //uptoken : 'xxxxxxxxxxxxxx',
        //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'https://static1.bcjiaoyu.com',         //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                async: false,
                type: "POST",
                url:domain+"/upload/token/",
                headers: {
                    Authorization: "Token "+ "361e62b004a69a4610acf9f3a5b6f95eaabca3b"
                },
                data: {
                    filename: filename,
                },
                dataType: "json",
                success: function(json) {
                  upToken = json.token;
                  upkey = json.key;
                }
              });
              return upToken;
        },
        container: 'upload-container',                     //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',                            //最大文件体积限制
        flash_swf_url: 'libs/upload/plupload/Moxie.swf',   //引入flash,相对路径
        max_retries: 3,                                    //上传失败最大重试次数
        get_new_uptoken: true,                             //设置上传文件的时候是否每次都重新获取新的token
        dragdrop: true,                                    //开启可拖曳上传
        // get_new_uptoken: false,                 
        drop_element: 'upload-container',                  //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                                 //分块上传时，每片的体积
        multi_selection: false,                            //单个文件上传
        auto_start: true,                                  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters : {
            max_file_size : '100mb',
            prevent_duplicates: true,
            // Specify what files to browse for
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png,jpeg"},
            ]
        },
        init: {
               'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        filename = file.name;
                    });
               },
               'BeforeUpload': function(up, file) {
                    // console.log(file);
                    // console.log(file);
                    //alert('e');
                    // 每个文件上传前,处理相关的事情
                    __log2("上传处理中...")
               },
               'UploadProgress': function(up, file) {
                    // console.log(file);
                    // 每个文件上传时,处理相关的事情
                    // $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                    __log2("上传中...")
               },
               'FileUploaded': function(up, file, info) {
                    // console.log(file);
                    // console.log(info);
                    // $('.yes-btn').html('确认').css('background','#009688');
                    var json = JSON.parse(info.response);
                    // console.log(json.private_url);
                    // console.log(json);
                    var photos = $('.option-input-view textarea[name="photos"]').val();
                    var photosArr = photos?JSON.parse(photos):[];
                    photosArr.push(json.private_url);
                    $('.option-input-view textarea[name="photos"]').val(JSON.stringify(photosArr));
                    __log2("上传完成")
               },
               'Error': function(up, err, errTip) {
                    // Common.dialog("上传失败");
                    __log2("上传失败")
                    // var $progressNumed = $(".progressNum .progressNumed").eq(0);
                    //     $progressNumed.html($progressNumed.html() - 0 + 1);
                    //     console.log(up);
                    //     console.log(err);
                    //     console.log(errTip);
               },
               'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
               },
               'Key': function(up, file) {
                    var key = upkey;
                    return key;
                },
          }
      });

    function __log(e, data) {
        if (log.innerHTML) {
            log.innerHTML += "\n" + e + " " + (data || '');
        }else{
            log.innerHTML += e + " " + (data || '');
        }
        $("#log").animate({scrollTop:$("#log")[0].scrollHeight}, 20);
    }
    function __log1(e, data) {
        if (log1.innerHTML) {
            log1.innerHTML += "\n" + e + " " + (data || '');
        }else{
            log1.innerHTML += e + " " + (data || '');
        }
        $("#log1").animate({scrollTop:$("#log1")[0].scrollHeight}, 20);
    }
    function __log2(e, data) {
        if (log2.innerHTML) {
            log2.innerHTML += "\n" + e + " " + (data || '');
        }else{
            log2.innerHTML += e + " " + (data || '');
        }
        $("#log2").animate({scrollTop:$("#log2")[0].scrollHeight}, 20);
    }
}