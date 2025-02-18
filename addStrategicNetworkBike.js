let legendSymbolsAdded = false

function addStrategicNetworkBike(map)
{



        //-------------------------------------------------------------------------Kommunen-----------------------------------------------------
    
        map.addSource('RadNETZKom-source', {
            type: 'geojson',
            // Unfortunately, this json service has low precision for the resulting geojson.
            // data: 'https://www.radroutenplaner-bw.de/api/geoserver/radvis-infrastrukturen/wms?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&outputFormat=application%2Fjson&typeName=radvis-infrastrukturen:radvisnetz-radnetz&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
            data : 'data/geojson/strategic-networks/bike/RadNETZKom.geojson',
        });
    
        map.addLayer({
            id: 'RadNETZKom-layer',
            type: 'line', // Change to 'circle' for points
            source: 'RadNETZKom-source',
            minzoom: 11,
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
                'visibility': 'none',            
            },
            paint: {
                'line-color': [
                    "case",
                    // Case 1: Contains "FREIZEIT", but not "ALLTAG"
                    [
                        "all",
                        ["in", "FREIZEIT", ["get", "netzklasse"]],
                        ["!", ["in", "ALLTAG", ["get", "netzklasse"]]]
                    ],
                    "#FF0000",  // Color for Case 1
                    
                    // Case 2: Contains "ALLTAG", but not "FREIZEIT"
                    [
                        "all",
                        ["in", "ALLTAG", ["get", "netzklasse"]],
                        ["!", ["in", "FREIZEIT", ["get", "netzklasse"]]]
                    ],
                    "#0000FF",  // Color for Case 2
                    
                    // Case 3: Contains both "ALLTAG" and "FREIZEIT"
                    [
                        "all",
                        ["in", "ALLTAG", ["get", "netzklasse"]],
                        ["in", "FREIZEIT", ["get", "netzklasse"]]
                    ],
                    "#FF00FF",  // Color for Case 3
                    
                    // Default color (if none of the cases match)
                    "gray"
                ],
                'line-width': 1,
            }
        });
    
        let legendSymbolAlltag = {
            text : "Alltag",
            symbolType: "line",
            lineColor: "#0000FF",
            lineThickness: 1,
        }
    
        let legendSymbolFreizeit = {
            text : "Freizeit",
            symbolType: "line",
            lineColor: "#FF0000",
            lineThickness: 1,
        }
    
        let legendSymbolAlltagFreizeit = {
            text : "Alltag und Freizeit",
            symbolType: "line",
            lineColor: "#FF00FF",
            lineThickness: 1,
        }
 
        if(!legendSymbolsAdded)
        {        
            $("#strategisches-netz-rad").parent().parent().append("<div style='margin-left: 20px'>RadVis RadNETZ Kommunen");
            addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltag);
            addLegendSymbol("#strategisches-netz-rad", legendSymbolFreizeit);
            addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltagFreizeit);
        }







    //-----------------------------------------------------------------Kreise-------------------------------------------------------------------------
    
    map.addSource('RadNETZKreis-source', {
        type: 'geojson',
        // Unfortunately, this json service has low precision for the resulting geojson. It looks not pleasing to the eyes.
        // data: 'https://www.radroutenplaner-bw.de/api/geoserver/radvis-infrastrukturen/wms?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&outputFormat=application%2Fjson&typeName=radvis-infrastrukturen:radvisnetz-radnetz&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
        data : 'data/geojson/strategic-networks/bike/RadNETZBKreis.geojson',
    });

    map.addLayer({
        id: 'RadNETZKreis-layer',
        type: 'line', // Change to 'circle' for points
        source: 'RadNETZKreis-source',
        minzoom: 11,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none',            
        },
        paint: {
            'line-color': [
                "case",
                // Case 1: Contains "FREIZEIT", but not "ALLTAG"
                [
                    "all",
                    ["in", "FREIZEIT", ["get", "netzklasse"]],
                    ["!", ["in", "ALLTAG", ["get", "netzklasse"]]]
                ],
                "#FF0000",  // Color for Case 1
                
                // Case 2: Contains "ALLTAG", but not "FREIZEIT"
                [
                    "all",
                    ["in", "ALLTAG", ["get", "netzklasse"]],
                    ["!", ["in", "FREIZEIT", ["get", "netzklasse"]]]
                ],
                "#0000FF",  // Color for Case 2
                
                // Case 3: Contains both "ALLTAG" and "FREIZEIT"
                [
                    "all",
                    ["in", "ALLTAG", ["get", "netzklasse"]],
                    ["in", "FREIZEIT", ["get", "netzklasse"]]
                ],
                "#FF00FF",  // Color for Case 3
                
                // Default color (if none of the cases match)
                "gray"
            ],
            'line-width': 3,
        }
    });

    legendSymbolAlltag = {
        text : "Alltag",
        symbolType: "line",
        lineColor: "#0000FF",
        lineThickness: 3,
    }

    legendSymbolFreizeit = {
        text : "Freizeit",
        symbolType: "line",
        lineColor: "#FF0000",
        lineThickness: 3,
    }

    legendSymbolAlltagFreizeit = {
        text : "Alltag und Freizeit",
        symbolType: "line",
        lineColor: "#FF00FF",
        lineThickness: 3,
    }

    if(!legendSymbolsAdded)
    {
        $("#strategisches-netz-rad").parent().parent().append("<div style='margin-left: 20px'>RadVis RadNETZ Kreise");
        addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltag);
        addLegendSymbol("#strategisches-netz-rad", legendSymbolFreizeit);
        addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltagFreizeit);
    }

    //-------------------------------------------------------------------------Land-----------------------------------------------------

    map.addSource('RadNETZBW-source', {
        type: 'geojson',
        // Unfortunately, this json service has low precision for the resulting geojson.
        // data: 'https://www.radroutenplaner-bw.de/api/geoserver/radvis-infrastrukturen/wms?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&outputFormat=application%2Fjson&typeName=radvis-infrastrukturen:radvisnetz-radnetz&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
        data : 'data/geojson/strategic-networks/bike/RadNETZBW.geojson',
    });

    map.addLayer({
        id: 'RadNETZBW-layer',
        type: 'line', // Change to 'circle' for points
        source: 'RadNETZBW-source',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none',            
        },
        paint: {
            'line-color': [
                'case',
                ['in', 'RADNETZ_ALLTAG;RADNETZ_FREIZEIT', ['get', 'netzklasse']], '#FF00FF',
                ['in', 'ALLTAG', ['get', 'netzklasse']], '#0000FF',  // Blue if 'ALLTAG' is in 'netzklasse'
                ['in', 'FREIZEIT', ['get', 'netzklasse']], '#FF0000',  // Red if 'FREIZEIT' is in 'netzklasse'

                '#808080'  // Fallback color (gray) for other cases 
            ],
            'line-width': 5,
        }
    });

     legendSymbolAlltag = {
        text : "Alltag",
        symbolType: "line",
        lineColor: "#0000FF",
        lineThickness: 5,
    }

     legendSymbolFreizeit = {
        text : "Freizeit",
        symbolType: "line",
        lineColor: "#FF0000",
        lineThickness: 5,
    }

     legendSymbolAlltagFreizeit = {
        text : "Alltag und Freizeit",
        symbolType: "line",
        lineColor: "#FF00FF",
        lineThickness: 5,
    }

    if(!legendSymbolsAdded)
    {
        $("#strategisches-netz-rad").parent().parent().append("<div style='margin-left: 20px'>RadVis RadNETZ Land");
        addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltag);
        addLegendSymbol("#strategisches-netz-rad", legendSymbolFreizeit);
        addLegendSymbol("#strategisches-netz-rad", legendSymbolAlltagFreizeit);
    }

    //------------------------------------------OSM--------------------------------------------------
    //
    map.addSource('RadOSM-source', {
        type: 'geojson',
        // Unfortunately, this json service has low precision for the resulting geojson.
        // data: 'https://www.radroutenplaner-bw.de/api/geoserver/radvis-infrastrukturen/wms?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&outputFormat=application%2Fjson&typeName=radvis-infrastrukturen:radvisnetz-radnetz&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326'
        data : 'data/geojson/strategic-networks/bike/RadOSM.geojson',
    });

    map.addLayer({
        id: 'RadOSM-layer',
        type: 'line',
        source: 'RadOSM-source',
        minzoom: 11,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none',            
        },
        paint: {
            'line-color': '#00CC00',
            'line-width': 2,
        }
    });


        
    legendSymbolOSM = {
        text : "OSM Radnetz",
        symbolType: "line",
        lineColor: "#00CC00",
        lineThickness: 2,
    }

    if(!legendSymbolsAdded)
    {
        $("#strategisches-netz-rad").parent().parent().append("<div style='margin-left: 20px'>OSM");
        addLegendSymbol("#strategisches-netz-rad", legendSymbolOSM);
    }


    //------------------------------------------------------------------------------------------- Bikesharing stations ------------------------------------------------------------

    map.addSource('strategicNetworkBikeSharingStations', {
        type: 'geojson',
        data: 'https://api.mobidata-bw.de/geoserver/MobiData-BW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MobiData-BW%3Asharing_stations_bicycle&outputFormat=application%2Fjson&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326',
        generateId: true
    });
    map.addLayer({
        'id': 'bikeSharingStations-outlines',
        'type': 'circle',
        'source': 'strategicNetworkBikeSharingStations',
        minzoom: 10,
        'layout': {
        'visibility': 'none',
        },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 4,
                16, 8
            ], // Get size from feature property
            'circle-color': '#000000', // Get color from feature property
        }
    });
    map.addLayer({
        'id': 'bikeSharingStations-fill',
        'type': 'circle',
        'source': 'strategicNetworkBikeSharingStations',
        minzoom: 10,
        'layout': {
        'visibility': 'none',
        },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 3,
                16, 7
            ], // Get size from feature property
            'circle-color': '#FFFF00', // Get color from feature property
        }
    });
        
    legendSymbolBikeSharingStation = {
        text : "Bikesharing-Stationen",
        symbolType: "circle",
        fill: "#FFFF00",
    }

    if(!legendSymbolsAdded)
    {
        $("#strategisches-netz-rad").parent().parent().append("<div style='margin-left: 20px'>Weiteres");
        addLegendSymbol("#strategisches-netz-rad", legendSymbolBikeSharingStation);
    }



    

    map.addSource('strategicNetworkBikeFahrradabstellanlagen', {
        type: 'geojson',
        data: 'https://api.mobidata-bw.de/geoserver/MobiData-BW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MobiData-BW%3Aparking_sites_bicycle&outputFormat=application%2Fjson&BBOX=8.8161400718472898,49.0203349136633904,9.5276227301316343,49.3876212646939976,EPSG:4326&srsName=EPSG:4326',
        generateId: true
    });
    map.addLayer({
        'id': 'Fahrradabstellanlagen-outlines',
        'type': 'circle',
        'source': 'strategicNetworkBikeFahrradabstellanlagen',
        minzoom: 10,
        'layout': {
        'visibility': 'none',
        },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 4,
                16, 8
            ], // Get size from feature property
            'circle-color': '#000000', // Get color from feature property
        }
    });
    map.addLayer({
        'id': 'Fahrradabstellanlagen-fill',
        'type': 'circle',
        'source': 'strategicNetworkBikeFahrradabstellanlagen',
        minzoom: 10,
        'layout': {
        'visibility': 'none',
        },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 3,
                16, 7
            ], // Get size from feature property
            'circle-color': '#00DD00', // Get color from feature property
        }
    });
        
    legendSymbolBikeSharingStation = {
        text : "Lastenrad-Leihstationen",
        symbolType: "circle",
        fill: "#00DD00",
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#strategisches-netz-rad", legendSymbolBikeSharingStation);
    }



    legendSymbolsAdded = true    
    console.log("Loaded Bike network...")

    // -----------------------------------------------------------------------Lastenrad-Leihstationen (Gibt im Untersuchungsgebiet in MobiData keine)-------------------------------------------------------------

}