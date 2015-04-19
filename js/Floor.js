define(['js/Actor.js'], function(Actor) {
	
	function Floor(level, vertices) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.vertices = vertices;
		
		this.color = "green";
		level.bg.push(this);
		
	}
	
	Floor.inherits(Actor, function(base) {
		
		Floor.prototype.draw = function(ctx) {
			console.log('eh');
			ctx.fillStyle = this.color;
			this.fillPolygon(ctx, this.vertices);
			
		}
		
		Floor.prototype.fillPolygon = function(ctx, verts) {
			
			ctx.moveTo(verts[0].x, verts[0].y);
			for(var v=0; v<verts.length; v++){
				ctx.lineTo(verts[v].x, verts[v].y);
			}
			ctx.fill();
			
		}
		
	});
	
	return Floor;
	
});
		