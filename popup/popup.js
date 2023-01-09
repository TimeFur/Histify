// CONST SETTING

// GLOBAL RESOURCE
var btnBoxEle = null;
const OOLET_URL = "https://oolet-shoot.web.app"
const OOLET_COLLECT_URL = "https://oolet-shoot.web.app/collect"

// popup.html load listener
window.addEventListener('load', function () {
	histoBtn = document.querySelector("#histBtn")
	donationBtn = document.querySelector("#donationBtn")
	itemPanel = document.querySelector("#itemPanelWrapper")
	formSubmitBtn = document.querySelector('.submitStyle')
	formItem = document.querySelector('#newItem')

	histoBtn.addEventListener('click', (e) => {
		toggleGetAllTabs();
	})
	donationBtn.addEventListener('click', (e) => {
		toggleListingShoot({});
	})

	// register item from storage
	StorageGetAllItems().then((storageList) => {
		console.log(storageList)
		storageList.forEach(itemValue => {
			itemPanel.append(createItem(itemValue))
		})
	})

	formSubmitBtn.addEventListener('click', (e) => {
		const itemValue = formItem.value
		// Add items
		if (itemValue != "") {
			storageNewItem(itemValue)
			itemPanel.append(createItem(itemValue))
		}
	})

	// chrome.storage.sync.clear(function () {
	// 	defaultItemList = ['READING', 'WRITE NOTE', 'NONE']
	// 	//create default item
	// 	defaultItemList.forEach(itemValue => {
	// 		storageNewItem(itemValue)
	// 		itemPanel.append(createItem(itemValue))
	// 	})
	// });

})
function createItem(itemName) {
	var item = document.createElement('div')
	item.className = "item-style"
	item.textContent = itemName

	var delIcon = document.createElement('div')
	delIcon.className = "del-style"
	delIcon.textContent = 'X'

	item.addEventListener('mouseenter', (e) => {
		delIcon.style.visibility = "visible"
	})
	item.addEventListener('mouseleave', (e) => {
		delIcon.style.visibility = "hidden"
	})
	delIcon.addEventListener('click', (e) => {
		chrome.storage.sync.get("items", function (storage) {
			var itemStorageList = []
			if (storage.items != undefined)
				itemStorageList = storage.items
			itemStorageList = itemStorageList.filter(item => item != itemName)
			chrome.storage.sync.set({ "items": itemStorageList }, function () { });
		});

		item.remove()
	})
	item.append(delIcon)
	return item
}

function StorageGetAllItems(resolve, reject) {
	return new Promise((resolve, reject) => {
		var itemStorageList = []

		chrome.storage.sync.get("items", function (storage) {
			if (storage.items != undefined)
				itemStorageList = storage.items
			resolve(itemStorageList)
		});
	})
}

function storageNewItem(itemValue) {
	var itemStorageList = []
	chrome.storage.sync.get("items", function (storage) {
		if (storage.items != undefined)
			itemStorageList = storage.items

		itemStorageList.push(itemValue)
		chrome.storage.sync.set({ "items": itemStorageList }, function () { });
	});
}
// document.addEventListener("DOMContentLoaded", () => {
// 	toggleCreateBox({ active: 1 });
// })

// Handler to background
function toggleGetAllTabs() {
	chrome.runtime.sendMessage({
		type: "GET_ALL_TABS_REQ"
	}, (response) => {
		console.log("BG Response for GET_ALL_TABS_REQ", response);
	});
}

function immediateShot({ }) {
	chrome.runtime.sendMessage({
		type: "FROM_CONTENT_SCREENSHOT"
	}, (res) => {
		const imgSrc = res.imgSrc
		console.log(imgSrc)

		//immedaite pop on the site
		// chrome.runtime.sendMessage({
		// 	type: "SET_CONTENT_SHOOT_FROM_POP",
		// 	res: { ...res }
		// }, (response) => { });

		//immedaite search
		chrome.runtime.sendMessage({ type: "IMG_SEARCH_REQ", imgSrc: imgSrc }, (res) => {
			console.log("Bg get!!!")
		})
	})
}

function toggleListingShoot({ }) {
	chrome.runtime.sendMessage({
		type: "SEND_LIST_ALL"
	}, (res) => {
		// console.log("Response data:", res)
		//popout list html
		const listWrapper = document.getElementById("listWrapper")
		if (listWrapper.children.length == 0) {
			res.forEach(item => {
				if (item.res != undefined && item.res.length != 0) {
					const ele = addContentList(item)
					listWrapper.append(ele)
				}
			})
		}
	})
}

function tunningBoxWidth({ value = 6 }) {
	chrome.runtime.sendMessage({
		type: "SEND_TUNEBOXWIDTH_REQ",
		value: value
	}, (response) => {
		console.log("BG Reponse for tunning box width");
	});
}

// add to popup list 
function addContentList(item) {
	//{id, title, res:[]}
	var listWrapper = document.createElement("li")
	var listItemWrapper = document.createElement("ul")
	listWrapper.className = "tab-content-style"
	listItemWrapper.className = "tab-content-wrapper"

	// send get data content
	function sendGetContentItem(data, cb = null) {
		const tabId = item.id
		const getItem = data
		chrome.runtime.sendMessage({
			type: "GET_CONTENT_SHOOT_FROM_POP",
			tabId: tabId,
			getItem: getItem
		}, (response) => {
			if (cb)
				cb(response);
		});
	}

	//setting content
	listWrapper.textContent = item.title//item.id
	if (item.res) {
		item.res.forEach(data => {
			var itemEle = document.createElement("li")
			itemEle.textContent = data
			// add content into current website
			itemEle.addEventListener("click", (e) => {
				sendGetContentItem(data, (res) => {
					chrome.runtime.sendMessage({
						type: "SET_CONTENT_SHOOT_FROM_POP",
						res: { ...res }
					}, (response) => { });
				})
			})
			// hover content to show up
			itemEle.addEventListener("mouseenter", (e) => {
				sendGetContentItem(data, (res) => {
					// {imgSrc}
					var hoverImgWrapper = document.getElementById("popThumbNailShoot")
					hoverImgWrapper.setAttribute("src", res.imgSrc)
				})
			})
			listItemWrapper.append(itemEle)

		})
	}

	listWrapper.append(listItemWrapper)

	return listWrapper;
}