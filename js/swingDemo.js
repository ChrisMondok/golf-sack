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

			var ballBody = Matter.Bodies.circle(400, 300, 5, {density:0.005, restitution:0.5});

			var ball = new Ball(this, ballBody);

			this.addToWorld([ground, ceil, left, right, ballBody]);
			this.player = new Player(this, {x: 600, y: 400});

			this.engine.fg = [];
			this.engine.fg.push(ball);
		};
	});

	var level = new SwingDemoLevel(document.getElementById("gameArea"));

	return SwingDemoLevel;
});
