function assertEqual(a, b) {
	if(a != b)
		throw new Error("Expected "+a+", but got "+b+".");
}
