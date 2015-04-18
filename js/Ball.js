define(['js/Actor.js', 'js/AimingCircle.js'], function(Actor, AimingCircle) {
	function Ball(level, body) {
		Actor.apply(this, [level]);	

		this.body = body;

		this._tickBound = this.tick.bind(this);
		Matter.Events.on(this.level.engine, 'tick', this._tickBound);
		
	};

	Ball.inherits(Actor, function(base) {

		Ball.prototype.draw = function(ctx) {
			
			// The ball itself is already drawn as a body. To add a sprite, do it here?
			
			if(this.aimingCircle)
				this.aimingCircle.draw(ctx);
		
		};
		
		Ball.prototype.STOPPED_SPEED = 0.05;

		Ball.prototype.tick = function() {

			this.body.frictionAir = this.body.speed > this.STOPPED_SPEED ? 0.01 : 1;

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

		Ball.prototype.destroy = function() {
			base.destroy.apply(this, arguments);
			if(this.aimingCircle)
				this.aimingCircle.destroy();
			Matter.Events.off(this.level.engine, 'tick', this._tickBound);
		};

		Ball.prototype.createAimingCircle = function() {
			this.aimingCircle = new AimingCircle(this.level, this.body);
		};
	});
	
	return Ball;
});
