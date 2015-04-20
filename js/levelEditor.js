require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/Actor.js'], function(Level, Ball, Player, Floor, Sand, Water, Enemy, Actor) {
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
		
	}

	LevelEditor.inherits(Level, function(base) {
		LevelEditor.prototype.snapDistance = 32;

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
						var p = new Player(this, position).tick = function(){};
						p.tick = function(){};
						this.placedObjects.push(p);
						this.stopDrawing();
					} else if(this.state.brush == "ball"){
						var b = new Ball(this, position).tick = function(){};
						b.tick = function(){};
						this.placedObjects.push(b);
						console.log("stopping draw");
						this.stopDrawing();
					} else if(this.state.brush == "enemy"){
						var e = new Enemy(this, position).tick = function(){};
						e.tick = function(){};
						this.placedObjects.push(e);
						this.stopDrawing();
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
			for(var i=this.placedObjects.length-1; i>=0; i--){
				if(Matter.Vertices.contains(this.placedObjects[i].vertices, position)){
					console.log(this.placedObjects[i]);
					var obj = this.placedObjects[i];
					if(obj.destroy)
						obj.destroy();
					this.placedObjects.splice(i,1);
					break;
				}
			}
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
			document.getElementById("actorList").innerHTML = this.placedObjects;
		}
		
		LevelEditor.prototype.draw = function(renderer) {
			base.draw.apply(this, arguments);
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
		
	});

	var level = new LevelEditor(document.getElementById("gameArea"));
	
	return LevelEditor;
});
