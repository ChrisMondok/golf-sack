define(['js/Actor.js'], function(Actor) {
	
	function Floor(level, vertices) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.vertices = vertices;
		
		level.bg.push(this);
		
	}

	Floor.inherits(Actor, function(base) {

		Floor.prototype.color = "green";
		
		Floor.prototype.draw = function(ctx) {
			ctx.fillStyle = this.color;
			ctx.polygon(this.vertices);
			ctx.fill();
			
		};
	});
	
	return Floor;
	
});
		
