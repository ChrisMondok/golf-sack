require(['js/Level.js', 'js/Ball.js', 'js/Enemy.js', 'js/Player.js', 'js/Sand.js', 'js/Water.js', 'js/NavigationPoint.js'],
function(Level, Ball, Enemy, Player, Sand, Water, NavigationPoint) {
	function EnemyDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	EnemyDemoLevel.inherits(Level, function(base) {
		EnemyDemoLevel.prototype.bgm = "bgm2";

		EnemyDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);


			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

			var ball = new Ball(this, {x: 400, y: 490});
			Matter.World.add(this.engine.world, [ground, ceil, left, right]);

			var player = new Player(this, {x: 400, y: 500});
			
			for(var i = 0; i < 4; i++)
				new Enemy(this, {x:Math.random() * 600 + 100 ,y:Math.random() * 50 + 40}, 0);
			
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

			//haha this level sucks
			new Sand(this, [
				{x: 0, y: 0},
				{x: 800, y: 0},
				{x: 800, y: 600},
				{x: 0, y: 600}
			]);

			new Water(this, [
				{x: 343, y: 229},
				{x: 453, y: 235},
				{x: 513, y: 284},
				{x: 453, y: 337},
				{x: 360, y: 334},
				{x: 297, y: 272}
			]);
		};
	});

	var level = new EnemyDemoLevel(document.getElementById("gameArea"));

	return EnemyDemoLevel;
});
