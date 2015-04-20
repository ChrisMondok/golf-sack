define(['js/Floor.js', 'js/geometry.js'], function(Floor, geometry) {
	function Water() {
		Floor.apply(this, arguments);
	}

	Water.inherits(Floor, function(base) {
		Water.prototype.color = "#2389DA";

		Water.prototype.friction = 0.9;

		Water.prototype.blocksTrace = function(traceStart, traceEnd) {
			//don't call base, this is an override
			var found = false;
			for(var i = 0; i < this.vertices.length; i++) {
				var segmentStart = this.vertices[i];
				var segmentEnd = this.vertices[(i+1)%this.vertices.length];


				if (geometry.lineSegmentIntersection(traceStart, traceEnd, segmentStart, segmentEnd))
					return true;
			}

			return false;
		};

		Water.prototype.draw = function(render) {
			base.draw.apply(this, arguments);

			var ctx = render.context;
			ctx.save();

				ctx.beginPath();
				ctx.polygon(this.vertices);

				ctx.fillStyle = render.patterns.water;
				ctx.clip();

				var offsetPercent = (render.timestamp % 6000)/6000;
				var offsetPX = offsetPercent * render.images.water.width;

				ctx.save();
					ctx.translate(offsetPX, 0);
					ctx.fillRect(-offsetPX, 0, this.level.engine.world.bounds.max.x + offsetPX, this.level.engine.world.bounds.max.y);
				ctx.restore();

				ctx.save();
					ctx.translate(0, offsetPX);
					ctx.fillRect(0, -offsetPX, this.level.engine.world.bounds.max.x, this.level.engine.world.bounds.max.y + offsetPX);
				ctx.restore();

			ctx.restore();

		};
	});

	return Water;
});
