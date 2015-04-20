require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/NavigationPoint.js', 'js/Wall.js', 'js/Hole.js'], function(Level, Ball, Player, Floor, Sand, Water, Enemy, NavigationPoint, Wall, Hole) {
	function LevelEditor(container, width, height) {
		this.width = width;
		this.height = height;

		Level.apply(this, arguments); //this sucks.
		
		this.state = {
			drawing: false,
			brush: null
		};
		
		this.points = [];
		
		this.placedObjects = [];
		
		this.state.brush = Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){return radio.checked}).value;
		
		var clickDrawButton = function() {
			this.state.drawing = !this.state.drawing;
			if(this.state.drawing)
				this.startDrawing.bind(this)();
			else
				this.stopDrawing.bind(this)();
		}		
		
		document.getElementById("draw").addEventListener('click',clickDrawButton.bind(this));
		document.getElementById("exportButton").addEventListener('click',this.exp.bind(this));
		
	}

	LevelEditor.inherits(Level, function(base) {
		LevelEditor.prototype.snapDistance = 8;

		LevelEditor.prototype.init = function() {
			base.init.apply(this, arguments);
		};

		LevelEditor.prototype.initHud = function() {
			//intentionally do nothing
		};
		
		LevelEditor.prototype.handlePointerEvent = function(e) {
			var position = this.transformWindowSpaceToGameSpace({x: e.pageX, y: e.pageY}, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});

			if(e.type === 'click' && Matter.Bounds.contains(this.engine.world.bounds, position)){
				
				if(this.state.drawing){
					this.points.push(this.snapPosition(position));
					if(this.state.brush == "player"){
						var p = new Player(this, position);
						p.tick = function(){};
						this.placedObjects.push(p);
						this.stopDrawing();
					} else if(this.state.brush == "ball"){
						var b = new Ball(this, position);
						b.tick = function(){};
						this.placedObjects.push(b);
						this.stopDrawing();
					} else if(this.state.brush == "enemy"){
						var e = new Enemy(this, position);
						e.tick = function(){};
						this.placedObjects.push(e);
						this.stopDrawing();
					} else if(this.state.brush == "nav"){
						this.placedObjects.push(new NavigationPoint(this,position));
						//this.stopDrawing();
					} else if(this.state.brush == "hole"){
						this.placedObjects.push(new Hole(this, position));
						this.stopDrawing();
					} else if(this.state.brush == "erase"){
						this.erase(position);
						this.stopDrawing();
					} else {
					}
				}
			}
		};
		
		LevelEditor.prototype.erase = function(position) {
			this.placedObjects.reverse();
			for(var i=0; i<this.placedObjects.length; i++){
				var v = this.placedObjects[i].vertices || this.placedObjects[i].body.vertices || [{x:0,y:0}];
				if(Matter.Vertices.reallyContains(v, position)){
					console.log(this.placedObjects[i]);
					var obj = this.placedObjects[i];
					if(obj.destroy)
						obj.destroy();
					this.placedObjects.splice(i,1);
					break;
				}
			}
			this.placedObjects.reverse();
		};
					
		LevelEditor.prototype.snapPosition = function(position) {
			var nearestVert = this.getActorsOfType(Floor).map(function(floor) {
				return floor.vertices;
			}).concat(this.points).flatten().sortBy(function(vert) {
				return Matter.Vector.magnitudeSquared(Matter.Vector.sub(vert, position));
			})[0];

			if(nearestVert && Matter.Vector.magnitude(Matter.Vector.sub(nearestVert, position)) < this.snapDistance)
				return Matter.Common.clone(nearestVert);

			return position;
		};
		
		LevelEditor.prototype.startDrawing = function() {
			this.state.drawing = true;
			this.state.brush = getCurrentBrush();
			this.points = [];
			Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){radio.disabled = true});
			document.getElementById("draw").value = "Drawing...";
		}		
		
		var getCurrentBrush = function() {
			return Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){return radio.checked}).value;
		}	
		
		LevelEditor.prototype.stopDrawing = function() {
			
			document.getElementById("draw").value = "Start Drawing";
			Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){radio.disabled = false});
			if(this.points.length == 0)
				return;
			
			var b = this.state.brush;
			if (b == "grass")
				this.placedObjects.push(new Floor(this, this.points));
			else if(b == "sand")
				this.placedObjects.push(new Sand(this, this.points));
			else if(b == "water")
				this.placedObjects.push(new Water(this, this.points));
			else if(b == "lava")
				console.log("The floor is made of lava! (Lava is not yet implemented)");
			else if(b == "wall")
				this.placedObjects.push(new Wall(this, this.points));
			
			this.points = [];
			
			this.state.drawing = false;
		}
		
		LevelEditor.prototype.draw = function(renderer) {
			base.draw.apply(this, arguments);
			if(this.state.brush === 'nav')
				return;
			var ctx = renderer.context;
			for(var i=0; i<this.points.length; i++) {
				var p = this.points[i];
				var np = this.points[i+1] || this.points[0];
				ctx.beginPath();
				ctx.strokeStyle = "black";
				ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
				ctx.stroke();
				ctx.strokeStyle = this.points[i+1] ? "black" : this.state.brush !== 'wall' ? "blue" : "transparent";
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(np.x, np.y);
				ctx.stroke();
			}
		}
		
		LevelEditor.prototype.exp = function() {
			var output = "";
			var navPoints = [];
			this.placedObjects.forEach(function(obj){
				if(obj instanceof Water) {
					output = output + "\nnew Water(this, " + JSON.stringify(obj.vertices) + ");";
				} else if(obj instanceof Sand) {
					output = output + "\nnew Sand(this, " + JSON.stringify(obj.vertices) + ");";
				} else if(obj instanceof Floor) {
					output = output + "\nnew Floor(this, " + JSON.stringify(obj.vertices) + ");";
				} else if(obj instanceof Wall) {
					output = output + "\nnew Wall(this, " + JSON.stringify(obj.points) + ");";
				} else if(obj instanceof Enemy) {
					output = output + "\nnew Enemy(this, {x:" + obj.position.x + ",y:" + obj.position.y + "});";
				} else if(obj instanceof Player) {
					output = output + "\nnew Player(this, {x:" + obj.body.position.x + ",y:" + obj.body.position.y + "});";
				} else if(obj instanceof Ball) {
					output = output + "\nnew Ball(this, {x:" + obj.body.position.x + ",y:" + obj.body.position.y + "});";
				} else if(obj instanceof NavigationPoint) {
					navPoints.push(obj.position);
				} else if(obj instanceof Hole) {
					output = output + "\nnew Hole(this, {x:" + obj.position.x + ",y:" + obj.position.y + "});";
				}
			});
			if(navPoints.length){
				output = output + "\n" + JSON.stringify(navPoints) + ".forEach(function(nav){new Navpoint(this, nav)},this);";
			}
			
			console.log(output);
			
			document.getElementById("exportTextArea").innerHTML = output;
			
		}
		
	});

	var paramForm = document.getElementById("parameters");
	paramForm.addEventListener('submit', function(submitEvent) {
		submitEvent.preventDefault();

		var width = Number(document.getElementById("width").value);
		var height = Number(document.getElementById("height").value);

		paramForm.parentElement.removeChild(paramForm);

		var level = new LevelEditor(document.getElementById("gameArea"), width, height);
	});
	
	return LevelEditor;
});
