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
	});

	return Water;
});
