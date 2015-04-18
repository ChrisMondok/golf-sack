define([], function() {
	function Actor(level) {
		this.level = level;

		var self = this;

		this._tickBound = this.tickPreProcess.bind(this);

		this.destroyed = false;

		Matter.Events.on(this.level.engine, 'tick', this._tickBound);
	}

	Actor.prototype.draw = function(ctx) { };

	Actor.prototype.destroy = function() {
		this.destroyed = true;
		Matter.Events.off(this.level.engine, 'tick', this._tickBound);
	};

	Actor.prototype.tick = function(tickEvent) { };

	Actor.prototype.tickPreProcess = function(tickEvent) {
		var dt = (this.lastTick ? tickEvent.timestamp - this.lastTick : 0) / 1000;

		tickEvent.dt = dt;

		this.tick(tickEvent);

		this.lastTick = tickEvent.timestamp;
	};

	return Actor;
});
