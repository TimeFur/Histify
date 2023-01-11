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
	//mount prop
	IL_CommProp["SEND_ITEM_CORRESPONSE_URL"] = ({ itemName, url }) => {
		if (CurrentUrl in HistoDict)
			HistoDict[CurrentUrl].itemList.push({ 'item': itemName, 'time': new Date(Date.now()) });
	}

	//ask item list
	chrome.runtime.sendMessage(
		{ type: "FROM_CONTENT_ASK_ITEM_LIST" },
		function (response) {
			IL_Interface['createLayout'](response.items)
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
/***********************************************************************************
 * 				Get message from website
 * 		- runtime onMessage listener
 *		- https://pjchender.github.io/2019/05/21/chrome-content-script/
 ***********************************************************************************/
window.addEventListener('message', function (event) {

	// We only accept messages from ourselves
	// when its postmessage itself would receive the same request msg
	var data = {
		type: "FROM_EXTENSION",
		imgSrc: "Data from content js",
		imgList: [],
	};

	if (event.source != window) {
		console.log("Source not equal window")
		return;
	}

	switch (event.data.type) {
		case "SCREENSHOT_FROM_OOLETSITE_REQ":
			//call screen shot api [to background.js]
			chrome.runtime.sendMessage(
				{ type: "FROM_CONTENT_SCREENSHOT" },
				function (response) {
					data.imgSrc = response.imgSrc;
					window.postMessage(data, event.origin);
				});

			break;
		case "FROM_OOLETSITE_REQ":
			chrome.runtime.sendMessage({
				type: "SEND_LIST_ALL"
			}, (res) => {
				data.imgList = res
				event.source.postMessage(data, event.origin);
			})
			break;
		case "GET_CONTENT_SHOOT_FROM_SITE":
			chrome.runtime.sendMessage({
				type: "GET_CONTENT_SHOOT_FROM_CONTENT",
				tabId: event.data.tabId,
				getItem: event.data.getItem
			}, (res) => {
				data.type = "IMGSRC_FROM_EXTENSION"
				data.imgSrc = res
				data.id = event.data.tabId
				event.source.postMessage(data, event.origin);
			})
			break;
		case "GET_SEARCH_IMG_SRC_REQ":
			chrome.runtime.sendMessage({
				type: "FROM_CONTENT_IMG_BUFFER_SEQ",
				tabId: event.data.tabId,
				getItem: event.data.getItem
			}, (res) => {
				data.type = "SEARCH_IMG_SRC_FROM_EXTENSION"
				data.imgSrc = res.imgSrc
				data.id = event.data.tabId
				data.eventOriginal = event.origin
				event.source.postMessage(data, event.origin);
			});
			break;
		case "SEARCH_IMG_SRC_REQ":
			if (event.data.imgSrc != '')
				formImgSearch(event.data.imgSrc, (form) => contentDocElement = document.querySelector('body').append(form))
			break;
		default:
			console.log('Website received Default');
			break;
	}
},
	false
);

/**********************************************************************************************************
 * 				Get message from background
 * 			- runtime onMessage listener
 *			- https://developer.mozilla.org/zh-TW/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 **********************************************************************************************************/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var data = {
		type: "FROM_EXTENSION_VIDEOURL",
		videoUrl: "NONE",
	};

	switch (request.type) {
		case "HISIFY_SHOW_UP_ITEM_LAYOUT":
			IL_Interface['showlayout']()
			break;
		case "SEND_CREATEBOX_TO_CONTENT_REQ":
			BoxObject.toggleVisible({ active: request.active })
			sendResponse("CONTENT RESPONSE TO BG: toggle boix");
			break;
		case "SEND_TUNEBOXWIDTH_TO_CONTENT_REQ":
			BoxObject.tunningWidth({ value: request.value }, (settingWidth) => {
				PreviewObject.tuunningPreviewWidth({ right: settingWidth + 3 })
				// HoverBoxObject.tuunningPreviewWidth({ right: settingWidth + 3 })
			})
			sendResponse("CONTENT RESPONSE TO BG: tuning boix width");
			break;
		case "GET_ALL_SHOOT_CONTENTS":
			// console.log(ShootList, HoverBoxList)
			const responseList = readContentList()
			sendResponse(responseList);
			break;
		case "GET_CONTENT_SHOOT_FROM_BG":
			const resContent = getContent(request.getItem)
			sendResponse(resContent)
			break;
		case "SET_CONTENT_SHOOT_FROM_BG":
			PreviewObject.updatePreview({ scrollYPos: 0, imgSrc: request.res.imgSrc },
				(ele) => {
					contentDocElement = document.querySelector('body');
					contentDocElement.append(ele)
				},
				(preEle) => {
					HoverBoxObject.FixHoverBox(PreviewObject.hoverElementObject, { info: request.res.info }, (ele, response = null) => {
						var contentDocElement = document.querySelector('body');
						contentDocElement.append(ele)
						if (response)
							response(ele)
						//set previewBox as invisible
						PreviewObject.invisiblePreview()
					})
				})
			break;
		default:
			break;
	}

	return true;
});
/***********************************************************************************
 * 				Content function and callback function
 ***********************************************************************************/

