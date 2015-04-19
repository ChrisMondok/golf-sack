define(['js/Actor'], function(Actor) {
	function NavigationPoint(level, position) {
		Actor.apply(this, [level]);

		this.position = position;
	}

	NavigationPoint.inherits(Actor, function(base) {
		NavigationPoint.prototype.draw = function(ctx) {
			base.draw.apply(this, arguments);

			ctx.fillStyle = "gold";
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI, true);
			ctx.fill();
		};
	});

	return NavigationPoint;
});
