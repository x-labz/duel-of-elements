window['a'] = {} ;

// ----------------------------------- VECTOR

a.v = function(n,a) {
	this.v = n || 0;
	this.a = a || 0;
	this.set = function(n,a) {
		this.v = n;
		this.a = a;
	};
	this.add = function(arg) {
		this.x =  this.v * Math.cos(this.a) + arg.v * Math.cos(arg.a) ;
		this.y =  this.v * Math.sin(this.a) + arg.v * Math.sin(arg.a) ;
		this.v = Math.sqrt(this.x*this.x+this.y*this.y) ;
		this.a = Math.atan2(this.y,this.x) ;
	};
	this.addS = function(n,a) {
		this.x =  this.v * Math.cos(this.a) + n * Math.cos(a) ;
		this.y =  this.v * Math.sin(this.a) + n * Math.sin(a) ;
		this.v = Math.sqrt(this.x*this.x+this.y*this.y) ;
		this.a = Math.atan2(this.y,this.x) ;
	};
	this.sub = function(arg) {
		var x =  this.v * Math.cos(this.a) - arg.v * Math.cos(arg.a) ;
		var y =  this.v * Math.sin(this.a) - arg.v * Math.sin(arg.a) ;
		this.v = Math.sqrt(x*x+y*y) ;
		this.a = Math.atan2(y,x) ;
	};
	
	this.rot = function(arg) {
		this.a+=arg;
		if (this.a >  Math.PI) {
			this.a-=Math.PI*2 ;
		}
		if (this.a < -Math.PI) {
			this.a+=Math.PI*2 ;
		}
	};
	
} ;

a.util = { 
	addAng: function(a1,a2) {
		a1 += a2;
		if (a1 >  Math.PI) {
			a1-=Math.PI*2 ;
		}
		if (a1 < -Math.PI) {
			a1+=Math.PI*2 ;
		}
		return a1;
	}
}

// ---------------------------------- CANVAS

a.sp = {
	'0': {
		p: [],
		d: [],
		bar: 0,
		exp: []
	},
	'1': {
		p: [],
		d: [],
		bar: 0,
		exp: []
	},
	well: [[],[]]
}

