define([], function() {
	return function(audioContext, seconds) {
		var source = audioContext.createBufferSource();
		source.buffer = createNoiseBuffer(audioContext, seconds);

		return source;
	};

	function createNoiseBuffer(audioContext, seconds) {
		var numChannels = 2;

		var numFrames = audioContext.sampleRate * seconds;
		var buffer = audioContext.createBuffer(numChannels, numFrames, audioContext.sampleRate);

		for(var c = 0; c < numChannels; c++) {
			var channel = buffer.getChannelData(c);
			for(var frame = 0; frame < numFrames; frame++) {
				channel[frame] = Math.random() * 2 - 1;
			}
		}

		return buffer;
	}
});
