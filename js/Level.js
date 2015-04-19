define(['js/rendererer.js'], function(rendererer) {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container) {
		this.bg = [];
		this.fg = [];

		this.init(container);
	}

	Level.prototype.init = function(container) {
		this.engine = Matter.Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				options: {
					showAngleIndicator: true
				},
				controller: rendererer
			}
		});

		Engine.run(this.engine);

	};

	Level.prototype.addToWorld = function(bodies) {
		console.log("ADD TO WORLD");
		Matter.World.add(this.engine.world, bodies);
	};

	Level.prototype.drawBackground = function(beforeRenderEvent) {
		var context = this.engine.render.context;

		this.bg.forEach(function(bgObject) {
			bgObject.draw(context);
		});
	};

	Level.prototype.drawForeground = function(afterRenderEvent) {
		var context = this.engine.render.context;

		this.fg.forEach(function(fgObject) {
			fgObject.draw(context);
		});
	};

	return Level;
});
