define([], function() {
	return {
		pointInCircle: pointInCircle,
		lineSegmentCircleIntersection: lineSegmentCircleIntersection
	};

	function pointInCircle(point, center, radius) {
		return Matter.Vector.magnitudeSquared(Matter.Vector.sub(point, center)) < (Math.pow(radius, 2));
	}

	function lineSegmentCircleIntersection(a, b, center, radius) {
		if(!pointInCircle(a, center, radius) && !pointInCircle(b, center, radius))
			return null;

		var angle = Matter.Vector.angle(a, b);

		var bTransformed = transform(b);

		var xTransformed = Math.sqrt(radius.squared() - bTransformed.y.squared());
		if(bTransformed.x < 0)
			xTransformed *= -1;

		return untransform({x: xTransformed, y: bTransformed.y});

		function transform(vector) {
			return Matter.Vector.rotate(Matter.Vector.sub(vector, center), - angle);
		}

		function untransform(vector) {
			return Matter.Vector.add(Matter.Vector.rotate(vector, angle), center);
		}
	}
});
