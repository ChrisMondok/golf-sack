define(['js/Actor.js', 'js/playerInput.js'], function(Actor, playerInput) {
	function Player(level, position) {
		Actor.apply(this, [level]);

		this.body = Matter.Bodies.circle(position.x, position.y, 15, {frictionAir: 0.25});
		this.body.label = "Player";

		level.addToWorld(this.body);
	}

	Player.inherits(Actor, function(base) {

		Player.prototype.legStrength = 0.005;

		Player.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);

			this.doMovement(tickEvent);
		};

		Player.prototype.doMovement = function(tickEvent) {
			var walkForce = Matter.Vector.mult(playerInput.getNormalizedMovement(), this.legStrength);

			if(Matter.Vector.magnitudeSquared(walkForce)) {
				Matter.Body.applyForce(this.body, this.body.position, walkForce);
				var walkAngle = Matter.Vector.angle({x: 0, y: 0}, walkForce);
				Matter.Body.rotate(this.body, -this.body.angle + walkAngle);
			}
		};

		Player.prototype.destroy = function() {
			base.destroy.apply(this, arguments);

			this.level.removeFromWorld(this.body);
		};
	});

	return Player;
});