a.canvas = {
	elemFg: null,
	//elemBg: null,
	ctxFg: null,
	ctxBg: null,
	ratio:1,
	
	resize: function() {
		var x=window.innerWidth/this.w;
		var y=window.innerHeight/this.h;
		
		if (y<x) {
			y = y>1?1:y;
			// this.elemFg.style.height = this.elemBg.style.height = this.h*y+"px";
			// this.elemFg.style.width = this.elemBg.style.width = this.w*y+"px"; //"auto";
			this.elemFg.style.height = this.h*y+"px";
			this.elemFg.style.width = this.w*y+"px"; //"auto";
			this.ratio = y;
		}
		else {
			x = x>1?1:x;
			// this.elemFg.style.width = this.elemBg.style.width = this.w*x+"px";
			// this.elemFg.style.height = this.elemBg.style.height = this.h*x+"px"; //"auto";
			this.elemFg.style.width = this.w*x+"px";
			this.elemFg.style.height = this.h*x+"px"; //"auto";
			this.ratio = x;
		}
		// this.elemFg.style.left = this.elemBg.style.left = window.innerWidth/2-(this.w/2)*this.ratio+"px";
		// this.elemFg.style.top = this.elemBg.style.top = window.innerHeight/2-(this.h/2)*this.ratio+"px";
		this.elemFg.style.left = window.innerWidth/2-(this.w/2)*this.ratio+"px";
		this.elemFg.style.top = window.innerHeight/2-(this.h/2)*this.ratio+"px";
				
		this.rect = this.elemFg.getBoundingClientRect();
	},
	init: function() {			
		var $this = this;
		
		var canvas = document.getElementById('c-fg');
		
		//var landscape = window.innerHeight / window.innerWidth < 1 ? 1 : 0;
		canvas.height = this.h = 1200;
		canvas.width = this.w = 800 ;
				
		this.w2 = this.w / 2;
		this.h2 = this.h / 2;
						
		this.elemFg = canvas ;
		this.ctxFg = canvas.getContext('2d');
		
		this.ctxFg.multiLine = function(text,x,y,sp,op) {
			var text = text.split('\n');
			var h = parseInt(this.font.match(/\d{1,3}/))*sp ;
			text.forEach(function(t,i) {
				this[op](t,x,y-h*((text.length-1)/2)+i*h) ;
			},this);
		};
				
		//   -------------  BG LAYER
				
		canvas = document.createElement("canvas"); // document.getElementById('c-bg');
		
		canvas.height = this.h ;
		canvas.width = this.w;
				
		// this.elemBg = document.getElementById('c-bg'); //canvas ;
		this.ctxBg = canvas.getContext('2d');
		
		this.resize();
		
		window.addEventListener('resize', function() {
			a.canvas.resize();
		});
		
		this.extendFn(this.ctxFg) ;
		this.extendFn(this.ctxBg);
		
		this.drawBg();
		
		this.bgImg = new Image();
		this.bgImg.src = a.sp.bg = canvas.toDataURL() ;
		//this.elemBg.src=canvas.toDataURL() ;
		
		// this.elemFg.style.background = "no-repeat 0 0 url('"+ canvas.toDataURL() +"')" ;
		this.elemFg.style.backgroundSize = "cover";
		
		// if (this.sd) {
			// this.ctxFg.scale(0.5,0.5);
		// }
	},
	extendFn: function(ctx) {
		ctx.roundRect = function(x, y, width, height, radius, fill, stroke) {
			this.beginPath();
			this.moveTo(x + radius, y);
			this.lineTo(x + width - radius, y);
			this.quadraticCurveTo(x + width, y, x + width, y + radius);
			this.lineTo(x + width, y + height - radius);
			this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			this.lineTo(x + radius, y + height);
			this.quadraticCurveTo(x, y + height, x, y + height - radius);
			this.lineTo(x, y + radius);
			this.quadraticCurveTo(x, y, x + radius, y);
			this.closePath();
			if (stroke) {
				this.stroke();
			}
			if (fill) {
				this.fill();
			}        
		}
	},
	clr: function() {
		this.ctxFg.clearRect(0, 0, this.w, this.h);
	},
	drawBg: function() {
		var ctx = this.ctxBg ;
		
		ctx.lineWidth = 5;	
		
		ctx.strokeStyle = '#b43535';
		ctx.roundRect(10, 25 , this.w-20, this.h/2-40, 5, 0, 1);
				
		ctx.strokeStyle = '#42a2a2';
		ctx.roundRect(10, this.h/2+20, this.w-20, this.h/2-40, 5, 0, 1);
		
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.fillRect(25,5,this.w-50,40);
		ctx.fillRect(25,this.h-45,this.w-50,40);
		
		// BAT
			
		// ctx.lineWidth = 3;	
		// ctx.strokeStyle = '#42a2a2';
		// ctx.fillStyle = '#42a2a2';
		// ctx.roundRect(a.canvas.w-106, a.canvas.h2+40,6,20,3,1,0);
		// ctx.roundRect(a.canvas.w-100, a.canvas.h2+30 , 80, 40, 5, 0, 1);
		
		// ctx.strokeStyle = '#b43535';
		// ctx.fillStyle = '#b43535';
		// ctx.roundRect(100, a.canvas.h2-55,6,20,3,1,0);
		// ctx.roundRect(20, a.canvas.h2-65 , 80, 40, 5, 0, 1);				
	},
	shapeDefs: [
		{ang:0,"fi":5},
		{ang:0.6283185307179586,fi:3},
		{ang:1.2566370614359172,fi:16},
		{ang:1.8849555921538759,fi:10},
		{ang:2.5132741228718345,fi:7},
		{ang:3.141592653589793,fi:15},
		{ang:3.7699111843077517,fi:14},
		{ang:4.39822971502571,fi:12},
		{ang:5.026548245743669,fi:19},
		{ang:5.654866776461628,fi:0}], 
	initSprites: function() {
		this.drawBatt();
		this.drawPlasma(0,this.shapeDefs) ;
		this.drawPlasma(1,this.shapeDefs) ;
		this.drawDef(0);
		this.drawDef(1);
		this.drawBar(0);
		this.drawBar(1);
		this.drawWell(0);
		this.drawWell(1);
		
	},
	colors: {
		fire: ["#ae0000","#cb0000","#ec0000","#ff0303", "#ff5303","#ff9416","#ffd52e"]
	},
	drawPlasma: function(side,shapes) {
		var imgBuf = document.createElement("canvas");
		
		imgBuf.height = 128;
		imgBuf.width = 128; 
		
		var ctx = imgBuf.getContext('2d');

		ctx.lineWidth= 2;
		ctx.fillStyle = "#befcff";
		ctx.strokeStyle = "#a2f7fa";
				
		for (var animFr=0; animFr<20; animFr++) {
			for (var i=0; i< 10; i++) {
				var fr = animFr + shapes[i].fi;
				shapes[i].fr = fr > 19 ? fr-=19 : fr ;
			}
			var sorted = shapes.sort(function(a,b) { if (a.fr<b.fr) return -1; if (a.fr>b.fr) return 1;return 0; } ) ;
			
			ctx.clearRect(0, 0, imgBuf.width, imgBuf.height);

			ctx.save();
				ctx.globalAlpha = 0.8 ;				
				ctx.translate( imgBuf.width/2 ,imgBuf.height/2 ) ;
				
				for (var i=0; i< 10; i++) {
					ctx.save();
						if (side) {
							ctx.fillStyle = this.colors.fire[6-Math.round(sorted[i].fr/19*6)]; 
							ctx.beginPath();
							ctx.arc((7+(sorted[i].fr/19*20))*Math.cos(sorted[i].ang) + 2*Math.cos(Math.PI*2/19*4*i)*Math.sin(sorted[i].ang),(7+(sorted[i].fr/19*20))*Math.sin(sorted[i].ang) + 2*Math.sin(Math.PI*2/19*4*i)*Math.sin(Math.PI/2+sorted[i].ang),15-Math.round(sorted[i].fr/19*12),0,6.3);
							ctx.fill();
						}
						else {
							ctx.globalAlpha = .9-shapes[i].fr/19*.4 ;
							ctx.translate((3+(shapes[i].fr/19*20))*Math.cos(shapes[i].ang),(3+(shapes[i].fr/19*20))*Math.sin(shapes[i].ang) );
							ctx.rotate(shapes[i].ang*3 -.5*Math.PI*shapes[i].fr/19);
							ctx.beginPath();
							var r = 18-Math.round(shapes[i].fr/19*12) ;
							ctx.rect(-r/2,-r/2,r,r);
							ctx.fill();
							ctx.stroke();
						}
					ctx.restore();
				}
								
				var frame = new Image();
				frame.src=imgBuf.toDataURL() ;
				a.sp[side].p[animFr] = frame  ; 
			ctx.restore();
		}
		// EXPLODE
		
		for (var animFr=0; animFr<20; animFr++) {
			ctx.clearRect(0, 0, imgBuf.width, imgBuf.height);
			
			ctx.save();
				ctx.translate( imgBuf.width/2 ,imgBuf.height/2 );
				ctx.globalAlpha = 1-animFr/19 ;
				for (var i=0; i< 10; i++) {
					if (side) {
						ctx.fillStyle = this.colors.fire[6-Math.round(shapes[i].fr/19*6)]; 
						ctx.beginPath();
						ctx.arc((7+1.5*animFr+(shapes[i].fr/19*20))*Math.cos(shapes[i].ang),(7+1.5*animFr+(shapes[i].fr/19*20))*Math.sin(shapes[i].ang) ,15-Math.round(shapes[i].fr/19*12),0,6.3);
						ctx.fill();
					}
					else {
						ctx.save();
							//ctx.globalAlpha = .9-shapes[i].fr/19*.4 ;
							ctx.translate((3+1.5*animFr+(shapes[i].fr/19*20))*Math.cos(shapes[i].ang),(3+1.5*animFr+(shapes[i].fr/19*20))*Math.sin(shapes[i].ang) );
							//ctx.rotate(shapes[i].ang*3 -.5*Math.PI*shapes[i].fr/19);
							ctx.beginPath();
							var r = 18-Math.round(shapes[i].fr/19*12) ;
							ctx.rect(-r/2,-r/2,r,r);
							ctx.fill();
							ctx.stroke();
						ctx.restore();
					}
				}
								
				var frame = new Image();
				frame.src=imgBuf.toDataURL() ;
				a.sp[side].exp[animFr] = frame  ; 
			ctx.restore();
		}
	},
	drawDef: function(side) {
		var imgBuf = document.createElement("canvas");
		
		imgBuf.height = 64;
		imgBuf.width = 840; 
		
		var ctx = imgBuf.getContext('2d');
		
		var line = [];
		for (var i=0; i< 160; i++) {
			line.push({
				x: i,
				ang: 2*Math.PI*Math.random(),
				fi: Math.round(19*Math.random()) 
			} );
		}
		
		ctx.lineWidth= 2;
		ctx.fillStyle = "#befcff";
		ctx.strokeStyle = "#a2f7fa";
				
		for (var animFr=0; animFr<20; animFr++) {
			for (var i=0; i< 160; i++) {
				var fr = animFr + line[i].fi;
				line[i].fr = fr > 19 ? fr-=19 : fr ;
			}
			var sorted = line.sort(function(a,b) { if (a.fr<b.fr) return -1; if (a.fr>b.fr) return 1;return 0; } );
			
			ctx.clearRect(0, 0, imgBuf.width, imgBuf.height);
			ctx.save()
				if (side) {
					ctx.save();
						ctx.beginPath();
						ctx.globalAlpha = 1;
						ctx.shadowBlur = 10;
						ctx.shadowColor = this.colors.fire[6];
						ctx.lineWidth = 7 ;
						ctx.strokeStyle = this.colors.fire[6];
						ctx.lineCap = 'round';
						ctx.moveTo(20,32);
						ctx.lineTo(820,32);
						ctx.stroke();
					ctx.restore();
				}
				ctx.globalAlpha = 0.6;
				for (var i=0; i< 100; i++) {
					ctx.save();
						if (side) {
							ctx.beginPath();
							ctx.fillStyle = this.colors.fire[6-Math.round(line[i].fr/19*6)]; 
							ctx.arc(20+line[i].x*5, 32+3*Math.sin((2*(line[i].x&1)-1)*Math.PI*line[i].fr/19 ),10-Math.round(line[i].fr/19*8),0,6.3);
							ctx.fill();
						}
						else {
							ctx.globalAlpha = .9-line[i].fr/19*.4 ;
							ctx.translate(20+line[i].x*5,32+3*Math.sin((2*(line[i].x&1)-1)*Math.PI*line[i].fr/19 ) );
							ctx.rotate(line[i].ang); //*3 -.5*Math.PI*line[i].fr/19);
							ctx.beginPath();
							var r = 12-Math.round(line[i].fr/19*8) ;
							ctx.rect(-r/2,-r/2,r,r);
							ctx.fill();
							ctx.stroke();
						}
					ctx.restore();
				}	
				
			ctx.restore();
			var frame = new Image();
			frame.src=imgBuf.toDataURL() ;
			a.sp[side].d[animFr] = frame  ; 
		}
	},
	drawBar: function(side) {
		var imgBuf = document.createElement("canvas");
		
		imgBuf.height = 64;
		imgBuf.width =  800; 
		
		var ctx = imgBuf.getContext('2d');
		a.canvas.extendFn(ctx);
		
		ctx.fillStyle =  side ? '#42a2a2' : '#b43535' ;
		for (var i=0; i< 40; i++ ) {
			ctx.roundRect(0 + i* 18.5, 0 , 16, 36, 3, 1,0);
		}

		var frame = new Image();
		frame.src=imgBuf.toDataURL() ;
		a.sp[side].bar = frame  ; 
	},
	circSwitch: function(ctx,x,y,r,rot,w,mItems,actCol,inActCol,text) {
		ctx.save();
			ctx.translate(x,y);
			ctx.beginPath();
			ctx.arc(0,0,r+w/2+10,0,6.3);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(0,0,r-w/2-10,0,6.3);
			ctx.stroke();
			var l = 6.29 / mItems.length ;
			//ctx.font = '16pt Trebuchet MS';
			mItems.forEach(function(e,i) {
				ctx.beginPath();
				ctx.arc(0,0,r, 0+i*l+0.08+rot, l+i*l-0.08+rot);
				e.st ? ctx.strokeStyle=actCol : ctx.strokeStyle=inActCol ;
				ctx.lineWidth = w;
				ctx.stroke();
				
				if (e.txt && e.txt.length) {
					ctx.beginPath();
					ctx.strokeStyle=inActCol ;
					ctx.lineWidth = 3;
					var ang = i*l+l/2 + rot ;
					ctx.moveTo((r+w/2+10)*Math.cos(ang),(r+w/2+10)*Math.sin(ang)) ;
					ctx.lineTo((r+w/2+20)*Math.cos(ang),(r+w/2+20)*Math.sin(ang)) ;
					ctx.stroke();
					
					var l_r = ang>1.57 && ang<4.71 ;
					ctx.textAlign = l_r ? "right" : "left" ;
					ctx.multiLine(e.txt,(l_r?-10:10)+(r+w/2+20)*Math.cos(ang),(r+w/2+20)*Math.sin(ang),1.1,"fillText");
				}
			},this);
			ctx.textAlign = 'center' ;
			ctx.multiLine(text,0,0,1.1,"fillText");
		ctx.restore();
	},
	drawWell: function(posNeg) {
		var imgBuf = document.createElement("canvas");
			
		imgBuf.height = 128;
		imgBuf.width = 128; 
		
		var ctx = imgBuf.getContext('2d');
		
		ctx.fillStyle = posNeg ? '#f0f' : '#0f7' ;
				
		for (var animFr=0; animFr<20; animFr++) {
			ctx.clearRect(0, 0, imgBuf.width, imgBuf.height);
			var r = 15;
			ctx.save();
				ctx.translate( imgBuf.width/2 ,imgBuf.height/2 );
				// ctx.beginPath();
				var par = 20;
				for (var i=0; i<par; i++) {
					ctx.save();
						var fr = (1+Math.sin(2*Math.PI/19*i*5))*9.5 +animFr ;
						fr > 19 ? fr-=19 : fr ;
						ctx.globalAlpha = Math.sin(Math.PI/19*(19-fr));
						var w = 10-fr/19*7;
						ctx.fillRect( (r-fr/19*r)*3*Math.cos(2*Math.PI/par*i),(r-fr/19*r)*3*Math.sin(2*Math.PI/par*i),w,w);
						// ctx.beginPath();
						// ctx.arc( (r-fr/19*r)*3*Math.cos(2*Math.PI/par*i),(r-fr/19*r)*3*Math.sin(2*Math.PI/par*i),w/2,0,6.3);
						// ctx.fill();
					ctx.restore();
				}				
								
				var frame = new Image();
				frame.src=imgBuf.toDataURL() ;
				a.sp.well[posNeg][animFr] = frame  ;
				a.sp.well[posNeg][20+animFr] = frame  ;				
			ctx.restore();
		}
	},
	drawBatt: function() {
		var imgBuf = document.createElement("canvas");
			
		imgBuf.height = 128;
		imgBuf.width = 1000; 
		
		var ctx = imgBuf.getContext('2d');
		this.extendFn(ctx) ;
		ctx.lineWidth = 3;	
		
		for (var i=0; i<11; i++) {
			ctx.save();
				ctx.translate( i*90 ,0 );

				ctx.strokeStyle = '#42a2a2';
				ctx.fillStyle = '#42a2a2';
				ctx.roundRect( 2,12,  6, 20, 3, 1, 0);
				ctx.roundRect( 8, 2, 80, 40, 5, 0, 1);
				ctx.fillRect(90-7-7*i,7, 7*i ,30);
				
			ctx.restore();
			
			ctx.save();
				ctx.translate( i*90 ,64 );
				ctx.strokeStyle = '#b43535';
				ctx.fillStyle = '#b43535';
				ctx.roundRect(82,12,  6, 20, 3, 1, 0);
				ctx.roundRect( 2, 2, 80, 40, 5, 0, 1);		
				ctx.fillRect(7,7, 7*i ,30);
			ctx.restore();
		}
		
		var frame = new Image();
		frame.src=imgBuf.toDataURL() ;
		a.sp.batt = frame  ;
	}
}

