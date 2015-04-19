define(['js/Floor.js'], function(Floor) {
	function Water() {
		Floor.apply(this, arguments);
	}

	Water.inherits(Floor, function(base) {
		Water.prototype.color = "#2389DA";

		Water.prototype.friction = 0.9;

	});

	return Water;
});
