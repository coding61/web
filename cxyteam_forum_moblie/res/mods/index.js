/**

 @Name: Fly社区主入口

 */
 var token=localStorage.token;
 // console.log(token);
 my_init()
function my_init(){
layui.define(['layer', 'laytpl', 'form', 'upload', 'util'], function(exports){
  
  var $ = layui.jquery
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,form = layui.form()
  ,util = layui.util
  ,device = layui.device()
  
  //阻止IE7以下访问
  if(device.ie && device.ie < 8){
    layer.alert('如果您非得使用ie浏览Fly社区，那么请使用ie8+');
  }
  
  layui.focusInsert = function(obj, str){
    var result, val = obj.value;
    obj.focus();
    if(document.selection){ //ie
      result = document.selection.createRange(); 
      document.selection.empty(); 
      result.text = str; 
    } else {
      result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
      obj.focus();
      obj.value = result.join('');
    }
  };
  
  var gather = {
    
    //Ajax
    json: function(url, data, success, options){
      var that = this;
      options = options || {};
      data = data || {};
      return $.ajax({
        type: options.type || 'post',
        dataType: options.dataType || 'json',
        data: data,
        url: url,
        success: function(res){
          if(res.status === 0) {
            success && success(res);
          } else {
            layer.msg(res.msg||res.code, {shift: 6});
          }
        }, error: function(e){
          options.error || layer.msg('请求异常，请重试', {shift: 6});
        }
      });
    }

    //计算字符长度
    ,charLen: function(val){
      var arr = val.split(''), len = 0;
      for(var i = 0; i <  val.length ; i++){
        arr[i].charCodeAt(0) < 299 ? len++ : len += 2;
      }
      return len;
    }
    
    ,form: {}

    //简易编辑器
    ,layEditor: function(options){
      var html = '<div class="fly-edit">'
        +'<span type="face" title="插入表情"><i class="iconfont icon-biaoqing"></i>表情</span>'
        +'<span type="picture" title="插入图片：img[src]"><i class="iconfont icon-tupian"></i>图片</span>'
        +'<span type="href" title="超链接格式：a(href)[text]"><i class="iconfont icon-lianjie"></i>链接</span>'
        +'<span type="code" title="插入代码"><i class="iconfont icon-daima"></i>代码</span>'
/*        +'<span type="yulan" title="预览"><i class="iconfont icon-yulan"></i>预览</span>'*/
      +'</div>';
      var log = {}, mod = {
        picture: function(editor){ //插入图片
          if(token){
            layer.open({
              type: 1
              ,id: 'fly-jie-upload'
              ,title: '插入图片'
              ,area: 'auto'
              ,shade: false
              ,area: '96%'
              ,skin: 'layui-layer-border'
              ,content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">'
                ,'<li class="layui-form-item">'
                  ,'<label class="layui-form-label">URL</label>'
                  ,'<div class="layui-input-inline">'
                      ,'<input required name="image" placeholder="支持直接粘贴远程图片地址" value="" class="layui-input" id="layui-input">'
                    ,'</div>'
                    ,'<div class="layui-box layui-upload-button" id="container">'
                    ,'<input required type="file" name="file" class="layui-upload-file" id="layui-upload-file" value="" accept="image/*">'
                    ,'<div id="msg"></div>'
                    ,'<span class="layui-upload-icon"><i class="layui-icon"></i>上传图片</span>'
                    ,'</div>'
                ,'</li>'
                ,'<li class="layui-form-item" style="text-align: center;">'
                  ,'<button type="button" lay-submit lay-filter="uploadImages" class="layui-btn yes-btn">确认</button>'
                ,'</li>'
              ,'</ul>'].join('')
              ,success: function(layero, index){
              	//图片上传
              	    //获得token.我的需要上传图片的服务器上去获取.
                var inputFile = $('#layui-upload-file');
                var msg = $('#msg');
                var key = '';
                // inputFile.click(function(ev){
                //     ev.preventDefault();
                // });
               
                var uploader = Qiniu.uploader({
                    runtimes: 'HTML5,flash,html4',    //上传模式,依次退化
                    browse_button: 'layui-upload-file',       //上传选择的点选按钮，**必需**
                    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    //uptoken : 'xxxxxxxxxxxxxx',
                    //save_key: true,        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                    domain: 'http://test.game-face2face.haorenao.cn/server',
                    uptoken_func: function() {
                    
                        $.ajax({
                            async: false,
                            type: "POST",
                            url:basePath+"/upload/token/",
                            headers: {
                                Authorization: "Token "+ token
                            },
                            data: {
                                filename: 'dfhu.png',
                            },
                            dataType: "json",
                            success: function(json) {
                              upToken = json.token;
                              upkey = json.key;
                            }
                          });
                          return upToken;
                    },
                    container: 'container',//上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '1000mb',           //最大文件体积限制
                    flash_swf_url: 'plupload/js/Moxie.swf', //引入flash,相对路径
                    max_retries: 3,
                    get_new_uptoken: true,                  //上传失败最大重试次数
                    dragdrop: true,  
                    get_new_uptoken: false,                 
                    drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                          'FilesAdded': function(up, files) {
                              plupload.each(files, function(file) {
                              });
                          },
                          'BeforeUpload': function(up, file) {
                            //alert('e');
                                 // 每个文件上传前,处理相关的事情
                          },
                          'UploadProgress': function(up, file) {
                                 // 每个文件上传时,处理相关的事情
                              $('.yes-btn').html('<img src="img/zone/loading.gif" style="height:20px;"/>').css('background','#e6e6e6');
                          },
                          'FileUploaded': function(up, file, info) {
                                $('.yes-btn').html('确认').css('background','#009688');
                                json = jQuery.parseJSON(info);
                                $('#layui-input').val(json.url);
                          },
                          'Error': function(up, err, errTip) {
                                 var $progressNumed = $(".progressNum .progressNumed").eq(0);
                                     $progressNumed.html($progressNumed.html() - 0 + 1);
                                     console.log(up);
                                     console.log(err);
                                     console.log(errTip);
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
                
                form.on('submit(uploadImages)', function(data){
                  var field = data.field;
                  if(!field.image) return image.focus();
                  layui.focusInsert(editor[0], 'img['+ field.image + '] ');
                  layer.close(index);
                });
              }
            });
          }else{
            layer.msg('请先登录');
          }
        }
        ,face: function(editor, self){ //插入表情
          if(token){
            var str = '', ul, face = gather.face;
            for(var key in face){
              str += '<li title="'+ key +'"><img src="'+ face[key] +'"></li>';
            }
            str = '<ul id="LAY-editface" class="layui-clear">'+ str +'</ul>';
            layer.tips(str, self, {
              tips: 3
              ,time: 0
              ,skin: 'layui-edit-face'
            });
            $(document).on('click', function(){
              layer.closeAll('tips');
            });
            $('#LAY-editface li').on('click', function(){
              var title = $(this).attr('title') + ' ';
              layui.focusInsert(editor[0], 'face' + title);
            });
          }else{
            layer.msg('请先登录');
          }
        }
        ,href: function(editor){ //超链接
          if(token){
            layer.prompt({
              title: '请输入合法链接',
              content:'<input type="text" class="layui-layer-input" value="http://">'
              ,shade: false
            }, function(val, index, elem){
              if(!/^http(s*):\/\/[\S]/.test(val)){
                layer.tips('这根本不是个链接，不要骗我。', elem, {tips:1})
                return;
              }
              layui.focusInsert(editor[0], ' a('+ val +')['+ val + '] ');
              layer.close(index);
            });
          }else{
            layer.msg('请先登录');
          }
        }
        ,code: function(editor){ //插入代码
          if(token){
            layer.prompt({
              title: '请贴入代码'
              ,formType: 2
              ,maxlength: 10000
              ,shade: false
            }, function(val, index, elem){
              layui.focusInsert(editor[0], '[pre]\n'+ val + '\n[/pre]');
              layer.close(index);
            });
          }else{
            layer.msg('请先登录');
          }
        }
        ,yulan: function(editor){ //预览
          if(token){
            var content = editor.val();
            
            content = /^\{html\}/.test(content) 
              ? content.replace(/^\{html\}/, '')
            : gather.content(content);

            layer.open({
              type: 1
              ,title: '预览'
              ,area: ['100%', '100%']
              ,scrollbar: false
              ,content: '<div class="detail-body" style="margin:20px;">'+ content +'</div>'
            });
          }else{
            layer.msg('请先登录');
          }
        }
      };
      
      layui.use('face', function(face){
        options = options || {};
        gather.face = face;
        $(options.elem).each(function(index){
          var that = this, othis = $(that), parent = othis.parent();
          parent.prepend(html);
          parent.find('.fly-edit span').on('click', function(event){
            var type = $(this).attr('type');
            mod[type].call(that, othis, this);
            if(type === 'face'){
              event.stopPropagation()
            }
          });
        });
      });
      
    }

    ,escape: function(html){
      return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }

    //内容转义
    ,content: function(content){
      //支持的html标签
      var html = function(end){
        return new RegExp('\\['+ (end||'') +'(pre|div|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)\\]\\n*', 'g');
      };
      content = gather.escape(content||'') //XSS
      .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
        return '<img src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
      }).replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
      .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
    	  var alt = face.replace(/^face/g, '');
    	  if(typeof(gather.face[alt]) == "undefined"){
    		  return face;
    	  }else{
    		  return '<img alt="'+ alt +'" title="'+ alt +'" src="' + gather.face[alt] + '">';  
    	  }
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
        if(!href) return str;
        var rel =  /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
        return '<a href="'+ href +'" target="_blank"'+ (rel ? ' rel="nofollow"' : '') +'>'+ (text||href) +'</a>';
      }).replace(html(), '\<$1\>').replace(html('/'), '\</$1\>') //转移代码
      .replace(/\n/g, '<br>') //转义换行   
      return content;
    }
    
    //新消息通知
    ,newmsg: function(){
      if(layui.cache.user.uid !== -1){
        gather.json('/api/msg-count', {
          _: new Date().getTime()
        }, function(res){
          if(res.status === 0 && res.count > 0){
            var msg = $('<a class="nav-message" href="javascript:;" title="您有'+ res.count +'条未阅读的消息">'+ res.count +'</a>');
            $('.nav-user').append(msg);
            msg.on('click', function(){
              gather.json('/api/msg-read', {}, function(res){
                if(res.status === 0){
                  location.href = '/user/message/';
                }
              });
            });
          }
        });
      }
      return arguments.callee;
    }

    ,cookie: function(e,o,t){
      e=e||"";var n,i,r,a,c,p,s,d,u;if("undefined"==typeof o){if(p=null,document.cookie&&""!=document.cookie)for(s=document.cookie.split(";"),d=0;d<s.length;d++)if(u=$.trim(s[d]),u.substring(0,e.length+1)==e+"="){p=decodeURIComponent(u.substring(e.length+1));break}return p}t=t||{},null===o&&(o="",t.expires=-1),n="",t.expires&&("number"==typeof t.expires||t.expires.toUTCString)&&("number"==typeof t.expires?(i=new Date,i.setTime(i.getTime()+864e5*t.expires)):i=t.expires,n="; expires="+i.toUTCString()),r=t.path?"; path="+t.path:"",a=t.domain?"; domain="+t.domain:"",c=t.secure?"; secure":"",document.cookie=[e,"=",encodeURIComponent(o),n,r,a,c].join("");
    }
  };

  //相册
  layer.photos({
    photos: '.photos'
    ,zIndex: 9999999999
  });


  //搜索
  $('.fly-search').submit(function(){
    var input = $(this).find('input'), val = input.val();
    if(val.replace(/\s/g, '') === ''){
      return false;
    }
    input.val('site:layui.com '+ input.val());
  });
  $('.icon-sousuo').on('click', function(){
    $('.fly-search').submit();
  });

  //新消息通知
  gather.newmsg();

  //发送激活邮件
  gather.activate = function(email){
    gather.json('/api/activate/', {}, function(res){
      if(res.status === 0){
        layer.alert('已成功将激活链接发送到了您的邮箱，接受可能会稍有延迟，请注意查收。', {
          icon: 1
        });
      };
    });
  };
  $('#LAY-activate').on('click', function(){
    gather.activate($(this).attr('email'));
  });

  //点击@
  $('body').on('click', '.fly-aite', function(){
    var othis = $(this), text = othis.text();
    if(othis.attr('href') !== 'javascript:;'){
      return;
    }
    text = text.replace(/^@|（[\s\S]+?）/g, '');
    othis.attr({
      href: '/jump?username='+ text
      ,target: '_blank'
    });
  });

  //表单提交
  /*form.on('submit(*)', function(data){
    var action = $(data.form).attr('action'), button = $(data.elem);
    gather.json(action, data.field, function(res){
      var end = function(){
        if(res.action){
          location.href = res.action;
        } else {
          gather.form[action||button.attr('key')](data.field, data.form);
        }
      };
      if(res.status == 0){
        button.attr('alert') ? layer.alert(res.msg, {
          icon: 1,
          time: 10*1000,
          end: end
        }) : end();
      };
    });
    return false;
  });*/

  //加载特定模块
  if(layui.cache.page && layui.cache.page !== 'index'){
    var extend = {};
    layui.use(layui.cache.page);
  }
  
  //加载IM
  if(!device.android && !device.ios){
    // layui.use('im');
  }

  //加载编辑器
  gather.layEditor({
    elem: '.fly-editor'
  });
  

  //右下角固定Bar
  util.fixbar({
    /*bar1: false
    ,click: function(type){
      if(type === 'bar1'){
        layer.msg('bar1');
      }
    }*/
  });

  exports('fly', gather);

});

}