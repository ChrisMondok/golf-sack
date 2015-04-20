require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/NavigationPoint.js', 'js/Wall.js'],
function(Level, Ball, Player, Floor, Sand, Water, Enemy, NavigationPoint, Wall) {
	function LevelMadeWithLevelEditor() {
		Level.apply(this, arguments);//this sucks.
	}

	LevelMadeWithLevelEditor.inherits(Level, function(base) {


		LevelMadeWithLevelEditor.prototype.init = function() {
			this.width = 3000;
			this.height = 3000;


			base.init.apply(this, arguments);


			new Floor(this, [{"x":21,"y":15.1875},{"x":1974,"y":19.1875},{"x":1958,"y":1967.1875},{"x":654,"y":1947.1875},{"x":274,"y":1187.1875}]);
			new Wall(this, [{"x":21,"y":15.1875},{"x":1974,"y":19.1875},{"x":1958,"y":1967.1875},{"x":50,"y":1963.1875},{"x":21,"y":15.1875}]);
			new Sand(this, [{"x":21,"y":15.1875},{"x":274,"y":1187.1875},{"x":53,"y":1963.1875}]);
			new Water(this, [{"x":53,"y":1963.1875},{"x":654,"y":1947.1875},{"x":274,"y":1187.1875}]);
			new Sand(this, [{"x":53,"y":1963.1875},{"x":1958,"y":1967.1875},{"x":654,"y":1947.1875}]);
			new Wall(this, [{"x":668,"y":1107.1875},{"x":523,"y":1361.1875},{"x":893,"y":1551.1875}]);
			new Sand(this, [{"x":672,"y":1109.1875},{"x":892,"y":1552.1875},{"x":527,"y":1363.1875}]);
			new Player(this, {x:1459,y:673.1875});
			new Ball(this, {x:1376,y:727.1875});
			new Water(this, [{"x":1206,"y":1063.1875},{"x":1235,"y":1060.1875},{"x":1261,"y":1070.1875},{"x":1279,"y":1090.1875},{"x":1287,"y":1121.1875},{"x":1276,"y":1150.1875},{"x":1249,"y":1171.1875},{"x":1211,"y":1178.1875},{"x":1172,"y":1152.1875},{"x":1169,"y":1108.1875},{"x":1178,"y":1073.1875}]);
			new Wall(this, [{"x":1135,"y":974.1875},{"x":1478,"y":1032.1875}]);
			new Enemy(this, {x:1374,y:1097.1875});
			new Water(this, [{"x":1640,"y":172.1875},{"x":1492,"y":276.1875},{"x":1591,"y":427.1875},{"x":1780,"y":293.1875}]);

			[{"x":920,"y":1177.1875},{"x":1269,"y":1373.1875},{"x":1455,"y":1568.1875},{"x":1020,"y":1522.1875},{"x":840,"y":968.1875},{"x":939,"y":576.1875},{"x":1274,"y":522.1875},{"x":1202,"y":894.1875},{"x":1370,"y":945.1875},{"x":1461,"y":965.1875},{"x":1616,"y":1119.1875},{"x":1047,"y":983.1875},{"x":1694,"y":768.1875},{"x":1774,"y":379.1875},{"x":1534,"y":463.1875},{"x":1022,"y":360.1875},{"x":730,"y":346.1875},{"x":574,"y":717.1875},{"x":237,"y":366.1875},{"x":293,"y":781.1875},{"x":376,"y":1118.1875},{"x":692,"y":903.1875},{"x":210,"y":1096.1875},{"x":133,"y":1509.1875},{"x":624,"y":1781.1875},{"x":711,"y":1929.1875},{"x":1084,"y":1922.1875},{"x":1162,"y":1757.1875},{"x":703,"y":1687.1875},{"x":558,"y":1497.1875},{"x":487,"y":472.1875},{"x":1589,"y":133.1875},{"x":1838,"y":176.1875}].forEach(function(nav){new NavigationPoint(this, nav);},this);
		};

		LevelMadeWithLevelEditor.prototype.initAudio = function() {
			this.bgm = "bgm3";

			base.initAudio.apply(this, arguments);
		}
	});

	var level = new LevelMadeWithLevelEditor(document.getElementById("gameArea"));

	return LevelMadeWithLevelEditor;
});
