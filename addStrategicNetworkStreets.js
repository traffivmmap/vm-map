let legendSymbolsAdded = false;

export function addStrategicNetworkStreets(map)
{

    let legendSymbolDirection = {
        text : "Stationierungsrichtung",
        symbolType: "image",
        imageSize: 10,
        imgSrc: "data/images/arrow.png",
    }
    
    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#strategisches-netz-miv", legendSymbolDirection);
    }

    let legendSymbolNode = {
        text : "Netzknoten",
        symbolType: "circle",
        circleSize: 5,
        fill: "#111111",
    }
    
    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#strategisches-netz-miv", legendSymbolNode);
    }

    map.addSource('streetsBLK', {
        type: 'geojson',
        data: 'data/geojson/strategic-networks/iv/BLK.geojson',
        generateId: true,
    });

     // #region K
     map.addLayer({
        'id': 'K-line',
        'type': 'line',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'line-cap': 'round',
            'line-join': 'round',
        },
        'paint': {
            'line-color': '#E6DE8B',
            'line-width': 4,
        },
        filter: ['==', ['get', 'StrassenArt'], 'K']
    });

    map.addLayer({
        'id': 'K-name-label',
        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'symbol-spacing': 150,
            'text-field': ["get", "StrassenName"],
            'text-size': 12,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'viewport',
            'text-anchor': 'center',
            'text-padding': 1,
            'text-offset': [0,-2],
        },
        paint: {
            'text-color': '#000000', // Label color (black)
            'text-halo-color': '#ffffff', // White halo for readability
            'text-halo-width': 1
        },
        filter: ['==', ['get', 'StrassenArt'], 'K']
    });

    map.addLayer({
        'id': 'K-direction-arrow',
        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'symbol-spacing': 30, // Places labels along the line
            'icon-rotation-alignment': 'map',
            'icon-image': 'arrow-sdf',
            'icon-size': 0.175,
        },
        paint: {
            'icon-color': '#AB9B1B',
        },
        filter: ['==', ['get', 'StrassenArt'], 'K']
    });

    let legendSymbolK = {
        text : "Kreisstraßen",
        symbolType: "line",
        lineColor: "#E6DE8B",
        lineThickness: 2,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-miv", legendSymbolK);
    }
    
    // #endregion K

    // #region L
    map.addLayer({
        'id': 'L-line',
        'type': 'line',
        'source': 'streetsBLK',
        'minzoom': 11,
        'layout': {
            'visibility': 'none',
            'line-cap': 'round',
            'line-join': 'round',
        },
        'paint': {
            'line-color': '#FFE169',
            'line-width': 6,
        },
        filter: ['==', ['get', 'StrassenArt'], 'L']
    });

    map.addLayer({
        'id': 'L-name-label',
        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 11,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'symbol-spacing': 150,
            'text-field': ["get", "StrassenName"],
            'text-size': 12,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'viewport',
            'text-anchor': 'center',
            'text-padding': 1,
            'text-offset': [0,-2],
        },
        paint: {
            'text-color': '#000000', // Label color (black)
            'text-halo-color': '#ffffff', // White halo for readability
            'text-halo-width': 1
        },
        filter: ['==', ['get', 'StrassenArt'], 'L']
    });

   

    map.addLayer({
        'id': 'L-direction-arrow',
        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'symbol-spacing': 40, // Places labels along the line
            'icon-rotation-alignment': 'map',
            'icon-image': 'arrow-sdf',
            'icon-size': 0.175,
        },
        paint: {
            'icon-color': '#AB9B1B',
        },
        filter: ['==', ['get', 'StrassenArt'], 'L']
    });

    let legendSymbolL = {
        text : "Staatsstraßen",
        symbolType: "line",
        lineColor: "#FFE169",
        lineThickness: 4,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-miv", legendSymbolL);
    }

    
    // #endregion L


    // #region B

    map.addLayer({
        'id': 'B-line',
        'type': 'line',
        'source': 'streetsBLK',
        'layout': {
            'visibility': 'none',
            'line-cap': 'round',
            'line-join': 'round',
        },
        'paint': {
            'line-color': '#F0CA00',
            'line-width': 8,
        },
        filter: ['==', ['get', 'StrassenArt'], 'B']
    });


    map.addLayer({
        'id': 'B-direction-arrow',
        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'symbol-spacing': 40, // Places labels along the line
            'icon-rotation-alignment': 'map',
            'icon-image': 'arrow-sdf',
            'icon-size': 0.2,
        },
        paint: {
            'icon-color': '#806B00',
        },
        filter: ['==', ['get', 'StrassenArt'], 'B']
    });

    map.addLayer({
        'id': 'B-name-label',
        'type': 'symbol',
        'source': 'streetsBLK',
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'line', // Places labels along the line
            'text-field': ["get", "StrassenName"],
            'text-size': 12,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'viewport',
            'text-anchor': 'center',
            'text-padding': 1,
            'text-offset': [0,-2],
            'symbol-spacing': 150,
        },
        paint: {
            'text-color': '#000000', // Label color (black)
            'text-halo-color': '#ffffff', // White halo for readability
            'text-halo-width': 1
        },
        filter: ['==', ['get', 'StrassenArt'], 'B']
    });

    let legendSymbolB = {
        text : "Bundesstraßen",
        symbolType: "line",
        lineColor: "#F0CA00",
        lineThickness: 4,
    }

    if(!legendSymbolsAdded)
    {        
        addLegendSymbol("#strategisches-netz-miv", legendSymbolB);
    }
    
    // #endregion B

    map.addLayer({
        'id': 'node-label',

        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'symbol-placement': 'point', // Places labels along the line
            'text-field': ["slice", ["get", "Anfangsnetzknoten"], -3],
            'text-size': 12,
            'text-font': ['Open Sans Bold'],
            'text-rotation-alignment': 'viewport',
            'text-anchor': 'center',
            'text-padding': 1,
            'text-max-angle': 0,
            'text-offset': [1.5,1.5],
        },
        paint: {
            'text-color': '#000000', // Label color (black)
            'text-halo-color': '#ffffff', // White halo for readability
            'text-halo-width': 1
        },
    });

    map.addLayer({
        'id': 'node-symbol',

        'type': 'symbol',
        'source': 'streetsBLK',
        'minzoom': 12,
        'layout': {
            'visibility': 'none',
            'icon-image': 'circle',
            'icon-size': 0.1,
            'symbol-placement': 'point', // Places labels along the line
        },
        paint: {
            'icon-color': '#111111', // Label color (black)
        },
    });



