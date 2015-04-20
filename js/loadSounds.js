define([], function() {
	return function(audioContext) {

		var soundUrls = {
			sploosh: "audio/sploosh.ogg",
			bgm1: "audio/synthpunk-garbage.ogg",
			bgm2: "audio/synthpunk-garbage-2.ogg",
			bgm3: "audio/synthpunk-garbage-4.ogg",
			bgm4: "audio/synthpunk-garbage-5.ogg",
			golfHit1: "audio/golf-hit1.ogg",
			golfHit2: "audio/golf-hit2.ogg",
			golfHit3: "audio/golf-hit3.ogg",
			golfHit4: "audio/golf-hit4.ogg",
			zombieHurt: "audio/zombieHurt.ogg"
		};

		var sounds = {};

		function loadSound(key) {
			if(!window.AudioContext)
				return Promise.reject();

			return getAudioData(soundUrls[key]).then(function(encoded) {
				return new Promise(function(resolve, reject) {
					var start = new Date().getTime();
					audioContext.decodeAudioData(encoded, function(buffer) {
						var end = new Date().getTime();
						console.info("Decoded "+key+" in %d ms", end - start);
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
