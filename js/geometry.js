define([], function() {
	return {
		pointInCircle: pointInCircle,
		lineSegmentCircleIntersection: lineSegmentCircleIntersection,
		lineSegmentIntersection: lineSegmentIntersection
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

	function lineSegmentIntersection(fromStart, fromEnd, toStart, toEnd, ctx) {
		var intersection = extendLineSegmentToLineSegment(fromStart, fromEnd, toStart, toEnd);

		if(!intersection)
			return false;

		var inBounds =
			intersection.x >= Math.min(fromStart.x, fromEnd.x) &&
			intersection.x <= Math.max(fromStart.x, fromEnd.x) &&
			intersection.x >= Math.min(toStart.x, toEnd.x) &&
			intersection.x <= Math.max(toStart.x, toEnd.x);

		if(ctx) {
			ctx.fillStyle = inBounds ? "green" : "red";
			ctx.beginPath();
			ctx.arc(intersection.x, intersection.y, 4, 0, 2 * Math.PI, false);
			ctx.fill();
		}

		return inBounds;
	}

	function extendLineSegmentToLineSegment(fromStart, fromEnd, toStart, toEnd) {
		var denominator = (fromStart.x - fromEnd.x)*(toStart.y - toEnd.y) - (fromStart.y - fromEnd.y)*(toStart.x - toEnd.x);

		if(!denominator) //parallel or coincident lines
			return null;

		var x = ((fromStart.x*fromEnd.y - fromStart.y*fromEnd.x)*(toStart.x-toEnd.x) - (fromStart.x-fromEnd.x)*(toStart.x*toEnd.y - toStart.y*toEnd.x)) / denominator;
		var y = ((fromStart.x*fromEnd.y - fromStart.y*fromEnd.x)*(toStart.y-toEnd.y) - (fromStart.y-fromEnd.y)*(toStart.x*toEnd.y - toStart.y*toEnd.x)) / denominator;

		return {x: x, y: y};
	}
});
