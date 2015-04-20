require(['js/Level.js', 'js/NavigationPoint.js', 'js/Player.js'], 
function(Level, NavigationPoint, Player) {

	function BigLevel() {
		Level.apply(this, arguments);
	}

	BigLevel.inherits(Level, function(base) {

		BigLevel.prototype.width = 3000;
		BigLevel.prototype.height = 3000;
		
		BigLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			for(var i = 0; i < 50; i++) {
				new NavigationPoint(this, {x: Math.random() * this.width, y: Math.random() * this.height});
			}

			this.player = new Player(this, {x: 600, y: 400});
		};

	});

	var level = new BigLevel(document.getElementById("gameArea"));
});
