import injectedScript from './inject';
import Template from './template';

window.addEventListener('message', (event) => {
	if (event.source !== window) {
		return;
	}
	if (event.data.type === 'UPDATE_MEASUREMENTS') {
		chrome.runtime.sendMessage(event.data, function(measurements) {
			let tableElement = document.querySelector('#liferayBenchmarkTable');
			if (!tableElement) {
				tableElement = document.createElement('div');
				tableElement.id = 'liferayBenchmarkTable';
				document.body.appendChild(tableElement);
			}
			measurements.displayInside = true;
			tableElement.innerHTML = Template.getMeasurementsTable(measurements);
		});
	}
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