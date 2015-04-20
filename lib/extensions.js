Function.prototype.inherits = function(base, functionThatClosesOverBase) {
	var cls = this;

	this.prototype = Object.create(base.prototype, {
		constructor: {
			value: this,
			enumerable: false,
			writeable: true,
			configurable: false
		}
	});

	functionThatClosesOverBase(base.prototype);
};

Number.prototype.squared = function() {
	return Math.pow(this, 2);
};

CanvasRenderingContext2D.prototype.polygon = function(verts) {
	this.moveTo(verts[0].x, verts[0].y);
	for(var v=1; v<verts.length; v++)
		this.lineTo(verts[v].x, verts[v].y);
};

Matter.Vertices.reallyContains = function(vertices, position) {
	return this.contains(vertices,position) || this.contains(vertices.reverse(), position);
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
