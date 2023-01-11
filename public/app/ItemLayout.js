/*********************************************
 *        ItemLayout prop and interface
 *********************************************/
var IL_CommProp = {
    "SEND_ITEM_CORRESPONSE_URL": ({ focusItem, url }) => { }
}
var IL_Interface = {
    "createLayout": createSelectItemsLayout,
    "showlayout": showItemLayout
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
function createSelectItemsLayout(itemsList) {
    ClassifyWrapper = document.createElement('div')

    //create child element
    var itemWrapper = document.createElement('div')
    var timeBar = document.createElement('div')

    itemsList.forEach(itemName => {
        var item = document.createElement('div')
        item.className = "hisify-item-style"
        item.textContent = itemName
        itemWrapper.appendChild(item)

        if (FocusItem == null) {
            FocusItem = item;
            FocusItem.classList.add("hisify-item-focus-style")
        }

        //add listener
        item.addEventListener('click', (e) => {
            if (FocusItem != null)
                FocusItem.classList.remove("hisify-item-focus-style")
            FocusItem = item;
            FocusItem.classList.add("hisify-item-focus-style")

            //clear time
            StartTimeStamp = 0;
        })
    })
    //create classify element
    timeBar.style.background = "#FF472E"
    timeBar.style.width = "100%";
    timeBar.style.height = "0.25rem"
    timeBar.id = "timeBar"

    ClassifyWrapper.appendChild(itemWrapper)
    ClassifyWrapper.appendChild(timeBar)

    console.log(ClassifyWrapper.querySelector("#timeBar"))
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

function showItemLayout() {
    ClassifyWrapper.style.visibility = "visible";
    StartTimeStamp = 0;
    window.requestAnimationFrame(step);
}