define(['js/Actor.js'], function(Actor) {
	
	function Floor(level, vertices, color) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.vertices = vertices;
		
		this.color = color || "green";
		
	}
	
	Floor.inherits(Actor, function(base) {
		
		Floor.prototype.drawBackground = function(ctx) {
			console.log('eh');
			ctx.fillStyle = this.color;
			this.fillPolygon(ctx, this.vertices);
			
		}
		
		Floor.prototype.fillPolygon = function(ctx, verts) {
			
			ctx.beginPath();
			ctx.moveTo(verts[0].x, verts[0].y);
			for(var v=0; v<verts.length; v++){
				ctx.lineTo(verts[v].x, verts[v].y);
			}
			ctx.closePath();
			ctx.fill();
			
		}
		
	});
	
	return Floor;
	
});
		