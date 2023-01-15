/************************
 *      Resource
 ************************/

/************************
 *      Method
 ************************/
window.addEventListener('load', (e) => {
    console.log("Load todo sample")
})
const createLayout = (doc) => {
    console.log("Histofy Layout create", doc)

}

/************************
 *  Prop and Interface 
 ************************/
const HISTO_PROP = {}
const HISTO_INTERFACE = {
    'create': createLayout
}

console.log("Process todo")