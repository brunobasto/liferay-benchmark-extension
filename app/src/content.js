import DataBase from './database';
import injectedScript from './inject';
import Template from './template';

const renderMeasurements = (measurements, tabId) => {
	DataBase.getSetting(tabId, 'displayInside').then((displayInside) => {
		let tableElement = document.querySelector('#liferayBenchmarkTable');
		if (displayInside) {
			if (!tableElement) {
				tableElement = document.createElement('div');
				tableElement.id = 'liferayBenchmarkTable';
				document.body.appendChild(tableElement);
			}
			tableElement.innerHTML = Template.getMeasurementsTable({
				displayInside,
				history: measurements
			});
		}
		else if (tableElement) {
			tableElement.parentNode.removeChild(tableElement);
		}
	});
};

window.addEventListener('message', (event) => {
	if (event.source !== window || !event.data) {
		return;
	}
	// Only tracks Liferay pages
	if (!event.data.liferay) {
		console.log('not a liferay page', event.data);
		return;
	}
	let cb;
	if (event.data.type === 'UPDATE_MEASUREMENTS') {
		cb = response => renderMeasurements(response.measurements, response.tabId);
	}
	chrome.runtime.sendMessage(event.data, cb);
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

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
	if (payload.type === 'RENDER_MEASUREMENTS') {
		renderMeasurements(payload.measurements, payload.tabId);
	}
});