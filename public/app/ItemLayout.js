function CreateSelectItemsLayout(itemsList) {
    var classifyWrapper = document.createElement('div')
    var itemWrapper = document.createElement('div')
    var timeBar = document.createElement('div')
    itemsList.forEach(itemName => {
        var item = document.createElement('div')
        item.className = "hisify-item-style"
        item.textContent = itemName
        itemWrapper.appendChild(item)
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
        classifyWrapper.style.visibility = "hidden";
    }, 3000);
}

//Getting url and item
function GetCurrentInfo() {

}