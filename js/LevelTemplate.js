require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/NavigationPoint.js', 'js/Wall.js', 'js/Hole.js'],
function(Level, Ball, Player, Floor, Sand, Water, Enemy, NavigationPoint, Wall, Hole) {
	function LevelNameHere() {
		Level.apply(this, arguments);
	}

	LevelNameHere.inherits(Level, function(base) {


		LevelNameHere.prototype.init = function() {
			this.name = "LEVEL NAME HERE";

			/******************************
			 * paste that shiz up in here *
			 ******************************/
		};

		LevelNameHere.prototype.initAudio = function() {
			this.bgm = "bgm3";

			base.initAudio.apply(this, arguments);
		};
	});

	var level = new LevelNameHere(document.getElementById("gameArea"));

	return LevelNameHere;
});
