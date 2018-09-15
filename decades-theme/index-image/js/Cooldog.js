$(function () {
	//鼠标移入显示左右箭头和关闭按钮
	var timer = '';
	var timer2 = '';
	$('.Cooldog_container').mouseover(function () {
		$('.btn_left').show('1000');
		$('.btn_right').show('1000');
		// $('.btn_close').show('1000');
		clearInterval(timer);
	}).mouseleave(function () {
		$('.btn_left').hide('1000');
		$('.btn_right').hide('1000');
		// $('.btn_close').hide('1000');
		timer = setInterval(btn_right, 4000);
	});

	$('.Cool_container').mouseover(function () {
		$('.btn2_left').show('1000');
		$('.btn2_right').show('1000');
		// $('.btn_close').show('1000');
		clearInterval(timer2);
	}).mouseleave(function () {
		$('.btn2_left').hide('1000');
		$('.btn2_right').hide('1000');
		// $('.btn_close').hide('1000');
		timer2 = setInterval(btn2_right, 4000);
	});
	
	//点击关闭隐藏轮播图
	// $('.btn_close').on('click', function () {
	// 	$('.Cooldog_container').hide('1000');
	// });
	
	// var arr = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
	var arr = ['p1', 'p2', 'p3', 'p4'];
	var arr1 = ['p1', 'p2', 'p3', 'p4'];

	var index = 0;
	var index2 = 0;

	
	//上一张
	$('.btn_left').on('click', function () {
		btn_left();
	});
	$('.btn2_left').on('click', function () {
		btn2_left();
	});
	
	//下一张
	$('.btn_right').on('click', function () {
		btn_right();
	});
	$('.btn2_right').on('click', function () {
		btn2_right();
	});
	//图片自动轮播
	timer = setInterval(btn_right, 3000);
	timer2 = setInterval(btn2_right, 3000);
	
	//点击上一张的封装函数
	function btn_left() {
		// arr.unshift(arr[6]);
		arr.unshift(arr[3]);
		arr.pop();
		$('.Cooldog_content li').each(function (i, e) {
			$(e).removeClass().addClass(arr[i]);
		})
		index--;
		if (index < 0) {
			// index = 6
			index = 3;
		}
		show();
	}
	function btn2_left() {
		// arr.unshift(arr[6]);
		arr1.unshift(arr1[3]);
		arr1.pop();
		$('.Cool_content li').each(function (i, e) {
			$(e).removeClass().addClass(arr1[i]);
		})
		index2--;
		if (index2 < 0) {
			// index = 6
			index2 = 3;
		}
		show2();
	}
	//点击下一张的封装函数
	function btn_right() {
		arr.push(arr[0]);
		arr.shift();
		$('.Cooldog_content li').each(function (i, e) {
			$(e).removeClass().addClass(arr[i]);
		})
		index++;
		if (index > 3) {
			index = 0;
		}
		show();
	}
	function btn2_right() {
		arr1.push(arr1[0]);
		arr1.shift();
		$('.Cool_content li').each(function (i, e) {
			$(e).removeClass().addClass(arr1[i]);
		})
		index2++;
		if (index2 > 3) {
			index2 = 0;
		}
		show2();
	}
	//底部按钮高亮
	function show() {
		$('.test').eq(index).addClass('color').siblings().removeClass('color');
	}
	function show2() {
		$('.test1').eq(index2).addClass('newspaper').siblings().removeClass('newspaper');
	}

 
	// prevent drag imgs
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length - 1; i++) {
	this.onmousedown = function(e) {
		e.preventDefault();
	};
	}
})