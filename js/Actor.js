define([], function() {
	function Actor(level) {
		this.level = level;

		this._tickBound = this.tickPreProcess.bind(this);

		this.destroyed = false;

		this.level.actors.push(this);
		Matter.Events.on(this.level.engine, 'tick', this._tickBound);
	}

	Actor.prototype.draw = function(render) { };
	Actor.prototype.drawHud = function(render) { };

	Actor.prototype.destroy = function() {
		this.destroyed = true;
		this.level.actors.splice(this.level.actors.indexOf(this),1);
		Matter.Events.off(this.level.engine, 'tick', this._tickBound);
	};

	Actor.prototype.blocksTrace = function(traceStart, traceEnd) {
		return false;
	};

	Actor.prototype.tick = function(tickEvent) { };

	Actor.prototype.onCollisionStart = function(collisionEvent) { };

	Actor.prototype.tickPreProcess = function(tickEvent) {
		var dt = (this.lastTick ? tickEvent.timestamp - this.lastTick : 0) / 1000;

		tickEvent.dt = dt;

		this.tick(tickEvent);

		this.lastTick = tickEvent.timestamp;
	};

	return Actor;
});
