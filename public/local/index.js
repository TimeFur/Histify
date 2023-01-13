const EXTENSION_PATH = "chrome-extension://*"
var StorageInfo = []
window.addEventListener("load", (e) => {
    console.log("Histo create")

    //Register button event
    var HistInfobtn = document.querySelector("#getHistInfoBtn")
    HistInfobtn.addEventListener('click', (e) => {
        console.log(StorageInfo)
    })

    //Get all tabs HistifyInfo 
    if (chrome.storage) {
        chrome.storage.sync.get("HistifyInfo", function (storage) {
            StorageInfo = storage
        });
    } else {
        window.postMessage({ cmd: "FROM_HISTO_PAGE_REQUEST" }, "*")
    }
})

window.addEventListener('message', (event) => {
    console.log(event.data)
    switch (event.data.cmd) {
        case "FROM_CONTENT_GET_HIST_INFO":
            StorageInfo = event.data.data
            break;
        default:
            // console.log('Website received Default');
            break;
    }
})