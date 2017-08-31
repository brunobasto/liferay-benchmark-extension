import Template from './template';
import './popup.scss';

chrome.tabs.getSelected(null, function (tab) {
	chrome.storage.local.get('cache', function(data) {
		const measurementsData = data.cache['tab' + tab.id];
		const lastMeasurement = measurementsData[measurementsData.length - 1];
		document.body.innerHTML = Template.getMeasurementsTable(lastMeasurement);
	});
});