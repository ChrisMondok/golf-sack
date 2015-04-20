require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/Actor.js', 'js/NavigationPoint.js'], function(Level, Ball, Player, Floor, Sand, Water, Enemy, Actor, NavigationPoint) {
	function LevelEditor() {
		Level.apply(this, arguments); //this sucks.
		
		this.state = {
			drawing: false,
			brush: null
		}
		
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

			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });
			this.addToWorld([ground, ceil, left, right]);
			
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
						console.log("No holes!");
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
		}
					

		LevelEditor.prototype.snapPosition = function(position) {
			this.getActorsOfType(Floor).forEach(function(floor) {
				floor.vertices.forEach(function(v) {
					var dist = Matter.Vector.magnitude(Matter.Vector.sub(v, position));
					if(dist < this.snapDistance)
						position = Matter.Common.clone(v);
				}, this);
			}, this);
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
				ctx.strokeStyle = this.points[i+1] ? "black" : "blue";
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
				} else if(obj instanceof Enemy) {
					output = output + "\nnew Enemy(this, {x:" + obj.position.x + ",y:" + obj.position.y + "});";
				} else if(obj instanceof Player) {
					output = output + "\nnew Player(this, {x:" + obj.body.position.x + ",y:" + obj.body.position.y + "});";
				} else if(obj instanceof Ball) {
					output = output + "\nnew Ball(this, {x:" + obj.body.position.x + ",y:" + obj.body.position.y + "});";
				} else if(obj instanceof NavigationPoint) {
					navPoints.push(obj.position);
				}
			});
			if(navPoints.length){
				output = output + "\n" + JSON.stringify(navPoints) + ".forEach(function(nav){new Navpoint(this, nav)},this);";
			}
			
			console.log(output);
			
			document.getElementById("exportTextArea").innerHTML = output;
			
		}
		
	});

	var level = new LevelEditor(document.getElementById("gameArea"));
	
	return LevelEditor;
});
