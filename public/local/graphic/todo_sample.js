/************************
 *      Resource
 ************************/
const QUOTE_REQUEST_URL = "https://type.fit/api/quotes"
const ITEMLIST_TEST = [{ text: "DOC" }, { text: "WRITE ESSAY" }, { text: "YT EDIT" }]
/************************
 *      Method
 ************************/
const createLayout = (doc) => {
    console.log("Histofy Layout create", doc)

    topSection()
    leftSection()
    var item = createItem({ text: "Item" })
    console.log(item)
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

const leftSection = () => {
    //todo resource
    const itemList = ITEMLIST_TEST

    //sub-section1 - get item list 
    var todoItemwrapper = document.querySelector('.todo-list-wrapper-style')
    itemList.forEach(itemInfo => {
        var itemEle = createItem(itemInfo)
        todoItemwrapper.append(itemEle)
    })

    //sub-section2 - pie chart
    createPieChart({})

}
const createItem = ({ text = "", percent = "10%" }) => {
    var itemEle = document.createElement('div')
    var itemIcon = document.createElement('img')
    var textEle = document.createElement('div')
    var arrowIcon = document.createElement('img')

    itemEle.className = "item-percent-style"

    itemIcon.src = "./asset/rec.png"

    textEle.textContent = text

    arrowIcon.src = "./asset/right-arrow.png"
    arrowIcon.id = "arrowIcon"

    itemEle.append(itemIcon)
    itemEle.append(textEle)
    itemEle.append(arrowIcon)

    return itemEle;
}

const createPieChart = ({ itemName = "item", itemData = [300, 50, 100] }) => {
    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: itemName,
            data: itemData,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };
    //action
    new Chart("pieChart", {
        type: "pie",
        data: data,
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            },
            maintainAspectRatio: false,
        }
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