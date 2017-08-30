(function() {
	const injectedScript = () => {
		const domain = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
		if (window.Liferay) {
			Liferay.on('startNavigate', () => {
				performance.clearResourceTimings();
				performance.mark('startNavigate');
			});
			Liferay.on('endNavigate', () => {
				performance.mark('endNavigate');
				performance.measure('spaLoadMeasurement', 'startNavigate', 'endNavigate');
		  		// Update badge duration
				window.postMessage({
					duration: performance.getEntriesByName('spaLoadMeasurement')[0].duration,
					type: 'UPDATE_DURATION'
				}, domain);
				performance.clearMarks();
		  		performance.clearMeasures();
				// Update detailed measurements
				setTimeout(() => {
					console.log(performance.getEntries());
					const getPerformanceEntryCount = (type) => performance.getEntries().filter((e) => e.initiatorType === type).length;
					window.postMessage({
						measurements: {
							scriptsCount: getPerformanceEntryCount('script')
						},
						type: 'UPDATE_MEASUREMENTS'
					}, domain);
				}, 500);
			});	
		}
		// Update detailed measurements
		window.postMessage({
			measurements: {
				scriptsCount: performance.getEntries().filter((e) => e.initiatorType === 'script').length
			},
			type: 'UPDATE_MEASUREMENTS'
		}, domain);
		setTimeout(() => {
			// Update badge duration
			const timing = performance.timing;
			const start = timing.redirectStart === 0 ? timing.fetchStart : timing.redirectStart;
			window.postMessage({
				duration: timing.loadEventEnd - start,
				type: 'UPDATE_DURATION'
			}, domain);
		}, 0);
	};

	window.addEventListener('message', (event) => {
		if (event.source !== window) {
			return;
		}
		chrome.runtime.sendMessage(event.data);
	});

	function handleOnLoad() {
		var script = document.createElement('script');
		script.appendChild(document.createTextNode('('+ injectedScript +')();'));
		(document.body || document.head || document.documentElement).appendChild(script);
	}

	if (document.readyState === 'complete') {
		handleOnLoad();
	}
	else {
		window.addEventListener('load', () => handleOnLoad());
	}
})();