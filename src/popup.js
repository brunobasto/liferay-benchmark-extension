chrome.tabs.getSelected(null, function (tab) {
	chrome.storage.local.get('cache', function(data) {
		const measurements = data.cache['tab' + tab.id];
		document.querySelector('#scriptsCount').innerText = measurements.scriptsCount;
	});
});