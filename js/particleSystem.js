var particleDefaultSettings = {
	colors:  [ '#FFCC33', '#FFCC00'],
	alpha:0.5
};

var particleSystemDefaultSettings = {
	angleRange: {
		min:0,
		max:360
	},
	lifeRange: {
		min:5000,
		max: 30000
	},
	velocity:{
		min: 1,
		max: 5
	},
	sizeContraints: {
		x:0,
		y: 0,
		height:400,
		width:600
	},
	originConstraints: {
		x:250,
		y: 250,
		height:100,
		width:100
	},
	gravity: {
		x:5, 
		y:0
	},
	defaultSprites: 1, 
	radius:10
};

var Particle = function( overrideSettings ) {
	this._settings = $.extend(overrideSettings, particleDefaultSettings);

	this._totalTime = 0;

	this._position =  {
		x:this._settings.position.x,
		y: this._settings.position.y
	};

	var angleInRadians = (this._settings.angle * Math.PI) / 180;
	this._velocity = {
		x: this._settings.velocity * Math.cos( angleInRadians ),
		y: this._settings.velocity * Math.sin( angleInRadians )
	};

	this._life = this._settings.life;
	this._radius = this._settings.radius;
	this._alpha = this._settings.alpha ;
	this._color = this._settings.colors[Math.floor((Math.random() * this._settings.colors.length))];
};


Particle.prototype.getPosition = function(){
	return this._position;
};

Particle.prototype.update = function( timeDelta ) {
	this._life -= timeDelta;

	//Use the total time elapsed for the movement

	//Convert the time into seconds - this makes the speed 1px/seconds
	this._totalTime += timeDelta/100;

	if ( this._life > 0 ) {
		var ageRatio = this._life / this._settings.life * this._settings.alpha;
		this._alpha = ageRatio;

		this._position.y = this._settings.position.y + (this._velocity.y * this._totalTime) + (0.5 * this._settings.gravity.y * (this._totalTime * this._totalTime));

		this._position.x = this._settings.position.x + (this._velocity.x * this._totalTime) + (0.5 * this._settings.gravity.x * (this._totalTime * this._totalTime));
	}
};

Particle.prototype.draw = function( ctx ) {
	ctx.save();
	//Soft glow
	ctx.shadowColor = this._color
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 20;

	ctx.fillStyle = this._color;
	// draw a circle centered on the particle's location, sized to the particle
	ctx.beginPath();
	ctx.globalAlpha = this._alpha;

	ctx.arc( this._position.x, this._position.y, this._radius, 0, Math.PI * 2, true );
	ctx.closePath();
	ctx.fill();
	ctx.restore();
};

var ParticleSystem = function(overrideSettings) {
	var that = this;
	this._settings = $.extend( particleSystemDefaultSettings, overrideSettings );
	this._particleStorage = [];

	this._createParticles(this._settings.defaultSprites);
};

ParticleSystem.prototype._createParticles = function( amount ) {
	for ( var i = 0; i < amount; i++ ) {
		var settings = {
			position: {
				x: this._randomIntFromInterval(this._settings.originConstraints.x, this._settings.originConstraints.x + this._settings.originConstraints.width ),
				y:  this._randomIntFromInterval(this._settings.originConstraints.y, this._settings.originConstraints.x + this._settings.originConstraints.height)
			},
			angle: this._randomIntFromInterval(this._settings.angleRange.min, this._settings.angleRange.max),
			life: this._randomIntFromInterval(this._settings.lifeRange.min, this._settings.lifeRange.max),
			velocity: this._randomIntFromInterval(this._settings.velocity.min, this._settings.velocity.max), 
			radius: this._settings.radius, 
			gravity: this._settings.gravity
		};

		this._particleStorage.push( new Particle( settings ) );
	}
};

ParticleSystem.prototype.update = function( timeDelta ) {
	for ( var i = 0; i < this._particleStorage.length; i++ ) {
		this._particleStorage[i].update( timeDelta );
	}
	this._createParticles(this._settings.defaultSprites);
};

ParticleSystem.prototype.updateSettings = function(settings) {
	this._settings.defaultSprites = settings.defaultSprites;
	this._settings.radius = settings.radius;
	this._settings.gravity = settings.gravity;
};

ParticleSystem.prototype.draw = function( ctx ) {
	for ( var i = 0; i < this._particleStorage.length; i++ ) {
		var pos = this._particleStorage[i].getPosition();
		var constrains = this._settings.sizeContraints;
		if((pos.x >constrains.x && pos.x < constrains.x + constrains.width) && ( pos.y > constrains.y &&  pos.y < constrains.y + constrains.height)) {
			this._particleStorage[i].draw( ctx );
					if(i === 1){
			console.log(JSON.stringify(this._particleStorage[i]._position))
		}
		}

	}
};

ParticleSystem.prototype._randomIntFromInterval = function(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};