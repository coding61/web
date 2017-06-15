function setFont(){
	// console.log(window.innerWidth, window.innerHeight);

	var html = document.getElementsByTagName("html")[0];
	var body = document.getElementsByTagName("body")[0];
	if (window.innerWidth >= 375 && window.innerWidth < 414) {
		html.style.fontSize = "62.5%";
		// $("html").css({"font-size":"62.5%"});
		body.style.fontSize = "15px";

	}
	if (window.innerWidth > 320 && window.innerWidth < 375) {
		// $("html").css({"font-size":"62.5%"});
		body.style.fontSize = "14px";

	}
	if (window.innerWidth <= 320) {
		html.style.fontSize = "50%";
		// $("html").css({"font-size":"50%"});
		body.style.fontSize = "12px";
	}
	if (window.innerWidth == 414) {
		html.style.fontSize = "75%";
		// $("html").css({"font-size":"75%"});
		body.style.fontSize = "16px";
	}
	if (window.innerWidth > 414) {
		html.style.fontSize = "100%";
		body.style.fontSize = "16px";
	}
}
setFont();
window.addEventListener('resize', setFont);	
	
