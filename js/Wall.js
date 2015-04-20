define(['js/Actor.js'], function(Actor) {
	
	function Wall(level, points) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.points = points;
		
		this.bodies = [];
		
		var vec = Matter.Vector;

		var corner = Matter.Bodies.circle(this.points[0].x, this.points[0].y, this.width/2, {isStatic:true});
		this.level.addToWorld(corner);
		this.bodies.push(corner);

		for(var i=0; i<this.points.length-1; i++){
			var start = points[i];
			var end = points[i+1];
			var center = vec.add(vec.mult(vec.sub(end, start),0.5),start);
			var body = Matter.Bodies.rectangle(center.x, center.y, vec.magnitude(vec.sub(end, start)), this.width, {angle:vec.angle(end, start), isStatic:true});
			this.level.addToWorld(body);
			this.bodies.push(body);
			
			corner = Matter.Bodies.circle(end.x, end.y, this.width/2, {isStatic:true});
			this.level.addToWorld(corner);
			this.bodies.push(corner);
		}
		
	}
	
	Wall.inherits(Actor, function(base){
		Wall.prototype.width = 24;
		
		Wall.prototype.draw = function(render) {
			var ctx = render.context;
			this.bodies.forEach(function (body) {
				drawBody(ctx, body);
			});
		};

		Wall.prototype.blocksTrace = function(traceStart, traceEnd) {
			return Matter.Query.ray(this.bodies, traceStart, traceEnd).length > 0;
		};
			
		function drawBody(ctx, body) {
			if(body.label === "Rectangle Body")
				drawRectangle(ctx,body);
			else if(body.label === "Circle Body")
				drawCircle(ctx,body);
			else
				drawVertices(ctx,body.vertices);
		}
			
		function drawRectangle(ctx, body) {
			drawVertices(ctx, body.vertices);
		}
		
		function drawCircle(ctx, body) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
			ctx.fill();
		}
		
		function drawVertices(ctx, verts) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.polygon(verts);
			ctx.fill();
		}
	});
	
	return Wall;
});
