define([], function() {
	var outputNode = document.createElement('div');

	//this is sloppy, but whatever.
	document.body.appendChild(outputNode);

	return {
		log: function(string) {
			var line = document.createElement('div');
			line.innerHTML = string;
			outputNode.insertBefore(line, outputNode.firstChild);
			return line;
		},

		hide: function() {
			outputNode.style.display = "none";
		}
	}
});
