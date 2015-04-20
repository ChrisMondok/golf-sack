define(['js/Actor.js', 'js/Blood.js'], function(Actor, Blood) {
	function BloodFountain(level, position, direction){
		Actor.apply(this, [level]);

		this.position = position;
		this.direction = direction;

		this.spawnAfter = [];

		for(var i = 0; i < (3 + Math.random() * 5).floor(); i++) {
			this.spawnAfter.push(0.1 * Math.random() * 2);
		}

		this.spawnAfter.sort();

		this.lifespan = 0;
	}

	BloodFountain.inherits(Actor, function(base) {
		BloodFountain.prototype.tick = function(tickEvent) {
			this.lifespan += tickEvent.dt;

			if(this.lifespan > this.spawnAfter[0]) {
				this.spawnAfter.shift();
				this.spawnBloodNow();
			}

			if(!this.spawnAfter.length)
				this.destroy();
		};

		BloodFountain.prototype.spawnBloodNow = function() {
			var dist = Math.random() * 128 + 16;
			var direction = this.direction + (Math.random() * 1/16 - 1/32)*Math.PI;
			var offset = Matter.Vector.rotate({x: dist, y: 0}, direction);

			new Blood(this.level, Matter.Vector.add(this.position, offset));
		};
	});

	return BloodFountain;
});
