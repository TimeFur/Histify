//loading icon
const iconLoading = () => {
    var wrapper = document.createElement("div")
    var contentAnimate = document.createElement("div")
    var content = document.createElement("div")

    wrapper.className = "loadingio-spinner-rolling"
    contentAnimate.className = "ldio"

    contentAnimate.append(content)
    wrapper.append(contentAnimate)

    return wrapper;
}