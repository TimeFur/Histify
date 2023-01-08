const IMG_SEARCH_POST_URL = "https://www.google.com/searchbyimage/upload"

const formImgSearch = (imgSrc = "", appendCallback = null) => {
    if (appendCallback == null || imgSrc == '')
        return

    var form = document.createElement("form")
    var fileEle = document.createElement("input")

    form.setAttribute("action", IMG_SEARCH_POST_URL)
    form.setAttribute("METHOD", "POST")
    form.setAttribute("enctype", "multipart/form-data")
    form.hidden = true;
    // form.setAttribute("target", "_blank")

    fileEle.setAttribute("type", "file");
    fileEle.setAttribute("name", "encoded_image");

    form.append(fileEle)

    //append to document
    appendCallback(form)

    dataURLtoFile(imgSrc, 'search.png', (file) => {
        // pointer to dataTransferItem list
        fileEle.files = file
    });
    form.submit();
    form.remove();
}

const gImageSearchElement = (getRawData = null) => {
    var wrapper = document.createElement("div")
    var form = document.createElement("form")
    var fileEle = document.createElement("input")

    form.setAttribute("action", IMG_SEARCH_POST_URL)
    form.setAttribute("METHOD", "POST")
    form.setAttribute("enctype", "multipart/form-data")
    form.setAttribute("target", "_blank")

    fileEle.setAttribute("type", "file");
    fileEle.setAttribute("name", "encoded_image");

    form.append(fileEle)

    // 
    var SearchBtn = document.createElement("button")
    SearchBtn.style.cursor = "pointer";
    SearchBtn.innerText = "S"
    wrapper.append(form)
    wrapper.append(SearchBtn)

    form.hidden = true;
    SearchBtn.addEventListener("click", (e) => {
        if (getRawData) {
            getRawData().then((imgSrc) => {
                rawData = imgSrc
                dataURLtoFile(imgSrc, 'search.png', (file) => {
                    // pointer to dataTransferItem list
                    fileEle.files = file
                });
                form.submit();
            })
        }
    })

    return wrapper
}


// base64 to byte
function dataURLtoFile(dataurl, filename, cb = null) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    var finalFile = new File([u8arr], filename, { type: mime })
    //data transfer
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(finalFile)
    if (cb)
        cb(dataTransfer.files)

    return finalFile;
}