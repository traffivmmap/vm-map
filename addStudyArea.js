function addStudyArea(map)
{
    map.addSource('untersuchungsgebiet', {
        type: 'geojson',
        data: 'data/geojson/study-area/area.geojson',
    });

    map.addLayer({
        'id': 'untersuchungsgebiet-line',
        'type': 'line',
        'source': 'untersuchungsgebiet',
        'layout': {
            'visibility': 'none',
            'line-cap': 'butt',
            'line-join': 'round',
        },
        'paint': {
            'line-color': '#101010',
            'line-width': 3,
        }
    });

    console.log("Added source and Layer Untersuchungsgebiet.")
}