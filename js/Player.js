define(['js/Actor.js', 'js/playerInput.js'], function(Actor, playerInput) {
	function Player(level, body) {
		Actor.apply(this, [level]);

		this.body = body;
	}

	Player.inherits(Actor, function(base) {

		Player.prototype.legStrength = 0.25;

		Player.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);

			this.doMovement(tickEvent);
		};

		Player.prototype.doMovement = function(tickEvent) {
			var walkForce = Matter.Vector.mult(playerInput.getNormalizedMovement(), tickEvent.dt * this.legStrength);

			if(Matter.Vector.magnitudeSquared(walkForce)) {
				Matter.Body.applyForce(this.body, this.body.position, walkForce);
				var walkAngle = Matter.Vector.angle({x: 0, y: 0}, walkForce);
				Matter.Body.rotate(this.body, -this.body.angle + walkAngle);
			}
		};
	});

	return Player;
});
