function AimingCircle(target, ctx) {

	this.target = target;
	this.ctx = ctx;

	this.inside = false;

	this.lastMousePosition = null;

	this.entry = null;

	//yuck
	document.getElementsByTagName("canvas")[0].addEventListener("mousemove", this.mouseMove.bind(this));

	this.draw();
}

AimingCircle.inherits(Actor, function(base) {
	AimingCircle.prototype.draw = function(ctx) {
		base.draw.apply(this, arguments);

		this.ctx.beginPath();
		this.ctx.strokeStyle = "lime";
		this.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
		this.ctx.arc(this.target.position.x, this.target.position.y, this.radius, 0, 2*Math.PI);

		if(this.inside)
			this.ctx.fill();

		this.ctx.stroke();

		if(this.entry)
		{
			this.ctx.beginPath();
			this.ctx.strokeStyle = "red";
			this.ctx.arc(this.entry.x, this.entry.y, 2, 0, 2*Math.PI);
			this.ctx.stroke();
		}

		window.requestAnimationFrame(this.draw.bind(this));
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

	AimingCircle.prototype.swing = function(entry, exit) {
		var swingAngle = Matter.Vector.angle(entry, exit);
		var theta = swingAngle - Matter.Vector.angle(entry, this.target.position);

		console.log(theta);

		var spin = Math.sin(theta);

		console.log("swing in direction %s (%s)", swingAngle, swingAngle / Math.PI * 180);
		console.log("spin %s", spin);
	};

	AimingCircle.prototype.handleCrossing = function(before, after) {
		var self = this;

		var angle = Matter.Vector.angle(before, after);

		var afterTransformed = transform(after);

		var xTransformed = Math.sqrt(this.radius.squared() - afterTransformed.y.squared());
		if(afterTransformed.x < 0)
			xTransformed *= -1;

		var crossing = untransform({x: xTransformed, y: afterTransformed.y});

		if(this.entry) {
			var entry = this.entry;
			this.entry = null;
			this.swing(entry, crossing);
		}
		else
			this.entry = crossing;

		function transform(vector) {
			return Matter.Vector.rotate(Matter.Vector.sub(vector, self.target.position), - angle);
		}

		function untransform(vector) {
			return Matter.Vector.add(Matter.Vector.rotate(vector, angle), self.target.position);
		}
	};
});
