var imgs = [
	"img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/back.png"
]

//创建游戏对象
var game = {};

game.clickNum = 0;  //按顺序正确点击数
game.startFlag = false; //游戏初始化结束，卡牌翻过背面之后的开始标志
game.timeNum = 0;  //时间数字计数器
game.t_addTime = null; //增加时间计数器

game.playName = null; //玩家名
game.playTime = null; //玩家游戏时间

game.isShowBang = false;

//卡牌对象
game.cards = new Array(5);
game.nums = [0,1,2,3,4]; //卡牌数字对象



//获取页面元素
game.$ = function(id){
	return document.getElementById(id);
}

//游戏元素初始化
game.init = function(){
	game.initTime();
	game.nums = [0,1,2,3,4]
	game.clickNum = 0;
	
	//获取一个乱序的排列
	game.nums.sort(function(){return Math.random() > 0.5 ? 1 : -1});
	for(var i = 0; i < 5; i++){
		game.cards[i] = game.$("card" + (i+1));
		game.showBack(i);
	}
}

//展示卡牌背面
game.showBack = function(index){
	game.cards[index].style.transform = "none";
	game.cards[index].src = imgs[5] //初始化为背景
	
}

//卡牌点击事件
game.clickEvent = function(index){
	if(game.startFlag){
		//获取当前位置数字，如果与这一次需要的数字相同，则翻过卡牌后不翻回去，否则在3秒后翻回去
		game.cards[index].style.transform = "rotateY(360deg)";
		setTimeout("game.showNum("+index+")", 1000)
		var cur_num = game.nums[index]; //获取当前位置卡牌数字
		if(cur_num > game.clickNum){
			setTimeout("game.showBack(" + index + ")", 2000)
		}else if(cur_num == game.clickNum){
			game.clickNum ++;
			game.isVictory();
		}
	}
}

// 展示卡牌数字
game.showNum = function(index){
	game.cards[index].style.transform = "rotateY(360deg)";
	var cur_num = game.nums[index] //获取当前位置卡牌数字
	game.cards[index].src = imgs[cur_num] //使用当前位置卡牌数字图片
	return cur_num;
}

//展示所有卡牌数字
game.showCardNums = function(){
	for(var i = 0; i < 5; i++){
		game.showNum(i);
	}
}

//展示所有卡牌背面
game.showCardBacks = function(){
	for(var i = 0; i < 5; i++){
		game.showBack(i);
	}
}

//判断游戏是否胜利，如果胜利展示胜利页面并重新开始游戏
game.isVictory = function(){
	//当点击数超过牌数，则游戏胜利
	if(game.clickNum > 4){
		setTimeout("game.showVictory()", 2000);
	}
}

//展示游戏胜利界面
game.showVictory = function(){
	if(game.t_addTime != null){
		clearInterval(game.t_addTime);
		game.playTime = game.timeNum;
	}
	alert("You Victory!!!");
	game.setBang();
	game.showBang();
	if(confirm("Restart")){
		game.start()
	}
}

game.initTime = function(){
	game.timeNum = 0;
	game.time = game.$("time");
	time.innerText = "用时：0s"
}

game.addTime = function(){
	time.innerText = "用时：" + (++game.timeNum) + "s"
}

game.startPlay = function(){
	game.showCardBacks() //翻转卡牌
	game.startFlag = true; //更改开始变量
	game.t_addTime = setInterval("game.addTime()", 1000); //开始计数
}

game.setBang = function(){
	game.playName = prompt("请输入你的名字：", "小四瓣");
	var no = getCookie("No");
	if(no == null || isNaN(no)){
		setCookie("No", 1);
	}else{
		setCookie("No", parseInt(no)+1); //设置序号
	}
	
	setCookie("name"+no, game.playName)
	setCookie("time"+no, game.playTime)
	setCookie("level"+no, game.getTimeLevel(game.playTime))
}

var li_name = null;

game.showBang = function(){
	var no = getCookie("No");
	if(li_name == null){
		li_name = new Array(no);
	}
	if(no > 0){
		var showArea = game.$("bang");
		if(!game.isShowBang){ //如果没有显示排行榜，则添加显示
			for(var i = 0; i < no; i++){
				game.addOneScore(showArea, i);
			}
			game.isShowBang = true;
		}else if(li_name.length < no){ //如果已经显示过排行榜，则追加一行
			game.addOneScore(showArea, no-1);
		}
		
	}
}

game.addOneScore = function(v_parent, index){
	var name = getCookie("name"+index);
	var time = getCookie("time"+index);
	var level = getCookie("level"+index);
				
	li_name[index] = document.createElement("li");
	li_name[index].innerText = name + "\t" + time + "\t" + level + "\n";
				
	v_parent.appendChild(li_name[index]);
}

game.getTimeLevel = function(time){
	if(time > 10){
		return "F"
	}else if(time > 7){
		return "E"
	}else if(time > 5){
		return "D"
	}else if(time > 4){
		return "C"
	}else if (time > 3){
		return "B"
	}else {
		return "A"
	}
}

//游戏开始
game.start = function(){
	game.init(); //初始化资源
	game.showBang();
	game.showCardNums(); //展示本次随机卡牌数
	setTimeout("game.startPlay()", 2000); // 2秒之后游戏正式开始
}

