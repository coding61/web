define(function(require, exports, module) {
	var ArtTemplate = require("libs/template.js");
	var Common = require('common/common.js');
    var Utils = require('common/utils.js');
    

    var animation = window.animation;

    // 右边的猴子
    var monkeysImages = ['../../statics/images/monkey/monkey-laugh.png', "../../statics/images/monkey/monkey-nod.png", "../../statics/images/monkey/monkey-quick-head.png", "../../statics/images/monkey/monkey-say.png", "../../statics/images/monkey/monkey-head.png"];
    var monkeyLaughMap = ["-153 -10", "-153 -310", "-10 -110", "-153 -110", "-296 -10", "-296 -110", "-10 -210", "-153 -210", "-296 -210", "-10 -310", "-10 -10", "-296 -310", "-439 -10", "-439 -110", "-439 -210", "-439 -310", "-10 -410", "-153 -410", "-296 -410", "-439 -410", "-582 -10"];
    var monkeyNodMap = ["-154 -10", "-298 -310", "-10 -110", "-154 -110", "-298 -10", "-298 -110", "-10 -210", "-154 -210", "-298 -210", "-10 -310", "-154 -310", "-10 -10", "-442 -10", "-442 -110", "-442 -210", "-442 -310", "-10 -410", "-154 -410", "-298 -410", "-442 -410", "-586 -10", "-586 -110"]
    var monkeyQuickHeadMap = ["-155 -10", "-300 -310", "-10 -110", "-155 -110", "-300 -10", "-300 -110", "-10 -210", "-155 -210", "-300 -210", "-10 -310", "-155 -310", "-10 -10", "-445 -10", "-445 -110", "-445 -210", "-445 -310", "-10 -410", "-155 -410", "-300 -410", "-445 -410", "-590 -10", "-590 -110"];
    var monkeySayMap = ["-152 -10", "-436 -10", "-10 -110", "-152 -110", "-294 -10", "-294 -110", "-10 -210", "-152 -210", "-294 -210", "-10 -310", "-152 -310", "-294 -310", "-10 -10", "-436 -110", "-436 -210", "-436 -310", "-10 -410", "-152 -410", "-294 -410", "-436 -410", "-578 -10", "-578 -110", "-578 -210", "-578 -310"];
    var monkeyHeadMap = ["-144 -10", "-144 -310", "-10 -110", "-144 -110", "-278 -10", "-278 -110", "-10 -210", "-144 -210", "-278 -210", "-10 -310", "-10 -10", "-278 -310", "-412 -10", "-412 -110", "-412 -210", "-412 -310", "-10 -410", "-144 -410", "-278 -410", "-412 -410", "-546 -10"];
    var monkeyMaps = [monkeyLaughMap, monkeyNodMap, monkeyQuickHeadMap, monkeySayMap, monkeyHeadMap]

    var monkeysImages500 = ['../../statics/images/monkey/monkey-laugh-w500.png', "../../statics/images/monkey/monkey-nod-w500.png", "../../statics/images/monkey/monkey-quick-head-w500.png", "../../statics/images/monkey/monkey-say-w500.png", "../../statics/images/monkey/monkey-head-w500.png"];
    var monkeyLaughMap500 = ["-530 -10", "-530 -1042", "-10 -354", "-530 -354", "-10 -698", "-530 -698", "-1050 -10", "-1050 -354", "-1050 -698", "-10 -1042", "-10 -10", "-1050 -1042", "-1570 -10", "-1570 -354", "-1570 -698", "-1570 -1042", "-10 -1386", "-530 -1386", "-1050 -1386", "-1570 -1386", "-10 -1730"];
    var monkeyNodMap500 = ["-530 -10", "-1050 -1036", "-10 -352", "-530 -352", "-10 -694", "-530 -694", "-1050 -10", "-1050 -352", "-1050 -694", "-10 -1036", "-530 -1036", "-10 -10", "-1570 -10", "-1570 -352", "-1570 -694", "-1570 -1036", "-10 -1378", "-530 -1378", "-1050 -1378", "-1570 -1378", "-10 -1720", "-530 -1720"];
    var monkeyQuickHeadMap500 = ["-530 -10", "-1050 -1024", "-10 -348", "-530 -348", "-10 -686", "-530 -686", "-1050 -10", "-1050 -348", "-1050 -686", "-10 -1024", "-530 -1024", "-10 -10", "-1570 -10", "-1570 -348", "-1570 -686", "-1570 -1024", "-10 -1362", "-530 -1362", "-1050 -1362", "-1570 -1362", "-10 -1700", "-530 -1700"];
    var monkeySayMap500 = ["-530 -10", "-1570 -10", "-10 -356", "-530 -356", "-10 -702", "-530 -702", "-1050 -10", "-1050 -356", "-1050 -702", "-10 -1048", "-530 -1048", "-1050 -1048", "-10 -10", "-1570 -356", "-1570 -702", "-1570 -1048", "-10 -1394", "-530 -1394", "-1050 -1394", "-1570 -1394", "-10 -1740", "-530 -1740", "-1050 -1740", "-1570 -1740"];
    var monkeyHeadMap500 = ["-530 -10", "-530 -1120", "-10 -380", "-530 -380", "-1050 -10", "-1050 -380", "-10 -750", "-530 -750", "-1050 -750", "-10 -1120", "-10 -10", "-1050 -1120", "-1570 -10", "-1570 -380", "-1570 -750", "-1570 -1120", "-10 -1490", "-530 -1490", "-1050 -1490", "-1570 -1490", "-2090 -10"];
    var monkeyMaps500 = [monkeyLaughMap500, monkeyNodMap500, monkeyQuickHeadMap500, monkeySayMap500, monkeyHeadMap500]

    var types = ["laugh", "nod", "quickHead", "say", "head"];
    var type = types[0];
    var index = 0;

    var Page = {
        init:function(){
            // monkeyLaugh();
            // monkeyLaughLose();
            // monkeyNod();
            // monkeyQuickHead();
            // monkeySay();
            // monkeyHead();
            Page.monkey();
            Page.monkeyModeClickEvent();
        },
        monkeyLaugh:function(){
            //循环
            var repeatAnimation = animation().loadImage(monkeysImages).changePosition($("monkey1"), monkeyLaughMap, monkeysImages[0]).repeatForever();
            repeatAnimation.start(80);
                
            //暂停
            var running = true;
            $("monkey1").addEventListener('click', function () {
                if (running) {
                    running = false;
                    repeatAnimation.pause();
                } else {
                    running = true;
                    repeatAnimation.restart();
                }
            });

            //一次
            // var loseAnimation = animation().loadImage(monkeysImages).changePosition($("monkey1"), monkeyLaughMap, monkeysImages[0]).then(function(){
            //     console.log('lose animation finished');
            //     loseAnimation.dispose();
            // });
            // loseAnimation.start(200);

        },
        monkeyNod:function(){
            //循环
            var headAnimation = animation().loadImage(monkeysImages).changePosition($("monkey2"), monkeyNodMap, monkeysImages[1]).repeatForever();
            headAnimation.start(80);
            
            //一次
            // var headAnimation = animation().loadImage(monkeysImages).changePosition($("monkey2"), monkeyNodMap, monkeysImages[1]).then(function(){
            //     console.log('headAnimation finished');
            //     headAnimation.dispose();
            // })
            // headAnimation.start(200);
        },
        monkeyQuickHead:function(){
            //循环
            var quickHeadAnimation = animation().loadImage(monkeysImages).changePosition($("monkey3"), monkeyQuickHeadMap, monkeysImages[2]).repeatForever();
            quickHeadAnimation.start(80);
            
            //暂停
            var running = true;
            $("monkey3").addEventListener('click', function () {
                if (running) {
                    running = false;
                    quickHeadAnimation.pause();
                } else {
                    running = true;
                    quickHeadAnimation.restart();
                }
            });
        },
        monkeySay:function(){
            //循环
            var quickHeadAnimation = animation().loadImage(monkeysImages).changePosition($("monkey4"), monkeySayMap, monkeysImages[3]).repeatForever();
            quickHeadAnimation.start(80);

            //暂停
            var running = true;
            $("monkey4").addEventListener('click', function () {
                if (running) {
                    running = false;
                    quickHeadAnimation.pause();
                } else {
                    running = true;
                    quickHeadAnimation.restart();
                }
            });
            
            //一次
            // var headAnimation = animation().loadImage(monkeysImages).changePosition($("monkey4"), monkeySayMap, monkeysImages[3]).then(function(){
            //     console.log('headAnimation finished');
            //     headAnimation.dispose();
            // })
            // headAnimation.start(200);
        },
        monkeyHead:function(){
            //循环
            var quickHeadAnimation = animation().loadImage(monkeysImages).changePosition($("monkey5"), monkeyHeadMap, monkeysImages[4]).repeatForever();
            quickHeadAnimation.start(80);

            //暂停
            var running = true;
            $("monkey5").addEventListener('click', function () {
                if (running) {
                    running = false;
                    quickHeadAnimation.pause();
                } else {
                    running = true;
                    quickHeadAnimation.restart();
                }
            });

            //一次
            // var headAnimation = animation().loadImage(monkeysImages).changePosition($("monkey5"), monkeyHeadMap, monkeysImages[4]).then(function(){
            //     console.log('headAnimation finished');
            //     headAnimation.dispose();
            // })
            // headAnimation.start(200);
        },
        monkeyMode:function(){
            //80
            // var monkeyMap = monkeyMaps[index];
            // var image = monkeysImages[index];
            // 500
            var monkeyMap = monkeyMaps500[index];
            var image = monkeysImages500[index];

            Page.monkeyAnimation(animation(), monkeyMap, image);
        },
        monkeyAnimation:function(animation1, monkeyMap, image){
            // var images = monkeysImages;    //80
            var images = monkeysImages500; //500

            animation1.loadImage(images).changePosition($monkey("monkey"), monkeyMap, image).then(function () {
                console.log('win animation repeat 3 times and finished', index);
                // if (index >= 4) {
                //     //释放资源
                //     console.log("释放资源")
                //     // animation1.dispose();
                // }else{
                //     ++index;
                //     Page.monkeyAnimation(animation1, monkeyMaps[index], monkeysImages[index]);
                // }
            });
            animation1.start(80);

            //暂停
            var running = true;
            $monkey("monkey").addEventListener('click', function () {
                if (running) {
                    running = false;
                    animation1.pause();
                } else {
                    running = true;
                    animation1.restart();
                }
            });
        },
        monkey:function(){
            Page.monkeyMode();
        },
        monkeyModeClickEvent:function(){
            $(".item1").click(function(){
                console.log("笑");
                // var monkeyMap = monkeyMaps[0];       //80
                // var image = monkeysImages[0];
                var monkeyMap = monkeyMaps500[0];    //500
                var image = monkeysImages500[0];

                Page.monkeyAnimation(animation(), monkeyMap, image);
            })
            $(".item2").click(function(){
                console.log("点头");
                // var monkeyMap = monkeyMaps[1];       //80
                // var image = monkeysImages[1];
                var monkeyMap = monkeyMaps500[1];    //500
                var image = monkeysImages500[1];

                Page.monkeyAnimation(animation(), monkeyMap, image);
            })
            $(".item3").click(function(){
                console.log("快速摇头");
                // var monkeyMap = monkeyMaps[2];       //80
                // var image = monkeysImages[2];
                var monkeyMap = monkeyMaps500[2];    //500
                var image = monkeysImages500[2];

                Page.monkeyAnimation(animation(), monkeyMap, image);
            })
            $(".item4").click(function(){
                console.log("说");
                // var monkeyMap = monkeyMaps[3];       //80
                // var image = monkeysImages[3];
                var monkeyMap = monkeyMaps500[3];    //500
                var image = monkeysImages500[3];

                Page.monkeyAnimation(animation(), monkeyMap, image);
            })
            $(".item5").click(function(){
                console.log("摇头");
                // var monkeyMap = monkeyMaps[4];      //80
                // var image = monkeysImages[4];  

                var monkeyMap = monkeyMaps500[4];   //500
                var image = monkeysImages500[4];

                Page.monkeyAnimation(animation(), monkeyMap, image);
            })
        }
    }
    Page.init();

    function $monkey(id) {
        return document.getElementById(id);
    }
});
