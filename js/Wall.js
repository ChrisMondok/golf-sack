define(['js/Actor.js'], function(Actor) {
	
	function Wall(level, points) {
		Actor.apply(this, [level]);
		
		this.level = level;
		this.points = points;
		
		this.bodies = [];
		
		this.width = 4;
		
		var vec = Matter.Vector;
		for(var i=0; i<this.points.length-1; i++){
			var start = points[i];
			var end = points[i+1];
			var center = vec.add(vec.mult(vec.sub(end, start),.5),start);
			var body = Matter.Bodies.rectangle(center.x, center.y, vec.magnitude(vec.sub(end, start)), this.width, {angle:vec.angle(end, start), isStatic:true});
			this.level.addToWorld(body);
			this.bodies.push(body);
			
			var corner = Matter.Bodies.circle(end.x, end.y, this.width/2, {isStatic:true});
			this.level.addToWorld(corner);
			this.bodies.push(corner);
		}
		
	}
	
	Wall.inherits(Actor, function(base){});
	
	return Wall;
});