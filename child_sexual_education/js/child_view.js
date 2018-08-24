$(document).ready(function () {
    "use strict";
    var basePath = '//app.cxy61.com/program_girl';

//	============================= Preloader =============================

	
	// $(window).on("load", function () {
		
 //        $(".preloader").fadeOut("slow", function () {
 //            $(this).remove();
 //        });
		
	// });
    

//	============================= Single page Nav =============================

	
	var navInneer = $(".main-nav-inner");
    navInneer.singlePageNav({
		
        updateHash: false,
        filter: ":not(.external)",
        offset: 50,
        speed: 1000,
        currentClass: "current",
        easing: "swing"
		
    });


//	============================= Sticky nav menu =============================

    var scrollOffset = 100,
        header =  $("header"),
        root = $(window);

    root.on("scroll", function () {
        if (root.scrollTop() < scrollOffset) {
			
            // header.removeClass("stuck");
			
        } else {
			
            // header.addClass("stuck");
			
        }
    });

	


//	============================= Particles settings =============================

    var particlesSettings = {
        particles: {
            number: {
                value: 30,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#FFF"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#F0F0F0"
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 0.5,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 10,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#FFF",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 1.5
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    };
	
    if ($('#particles').length !== 0) {
        particlesJS('particles', particlesSettings);
	}
	
//	============================= Nav menu responsive =============================

	
    var nav = $(".mobile-menu a"),
        mainNav = $(".main-nav");

    function navClose() {
        nav.removeClass("active");
        mainNav.removeClass("open");
    }

    function navOpen() {
        nav.addClass("active");
        mainNav.addClass("open");
        navInneer.addClass("animation");
    }


    nav.on("click", function (e) {
        if ($(this).is(".active")) {
			
            navClose();
			
        } else {
			
            navOpen();
			
        }
        e.preventDefault();
    });

    var navLinks = $(".main-nav-inner li a");
    navLinks.on("click", function () {
		
        navClose();
		
    });
	



//	============================= Wow =============================

    new WOW().init();

//	============================= Showcase Slider =============================

	
    var showcaseSlider = $(".showcase-slider");
    showcaseSlider.owlCarousel({
		
        loop: true,
        margin: 15,
        nav: false,
        dots: true,
        items: 1,
        startPosition: 0,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }

    });
	

//	============================= Testimonial slider =============================

    var testimonialSlider = $(".testimonial-slider");
	
    testimonialSlider.owlCarousel({
		
        loop: true,
        items: 1,
        nav: false,
        dots: true,
        startPosition: 1
		
    });

//	============================= Magnifiq popup image =============================

    var imagePopup = $(".popup-btn");

    imagePopup.magnificPopup({
		
        type: 'image',
		mainClass: 'mfp-with-zoom',
		zoom: {
            enabled: true,
			duration: 300,
            easing: 'ease-in-out',
			opener: function (openerElement) {
				return openerElement.is('img') ? openerElement : openerElement.closest('.slider-item').find('img');
            }
        }

    });

//	============================= Magnifiq popup video  =============================

    var videoPopup = $(".video-popup");
    videoPopup.magnificPopup({
        type: 'iframe'

    });


//	============================= Accordion  =============================

    var hideAccordion = $(".accordion > .accordion-content").hide(),
		accordionLink = $(".accordion > .accordion-title > a");
    
    hideAccordion.first().slideDown();
    accordionLink.first().addClass("active");
	
	accordionLink.on("click", function (e) {
		
        var accordionContent = $(this).parent().next(".accordion-content");
        accordionLink.removeClass("active");
        $(this).addClass("active");
        hideAccordion.not(accordionContent).slideUp();
        $(this).parent().next().slideDown();
        e.preventDefault();
		
	});

	

//	============================= Contact form  =============================


	var contactForm = $("#contactform");
	
	
	
    contactForm.submit(function () {

        var action = $(this).attr("action"),
			values = $(this).serialize(),
			submit =  $("#submit"),
			message = $("#message");
		
        submit.attr("disabled", "disabled");

        message.slideUp(0, function () {

            message.hide();

            $.post(action, values, function (data) {
                message.html(data);
                message.slideDown("slow");
                submit.removeAttr("disabled");
                if (data.match("success") !== null) {
					contactForm[0].reset();
				}

            });

        });

        return false;

    });
	

//	============================= Disable parallax in mobile  =============================

	
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
	
    jQuery(function ($) {
        if (isMobile.any()) {
            document.documentElement.className = document.documentElement.className + " touch";
            $(".parallax").each(function (i, obj) {
                $(this).css("background-image", 'url(' + $(this).data('image-src') + ')');
                $(this).css("background-color", "#FFFFFF");
                $(this).css("background-size", "cover");
                $(this).css("background-position", "center center");
            });
        }
    });



//  ============================= yyy  =============================

    getArticles(1); //获取文章
    
    // 首页
    $('.home').click(function() {
        location.href = "index.html";
    })
    // 家长看的
    $('.parentView').click(function() {
        location.href = "parent_view.html";
    })
    // 退出
    $('.quit').click(function() {
        // Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
        bcAlert("确定退出？")
    })
    // 跳转链接
    $(document).on("click", ".message .row .jump", function() {
        var url = $(this).attr("data-link");
        if (url) {
            window.open(url);
        } else {

        }
    })

    // // 判断用户是否登录
    if(localStorage.token){
        $('.quit').show();
    } else {
        // 弹出登录窗口
        // 打开登录窗口
        // $(".phone-invite-shadow-view").show();
        // getCountry();
    }

    function bcAlert(text) {
        if(! $(".bc-alert-shadow-view").length){
            var html = '<div class="bc-alert-shadow-view">\
                            <div class="bc-alert-view">\
                                <div class="bc-alert-msg">\
                                    <span class="bc-msg">'+text+'</span>\
                                </div>\
                                <div class="bc-alert-btns">\
                                    <span class="bc-alert-submit-btn">'+"确&nbsp定"+'</span>\
                                    <span class="bc-alert-cancel-btn">'+"取&nbsp消"+'</span>\
                                </div>\
                            </div>\
                        </div>';
            $(html).appendTo("body");

            // 确定事件
            $(".bc-alert-submit-btn").unbind('click').click(function(){
                $(".bc-alert-shadow-view").hide();
                // exports.bcSubmitCB();
                localStorage.clear();
                window.location.reload();
            })
            // 取消事件
            $(".bc-alert-cancel-btn").unbind('click').click(function(){
                $(".bc-alert-shadow-view").hide();
                // if (exports.bcCancelCB) {
                //     exports.bcCancelCB();
                // }
            })
        }else{
            $(".bc-alert-view .bc-alert-msg .bc-msg").html(text);
            $(".bc-alert-submit-btn").html("确&nbsp定");
            $(".bc-alert-cancel-btn").html("取&nbsp消");
        }
        $(".bc-alert-shadow-view").show();
    }
    // $(".phone-invite-shadow-view").show();
    function getArticles(page) {

        showWaitingLoading();
        // 判断有无token
        if (localStorage.token) {
            var j = {"Authorization": "Token " + localStorage.token};
            
        } else {
            // location.href = "index.html";
            var j = null;
            // var j = {"Authorization": "Token " + localStorage.token};
        }
        // 获取文章
        $.ajax({
            url: basePath + "/child/articles/?show_type=show_child&page=" + page,
            type: "get",
            headers: j,
            success:function(json){
                hideWaitingLoading();
                var html = template("message-template", json.results);
                $('.message').append(html);
                
                circle.loadMore = true;
                circle.initScroll();
            },
            error:function(xhr, textStatus){
                console.log(xhr);
                console.log(textStatus);
                hideWaitingLoading();
            }
        })
    }

    var circle = {
        loadSwitch:false,
        loadMore:true,
        page:1,
        initScroll:function(){
            window.onscroll = function() {
                // Check if we're within 100 pixels of the bottom edge of the broser window.
                var winHeight = window.innerHeight ? window.innerHeight : $(window).height(), // iphone fix
                    closeToBottom = ($(window).scrollTop() + winHeight > $(document).height() - 150);

                if (closeToBottom) {
                    // Get the first then items from the grid, clone them, and add them to the bottom of the grid
                    if (!circle.loadMore) return;
                    circle.page++;
                    circle.loadMore = false;
                    getArticles(circle.page);
                }
            };
        }
    }
 
    // 点赞/取消点赞
    $(document).on("click", ".heart", function() {
        var pk = $(this).attr("data-pk");
        var img = $(this);
        if (localStorage.token) {
            $.ajax({
                url: basePath + "/child/like/?article=" + pk,
                type: "get",
                headers: {
                    Authorization: "Token " + localStorage.token
                },
                success:function(json){
                    if (json.message == "已点赞") {
                        // alert("成功点赞");
                        img.attr({"src": "images/zan.png"});
                        var likeCount = parseInt(img.next().text().split("人")[0]) + 1;
                        img.next().html(likeCount + "人点赞");
                    } else if (json.message == "已取消点赞") {
                        // alert("已取消点赞");
                        img.attr({"src": "images/no_zan.png"});
                        var likeCount = parseInt(img.next().text().split("人")[0]) - 1;
                        img.next().html(likeCount + "人点赞");
                    }
                },
                error:function(xhr, textStatus){
                }
            })
        } else {
            // alert("请先登录");
            // 弹出登录窗口
            // 打开登录窗口
            $(".phone-invite-shadow-view").show();
            $('body').css({'position': 'fixed', 'width': '100%'});
            getCountry();
        }
    })
    
    function getCountry() {
        // 国家电话代码
        $.ajax({
            type:'get',
            url:"country.json",
            success:function(json){
                var html = template("country-option-template", json);
                $(".country-options").html(html);
            },
            error:function(xhr, textStatus){
                console.log('error');
            }
        })
    }

    function dialog(text) {
        if (!$(".ui-dialog").length) {
            $('<div class="ui-dialog" role="alert"><div class="ui-dialog-container"><p>'+text+'</p><a id="close-dialog">确&nbsp;定</a></div></div>').appendTo("body");
            $('#close-dialog').on('click', function(event) {
                $(".ui-dialog").removeClass('is-visible');
                
            });
        } else {
            $(".ui-dialog .ui-dialog-container p").html(text);
        }
        $('.ui-dialog').addClass('is-visible');
    }
    function showLoading() {
        if (!$("#mask").get(0)) {
            $('<div id="mask"></div>').appendTo("body");
        }
        $("body").css({
            "overflow": "hidden"
        });
        $("#mask").height($(window).height()).fadeIn();
        $(document).on("tap", "#mask", function() {
        // $("#mask").tap(function() {
            $("#mask").fadeOut();
            $("body").css({
                "overflow": "auto"
            });
            // exports.maskClickCallback();
        });
        if ($(".loading").get(0)) {
            $(".loading").show();
        } else {
            $('<div class="loading"></div>').appendTo("body");
            $(".loading").css({
                "left": $(window).width() / 2 - 30 + "px",
                "top": $(window).height() / 2 - 30 + "px"
            });
        }
    }
    function hideLoading() {
        $(".loading").hide();
        $("#mask").fadeOut();
        $("body").css({
            "overflow": "auto"
        });
    }

    function showWaitingLoading (c) {
        var waitingHtml = '<div class="waitloading"><img src="../../statics/images/loading.gif"/></div>';

        var height = null;
        if (c) {
            height = $(c).height();
            $(c).append(waitingHtml);
        }else{
            height = $(window).height();
            $(waitingHtml).appendTo("body");
        }

        if (c) {
            $(".waitloading").css({
                "width":"60px",
                "height":"60px",
                "position":"relative",
                "margin":"auto",
                "padding-top": (height - 60 )/2 + "px",
                "padding-bottom": (height - 60)/2 + "px"
            });
        }else{
            $(".waitloading").css({
                "width":"60px",
                "height":"60px",
                "position": "fixed",
                "top": (height - 60) / 2 + "px",
                left: "calc(50% - 30px)"
            });
        }
    }

    function hideWaitingLoading () {
        //设置延迟2秒
        // setTimeout(function(){
            $(".waitloading").remove();
            // location.href = "aichashuo://loadcomplete";
        // }, 10);
    }



    // ---------------------4.帮助方法
    var Util = {
        currentCountryCode:"+86",
    }
    var Mananger = {
        phone:"",
        code:"",
        password:"",
        chooseAvatar:"https://static1.bcjiaoyu.com/avatars/1.png",
        timer:null,
        getPhoneCode:function(this_){
            // var reg = /^[0-9]$/;
            var phone = this_.find(".phone").children("input").val();
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURI(phone)
            }

            var url = "";
            if (this_.find(".view-tag").html() == "注册") {
                url = "/userinfo/telephone_signup_request/"
            }else if (this_.find(".view-tag").html() == "绑定手机") {
                url = "/userinfo/bind_telephone_request/"
            }else if (this_.find(".view-tag").html() == "找回密码") {
                url = "/userinfo/reset_password_request/";
            }

            if (this_.find(".get-code").html() == "获取验证码") {
                // 发起获取验证码请求
                // Common.isLogin(function(token){
                    $.ajax({
                        type:"get",
                        url: basePath + url,
                        data:{
                            telephone:phone
                        },
                        timeout:6000,
                        success:function(json){
                            if (json.status == 0) {
                                var time = 60;
                                Mananger.timer = setInterval(function(){
                                    --time;
                                    if (time > 0) {
                                        this_.find(".get-code").html(time+'s后重试');
                                    }else{
                                        this_.find(".get-code").html("获取验证码");
                                        clearInterval(Mananger.timer);
                                        Mananger.timer = null;
                                    }
                                },1000);
                            }else if (json.detail) {
                                // Common.dialog(json.detail);
                                dialog(json.detail);
                            }else if (json.message) {
                                // Common.dialog(json.message);
                                dialog(json.message);
                            }
                        },
                        error:function(xhr, textStatus){
                            if (textStatus == "timeout") {
                                // Common.dialog("请求超时");
                                dialog("请求超时");
                                return;
                            }

                            if (xhr.status == 404) {
                                // Common.dialog("您没有团队");
                                return;
                            }else if (xhr.status == 400 || xhr.status == 403) {
                                // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                                dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                                return;
                            }else{
                                // Common.dialog('服务器繁忙');
                                dialog('服务器繁忙');
                                return;
                            }
                            console.log(textStatus);
                        }
                    })
                // })
            }
        },
        lockPhone:function(this_){
            // 绑定手机
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (phone == "") {
                // Common.dialog("请输入手机号");
                dialog("请输入手机号");
                return
            }
            if (veriCode == "") {
                // Common.dialog("请输入验证码");
                dialog("请输入验证码");
                return
            }
            if (password == "") {
                // Common.dialog("请输入密码");
                dialog("请输入密码");
                return
            }

            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURIComponent(phone)
            }

            Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url: basePath + "/userinfo/bind_telephone/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    headers:{
                        Authorization:"Token " + token
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            // Common.dialog("绑定成功");
                            dialog("绑定成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时");
                            dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            })
        },
        regPhone:function(phone, code, password, url, nickname){
            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURIComponent(phone)
            }

            // Common.showLoading();
            showLoading();
            // 注册手机
            // Common.isLogin(function(token){
                $.ajax({
                    type:"post",
                    url: basePath + "/userinfo/telephone_signup/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:code,
                        name:nickname,
                        avatar:url
                    },
                    // headers:{
                    //     Authorization:"Token " + token
                    // },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            // Common.dialog("注册成功");

                            $(".choose-avatar-shadow-view").hide();
                            hideLoading();
                            localStorage.token = json.token;

                        }
                    },
                    error:function(xhr, textStatus){
                        // Common.hideLoading();
                        hideLoading();
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时,请重试");
                            dialog("请求超时,请重试");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            // })
        },
        resetPassword:function(this_){
            // 重置密码
            var phone = this_.find(".phone").children("input").val(),
                veriCode = this_.find(".verify-code").children("input").val(),
                password = this_.find(".password").children("input").val();

            if (phone == "") {
                // Common.dialog("请输入手机号");
                dialog("请输入手机号");
                return
            }
            if (veriCode == "") {
                // Common.dialog("请输入验证码");
                dialog("请输入验证码");
                return
            }
            if (password == "") {
                // Common.dialog("请输入密码");
                dialog("请输入密码");
                return
            }

            if (Util.currentCountryCode != "+86") {
                phone = Util.currentCountryCode + phone
                // phone = encodeURIComponent(phone)
            }

            // Common.isLogin(function(token){
                $.ajax({
                    type:"put",
                    url: basePath + "/userinfo/reset_password/",
                    data:{
                        telephone:phone,
                        password:password,
                        verification_code:veriCode
                    },
                    timeout:6000,
                    success:function(json){
                        if (json.token) {
                            // Common.dialog("修改密码成功");
                            dialog("修改密码成功");
                            this_.parent().hide();
                        }
                    },
                    error:function(xhr, textStatus){
                        if (textStatus == "timeout") {
                            // Common.dialog("请求超时");
                            dialog("请求超时");
                            return;
                        }
                        if (xhr.status == 401) {
                            //去登录
                            localStorage.clear();
                            window.location.reload();
                            return;
                        }
                        if (xhr.status == 404) {
                            // Common.dialog("您没有团队");
                            return;
                        }else if (xhr.status == 400 || xhr.status == 403) {
                            // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                            return;
                        }else{
                            // Common.dialog('服务器繁忙');
                            dialog('服务器繁忙');
                            return;
                        }
                        console.log(textStatus);
                    }
                })
            // })
        },
        goLogin:function(this_){
            // 登录
            var username = this_.find(".username").children("input").val(),
                password = this_.find(".password").children("input").val();
            if(username == ""){
                // Common.dialog("请输入账号");
                dialog("请输入账号");
                return;
            }
            if(password == ""){
                // Common.dialog("请输入密码");
                dialog("请输入密码");
                return;
            }
            var url = "",
                data = {};
            if (this_.attr("data-tag") == "invite") {
                url = "/userinfo/invitation_code_login/"
                data = {
                    code:username,
                    password:password
                }
            }else if (this_.attr("data-tag") == "phone") {

                if (Util.currentCountryCode != "+86") {
                    username = Util.currentCountryCode + username
                    // username = encodeURIComponent(username)
                }

                url = "/userinfo/telephone_login/"
                data = {
                    telephone:username,
                    password:password
                }

            }

            // Common.showLoading();
            showLoading();
            $.ajax({
                type:"post",
                url: basePath + url,
                data:data,
                success:function(json){
                    console.log(json);
                    localStorage.token = json.token;
                    hideLoading();
                    $('.phone-invite-shadow-view').hide();
                    $('body').css({'position': 'relative'});
                    $('.quit').show();
                    window.location.reload();
                },
                error:function(xhr, textStatus){
                    // Common.hideLoading();
                    hideLoading();
                    if (textStatus == "timeout") {
                        // Common.dialog("请求超时");
                        dialog("请求超时");
                        return;
                    }
                    if (xhr.status == 401) {
                        //去登录
                        localStorage.clear();
                        window.location.reload();
                        return;
                    }
                    if (xhr.status == 400 || xhr.status == 403) {
                        // Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                        return;
                    }else{
                        // Common.dialog('服务器繁忙');
                        dialog('服务器繁忙');
                        return;
                    }
                }
            })
        },
        getCountryCode:function(){
            $.ajax({
                type:'get',
                url:"../../modules/common/country.json",
                success:function(json){
                    var html = ArtTemplate("country-option-template", json);
                    $(".country-options").html(html);

                    // Page.clickEventLoginRelated();
                },
                error:function(xhr, textStatus){
                    console.log('error');
                }
            })
        }
    }

    // -------------------------------2.手机/邀请码登录
    $(".phone-invite-view .tabs .tab").unbind('click').click(function(){
        // 选择手机/邀请码登录
        if ($(this).hasClass("unselect")) {
            $(".phone-invite-view .tabs .tab").removeClass("select").addClass("unselect");

            $(this).removeClass("unselect").addClass("select");
        }
        if ($(this).hasClass("phone")){
            $(".phone-account-view").css({display:"flex"})
            $(".invite-account-view").css({display:"none"})

        }else if ($(this).hasClass("invite")) {
            $(".invite-account-view").css({display:"flex"})
            $(".phone-account-view").css({display:"none"})
        }
    })
    $(".phone-invite-view .close img").unbind('click').click(function(){
        // 关闭手机/邀请码登录窗口
        $(".phone-invite-shadow-view").hide();
    })

    $(".phone-account-view .login-btn").unbind('click').click(function(){
        // 手机号登录
        Mananger.goLogin($(".phone-account-view"));
    })
    $(".invite-account-view .login-btn").unbind('click').click(function(){
        // 邀请码登录
        Mananger.goLogin($(".invite-account-view"));
    })

    $(".phone-invite-view .go-reg").unbind('click').click(function(){
        // 打开手机注册窗口
        $(".phone-reg-shadow-view").show();
        $(".phone-invite-shadow-view").hide();
    })
    $(".phone-invite-view .forgot-psd").unbind('click').click(function(){
        // 打开找回密码窗口
        $(".find-password-shadow-view").show();
    })

    // -----------------------------3.手机注册
    $(".phone-reg-view .close img").unbind('click').click(function(){
        // 关闭手机注册窗口
        $(".phone-reg-shadow-view").hide();
        $(".phone-invite-shadow-view").show();
    })
    $(".phone-reg-view .get-code").unbind('click').click(function(){
        // 获取手机验证码
        Mananger.getPhoneCode($(".phone-reg-view"));
    })
    $(".phone-reg-view .reg-next-btn").unbind('click').click(function(){
        // 注册下一步 btn
        var this_ = $(".phone-reg-view");
        if (this_.find(".phone").children("input").val() == "") {
            // Common.dialog("请输入手机号");
            dialog("请输入手机号");
            return
        }
        if (this_.find(".verify-code").children("input").val() == "") {
            // Common.dialog("请输入验证码");
            dialog("请输入验证码");
            return
        }
        if (this_.find(".password").children("input").val() == "") {
            // Common.dialog("请输入密码");
            dialog("请输入密码");
            return
        }

        Mananger.phone = this_.find(".phone").children("input").val();
        Mananger.code = this_.find(".verify-code").children("input").val();
        Mananger.password = this_.find(".password").children("input").val();

        // 打开头像窗口
        $(".choose-avatar-shadow-view").show();
        $(".phone-reg-shadow-view").hide();

        // var width = $(window).width();
        // $(".ui-choose-avatar-view").css({
        //     "width":width*0.35+"px"
        // })
    })
    // -----------------------------4.选择头像
    $(".choose-avatar-view .close img").unbind('click').click(function(){
        // 关闭选择头像窗口
        $(".choose-avatar-shadow-view").hide();
        $(".phone-reg-shadow-view").show();
    })

    $(".choose-avatar-view .choose-avatar").unbind('click').click(function(){
        $(".choose-avatar-view .avatars-view").css({
            display:"flex"
        });
    })

    $(".choose-avatar-view .avatars .avatar").unbind('click').click(function(){
        // 头像选择
        var url = $(this).children("img").attr("src");
        $(".choose-avatar-view .choose-avatar img").attr({src:url})
    })
    $(".choose-avatar-view .submit-avatar .submit").unbind('click').click(function(){
        $(".choose-avatar-view .avatars-view").css({
            display:"none"
        });
        Mananger.chooseAvatar = $(".choose-avatar-view .choose-avatar img").attr("src");
    })
    $(".choose-avatar-view .reg-btn").unbind('click').click(function(){
        // 注册 btn
        var nickname = $(".choose-avatar-view .nickname input").val();
        if (nickname == "") {
            // Common.dialog("请输入昵称");
            dialog("请输入昵称");
            return
        }
        Mananger.regPhone(Mananger.phone, Mananger.code, Mananger.password, Mananger.chooseAvatar, nickname);
    })

    // -----------------------------4.找回密码
    $(".find-password-view .close img").unbind('click').click(function(){
        $(".find-password-shadow-view").hide();
    })
    $(".find-password-view .get-code").unbind('click').click(function(){
        // 获取手机验证码
        Mananger.getPhoneCode($(".find-password-view"));
    })
    $(".find-password-view .reset-psd-btn").unbind('click').click(function(){
        // 重置密码 btn
        Mananger.resetPassword($(".find-password-view"));
    })

    // ----------------------------5.国家电话代码
    // 国家代码
    $(".code-country").unbind('click').click(function(){
        $(".country-options").toggle();
    })
    // 默认是+86
    // $(".country-option").unbind('click').click(function(){
    $(document).on("click", ".country-option", function() {
        var code = $(this).attr("data-code");
        Util.currentCountryCode = code;
        $(".country-option.select").removeClass("select");
        $(this).addClass("select");
        $(".code-country span").html(code);

        $(".country-options").hide();
    })

    

    // 统计页面浏览量
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?11a4ed911c9eed52f13e75b90cbed1c4";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

    
});


