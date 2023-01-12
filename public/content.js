// DEFINITION
const SCREEN_SHOT_KEY = "SCREEN_SHOT_KEY"
const HOVER_EVENT_KEY = "HOVER_EVENT_KEY"
const IMG_SEARCH_EVENT_KEY = "IMG_SEARCH_EVENT_KEY"

// disalbe all logging
// console.log = function () { }
var histoInfo = {
	itemList: [],
	hiddenList: [],
	visibleList: [],
};
var HistoDict = {};
var CurrentUrl = null;
/***********************************************************************************
 * 				Append ShootPanel into website
 * 		- After load done, init multiple listeners and create Oolet Box
 ***********************************************************************************/
window.addEventListener('load', function (e) {
	console.log("Content script load...")
	init()
})
window.addEventListener('beforeunload', function (e) {
	if (HistoDict != {}) {
		var time = new Date(Date.now());
		if (CurrentUrl in HistoDict)
			HistoDict[CurrentUrl].hiddenList.push(time);
		chrome.runtime.sendMessage({ type: "FROM_CONTENT_ITEM_UNLOAD", data: HistoDict });
	}
})

const init = () => {
	mountPropFunc()

	//ask item list
	chrome.runtime.sendMessage(
		{ type: "FROM_CONTENT_ASK_ITEM_LIST" },
		function (response) {
			IL_Interface['createLayout'](response.items, response.focusItemName)
		});

	//listener
	document.addEventListener("visibilitychange", () => { TabVisiblefunc(document.hidden) })

	setInterval(() => {
		var time = new Date(Date.now())
		if (location.href !== CurrentUrl) {
			if (CurrentUrl != null && CurrentUrl in HistoDict)
				HistoDict[CurrentUrl].hiddenList.push(time)

			CurrentUrl = location.href;

			//create histo data
			if ((CurrentUrl in HistoDict) == false)
				HistoDict[CurrentUrl] = { ...histoInfo }
			HistoDict[CurrentUrl].visibleList.push(time)
		}
	}, 1000);
}

function TabVisiblefunc(hidden) {
	var time = new Date(Date.now())
	if (CurrentUrl in HistoDict) {
		if (hidden)
			HistoDict[CurrentUrl].hiddenList.push(time);
		else
			HistoDict[CurrentUrl].visibleList.push(time);
	}
}

function mountPropFunc() {
	//mount ItemLayout script prop
	IL_CommProp["SEND_ITEM_CORRESPONSE_URL"] = ({ itemName, url }) => {
		if (CurrentUrl in HistoDict)
			HistoDict[CurrentUrl].itemList.push({ 'item': itemName, 'time': new Date(Date.now()) });
	}
	IL_CommProp["SEND_FOCUS_ITEM"] = ({ focusItemName }) => {
		chrome.runtime.sendMessage({ type: "FROM_CONTENT_SET_FOCUS_ITEM", data: focusItemName });
	}
}
/***********************************************************************************
 * 				Get message from website
 * 		- runtime onMessage listener
 *		- https://pjchender.github.io/2019/05/21/chrome-content-script/
 ***********************************************************************************/
window.addEventListener('message', function (event) {
	// We only accept messages from ourselves
	// when its postmessage itself would receive the same request msg
	// console.log("Get message", event.source.location, event)
	if (event.source != window) {
		console.log("Source not equal window")
		return;
	}

	switch (event.data.cmd) {
		case "FROM_HISTO_PAGE_REQUEST":
			chrome.runtime.sendMessage({
				type: "FROM_CONTENT_OPEN_HISTOIFY_PAGE_REQ"
			}, (response) => {
				// console.log("BG Response for GET_ALL_TABS_REQ", response);
				window.postMessage({ cmd: "FROM_CONTENT_GET_HIST_INFO", data: response }, "*")
			});
			// 
			break;
		default:
			// console.log('Website received Default');
			break;
	}
}, false);

/**********************************************************************************************************
 * 				Get message from background
 * 			- runtime onMessage listener
 *			- https://developer.mozilla.org/zh-TW/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 **********************************************************************************************************/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case "HISIFY_SHOW_UP_ITEM_LAYOUT":
			IL_Interface['showlayout'](request.data)
			break;
		case "GET_HISTODICT_DATA":
			sendResponse({ data: HistoDict });
			break;
		default:
			break;
	}

	return true;
});
/***********************************************************************************
 * 				Content function and callback function
 ***********************************************************************************/