// #region BAB

map.addSource('streetsBAB', {
    type: 'geojson',
    data: 'data/geojson/strategic-networks/iv/BAB.geojson',
});

map.addSource('BAB-KM', {
    type: 'geojson',
    data: 'data/geojson/strategic-networks/iv/BAB-KM.geojson',
});

map.addLayer({
    'id': 'BAB-line',
    'type': 'line',
    'source': 'streetsBAB',
    'layout': {
        'visibility': 'none',
        'line-cap': 'round',
        'line-join': 'round',
    },
    'paint': {
        'line-color': '#3F48CC',
        'line-width': 8,
    },
});

map.addLayer({
    'id': 'BAB-name-label',
    'type': 'symbol',
    'source': 'streetsBAB',
    'layout': {
        'visibility': 'none',
        'symbol-placement': 'line', // Places labels along the line
        'symbol-spacing': 150,
        'text-field': ["get", "ref"],
        'text-size': 12,
        'text-font': ['Open Sans Bold'],
        'text-rotation-alignment': 'viewport',
        'text-anchor': 'center',
        'text-padding': 1,
        'text-offset': [0,-2],
    },
    paint: {
        'text-color': '#000000', // Label color (black)
        'text-halo-color': '#ffffff', // White halo for readability
        'text-halo-width': 1
    },
});

map.addLayer({
    'id': 'km-label',
    'type': 'symbol',
    'source': 'BAB-KM',
    'minzoom': 13,
    'layout': {
        'visibility': 'none',
        'symbol-placement': 'point', // Places labels along the line
        'text-field': ["concat", "km ", ["get", "kilometer"]],
        'text-size': 12,
        'text-font': ['Open Sans Bold'],
        'text-rotation-alignment': 'viewport',
        'text-anchor': 'center',
        'text-padding': 1,
        'text-max-angle': 0,
        'text-offset': [0,1.5],
    },
    paint: {
        'text-color': '#000000', // Label color (black)
        'text-halo-color': '#ffffff', // White halo for readability
        'text-halo-width': 1
    },
});

