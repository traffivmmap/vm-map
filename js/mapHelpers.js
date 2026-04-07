import { mappings } from "./store.js";


// mapHelpers.js


export const MapHelpers = {
  highlightLine(map, layer, featureIndex) {
    map.setFeatureState(
      { source: layer, id: featureIndex },
      { hover: true }
    );
    const sidebarEntries = mappings.alternativeRouteIdToSidebarEntry.get(featureIndex);
    if (sidebarEntries) {
      sidebarEntries.forEach(entry => entry.classList.add("highlight"));
    }
  },

  unhighlightLine(map, layer, featureIndex) {
    map.setFeatureState(
      { source: layer, id: featureIndex },
      { hover: false }
    );
    const sidebarEntries = mappings.alternativeRouteIdToSidebarEntry.get(featureIndex);
    if (sidebarEntries) {
      sidebarEntries.forEach(entry => entry.classList.remove("highlight"));
    }
  },


  highlightMeasure(id) {
    const markers = mappings.measureIdToMarkers.get(id) || [];
    markers.forEach(el => {
      el.classList.add("highlight")
      el.style.zIndex = Number(el.dataset.baseZ) + 10000;
    });

    const sidebarEntries = mappings.measureIdToSidebarEntry.get(id);
    if (sidebarEntries) {
      sidebarEntries.forEach(entry => entry.classList.add("highlight"));
    }
  },

  removeHighlightMeasure(id) {
    const markers = mappings.measureIdToMarkers.get(id) || [];
    markers.forEach(el => {
      el.classList.remove("highlight");
      el.style.zIndex = el.dataset.baseZ;
    });

    const sidebarEntries = mappings.measureIdToSidebarEntry.get(id);
    if (sidebarEntries) {
      sidebarEntries.forEach(entry => entry.classList.remove("highlight"));
    }
  },

  setCategoryMarkersVisible(category, visible) {
    const featureIds = mappings.categoryGroupToMeasureId.get(category) || [];
    featureIds.forEach(id => {
      const markers = mappings.measureIdToMarkers.get(id) || [];
  
      markers.forEach(marker => {
        marker.style.display = visible ? "" : "none";
        marker.style.pointerEvents = visible ? "auto" : "none";
      });
    });
  },

  setFeatureVisibility (map, layerID, featureIDs, visible)
  {
    if (visible) {
      mappings.layerIdToHiddenFeatureIds.remove(layerID, featureIDs);
    } else {
      mappings.layerIdToHiddenFeatureIds.insert(layerID, featureIDs);
    }

  if (mappings.layerIdToHiddenFeatureIds.get(layerID).size === 0) {
    // No hidden features → show all
    map.setFilter(layerID, null);
    return;
  }

  map.setFilter(layerID, [
    "!",
    ["in", ["id"], ["literal", Array.from(mappings.layerIdToHiddenFeatureIds.get(layerID))]]
  ]);

  },

  flyToMeasureMarker(map, feature, index)
  {



const coords = feature.geometry.coordinates;
const bounds = coords.reduce(
  (b, c) => [
    [Math.min(b[0][0], c[0]), Math.min(b[0][1], c[1])],
    [Math.max(b[1][0], c[0]), Math.max(b[1][1], c[1])],
  ],
  [[Infinity, Infinity], [-Infinity, -Infinity]]
);





    let element = mappings.measureIdToMarkers.get(index)
    console.log(element)
    let pitch = 10 + Math.floor(Math.random() * 60);

			if ($(element).is(':visible')) {
				console.log("I fly to point");
				map.fitBounds(bounds, { speed: 0.5, padding: 50, maxZoom: 15.99, pitch: 0 }); // 15.99 is the max zoom for the satellite map
			}
			else {
				console.log("I fly do NOT fly to point");
			}
  }
}

export default MapHelpers;



