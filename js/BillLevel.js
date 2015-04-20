require(['js/Level.js', 'js/Ball.js', 'js/Floor.js', 'js/Player.js', 'js/Sand.js', 'js/Water.js', 'js/Wall.js', 'js/Hole.js'],
function(Level, Ball, Floor, Player, Sand, Water, Wall, Hole) {
	function FloorDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	FloorDemoLevel.inherits(Level, function(base) {

		FloorDemoLevel.prototype.bgm = "bgm1"

		FloorDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);

new Floor(this, [{"x":58,"y":542.1875},{"x":58,"y":92.1875},{"x":704,"y":113.1875},{"x":692,"y":524.1875}]); new Wall(this, [{"x":202,"y":438.1875},{"x":274,"y":326.1875},{"x":387,"y":341.1875},{"x":444,"y":199.1875},{"x":524,"y":192.1875}]); new Sand(this, [{"x":253,"y":440.1875},{"x":294,"y":364.1875},{"x":447,"y":342.1875},{"x":430,"y":421.1875},{"x":363,"y":452.1875}]); new Water(this, [{"x":290,"y":300.1875},{"x":281,"y":198.1875},{"x":364,"y":165.1875},{"x":393,"y":190.1875},{"x":379,"y":267.1875},{"x":359,"y":314.1875}]); new Player(this, {x:199,y:130.1875}); new Ball(this, {x:131,y:199.1875}); new Hole(this, {x:549,y:444.1875});

		};
	});

	var level = new FloorDemoLevel(document.getElementById("gameArea"));
});
