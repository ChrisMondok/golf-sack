define(['js/rendererer.js'], function(rendererer) {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container) {
		this.fg = [];
		this.actors = [];

		this.init(container);
	}

	Level.prototype.init = function(container) {
		this.engine = Matter.Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				controller: rendererer,
				level: this,
				options: {
					debug: true
				}
			}
		});


		//yuck
		this.canvasClientRect = this.engine.render.canvas.getBoundingClientRect();

		this._handlePointerBound = this.handlePointerEvent.bind(this);
		this._handleTouchBound = this.handleTouchEvent.bind(this);

		document.addEventListener('mousemove', this._handlePointerBound);
		document.addEventListener('touchmove', this._handleTouchBound);
		document.addEventListener('touchstart', this._handleTouchBound);
		document.addEventListener('touchend', this._handleTouchBound);

		Engine.run(this.engine);

	};

	Level.prototype.addToWorld = function(bodies) {
		Matter.World.add(this.engine.world, bodies);
	};

	Level.prototype.removeFromWorld = function(body) {
		Matter.World.remove(this.engine.world, body);
	};

	Level.prototype.getActorsOfType = function(type) {
		return this.actors.filter(function(actor) {
			return actor instanceof type;
		});
	};

	Level.prototype.handlePointerEvent = function(e) {
		var position = this.transformWindowSpaceToGameSpace({x: e.pageX, y: e.pageY}, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});

		if(e.type == 'mousemove')
			this.dispatchMouseMove(position);

		if(Matter.Bounds.contains(this.engine.world.bounds, position))
			e.preventDefault();
	};

	Level.prototype.handleTouchEvent = function(e) {
		var touch = e.touches[0];
		if(!touch)
			return;

		var position = Matter.Vector.sub({x: touch.pageX, y: touch.pageY}, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});

		if(e.type == 'touchmove')
			this.dispatchMouseMove(position);
	};

	Level.prototype.dispatchMouseMove = function(mousePosition) {
		this.actors.forEach(function(actor) {
			if(actor.onMouseMove)
				actor.onMouseMove(mousePosition);
		});
	};

	Level.prototype.pointIsOutOfBounds = function(point) {
		return !Matter.Bounds.contains(this.engine.world.bounds, point);
	};

	Level.prototype.transformWindowSpaceToGameSpace = function(point) {
		return Matter.Vector.sub(point, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});
	};

	Level.prototype.destroy = function() {
		document.removeEventListener('mousemove', this._handlePointerBound);
		document.removeEventListener('touchmove', this._handleTouchBound);
		document.removeEventListener('touchstart', this._handleTouchBound);
		document.removeEventListener('touchend', this._handleTouchBound);
	};

	return Level;
});
