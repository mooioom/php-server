/*

	DebutJS
	-------
	author  : Eldad Eliyahu Levi
	version : 1.0
	license : mit

*/

Element.prototype.Debut = function( settings ){

	var Debut = Element.prototype.Debut;

	this.classList.add('debut');

	var defaults = {

		duration : 0.2,
		autoplay : null,
		easing   : 'ease-out',
		effect   : 'fade', // slideup, slidedown, slideright, slideleft, fade
		pager    : {
			type     : 'buttons',
			position : 'sw',
			class    : 'debut-pager'
		}

	}

	this.settings = settings || {};

	for(var x in defaults) if(typeof this.settings[x] == 'undefined') this.settings[x] = defaults[x];

	this.pages = [].filter.call(this.children,function(a){return a.tagName=='PAGE'});

	this.canvas = document.createElement('canvas');
	this.ctx    = this.canvas.getContext('2d');

	this.rect = this.getBoundingClientRect();

	this.width  = this.settings.width  || this.rect.width;
	this.height = this.settings.height || this.rect.height;

	this.canvas.width  = this.width;
	this.canvas.height = this.height;

	this.locked = false;

	this.page = 0;

	this.onwheel = function(e){

		if( this.settings.autoplay ) return;

		e.stopPropagation();
		e.preventDefault();

		var forward = e.deltaY > 0;

		this.play( null, forward );

	}.bind(this);

	this.appendChild(this.canvas);

	console.log('Debut',this,this.pages);

	for(var i=0;i<this.pages.length;i++){

		if(!this.pages[i].getAttribute('image')) continue;

		this.pages[i].debutPageId = i;

		var img = new Image;
		img.src = this.pages[i].getAttribute('image');
		this.pages[i].image = img;
	}

	this.play = function( page, forward ){

		if(this.locked) return;

		this.locked = true;

		var page_from = this.page;
		var page_to   = page || (forward ? (page_from + 1) : (page_from - 1));

		if(page == 0) page_to = 0;

		if(page_to < 0) page_to = this.pages.length-1;
		if(page_to >= this.pages.length) page_to = 0;

		this.page = page_to;

		page_from = this.pages[ page_from ];
		page_to = this.pages[ page_to ];

		if(this.settings.pager) page_to.$pagerButton.select();

		this.playBackground( page_from, page_to, forward );
		this.playContent( page_from, page_to, forward );

	}

	this.playBackground = function( page_from, page_to, forward ){

		var DURATION = this.settings.duration;
		var SPEED = 1;

		var STEP = SPEED / (DURATION * 100);

		var TIME = 0;

		var EASING = 'easeInOutQuart';

		var effect = page_from.getAttribute('effect') || this.settings.effect;

		effect = Debut.Effects[effect];

		this.interval = setInterval(function(){

			var EASE_AMOUNT = Debut.EasingFunctions[EASING](TIME);

			effect.call(this,page_from,page_to,EASE_AMOUNT,forward);

			if(TIME >= 1) {
				clearInterval(this.interval);
				this.page = [].indexOf.call(this.pages,page_to)
				this.locked = false;
			}

			TIME += STEP;

		}.bind(this), SPEED );

	}

	this.animate = function( page, type ){

		page.style.display  = 'block';
		page.style.position = 'absolute';

		var elements = page.querySelectorAll('['+type+']');

		var animate = function(c,o){

			o.classList.remove('debut-delay');

			o.className.replace(c + '-start','');
			o.className.replace(c,'');

			o.classList.add( c + '-start' );

			setTimeout(function(c,o){
				o.style.transition = 'all '+this.settings.duration+'s ' + this.settings.easing;
				o.classList.add(c);
			}.bind(this,c,o),20);

			setTimeout(function(c,o){
				o.classList.remove( c+ '-start' );
				o.classList.remove(c);
			}.bind(this,c,o),this.settings.duration*1000);

		}.bind(this);

		for(var i=0;i<elements.length;i++){
			var o = elements[i];

			var classes = o.getAttribute(type).split(' ');

			classes.forEach(function(c){

				var delay = o.getAttribute(type+'-delay');

				if(delay){
					o.classList.add('debut-delay');
					setTimeout(animate.bind(this,c,o),delay*1000);
					return;
				}

				animate.call(this,c,o);

			}.bind(this));
		}

	}

	this.playContent = function( page_from, page_to, forward ){

		this.animate(page_from,'out');
		this.animate(page_to,'in');

		setTimeout(function(page_from){
			if(page_from.debutPageId==this.page) return;
			page_from.style.display = 'none';
		}.bind(this,page_from),this.settings.duration*1000);

	}

	this.hideAll = function(){
		for(var i=0;i<this.pages.length;i++) {
			this.pages[i].style.display = 'none';
		}
	}

	this.draw = function( page ){

		var page = page || this.page;

		page = this.pages[page];

		this.hideAll();

		page.style.display  = 'block';
		page.style.position = 'absolute';

		if(page.image) page.image.onload = function(){

			this.animate(page,'in');

			this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
			this.ctx.drawImage(page.image,0,0,window.innerWidth,window.innerHeight);

		}.bind(this); else this.animate(page,'in');

	}.bind(this);

	this.drawPager = function(){

		this.$pager = document.createElement('div');
		this.appendChild(this.$pager);

		this.$pager.className = 'debut-pager';

		if(this.settings.pager && this.settings.pager.class) this.$pager.className = this.settings.pager.class;

		for(var i=0;i<this.pages.length;i++){

			var $pagerButton = document.createElement('div');

			$pagerButton.className = 'debut-pager-page';

			if(i == this.page) $pagerButton.classList.add('debut-pager-page-selected');

			this.pages[i].$pagerButton = $pagerButton;

			$pagerButton.select = function($p){
				for(var i=0;i<this.pages.length;i++) this.pages[i].$pagerButton.classList.remove('debut-pager-page-selected');
				$p.classList.add('debut-pager-page-selected');
			}.bind(this,$pagerButton);

			$pagerButton.onclick = function(i,$p,e){
				if(i==this.page) return;
				$p.select();
				this.play(i);
			}.bind(this,i,$pagerButton);

			this.$pager.appendChild($pagerButton);
		}
	}

	if(this.settings.pager) this.drawPager();

	this.draw();

	if( this.settings.autoplay ){
		setInterval(this.play.bind(this),this.settings.autoplay*1000);
	}

	return this;

}

