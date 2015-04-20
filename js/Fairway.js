define(['js/Floor.js'], function(Floor) {
	function Fairway(level, vertices) {
		Floor.apply(this, arguments);
	}

	Fairway.inherits(Floor, function(base) {
		Fairway.prototype.color = "#00b520";
	});

	return Fairway;
});