// --------------------------------------  TOUCH ----------------------------

a.touch = {
	touches: {},
	events:	{
		"tStart" 	: ["touchstart", "MSPointerDown", "pointerdown"],
		"tMove"		: ["touchmove", "MSPointerMove", "pointermove"],
		"tEnd"		: ["touchend", "MSPointerUp", "pointerup" ]
	},
	buttons: [
		{ x:170, y: 855, r: 75, val:1, fn: 'speed' },
		{ x:335, y: 930, r: 75, val:2, fn: 'speed' },
		{ x:155, y:1030, r: 75, val:0, fn: 'speed' },
		{ x:725, y: 955, r:120, val:0, fn: 'levels' },
		{ x:500, y: 820, r:120, val:1, fn: 'levels' },
		{ x:720, y: 700, r:120, val:2, fn: 'levels' },
		{ x:475, y:1075, r: 80, val:1, fn: 'tutorial' },
		{ x:405, y: 495, r:150, val:1, fn: 'start' }
	],
	adjX: function(arg) {
		this.tempX = (arg-a.canvas.rect.left) / a.canvas.ratio ;
		if (this.tempX < 0) this.tempX = 0;
		if (this.tempX > a.canvas.w) this.tempX = a.canvas.w ;
		return this.tempX;
	},
	adjY: function(arg) {
		this.tempY = (arg-a.canvas.rect.top) / a.canvas.ratio ;
		if (this.tempY < 0) this.tempY = 0;
		if (this.tempY > a.canvas.h) this.tempY = a.canvas.h ;
		return this.tempY;
	},
	tStart: function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.preventManipulation) e.preventManipulation();
		
		if (!e.changedTouches) {
			e.changedTouches = [e] ;
		}
	
		for (var i=0; i<e.changedTouches.length; i++) {
			var id = e.changedTouches[i].identifier !== undefined ? e.changedTouches[i].identifier : e.changedTouches[i].pointerId !== undefined ? e.changedTouches[i].pointerId : 1 ;
			this.touches[ id ] = {
				startX: this.adjX(e.changedTouches[i].pageX),
				startY: this.adjY(e.changedTouches[i].pageY),
				x: this.adjX(e.changedTouches[i].pageX),
				y: this.adjY(e.changedTouches[i].pageY)
			};
		} ;
		
	},
	tMove: function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.preventManipulation) e.preventManipulation();
		
		if (!e.changedTouches) {
			e.changedTouches = [e] ;
		}
		
		for (var i=0; i<e.changedTouches.length; i++) {
			var id = e.changedTouches[i].identifier !== undefined ? e.changedTouches[i].identifier : e.changedTouches[i].pointerId !== undefined ? e.changedTouches[i].pointerId : 1 ;
			if (!this.touches[ id ]) this.touches[ id ] = {} ;
			this.touches[ id ].x = this.adjX(e.changedTouches[i].pageX) ;
			this.touches[ id ].y = this.adjY(e.changedTouches[i].pageY) ;
		};
	},
	tEnd: function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.preventManipulation) e.preventManipulation();
		
		if (!e.changedTouches) {
			e.changedTouches = [e] ;
		}
		
		if (a.app.sta == 1 && !a.app.trans && !a.app.tutMode) {
			for (var i=0; i<e.changedTouches.length; i++) {
				var id = e.changedTouches[i].identifier !== undefined ? e.changedTouches[i].identifier : e.changedTouches[i].pointerId !== undefined ? e.changedTouches[i].pointerId : 1 ;
				var x = this.touches[ id ].x - this.touches[ id ].startX ;
				var y = this.touches[ id ].y - this.touches[ id ].startY ;
				var ang = Math.atan2(y,x) ;
				
				var xAbs = Math.abs(x) ;
				var yAbs = Math.abs(y);
								
					if (xAbs>2*yAbs) {
						for (var idx=0; idx<a.pool.defend.length && a.pool.defend[idx] && a.pool.defend[idx].state; idx++) {} ;
						var side = (this.touches[ id ].startY < (a.canvas.h / 2)) ? 1 : 0 ;
						if (a.pool.objCnt[side] && idx<a.pool.defend.length && ( (this.touches[ id ].startY < (a.canvas.h / 2)-30 && this.touches[ id ].y < (a.canvas.h / 2)-30) || (this.touches[ id ].startY > (a.canvas.h / 2)+30 && this.touches[ id ].y > (a.canvas.h / 2)+30) ) ) {
							a.pool.defend[idx].init(this.touches[ id ].startX,this.touches[ id ].startY,this.touches[ id ].x,this.touches[ id ].y,side ,x < 0);
						}
						else {
							a.sfx.audioSupport && a.sfx.playFailSnd();
						}
					}
					
					if (yAbs>2*xAbs) {
						for (var idx=0; idx<a.pool.balls.length && a.pool.balls[idx] && a.pool.balls[idx].state; idx++) {}  ;
						var side = this.touches[ id ].y < (a.canvas.h / 2) ? 1 : 0;
						if (a.pool.objCnt[side] && idx<a.pool.balls.length && ( (this.touches[ id ].startY < (a.canvas.h / 2)-30 && this.touches[ id ].y < (a.canvas.h / 2)-30) || (this.touches[ id ].startY > (a.canvas.h / 2)+30 && this.touches[ id ].y > (a.canvas.h / 2)+30) ) ) {
							a.pool.balls[idx].init(this.touches[ id ].x,this.touches[ id ].y,ang , side )
						}
						else {
							a.sfx.audioSupport && a.sfx.playFailSnd();
						}
					}
				
				
				this.touches[ id ] = {} ;
			}
		}
		if (a.app.sta == 0 && !a.app.trans) {
			if (e.changedTouches[0]) {
				var x = this.adjX(e.changedTouches[0].pageX) ;
				var y = this.adjY(e.changedTouches[0].pageY) ;
				//console.info(x,y);
				// if ( x >200 && x < 600 && y > 400 && y < 800) {
					 // a.app.nextState() ;
				// }
				// if ( x >10 && x < 200 && y > 1000 && y < 1200) {
					// a.app.startTutorial();
					// a.app.nextState() ;
				// }
				
				this.buttons.forEach(function(b) {
					if ((b.x-x)*(b.x-x) + (b.y-y)*(b.y-y) < b.r*b.r ) {
						switch(b.fn) {
							case 'tutorial':
								a.app.startTutorial();
								a.app.nextState() ;
							break;
							case 'start':
								a.app.nextState() ;
							break;
							default:
								this.changeSetting(b.val,b.fn) ;
						}
					}
				},this);
			}
		}
		if (a.app.sta == 2 && !a.app.trans) {
			a.app.nextState() ;
		}
	},
	changeSetting: function(val,fn) {
		a.app.menu[fn].forEach(function(m,i) {
			if (i == val) {
				m.st = 1;
			}
			else {
				m.st = 0; 
			}
		});
	},
	init: function() {
		var o = document.getElementById("c-fg");
		
		for (var func in this.events) {
			this.events[func].forEach(function(e){
				o.addEventListener(e,this[func].bind(this));
			},this);
		}
		
		// o.addEventListener("click", function() {
			// if (a.app.sta == 2) {
				// a.app.nextState() ;
			// }
		// },this);
		
		
	}
}

