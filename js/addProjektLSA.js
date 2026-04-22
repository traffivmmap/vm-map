import { addLegendSymbol } from "./addLegendSymbol.js";

let legendSymbolsAdded = false;

export function addProjektLSA(map)
{
    
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
                'type': 'circle',
                'source': 'projekt-lsa-source',
                'maxzoom': 20,
            layout: {
                'visibility': 'none',            
             },
                'paint': {
            'circle-radius': 8,
            'circle-color': '#00ffee',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
        }
            },
        );

    let legendSymbolProjektLSA = {
        text : "",
        symbolType: "circle",
        fill: "#00ffee",
        stroke: "black",
        strokeThickness: 1,
        radius: 6,
        directInsert: true
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#projekt-lsa", legendSymbolProjektLSA);
    }

    console.log("Loaded Projekt LSA...")
    legendSymbolsAdded = true;
}