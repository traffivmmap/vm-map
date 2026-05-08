import { addLegendSymbol } from "./addLegendSymbol.js";

let legendSymbolsAdded = false;

export async function addProjektLSA(map)
{
    // Do checks so that the image is only loaded once and the layer is only added once,
    // otherwise there would be errors in the console and the map would slow down significantly

    if (!map.hasImage('ampel')) {
        const image = await map.loadImage('../data/images/120px-Ampel.svg.png');
        map.addImage('ampel', image.data);
    }

    // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('projekt-lsa-source', {
            'type': 'geojson',
            'data':
                'data/geojson/strategic-networks/projekt-lsa.geojson'
        });

        map.addLayer(
            {
                'id': 'projekt-lsa-layer',
                'type': 'symbol',
                'source': 'projekt-lsa-source',
                'maxzoom': 20,
            layout: {
                'visibility': 'none',
            'icon-image': 'ampel',
            'icon-size': 0.1,
            'icon-allow-overlap': true,
             }
            }
        );

    let legendSymbolProjektLSA = {
        text : "",
        symbolType: "image",
        imgWidth: 6,
        imgHeight: 15,
        imgSrc: "../data/images/120px-Ampel.svg.png",
        directInsert: true
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#projekt-lsa", legendSymbolProjektLSA);
    }

    console.log("Loaded Projekt LSA...")
    legendSymbolsAdded = true;
}