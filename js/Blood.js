define(['js/Actor.js'], function(Actor) {
	function Blood(level, position){
		Actor.apply(this, [level]);

		this.position = position;

		this.rotation = Math.random() * 2 * Math.PI;
	}

	Blood.inherits(Actor, function(base) {
		Blood.prototype.drawBackground = function(render) {
			render.context.drawImageRotated(render.images.blood, this.position.x, this.position.y, this.direction);
		};
	});

	return Blood;
});
