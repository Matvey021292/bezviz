//VARS
var countGame=0,canvas,ctx,cw,ch,grid={},now, line={}, cellw, quotes, timer={}, bt_grn, bt_red, vid_grad, tickspd, qbtns;

function init() {
	canvas = document.getElementById('cgraph');
	ctx = canvas.getContext('2d');
	canvas2 = document.getElementById('cgraph2');
	ctx2 = canvas2.getContext('2d');
	bt_grn = document.getElementsByClassName('btn__green')[0];
	bt_red =  document.getElementsByClassName('btn__red')[0];
	vid_grad = document.getElementsByClassName('vidget__gradient')[0];
	( jQuery )("a.close-result").on("click",function(){
		( jQuery )(".results-block").fadeOut(400);
		bt_grn.parentNode.style.display="block";	
		vid_grad.style.display="block";	
		});
	qbtns = [];
	qbtns[0]=document.getElementsByClassName('vidget__list')[0].childNodes[1];
	qbtns[1]=document.getElementsByClassName('vidget__list')[0].childNodes[3];
	qbtns[2]=document.getElementsByClassName('vidget__list')[0].childNodes[5];
	qbtns[3]=document.getElementsByClassName('vidget__list')[0].childNodes[7];
	window.addEventListener('resize', onresize);
	bt_grn.onclick = function() {btn_click(0, countGame)};
	bt_red.onclick = function() {btn_click(1, countGame)};	
	qbtns[0].onclick = function(){set_instrument(0)};
	qbtns[1].onclick = function(){set_instrument(1)};
	qbtns[2].onclick = function(){set_instrument(2)};
	qbtns[3].onclick = function(){set_instrument(3)};
	tickspd=0.5;
	line.points=[0];
	line.last=line.points[0];
	line.t=1;  //timer for chart line
	line.val=1;	//random multiplyer
	line.mx=1;  //last point anim timer
	line.max=40/tickspd; //points limiter
	line.fix=999; // Y-pos of user fixed line
	line.fix_anim=0;
	line.dr=0;   //radnom displacement
	line.color=[220,220,220];
	line.pnt_color=[20,220,20];
	line.fix_color=[160,0,0];
	quotes = [1.06535,1224.50,128.82,52.23];
	quotes.current = 0;
	grid.ccount_w=8;
	grid.ccount_h=4;
	grid.dx=0;
	
	now = Date.now();
	timer.t=15;
	timer.visible=false;
	line.now = Date.now();
	onresize();
	start();
}

function start() {
	
	line.anim=TweenLite.from(line,tickspd,{t:0,onComplete:function(){
		line.push_point(line.val);
		line.anim.restart();
		
	}});
	drawGrid(ctx);
	loop();
	
}

function set_instrument(i) {
	if(line.fix==999){
		now = Date.now();
		quotes.current=i;
		line.points=[(Math.random()*ch-ch/2)*0.8];

		drawGrid(ctx);
	}
}

function TweenLiteGo(side) {
	TweenLite.to(line,4,{val:1,dr:side,delay:8});
}


function completeGame (state){
	TweenLite.to(timer,15,{t:0,ease:Power0.easeIn, onComplete:function(){

		if(state === 'win'){
			( jQuery )("#vidget_results_1").fadeIn(400);
		}else{
			( jQuery )("#vidget_results_2").fadeIn(400);
		}	
		restart();
		
	}});
}

function checkRandom(chance, num, randNum) {

	if (num==0){
		if (randNum < chance){
			TweenLiteGo(-15);
			completeGame('win');
		}else{
			TweenLiteGo(15);
			completeGame('lose');
		}
	}else{
		if (randNum < chance){
			TweenLiteGo(15);
			completeGame('win');
		}else{
			TweenLiteGo(-15);
			completeGame('lose');
		}
	}
	
}

function btn_click (num, count) {


	line.val=1;
	var intervalToEnd;
	var rand = Math.random() * 2;
	var up = TweenLite.to(line,4,{val:1,dr:-15,delay:8});
	var down = TweenLite.to(line,4,{val:1,dr:15,delay:8});

	if (num==0) {
		line.dr = 5;
	}else {
		line.dr = -5;
	}

	if(count === 0){
		if (num==0){
			TweenLiteGo(-15);
		}else{
			TweenLiteGo(15);
		}
		completeGame('win');
	}else if(count === 1){
		checkRandom(1.5, num, rand);
	}else{
		checkRandom(1, num, rand);
	}


	( jQuery )(".vidget__gradient, .vidget__graph-buttons").fadeOut(400);

	line.max=300;
	line.fix = line.last;
	timer.x=(line.points.length-2); 
	timer.visible=true;
	
	TweenLite.to(line,1,{fix_anim:1});

	countGame++;
	intervalToEnd = setInterval(function () {
		drawGrid(ctx);
	}, 1000)
	setTimeout(function () {
		clearInterval(intervalToEnd);
	}, 15000)
	
	
}

