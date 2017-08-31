const toSeconds = (ms) => String((ms / 1000).toPrecision(3)).substring(0, 4);

function messageHandler(payload, sender, sendResponse) {
	if (payload.type === 'UPDATE_DURATION') {
		chrome.browserAction.setBadgeText({text: toSeconds(payload.duration), tabId: sender.tab.id});
	}
	if (payload.type === 'UPDATE_MEASUREMENTS') {
		chrome.storage.local.get('cache', function(data) {
			if (!data.cache) data.cache = {};
			let measurementsData = data.cache['tab' + sender.tab.id];
			if (!measurementsData) {
				measurementsData = [];
			}
			measurementsData.push(payload.measurements);
			// Senna average data
			const sennaMeasurements = measurementsData.filter(m => m.spa === true);
			if (sennaMeasurements.length > 0) {
				payload.measurements.averageSennaDuration = sennaMeasurements.reduce((sum, m) => sum + m.duration, 0) / sennaMeasurements.length;
			}
			else {
				payload.measurements.averageSennaDuration = 0;
			}
			payload.measurements.sennaNavigationCount = sennaMeasurements.length;
			// Regular navigation average data
			const regularMeasurements = measurementsData.filter(m => m.spa === false);
			if (regularMeasurements.length > 0) {
				payload.measurements.averageRegularDuration = regularMeasurements.reduce((sum, m) => sum + m.duration, 0) / regularMeasurements.length;
			}
			else {
				payload.measurements.averageRegularDuration = 0;
			}
			payload.measurements.regularNavigationCount = regularMeasurements.length;
			// Persist data
			data.cache['tab' + sender.tab.id] = measurementsData;
			chrome.storage.local.set(data);
			sendResponse(payload.measurements);
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