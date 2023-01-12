const EXTENSION_PATH = "chrome-extension://*"

window.addEventListener("load", (e) => {
    console.log("Histo create")

    var HistInfobtn = document.querySelector("#getHistInfoBtn")
    HistInfobtn.addEventListener('click', (e) => {
        console.log("Get histo")
        window.postMessage({ cmd: "FROM_HISTO_PAGE_REQUEST" }, "*")
    })
    // window.postMessage({ data: "from histo page" }, EXTENSION_PATH)
    // window.postMessage({ cmd: "FROM_HISTO_PAGE_REQUEST" }, "*")
})

window.addEventListener('message', (event) => {
    console.log(event.data)
    switch (event.data.cmd) {
        case "FROM_CONTENT_GET_HIST_INFO":
            console.log("FROM_CONTENT_GET_HIST_INFO", event.data.data)
            break;
        default:
            // console.log('Website received Default');
            break;
    }
})