define(function(require, exports, module) {
	var Common = require('common/common.js');
	var bonus = Common.getQueryString("bonus");
	var diamond = Common.getQueryString("diamond");
	var name = decodeURI(Common.getQueryString("name"));
	var head = decodeURI(Common.getQueryString("head"));

    var Page = {
        init:function(){
			$('.bonus').html(bonus);
			$('.diamond').html(diamond);
			$('.name').html(name);
            $('.head').attr('src',head);
        },
    };
    Page.init();
});
