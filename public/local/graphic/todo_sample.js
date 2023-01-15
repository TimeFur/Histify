/************************
 *      Resource
 ************************/
const QUOTE_REQUEST_URL = "https://type.fit/api/quotes"
/************************
 *      Method
 ************************/
const createLayout = (doc) => {
    console.log("Histofy Layout create", doc)
    topSection()
}

const topSection = () => {
    const date = new Date()

    var todoDate = document.querySelector("#todoDate")
    todoDate.textContent = date.toString()

    fetch(QUOTE_REQUEST_URL)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            var quoteId = document.querySelector("#quoteId")
            var index = Math.floor(Math.random() * data.length)
            quoteId.textContent = data[index].text
        });
}
/************************
 *  Prop and Interface 
 ************************/
const HISTO_PROP = {}
const HISTO_INTERFACE = {
    'create': createLayout
}

console.log("Process todo")