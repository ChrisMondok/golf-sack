define(['js/Actor.js', 'js/AimingCircle.js'], function(Actor, AimingCircle) {
	function Ball(level, body) {
		Actor.apply(this, [level]);	

		this.body = body;

	};

	Ball.inherits(Actor, function(base) {

		Ball.prototype.dragCoefficient = 0.1;

		Ball.prototype.draw = function(ctx) {
			
			// The ball itself is already drawn as a body. To add a sprite, do it here?
			
			if(this.aimingCircle)
				this.aimingCircle.draw(ctx);
		
		};
		
		Ball.prototype.STOPPED_SPEED = 0.05;

		Ball.prototype.tick = function(tickEvent) {

			this.body.frictionAir = this.body.speed > this.STOPPED_SPEED ? 0 : 1;

			this.applyDrag(tickEvent);

			if(!this.body.speed) {
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

		Ball.prototype.applyDrag = function(tickEvent) {
			
		};

		Ball.prototype.destroy = function() {
			base.destroy.apply(this, arguments);
			if(this.aimingCircle)
				this.aimingCircle.destroy();
		};

		Ball.prototype.createAimingCircle = function() {
			this.aimingCircle = new AimingCircle(this.level, this.body);
		};
	});
	
	return Ball;
});
