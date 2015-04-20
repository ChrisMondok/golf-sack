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

CanvasRenderingContext2D.prototype.drawImageRotated = function(image, x, y, angle) {
	this.save();
	this.translate(x, y);
	this.rotate(angle);
	this.drawImage(image, -image.width/2, -image.height/2);
	this.restore();
};

Matter.Vertices.reallyContains = function(vertices, position) {
	return this.contains(vertices,position) || this.contains(vertices.reverse(), position);
};

require(['lib/es6-promise-2.0.1.min.js'], function(promise) {
	promise.polyfill();
});

window.AudioContext = window.AudioContext || window.webkitAudioContext;
