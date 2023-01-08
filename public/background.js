//https://stackoverflow.com/questions/18794407/chrome-extension-api-chrome-tabs-capturevisibletab-on-background-page-to-conten
var ActiveTabList = [];
var ImageBuffer = [];
const IMG_SEARCH_URL = "https://oolet-shoot.web.app/search"
// console.log = function () { }
const InjectJSPathList = [
	// "./public/content.js",

]

/**
 * Motivation
 * @param {type} var - purpose
 * @return {type} var - purpose
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case "FROM_CONTENT_SCREENSHOT":
			var image_url = "None";
			chrome.tabs.captureVisibleTab(
				null,
				{},
				function (dataUrl) {
					image_url = dataUrl;
					sendResponse({ imgSrc: dataUrl });
				}
			);
			break;

		case "SEND_CREATEBOX_REQ":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				const tabId = tabs[0].id
				chrome.tabs.sendMessage(tabId, { type: "SEND_CREATEBOX_TO_CONTENT_REQ", active: request.active }, function (response) {
					if (response) {
						sendResponse({ farewell: "ok" })
					} else {
						injectAllContent(tabId)
						sendResponse("Inject")
					}
				});
			});
			break;
		case "SEND_TUNEBOXWIDTH_REQ":

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { type: "SEND_TUNEBOXWIDTH_TO_CONTENT_REQ", value: request.value }, function (response) {
					sendResponse({ farewell: "ok" })
				});
			});
			break;
		case "FROM_CONTENT_GET_TAB_ID":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				ActiveTabList.push(tabs[0].id);
				sendResponse({ tabId: tabs[0].id, activeTabList: ActiveTabList, farewell: "ok" })
			});

			break;
		case "CLOSE_TAB_EVT":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				ActiveTabList = ActiveTabList.filter(id => id != tabs[0].id)
			});
			break;
		case "SEND_LIST_ALL":
			ListingContents({ response: sendResponse })
			break;
		case "GET_CONTENT_SHOOT_FROM_POP":
		case "GET_CONTENT_SHOOT_FROM_CONTENT":
			//	{tabId, getItem}
			chrome.tabs.sendMessage(request.tabId, { type: "GET_CONTENT_SHOOT_FROM_BG", getItem: request.getItem }, (response) => {
				sendResponse(response)
			});
			break;
		case "SET_CONTENT_SHOOT_FROM_POP":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { type: "SET_CONTENT_SHOOT_FROM_BG", res: { ...request.res } }, function (response) {
					sendResponse({ farewell: "ok" })
				});
			});
			break;
		case "IMG_SEARCH_REQ":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				// console.log("IMG_SEARCH_REQ", request)
				ImageBuffer.push({ ...request })
				chrome.tabs.create({
					url: IMG_SEARCH_URL
				}, function (tab) {
					// chrome.tabs.sendMessage(tab.id, { type: "SUBMIT_IMG_SEARCH", greeting: "hello", imgSrc: request.imgSrc }, function () { });
				})

				sendResponse({ farewell: "ok" })
			});
			break;
		case "FROM_CONTENT_IMG_BUFFER_SEQ":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				var SearchBuffer = {};
				if (ImageBuffer.length > 0) {
					SearchBuffer = ImageBuffer[0]
					ImageBuffer.pop();
				}
				sendResponse({ tab: tabs[0], ...SearchBuffer })
			});

			break;
		default:
			alert("BG default");
			console.log("chrome listener default");
			sendResponse('default!!!');
			break;
	}
	//allow sendResponse async, let captureVisibleTab sendReponse
	return true;
});

/*************************************************************************
 * 		Get all other tabs information
 **************************************************************************/
function ListingContents({ avoidTab = [], response = null }) {
	sendMsgWorkingList = []

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const blockTabsId = tabs[0].id
		chrome.tabs.query({}, async (tabs) => {
			tabs.forEach(async (tab, i) => {
				const id = tab.id
				if (id != blockTabsId)
					sendMsgWorkingList.push(sendMsgWrapper(id, tab.title, { type: "GET_ALL_SHOOT_CONTENTS" }))
			})
			console.log(sendMsgWorkingList)

			Promise.all(sendMsgWorkingList).then(res => {
				console.log("Get", res)
				if (res)
					response(res)
				else
					response([])
			})
		});
	})
}

function sendMsgWrapper(tabId, title, item) {
	return new Promise((resolve, reject) => {
		chrome.tabs.sendMessage(tabId, item, (res) => {
			if (res)
				resolve({ id: tabId, title: title, res: res })
			else
				resolve({})
		})
	})
}

function injectAllContent(tabId) {
	for (path of InjectJSPathList) {
		injectContentScript({ tabId: tabId, filename: path, cb: (res) => { console.log(res) } })
	}
}
/*************************************************************************
 * 		Reinject content script
 * ref: https://www.bennettnotes.com/post/fix-receiving-end-does-not-exist/
 **************************************************************************/
function injectContentScript({ tabId, filename, cb = null }) {
	if (filename == undefined || tabId == undefined)
		return
	console.log(filename)
	//inject content scripts & send tab message
	chrome.scripting.executeScript(tabId, { file: filename }, function (res) {
		if (cb)
			cb(res)
	});
}