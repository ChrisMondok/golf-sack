define(['js/Actor.js', 'js/AimingCircle.js', 'js/Enemy.js', 'js/Floor.js', 'js/geometry.js'], function(Actor, AimingCircle, Enemy, Floor, geometry) {
	function Ball(level, position) {
		Actor.apply(this, [level]);	

		this.body = Matter.Bodies.circle(position.x, position.y, 5, {density:0.005, restitution:0.5});

		level.addToWorld(this.body);

		this.level.fg.push(this);

		this.history = [];
	};

	Ball.inherits(Actor, function(base) {

		Ball.prototype.dragCoefficient = 0.001;

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

			while(this.history.length > this.maxHistoryLength)
				this.history.pop();
			this.history.unshift({x: this.body.position.x, y: this.body.position.y, speed: this.body.speed});
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

		Ball.prototype.destroy = function() {
			base.destroy.apply(this, arguments);
			if(this.aimingCircle)
				this.aimingCircle.destroy();

			this.level.removeFromWorld(this.body);
		};

		Ball.prototype.createAimingCircle = function() {
			this.aimingCircle = new AimingCircle(this.level, this.body);
		};
	});
	
	return Ball;
});
