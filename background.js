var tab;

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
		chrome.tabs.sendMessage(tab[0].id, {message: 'init'});
	});
});