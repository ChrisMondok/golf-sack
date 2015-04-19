define(['js/Actor.js', 'js/AimingCircle.js', 'js/Enemy.js', 'js/Floor.js', 'js/Water.js', 'js/geometry.js', 'js/noiseSourceFactory.js'],
	function(Actor, AimingCircle, Enemy, Floor, Water, geometry, noiseSourceFactory) {
	function Ball(level, position) {
		Actor.apply(this, [level]);	

		this.body = Matter.Bodies.circle(position.x, position.y, 5, {density:0.005, restitution:0.5});
		level.addToWorld(this.body);

		this.setMulliganPosition();

		level.fg.push(this);

		this.hasSound = !!level.audioContext;

		if(this.hasSound)
			this.setUpSound(level.audioContext);

		this.history = [];
	}

	Ball.inherits(Actor, function(base) {

		Ball.prototype.lethalSpeed = 5;

		Ball.prototype.maxHistoryLength = 50;

		Ball.prototype.draw = function(ctx) {
			
			ctx.save();

			ctx.globalAlpha = 0.5;

			for(var i = 1; i < this.history.length; i++) {
				ctx.beginPath();
				ctx.lineWidth = this.body.circleRadius * 1.5 * (1 - (i-1)/this.history.length);
				ctx.strokeStyle = this.history[i].speed > this.lethalSpeed ? "red" : "blue";
				ctx.moveTo(this.history[i - 1].x, this.history[i - 1].y);
				ctx.lineTo(this.history[i].x, this.history[i].y);
				ctx.stroke();
			}

			ctx.restore();

		};
		
		Ball.prototype.SLOW_DOWN_UNDER_THIS_SPEED = 0.3;

		Ball.prototype.JUST_CONSIDER_THIS_STOPPED_OKAY = 0.01;

		Ball.prototype.tick = function(tickEvent) {

			this.adjustFriction();

			this.applyMagnusForce();

			this.updateAimingCircle();

			if(this.body.speed > this.lethalSpeed)
				this.killEnemies();

			if(this.level.pointIsOutOfBounds(this.body.position))
				this.mulligan();

			this.updateHistory();

			if(this.hasSound)
				this.tickSound();

			if(this.level.getActorsOfType(Water).some(function(water) {
				return Matter.Vertices.contains(water.vertices, this.body.position);
			}, this))
				this.mulligan();

		};

		Ball.prototype.adjustFriction = function() {
			var baseFriction = this.body.speed > this.SLOW_DOWN_UNDER_THIS_SPEED ? 0 : 0.5;

			var groundFriction = this.level.getActorsOfType(Floor).filter(function(floor) {
				return Matter.Vertices.contains(floor.vertices, this.body.position);
			}, this).map('friction').max() || 0;

			this.body.frictionAir = Math.max(baseFriction, groundFriction);
		};

		Ball.prototype.applyMagnusForce = function() {
			var airDensity = 0.0000002;

			var vortexStrength = 2 * Math.PI * this.body.angularSpeed * this.body.circleRadius.squared();

			var forceMagnitude = airDensity * this.body.speed * vortexStrength;

			var forceDirection = Matter.Vector.rotate(Matter.Vector.normalise(this.body.velocity), this.body.angularVelocity > 0 ? Math.PI/2 : - Math.PI/2);

			Matter.Body.applyForce(this.body, this.body.position, Matter.Vector.mult(forceDirection, forceMagnitude));
		};

		Ball.prototype.updateAimingCircle = function() {
			if(this.body.speed < this.JUST_CONSIDER_THIS_STOPPED_OKAY) {
				if(!this.aimingCircle)
					this.createAimingCircle();
			}
			else {
				if(this.aimingCircle) {
					this.aimingCircle.destroy();
					this.aimingCircle = null;
				}
			}
		};

		Ball.prototype.mulligan = function() {
			var level = this.level;
			var mp = this.mulliganPosition;

			setTimeout(function() {
				new Ball(level, mp);
			}, 1000);

			this.destroy();
		};

		Ball.prototype.setMulliganPosition = function() {
			this.mulliganPosition = Matter.Common.extend({}, this.body.position);
		};

		Ball.prototype.killEnemies = function() {
			var enemies = this.level.getActorsOfType(require('js/Enemy.js'));
			enemies.forEach(function(enemy) {
				var a = this.body.positionPrev;
				var b = this.body.position;
				var r = enemy.radius + this.body.circleRadius;

				if(geometry.lineSegmentCircleIntersection(a, b, enemy.position, r))
					enemy.kill();

			}, this);
		};

		Ball.prototype.updateHistory = function() {
			while(this.history.length > this.maxHistoryLength)
				this.history.pop();
			this.history.unshift({x: this.body.position.x, y: this.body.position.y, speed: this.body.speed});
		};

		Ball.prototype.tickSound = function() {
			var frequency = (9600 + Math.log10(this.body.frictionAir) * 3200).clamp(0, 9600);
			this.frictionFilter.frequency.value = frequency;

			var gain = (this.body.frictionAir * (Math.pow(this.body.speed, 1.25) / 40)).clamp(0, 1);
			this.speedGain.gain.value = gain;
		};

		Ball.prototype.setUpSound = function(audioContext) {
			this.noise = noiseSourceFactory(audioContext, 2);
			this.noise.loop = true;
			this.noise.start(0);

			this.frictionFilter = audioContext.createBiquadFilter();
			this.frictionFilter.type = 0;
			this.frictionFilter.frequency.value = 0;

			this.speedGain = audioContext.createGain();
			this.speedGain.gain.value = 0;

			this.noise.connect(this.frictionFilter);
			this.frictionFilter.connect(this.speedGain);
			this.speedGain.connect(audioContext.destination);
		};

		Ball.prototype.destroy = function() {
			base.destroy.apply(this, arguments);
			if(this.aimingCircle)
				this.aimingCircle.destroy();

			this.level.removeFromWorld(this.body);

			if(this.hasSound) {
				this.tearDownSound();
			}
		};

		Ball.prototype.tearDownSound = function() {
			this.noise.stop();
			this.noise.disconnect();
			this.frictionFilter.disconnect();
			this.speedGain.disconnect();
		};

		Ball.prototype.createAimingCircle = function() {
			this.aimingCircle = new AimingCircle(this.level, this);
		};
	});
	
	return Ball;
});
