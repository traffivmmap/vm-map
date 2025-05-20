let legendSymbolsAdded = false;

export function addAccidents(map)
{
    
    // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('accidents-source', {
            'type': 'geojson',
            'data':
                'data/geojson/accidents/accidents.geojson'
        });

        map.addLayer(
            {
                'id': 'accidents-layer',
                'type': 'heatmap',
                'source': 'accidents-source',
                'maxzoom': 20,
            layout: {
                'visibility': 'none',            
             },
                'paint': {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': 0.25,
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        9,
                        1,
                        13,
                        3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparency color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10,
                        10,
                        20,
                        50
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        19,
                        1,
                        20,
                        0
                    ]

                }
            },
        );

    let legendSymbolAccidents = {
        text : "",
        fill: `linear-gradient(to right,
                rgba(33,102,172,0) 0%,
                rgb(103,169,207) 20%,
                rgb(209,229,240) 40%,
                rgb(253,219,199) 60%,
                rgb(239,138,98) 80%,
                rgb(178,24,43) 100%)`,
        symbolType: "rectangle",
        rectWidth: 25,
        strokeThickness: 0,
        directInsert: true,
    }

    if(!legendSymbolsAdded)
    {
        addLegendSymbol("#accidents", legendSymbolAccidents);
    }

    legendSymbolsAdded = true;
    console.log("Added source and Layer Accidents.")
}