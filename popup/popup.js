// CONST SETTING

// GLOBAL RESOURCE

// popup.html load listener
window.addEventListener('load', function () {
	histoBtn = document.querySelector("#histBtn")
	donationBtn = document.querySelector("#donationBtn")
	itemPanel = document.querySelector("#itemPanelWrapper")
	formSubmitBtn = document.querySelector('.submitStyle')
	formItem = document.querySelector('#newItem')


	console.log(location)
	histoBtn.addEventListener('click', (e) => {
		toggleHistofyPage();
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

		initSendMessage({ storageList })
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

function initSendMessage({ storageList }) {
	//toggle show up item content layout
	chrome.runtime.sendMessage({ type: "FROM_POP_SHOW_UP_ITEM_LAYOUT", data: storageList }, (response) => { });
}

// Handler to background
function toggleHistofyPage() {
	chrome.runtime.sendMessage({
		type: "FROM_POP_OPEN_HISTOIFY_PAGE_REQ"
	}, (response) => {
		console.log("BG Response for GET_ALL_TABS_REQ", response);
	});
}

function immediateShot({ }) {
	chrome.runtime.sendMessage({
		type: "FROM_CONTENT_SCREENSHOT"
	}, (res) => {
		const imgSrc = res.imgSrc
		//immedaite search
		chrome.runtime.sendMessage({ type: "IMG_SEARCH_REQ", imgSrc: imgSrc }, (res) => { })
	})
}

// document.addEventListener("DOMContentLoaded", () => { })