Element.prototype.Debut.EasingFunctions = {
  linear: function (t) { return t },
  easeInQuad: function (t) { return t*t },
  easeOutQuad: function (t) { return t*(2-t) },
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  easeInCubic: function (t) { return t*t*t },
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  easeInQuart: function (t) { return t*t*t*t },
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  easeInQuint: function (t) { return t*t*t*t*t },
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

Element.prototype.Debut.Effects = {
	slideup : function(a,b,ease,d){

			var h = this.height;
			var w = this.width;

			var p = h * ease * (d?1:-1);

			this.ctx.clearRect(0,0,w,h);

			a.image && this.ctx.drawImage(a.image,0,-p*(d?1:-1),w,h);
			b.image && this.ctx.drawImage(b.image,0,h-p*(d?1:-1),w,h);

	},
	slidedown : function(a,b,ease,d){

			var h = this.height;
			var w = this.width;
			
			var p = h * ease;

			this.ctx.clearRect(0,0,w,h);

			a.image && this.ctx.drawImage(a.image,0,p,w,h);
			b.image && this.ctx.drawImage(b.image,0,-h+p,w,h);
	},
	slideright : function(a,b,ease,d){

			var h = this.height;
			var w = this.width;
			
			var p = w * ease * (d?1:-1);

			this.ctx.clearRect(0,0,w,h);

			a.image && this.ctx.drawImage(a.image,p,0,w,h);
			b.image && this.ctx.drawImage(b.image,(d?-w:w)+p,0,w,h);

	},
	slideleft : function(a,b,ease,d){

			var h = this.height;
			var w = this.width;
			
			var p = w * ease * (d?-1:1);

			this.ctx.clearRect(0,0,w,h);

			a.image && this.ctx.drawImage(a.image,p,0,w,h);
			b.image && this.ctx.drawImage(b.image,(d?w:-w)+p,0,w,h);

	},
	fade : function(a,b,ease,d){
		var h = this.height;
		var w = this.width;
		this.ctx.save();
        this.ctx.globalAlpha = ease;
        b.image && this.ctx.drawImage(b.image,0,0,w,h);
        this.ctx.restore();
	}
}