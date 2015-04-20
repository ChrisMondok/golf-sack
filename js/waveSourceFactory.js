define([], function() {
	return function(audioContext, buffer) {
		var source = audioContext.createBufferSource();
		
		source.buffer = buffer;

		return source;
	};
});
