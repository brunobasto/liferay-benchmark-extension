export default () => {
	const domain = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
	const getPerformanceEntries = (type) => performance.getEntries().filter((e) => e.initiatorType === type);
	const getPerformanceTime = (entries) => entries.reduce((sum, e) => sum + e.duration, 0);
	const postDuration = (duration) => {
		postMessage({
			duration: duration,
			type: 'UPDATE_DURATION'
		}, domain);
	};
	const postMeasurements = (duration, spa = false) => {
		const scripts = getPerformanceEntries('script');
		const links = getPerformanceEntries('link');
		const measurements = {
			duration,
			spa,
			scriptsCount: scripts.length,
			scriptsTime: getPerformanceTime(scripts),
			linksCount: links.length,
			linksTime: getPerformanceTime(links)
		};
		postMessage({
			measurements,
			type: 'UPDATE_MEASUREMENTS'
		}, domain);
	};
	if (window.Liferay) {
		Liferay.on('startNavigate', () => {
			performance.clearResourceTimings();
			performance.mark('startNavigate');
		});
		Liferay.on('endNavigate', () => {
			performance.mark('endNavigate');
			performance.measure('spaLoadMeasurement', 'startNavigate', 'endNavigate');
	  		// Update badge duration
	  		const duration = performance.getEntriesByName('spaLoadMeasurement')[0].duration;
			postDuration(duration);
			performance.clearMarks();
	  		performance.clearMeasures();
			// Update detailed measurements
			setTimeout(() => postMeasurements(duration, true), 500);
		});
	}
	setTimeout(() => {
		const timing = performance.timing;
		const start = timing.redirectStart === 0 ? timing.fetchStart : timing.redirectStart;
		const duration = timing.loadEventEnd - start;
		// Update detailed measurements
		postMeasurements(duration);
		// Update badge duration
		postDuration(duration);
	}, 0);
};