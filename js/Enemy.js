define(['js/Actor.js'], function(Actor) {

	function Enemy(level, position, direction) {
		Actor.apply(this, [level]);
		
		this.position = position;
		this.direction = direction;
		
		this.state = Enemy.STATE_DISABLED;
		this.lifetime = 0;
		
		this.radius = 10;
		
		this.target;
		
		level.fg.push(this);
	}

	
	Enemy.STATE_NEW = 0;
	Enemy.STATE_HUNTING = 1;
	Enemy.STATE_CHASING = 2;
	Enemy.STATE_DISABLED = 3;
	Enemy.STATE_DEAD = 4;
	
	Enemy.inherits(Actor, function(base)  {

		Enemy.prototype.speed = 48;
		
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
				this.target = null;
				this.state = Enemy.STATE_HUNTING;
			}
		};

		Enemy.prototype.chase = function() {
			if(this.state == Enemy.STATE_HUNTING)
				this.state = Enemy.STATE_CHASING;
		};
		
		Enemy.prototype.kill = function() {
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
			this.target = this.findTarget();
			if(this.target)
				this.chase();
		}

		function tickChasing(tickEvent) {
			if(!this.target || this.target.destroyed)
				this.hunt();
			else
				this.approachTarget(tickEvent);
		}
		
		Enemy.prototype.findTarget = function() {
			return this.target || this.level.engine.world.bodies.filter(function(el){return el.label == "Circle Body";})[0];
		};
		
		Enemy.prototype.approachTarget = function(tickEvent) {
			var toTarget = Matter.Vector.sub(this.target.position, this.position);
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
