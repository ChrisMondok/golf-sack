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
