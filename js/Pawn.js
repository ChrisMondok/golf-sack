define(['js/Actor.js', 'js/geometry.js'], function(Actor, geometry) {
	function Pawn(level, position) {
		Actor.apply(this, [level]);
	}

	Pawn.inherits(Actor, function(base) {
		Pawn.prototype.visionDistance = 400;

		Pawn.prototype.blockedBy = [];

		Pawn.prototype.canSee = function(actor) {
			if(this.getDistanceTo(actor) > this.visionDistance)
				return false;

			var myPosition = this.position || this.body.position;
			var targetPosition = actor.position || actor.body.position;

			if (this.blockedBy.some(function(blockingType) {
				return this.level.getActorsOfType(blockingType).some(function(blockingInstance) {
					return blockingInstance.blocksTrace(myPosition, targetPosition);
				}, this);
			}, this))
				return false;

			return true;
		};
	});

	Pawn.prototype.getDistanceTo = function(actor) {
		var position = actor.position || actor.body.position;
		return Matter.Vector.magnitude(Matter.Vector.sub(position, this.position));
	};


	return Pawn;
});
