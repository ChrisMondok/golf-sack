define(['js/Pawn.js', 'js/Player.js', 'js/Ball.js', 'js/NavigationPoint.js', 'js/Water.js', 'js/Wall.js'],
function(Pawn, Player, Ball, NavigationPoint, Water, Wall) {

	function Enemy(level, position, direction) {
		Pawn.apply(this, [level]);
		
		this.position = position;
		this.direction = direction;
		
		this.state = Enemy.STATE_DISABLED;
		this.lifetime = 0;
		this.hasBeenChasingTheSameThingFor = 0;

		this.radius = 10;
		
		this.vertices = generateCircleVertices(this.radius, this.position);
		
		function generateCircleVertices(r, pos, num) {
			var n = num || 16;
			var vertices = [];
			for(var i=0; i<n; i++)
				vertices.push(Matter.Vector.add(pos, Matter.Vector.rotate({x:r, y:0},Math.PI * 2 * i / n)));
			return vertices;
		}
			
		
		this.target;
		
		level.fg.push(this);
	}

	Enemy.STATE_NEW = 0;
	Enemy.STATE_HUNTING = 1;
	Enemy.STATE_CHASING = 2;
	Enemy.STATE_DISABLED = 3;
	Enemy.STATE_DEAD = 4;
	
	Enemy.inherits(Pawn, function(base)  {
		Enemy.prototype.speed = 48;
		Enemy.prototype.visionDistance = 400;
		Enemy.prototype.attentionSpan = 3;
		Enemy.prototype.blockedBy = [Water, Wall];
		Enemy.prototype.points = 5;
		Enemy.prototype.speechCooldown = 5;

		Enemy.prototype.activate = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_DISABLED)
				this.state = Enemy.STATE_CHASING;
			this.speechCooldown = Math.random() * Enemy.prototype.speechCooldown;
		};
		
		Enemy.prototype.disable = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_CHASING)
				this.state = Enemy.STATE_DISABLED;
		};

		Enemy.prototype.hunt = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_CHASING) {
				this.state = Enemy.STATE_HUNTING;
			}
		};

		Enemy.prototype.chase = function() {
			if(this.state == Enemy.STATE_HUNTING) {
				this.hasBeenChasingTheSameThingFor = 0;
				this.state = Enemy.STATE_CHASING;
			}
		};

		Enemy.prototype.speak = function() {
			if(this.state == Enemy.STATE_HUNTING || this.state == Enemy.STATE_CHASING) {
				this.level.playSoundAtPoint(["groan1", "groan2", "groan3", "groan4", "groan5", "shuffle"].randomize()[0], this.position);
				this.speechCooldown = (Math.random() + 0.5)*Enemy.prototype.speechCooldown;
			}
		};
		
		Enemy.prototype.kill = function() {
			if(this.state == Enemy.STATE_DEAD)
				return;

			this.level.playSound("zombieHurt");

			this.level.score -= this.points;

			this.state = Enemy.STATE_DEAD;
		};

		Enemy.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);

			if(this.state != Enemy.STATE_DEAD)
				this.lifetime += tickEvent.dt;

			switch(this.state) {
				case Enemy.STATE_NEW:
					tickNew.apply(this, arguments);
					break;

				case Enemy.STATE_HUNTING:
					tickHunting.apply(this, arguments);
					break;

				case Enemy.STATE_CHASING:
					tickChasing.apply(this, arguments);
					break;

				case Enemy.STATE_DISABLED:
					tickDisabled.apply(this, arguments);
					break;

				case Enemy.STATE_DEAD:
					tickDisabled.apply(this, arguments);
					break;

				default:
					throw new Error("INVALID STATE");
			}
		};

		Enemy.prototype.isDead = function() {
			return this.state == Enemy.STATE_DEAD;
		};

		function tickNew() {
			if(this.lifetime > 3)
				this.activate();
		}

		function tickDisabled() {
			if(this.lifetime > 3)
				this.activate();
		}

		function tickHunting(tickEvent) {
			this.acquireTarget();
			if(this.target)
				this.chase();

			this.speechCooldown -= tickEvent.dt;
			if(this.speechCooldown < 0)
				this.speak();

			this.killPlayers();
		}

		function tickChasing(tickEvent) {
			this.hasBeenChasingTheSameThingFor += tickEvent.dt;

			if(this.hasBeenChasingTheSameThingFor > this.attentionSpan) {
				this.hasBeenChasingTheSameThingFor = 0;
				this.acquireTarget();
			}

			if(this.stillHasTarget())
				this.approachTarget(tickEvent);

			else {
				this.target = null;
				this.hunt();
			}

			this.speechCooldown -= tickEvent.dt;
			if(this.speechCooldown < 0)
				this.speak();

			this.killPlayers();
		}

		Enemy.prototype.acquireTarget = function() {
			var interestingThings = [
				this.level.getActorsOfType(Player),
				this.level.getActorsOfType(require('js/Ball.js')),
				this.level.getActorsOfType(NavigationPoint)
			].map(function(it) {
				return it.randomize();
			}, this).flatten();

			var target = interestingThings.find(function(thing) {
				return this.canSee(thing);
			}, this);

			this.target = target;

			if(!this.stillHasTarget())
				this.target = null;
		};

		Enemy.prototype.stillHasTarget = function() {
			if(!this.target)
				return false;

			if(this.target.destroyed)
				return false;

			if(!this.canSee(this.target))
				return false;

			return true;
		};

		Enemy.prototype.approachTarget = function(tickEvent) {
			var toTarget = Matter.Vector.sub(this.target.position || this.target.body.position, this.position);
			this.direction = Matter.Vector.angle({x:0, y:0}, toTarget);
			this.position = Matter.Vector.add(this.position, Matter.Vector.mult(Matter.Vector.normalise(toTarget), this.speed * tickEvent.dt));
		};

		Enemy.prototype.killPlayers = function() {
			this.level.getActorsOfType(Player).filter(function(player) {
				return this.getDistanceTo(player) < this.radius + player.body.circleRadius;
			}, this).forEach(function(player) {
				player.kill();
			});
		};
		
		Enemy.prototype.draw = function(render) {
			base.draw.apply(this, arguments);
			
			var ctx = render.context;

			ctx.beginPath();
			ctx.fillStyle = "purple";
			ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
			ctx.fill();
		};
	});
	
	return Enemy;

});
