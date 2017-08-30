const toSeconds = (ms) => String((ms / 1000).toPrecision(3)).substring(0, 4);

function messageHandler(payload, sender, sendResponse) {
    if (payload.type === 'UPDATE_DURATION') {
        chrome.browserAction.setBadgeText({text: toSeconds(payload.duration), tabId: sender.tab.id});
    }
    if (payload.type === 'UPDATE_MEASUREMENTS') {
        chrome.storage.local.get('cache', function(data) {
            if (!data.cache) data.cache = {};
            data.cache['tab' + sender.tab.id] = payload.measurements;
            chrome.storage.local.set(data);
        });    
    }
    sendResponse();
}

chrome.runtime.onMessage.addListener(messageHandler);
chrome.runtime.onMessageExternal.addListener(messageHandler);

chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.storage.local.get('cache', function(data) {
        if (data.cache) delete data.cache['tab' + tabId];
        chrome.storage.local.set(data);
    });
});