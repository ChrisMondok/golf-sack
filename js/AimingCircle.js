function AimingCircle(target) {

	this.target = target;

	this.inside = false;

	this.lastMousePosition = null;

	this.entry = null;

	//yuck
	document.getElementsByTagName("canvas")[0].addEventListener("mousemove", this.mouseMove.bind(this));
}

AimingCircle.inherits(Actor, function(base) {
	AimingCircle.prototype.radius = 45;
	AimingCircle.prototype.forceMult = 0.005;

	AimingCircle.prototype.draw = function(ctx) {
		base.draw.apply(this, arguments);
		
		ctx.beginPath();
		ctx.strokeStyle = "lime";
		ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
		ctx.arc(this.target.position.x, this.target.position.y, this.radius, 0, 2*Math.PI);

		if(this.inside)
			ctx.fill();

		ctx.stroke();

		if(this.entry)
		{
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.arc(this.entry.x, this.entry.y, 2, 0, 2*Math.PI);
			ctx.stroke();
		}

	};

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
		if(afterTransformed.x < 0)
			xTransformed *= -1;

		var crossing = untransform({x: xTransformed, y: afterTransformed.y});

		crossing.time = new Date().getTime();

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

	AimingCircle.prototype.swing = function(entry, exit) {
		var swingAngle = Matter.Vector.angle(entry, exit);
		var spin = -Math.sin(swingAngle - Matter.Vector.angle(entry, this.target.position));

		var crossing = Matter.Vector.sub(exit, entry);

		var speed = Matter.Vector.magnitude(crossing) / (exit.time - entry.time);

		var forceVector = Matter.Vector.mult(Matter.Vector.normalise(crossing), this.forceMult * speed);
		Matter.Body.applyForce(this.target, this.target.position, forceVector);
	};
});
