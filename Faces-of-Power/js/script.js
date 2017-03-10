window.onload = function(){
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var bar_img = document.getElementsByClassName('bar-imgs')[0];
	var bar_img_divs = bar_img.getElementsByTagName('div');
	bar_img_divs = Array.from(bar_img_divs);
	
	bar_img_divs.forEach(function(a,b,c){
		a.style.left = 80*b + 'px';
	})
	bar_img.style.left = -(3600 - winW)/2 + 'px';

/*-------------nav跳转---------------*/
	(function(){
		var nav = document.getElementById('nav');
		var btns = nav.getElementsByTagName('a');
		btns[0].addEventListener('click',function(){
			location.href = 'https://github.com/ZhongxuYang/';
		});
		btns[1].addEventListener('click',function(){
			location.href = 'https://zhongxuyang.github.io/Faces-of-Power/';
		});
		btns[2].addEventListener('click',function(){
			location.href = 'https://zhongxuyang.github.io/Faces-of-Power/';
		});
	})();

