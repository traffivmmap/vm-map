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
    let element = mappings.measureIdToMarkers.get(index)
    console.log(element)
    let bearing = 0; //Math.floor(Math.random() * 360);
    let zoom = 12.75 + Math.floor(Math.random() * 3); // 15.99 is the max zoom for the satellite map
    let pitch = 10 + Math.floor(Math.random() * 60);
    let params = {
				bearing: bearing,
				center: feature.geometry.coordinates[0],
				zoom: zoom,
				pitch: pitch,
				speed: 0.5,
			}
			if ($(element).is(':visible')) {
				console.log("I fly to point");
				map.flyTo(params)
			}
			else {
				console.log("I fly do NOT fly to point");
			}
  }
}

export default MapHelpers;



