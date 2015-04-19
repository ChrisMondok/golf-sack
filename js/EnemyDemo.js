require(['js/Level.js', 'js/Ball.js', 'js/Enemy.js', 'js/Player.js', 'js/NavigationPoint.js'], function(Level, Ball, Enemy, Player, NavigationPoint) {
	function EnemyDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	EnemyDemoLevel.inherits(Level, function(base) {
		EnemyDemoLevel.prototype.bgm = "audio/synthpunk-garbage-2.ogg";

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

			
			[
				{x: 197, y: 173},
				{x: 362, y: 143},
				{x: 593, y: 180},
				{x: 699, y: 278},
				{x: 627, y: 511},
				{x: 685, y: 420},
				{x: 451, y: 500},
				{x: 509, y: 332},
				{x: 291, y: 478},
				{x: 239, y: 331},
				{x: 70, y: 390},
				{x: 104, y: 513},
				{x: 295, y: 462}
			].forEach(function(p) {
				new NavigationPoint(this, p);
			}, this);
		};
	});

	var level = new EnemyDemoLevel(document.getElementById("gameArea"));

	return EnemyDemoLevel;
});
