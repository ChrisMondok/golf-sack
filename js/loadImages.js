define(['js/output.js'], function(output) {
	return function() {
		var imageUrls = {
			water: "images/water.png",
			sand: "images/sand.png"
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
