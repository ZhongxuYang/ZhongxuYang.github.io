window.onload = function(){
	var right = document.getElementById('right');
	var top = right.getElementsByClassName('top')[0];
	var topBtns = top.getElementsByTagName('li');
	var box = right.getElementsByClassName('box')[0];
	var fileBox = box.getElementsByClassName('file')[0];//图片模式下的ul
	var num = box.querySelector('p span i');//已全部加载，共n个文件
	var rename = right.getElementsByClassName('rename')[0];
	var reBtns = rename.getElementsByTagName('input');
	var files = fileBox.getElementsByTagName('li');
	var boxTop = box.getElementsByClassName('box-top')[0];
	var chooseAll = boxTop.getElementsByTagName('span')[0];
	var boxNav = document.getElementById('box_nav');
	var crumbsNav = boxNav.getElementsByTagName('b')[0];
	var rightBtn = document.getElementById('rightBtn');
	var rightBtnLis = rightBtn.getElementsByTagName('li');
	
	var path = [];//当前
	var hash = 0;
	var dataLen = data.length;//为了之后给每个新生成的文件夹命名id，在创建文件夹的时候会++。
	var dblli = null;
//	创建文件夹函数
	function found(name){
		var li = document.createElement('li');
		var div = document.createElement('div');
		var eI = document.createElement('i');
		var p = document.createElement('p');
		li.appendChild(div);
		li.appendChild(p);
		div.appendChild(eI);
		p.innerHTML = name;
		fileBox.appendChild(li);
		//文件夹移入
		li.onmouseover = function(){
			div.style.visibility = 'visible';
		}
		//文件夹移出
		li.onmouseout = function(){
			if( div.className == '' ){
				div.style.visibility = '';
			}
		}
		//单个文件夹的选中
		eI.onclick = function(){
			if( div.className ){
				div.className = '';
			}else{
				div.className = 'checked';
			}
			ifAll();
		}
		//文件夹双击
		li.ondblclick = function(){
			dblli = li;
			//把点击的文件夹对应的数据，放到path里。
			for(var i=0;i<data.length;i++){
				if(dblli.Id == data[i].id){
					path.push(data[i]);
				}
			}
			//把进入文件夹的id号，通过hash值，写到地址栏。
			location.hash = 't=' + this.Id;
			
		}
		//文件夹右键
		li.oncontextmenu = function(ev){
			ev.preventDefault();
			var l = ev.clientX;
			var t = ev.clientY;
			rightBtn.style.left = l + 'px';
			rightBtn.style.top = t + 'px';
			rightBtn.style.display = 'block';
			this.children[0].className = 'checked';
			//右键打开
			rightBtnLis[0].onclick = function(){
				dblli = ev.target.parentNode;
				//把点击的文件夹对应的数据，放到path里。
				for(var i=0;i<data.length;i++){
					if(dblli.Id == data[i].id){
						path.push(data[i]);
					}
				}
				location.hash = 't='+ev.target.parentNode.Id;
			}
			//右键重命名
			rightBtnLis[1].onclick = fnRename;
			//右键删除
			rightBtnLis[2].onclick = fnDel;
		}
	}
	document.onclick = function(){
		rightBtn.style.display = '';
	}
	
//	当hash值改变自动渲染页面
	window.onhashchange = function(){
		clear();
		var b = boxNav.getElementsByTagName('b')[0];
		var all = boxNav.querySelector('a');
		
		//面包屑导航中的返回上一级和全部文件夹
		all.style.display = 'none';
		b.style.display = '';
		b.innerHTML = '<a href="javascript:;">返回上一级</a><em>丨</em><a href="javascript:;">全部文件</a>';
		var as = b.getElementsByTagName('a');//获取到‘返回上一级’和‘全部文件’
		var n = 0;
		var hash = location.hash.split('=')[1];
		for(var i=0;i<data.length;i++){
			if( data[i].pId == hash ){
				n++;
				found(data[i].name);
				files[n].Id = data[i].id;
			}
		}
		num.innerHTML = n;
		//返回上一级
		as[0].onclick = function(){
			//改变hash值
			if(path[path.length-1]){
				location.hash = 't=' + path[path.length-1].pId;
			}
			//把path中的最后一位删除
			path.splice(path.length-1,1);
			console.log(path)
		}
		//全部文件
		as[1].onclick = function(){
			location.hash = 't=0';
			all.style.display = '';
			b.style.display = 'none';
			path = [];
			var n = 0;
			init();
		}
		
		//如果返回到根目录清除hash值
		if( hash == 0 ){
			path = [];
			all.style.display = '';
			b.style.display = 'none';
		}
		miniNav();
	}
//生成面包屑导航
	function miniNav(){
		var b = boxNav.getElementsByTagName('b')[0];
		var as = b.getElementsByTagName('a');
		var ems = b.getElementsByTagName('em');
		for(var i=2;i<as.length;i++){
			b.removeChild(as[2]);
			b.removeChild(ems[1]);
			i--;
		}
		for(var i=0;i<path.length;i++){
			var a  = document.createElement('a');
			var em = document.createElement('em');
			a.href = 'javascript:;';
			a.innerHTML = path[i].name;
			a.pId = path[i].id;
			a.index = i;
			em.innerHTML = '>';
			b.appendChild(em);
			b.appendChild(a);
			a.onclick = function(){
				location.hash = 't=' + this.pId;
				path.splice(this.index+1,path.length-this.index-1);
			}
		}
	}
//清空文件夹
	function clear(){
		var lis = fileBox.getElementsByTagName('li');
		var len = lis.length;
		if( len>=2 ){
			for(var i=1;i<len;i++){
				fileBox.removeChild(lis[1]);
			}
		}
		
	}

//	文件夹初始化
	function init(){
		var n = 0;
		for(var i=0;i<data.length;i++){
			if( data[i].pId == 0 ){
				n++;
				found(data[i].name);
				num.innerHTML = n;
				files[n].Id = data[i].id;
			}
		}
	}
	init();
//	文件夹新建
	topBtns[1].onOff = true;
	topBtns[1].onclick = function(){
		if( this.onOff ){
			this.onOff = !this.onOff;
			found();
			var lis = fileBox.getElementsByTagName('li');
			fileBox.insertBefore(lis[lis.length-1],lis[1]);
			files[0].style.top = '';
			files[0].style.left = '';
			rename.style.display = 'block';
			var n = 0;
			for(var i=2;i<files.length;i++){
				for(var j=2;j<files.length;j++){
					if( files[j].children[1].innerHTML == '新建文件夹' + n ){
						n++;
					}
				}
			}
			console.log(files)
			reBtns[0].value = '新建文件夹'+n;
			reBtns[0].select();
		}
	}
//	文件夹命名确定键
	reBtns[1].onclick = function(){
		var val = reBtns[0].value;
		if(location.hash){
			var hash = location.hash.split('=')[1];
		}else{
			var hash = 0;
		}
		for(var i=1;i<files.length;i++){//判断是否有命名重复
			if( files[i].children[0].className != 'checked' ){
				var p = files[i].getElementsByTagName('p')[0];
			}
			if( p ){
				if( val == p.innerHTML ){
					alert('此目录下已存在同名文件，请重新命名！');
					return;
				}
			}
		}
		if( topBtns[1].onOff == false ){
			topBtns[1].onOff = true;
			dataLen++;
			var firstLi = fileBox.getElementsByTagName('li')[1];
			var firstP = firstLi.getElementsByTagName('p')[0];
			if( location.hash ){
				var hash = location.hash.split('=')[1];
			}else{
				var hash = 0;
			}
			data.unshift({'id':dataLen,'name':val,'pId':hash});
			firstLi.Id = data[0].id;
			firstP.innerHTML = val;
			rename.style.display = '';
			num.innerHTML = data.length;
		}else{
			for(var i=1;i<files.length;i++){//判断第几个是重命名的li
				if( files[i].children[0].className == 'checked' ){
					var m = files[i].Id;
					for(var j=0;j<data.length;j++){
						if(data[j].id == m){
							data[j].name = val;//把重命名后的val替换数组里的name。
						}
					}
					var id = i;
				}
			}
			var p = files[id].getElementsByTagName('p')[0];
			p.innerHTML = val;
			rename.style.display = '';
		}
		for(var i=1;i<files.length;i++){
			files[i].children[0].style.visibility = '';
			files[i].children[0].className = '';
		}
	}
//	文件夹命名取消键
	reBtns[2].onclick = function(){
		if( topBtns[1].onOff == false ){
			topBtns[1].onOff = true;
			var firstLi = fileBox.getElementsByTagName('li')[1];
			fileBox.removeChild(firstLi);
		}
		rename.style.display = '';
		for(var i=1;i<files.length;i++){
			files[i].children[0].style.visibility = '';
			files[i].children[0].className = '';
		}
	}
//	文件夹删除
	topBtns[2].onclick = fnDel;
	function fnDel(){
		for(var i=files.length-1;i>=0;i--){
			if( files[i].children[0].className == 'checked' ){
				var n = files[i].Id;
				for(var j=0;j<data.length;j++){
					if(data[j].id == n){//删自己
						data.splice(j,1);
					}
				}
				fileBox.removeChild(files[i]);	
				num.innerHTML = files.length-1;
			}
		}
		recursionDel(n);//删当前目录下的所有子文件
		if( files.length == 1 ){
			chooseAll.className = '';
			chooseAll.onOff = true;
		}
	}
//	删除的递归
	var arr = [];//用来放要删除的数据。
	function recursionDel(n){//n是传进来的参数，值是被选中的要删除的文件夹的id。
		for(var i=0;i<data.length;i++){
			if( data[i].pId == n ){//先for循环找到第一子级下所有要删除的文件夹。
				arr.push(data[i]);//删除之前先把要删除的数据放在数组arr中，以便之后递归数组时，再逐个删除各个下边的子文件夹。
				data.splice(i,1);//删除子文件夹数据。
				i--;
			}
		}
		if( arr.length == 0 ){//当arr数组中没有数值就代表没有要删除的子文件夹了，就可以直接return出去。
			return;
		}else{
			var Id = arr[0].id;//记录被删除子文件夹的id。再逐个执行以上代码
			arr.shift();
			return recursionDel(Id);
		}
	}
//	文件夹重命名
	topBtns[3].onclick = fnRename;
	function fnRename(){
		var n = 0;
		for(var i=1;i<files.length;i++){//判断要重命名的个数
			if( files[i].children[0].className == 'checked' ){
				var li = files[i].children[0];
				n++;
			}
		}
		if( n == 1 ){//只有被选中的个数为1时，才可以进行重命名操作。
			var t = li.offsetTop;
			var l = li.offsetLeft;
			files[0].style.top = t + 98 + 'px';
			files[0].style.left = l - 70 + 'px';
			rename.style.display = 'block';
			reBtns[0].value = li.parentNode.children[1].innerHTML;
			reBtns[0].select();
		}
	}
//	全选
	chooseAll.onOff = true;
	chooseAll.onclick = function(){
		if(this.onOff){
			this.className = 'checked';
			for(var i=1;i<files.length;i++){
				files[i].children[0].style.visibility = 'visible';
				files[i].children[0].className = 'checked';
			}
		}else{
			this.className = '';
			for(var i=1;i<files.length;i++){
				files[i].children[0].style.visibility = '';
				files[i].children[0].className = '';
			}
		}
		this.onOff = !this.onOff;
	}
//	判断是否全选
	function ifAll(){
		var n = 0;
		for(var i=1;i<files.length;i++){
			if( files[i].children[0].className == 'checked' ){
				n++;
			}
		}
		if( n == files.length-1 && n  ){
			chooseAll.className = 'checked';
		}else{
			chooseAll.className = '';
		}
	}
//	文件夹浮动转定位
//	function FtoP(){
//		for(var i=1;i<files.length;i++){
//			files[i].style.left = files[i].offsetLeft + 'px';
//			files[i].style.top = files[i].offsetTop + 'px';
//		}
//		for(var i=1;i<files.length;i++){
//			files[i].style.position = 'absolute';
//			files[i].style.margin = 0;
//		}
//	};
//	FtoP();
//	拉抻多选
	var pos = {};//记录按下时鼠标位置
	var originalPos = [];//记录要拖拽的文件夹原始坐标
	var sel = document.getElementById('sel');
	fileBox.onmousedown = function(ev){
		ev.preventDefault();
		pos.l = ev.clientX;
		pos.t = ev.clientY;
		if( ev.target == fileBox ){//触发事件的元素是ul->拖拽出选框
			pos.onOff = true;
		}else{//触发的事件元素是li->移动该文件夹
			pos.clone = true;
			pos.move = true;
			pos.eT = ev.target.parentNode;
		}
	}
//	克隆文件夹
	function cloneFile(e,ID){
		var l = e.offsetLeft;
		var t = e.offsetTop;
		var li = e.cloneNode(true);
		li.clone = true;
		li.Id = ID;
		li.style.cssText = 'opacity:0.6;margin:0;position:absolute;z-index:100;top:'+t+'px;left:'+l+'px;';
		fileBox.appendChild(li);
		originalPos.push( {l:e.offsetLeft,t:e.offsetTop,e:li} );
	}
	fileBox.onmousemove = function(ev){
		//拖拽选框
		if( pos.onOff ){
			var l = ev.clientX>pos.l?pos.l:ev.clientX;
			var t = ev.clientY>pos.t?pos.t:ev.clientY;
			sel.style.left = l + 'px';
			sel.style.top = t + 'px';
			sel.style.display = 'block';
			sel.style.width = Math.abs(ev.clientX - pos.l) + 'px';
			sel.style.height = Math.abs(ev.clientY - pos.t) + 'px';
			for(var i=1;i<files.length;i++){
				if( collide( sel,files[i] ) ){
					files[i].children[0].style.visibility = 'visible';
					files[i].children[0].className = 'checked';
				}else{
					files[i].children[0].style.visibility = '';
					files[i].children[0].className = '';
				}
			}
			ifAll();
		}
		//文件夹拖动
		if( pos.move ){
			//克隆
			if( pos.clone ){
				pos.clone = false;
				var Len = files.length;
				for(var i=1;i<Len;i++){
					if( files[i].children[0].className == 'checked' ){
						cloneFile(files[i],files[i].Id);
					}
				}
				if( originalPos.length == 0 ){
					cloneFile(ev.target.parentNode,ev.target.parentNode.Id);
				}
			}
			//鼠标移动了多少
			var disL = ev.clientX - pos.l; 
			var disT = ev.clientY - pos.t;
			for(var j=0;j<originalPos.length;j++){
				for(var i=1;i<files.length;i++){
					if( files[i] === originalPos[j].e ){
						files[i].style.border = '1px dashed gray';
						files[i].style.backgroundColor = '#e1e1e1';
						files[i].style.left = originalPos[j].l + disL < 0 ? 0 : originalPos[j].l + disL + 'px';
						files[i].style.top = originalPos[j].t + disT < 0 ? 0 :originalPos[j].t + disT + 'px';
					}
					if( pos.eT.Id == originalPos[j].e.Id ){
						var eT = originalPos[j].e;
					}
				}
			}
			for(var i=1;i<files.length;i++){//拖拽时鼠标所在的文件夹与哪个文件夹碰撞的检测
				for(var j=files.length-originalPos.length;j<files.length;j++){
					if( collide( eT,files[i] ) && files[i] != pos.eT && files[i].Id != files[j].Id  ){
						files[i].children[0].style.visibility = 'visible';
						files[i].children[0].className = 'checked';
					}else{
						files[i].children[0].style.visibility = '';
						files[i].children[0].className = '';
					}
				}
			}
		}
	}
	document.onmouseup = function(){
		var arrId = [];//存放移动li的id，以便查到数组里对应的数据，进行修改父级
		if( pos.move ){
			pos.move = false;
			for(var i=1;i<files.length;i++){
				if(files[i].clone){
					arrId.push(files[i].Id);
					fileBox.removeChild(files[i]);
					i--;
				}
			}
			moveFile(arrId);
			originalPos = [];
		}
		pos.onOff = false;
		pos = {};
		sel.style.cssText = '';
	}
	//拖动文件夹时改变路径和data中的pId
	function moveFile( arr ){
		var arrId = arr;
		var num = 0;//一共有多少个被选中
		for(var i=1;i<files.length;i++){
			if( files[i].children[0].className == 'checked' ){
				num++;
			}
		}
		for(var i=1;i<files.length;i++){
			if( files[i].children[0].className == 'checked' && num == 1 ){
				var Id = files[i].Id;
				for(var k=1;k<files.length;k++){
					for(var j=0;j<arrId.length;j++){
						if( files[k].Id == arrId[j] ){
							fileBox.removeChild(files[k]);
							k--;
						}
					}
				}
				for(var k=0;k<data.length;k++){
					for(var j=0;j<arrId.length;j++){
						if(data[k].id == arrId[j]){
							data[k].pId = Id;
						}
					}
				}
			}
		}
	}
//	碰撞检测
	function collide( obj1,obj2 ){
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();
		if( pos1.right<pos2.left || pos1.bottom<pos2.top || pos1.left>pos2.right || pos1.top>pos2.bottom ){
			return false;
		}else{
			return true;
		}
	}
}

	