require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/NavigationPoint.js', 'js/Wall.js', 'js/Hole.js'],
		function(Level, Ball, Player, Floor, Sand, Water, Enemy, NavigationPoint, Wall, Hole) {
			function LevelNameHere() {
				Level.apply(this, arguments);
			}

			LevelNameHere.inherits(Level, function(base) {


				LevelNameHere.prototype.init = function() {
					this.name = "It begins";

					this.width = 800; this.height = 600;

					base.init.apply(this, arguments);

					new Floor(this, [{"x":9,"y":11.1875},{"x":9,"y":595.1875},{"x":779,"y":587.1875},{"x":782,"y":8.1875}]);
					new Sand(this, [{"x":247,"y":400.1875},{"x":462,"y":326.1875},{"x":403,"y":472.1875}]);
					new Wall(this, [{"x":247,"y":400.1875},{"x":403,"y":472.1875},{"x":462,"y":326.1875}]);
					new Ball(this, {x:126,y:186.1875});
					new Hole(this, {x:661,y:435.1875});
					new Player(this, {x:123,y:263.1875});
					new Water(this, [{"x":471,"y":79.1875},{"x":398,"y":129.1875},{"x":436,"y":249.1875},{"x":537,"y":235.1875},{"x":589,"y":151.1875}]);
				};

				LevelNameHere.prototype.initAudio = function() {
					this.bgm = "bgm3";

					base.initAudio.apply(this, arguments);
				};
			});

			var level = new LevelNameHere(document.getElementById("gameArea"));

			return LevelNameHere;
		});
