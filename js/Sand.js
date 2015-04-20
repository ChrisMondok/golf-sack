define(['js/Floor.js'], function(Floor) {
	function Sand() {
		Floor.apply(this, arguments);
	}

	Sand.inherits(Floor, function(base) {
		Sand.prototype.color = "#C2B280";

		Sand.prototype.friction = 0.1;

		Sand.prototype.drawBackground = function(render) {
			base.drawBackground.apply(this, arguments);

			var ctx = render.context;

			ctx.fillStyle = render.patterns.sand;
			ctx.beginPath();
			ctx.polygon(this.vertices);
			ctx.fill();
		};
	});

	return Sand;
});
