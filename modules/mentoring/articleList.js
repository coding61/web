define(function(require, exports, module) {
	var Common = require('common/common.js?v=1.1');
	var teacherPk = Common.getQueryString("current_master_pk");
	var myPk = null;
	var isMySelf = Common.getQueryString("ismyself");
	var totalPages = 1;
	var requestURL = Common.domain + "/teacher/articles/" + teacherPk + "/?page=1";
	var currentPage = 1;

    var Page = {
        init:function(){
            clickEvent();
            if(localStorage.token){
                Common.showLoading();
                getInfo();
                // loadData();
            }else{
                $(".login-shadow-view").show();
            }
        }
    }
    Page.init();

    function loadData(url) {
		Common.isLogin(function(token){
		   $.ajax({
			   type:'get',
			   url: url,
			   headers:{
				   Authorization:"Token " + token
			   },
			   timeout:6000,
			   success:function(json){

				  totalPages = Math.ceil(json.count / 10);

				  var html = template('list-template', json.results);
		          $('.list-view').html(html);

				  if (json.count == 0) {
					  $('.none-view').show();
				  }

			  	  if (isMySelf != 'Yes') {
					  $('.push').hide();
					  $('.item-buy').show();
				  } else {
					  $('.push').show();
					  $('.item-buy').hide();
				  }

				  // 文章信息
		          $(".item-info").unbind('click').click(function(){
					  var articlePk = $(this).closest('li').attr('data-pk');
					  var buy = $(this).closest('li').attr('data-buy');
					  var price = $(this).closest('li').attr('data-price');
					  checkForBuy(buy, price, articlePk)
		          })
				  // 文章封面
		          $(".cover").unbind('click').click(function(){
					  var articlePk = $(this).closest('li').attr('data-pk');
					  var buy = $(this).closest('li').attr('data-buy');
					  var price = $(this).closest('li').attr('data-price');
					  checkForBuy(buy, price, articlePk)
		          })
				  // 购买按钮
		          $(".item-buy").click(function(){
		              var articlePk = $(this).closest('li').attr('data-pk');
					  var buy = $(this).closest('li').attr('data-buy');
					  var price = $(this).closest('li').attr('data-price');
					  checkForBuy(buy, price, articlePk)
		          })
		          $(".item-buy").mouseover(function(){
		              var id = $(this).closest('li').attr('data-id');
		              $(this).css("background-color","#E66689");
		              $(this).css("color", "#fff");
		          });
		          $(".item-buy").mouseout(function(){
		              var id = $(this).closest('li').attr('data-id');
		              $(this).css("background-color","#fff");
		              $(this).css("color", "#5a5a5a");
		          });
				  // 分页
		          $('#pagination').jqPaginator({
		              totalPages: totalPages == 0 ? 1 : totalPages,
		              visiblePages: 10,
		              currentPage: currentPage,
					//   first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
					  prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
					  next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
					//   last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
					  page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
		              onPageChange: function (num, type) {
						  if (currentPage != num) {
							 currentPage = num;
							 requestURL = Common.domain + "/teacher/articles/" + teacherPk + "/?page=" + currentPage;
							 loadData(requestURL);
						  }
		              }
		          });
			   },
			   error:function(xhr, textStatus){
				   exceptionHandling(xhr, textStatus);
			   }
		   })
	   })
    }
	// 检查是否需要购买
	function checkForBuy(buy, price, articlePk) {
		if (buy == "Yes") {
			location.href = '../../cxyteam_forum/content.html?current_article_pk=' + articlePk;
		} else if (buy == "No") {
			buyArticle(price, articlePk);
		}
	}
	// 购买文章
	function buyArticle(price, articlePk) {
		Common.bcAlert("查看此文章需要" + price + "钻石，是否购买？", function(){
			Common.isLogin(function(token){
				$.ajax({
					type:'post',
					url: Common.domain + "/teacher/buy_article/",
					headers:{
						Authorization:"Token " + token
					},
					data:{
						article: articlePk
					},
					timeout:6000,
					success:function(json){
						if (json.message) {
							Common.dialog(json.message);
						}
						loadData(requestURL);
					},
					error:function(xhr, textStatus){
						exceptionHandling(xhr, textStatus);
					}
				})
			})
		})
	}
	// 获取个人信息
    function getInfo(){
        Common.isLogin(function(token){
            $.ajax({
                type:"get",
                url:Common.domain + "/userinfo/whoami/",
                headers:{
                    Authorization:"Token " + token
                },
                success:function(json){
                    Common.hideLoading();

                    $(".header .avatar img").attr({src:json.avatar});
                    $(".header .info .grade").html(json.grade.current_name);
                    $(".header .info .grade-value").html(json.experience+"/"+json.grade.next_all_experience);
                    $(".header .zuan span").html("x"+json.diamond);

                    var percent = parseInt(json.experience)/parseInt(json.grade.next_all_experience)*$(".header .info-view").width();
                    $(".header .progress img").css({
                        width:percent
                    })
                    $(".login-shadow-view").hide();

					// 获取文章
					loadData(requestURL);
                },
                error:function(xhr, textStatus){
                    exceptionHandling(xhr, textStatus);
                }
            })
        })
    }
	// 异常处理
	function exceptionHandling(xhr, textStatus) {
		Common.hideLoading();
		if (textStatus == "timeout") {
			Common.dialog("请求超时");
			return;
		}
		if (xhr.status == 400 || xhr.status == 403) {
			Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
			return;
		}else{
			Common.dialog('服务器繁忙');
			return;
		}
	}
	// 点击事件
    function clickEvent() {
		$(".header .logo2").unbind('click').click(function(){
            window.open("https://www.cxy61.com");
        })
        // 登录
        $(".login-view .login").unbind('click').click(function(){
            login();
        })
        // 退出
        $(".quit").unbind('click').click(function(){
            Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
                localStorage.clear();
                window.location.reload();
            })
        })
		// 发布文章
        $(".push").unbind("click").click(function(){
			location.href = '../home/article.html';
        })
        $(".push").mouseover(function(){
            $(this).css("background-color","#ED8AAB");
        });
        $(".push").mouseout(function(){
            $(this).css("background-color","#E66689");
        });
    }
});
