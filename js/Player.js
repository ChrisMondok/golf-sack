define(['js/Actor.js', 'js/playerInput.js'], function(Actor, playerInput) {
	function Player(level, position) {
		Actor.apply(this, [level]);

		this.body = Matter.Bodies.circle(position.x, position.y, 15, {frictionAir: 0.25});
		this.body.label = "Player";

		level.addToWorld(this.body);
	}

	Player.inherits(Actor, function(base) {

		Player.prototype.legStrength = 0.0025;

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

		Player.prototype.kill = function() {
			this.level.score += Infinity;
			this.destroy();
		};
		
		Player.prototype.draw = function(render) {
			var ctx = render.context;
			ctx.beginPath();
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "white";
			ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
	});

	return Player;
});
