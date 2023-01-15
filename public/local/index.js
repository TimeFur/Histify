const EXTENSION_PATH = "chrome-extension://*"
var StorageInfo = []

window.addEventListener("load", (e) => {
    console.log("Histo create")
    // const myChart = new Chart(ctx);
    // console.log(new Chart)
    //create layout UI
    loadPage("./graphic/todo_sample.html", "#graphId")

    createChartSample()
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


/*********************************************
 * Load html by XHR process
 * path = "./graph-page.html"
 * target = document.querySelect('#targetId')
 *********************************************/
function loadPage(path, targetId) {
    var target = document.querySelector(targetId)
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', path, false);
    xmlhttp.send();

    target.innerHTML = xmlhttp.responseText
    return xmlhttp.responseText;
}

function createChartSample() {
    var xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    var yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: "rgba(0,0,0,1.0)",
                borderColor: "rgba(0,0,0,0.1)",
                data: yValues
            }]
        },
        options: {}
    });
}