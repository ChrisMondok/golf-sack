function SwingDemoLevel() {
	Level.apply(this, arguments); //this sucks.
};

SwingDemoLevel.inherits(Level, function(base) {
	SwingDemoLevel.prototype.init = function() {
		base.init.apply(this, arguments);

		var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
		var ceil = Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
		var left = Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
		var right = Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

		var ball = Bodies.circle(400, 300, 5, {density:.005, restitution:0.5});

		var ac = new AimingCircle(ball);

		World.add(this.engine.world, [ground, ceil, left, right, ball]);
		this.engine.fg = [];
		this.engine.fg.push(ac);
	}
});

var level = new SwingDemoLevel(document.getElementById("gameArea"));
