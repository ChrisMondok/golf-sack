define(['js/Pawn.js', 'js/Player.js', 'js/Ball.js', 'js/NavigationPoint.js', 'js/Water.js'],
function(Pawn, Player, Ball, NavigationPoint, Water) {

	function Enemy(level, position, direction) {
		Pawn.apply(this, [level]);
		
		this.position = position;
		this.direction = direction;
		
		this.state = Enemy.STATE_DISABLED;
		this.lifetime = 0;
		this.hasBeenChasingTheSameThingFor = 0;
		
		this.radius = 10;
		
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
		Enemy.prototype.blockedBy = [Water];

		Enemy.prototype.activate = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_DISABLED)
				this.state = Enemy.STATE_CHASING;
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
		
		Enemy.prototype.kill = function() {
			if(this.state == Enemy.STATE_DEAD)
				return;

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
			//TODO: wandering
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
		
		Enemy.prototype.draw = function(ctx) {
			base.draw.apply(this, arguments);
			ctx.beginPath();
			ctx.fillStyle = "purple";
			ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
			ctx.fill();
		};
	});
	
	return Enemy;

});