// ---------------------------------- ANIM
a.anim = {
	T1: 0,
	T2: 0,
	dT: 0,
	cnt: 0,
	fps:0,
	fpsAvg: 0,
	calcDT: function(now) {
		this.T1 = this.T2 ;
		this.T2 = now ; //Date.now() ;
		this.dT = (this.T2 - this.T1)/1000 ;
		if (this.dT > 0.1) this.dT = 0.1 ;
		
		// ================ calc FPS
		this.fps+= (1 / this.dT) ;
		this.cnt++;
		if (this.cnt == 100)  { 
			this.cnt = 0;
			this.fpsAvg = Math.round(this.fps / 100) ;
			if (this.fpsAvg > 60) {
				this.fpsAvg = 60 ;
			}
			this.fps = 0;
		}
		
		//return this.dT/1000;
	}
	
};

a.sfx = {
	init: function() {
		var fail = 0;
		try {
			var ctx = this.audioCtx = new ( window.AudioContext || window.webkitAudioContext ) ;
					
			// ===== NOISE1	
			var buffer = ctx.createBuffer(1, 44100, 44100);
			var data = buffer.getChannelData(0);
			for (var i = 0, value = 0; i < data.length; i++) {
				data[i] = 2* Math.random() -1 ;
			}
			
			this.noise = ctx.createBufferSource() ;
			this.noise.loop = true;
			this.noise.buffer = buffer;
			
			// ZZZZ
			
			this.zzzzOsc = ctx.createOscillator();
			this.zzzzOsc.frequency.value = 80;
			this.zzzzOsc.type = 'sawtooth';
					
			// BIG EXP
			
			this.bigPre = ctx.createGain();			
			this.bigPre.gain.value = 0;
			this.bigOsc = ctx.createOscillator();
			this.bigOsc.frequency.value = 30;
			this.bigOsc.type = 'triangle';
			
			// ===== REVERB
			// var sampleRate = ctx.sampleRate;
			// var length = sampleRate * 1;
			// var impulse = ctx.createBuffer(1, length, sampleRate);
			// var impulseL = impulse.getChannelData(0);

			// for (var i = 0; i < length; i++){
				// impulseL[i] = 0;
			// }
			// impulseL[ 	 1] = 1;
			// impulseL[ 2000] = 0.5;
			// impulseL[ 4000] = 0.3;
					
			// this.reverb = ctx.createConvolver();
			// this.reverb.buffer = impulse;
			
			// FILTERS
			
			this.zzzzFilter = ctx.createBiquadFilter() ;
			this.zzzzFilter.frequency.value = 600;
			this.zzzzFilter.type =  "bandpass" ;
			
			this.expLp1 = ctx.createBiquadFilter() ;
			this.expLp1.frequency.value = 500;
			this.expLp1.type =  "lowpass" ;
			
			this.lchLp1 = ctx.createBiquadFilter() ;
			this.lchLp1.frequency.value = 1000;
			this.lchLp1.type =  "lowpass" ;
			
			this.bigLp1 = ctx.createBiquadFilter() ;
			this.bigLp1.frequency.value = 300;
			this.bigLp1.type =  "lowpass" ;
			
			// DYNAMIC COMP
			this.dComp = ctx.createDynamicsCompressor() ;
			
			// CONNECT	
			//this.zzzzFilter.connect(this.reverb);
			this.zzzzFilter.connect(this.dComp);
			
			this.noise.connect(this.bigPre);
			this.bigOsc.connect(this.bigPre.gain);
			// this.bigLp1.connect(this.reverb);
			// this.expLp1.connect(this.reverb);
			// this.lchLp1.connect(this.reverb);
			this.bigLp1.connect(this.dComp);
			this.expLp1.connect(this.dComp);
			this.lchLp1.connect(this.dComp);
			// this.reverb.connect(this.dComp);
			this.dComp.connect(ctx.destination);
			
			// START
			// this.noise.start(0);
			// this.bigOsc.start(0);
			// this.zzzzOsc.start(0);
			this.failSnd = [];
			for (i=0; i<5; i++) {
				var snd = {
					osc: ctx.createOscillator(),
					amp: ctx.createGain(),
					play: function() {
						var t0 = ctx.currentTime ;
						this.amp.gain.cancelScheduledValues(t0);
						this.amp.gain.setValueAtTime(0, t0);
						this.amp.gain.linearRampToValueAtTime(.3, t0 + 0.1);
						this.amp.gain.exponentialRampToValueAtTime(0.01, t0 + 0.35);
						this.amp.gain.setValueAtTime(0, t0+0.36);
						
						this.osc.frequency.cancelScheduledValues(t0);
						this.osc.frequency.setValueAtTime(200, t0);
						this.osc.frequency.exponentialRampToValueAtTime(100, t0 + 0.35);
					}
				}
				//snd.osc.frequency.value = 300;
				snd.osc.type = 'triangle';
				snd.amp.gain.value = 0;
				snd.osc.connect(snd.amp);
				snd.amp.connect(this.dComp);
				
				this.failSnd.push(snd);
					
			}
		}
		catch(e) {
			fail = 1;
		}
		return fail;
	},
	start: function() {
		this.noise.start(0);
		this.bigOsc.start(0);
		this.zzzzOsc.start(0);
		this.failSnd.forEach(function(e) {
			e.osc.start(0);
		});
	},
	playFailSnd: function() {
		for (var i=0; i<5 && this.failSnd[i].amp.gain.value ; i++) { }
		if (i<5) {
			a.sfx.failSnd[i].play() ; //console.info(i);
		}
	}
}

// ----------------------------------- APP -----------------------------------------

