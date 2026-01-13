import { addLegendSymbol } from "./addLegendSymbol.js";

let legendSymbolsAdded = false;

export function addStrategicNetworkPT(map) {

    //----------------------------- Bus -----------------------------------
    map.addSource('strategicNetworkBus', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'data/geojson/strategic-networks/pt/bus.geojson',
        generateId: true // This ensures that all features have unique IDs
    });

    map.addLayer({
        'id': 'bus-lines',
        'type': 'line',
        'source': 'strategicNetworkBus',
        'layout': {
           'visibility': 'none',
           'line-cap': 'butt',
           'line-join': 'round',
        },
        'paint': {
            'line-color': '#EE1111',
            'line-width': [
                'interpolate', ['linear'], ['zoom'],
                12, 1,  // Line width = 1 when zoom < 10
                13, 5  // Line width = 3 when zoom >= 10
            ],
        }
    });

    // Add labels on top of the lines
/*     map.addLayer({
        id: 'bus-labels',
        type: 'symbol',
        source: 'strategicNetworkBus',
        minzoom: 12,
        layout: {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'text-field': ['get', 'ref'], // Gets text from "ref" property
            'text-size': 14,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'map',
            'text-anchor': 'center',
            'text-padding': 2,
        },
        paint: {
            'text-color': '#EE1111', // Label color (black)
            'text-halo-color': '#ffffff', // White halo for readability
            'text-halo-width': 2
        }
    }); */


    let legendSymbolBus = {
        text : "Bus",
        symbolType: "line",
        lineColor: "#EE1111",
        lineThickness: 2,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-pt", legendSymbolBus);
        //$("#strategisches-netz-pt").parent().after("<div style='margin-left: 20px'>RadVis RadNETZ Kommunen")
    }


    console.log("added bus lines...")


    //--------------------------------------------Stadtbahn-----------------------------------

    map.addSource('strategicNetworkZug', {
        type: 'geojson',
        data: 'data/geojson/strategic-networks/pt/zug.geojson',
        generateId: true
    });
    map.addLayer({
        'id': 'zug-lines',
        'type': 'line',
        'source': 'strategicNetworkZug',
        'layout': {
        'visibility': 'none',
        },
        'paint': {
            'line-color': '#EEBB00',
            'line-width': [
                'interpolate', ['linear'], ['zoom'],
                12, 5,
                13, 12
            ],
        }
    });
/*     map.addLayer({
        id: 'zug-labels',
        type: 'symbol',
        source: 'strategicNetworkZug',

        layout: {
            'visibility': 'none',
            'symbol-placement': 'line',
            'text-field': ['get', 'ref'],
            'text-size': 14,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'map',
            'text-anchor': 'center',
            'text-padding': 2,
        },
        paint: {
            'text-color': '#EEBB00',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
        }
    }); */

    let legendSymbolZug = {
        text : "Zug",
        symbolType: "line",
        lineColor: "#EEBB00",
        lineThickness: 2,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-pt", legendSymbolZug);
    }

    console.log("Loaded Zugliniennetz...")


    //--------------------------------------------Stadtbahn-----------------------------------

    map.addSource('strategicNetworkStadtbahn', {
        type: 'geojson',
        data: 'data/geojson/strategic-networks/pt/stadtbahn.geojson',
        generateId: true
    });
    map.addLayer({
        'id': 'stadtbahn-lines',
        'type': 'line',
        'source': 'strategicNetworkStadtbahn',
        'layout': {
        'visibility': 'none',
        },
        'paint': {
            'line-color': '#22CC22',
            'line-width': [
                'interpolate', ['linear'], ['zoom'],
                12, 3,
                13, 5
            ],
        }
    });
/*     map.addLayer({
        id: 'stadtbahn-labels',
        type: 'symbol',
        source: 'strategicNetworkStadtbahn',

        layout: {
            'visibility': 'none',
            'symbol-placement': 'line',
            'text-field': ['get', 'ref'],
            'text-size': 14,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'map',
            'text-anchor': 'center',
            'text-padding': 2,
        },
        paint: {
            'text-color': '#22CC22',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
        }
    }); */

    let legendSymbolStadtBahn = {
        text : "Stadtbahn",
        symbolType: "line",
        lineColor: "#22CC22",
        lineThickness: 2,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-pt", legendSymbolStadtBahn);
    }

    console.log("Loaded Stadtbahn...")


    //--------------------------------------------Haltestellen-----------------------------------

    map.addSource('strategicNetworkHaltestellen', {
        type: 'vector',
        url: 'https://api.mobidata-bw.de/geoserver/gwc/service/wmts/rest/MobiData-BW:transit_stops/MobiData-BW:mdbw_transit_stops_default/tilejson/pbf?format=application/json',
    });

    map.addLayer({
        id: 'haltestellen-fill',
        type: 'circle',
        source: 'strategicNetworkHaltestellen',
        'source-layer': 'transit_stops',
        minzoom: 12,
        layout: {
            'visibility': 'none',
        },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 3,
                16, 7
            ], // Get size from feature property
            'circle-color': '#FFFFFF', // Get color from feature property
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000000'
        }
    });

    let legendSymbolHaltestellen = {
        text : "Haltestellen",
        symbolType: "circle",
        fill: "#FFFFFF",
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#strategisches-netz-pt", legendSymbolHaltestellen);
    }

    console.log("Loaded Haltestellen...")
        
    legendSymbolsAdded = true;
  }