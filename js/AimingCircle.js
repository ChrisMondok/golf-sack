function AimingCircle(target, ctx) {
	
	this.target = target;
	this.ctx = ctx;
	
	this.interiorPoints = [];
	
	this.state;
	
	this.mouseMove = function(ev) {
	
		if(Matter.Vector.magnitudeSquared(Matter.Vector.sub(target.position, {x:ev.layerX, y:ev.layerY})) < (TARGET_RADIUS * TARGET_RADIUS)) {
			
			if(this.state === 0){
				this.interiorPoints = [];
			}
			this.state = 1;
			this.interiorPoints.push({x:ev.layerX, y:ev.layerY});
			
		} else {
			this.state = 0;
		}
		
		console.log(this.state);
	}
	
	document.getElementsByTagName("canvas")[0].addEventListener("mousemove", this.mouseMove.bind(this));
	
	this.drawInteriorPoints = function() {
		for(var i=0; i<this.interiorPoints.length; i++) {
			var pt = this.interiorPoints[i];
			var ctx = this.ctx;
			ctx.beginPath();
			ctx.strokeStyle = "green";
			ctx.arc(pt.x, pt.y, 2, 0, 2*Math.PI);
			ctx.stroke();
			console.log();
		}
		
		window.requestAnimationFrame(this.drawInteriorPoints);
		
	}.bind(this);
	
	this.drawInteriorPoints();
	
}