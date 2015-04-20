define(['js/rendererer.js', 'js/waveSourceFactory.js', 'js/loadImages.js'],
function(rendererer, waveSourceFactory, loadImages) {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container, images) {
		this.fg = [];
		this.actors = [];

		var self = this;

		loadImages().then(function(images) {
			self.init(container, images);
		}, function() {
			console.error("WTF?");
		});

	}

	Level.prototype.bgm = null;

	Level.prototype.init = function(container, images) {
		this.engine = Matter.Engine.create(container, {
			world: { gravity: {x: 0, y: 0} },
			render: {
				controller: rendererer,
				level: this,
				images: images,
				options: {
					debug: true
				}
			}
		});

		//yuck
		this.canvasClientRect = this.engine.render.canvas.getBoundingClientRect();

		this._handlePointerBound = this.handlePointerEvent.bind(this);
		this._handleTouchBound = this.handleTouchEvent.bind(this);

		document.addEventListener('click', this._handlePointerBound);
		document.addEventListener('mousemove', this._handlePointerBound);
		document.addEventListener('touchmove', this._handleTouchBound);
		document.addEventListener('touchstart', this._handleTouchBound);
		document.addEventListener('touchend', this._handleTouchBound);

		Engine.run(this.engine);

		this.initAudio();
	};

	Level.prototype.initAudio = function() {
		if(window.AudioContext)
			this.audioContext = new AudioContext();
		else
			return;

		if(this.bgm) {
			this.musicSource = waveSourceFactory(this.audioContext, this.bgm);
			this.musicSource.loop = true;
			this.musicSource.connect(this.audioContext.destination);
			this.musicSource.start(0);
		}
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

		if(e.type == 'click')
			console.log('{x: %d, y: %d}', position.x, position.y);

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

		if(this.audioContext) {
			if(this.musicSource) {
				this.musicSource.stop();
				this.musicSource.disconnect();
			}
		}
	};

	return Level;
});
