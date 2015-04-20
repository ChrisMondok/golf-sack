define(['js/Actor.js'], function(Actor) {
	
	function Floor(level, vertices) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.vertices = vertices;
		
	}

	Floor.inherits(Actor, function(base) {

		Floor.prototype.color = "green";

		Floor.prototype.friction = 0.01;
		
		Floor.prototype.drawBackground = function(render) {
			var ctx = render.context;

			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.polygon(this.vertices);
			ctx.fill();
		};
	});
	
	return Floor;
	
});
		
