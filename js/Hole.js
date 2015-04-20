define(['js/Actor.js', 'js/Ball.js'], function(Actor, Ball) {
	
	function Hole(level, position) {
		Actor.apply(this, [level]);
		this.level = level;
		this.position = position;
		
		this.flagColor = "red";
	}
	
	Hole.inherits(Actor, function(base) {
		
		Hole.prototype.radius = 8;
		Hole.prototype.poleHeight = 120;
		Hole.prototype.poleWidth = 3;
		Hole.prototype.flagHeight = 30;
		Hole.prototype.flagLength = 50;
		
		Hole.prototype.tick = function() {
			this.checkForBalls();
		}
		
		Hole.prototype.checkForBalls = function() {
			this.level.getActorsOfType(Ball).filter(function(ball) {
				return Matter.Vector.magnitudeSquared(Matter.Vector.sub(ball.body.position, this.position)) < this.radius.squared();
			}, this).forEach(function(ball) {
				ball.sink(this);
				this.flagColor = "yellow";
			},this);
		}
		
		Hole.prototype.draw = function(render) {
			
			var ctx = render.context;
			drawHole.call(this,ctx);
			drawPole.call(this,ctx);
			drawFlag.call(this,ctx);
			
		}
		
		function drawHole(ctx) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
			ctx.fill();
		}
		
		function drawPole(ctx) {
			ctx.beginPath();
			ctx.fillStyle = "grey";
			ctx.rect(
				(this.position.x - this.poleWidth/2),
				(this.position.y - this.poleHeight),
				this.poleWidth,
				this.poleHeight
			);
			ctx.fill();
		}
		
		function drawFlag(ctx) {
			ctx.beginPath();
			ctx.fillStyle = this.flagColor;
			ctx.polygon([
				{x:(this.position.x - this.poleWidth/2), y:(this.position.y - this.poleHeight)},
				{x:(this.position.x - this.poleWidth/2), y:(this.position.y - this.poleHeight + this.flagHeight)},
				{x:(this.position.x - this.poleWidth/2 - this.flagLength), y:(this.position.y - this.poleHeight + this.flagHeight / 2)}
			]);
			ctx.fill();
		}
		
		
	});
	
	return Hole;
});