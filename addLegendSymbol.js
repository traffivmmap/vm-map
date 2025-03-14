function addLegendSymbol(targetElementID, { text, symbolType, lineColor = "#888888", lineThickness = 3, circleSize = 8, fill = "#888888", stroke = "black", strokeThickness = 1 ,imgSrc, imageSize = 16}) {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.gap = "8px";
    legendItem.classList.add("legend-symbology")

    const symbol = document.createElement("div");
    
    if (symbolType === "circle") {
        symbol.style.width = circleSize+"px";
        symbol.style.height = circleSize+"px";
        symbol.style.borderRadius = "50%";
        symbol.style.backgroundColor = fill;
        symbol.style.border = `${strokeThickness}px solid ${stroke}`;
    } else if (symbolType === "line") {
        symbol.style.width = "20px";
        symbol.style.height = lineThickness + "px";
        symbol.style.backgroundColor = lineColor;
    } else if (symbolType === "image") {
        symbol.innerHTML = `<img src="${imgSrc}" alt="Legend symbol" width="${imageSize}" height="${imageSize}">`;
    } else {
        throw new Error("Invalid symbol type. Use 'circle', 'line', or 'image'.");
    }

    const labelText = document.createElement("span");
    labelText.textContent = text;

    legendItem.appendChild(symbol);
    legendItem.appendChild(labelText);
    
    
    
    let entry = $(targetElementID).parent().after(legendItem);


}