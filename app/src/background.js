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

function messageHandler(payload, sender, sendResponse) {
	// Do not track measurments for empty new tab
	if (sender.tab.url.indexOf('chrome://') === 0) {
		return;
	}
	if (payload.type === 'UPDATE_DURATION') {
		const toSeconds = (ms) => String((ms / 1000).toPrecision(3)).substring(0, 4);
		chrome.browserAction.setBadgeText({text: toSeconds(payload.duration), tabId: sender.tab.id});
	}
	if (payload.type === 'UPDATE_MEASUREMENTS') {
		chrome.storage.local.get('cache', (data) => {
			if (!data.cache) {
				data.cache = {};
			}
			let measurementsHistory = data.cache['tab' + sender.tab.id];
			if (!measurementsHistory) {
				measurementsHistory = [];
			}
			const measurements = payload.measurements;
			measurementsHistory.push(measurements);
			// Senna average data
			const sennaAverage = new Average(measurementsHistory.filter(m => m.spa === true));
			measurements.sennaDurationAverage = sennaAverage.duration;
			measurements.sennaNavigationCount = sennaAverage.count;
			// Regular navigation average data
			const regularAverage = new Average(measurementsHistory.filter(m => m.spa === false));
			measurements.regularDurationAverage = regularAverage.duration;
			measurements.regularNavigationCount = regularAverage.count;
			// Persist data
			data.cache['tab' + sender.tab.id] = measurementsHistory;
			chrome.storage.local.set(data);
			sendResponse(measurements);
		});
		return true;
	}
}

chrome.runtime.onMessage.addListener(messageHandler);
chrome.runtime.onMessageExternal.addListener(messageHandler);

chrome.tabs.onRemoved.addListener(function(tabId) {
	chrome.storage.local.get('cache', function(data) {
		if (data.cache) delete data.cache['tab' + tabId];
		chrome.storage.local.set(data);
	});
});