a.app = {
	shake: {
		'0' : 0,
		'1' : 0 
	},
	animT:0,
	animFr:0,
	animRot:0,
	firstRun: 20,
	sta: 0,
	trans: 0,
	transCnt: 0,
	featureDetect: function() {
		window.requestAnimFrame = window.requestAnimationFrame 
						|| window.webkitRequestAnimationFrame 
						|| window.mozRequestAnimationFrame 
						|| window.oRequestAnimationFrame 
						|| window.msRequestAnimationFrame  	; 
		
		var e = document.documentElement; 
		e.fullScr = e.requestFullscreen || e.msRequestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen ;
	
		this.features = [!!(('ontouchstart' in window) || navigator.maxTouchPoints || navigator.msMaxTouchPoints ), 
			!!document.documentElement.fullScr,
			!!window.requestAnimFrame,
			!!document.createElement("canvas").getContext,
			!!(window.AudioContext || window.webkitAudioContext) && !a.sfx.init()]  ;
					
		this.features.push(this.features[0] && this.features[2] && this.features[3]) ;		
		this.features.forEach(function(e,i) {
			!e ? document.querySelectorAll("#str .feat div")[i].style.display  = "block" : 0;
		});
		
		return this.features[5]  ;
	},
	start: function() {
		//console.log("start");
		if (!this.featureDetect()) {
			document.querySelector("#str>p").style.display  = "none" ;	
			return false ;
		}
		
		a.canvas.init();
						
		a.canvas.initSprites();
		
		a.sfx.audioSupport = this.features[4] ;
		//a.sfx.audioSupport && a.sfx.init();
		
		document.querySelector("button").addEventListener("click", function() {
			document.documentElement.fullScr && document.documentElement.fullScr();
			document.querySelector("#str").style.display  = "none" ;
			document.querySelector("#c-fg").style.display  = "block" ;
			a.app.trans = 1;
			a.touch.init();
			a.sfx.audioSupport && a.sfx.start();
			clearInterval(a.app.imgAnim) ;
			document.body.removeChild(document.querySelector("#str"));
			a.app.animloop();
			a.canvas.resize();
		},this);
		
		document.querySelector("button").style.display  = "block" ;	
		document.querySelector("#str>p").style.display  = "none" ;	
		this.imgCnt = 0;
		for (var e,i = 0; i <20; i++) {
			e = document.createElement("img");
			e.src = a.sp[0].p[i].src ;
			document.querySelector("#i span").appendChild( e ) ;
			e = document.createElement("img");
			e.src = a.sp[1].p[i].src ;
			document.querySelector("#f span").appendChild( e ) ;
		}
		this.imgAnim = setInterval(function() { 
			document.querySelector("#i span").style.top = -64*a.app.imgCnt+"px" ;
			document.querySelector("#f span").style.top = -64*a.app.imgCnt+"px" ;
			//document.querySelector("#i").src = a.sp[0].p[a.app.imgCnt].src; 
			//document.querySelector("#f").src = a.sp[1].p[a.app.imgCnt].src; 
			// /* document.querySelector("#f").src = a.sp.well[1][a.app.imgCnt].src; */ 
			a.app.imgCnt++; 
			if (a.app.imgCnt==20) a.app.imgCnt=0 ;
			document.querySelector("#i").style.display = document.querySelector("#f").style.display  = "block";
		},100) ;
		//document.querySelector("#i").style.display = document.querySelector("#f").style.display  = "block";
	},
	nextState: function() {
		this.trans = 2;
		this.showHideBg();
	},
	doTrans: function(dT) {
		this.transCnt+=dT;
		if (this.transCnt > 1) {
			this.transCnt = 0 ;
						
			if (this.trans == 1) {
				this.trans = 0;
			}
			if (this.trans == 2) {
				this.trans = 1;
				this.sta++;
				if (this.tutMode && this.sta == 2) {
					this.tutMode = 0;
					this.sta = 0;
				}
				this.animT= 0;
				this.animFr= 0;
				this.animRot= 0;
				this.done= 0;
								
				if (this.sta>2) {
					this.sta = 0;
				}
				if (this.sta == 1) {
					
					a.pool.init(20,20,5,a.app.menu.speed[0].st && 400 || a.app.menu.speed[1].st && 600  || a.app.menu.speed[2].st && 800 );
					a.ply.reset(); 
					this.kickerTimer = 5;
					a.pool.objCnt = [10,10];
				}
			}
			this.showHideBg();
		}
	},
	showHideBg: function() {
		if (this.sta == 1 && this.trans==0) {
			// a.canvas.elemBg.classList.remove("hide") ;
			a.canvas.elemFg.style.background = "no-repeat 0 0 url('"+ a.sp.bg +"')" ;
			a.canvas.elemFg.style.backgroundSize = "cover";
		}
		else {
			//a.canvas.elemBg.classList.add("hide")
			a.canvas.elemFg.style.background = 'none';
		}
	},
	animloop: function(time) {
		if (a.app.firstRun) {
			a.app.firstRun--;
		}
		else {
			a.anim.calcDT(time) ;
			a.app.drawFrame(a.anim.dT);
		}
		window.requestAnimFrame(a.app.animloop) ; 	
	},
	
	collision: function() {
		a.pool.balls.forEach(function(b,i) {
			if (b.state==1) {
				a.pool.balls.forEach(function(b2,i2) {
					if (b2.state==1 && i2>i) {
						if ( (b.x-b2.x)*(b.x-b2.x) + (b.y-b2.y)*(b.y-b2.y) < (b.r+b2.r) * (b.r+b2.r) ) {
							b.explode();
							b2.explode();
						}
					}
				},this);
			}
		},this);
		
		a.pool.defend.forEach(function(d,i) {
			if (d.state==1) {					
				a.pool.balls.forEach(function(b,i2) {
					if (b.state==1 ) {
						var extX = 2*b.r*Math.cos(d.a) ;
						var extY = 2*b.r*Math.sin(d.a) ;
						d.se.set( Math.sqrt( (d.endX-d.startX+extX)*(d.endX-d.startX+extX)+(d.endY-d.startY+extY)*(d.endY-d.startY+extY)) , Math.atan2((d.endY-d.startY+extY),(d.endX-d.startX+extX)) ) ;
						d.sb.set( Math.sqrt( (b.x-d.startX)*(b.x-d.startX)+(b.y-d.startY)*(b.y-d.startY)) , Math.atan2((b.y-d.startY),(b.x-d.startX)) );
						d.eb.set( Math.sqrt( (b.x-d.endX)*(b.x-d.endX)+(b.y-d.endY)*(b.y-d.endY)) , Math.atan2((b.y-d.endY),(b.x-d.endX)) );
						d.angS = a.util.addAng(d.sb.a, -d.se.a);
						d.angE = a.util.addAng(d.eb.a, -d.se.a);
						d.dist = Math.sin(d.angS) * d.sb.v ;
						//console.log(d.dist);
						if (Math.abs(d.dist) < b.r && (Math.abs(Math.cos(d.angS) * d.sb.v) + Math.abs(Math.cos(d.angE) * d.eb.v )) <= (d.se.v ) ) {
							b.explode();
							d.hit();
						}
					}
				},this);
			}
		},this);
		// Math.sqrt(x*x+y*y), Math.atan2(y,x) 
	},
	move: function(dT) {
		a.pool.balls.forEach(function(e) {
			if (e.state) {
				e.move(dT);
			}
		},this);
		a.pool.defend.forEach(function(e) {
			if (e.state) {
				e.move(dT);
			}
		},this);
		a.pool.grav.forEach(function(e) {
			if (e.state) {
				e.move(dT);
			}
		},this);
	},
	drawFrame: function(dT) {
		a.canvas.clr();
	
		this.animT += dT  ;							
		if (this.animT > 0.05) {
			this.animT -= 0.05;
			this.animFr++;
			if (this.animFr==40) {
				this.animFr=0;
			}
		}
		
		this.animRot+= dT/2 ;
		if (this.animRot > Math.PI*2) this.animRot-= Math.PI*2;
		
		switch (this.sta) {
			case 0: 
				this.startPage(dT);
			break;
			case 1: 
				this.move(dT) ;
				this.collision();

				this.drawObj(dT);
				this.tutMode && this.tutorial(dT) ;
				
				if (!this.tutMode && !a.app.menu.levels[0].st) {
					this.kickerTimer-=dT;
					if (this.kickerTimer < 0) {
						this.kickerTimer = 5 + 3*Math.random();
						for (var idx=0; idx<a.pool.grav.length && a.pool.grav[idx] && a.pool.grav[idx].state; idx++) {} ;
						if (a.pool.grav[idx]) {
							a.pool.grav[idx].init(a.app.menu.levels[1].st ? 0 : Math.round(Math.random()) );
						}
					}
				}
			break;
			case 2:
				this.endPage(dT);				
		}
		
		if (this.shake[0] > 0) { 
			this.shake[0]-=	dT ;
			if (this.shake[0] < 0) {
				this.shake[0] = 0 ;
			}
		}
		if (this.shake[1] > 0) { 
			this.shake[1]-=	dT ;
			if (this.shake[1] < 0) {
				this.shake[1] = 0 ;
			}
		}
		
		if (this.trans) {
			this.doTrans(dT);
		}
	},
	tutorialData: [
		{ t: 1, dir: 0 , v:  0, a: 0, 		 	text: "" , pointerOff: 1},
		{ t: 2, dir: 0 , v:  90, a: 0, 		 	text: "Two players sit face-to-face across a single device" },
		{ t: 2, dir: 3.14, v: 90, a: 0, 		 	text: "^",x:100, y:250 },
		{ t: 1, dir: -1.4, v:  0, a: 0, 		 	text: "", x:250, y:900 },
		{ t: 1, dir: -1.4, v: 150, a: -Math.PI/2,  	text: "Swipe vertically to attack your enemy" },
		{ t: 3, dir: -1.4, v: 0, a: 0, 	text: "^" ,fn: function() {
			a.pool.balls[0].init(250,750, -Math.PI/2 , 0 ) } },
		{ t: 1, dir: 1.57 , v: 150, a: 1.57, 			 text: "^",x:300, y:250 },
		{ t: 3, dir: 1.57, v:  0, a: 0, 			 text: "^",fn: function() {
			a.pool.balls[0].init(300,400, Math.PI/2 , 1 ) } },
		{ t: 2, dir: 3.14, v: 150, a: 0, 					 text: "Swipe horizontally to create a shield",x:300, y:250 },
		{ t: 1, dir: 3.14, v: 0, a: 0, 					 text: "^",fn: function() { 
			a.pool.defend[1].init(300,250,600,250,1 , 0) 	} },
		{ t: 2.5, dir: 0, v: 150, a: 0, 					 text: "^", x:150, y:900 },
		{ t: 1, dir: 0, v: 0, a: 0, 					 text: "^",fn: function() { 
			a.pool.defend[0].init(150,900,525,900,0 , 0) 	} },
		{ t: 1, dir: 0, v: 0, a: 0, 			 text: "Shields decrease with time and \nsuccessfully defended attacks" },
		{ t: 1, dir: 1.57 , v: 150, a: 1.57, 			 text: "^",x:300, y:250 },
		{ t: 3, dir: 1.57, v:  0, a: 0, 			 text: "^",fn: function() {
			a.pool.balls[0].init(300,400, Math.PI/2 , 1 ) } },
		{ t: 1, dir: 1.57 , v: 150, a: 1.57, 			 text: "^",x:300, y:250 },
		{ t: 2, dir: 1.57, v:  0, a: 0, 			 text: "Health levels decrease with successful attacks",fn: function() {
			a.pool.balls[0].init(300,400, Math.PI/2 , 1 ) } },
		{ t: 2, dir: -3.14, v: 150, a: 0, 			 text: "^",x:100, y:1160 },
		{ t: 2, dir: -3.14 , v: 0, a: 0, 			 text: "^" },
		{ t: 1, dir: 0, v: 90, a: 0, 			 text: "Each active weapon or shield consumes battle energy\nYou can attack and defend as long as you have \nbattle energy", x:650, y:650 },
		{ t: 4, dir: 0, v: 0, a: 0, 			 text: "^" },
		{ t: 1, dir: 0, v: 0, a: 0, 			 text: "Random gravity wells will deflect attacks\nThey can be tricky... ;-)" ,x:500, y:580},
		{ t: 2, dir: 0, v: 0, a: 0, 			 text: "^",fn: function() {
			a.pool.grav[0].init(1,500,500) ;
			} },
		{ t: 1, dir: 1.57 , v: 150, a:  -Math.PI/2, 			 text: "^",x:300, y:900 },
		{ t: 4, dir: 1.57, v:  0, a: 0, 			 text: "^",fn: function() {
			a.pool.balls[0].init(300,750, -Math.PI/2 , 0 ) } },
		{ t: 2, dir: 0, v: 0, a: 0, 			 text: "Enjoy the game!" },
		{ t: 1, dir: 0, v: 0, a: 0, 			 text: "",fn: function() {
			a.app.nextState() }, hide: 1}
	],
	startTutorial: function() {
		this.tutTime = 0;
		this.tutTimeSum = 0;
		this.tutTimeTotal = 0;
		this.tutX = 150;
		this.tutY = 900;
		this.tutIdx = 0;
		this.tutMode = 1;		
		this.tutorialData.forEach(function(e) {
			this.tutTimeSum+=e.t;
		},this);
	},
	tutorial: function(dT) {	
		var ctx = a.canvas.ctxFg ;
		var tut = this.tutorialData[this.tutIdx] ;
		if (tut.text == "^") tut.text = this.tutorialData[this.tutIdx-1].text;
		if (!tut.hide) {
			ctx.save();
				ctx.beginPath();
				ctx.font = '18pt Trebuchet MS';
				ctx.textAlign = 'left';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = "#e0e0e0";
				ctx.strokeStyle = "#d0d0d0";
				ctx.lineWidth = 2;
				ctx.save();
					ctx.globalAlpha = 0.2 ;
					ctx.beginPath();
					ctx.roundRect(100,1000,600,115,5,1,1);
					ctx.moveTo(110,1095);
					ctx.lineTo(690,1095);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(110+580* this.tutTimeTotal / this.tutTimeSum,1088 ,7,14);
				ctx.restore();
				ctx.multiLine(tut.text, 110,1050,1.1,"fillText");
			ctx.restore();
		
			if (!tut.pointerOff) {
				ctx.save()
					ctx.beginPath();
					ctx.lineJoin = 'miter';
					ctx.strokeStyle = '#0effe2' ; //'rgb(171, 137, 98)';
					ctx.fillStyle = '#1f6e65'; //'rgb(242, 199, 153)';
						ctx.shadowBlur = 10;
						ctx.shadowColor = '#0effe2';
					
					ctx.lineCap = 'butt';
					ctx.lineWidth = 3;
					ctx.translate(Math.round(this.tutX),Math.round(this.tutY));
					ctx.save();
						ctx.rotate(tut.dir);
						ctx.translate(-35,-15);
						ctx.moveTo(28, 67);
						ctx.bezierCurveTo(23, 58, 20, 46, 19, 42);
						ctx.bezierCurveTo(21, 41, 23, 40, 25, 43);
						ctx.bezierCurveTo(27, 45, 30, 53, 33, 51);
						ctx.bezierCurveTo(34, 45, 32, 22, 34, 15);
						ctx.bezierCurveTo(37, 14, 39, 14, 40, 15);
						ctx.bezierCurveTo(41, 22, 40, 29, 41, 36);
						ctx.bezierCurveTo(46, 40, 55, 39, 59, 44);
						ctx.bezierCurveTo(60, 52, 59, 59, 56, 67);
						ctx.bezierCurveTo(48, 68, 33, 68, 28, 67);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					ctx.restore(),
				ctx.restore();
			}
			
		}
		this.tutTime+=dT;
		this.tutTimeTotal+=dT;
		this.tutX+= tut.v*dT * Math.cos(tut.a) ;
		this.tutY+= tut.v*dT * Math.sin(tut.a) ;
		if ( this.tutTime > tut.t) {
			this.tutIdx++;
			this.tutTime = 0;
			if (this.tutorialData[this.tutIdx] && this.tutorialData[this.tutIdx].x) {
				this.tutX = this.tutorialData[this.tutIdx].x ;
				this.tutY = this.tutorialData[this.tutIdx].y ;
			}
			if (this.tutIdx == this.tutorialData.length) {
				//this.tutMode = 0;
			}
			else {
				this.tutorialData[this.tutIdx].fn && this.tutorialData[this.tutIdx].fn() ;
			}
		}
	},
	drawObj: function(dT) {	
		var ctx = a.canvas.ctxFg ;
		
		ctx.save();
			if (this.trans == 2) {
				ctx.translate(a.canvas.w2,a.canvas.h2);
				ctx.scale(this.transCnt > 0.5 ? (1-(this.transCnt-0.5)*2) : 1,this.transCnt < 0.5 ? (1-this.transCnt*2) : 0.005);
				ctx.translate(-a.canvas.w2,-a.canvas.h2);
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,'+ this.transCnt +')' ; //console.info(this.transCnt < 0.7 ? this.transCnt : 1);
				ctx.fillRect(0,0,a.canvas.w,a.canvas.h);
			}
			ctx.save();
				if (this.trans == 1) {
					ctx.translate(0,a.canvas.h2);
					ctx.scale(1,this.transCnt < 0.5 ? this.transCnt*2 : 1);
				}
				
				if (this.trans) {
					// ctx.drawImage(a.canvas.elemBg,0,0,a.canvas.w,a.canvas.h,0,this.trans==1?-a.canvas.h2:0,a.canvas.w,a.canvas.h);
					ctx.drawImage(a.canvas.bgImg,0,0,a.canvas.w,a.canvas.h,0,this.trans==1?-a.canvas.h2:0,a.canvas.w,a.canvas.h);
				}
			ctx.restore();
	// --------------------  DASHBOARD
			ctx.save();	
				if (this.trans == 1) {
					ctx.translate(0,(1-this.transCnt)*300);
				}
				a.ply[0].len && ctx.drawImage(a.sp[1].bar, 0,0, a.ply[0].len , 36 , 30 + (a.app.shake[0] ? 3*Math.sin(2*Math.PI*this.animT*10) : 0),   a.canvas.h-39,  a.ply[0].len, 36 );
			ctx.restore();
			
			ctx.save();	
				if (this.trans == 1) {
					ctx.translate(0,(1-this.transCnt)*-300);
				}
				a.ply[1].len && ctx.drawImage(a.sp[0].bar, 0,0, a.ply[1].len , 36 , a.canvas.w-30-a.ply[1].len + (a.app.shake[1] ? 3*Math.sin(2*Math.PI*this.animT*10) : 0), 5,  a.ply[1].len, 36 );
			ctx.restore();
			
			// BAT
			if (this.trans == 1) {
				var len = Math.ceil((this.transCnt-0.8)/.02) ;
				a.pool.objCnt[0] = a.pool.objCnt[1] = len > 0 ? len : 0 ;
			}
			
			ctx.drawImage(a.sp.batt, a.pool.objCnt[0] * 90, 0, 90, 60, 	a.canvas.w-108, a.canvas.h2+28, 90, 60);
			ctx.drawImage(a.sp.batt, a.pool.objCnt[1] * 90,64, 90, 60, 	           18, a.canvas.h2-67, 90, 60);
			
			
			// OBJ
			a.pool.grav.forEach(function(e) {
				if (e.state) {
					e.draw(ctx,this.animFr);
				}
			},this);
			
			a.pool.balls.forEach(function(ball) {
				if (ball.state) {
					ball.draw(ctx,this.animFr,this.animRot);
				}
			},this);
			
			a.pool.defend.forEach(function(defend) {
				if (defend.state) {
					defend.draw(ctx,this.animFr);
				}
			},this);
								
			ctx.beginPath();
			
			// ctx.strokeStyle = "#fff";
			// ctx.moveTo(400,580);
			// ctx.lineTo(400,620);
			// ctx.stroke();
			
			// FPS METER
			
			// @exclude
			
			ctx.font = '16pt bold Trebuchet MS';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#666666";
			ctx.fillText(  "FPS:"+a.anim.fpsAvg+" - B:"+a.pool.objCnt[0] +" R:"+a.pool.objCnt[1]  , 650 , a.canvas.h/2  );
			
			// @endexclude
			
		ctx.restore();
	},
	menu: {
		levels: [{txt:'easy',st:1},{txt:'medium'},{txt:'hard'}],
		speed: [{txt:'slow',st:1},{txt:'medium'},{txt:'fast'}]
	},
	startPage: function(dT) {
		var ctx = a.canvas.ctxFg ;
						
		ctx.save();
			ctx.strokeStyle = '#adeaff';
			ctx.lineWidth=5;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#adeaff";
			
			
			
			ctx.save();
				ctx.translate(a.canvas.w2,a.canvas.h2-100) ;
				if (this.trans == 2) {
					ctx.globalAlpha = 1-this.transCnt ;
				}
				if (this.trans == 1) {
					ctx.globalAlpha = this.transCnt ;
				}
				
				ctx.beginPath();
				
				ctx.moveTo(-300,-350);
				ctx.lineTo(300,-350);
				//ctx.stroke();
								
				ctx.moveTo(0,120);
				ctx.lineTo(0,220);
				ctx.moveTo(0,-120);
				ctx.lineTo(0,-220) ;
				
				ctx.moveTo(120,0);
				ctx.lineTo(220,0);
				ctx.moveTo(-120,0);
				ctx.lineTo(-220,0) ;
				ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = '#000';
				ctx.lineWidth=40;
				ctx.arc(0,0,170,0,6.3,0) ;
				ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = '#adeaff';
				ctx.lineWidth=5;
				ctx.arc(0,0,190,0,6.3,0) ;
				ctx.moveTo(150,0);
				ctx.arc(0,0,150,0,6.3,0) ;
				ctx.stroke();
				
				ctx.save();
					ctx.rotate(6.29/20*this.animFr);
					ctx.beginPath();
					ctx.lineWidth = 20;
					
					for (var i = 0, l=6.29/20; i < 20; i++) {
						ctx.beginPath();
						ctx.strokeStyle = i<10 ? 'rgba(138,255,214,'+ ((i-5)/5) +')' : 'rgba(253,122,122,'+ ((i-15)/5) +')';
						ctx.arc(0,0,170, 0+i*l+0.03, l+i*l-0.03);
						ctx.stroke();
					}
				ctx.restore();
				
				ctx.beginPath();
				ctx.font = '30pt bold Trebuchet MS';
				ctx.fillText( "S T A R T" , 0,0);
			ctx.restore();
			
			ctx.font = 'small-caps 32pt Trebuchet MS';
			ctx.save();
				if (this.trans == 2) {
					ctx.translate(this.transCnt*-1000,0) ;
				}
				if (this.trans == 1) {
					ctx.translate((1-this.transCnt)*1500,0) ;
				}
				
				var title = "Duel of Elements";
				ctx.beginPath();
				
				ctx.save();
					ctx.fillStyle = "#fd7a7a";
					ctx.translate(a.canvas.w2 , 110);
					ctx.rotate(Math.PI);
					ctx.fillText( title, 0,0 );
				ctx.restore();
			ctx.restore();
			
			ctx.save();
				if (this.trans == 2) {
					ctx.translate(this.transCnt*1000,0) ;
				}
				if (this.trans == 1) {
					ctx.translate((1-this.transCnt)*-1500,0) ;
				}
								
				ctx.beginPath();
				ctx.fillText(  title , a.canvas.w2 , 190);
			ctx.restore();
			
			ctx.save();
				if (this.trans == 2) {
					ctx.translate(0,this.transCnt*1000) ;
				}
				if (this.trans == 1) {
					ctx.translate(0,(1-this.transCnt)*1500) ;
				}

				ctx.translate(475,1075);
				ctx.beginPath();
				ctx.arc(0,0,80,0,6.3);

				ctx.moveTo(60,0);

				ctx.arc(0,0,60,0,6.3);
				ctx.stroke();

				ctx.beginPath();
				ctx.font = 'small-caps 20pt Trebuchet MS';
				ctx.fillText(  "Tutorial" , 0 , 0 );
			ctx.restore();
			
			ctx.font = '20pt Trebuchet MS';
			
			ctx.save();
				if (this.trans == 2) {
					ctx.translate(this.transCnt*1000,0) ;
				}
				if (this.trans == 1) {
					ctx.translate((1-this.transCnt)*1500,0) ;
				}
				a.canvas.circSwitch(ctx,650,830,100,0,20,this.menu.levels,"#fd7a7a" ,"#adeaff","difficulty");
			ctx.restore();
			
			ctx.save();
				if (this.trans == 2) {
					ctx.translate(this.transCnt*-1000,0) ;
				}
				if (this.trans == 1) {
					ctx.translate((1-this.transCnt)*-1500,0) ;
				}
				a.canvas.circSwitch(ctx,220,930,80,1.047,20,this.menu.speed,"#fd7a7a" ,"#adeaff","game\nspeed");
			ctx.restore();
			
			// CLICK AREAS
			// ctx.strokeStyle = "#ff00ff";
			// ctx.lineWidth = 1;
			// a.touch.buttons.forEach(function(b){
				// ctx.beginPath();
				// ctx.arc(b.x,b.y,b.r,0,6.3);
				// ctx.stroke();
			// });
			
		ctx.restore();
	},
	endPage: function(dT) {
		var ctx = a.canvas.ctxFg ;
		
		ctx.save();
			ctx.translate(a.canvas.w2,a.canvas.h2) ;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#adeaff";
			ctx.font = '40pt Trebuchet MS';
			ctx.fillStyle = a.ply.win == 1 ? "#fd7a7a" :"#adeaff";
			
			ctx.save();
				if (this.trans == 2) {
					ctx.globalAlpha = this.transCnt > 0.5 ? (1-this.transCnt)*2 : 1 ;
				}
				// ctx.strokeStyle = '#adeaff';
				// ctx.lineWidth=5;
						
				ctx.beginPath();
				ctx.strokeStyle = '#adeaff';
				ctx.lineWidth=5;
				ctx.arc(0,0,220,0,6.3,0) ;
				ctx.moveTo(180,0);
				ctx.arc(0,0,180,0,6.3,0) ;
				ctx.stroke();
								
				ctx.save();
					if (this.trans == 1) {
						ctx.globalAlpha = this.transCnt > 0.75 ? (this.transCnt-0.75)*4 : 0 ;
					}
					ctx.beginPath();
					ctx.fillStyle = "#adeaff";
					ctx.font = '32pt bold Trebuchet MS';
					ctx.fillText( "R E S T A R T" , 0,0);
				ctx.restore();
				
				ctx.beginPath();
				ctx.lineWidth = 20;
				
				if (this.trans == 0 || this.trans == 2) {
					for (var i = 0, l=6.29/20; i < 20; i++) {
						ctx.beginPath();
						ctx.strokeStyle = a.ply.win == 1 ? "#fd7a7a" :"#adeaff";
						if (this.animRot*5 > i*l || this.done ) {
							ctx.arc(0,0,200, 0+i*l+0.03, l+i*l-0.03);
							if (i==19) this.done = 1;
						}
						
						ctx.stroke();
					}
				}
						
				ctx.beginPath();
								
				ctx.strokeStyle = '#adeaff';
				ctx.lineWidth=5;
				ctx.save();
					ctx.rotate(this.animRot);
					
					for (var i = 0, l=6.29/8; i < 8; i++) {
						ctx.save();
							ctx.rotate(l*i);
							ctx.save();
								if (this.trans == 1) {
									ctx.translate(0,(1-(this.transCnt<0.25?this.transCnt:0.25)*4) *-500);
								}
								ctx.beginPath();
								ctx.moveTo(0,-310);
								ctx.lineTo(40,-345) ;
								ctx.lineTo(-40,-345);
								ctx.closePath();
								ctx.stroke();	
							ctx.restore();
						ctx.restore();
					}
				ctx.restore();
			ctx.restore();
			
			var textRed = "You " + (a.ply.win == 1 ? "win" : "lose")  ;
			var textBlue = "You " + (a.ply.win == 1 ? "lose" : "win" )  ;
			ctx.save();
				ctx.fillStyle = "#adeaff" ;
				if (this.trans == 1) {
					ctx.translate(0,(1-this.transCnt)*1000) ;
				}
				if (this.trans == 2) {
					ctx.translate(0,this.transCnt*1000) ;
				}
				ctx.fillText( textBlue ,  0,450);
			ctx.restore();

			ctx.save();
				ctx.fillStyle = "#fd7a7a" ;
				ctx.rotate(3.1415);
				if (this.trans == 1) {
					ctx.translate(0,(1-this.transCnt)*1000) ;
				}
				if (this.trans == 2) {
					ctx.translate(0,this.transCnt*1000) ;
				}
				ctx.beginPath();
				ctx.fillText( textRed ,  0,450);
			ctx.restore() ;
		
		ctx.restore();
	}
}



