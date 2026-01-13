import { addLegendSymbol } from "./addLegendSymbol.js";

let legendSymbolsAdded = false;

export function addMobilityStations(map) {

//--------------------------------------------Mobilitätsstationen-----------------------------------

//-----------------------------areas-------------------------------
        map.addSource('strategicNetworkMobilitätsstationen', {
            type: 'geojson',
            data: 'data/geojson/mobility-stations/mobility-stations-areas.geojson',
            generateId: true
        });
    
        map.addLayer({
            id: 'layer-mobilstationen-areas',
            type: 'fill',
            source: 'strategicNetworkMobilitätsstationen',
            minzoom: 10,
            layout: {
                'visibility': 'none',
            },
            paint: {
                'fill-color': 'blue', // Get color from feature property
                'fill-opacity': 0.2,
                'fill-outline-color': 'rgba(0, 0, 255, 0.2)',
            }
        });
    
        let legendSymbolMobilitätsstationen = {
            text : "Potentiale (NVBW)",
            symbolType: "rectangle",
            fill: "lightblue",
            strokeThickness: 0,
        }
    
        if(!legendSymbolsAdded)
        {
            addLegendSymbol("#mobilstationen", legendSymbolMobilitätsstationen);
        }
//-----------------------------points-------------------------------
    map.addSource('strategicNetworkMobilitätsstationenPoints', {
        type: 'geojson',
        data: 'data/geojson/mobility-stations/mobility-stations.geojson',
        generateId: true
    });

    map.addLayer({
        id: 'layer-mobilstationen-points',
        type: 'circle',
        source: 'strategicNetworkMobilitätsstationenPoints',
        minzoom: 7,
        layout: {
            'visibility': 'none',
        },
        paint: {
            'circle-radius': 6,
            'circle-color': 'forestgreen',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
        }
    });

    let legendSymbolMobilitätsstationenPoints = {
        text : "Potentiale (Stadt/LKR)",
        symbolType: "circle",
        fill: "forestgreen",
        stroke: "black",
        strokeThickness: 1,
        radius: 6,
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#mobilstationen", legendSymbolMobilitätsstationenPoints);
    }

    console.log("Loaded Mobilitätsstationen...")
    legendSymbolsAdded = true;
  }