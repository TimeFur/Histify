const LOCAL_HISITOFY_PATH = "./public/local/Histo.html"
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
		case "FROM_POP_OPEN_HISTOIFY_PAGE_REQ":
			chrome.tabs.query({}, function (tabs) {
				var length = tabs.length
				for (var i = 0; i < length; i += 1) {
					let title = tabs[i].title
					let createLocalPageFlag = (i == length - 1)
					chrome.tabs.sendMessage(tabs[i].id, { type: "GET_HISTODICT_DATA" }, function (response) {
						console.log(title, response)
						if (createLocalPageFlag) {
							chrome.tabs.create({ url: LOCAL_HISITOFY_PATH });
							sendResponse({ tabsList: tabsList })
						}
					})
				}
			})
			break;
		case "FROM_POP_SHOW_UP_ITEM_LAYOUT":
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id,
					{ type: "HISIFY_SHOW_UP_ITEM_LAYOUT", data: request.data },
					function (response) {
						if (response)
							sendResponse({ farewell: "ok" })
					});
			})
			break;
		case "FROM_CONTENT_ITEM_CORRESPONSE_URL":
			console.log(request.data)
			sendResponse({ farewell: "ok" })
			break;
		case "FROM_CONTENT_ITEM_UNLOAD":
			console.log("unload", request.data)
			sendResponse({ farewell: "ok" })
			break;
		case "FROM_CONTENT_ASK_ITEM_LIST":
			//get all storage items
			chrome.storage.sync.get(null, function (storage) {
				var itemStorageList = []
				var focusItemName = null
				if (storage.items != undefined)
					itemStorageList = storage.items
				if (storage.focusItemName != undefined)
					focusItemName = storage.focusItemName
				sendResponse({ items: itemStorageList, focusItemName: focusItemName });
			});
			break;
		case "FROM_CONTENT_SET_FOCUS_ITEM":
			chrome.storage.sync.set({ "focusItemName": request.data }, function () { });
			sendResponse({ farewell: "ok" })
			break;
		case "FROM_CONTENT_SCREENSHOT":
			captureScreenShot()
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

//https://stackoverflow.com/questions/18794407/chrome-extension-api-chrome-tabs-capturevisibletab-on-background-page-to-conten
function captureScreenShot(request, sendResponse) {
	var image_url = "None";
	chrome.tabs.captureVisibleTab(null, {},
		function (dataUrl) {
			image_url = dataUrl;
			sendResponse({ imgSrc: dataUrl });
		}
	);
}
/*************************************************************************
 * 		Reinject content script
 * ref: https://www.bennettnotes.com/post/fix-receiving-end-does-not-exist/
 **************************************************************************/
function injectAllContent(tabId) {
	for (path of InjectJSPathList) {
		injectContentScript({ tabId: tabId, filename: path, cb: (res) => { console.log(res) } })
	}
}
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