// -------------------------------------- PLAYERS --------------------------------

a.ply = {
	win: "",
	'0': {},
	'1': {},
	cons: function(e,side) {
		this[side].energy-=e ;
		
		if ( this[side].energy < 1 ) {
			this[side].energy = 0;
			this.win = 1 - side ;
			// a.app.sta = 2;
			a.app.nextState() ; //changeState(1,2);
		}
		
		this[side].len = this[side].energy/100 * 40 * 18.5 ;
	},
	reset: function() {
		this[0].energy = this[1].energy = 100;
		this[0].len = this[1].len = 740;
	}
}

//---------------------------------------   OBJ POOL ----------------------------------

a.pool = {
	init: function(balls,defend,grav,speed) {
		this.balls = [];
		this.defend = [];
		this.grav = [];
		for (var i=0; i<balls; i++) {
			this.balls.push( new a.factory.ball({audioCtx: a.sfx.audioCtx, speed: speed}) );
		}
		//this.ballsCnt = [this.balls.length/2,this.balls.length/2];
		
		for (var i=0; i<defend; i++) {
			this.defend.push( new a.factory.defend({audioCtx: a.sfx.audioCtx}) );
		}
		//this.defCnt = [this.defend.length/2,this.defend.length/2] ;
		
		for (var i=0; i<grav; i++) {
			this.grav.push( new a.factory.grav() );
		}
		this.gravCnt = this.grav.length ;
		this.objCnt = [10,10] ;
	}
}