function restart() {
	line.points=[0];
	line.last=line.points[0];
	line.t=1;  //timer for chart line
	line.val=1;	//random multiplyer
	line.mx=1;  //last point anim timer
	line.max=40/tickspd; //points limiter
	line.fix=999; // Y-pos of user fixed line
	line.fix_anim=0;
	line.dr=0;   //radnom displacement
	grid.dx=0;
	timer.t=15;
	timer.visible=false;
	drawGrid(ctx);
}

function onresize() {
		cw=canvas.offsetWidth;//canvas.width;
		ch=canvas.offsetHeight;//canvas.height;
		canvas.width=cw;
		canvas.height=ch;
		canvas2.width=cw;
		canvas2.height=ch;
		cellw=Math.floor(cw/(grid.ccount_w+0.5));
		drawGrid(ctx);
	};
	
function drawLine(ctx) {
	ctx.clearRect(0,0,cw,ch);
	ctx.save();
	var sx = 0.7*cellw;
	ctx.translate(Math.floor(sx),cellw*2);
	ctx.strokeStyle="rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",1)";
	//main graph
	ctx.beginPath();  
	for (var i = 0;i<line.points.length-1;i++) {
		
		if (i*cellw/10*tickspd-grid.dx>=0) {			
			ctx.lineTo(i*cellw/10*tickspd-grid.dx,line.points[i]);				
		}
	}
	
	//last line
	var x,y;
	x=(i-1+line.mx)*cellw/10*tickspd-grid.dx;
	y=line.last;
	ctx.lineTo(x,y);
	//i--;
	
	//graph gradient
	ctx.stroke();
	
		ctx.lineTo(x,ch/2);
		ctx.lineTo(0,ch/2);
		ctx.closePath();
		
		var grd = ctx.createLinearGradient(0,-ch/2,0,ch/2);
		grd.addColorStop(0,"rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",0.2)");
		grd.addColorStop(1,"rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",0)");
		
		ctx.fillStyle=grd;
		ctx.fill();
	
	//	last point 
		ctx.beginPath();
		ctx.arc(x,y,10,0,2*Math.PI);		
		var grd2 = ctx.createRadialGradient(x,y,2,x,y,10);
		grd2.addColorStop(0,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",0)");
		ctx.fillStyle=grd2;
		
	ctx.fill();
	
	//draw line with current quote
	
	
	ctx.beginPath();
	
	ctx.lineTo(0,y);
	ctx.lineTo(-sx*0.1,y-ch*0.03);
	ctx.lineTo(-sx+1,y-ch*0.03);
	ctx.lineTo(-sx+1,y+ch*0.03);
	ctx.lineTo(-sx*0.1,y+ch*0.03);
	ctx.lineTo(0,y);
	ctx.lineTo(cw,y);
	
	var grd = ctx.createLinearGradient(-sx,0,cw,0);
	grd.addColorStop(0,"rgba(200,200,200,1)");
	grd.addColorStop(0.077,"rgba(200,200,200,1)");
	grd.addColorStop(0.077,"rgba(250,250,250,0.4)");
	grd.addColorStop(0.6,"rgba(250,250,250,0.4)");
	grd.addColorStop(0.8,"rgba(250,250,250,0)");
	grd.addColorStop(1,"rgba(250,250,250,0)");
	ctx.strokeStyle=grd;
	
	ctx.fillStyle = "rgba(30,30,30,1)";
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle = "rgba(255,255,255,1)";
	//TODO rounding
	var txt = (quotes[quotes.current]*(1-0.000016*y)).toString().slice(0,7);

	ctx.font="7pt Arial";
	ctx.textBaseline="middle"; 
	ctx.textAlign="center"; 
	ctx.fillText(txt,-sx/2,y);
	
	//line fix
	if (line.fix!=999){
		
		var tx1 = timer.x*tickspd*cellw/10;
		var tx2 = (timer.x*tickspd+15)*cellw/10-tx1;
		ctx.moveTo(tx1,line.fix);
		ctx.beginPath();
		

		var n = 20;
		for (var i=0;i<n;i+=2){
			ctx.moveTo(tx1+tx2*i/n,line.fix);
			ctx.lineTo(tx1+tx2*(i+1)/n,line.fix);
		}

		var grd = ctx.createLinearGradient(tx1,0,tx1+tx2,0);
			grd.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
			grd.addColorStop(line.fix_anim,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
			grd.addColorStop(line.fix_anim,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
			grd.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		
		ctx.strokeStyle=grd;				
		ctx.stroke();
		
		//point1
		ctx.beginPath();
		ctx.arc(tx1,line.fix,8,0,2*Math.PI);
		
		var grd2 = ctx.createRadialGradient(timer.x*tickspd*cellw/10,line.fix,2,timer.x*tickspd*cellw/10,line.fix,8);
		grd2.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		ctx.fillStyle=grd2;
		
		ctx.fill();
		
		//point2
		ctx.beginPath();
		var r2=line.fix_anim<1?0:1;
		ctx.arc(tx1+tx2,line.fix,8*r2,0,2*Math.PI);
		
		var grd2 = ctx.createRadialGradient(tx1+tx2,line.fix,2,tx1+tx2,line.fix,8);
		grd2.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		ctx.fillStyle=grd2;
		
		ctx.fill();
	}
	
	ctx.restore();
	
}	

function drawGrid(ctx){
	ctx2.clearRect(0,0,cw,ch);
	ctx2.save();
	
	ctx2.fillStyle="rgba(40,40,40,0.2)";
	ctx2.strokeStyle="rgba(100,100,100,0.5)";
	ctx2.fillStyle="rgba(100,100,100,1)";
	ctx2.font="7.5pt Arial";
	ctx2.translate(Math.floor(0.7*cellw),0);
	//big grid	
	
	ctx2.beginPath();
	for (var i=0;i<grid.ccount_w+4;i++) {	//vert lines
		if (Math.floor(i*cellw-grid.dx)>=0) {
			ctx2.moveTo(Math.floor(i*cellw-grid.dx)+0.5,0);
			ctx2.lineTo(Math.floor(i*cellw-grid.dx)+0.5,(grid.ccount_h+0.15)*cellw);
			
			if (i%3==0) {
				var tmp_now= new Date();
				tmp_now.setSeconds(tmp_now.getSeconds()+30*i/3);
				ctx2.fillText(tmp_now.toLocaleTimeString('en-GB'),Math.floor(i*cellw-grid.dx)+cellw*.05,ch*0.99);
				}
		}
	}
	ctx2.moveTo(0,0);
	ctx2.font="7.5pt Arial";
	ctx2.textBaseline="top"; 
	for (var i=0;i<grid.ccount_h+1;i++) {	//horz lines
	ctx2.moveTo(-cellw*0.15,Math.floor(i*cellw)+0.5);
	ctx2.lineTo(cw,Math.floor(i*cellw)+0.5);
	//TODO rounding to 6 digits
	var txt = (quotes[quotes.current]*(1+0.001*(2-i))).toString().slice(0,5);
	ctx2.fillText(txt,-cellw*0.7,Math.floor(i*cellw));
	}
	ctx2.closePath();
	
	var grd = ctx2.createLinearGradient(0,0,cw,0);
	grd.addColorStop(0,"rgba(100,100,100,0.5)");
	grd.addColorStop(0.6,"rgba(100,100,100,0.5)");
	grd.addColorStop(0.75,"rgba(100,100,100,0)");
	grd.addColorStop(1,"rgba(100,100,100,0)");
	ctx2.strokeStyle=grd;
	//ctx.strokeStyle="rgba(100,100,100,0.5)";
	ctx2.stroke();
	
	//small grid
	ctx2.moveTo(0,0);
	ctx2.beginPath();
	for (var i=0;i<(grid.ccount_w+3)*4+1;i++) {	//vert lines
		if (Math.floor(i*cellw/4-grid.dx)>=0) {
			ctx.moveTo(Math.floor(i*cellw/4-grid.dx)+0.5,0);
			ctx.lineTo(Math.floor(i*cellw/4-grid.dx)+0.5,grid.ccount_h*cellw);
		}
	}
	ctx2.moveTo(0,0);
	for (var i=0;i<grid.ccount_h*4+1;i++) {	//horz lines
	ctx2.moveTo(0,Math.floor(i*cellw/4)+0.5);
	ctx2.lineTo(cw,Math.floor(i*cellw/4)+0.5);
	}
	ctx2.closePath();
	
	var grd = ctx2.createLinearGradient(0,0,cw,0);
	grd.addColorStop(0,"rgba(100,100,100,0.1)");
	grd.addColorStop(0.6,"rgba(100,100,100,0.1)");
	grd.addColorStop(0.85,"rgba(100,100,100,0)");
	grd.addColorStop(1,"rgba(100,100,100,0)");
	ctx2.strokeStyle=grd;
	ctx2.stroke();
	
	//TIMER
	if (timer.visible) {
	ctx2.beginPath();
	
	var tx = Math.round((timer.x*tickspd+15)*cellw/10-grid.dx)+0.5;
	ctx2.moveTo(tx,0);
	var n = 40;
	for (var i=0;i<n;i+=2){
			ctx2.moveTo(tx,(grid.ccount_h)*cellw*i/n);
			ctx2.lineTo(tx,(grid.ccount_h)*cellw*(i+1)/n);
		}
	
	ctx2.strokeStyle="rgba(255,255,255,1)";
	ctx2.stroke();
	
	var t = timer.t>=9?Math.ceil(timer.t):"0"+Math.ceil(timer.t);	
	ctx2.font="10pt HelveticaNeueCyr";
	ctx2.textBaseline="top"; 
	ctx2.textAlign="center"; 
	ctx2.fillStyle = "rgba(255,255,255,1)";
	ctx2.fillText("ДО ЗАКРЫТИЯ",cw*0.7,5);
	ctx2.fillText("СДЕЛКИ:",cw*0.7,20);
	ctx2.font="Bold 15pt HelveticaNeueCyr";
	if (timer.t<=5) ctx2.fillStyle = "rgba(200,0,0,1)"; 
		else ctx2.fillStyle = "rgba(255,255,255,1)";
	
	ctx2.fillText("00:"+t,cw*0.7,35);
	
	//timer start line
	ctx2.beginPath();
	tx = Math.round((timer.x*tickspd)*cellw/10-grid.dx)+0.5;
	ctx2.moveTo(tx,0);
	var n = 40;
	for (var i=0;i<n;i+=2){
			ctx.moveTo(tx,(grid.ccount_h)*cellw*i/n);
			ctx.lineTo(tx,(grid.ccount_h)*cellw*(i+1)/n);
		}
	ctx2.strokeStyle="rgba(255,255,255,1)";
	ctx2.stroke();
	}
	
	
	
	ctx2.restore();
}


function loop() {
	
	drawLine(ctx);

	window.requestAnimFrame(loop);
}

line.push_point = function (val) {

	if (line.points.length>=line.max && grid.dx==0) {

		
		grid.anim = TweenLite.to(grid,1,{dx:cw*0.35,ease:Power0.easeInOut,onComplete:function(){
			grid.dx=0;
			line.points.splice(0,30/tickspd);
			drawGrid(ctx);
		}});


		
	}
	if (!val) val=1;
	
	var p = line.points[line.points.length-1]+(Math.random()*50-25)*val+line.dr;

	while ((p>line.fix+80 || p<line.fix-80)&&line.dr!=0) {
		p= line.points[line.points.length-1];
	}

	line.last = p;
	if (Math.abs(p)<ch*0.4)	{		
		TweenLite.from(line,tickspd,{mx:0,last:line.points[line.points.length-1],ease:Power1.easeIn});
		line.points.push(p);

	}else {
		line.push_point(val);

	};

}

window.requestAnimFrame = function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
		window.setTimeout(a, 1E3/30)
	}
}();
( jQuery )(document).ready(function(){

	(jQuery)(".vidget__list li a").on("click", function (t) {

		t.preventDefault();
		var n = (jQuery)(this).parent("li").addClass("active").siblings().removeClass("active"),
		n = (jQuery)(this).parent("li").index();
		(jQuery)(".vidget__graph-img").removeClass("active").eq(n).addClass("active")

	});
	(jQuery)(".js-input-user").on("blur", function () {
		var number = +((jQuery)(this).val().replace(/,/, '.'));
		var t = number + (number * ((jQuery)(".js-input-percent").val() / 100));
		if (isNaN(t)) {
			t = "Enter a number", (jQuery)(".js-input-profit").val(t), (jQuery)(".alertMessage__price").text(t), ($)(".js-input-profit").css('font-size', '15px')
		}
		else if(Math.sign(t) == -1) {
			t = "Enter a positive number", (jQuery)(".js-input-profit").val(t), (jQuery)(".alertMessage__price").text(t), ($)(".js-input-profit").css('font-size', '13px')
		} else {
			t = t.toFixed(2),  (jQuery)(".js-input-profit").val(t), (jQuery)(".alertMessage__price").text(t + " $"), (jQuery)(".js-input-profit").css('font-size', '36px')
		}
	});
});
var vidget = document.querySelector('.vidget');
if(vidget){
	document.body.onload = init()
} 