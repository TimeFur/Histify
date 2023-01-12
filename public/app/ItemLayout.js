/*********************************************
 *        ItemLayout prop and interface
 *********************************************/
var IL_CommProp = {
    "SEND_ITEM_CORRESPONSE_URL": ({ focusItem, url }) => { },
    "SEND_FOCUS_ITEM": ({ focusItemName }) => { }
}
var IL_Interface = {
    "createLayout": createSelectItemsLayout,
    "showlayout": showItemLayout,
    "updateItemList": []
}
/*********************************************
 *              Global Resource
 *********************************************/
var ClassifyWrapper = null
var FocusItem = null;

var StartTimeStamp = 0
var ElapseTime = 1800
/*********************************************
 *                  Method
 *********************************************/
function createSelectItemsLayout(itemsList, focusItemName = null) {
    ClassifyWrapper = document.createElement('div')

    //create child element
    var itemWrapper = document.createElement('div')
    itemWrapper.id = "itemWrapper"
    var timeBar = document.createElement('div')

    //create classify element
    timeBar.style.background = "#FF472E"
    timeBar.style.width = "100%";
    timeBar.style.height = "0.25rem"
    timeBar.id = "timeBar"

    ClassifyWrapper.appendChild(itemWrapper)
    ClassifyWrapper.appendChild(timeBar)

    //create item element and append to itemWrapper
    createItemElement(itemsList)

    if (focusItemName != null && itemsList.includes(focusItemName)) {
        itemWrapper.childNodes.forEach(item => {
            if (item.textContent == focusItemName)
                FocusItem = item
        })
        FocusItem.classList.add("hisify-item-focus-style")
    } else if (FocusItem == null) {
        FocusItem = itemWrapper.firstChild;
        FocusItem.classList.add("hisify-item-focus-style")
    }

    //apend to website
    document = document.querySelector("body")
    document.body.appendChild(ClassifyWrapper)

    //style
    ClassifyWrapper.className = "hisify-classify-wrapper-style"
    itemWrapper.className = "hisify-item-wrapper-style"

    window.requestAnimationFrame(step);
}
function step(timestamp) {
    if (!StartTimeStamp)
        StartTimeStamp = timestamp;
    var progress = timestamp - StartTimeStamp;
    var timebar = ClassifyWrapper.querySelector("#timeBar")
    var elapseWidth = (1 - progress / ElapseTime) * 100

    timebar.style.width = `${elapseWidth}%`
    if (progress < ElapseTime) {
        window.requestAnimationFrame(step);
    } else {
        var url = window.location.href
        var itemName = FocusItem.textContent
        IL_CommProp["SEND_ITEM_CORRESPONSE_URL"]({ itemName, url })

        ClassifyWrapper.style.visibility = "hidden";
    }
}
function createItemElement(itemsList = []) {
    var itemWrapper = ClassifyWrapper.querySelector('#itemWrapper')
    itemsList.forEach(itemName => {
        var item = document.createElement('div')
        item.className = "hisify-item-style"
        item.textContent = itemName
        itemWrapper.appendChild(item)

        //add listener
        item.addEventListener('click', (e) => {
            if (FocusItem != null)
                FocusItem.classList.remove("hisify-item-focus-style")
            FocusItem = item;
            FocusItem.classList.add("hisify-item-focus-style")
            IL_CommProp["SEND_FOCUS_ITEM"]({ focusItemName: item.textContent })
            //clear time
            StartTimeStamp = 0;
        })
    })
}
function showItemLayout(itemsList) {
    //update itemList add or remove
    var itemWrapper = ClassifyWrapper.querySelector('#itemWrapper')
    var itemList = itemsList

    itemWrapper.childNodes.forEach(item => {
        if (itemList.includes(item.textContent) == false) {
            item.remove()
        } else {
            itemList = itemList.filter((i) => i != item.textContent)
        }
    })
    createItemElement(itemList)

    ClassifyWrapper.style.visibility = "visible";
    StartTimeStamp = 0;
    window.requestAnimationFrame(step);
}