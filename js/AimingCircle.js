define(['js/Actor.js', 'js/Player.js', 'js/geometry.js'], function(Actor, Player, geometry) {
	function AimingCircle(level, target) {
		Actor.apply(this, [level]);

		this.target = target;

		this.lastMousePosition = null;

		this.entry = null;


		this.level.fg.push(this);
	}

	AimingCircle.inherits(Actor, function(base) {
		AimingCircle.prototype.radius = 45;
		AimingCircle.prototype.forceMult = 0.005;

		AimingCircle.prototype.draw = function(render) {
			base.draw.apply(this, arguments);

			var ctx = render.context;

			ctx.beginPath();
			ctx.strokeStyle = this.active ? "lime" : "red";
			ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
			ctx.arc(this.target.body.position.x, this.target.body.position.y, this.radius, 0, 2*Math.PI);

			if(this.entry)
				ctx.fill();

			ctx.stroke();
		};

		AimingCircle.prototype.onMouseMove = function(mousePosition) {
			if(!this.active)
				return;

			if(this.lastMousePosition) {

				var wasInside = !!this.entry;
				var inside = geometry.pointInCircle(this.target.body.position, mousePosition, this.radius);

				if(inside != wasInside)
					this.handleCrossing(this.lastMousePosition, mousePosition);
			}

			this.lastMousePosition = mousePosition;
		};

		AimingCircle.prototype.handleCrossing = function(before, after) {
			var crossing = geometry.lineSegmentCircleIntersection(before, after, this.target.body.position, this.radius);
			crossing.time = new Date().getTime();

			if(this.entry) {
				var entry = this.entry;
				this.entry = null;
				this.swing(entry, crossing);
			}
			else
				this.entry = crossing;
		};

		AimingCircle.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);
			this.active = this.canBeSwungAt();

			if(!this.active) {
				this.entry = null;
				this.lastMousePosition = null;
			}
		};

		AimingCircle.prototype.canBeSwungAt = function() {
			var distanceToNearestPlayer = this.level.getActorsOfType(Player).map(function(player) {
					return Matter.Vector.magnitude(Matter.Vector.sub(this.target.body.position, player.body.position));
				}, this).min();

			return typeof(distanceToNearestPlayer) == 'number' && distanceToNearestPlayer < this.radius;
		};

		AimingCircle.prototype.swing = function(entry, exit) {
			if(entry.time == exit.time)
				return;

			var swingAngle = Matter.Vector.angle(entry, exit);
			var spin = Math.sin(swingAngle - Matter.Vector.angle(entry, this.target.body.position));

			var crossing = Matter.Vector.sub(exit, entry);

			var speed = Matter.Vector.magnitude(crossing) / (exit.time - entry.time);

			var forceVector = Matter.Vector.mult(Matter.Vector.normalise(crossing), this.forceMult * speed);

			var forceOffset = Matter.Vector.mult(Matter.Vector.rotate(Matter.Vector.normalise(forceVector), Math.PI/2), spin * this.target.body.circleRadius) ;

			var forcePosition = Matter.Vector.add(this.target.body.position, forceOffset);

			if(isNaN(forcePosition.x * forcePosition.y * forceVector.x * forceVector.y))
				throw new Error("NaN?!?!?!?!?!?!?!");

			this.target.setMulliganPosition();
			Matter.Body.applyForce(this.target.body, forcePosition, forceVector);
			this.level.playSoundAtPoint(["golfHit1", "golfHit2", "golfHit3", "golfHit4"].randomize()[0], this.target.body.position);
			this.level.score++;
		};

		AimingCircle.prototype.destroy = function() {
			base.destroy.apply(this, arguments);
			this.level.fg.splice(this.level.fg.indexOf(this), 1);
			this.level.engine.render.canvas.removeEventListener("mousemove", this._mouseMoveListener);
		};
	});

	return AimingCircle;
});
