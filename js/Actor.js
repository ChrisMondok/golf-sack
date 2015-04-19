define([], function() {
	function Actor(level) {
		console.log("AKTURR");
		this.level = level;

		var self = this;

		this._tickBound = this.tickPreProcess.bind(this);

		this.destroyed = false;

		if(!this.level.engine.actors)
			this.level.engine.actors = [];
		this.level.engine.actors.push(this);
		Matter.Events.on(this.level.engine, 'tick', this._tickBound);
	}

	Actor.prototype.draw = function(ctx) { };

	Actor.prototype.destroy = function() {
		this.destroyed = true;
		this.level.engine.actors.splice(this.level.engine.actors.indexOf(this),1);
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