map.addLayer({
    'id': 'km-symbol',

    'type': 'symbol',
    'source': 'BAB-KM',
    'minzoom': 13,
    'layout': {
        'visibility': 'none',
        'icon-image': 'circle',
        'icon-size': 0.1,
        'symbol-placement': 'point', // Places labels along the line
    },
    paint: {
        'icon-color': '#7777FF', // Label color (black)
    },
});

let legendSymbolBAB = {
    text : "Autobahn",
    symbolType: "line",
    lineColor: "#3F48CC",
    lineThickness: 4,
}

if(!legendSymbolsAdded)
{        
    addLegendSymbol("#strategisches-netz-miv", legendSymbolBAB);
}

// #endregion BAB

// # region Parkplätze und P+R
map.addSource('parking-sites', {
    type: 'geojson',
    data: 'https://api.mobidata-bw.de/geoserver/MobiData-BW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MobiData-BW%3Apark-api_car_buildings&outputFormat=application%2Fjson&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
         //
});

map.addLayer({
    id: 'parking-sites',
    type: 'circle',
    source: 'parking-sites',
    'minzoom': 11,
    'layout': {
        'visibility': 'none',
    },
    paint: {
        'circle-radius': 4,
        'circle-color': '#005a8c',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
    }
});

let legendSymbolParken = {
    text : "Parken (MobiData)",
    symbolType: "circle",
    fill: "#005a8c",
}

if(!legendSymbolsAdded)
{
    addLegendSymbol("#strategisches-netz-miv", legendSymbolParken);
}

// # endregion Parkplätze und P+R

// # region NBA

map.addSource('dwista-source', {
    type: 'geojson',
    data: 'data/geojson/strategic-networks/iv/NBA.geojson'
});

map.addLayer({
    id: 'dwista-layer',
    type: 'circle',
    source: 'dwista-source',
    'minzoom': 11,
    'layout': {
        'visibility': 'none',
    },
    paint: {
        'circle-radius': 4,
        'circle-color': '#BB5a8c',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
    }
});

let legendSymbolNBA = {
    text : "dWiSta",
    symbolType: "circle",
    fill: "#BB5a8c",
}

if(!legendSymbolsAdded)
{
    addLegendSymbol("#strategisches-netz-miv", legendSymbolNBA);
}

// # endregion NBA

// # region LSA

map.addSource('lsa-source', {
    type: 'geojson',
    data: 'data/geojson/strategic-networks/iv/LSA_Strassendatenbank.geojson'
});

map.addLayer({
    id: 'lsa-layer',
    type: 'circle',
    source: 'lsa-source',
    'minzoom': 11,
    'layout': {
        'visibility': 'none',
    },
    paint: {
        'circle-radius': 4,
        'circle-color': 'orange',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
    }
});

map.addSource('lsa-osm-source', {
    type: 'geojson',
    data: 'data/geojson/strategic-networks/iv/LSA_OSM.geojson'
});

map.addLayer({
    id: 'lsa-osm-layer',
    type: 'circle',
    source: 'lsa-osm-source',
    'minzoom': 11,
    'layout': {
        'visibility': 'none',
    },
    paint: {
        'circle-radius': 4,
        'circle-color': 'orange',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
    }
});

let legendSymbolLSA = {
    text : "LSA",
    symbolType: "circle",
    fill: "orange",
}

if(!legendSymbolsAdded)
{
    addLegendSymbol("#strategisches-netz-miv", legendSymbolLSA);
}

// # endregion LSA

// # region Car Sharing

map.addSource('source-car-sharing', {
    type: 'geojson',
    data: 'https://api.mobidata-bw.de/geoserver/MobiData-BW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MobiData-BW%3Asharing_stations_car&outputFormat=application%2Fjson&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
});

map.addLayer({
    id: 'layer-car-sharing',
    type: 'circle',
    source: 'source-car-sharing',
    'minzoom': 11,
    'layout': {
        'visibility': 'none',
    },
    paint: {
        'circle-radius': 4,
        'circle-color': 'aqua',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#000000'
    }
});

let legendSymbolCarSharing = {
    text : "Car Sharing",
    symbolType: "circle",
    fill: "aqua",
}

if(!legendSymbolsAdded)
{
    addLegendSymbol("#strategisches-netz-miv", legendSymbolCarSharing);
}


// #endregion Car Sharing

    legendSymbolsAdded = true    

    console.log("Added source and Layer Straßen.")
}