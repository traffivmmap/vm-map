export function addLegendSymbol(
    targetElementID,
    {
        text,
        symbolType,
        lineColor = "#888888",
        lineThickness = 3,
        circleSize = 8,
        fill = "#888888",
        stroke = "black",
        strokeThickness = 1,
        imgSrc,
        imageSize = 16,
        rectWidth = 20,
        rectHeight = 10,
        directInsert = false,
    }
) {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.gap = "8px";
    legendItem.classList.add("legend-symbology");

    const symbol = document.createElement("div");

    // Determine if 'fill' is a gradient string
    const isGradient = typeof fill === "string" && fill.startsWith("linear-gradient");

    if (symbolType === "circle") {
        symbol.style.width = circleSize + "px";
        symbol.style.height = circleSize + "px";
        symbol.style.borderRadius = "50%";
        if (isGradient) {
            symbol.style.background = fill;
        } else {
            symbol.style.backgroundColor = fill;
        }
        symbol.style.border = `${strokeThickness}px solid ${stroke}`;
    } else if (symbolType === "line") {
        symbol.style.width = "20px";
        symbol.style.height = lineThickness + "px";
        symbol.style.backgroundColor = lineColor;
    } else if (symbolType === "image") {
        symbol.innerHTML = `<img src="${imgSrc}" alt="Legend symbol" width="${imageSize}" height="${imageSize}">`;
    } else if (symbolType === "rectangle") {
        symbol.style.width = rectWidth + "px";
        symbol.style.height = rectHeight + "px";
        if (isGradient) {
            symbol.style.background = fill;
        } else {
            symbol.style.backgroundColor = fill;
        }
        symbol.style.border = `${strokeThickness}px solid ${stroke}`;
    } else {
        throw new Error("Invalid symbol type. Use 'circle', 'line', 'image', or 'rectangle'.");
    }

    const labelText = document.createElement("span");
    labelText.textContent = text;
    labelText.style.maxWidth = "180px";

    legendItem.appendChild(symbol);
    legendItem.appendChild(labelText);

    if(!directInsert)
        $(targetElementID).parent().after(legendItem);
    else
        {
            legendItem.style.marginLeft = "1px";
            legendItem.style.gap = "4px";
            $(targetElementID).after(legendItem);
        }


}




