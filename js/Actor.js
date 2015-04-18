define([], function() {
	function Actor(level) {
		this.level = level;
	}

	Actor.prototype.draw = function(ctx) {
		//override me please!
	};

	Actor.prototype.destroy = function() {
	};

	return Actor;
});
