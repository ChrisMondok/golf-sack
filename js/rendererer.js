define([], function() {
	
	var Rendererer = {
		
		create: function(config) {
			
			var defaults = {
				width: 1300,
				height: 700,
				playerMargin: 100,
				center: {x: 400, y: 300},
				options: {},
				images: {},
				border: {
					style: "solid",
					width: "3px",
					color: "black"
				}
			};

			var render = Matter.Common.extend(defaults, config);

			render.frame = 0;
			render.controller = Rendererer;
			render.canvas = createCanvas(render.width, render.height, render.border);
			render.context = render.canvas.getContext("2d");

			render.patterns = {};
			for(var key in render.images)
				render.patterns[key] = render.context.createPattern(render.images[key], "repeat");

			
			config.element.appendChild(render.canvas);

			if(render.options.debug) {
				render.debugX = 0;
				render.debugT = new Date().getTime();
				render.debugGraphContext = createRenderGraph().getContext('2d');
			}
			
			return render;
		},
		
		world: function(engine) {
			var render = engine.render;

			render.frame++;
			render.timestamp = new Date().getTime();

			render.controller.renderCenteredOn(engine, render.center);

			if(render.options.debug) {
				updateDebugGraph(render);
			}
		},

		renderCenteredOn: function(engine, center) {
			var render = engine.render;
			var world = engine.world;
			var ctx = render.context;
			var bodies = world.bodies;
			
			ctx.save();
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.translate(render.width / 2 - center.x,render.height/2 - center.y);

			render.level.drawBackground(render);

			for(var a=0; a<render.level.actors.length; a++)
				if(render.level.actors[a].drawBackground)
					render.level.actors[a].drawBackground(render);
				
			ctx.fillStyle = "black";
			
			for(var b=0; b<bodies.length; b++)
				drawBody(ctx, bodies[b]);
			
			for(var a=0; a<render.level.actors.length; a++)
				render.level.actors[a].draw(render);

			render.level.draw(render);

			ctx.restore();

			for(var a=0; a<render.level.actors.length; a++)
				render.level.actors[a].drawHud(render);

			render.level.drawHud(render);
		},

		moveIntoView: function(engine, point) {
			var render = engine.render;

			render.center.x = render.center.x.clamp(point.x - render.playerMargin, point.x + render.playerMargin);
			render.center.y = render.center.y.clamp(point.y - render.playerMargin, point.y + render.playerMargin);

			render.center.x = render.center.x.clamp(engine.world.bounds.min.x + render.width/2, engine.world.bounds.max.x - render.width/2);
			render.center.y = render.center.y.clamp(engine.world.bounds.min.y + render.height/2, engine.world.bounds.max.y - render.height/2);
		},

		getVisibleBounds: function(engine) {
			var x = engine.render.center.x - engine.render.canvas.width / 2;
			var y = engine.render.center.y - engine.render.canvas.height / 2;

			return {
				min: { x: x, y: y },
				max: { x: x + engine.render.canvas.width, y: y + engine.render.canvas.height }
			};
		},
		
		clear: function() {

		}
	};
	
	function createCanvas(width, height, border){
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.borderStyle = border.style;
		canvas.style.borderWidth = border.width;
		canvas.style.borderColor = border.color;
        canvas.oncontextmenu = function() { return false; };
        canvas.onselectstart = function() { return false; };
        return canvas;
	}

	function createRenderGraph() {
		var renderGraph = document.createElement('canvas');
		renderGraph.height = 200;
		renderGraph.width = 800;
		document.body.appendChild(renderGraph);
		return renderGraph;
	}

	function updateDebugGraph(render) {
		var now = new Date().getTime();
		var dt = now - render.debugT;

		var x = render.debugX % render.debugGraphContext.canvas.width;
		var y = render.debugGraphContext.canvas.height - dt;

		render.debugGraphContext.fillStyle = "white";
		render.debugGraphContext.beginPath();
		render.debugGraphContext.moveTo(x, 0);
		render.debugGraphContext.lineTo(x, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 10, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 10, 0);
		render.debugGraphContext.fill();

		render.debugGraphContext.beginPath();
		render.debugGraphContext.fillStyle = "black";
		render.debugGraphContext.moveTo(x, y);
		render.debugGraphContext.lineTo(x, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 1, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 1, y);
		render.debugGraphContext.fill();

		drawLineAtFps(60, "green");
		drawLineAtFps(30, "coral");
		drawLineAtFps(15, "red");

		function drawLineAtFps(fps, color) {
			render.debugGraphContext.strokeStyle = color;
			render.debugGraphContext.beginPath();
			render.debugGraphContext.moveTo(0, render.debugGraphContext.canvas.height - 1000/fps);
			render.debugGraphContext.lineTo(render.debugGraphContext.canvas.width, render.debugGraphContext.canvas.height - 1000/fps);
			render.debugGraphContext.stroke();
		}

		render.debugT = now;
		render.debugX++;
	}

	function drawBody(ctx, body) {
		// NO_OP
	}
	
	return Rendererer;
	
});
