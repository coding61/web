$(document).ready(function () {

    "use strict";

//	============================= Preloader =============================

	
	$(window).on("load", function () {
		
        $(".preloader").fadeOut("slow", function () {
            $(this).remove();
        });
		
	});
    

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
			
            header.removeClass("stuck");
			
        } else {
			
            header.addClass("stuck");
			
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
    // 家长看的
    $('.parentView').click(function() {
        location.href = "parent_view.html";
    })
    // 孩子看的
    $('.childView').click(function() {
        location.href = "child_view.html";
    })
    // 退出
    $('.quit').click(function() {
        // Common.bcAlert("退出将会清空会话聊天缓存，是否要确定退出？", function(){
        bcAlert("确定退出？")
    })

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

    // // 判断用户是否登录
    if(localStorage.token){
        $('.quit').show()
    } else {
        // 弹出登录窗口
        // 打开登录窗口
        // $(".phone-invite-shadow-view").show();
    }
    

    




    // 统计页面浏览量
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?11a4ed911c9eed52f13e75b90cbed1c4";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

    
});


