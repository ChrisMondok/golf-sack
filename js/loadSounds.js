define(['js/output.js'], function(output) {
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
			zombieHurt: "audio/zombieHurt.ogg",
			groan1: "audio/groan1.ogg",
			groan2: "audio/groan2.ogg",
			groan3: "audio/groan3.ogg",
			groan4: "audio/groan4.ogg",
			groan5: "audio/groan5.ogg"
		};

		var sounds = {};

		function loadSound(key) {
			if(!window.AudioContext)
				return Promise.reject();

			var done = false;

			var line = output.log("Loading sound "+key+".");
			drawDots();
			var start = new Date().getTime();
			return getAudioData(soundUrls[key]).then(function(encoded) {
				var loaded = new Date().getTime();
				line.innerHTML += " Loaded in "+(loaded - start)+"s.";
				return new Promise(function(resolve, reject) {
					audioContext.decodeAudioData(encoded, function(buffer) {
						var done = new Date().getTime();
						line.innerHTML += " Decoded in "+(done - loaded)+"ms.";
						sounds[key] = buffer;
						resolve();
					}, reject);
				});
			}).then(function() {
				done = true;
			}, function() {
				done = true;
			});

			function drawDots() {
				line.innerHTML += '.';

				if(!done)
					setTimeout(drawDots, 100);
			}
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
