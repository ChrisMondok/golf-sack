require(['js/Level.js', 'js/Ball.js', 'js/Player.js'], function(Level, Ball, Player) {
	function SwingDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	SwingDemoLevel.inherits(Level, function(base) {
		SwingDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

			var ball = new Ball(this, {x: 400, y: 300});

			this.addToWorld([ground, ceil, left, right]);
			this.player = new Player(this, {x: 600, y: 400});
		};
	});

	var level = new SwingDemoLevel(document.getElementById("gameArea"));

	return SwingDemoLevel;
});
