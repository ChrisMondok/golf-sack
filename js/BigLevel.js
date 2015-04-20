require(['js/Level.js', 'js/NavigationPoint.js', 'js/Player.js', 'js/Ball.js', 'js/Floor.js', 'js/Sand.js', 'js/Enemy.js'], 
function(Level, NavigationPoint, Player, Ball, Floor, Sand, Enemy) {

	function BigLevel() {
		Level.apply(this, arguments);
	}

	BigLevel.inherits(Level, function(base) {

		//BigLevel.prototype.bgm = "bgm4";

		BigLevel.prototype.width = 3000;
		BigLevel.prototype.height = 3000;
		
		BigLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			for(var i = 0; i < 50; i++) {
				new NavigationPoint(this, {x: Math.random() * this.width, y: Math.random() * this.height});
			}

			for(var i = 0; i < 10; i++) {
				new Enemy(this, {x: Math.random() * this.width, y: Math.random() * this.height});
			}

			this.player = new Player(this, {x: 600, y: 400});

			new Ball(this, {x: 650, y: 450});

			for(var x = 0; x < this.width; x += this.width/10) {
				for(var y = 0; y < this.height; y += this.height/10) {
					var what = [Floor, Sand].randomize()[0];
					new what(this, [
						{x: x, y: y},
						{x: x + this.width/10, y: y},
						{x: x + this.width/10, y: y + this.height/10},
						{x: x, y: y + this.height/10}
					]);
				}
			}
		};

	});

	var level = new BigLevel(document.getElementById("gameArea"));
});
