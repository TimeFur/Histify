// convert to canvas for cropping and then return back base64
const cropImage = (src, { ImgWrapperEle, contentContainer }) => {

    return new Promise((resolve, reject) => {
        const x1 = ImgWrapperEle.getBoundingClientRect().x
        const y1 = ImgWrapperEle.getBoundingClientRect().y
        const w1 = ImgWrapperEle.getBoundingClientRect().width
        const h1 = ImgWrapperEle.getBoundingClientRect().height
        const x2 = contentContainer.getBoundingClientRect().x
        const y2 = contentContainer.getBoundingClientRect().y
        const w2 = contentContainer.getBoundingClientRect().width
        const h2 = contentContainer.getBoundingClientRect().height

        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var imgObject = new Image()
        imgObject.src = src
        canvas.width = imgObject.width
        canvas.height = imgObject.height

        const { cropTop, cropLeft, cropWidth, cropHeight } = cropEstimate({ x1, y1, w1, h1, x2, y2, w2, h2, width: imgObject.width, height: imgObject.height })

        imgObject.onload = () => {
            var targetWidth = imgObject.width
            var targetHeight = imgObject.height

            if (cropWidth / cropHeight <= imgObject.width / imgObject.height) {
                //change width
                targetWidth = cropWidth * targetHeight / cropHeight;
            } else {
                //change height
                targetHeight = cropHeight * targetWidth / cropWidth;
            }
            canvas.width = targetWidth
            canvas.height = targetHeight
            context.drawImage(imgObject, cropLeft, cropTop, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight)
            resolve(canvas.toDataURL())
        }
    })
}

const cropEstimate = ({ x1, y1, w1, h1, x2, y2, w2, h2, width, height }) => {
    var x = 0;
    if (x1 < x2)
        x = x2 - x1;
    else if (x1 >= x2 + w2)
        x = -1;
    var y = 0;
    if (y1 < y2)
        y = y2 - y1;
    else if (y1 >= y2 + h2)
        y = -1;

    //
    var l = (x2 > x1) ? x2 : x1
    var t = (y2 > y1) ? y2 : y1
    var r = l;
    var b = t;

    if (x1 + w1 > x2) {
        if (x1 + w1 < x2 + w2) {
            r = x1 + w1
        } else {
            r = x2 + w2
        }
    }
    if (y1 + h1 > y2) {
        if (y1 + h1 < y2 + h2) {
            b = y1 + h1
        } else {
            b = y2 + h2
        }
    }

    var w = r - l
    var h = b - t

    if (x == - 1 || y == -1)
        return { cropTop: 0, cropLeft: 0, cropWidth: 0, cropHeight: 0 }

    return {
        cropTop: y * height / h1, cropLeft: x * width / w1,
        cropWidth: w * width / w1, cropHeight: h * height / h1
    }
}
