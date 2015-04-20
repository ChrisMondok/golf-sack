require(['js/Level.js', 'js/Ball.js', 'js/Player.js', 'js/Floor.js', 'js/Sand.js', 'js/Water.js'], function(Level, Ball, Player, Floor, Sand, Water) {
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
				startDrawing.bind(this)();
			else
				stopDrawing.bind(this)();
			toggleAllButtonsDisabled();
		}
		
		var toggleAllButtonsDisabled = function() {
			Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){radio.disabled = !radio.disabled});
		}
		
		var getCurrentBrush = function() {
			return Array.prototype.find.call(document.querySelectorAll("input[name='brush']"), function(radio){return radio.checked}).value;
		}
		
		var startDrawing = function() {
			this.state.brush = getCurrentBrush();
			this.points = [];
		}
		
		var stopDrawing = function() {
			var b = this.state.brush;
			if (b == "grass")
				new Floor(this, this.points);
			else if(b == "sand")
				new Sand(this, this.points);
			else if(b == "water")
				new Water(this, this.points);
			else if(b == "lava")
				console.log("The floor is made of lava! (Lava is not yet implemented)");
				
		}
			
		
	//var 
		
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
				if(this.state.drawing)
					this.points.push(position);
				console.log(this.points);
			}
		};
		
	});

	var level = new LevelEditor(document.getElementById("gameArea"));
	
	return LevelEditor;
});
