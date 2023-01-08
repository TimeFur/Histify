
function createSvgElement(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
}

function cameraSvgWrapper(clickEvent = undefined) {
    var svgWrapperEle = createSvgElement("svg", { width: "50%", height: "100%", fill: 'none', class: "h-6 w-6", viewBox: "0 0 24 24", stroke: "currentColor" });
    svgWrapperEle.append(createSvgElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1", d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }))
    svgWrapperEle.append(createSvgElement("path", { strokeLinecap: "round", strokeLinejoin: "round", fill: "rgba(25,113,131,0.6)", strokeWidth: "2", d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" }))

    if (clickEvent)
        svgWrapperEle.addEventListener('click', clickEvent)
    return svgWrapperEle
}

function linkSvgWrapper(clickEvent = undefined) {
    var svgWrapperEle = createSvgElement("svg", { width: "50%", height: "100%", fill: 'none', class: "h-5 w-5", viewBox: "0 0 24 24", stroke: "currentColor" });
    svgWrapperEle.append(createSvgElement("path", { fillRule: "evenodd", d: "M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z", clipRule: "evenodd" }))
    if (clickEvent)
        svgWrapperEle.addEventListener('click', clickEvent)
    return svgWrapperEle
}
