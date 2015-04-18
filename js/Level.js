define(['js/customRender.js'], function() {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container) {
		// Variable aliases

		this.init(container);

		this.bg = [];
		this.fg = [];
	}

	Level.prototype.init = function(container) {
		this.engine = Matter.Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				options: {
					showAngleIndicator: true
				}
			}
		});

		Engine.run(this.engine);

		Matter.Events.on(this.engine, 'beforeRender', this.drawBackground.bind(this));
		Matter.Events.on(this.engine, 'afterRender', this.drawForeground.bind(this));
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
