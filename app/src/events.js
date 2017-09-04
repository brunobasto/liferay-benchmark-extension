import DataBase from './database';

class Events {
	static onChangeDisplayInside(event) {
		const input = event.target;
		const checked = input.checked;
		chrome.tabs.getSelected(null, (tab) => {
			const tabId = tab.id;
			DataBase.saveSetting(tabId, 'displayInside', checked).then(() => {
				DataBase.getMeasurements(tabId).then((measurements) => {
					chrome.tabs.sendMessage(tabId, {
						type: 'RENDER_MEASUREMENTS',
						tabId,
						measurements: measurements
					});
				});
			});
		});
	}

	static onChangeSendUsageData(event) {
		const input = event.target;
		const checked = input.checked;
		chrome.tabs.getSelected(null, (tab) => {
			const tabId = tab.id;
			DataBase.saveSetting(tabId, 'sendUsageData', checked);
		});
	}
}

export default Events;