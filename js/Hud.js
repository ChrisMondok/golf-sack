define(['js/Actor', 'js/Enemy.js'], function(Actor, Enemy) {
	function Hud(level) {
		Actor.apply(this, arguments);
	}

	Hud.inherits(Actor, function(base) {
		Hud.prototype.margin = 32;
		Hud.prototype.fontSize = 16;

		Hud.prototype.drawHud = function(render) {
			var ctx = render.context;

			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = this.fontSize + "px sans-serif";

			this.drawScoreboard(render);
			this.drawNameplate(render);
			this.drawEnemiesCounter(render);
		};

		Hud.prototype.drawScoreboard = function(render) {
			var ctx = render.context;

			var h = 3 * this.fontSize;
			var w = [ctx.measureText("score"), ctx.measureText(this.level.score)].map('width').max() + 16;
			var m = this.margin;

			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fillRect(m, m, w, h);

			ctx.fillStyle = "white";
			ctx.fillText("score",m + w/2, m + h/3, w);
			ctx.fillText(this.level.score, m + w/2, m+h*2/3, w);
		};

		Hud.prototype.drawNameplate = function(render) {
			var ctx = render.context;

			var nameplateWidth = ctx.measureText(this.level.name).width + 16;
			var nameplateHeight = 32;

			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.beginPath();
			ctx.fillRect(render.canvas.width/2 - nameplateWidth/2, render.canvas.height - this.margin - nameplateHeight, nameplateWidth, nameplateHeight);

			ctx.fillStyle = "white";
			ctx.fillText(this.level.name, render.canvas.width/2, render.canvas.height - this.margin - nameplateHeight/2);
		};

		Hud.prototype.drawEnemiesCounter = function(render) {
			var ctx = render.context;
			var numEnemies = this.level.getActorsOfType(Enemy).filter(function(enemy) { return !enemy.isDead(); }).length;

			var label = "zombies";

			var w = [ctx.measureText(label), ctx.measureText(numEnemies)].map('width').max() + 16;
			var h = 3 * this.fontSize;
			var m = this.margin;

			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fillRect(render.canvas.width - w -m, m, w, h);

			ctx.fillStyle = "white";
			ctx.fillText(label,render.canvas.width - w/2 - m, m + h/3, w);
			ctx.fillText(numEnemies,render.canvas.width - w/2 - m, m + 2 * h/3, w);
		};
	});

	return Hud;
});
