define(['js/customRender.js'], function() {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container) {
		// Variable aliases

		this.init(container);

	}

	Level.prototype.init = function(container) {
		this.engine = Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				options: {
					showAngleIndicator: true
				}
			}
		});
		Engine.run(this.engine);
	};

	return Level;
});
