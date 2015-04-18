define(['js/Actor.js'], function(Actor) {

	function Enemy(level, position, direction) {
		Actor.apply(this, [level]);
		
		this.position = position;
		this.direction = direction;
		
		this.state = Enemy.STATE_DISABLED;
		this.lifetime = 0;
		this.activeTime = 0;
		
		this.radius = 10;
		
		this.target = {x:0, y:0};
		this.speed = 1;
		
		level.fg.push(this);
	}
	
	Enemy.STATE_NEW = 0;
	Enemy.STATE_ACTIVE = 1;
	Enemy.STATE_DISABLED = 2;
	Enemy.STATE_DEAD = 3;
	
	
	Enemy.inherits(Actor, function(base) {
		
		Enemy.prototype.activate = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_DISABLED)
				this.state = Enemy.STATE_ACTIVE;
		}
		
		Enemy.prototype.disable = function() {
			if (this.state == Enemy.STATE_NEW || this.state == Enemy.STATE_ACTIVE)
				this.state = Enemy.STATE_DISABLED;
		}
		
		Enemy.prototype.kill = function() {
			this.state = Enemy.STATE_DEAD;
		}

		Enemy.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);
			var dt = tickEvent.dt;
			if(this.lifetime > 3)
				this.activate();
			
			if (this.state == Enemy.STATE_ACTIVE){
				this.lifetime += dt;
				this.activeTime += dt;
				// MOVE IT MOVE IT
				this.findTarget();
				this.approachTarget(dt);
			} else if (this.state == Enemy.STATE_DISABLED){
				this.lifetime += dt;
			}
			
		}
		
		Enemy.prototype.findTarget = function() {
			this.target = this.level.engine.world.bodies.filter(function(el){return el.label === "Circle Body"})[0].position;
		}
		
		Enemy.prototype.approachTarget = function(dt) {
			var toTarget = Matter.Vector.sub(this.target, this.position);
			this.direction = Matter.Vector.angle({x:0, y:0}, toTarget);
			this.position = Matter.Vector.add(this.position, Matter.Vector.mult(Matter.Vector.normalise(toTarget), this.speed));
		}
		
		Enemy.prototype.draw = function(ctx) {
			base.draw.apply(this, arguments);
			ctx.beginPath();
			ctx.fillStyle = "purple";
			ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
			ctx.fill();
		}
		
	});
	
	return Enemy;
	
});