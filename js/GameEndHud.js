define(['js/Actor'], function(Actor) {
	
	function GameEndHud(level, message)	{
		Actor.apply(this, arguments);
		
		this.message = message;
	}
	
	GameEndHud.inherits(Actor, function(base) {
		
		GameEndHud.prototype.fontSize = 32;
		GameEndHud.prototype.margin = 32;
		GameEndHud.prototype.drawHud = function(render) {
			
			var ctx = render.context;
			
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = this.fontSize + "px sans-serif";
			
			var nameplateWidth = ctx.measureText(this.message).width + 16;
			var nameplateHeight = 32;

			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.beginPath();
			ctx.fillRect(render.canvas.width/2 - nameplateWidth/2, render.canvas.height/2 - nameplateHeight, nameplateWidth, nameplateHeight);

			ctx.fillStyle = "white";
			ctx.fillText(this.message, render.canvas.width/2, render.canvas.height/2 - nameplateHeight/2);

		}
		
	});
	
	return GameEndHud;
	
});