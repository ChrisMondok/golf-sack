define([], function() {
	
	var Rendererer = {
		
		create: function(container) {
			
			var render = { 
				controller: Rendererer,
				canvas: null,
				element: null	
			}
			
			render.canvas = createCanvas(800,600);
			render.context = render.canvas.getContext("2d");
			
			container.element.appendChild(render.canvas);
			
			return render;
		},
		
		world: function(engine) {
			var world = engine.world;
			var ctx = engine.render.context;
			var bodies = world.bodies;
			
			
			ctx.globalCompositeOperation = 'source-in';
			ctx.fillStyle = "transparent";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.globalCompositeOperation = 'source-over';
			
			ctx.fillStyle = "black";
			
			for(var b=0; b<bodies.length; b++){
				var body = bodies[b];
				if(body.label === "Rectangle Body")
					drawRectangle(ctx,body);
				else if(body.label === "Circle Body")
					drawCircle(ctx,body);
				else
					drawVertices(ctx,body.vertices);
			}
			
			
		},
		
		clear: function() {
			
		}
	};
	
	function createCanvas(width, height){
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
        canvas.oncontextmenu = function() { return false; };
        canvas.onselectstart = function() { return false; };
        return canvas;
	}
	
	function drawRectangle(ctx, body) {
		drawVertices(ctx, body.vertices);
	}
	
	function drawCircle(ctx, body) {
		ctx.beginPath();
		ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
		ctx.fill();
	}
	
	function drawVertices(ctx, verts) {
		ctx.beginPath();
		ctx.moveTo(verts[0].x, verts[0].y);
		for(var v=1; v<verts.length; v++){
			ctx.lineTo(verts[v].x, verts[v].y);
		}
		ctx.fill();
	}
	
	return Rendererer;
	
});
