require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js', 'js/Enemy.js', 'js/Actor.js'], function(Level, Ball, Player, Floor, Sand, Water, Enemy, Actor) {
	function LevelEditor() {
		Level.apply(this, arguments); //this sucks.
		
		this.state = {
			drawing: false,
			brush: null
		}
		
		this.points = [];
		
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
				console.log(this.state.drawing ? this.state.brush : "nothing");
				if(this.state.drawing){
					if(this.state.brush == "player"){
						new Player(this, position).tick = function(){};
						this.stopDrawing();
					} else if(this.state.brush == "ball"){
						new Ball(this, position).tick = function(){};
						this.stopDrawing();
					} else if(this.state.brush == "enemy"){
						new Enemy(this, position).tick = function(){};
						this.stopDrawing();
					} else if(this.state.brush == "hole"){
						console.log("No holes!");
						this.stopDrawing();
					} else if(this.state.brush == "erase"){
						console.log("Can't erase!");
						this.stopDrawing();
					} else {
						this.points.push(position);
					}
				}
				console.log(this.points);
			}
		};
		
		LevelEditor.prototype.startDrawing = function() {
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
				new Floor(this, this.points);
			else if(b == "sand")
				new Sand(this, this.points);
			else if(b == "water")
				new Water(this, this.points);
			else if(b == "lava")
				console.log("The floor is made of lava! (Lava is not yet implemented)");
			this.points = [];
			
				
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
