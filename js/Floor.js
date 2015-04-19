define(['js/Actor.js'], function(Actor) {
	
	function Floor(level, vertices, color) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.vertices = vertices;
		
	}

	Floor.inherits(Actor, function(base) {

		Floor.prototype.color = "green";
		
		Floor.prototype.drawBackground = function(ctx) {
			console.log('eh');
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.polygon(this.vertices);
			ctx.fill();
		};
	});
	
	return Floor;
	
});
		
