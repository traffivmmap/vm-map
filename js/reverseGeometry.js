function reverseGeometry(feature) {
  const geometry = feature.geometry;
  
  if (!geometry || !geometry.coordinates) {
    return feature;
  }

  const reversedFeature = {
    ...feature,
    geometry: {
      ...geometry,
      coordinates: reverseCoordinates(geometry.coordinates, geometry.type)
    }
  };

  return reversedFeature;
}

function reverseCoordinates(coordinates, geometryType) {
  switch (geometryType) {
    case 'Point':
      return coordinates;
    case 'LineString':
    case 'MultiPoint':
      return coordinates.reverse();
    case 'Polygon':
    case 'MultiLineString':
      return coordinates.map(ring => ring.reverse());
    case 'MultiPolygon':
      return coordinates.map(polygon => polygon.map(ring => ring.reverse()));
    default:
      return coordinates;
  }
}

export { reverseGeometry };