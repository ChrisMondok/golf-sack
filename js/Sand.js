define(['js/Floor.js', 'js/geometry.js'], function(Floor, geometry) {
	function Sand() {
		Floor.apply(this, arguments);
	}

	Sand.inherits(Floor, function(base) {
		Sand.prototype.color = "#C2B280";

		Sand.prototype.friction = 0.1;

	});

	return Sand;
});
