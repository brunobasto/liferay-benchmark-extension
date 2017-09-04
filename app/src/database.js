import WeDeploy from 'wedeploy';

class DataBase {
	static getTabData(tabId) {
		return new Promise((resolve) => {
			chrome.storage.local.get('cache', (data) => {
				if (!data.cache) {
					data.cache = {};
				}
				if (!data.cache[`tab${tabId}`]) {
					data.cache[`tab${tabId}`] = {
						measurements: [],
						settings: []
					};
				}
				chrome.storage.local.set(data, () => resolve(data.cache[`tab${tabId}`], data));
			});
		});
	}

	static getSetting(tabId, name, defaultValue = false) {
		return DataBase.getTabData(tabId).then((tabData) => {
			const entry = tabData.settings.find(s => s.name === name);
			return entry !== undefined ? entry.value : defaultValue;
		});
	}

	static getMeasurements(tabId) {
		return new Promise((resolve) => {
			DataBase.getTabData(tabId).then((tabData) => {
				resolve(tabData.measurements);
			});
		});
	}

	static clearHistory(tabId) {
		return new Promise((resolve) => {
			DataBase.getTabData(tabId).then((tabData) => {
				chrome.storage.local.get('cache', (data) => {
					data.cache[`tab${tabId}`].measurements = [];
					chrome.storage.local.set(data, () => resolve(data));
				});
			});
		});
	}

	static saveMeasurements(tabId, measurements) {
		DataBase.getSetting(tabId, 'sendUsageData', true).then((sendUsageData) => {
			if (sendUsageData) {
				WeDeploy
				.data('https://database-liferaybenchmarks.wedeploy.io')
				.create('usage', measurements);
			}
		});
		return new Promise((resolve) => {
			DataBase.getTabData(tabId).then((tabData) => {
				chrome.storage.local.get('cache', (data) => {
					let currentMeasurements = data.cache[`tab${tabId}`].measurements;
					if (!currentMeasurements) {
						currentMeasurements = [];
					}
					currentMeasurements.push(measurements);
					data.cache[`tab${tabId}`].measurements = currentMeasurements;
					chrome.storage.local.set(data, () => resolve(data));
				});
			});
		});
	}

	static saveSettings(tabId, settings) {
		return new Promise((resolve) => {
			DataBase.getTabData(tabId).then((tabData) => {
				chrome.storage.local.get('cache', (data) => {
					data.cache[`tab${tabId}`].settings = settings;
					chrome.storage.local.set(data, () => resolve(data));
				});
			});
		});
	}

	static saveSetting(tabId, name, value) {
		return DataBase.getTabData(tabId).then((tabData) => {
			const currentSetting = tabData.settings.find(s => s.name === name);
			if (currentSetting) {
				currentSetting.value = value;
			}
			else {
				tabData.settings.push({
					name: name,
					value: value
				});
			}
			return DataBase.saveSettings(tabId, tabData.settings);
		});
	}
}

export default DataBase;