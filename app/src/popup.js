import './popup.scss';
import Events from './events';
import Template from './template';
import DataBase from './database';

chrome.tabs.getSelected(null, function (tab) {
	DataBase.getTabData(tab.id).then(tabData => {
		const measurements = tabData.measurements;
		Promise.all([
			DataBase.getSetting(tab.id, 'displayInside'),
			DataBase.getSetting(tab.id, 'sendUsageData', true)
		]).then((settings) => {
			console.log(settings);
			let html = [];
			// Add measurements table
			html.push(Template.getMeasurementsTable({
				history: measurements
			}));
			// Add settings
			html.push(Template.getConfigurationsTemplate({
				displayInside: settings[0],
				sendUsageData: settings[1]
			}));
			document.body.innerHTML = html.join('');
			// Events
			const displayInsideElement = document.querySelector('#lfrBenchmarkDisplayInside');
			displayInsideElement.addEventListener('change', Events.onChangeDisplayInside);
			const sendUsageDataElement = document.querySelector('#lfrBenchmarkSendUsageData');
			sendUsageDataElement.addEventListener('change', Events.onChangeSendUsageData);
		});
	});
});