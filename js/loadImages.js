define(['js/output.js'], function(output) {
	return function() {
		var imageUrls = {
			water: "images/water.png",
			waterLight: "images/waterLight.png",
			waterDark: "images/waterDark.png",
			sand: "images/sand.png",
			grass: "images/grass.png",
			zombie1: "images/zombie1.png",
			zombie2: "images/zombie2.png",
			player: "images/player.png",
			blood: "images/blood.png"
		};

		var images = {};

		function loadImage(key) {

			var image = document.createElement('img');
			images[key] = image;

			var log = output.log("Load image "+key+".");

			return new Promise(function(resolve, reject) {

				image.addEventListener('load', function(loaded) {
					images[key] = image;
					log.innerHTML += ".. Done";
					resolve();
				});

				image.addEventListener('error', function(error) {
					reject(error);
				});

				image.src = imageUrls[key];
			});
		}

		return Promise.all(Object.keys(imageUrls).map(loadImage)).then(function() {
			return images;
		});
	};
});
