require(['js/Level.js', 'js/Ball.js', 'js/Enemy.js', 'js/Player.js'], function(Level, Ball, Enemy, Player) {
	function EnemyDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	EnemyDemoLevel.inherits(Level, function(base) {
		EnemyDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

			var ball = new Ball(this, {x: 400, y: 300});
			Matter.World.add(this.engine.world, [ground, ceil, left, right]);

			var player = new Player(this, {x: 400, y: 400});
			
			var enemy = new Enemy(this, {x:50 ,y:50}, 0);
		};
	});

	var level = new EnemyDemoLevel(document.getElementById("gameArea"));

	return EnemyDemoLevel;
});
