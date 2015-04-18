define(['js/Actor.js', 'js/AimingCircle.js'], function(Actor, AimingCircle) {
	function Ball(body) {
		
		this.body = body;
		this.aimingCircle = new AimingCircle(this.body);
		
	};

	Ball.inherits(Actor, function(base) {

		Ball.prototype.draw = function(ctx) {
			
			// The ball itself is already drawn as a body. To add a sprite, do it here?
			
			if(this.aimingCircle)
				this.aimingCircle.draw(ctx);
		
		};
		
		Ball.prototype.STOPPED_SPEED = 3;
		
		Ball.prototype.isStopped = function() {
			if (this.body.speed < this.STOPPED_SPEED)
				Matter.Body.applyForce(this.body, this.body.position, Matter.Vector.mult(this.body.velocity, -1 * this.body.mass));
		}
		
		Ball.prototype.tick = function() {
			
			if(this.isStopped()){
				if(this.aimingCircle){
					this.aimingCircle.destroy();
				}
			} else {
				if(!this.aimingCircle){
					this.aimingCircle = new AimingCircle(this.body);
				}
			}
		}
	});
	
	return Ball;
});