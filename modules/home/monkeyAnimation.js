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
        monkeyMode:function(mode){
            var monkeyMap = monkeyLaughMap;
            var image = monkeysImages[index];
            if (mode == "laugh") {
                monkeyMap = monkeyLaughMap;
                image = monkeysImages[index];
            }else if (mode == "nod") {
                monkeyMap = monkeyNodMap;
                image = monkeysImages[index];
            }else if (mode == "quickHead") {
                monkeyMap = monkeyQuickHeadMap;
                image = monkeysImages[index];
            }else if (mode == "say") {
                monkeyMap = monkeySayMap;
                image = monkeysImages[index];
            }else if (mode == "head") {
                monkeyMap = monkeyHeadMap;
                image = monkeysImages[index];
            }
            var animation1 = animation()
            Page.monkeyAnimation(animation1, monkeyMap, image);
        },
        monkeyAnimation:function(animation1, monkeyMap, image){
            animation1.loadImage(monkeysImages).changePosition($monkey("monkey"), monkeyMap, image).then(function () {
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
        },
        monkey:function(){
            Page.monkeyMode(type);
        },
        monkeyModeClickEvent:function(){
            $(".item1").click(function(){
                console.log("笑");
                Page.monkeyAnimation(animation(), monkeyLaughMap, monkeysImages[0]);
            })
            $(".item2").click(function(){
                console.log("点头");
                Page.monkeyAnimation(animation(), monkeyNodMap, monkeysImages[1]);
            })
            $(".item3").click(function(){
                console.log("快速摇头");
                Page.monkeyAnimation(animation(), monkeyQuickHeadMap, monkeysImages[2]);
            })
            $(".item4").click(function(){
                console.log("说");
                Page.monkeyAnimation(animation(), monkeySayMap, monkeysImages[3]);
            })
            $(".item5").click(function(){
                console.log("摇头");
                Page.monkeyAnimation(animation(), monkeyHeadMap, monkeysImages[4]);
            })
        }
    }
    Page.init();

    function $monkey(id) {
        return document.getElementById(id);
    }
});
