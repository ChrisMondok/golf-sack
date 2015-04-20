define([], function() {
	return function(audioContext) {

		var soundUrls = {
			sploosh: "audio/sploosh.ogg",
			bgm1: "audio/synthpunk-garbage.ogg",
			bgm2: "audio/synthpunk-garbage-2.ogg",
			bgm3: "audio/synthpunk-garbage-4.ogg",
			bgm4: "audio/synthpunk-garbage-5.ogg"
		};

		var sounds = {};

		function loadSound(key) {
			if(!window.AudioContext)
				return Promise.reject();

			return getAudioData(soundUrls[key]).then(function(encoded) {
				return new Promise(function(resolve, reject) {
					audioContext.decodeAudioData(encoded, function(buffer) {
						sounds[key] = buffer;
						resolve();
					}, reject);
				});
			});
		}

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

		return Promise.all(Object.keys(soundUrls).map(loadSound)).then(function() {
			return sounds;
		});
	};
});
