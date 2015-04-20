define(['js/Player.js', 'js/Hud.js', 'js/rendererer.js', 'js/waveSourceFactory.js', 'js/loadImages.js', 'js/loadSounds.js'],
function(Player, Hud, rendererer, waveSourceFactory, loadImages, loadSounds) {
	var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

	function Level(container, images) {
		this.fg = [];
		this.actors = [];

		var self = this;

		if(window.AudioContext)
			this.audioContext = new AudioContext();

		loadImages().then(function(images) {
			loadSounds(self.audioContext).then(function(sounds) {
				self.initAudio(sounds);
			})["catch"](function() {
				console.error("NO SOUNDS FOR YOU");
				return Promise.resolve({});
			}).then(function() {
				self.init(container, images);
			});
		})["catch"](function(error) {
			console.error(error);
			alert("Couldn't initialize the level. This is serious.");
		});
	}

	Level.prototype.bgm = null;

	Level.prototype.width = 800;
	Level.prototype.height = 600;
	Level.prototype.name = "Anonymous Level";
	Level.prototype.hudMargin = 32;

	Level.prototype.init = function(container, images) {
		this.engine = Matter.Engine.create(container, {
			world: { 
				gravity: {x: 0, y: 0},
				bounds: {
					min: {x: 0, y: 0},
					max: {x: this.width, y: this.height}
				}
			},
			render: {
				controller: rendererer,
				level: this,
				images: images,
				options: {
					debug: true
				}
			}
		});

		this.score = 0;

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

		Matter.Events.on(this.engine, 'tick', this.tick.bind(this));

		this.initHud();
	};

	Level.prototype.initAudio = function(sounds) {
		this.sounds = sounds;

		if(this.bgm) {
			this.musicSource = waveSourceFactory(this.audioContext, sounds[this.bgm]);
			this.musicSource.loop = true;
			this.musicSource.connect(this.audioContext.destination);
			this.musicSource.start(0);
		}
	};

	Level.prototype.initHud = function() {
		new Hud(this);
	};

	Level.prototype.playSound = function(soundName) {
		if(this.sounds) {
			var source = waveSourceFactory(this.audioContext, this.sounds[soundName]);
			source.connect(this.audioContext.destination);
			source.start(0);

			setTimeout(function() {
				source.disconnect();
			}, 1000 * source.buffer.length / source.buffer.sampleRate);
		}
	};

	Level.prototype.drawBackground = function(render) { };
	Level.prototype.draw = function(render) { };
	Level.prototype.drawHud = function(render) { };

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

	Level.prototype.tick = function() {
		this.adjustViewport();
	};

	Level.prototype.adjustViewport = function() {
		var players = this.getActorsOfType(Player);

		if(!players.length)
			return;

		var averagePlayerPosition = {x: 0, y: 0};

		players.forEach(function(player) {
			averagePlayerPosition.x += player.body.position.x;
			averagePlayerPosition.y += player.body.position.y;
		});

		averagePlayerPosition.x /= players.length;
		averagePlayerPosition.y /= players.length;

		this.engine.render.controller.moveIntoView(this.engine, averagePlayerPosition);

		//console.log(averagePlayerPosition);
	};

	Level.prototype.handlePointerEvent = function(e) {
		var position = this.transformWindowSpaceToGameSpace({x: e.pageX, y: e.pageY}, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});

		if(e.type == 'mousemove') {
			this.dispatchMouseMove(position);
			this.mm = position;
		}

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
		var pointInCanvas = Matter.Vector.sub(point, {x: this.canvasClientRect.left, y: this.canvasClientRect.top});
		var upperLeftCorner = Matter.Vector.sub(this.engine.render.center, {x: this.engine.render.canvas.width/2, y: this.engine.render.canvas.height/2});
		return Matter.Vector.add(pointInCanvas, upperLeftCorner);
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
