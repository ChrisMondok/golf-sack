define([], function() {
	return function(audioContext, url) {
		var source = audioContext.createBufferSource();
		
		getAudioData(url).then(decodeAudioData).then(function(buffer) {
			source.buffer = buffer;
		}, function(error) {
			console.error(error);
		});

		return source;

		function decodeAudioData(encoded) {
			return new Promise(function(resolve, reject) {
				audioContext.decodeAudioData(encoded, resolve, reject);
			});
		}
	};

	function getAudioData(url) {
		return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";

			request.addEventListener("load", function() {
				resolve(request.response);
			});

			request.addEventListener("error", function(error) {
				reject(error);
			});

			request.send();
		});
	}

});