//--------------------------------------- constructors ---------------------------

a.factory = {
	ball: function(arg) {
		this.state = 0;
		this.animState = 0;
		this.r = 30 ;
		this.speed = arg && arg.speed;
				
		this.initSfx = function() {
			this.sfx = {
				ctx: arg.audioCtx,
				launch: arg.audioCtx.createGain(),
				explode: arg.audioCtx.createGain(),	
				bigEx:  arg.audioCtx.createGain(),	
				playLaunch: function() {
					var t0 = this.ctx.currentTime ;
					this.launch.gain.cancelScheduledValues(t0);
					this.launch.gain.setValueAtTime(0, t0);
					this.launch.gain.linearRampToValueAtTime(.1, t0 + 0.15);
					this.launch.gain.exponentialRampToValueAtTime(0.01, t0 + 0.6);
					this.launch.gain.setValueAtTime(0, t0+0.61);
				},
				playExp: function() {
					var t0 = this.ctx.currentTime ;
					this.explode.gain.cancelScheduledValues(t0);
					this.explode.gain.setValueAtTime(0, t0);
					this.explode.gain.linearRampToValueAtTime(1, t0 + 0.1);
					this.explode.gain.exponentialRampToValueAtTime(0.01, t0 + 0.55);
					this.explode.gain.setValueAtTime(0, t0+0.56);
				},
				playBigEx: function() {
					var t0 = this.ctx.currentTime ;
					this.bigEx.gain.cancelScheduledValues(t0);
					this.bigEx.gain.setValueAtTime(0, t0);
					this.bigEx.gain.linearRampToValueAtTime(3, t0 + 0.05);
					this.bigEx.gain.exponentialRampToValueAtTime(0.01, t0 + 1);
					this.bigEx.gain.setValueAtTime(0, t0+1.01);
				}
			}
			this.sfx.launch.gain.value = 0;
			this.sfx.explode.gain.value = 0;
			this.sfx.bigEx.gain.value = 0;
			a.sfx.noise.connect(this.sfx.launch);
			a.sfx.noise.connect(this.sfx.explode);
			a.sfx.bigPre.connect(this.sfx.bigEx);
			this.sfx.launch.connect(a.sfx.lchLp1);
			this.sfx.explode.connect(a.sfx.expLp1);
			this.sfx.bigEx.connect(a.sfx.bigLp1);
		}
		
		this.init = function(x,y,dir,side) {
			//this.v = 400 ;
			this.gConst = 	100000000 ;
			this.gConstM = -10000000;
			this.v = new a.v(this.speed,dir);
			this.expT = 0.2;
			this.side = side ? 1 : 0;
			this.rotConst = (1+Math.random()) * 2*(2*Math.random()&1)-1 ;
			this.p = new a.v(Math.sqrt(x*x+y*y), Math.atan2(y,x) );
			this.a = new a.v(0,dir);
			this.gra = new a.v(0,0);
			//this.sumGra = new a.v(0,0);
			
			this.dir = dir;
			this.state = 1;
			//a.pool.ballsCnt[this.side]--;
			a.pool.objCnt[this.side]--;
			
			a.sfx.audioSupport && this.sfx.playLaunch();
		};
		
		this.move = function(dT) {
			// calc gravity
			//this.gra.set(0,0);
			//this.sumGra.set(0,0);
			this.a.set(0,0);
			a.pool.grav.forEach(function(g) {
				if (g.state) {
					this.gra.set(g.p.v,g.p.a);
					this.gra.sub(this.p) ; //console.info(this.gra.v);
					// if (this.gra.v < 20) {
						// this.explode();
					// }
					this.a.addS((g.sign*this.gConst+(1-g.sign)*this.gConstM)/(this.gra.v*this.gra.v),this.gra.a);
				}
			},this);
			
			//gra.sub(this.p);
			
			// this.a.set(1000/(gra.v*gra.v)*10000,gra.a);
			
			this.v.addS(this.a.v * dT,this.a.a) ;
			if (this.v.v > 3000) this.v.v = 3000 ;
			
			// MOVE
			this.p.addS(this.v.v * dT,this.v.a) ;
			
			this.x =  this.p.v * Math.cos(this.p.a)  ;
			this.y =  this.p.v * Math.sin(this.p.a)  ;
			
			// BORDER
			if (this.x < 0 || this.x > a.canvas.w ) {
				this.die();
			}
			
			// CHECK GOAL
			if ((this.y<0 || this.y > a.canvas.h) && this.state == 1) {
				//a.ply[ this.y < a.canvas.h / 2 ? 0 : 1 ].score++ ;
				var hitSide = this.y < a.canvas.h / 2 ? 1 : 0 ;
				a.ply.cons(5,hitSide) ;
				//this.die();
				this.explode();
				a.sfx.audioSupport && this.sfx.playBigEx();
				a.app.shake[hitSide] = 0.55 ;
			}
			
			if (this.state == 2) {
				this.expT-= dT;
				if (this.expT<0) {
					this.die();
				}
			}						
		};
		
		this.explode = function() {
			this.state = 2 ;
			//this.v=50;
			this.v.v = 50;
			a.sfx.audioSupport && this.sfx.playExp();
		};
		
		this.die =  function() {
			this.state = 0 ;
			// a.pool.ballsCnt[this.side]++;
			a.pool.objCnt[this.side]++;
		};
		
		this.draw = function(ctx,animFr,animRot) {
			ctx.save();
			ctx.translate(Math.round(this.x),Math.round(this.y));
			ctx.rotate(animRot*this.rotConst);
			if (this.state == 2) {
				ctx.drawImage(a.sp[this.side].exp[19-Math.round(this.expT*95)], -64, -64);
			}
			else {
				ctx.drawImage(a.sp[this.side].p[animFr>>1], -64, -64);
			}
						
			ctx.restore();
		}
		
		a.sfx.audioSupport && this.initSfx();
	},
	defend: function(arg) {
		this.state = 0;
		this.animState = 0;
		this.v = 20;
		this.se = new a.v(0,0);
		this.sb = new a.v(0,0);
		this.eb = new a.v(0,0);
		this.len = 0;
						
		this.initSfx = function(arg) {
			this.sfx = {
				ctx: arg.audioCtx,
				launch: arg.audioCtx.createGain(),
				playLaunch: function() {
					var t0 = this.ctx.currentTime ;
					this.launch.gain.cancelScheduledValues(t0);
					this.launch.gain.setValueAtTime(0, t0);
					this.launch.gain.linearRampToValueAtTime(.3, t0 + 0.1);
					this.launch.gain.setValueAtTime(0.3, t0 + 0.2);
					this.launch.gain.linearRampToValueAtTime(0.01, t0 + 0.3);
					this.launch.gain.setValueAtTime(0, t0+0.31);
				}
			}
			
			this.sfx.launch.gain.value = 0;
			a.sfx.zzzzOsc.connect(this.sfx.launch);
			this.sfx.launch.connect(a.sfx.zzzzFilter);
		}
		
		this.init = function(x,y,x2,y2,side,rev) {
			this.side = side ? 1 : 0;
			
			this.startX = rev ? x2 : x;
			this.startY = rev ? y2 : y;
			this.endX = rev ? x : x2;
			this.endY = rev ? y : y2;
			
			this.a =  Math.atan2((this.endY-this.startY),(this.endX-this.startX) ) ;
			
			this.state = 1;
			// a.pool.defCnt[this.side]--;
			a.pool.objCnt[this.side]--;
			
			a.sfx.audioSupport && this.sfx.playLaunch();
		};
		
		this.move = function(dT) {
			
			// MOVE
			this.startX+= this.v * dT * Math.cos(this.a) ;
			this.endX-= this.v * dT * Math.cos(this.a);
			this.startY+= this.v * dT * Math.sin(this.a);
			this.endY-= this.v * dT * Math.sin(this.a) ;
			
			this.len = Math.sqrt( (this.startX-this.endX)*(this.startX-this.endX) + (this.startY-this.endY)*(this.startY-this.endY)  );
			this.len2 = this.len>>1 ;
			
			// DIE
			if ( (this.endX - this.startX) < 5 ) {
				this.state = 0 ;
				//a.pool.defCnt[this.side]++;
				a.pool.objCnt[this.side]++;
			}
		};
				
		this.hit = function() {
			this.move(3) ;
		}
		
		this.draw = function(ctx,animFr) {
			ctx.save();
				
			ctx.translate(Math.round(this.startX),Math.round(this.startY));
			ctx.rotate(this.a);
			
			ctx.drawImage(a.sp[this.side].d[animFr>>1],                0,0,this.len2+20,64,-20		   ,-32,this.len2+20,64);
			ctx.drawImage(a.sp[this.side].d[animFr>>1],840-this.len2-20,0,this.len2+20,64, this.len2   ,-32,this.len2+20,64);
							
			ctx.restore();
		}	
		
		a.sfx.audioSupport && this.initSfx(arg);
	},
	grav: function(arg) {
		this.state = 0;
		this.animState = 0;
								
		this.init = function(sign,x,y) {
			this.sign = sign ? 1 : 0;
			this.state = 1;
			this.lifeTime = 4 + 5*Math.random() ;
			
			this.x = x || Math.round(2+16*Math.random())*40+(3+Math.random()*6);
			this.y = y || Math.round(10+10*Math.random())*40+(3+Math.random()*6);
			this.p = new a.v(Math.sqrt(this.x*this.x+this.y*this.y), Math.atan2(this.y,this.x) );
			
			a.pool.gravCnt--;			
		};
		
		this.move = function(dT) {
			this.lifeTime-= dT;
			
			// DIE
			if ( this.lifeTime < 0 ) {
				this.state = 0 ;
				a.pool.gravCnt++;
			}
		};
						
		this.draw = function(ctx,animFr) {
			ctx.save();
				
				ctx.translate(Math.round(this.x),Math.round(this.y));
							
				ctx.drawImage(a.sp.well[this.sign][this.sign ? animFr: 39-animFr],   -64,-64 );			
				// ctx.strokeStyle = "#fff";
				// ctx.lineWidth = 6;
				// ctx.font = '18pt bold Trebuchet MS';
				// ctx.beginPath();
				// ctx.fillStyle = "#888";
				// ctx.arc(0,0,20,0,6.3);
				// ctx.stroke();
				// ctx.fill();
				
				// ctx.beginPath();
				// ctx.fillStyle = "#fff";
				// ctx.fillText(this.sign?"+":"-",0,0);
			
			ctx.restore();
		}	
	}
}

window.onload = function() { a.app.start() } ;

