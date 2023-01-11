/*********************************************
 *        ItemLayout prop and interface
 *********************************************/
var IL_CommProp = {
    "SEND_ITEM_CORRESPONSE_URL": ({ focusItem, url }) => { }
}
var IL_Interface = {
    "createLayout": createSelectItemsLayout
}

/*********************************************
 *                  Method
 *********************************************/
function createSelectItemsLayout(itemsList) {
    var classifyWrapper = document.createElement('div')
    var itemWrapper = document.createElement('div')
    var timeBar = document.createElement('div')
    var focusItem = null;

    itemsList.forEach(itemName => {
        var item = document.createElement('div')
        item.className = "hisify-item-style"
        item.textContent = itemName
        itemWrapper.appendChild(item)

        if (focusItem == null) {
            focusItem = item;
            focusItem.classList.add("hisify-item-focus-style")
        }

        //add listener
        item.addEventListener('click', (e) => {
            if (focusItem != null)
                focusItem.classList.remove("hisify-item-focus-style")
            focusItem = item;
            focusItem.classList.add("hisify-item-focus-style")
        })
    })
    //create classify element
    timeBar.textContent = "Time Bar"

    classifyWrapper.appendChild(itemWrapper)
    classifyWrapper.appendChild(timeBar)

    //apend to website
    document = document.querySelector("body")
    document.body.appendChild(classifyWrapper)

    //style
    classifyWrapper.className = "hisify-classify-wrapper-style"
    itemWrapper.className = "hisify-item-wrapper-style"

    //timeout setting
    setTimeout(() => {
        var url = window.location.href
        var itemName = focusItem.textContent
        classifyWrapper.style.visibility = "hidden";
        //sendback to background [through content api]

        IL_CommProp["SEND_ITEM_CORRESPONSE_URL"]({ itemName, url })
    }, 3000);
}