define(['js/rendererer.js'], function(rendererer) {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container) {
		this.fg = [];
		this.actors = [];

		this.init(container);
	}

	Level.prototype.init = function(container) {
		this.engine = Matter.Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				controller: rendererer,
				level: this,
				options: {
					debug: true
				}
			}
		});

		Engine.run(this.engine);

	};

	Level.prototype.addToWorld = function(bodies) {
		Matter.World.add(this.engine.world, bodies);
	};

	Level.prototype.removeFromWorld = function(body) {
		Matter.World.remove(this.engine.world, body);
	};

	Level.prototype.getActorsOfType = function(type) {
		return this.actors.filter(function(actor) {
			return actor instanceof type;
		});
	};

	Level.prototype.pointIsOutOfBounds = function(point) {
		return !Matter.Bounds.contains(this.engine.world.bounds, point);
	};

	return Level;
});
