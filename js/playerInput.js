define([], function() {
	document.addEventListener('keydown', keyHandler);

	document.addEventListener('keyup', keyHandler);

	var held = {
		up: false,
		left: false,
		down: false,
		right: false
	};

	var mapping = {
		"87": "up", //W
		"65": "left", //A
		"83": "down", //S
		"68": "right", //D

		"38": "up",
		"37": "left",
		"40": "down",
		"39": "right",

		"77": "mulligan"
	};

	return {
		getNormalizedMovement: function() {
			return Matter.Vector.normalise({
				x: -1 * held.left + 1 * held.right,
				y: -1 * held.up + 1 * held.down
			});
		},

		getWantsToMulligan: function() {
			return held.mulligan;
		}
	};

	function keyHandler(keyEvent) {
		var code = keyEvent.which || keyEvent.keyCode;

		if(code in mapping) {
			var intent = mapping[code];
			held[mapping[code]] = keyEvent.type == 'keydown';
			keyEvent.preventDefault();
		}
	}
});
