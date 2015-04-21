define(['js/Actor.js', 'js/AimingCircle.js', 'js/Enemy.js', 'js/Floor.js', 'js/Water.js', 'js/BloodFountain.js', 'js/geometry.js', 'js/noiseSourceFactory.js', 'js/playerInput.js'],
	function(Actor, AimingCircle, Enemy, Floor, Water, BloodFountain, geometry, noiseSourceFactory, playerInput) {

	var getImageDataIsFuxored = false;

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

		Ball.prototype.draw = function(render) {

			var ctx = render.context;
			
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.strokeStyle = "black";
			ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			
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

			if(playerInput.getWantsToMulligan()) {
				this.mulligan();
				return;
			}

			if(this.level.getActorsOfType(Water).some(function(water) {
				return Matter.Vertices.contains(water.vertices, this.body.position);
			}, this)) {
				this.level.playSoundAtPoint("sploosh", this.body.position);
				this.mulligan();
				return;
			}

			var previewSize = 128;

			var render = this.level.engine.render;
			render.controller.renderCenteredOn(this.level.engine, this.body.position);

			if(!getImageDataIsFuxored) {
				try {
					this.imageData = render.context.getImageData(render.canvas.width/2 - previewSize/2, render.canvas.height/2 - previewSize/2, previewSize, previewSize);
				} catch (e) {
					getImageDataIsFuxored = true;
				}
			}
		};

		Ball.prototype.drawHud = function(render) {
			var viewport = render.controller.getVisibleBounds(this.level.engine);

			if(Matter.Bounds.contains(viewport, this.body.position))
				return;

			if(!this.imageData)
				return;

			var screenspacePosition = Matter.Vector.sub(Matter.Vector.sub(this.body.position, viewport.min), {x: this.imageData.width / 2, y: this.imageData.height / 2});

			var x = screenspacePosition.x.clamp(0, render.canvas.width - this.imageData.width);
			var y = screenspacePosition.y.clamp(0, render.canvas.height - this.imageData.height);

			render.context.putImageData(this.imageData, x, y);

			render.context.beginPath();
			render.context.moveTo(x, y);
			render.context.lineTo(x + this.imageData.width, y);
			render.context.lineTo(x + this.imageData.width, y + this.imageData.height);
			render.context.lineTo(x, y + this.imageData.height);
			render.context.closePath();
			render.context.stroke();
		};

		Ball.prototype.adjustFriction = function() {
			var baseFriction = this.body.speed > this.SLOW_DOWN_UNDER_THIS_SPEED ? 0.01 : 0.5;

			var groundFriction = this.level.getActorsOfType(Floor).filter(function(floor) {
				return Matter.Vertices.reallyContains(floor.vertices, this.body.position);
			}, this).map('friction').max() || 0.01;

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

			level.score++;

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

				if(!enemy.isDead() && geometry.lineSegmentCircleIntersection(a, b, enemy.position, r)) {
					enemy.kill();
					var direction = Matter.Vector.angle({x: 0, y: 0}, this.body.velocity);
					new BloodFountain(this.level, enemy.position, direction);
				}

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

			this.panner.setPosition(this.body.position.x, this.body.position.y, 0);
			this.panner.setVelocity(this.body.velocity.x, this.body.velocity.y, 0);

			var gain = (this.body.frictionAir * (Math.pow(this.body.speed, 1.25) / 30)).clamp(0, 1);
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

			this.panner = audioContext.createPanner();
			this.panner.setOrientation(0, 0, 1);
			this.panner.refDistance = 100;
			this.panner.maxDistance = 10000000;

			this.noise.connect(this.frictionFilter);
			this.frictionFilter.connect(this.speedGain);
			this.speedGain.connect(this.panner);
			this.panner.connect(audioContext.destination);
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
		
		Ball.prototype.sink = function(hole) {
			this.destroy();
			this.level.win();
		}
	});
	
	return Ball;
});
