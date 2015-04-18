function AimingCircle(target, ctx) {

	this.target = target;
	this.ctx = ctx;

	this.inside = false;

	this.lastMousePosition = null;

	this.entry = null;

	document.getElementsByTagName("canvas")[0].addEventListener("mousemove", this.mouseMove.bind(this));

	//	this.drawInteriorPoints = function() {
	//		for(var i=0; i<this.interiorPoints.length; i++) {
	//			var pt = this.interiorPoints[i];
	//			var ctx = this.ctx;
	//			ctx.beginPath();
	//			ctx.strokeStyle = "green";
	//			ctx.arc(pt.x, pt.y, 2, 0, 2*Math.PI);
	//			ctx.stroke();
	//			console.log();
	//		}
	//
	//		window.requestAnimationFrame(this.drawInteriorPoints);
	//
	//	}.bind(this);

	//this.drawInteriorPoints();
}

AimingCircle.inherits(Actor, function(base) {
	AimingCircle.prototype.draw = function(ctx) {
		base.draw.apply(this, arguments);

		if(target.speed < SPEED_DEAD_ZONE) {
			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.arc(target.position.x, target.position.y, TARGET_RADIUS, 0, 2*Math.PI);
			ctx.stroke();
		}
	};

	AimingCircle.prototype.radius = 45;

	AimingCircle.prototype.mouseMove = function(ev) {
		var mousePosition = {x: ev.layerX, y: ev.layerY};

		var wasInside = this.inside;
		this.inside = Matter.Vector.magnitudeSquared(Matter.Vector.sub(this.target.position, mousePosition)) < (Math.pow(this.radius, 2));

		if(this.inside != wasInside)
			this.handleCrossing(this.lastMousePosition, mousePosition);

		this.lastMousePosition = mousePosition;
	};

	AimingCircle.prototype.handleCrossing = function(before, after) {
		var self = this;
		var angle = Matter.Vector.angle(before, after);

		var afterTransformed = transform(after);
		var xTransformed = Math.sqrt(this.radius.squared() - afterTransformed.y.squared());


		var crossing = untransform({x: xTransformed, y: afterTransformed.y});
		console.log(crossing);

		function transform(vector) {
			console.log("transform %o", vector);
			return Matter.Vector.rotate(Matter.Vector.sub(vector, self.target.position), angle);
		}

		function untransform(vector) {
			console.log("untransform %o", vector);
			return Matter.Vector.add(Matter.Vector.rotate(vector, -angle), self.target.position);
		}
	};
});
