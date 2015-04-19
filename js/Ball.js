define(['js/Actor.js', 'js/AimingCircle.js'], function(Actor, AimingCircle) {
	function Ball(level, position) {
		Actor.apply(this, [level]);	

		this.body = Matter.Bodies.circle(position.x, position.y, 5, {density:0.005, restitution:0.5});

		level.addToWorld(this.body);

		this.level.fg.push(this);

		this.history = [];

	};

	Ball.inherits(Actor, function(base) {

		Ball.prototype.dragCoefficient = 0.001;

		Ball.prototype.draw = function(ctx) {
			
			// The ball itself is already drawn as a body. To add a sprite, do it here?
			
			ctx.strokeStyle = "cyan";

			if(this.lastDrag) {
				ctx.beginPath();
				ctx.moveTo(this.lastDrag.position.x, this.lastDrag.position.y);
				var dest = Matter.Vector.add(this.lastDrag.position, Matter.Vector.mult(this.lastDrag.force, 1000000));
				ctx.lineTo(dest.x, dest.y);
				ctx.stroke();
			}

			ctx.beginPath();
			ctx.moveTo(this.body.position.x, this.body.position.y);
			for(var i = 0; i < this.history.length; i++) {
				ctx.lineTo(this.history[i].x, this.history[i].y);
			};
			ctx.stroke();

		};
		
		Ball.prototype.SLOW_DOWN_UNDER_THIS_SPEED = 0.3;

		Ball.prototype.JUST_CONSIDER_THIS_STOPPED_OKAY = 0.01;

		Ball.prototype.tick = function(tickEvent) {

			this.body.frictionAir = this.body.speed > this.SLOW_DOWN_UNDER_THIS_SPEED ? 0.01 : 0.5;

			this.applyMagnusForce(tickEvent);

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

			//this.history.unshift({x: this.body.position.x, y: this.body.position.y});
		};

		Ball.prototype.applyMagnusForce = function(tickEvent) {
			var airDensity = 0.00001;

			var vortexStrength = 2 * Math.PI * this.body.angularSpeed * this.body.circleRadius.squared();

			var forceMagnitude = airDensity * this.body.speed * vortexStrength * tickEvent.dt;

			var forceDirection = Matter.Vector.rotate(Matter.Vector.normalise(this.body.velocity), this.body.angularVelocity > 0 ? Math.PI/2 : - Math.PI/2);

			Matter.Body.applyForce(this.body, this.body.position, Matter.Vector.mult(forceDirection, forceMagnitude));
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
