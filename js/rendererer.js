define([], function() {
	
	var Rendererer = {
		
		create: function(options) {
			
			var defaults = {};

			var render = Matter.Common.extend(defaults, options);

			render.controller = Rendererer;
			render.canvas = createCanvas(800,600);
			render.context = render.canvas.getContext("2d");
			
			options.element.appendChild(render.canvas);
			
			return render;
		},
		
		world: function(engine) {
			var render = engine.render;

			var world = engine.world;
			var ctx = engine.render.context;
			var bodies = world.bodies;
			
			
			ctx.globalCompositeOperation = 'source-in';
			ctx.fillStyle = "transparent";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.globalCompositeOperation = 'source-over';
			
			
			for(var a=0; a<render.level.actors.length; a++)
				if(render.level.actors[a].drawBackground)
					render.level.actors[a].drawBackground(ctx);
				
			ctx.fillStyle = "black";
			
			for(var b=0; b<bodies.length; b++)
				drawBody(ctx, bodies[b]);
			
			for(var a=0; a<render.level.actors.length; a++)
				render.level.actors[a].draw(ctx);
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
		ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
		ctx.fill();
	}
	
	function drawVertices(ctx, verts) {
		ctx.beginPath();
		ctx.polygon(verts);
		ctx.fill();
	}
	
	return Rendererer;
	
});
