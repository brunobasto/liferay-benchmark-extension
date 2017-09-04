class Average {
	constructor(measurements) {
		if (measurements.length > 0) {
			this.duration = measurements.reduce((sum, m) => sum + m.duration, 0) / measurements.length;
		}
		else {
			this.duration = 0;
		}
		this.count = measurements.length;
	}
}

export default Average;