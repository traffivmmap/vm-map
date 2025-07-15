let legendSymbolsAdded = false;
let dropdown;

export async function addMunicipalities(map)
{

    map.addSource('gemeinden', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'data/geojson/gemeinden.geojson',
        generateId: true // This ensures that all features have unique IDs
    });

    map.addLayer({
        'id': 'gemeinden-fill',
        'type': 'fill',
        'source': 'gemeinden',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-color': '#00AA00',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.1,
                0.0
            ]
        }
    });

    map.addLayer({
        'id': 'gemeinden-line',
        'type': 'line',
        'source': 'gemeinden',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'line-color': '#00AA00',
            'line-width': 1.25,
            'line-dasharray': [3,3]
        }
    });


        map.addLayer({
        'id': 'gemeinden-layer',
        'type': 'line',
        'source': 'gemeinden',
        'layout': {
            //'visibility': 'none',
        },
        'paint': {
            'line-color': '#fffc00',
            'line-width': 2,
        }
    });


    if(!legendSymbolsAdded)
    {
    var targetElementID = '#gemeinden';
    // Now fetch the same data for dropdown use
    const response = await fetch('data/geojson/gemeinden.geojson');
    const geojson = await response.json();
    const features = geojson.features;

    // Extract "gem_nam" values and filter duplicates
    var gemNames = [...new Set(features.map(f => f.properties.gem_nam))];
    // Sort the names alphabetically
    gemNames.sort();

    // Create the <select> element with the class
    dropdown = $('<select class="legend-dropdown"></select>');

    // Loop through the array and add each option
    // Add each unique gem_nam as an option
    dropdown.append($('<option></option>').val("-").text("-"));
    gemNames.forEach(function(name) {
        dropdown.append($('<option></option>').val(name).text(name));
    });

    // Insert the dropdown after the parent of the target element
    $(targetElementID).after(dropdown);




    // When the dropdown value changes, update the map filter
    dropdown.on('change', function () {
        const selectedName = $(this).val();

        if (selectedName) {
            // Filter the layer to only show the selected "gem_nam"
            map.setFilter('gemeinden-layer', ['==', ['get', 'gem_nam'], selectedName]);
        } else {
            // If nothing is selected, show all features
            map.setFilter('gemeinden-layer', null);
        }

        const feature = geojson.features.find(
            f => f.properties.gem_nam === selectedName
        );

        if (feature) {
            // Calculate bounds and fly to the feature
            const coordinates = feature.geometry.coordinates;
            const type = feature.geometry.type;

            let bounds;

            if (type === 'Polygon') {
                bounds = coordinates[0].reduce((b, coord) => b.extend(coord), new maplibregl.LngLatBounds(coordinates[0][0], coordinates[0][0]));
            } else if (type === 'MultiPolygon') {
                bounds = coordinates.reduce((b, polygon) => {
                    return polygon[0].reduce((b2, coord) => b2.extend(coord), b);
                }, new maplibregl.LngLatBounds(coordinates[0][0][0], coordinates[0][0][0]));
            }

            if (bounds) {
                map.fitBounds(bounds, { padding: 50, duration: 2000 });
            }
        }

    });




}
    dropdown.val("-"); // Set the default value to "-"
    dropdown.trigger('change');

    legendSymbolsAdded = true;
    console.log("Added municipalities.")
}