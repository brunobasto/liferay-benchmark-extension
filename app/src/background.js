import DataBase from './database';

function messageHandler(payload, sender, sendResponse) {
	if (!sender.tab) {
		return;
	}
	// Do not track measurments for empty new tab
	if (sender.tab.url.indexOf('chrome://') === 0) {
		return;
	}
	const tabId = sender.tab.id;
	if (payload.type === 'UPDATE_DURATION') {
		const toSeconds = (ms) => String((ms / 1000).toPrecision(3)).substring(0, 4);
		chrome.browserAction.setBadgeText({text: toSeconds(payload.duration), tabId: tabId});
	}
	if (payload.type === 'UPDATE_MEASUREMENTS') {
		// Persist data
		DataBase.saveMeasurements(tabId, payload.measurements).then(() => {
			DataBase.getMeasurements(tabId).then((measurements) => {
				sendResponse({
					measurements: measurements,
					tabId
				});
			});
		});
		return true;
	}
}

chrome.runtime.onMessage.addListener(messageHandler);
chrome.runtime.onMessageExternal.addListener(messageHandler);