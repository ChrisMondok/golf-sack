(function() {
	function A() {}

	A.prototype.getNumber = function() {
		return 1;
	};

	function B() {}

	B.inherits(A, function(base) {
		B.prototype.getNumber = function() {
			return base.getNumber() + 2;
		};
	});

	function C() {}

	C.inherits(B, function(base) {
		C.prototype.getNumber = function() {
			return base.getNumber() + 3;
		};
	});

	assertEqual(new C().getNumber(), 6);
})();
