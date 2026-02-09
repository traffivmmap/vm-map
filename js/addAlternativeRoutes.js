import { CreateCategoryGroup } from "./createCategoryGroup.js";
import { createSidebarEntry } from "./createSidebarEntry.js";
import { mappings } from "./store.js"
import { MapHelpers } from "./mapHelpers.js"
import { addLegendSymbol } from "./addLegendSymbol.js";

let firstload = true;

export function addAlternativeRoutes(map, data_alternative_routes) {

  if (firstload) {
    data_alternative_routes.features.forEach((feature, i) => {
      data_alternative_routes.features[i] = reverse(data_alternative_routes.features[i]);
      data_alternative_routes.features[i].properties.rotation = 90 + turf.bearing(data_alternative_routes.features[i].geometry.coordinates[0], data_alternative_routes.features[i].geometry.coordinates[1]);
    });
  }
  let arrowColor = "#36c453";
  let arrowthickness = 5;
  let strokeopacity = 0.9;
  map.addSource("source_alternativrouten", {
    type: "geojson",
    data: data_alternative_routes,
    generateId: true
  });
  map.addLayer({
    id: "alternativrouten-arrows-shadow",
    type: "symbol",
    source: "source_alternativrouten",
    layout: {
      "symbol-placement": "point",
      "icon-image": "arrow-big-sdf",
      "icon-size": 1.25,
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-offset": [3, 3.2],
      'icon-rotate': ['get', 'rotation'],
      'icon-allow-overlap': true,
    },
    paint: {
      // color same as line
      'icon-color': 'rgba(0,0,0,0)',
      			  'icon-halo-width': 1,
				'icon-halo-blur': 5,
				'icon-halo-color': 'rgba(0,0,0,0.15)',
    }
  });
  map.addLayer({
    'id': 'alternativrouten-stroke-layer',
    'type': 'line',
    'source': 'source_alternativrouten',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round',
    },
    'paint': {
      //'line-dasharray': [1, 2],
      'line-blur': 15,
      'line-offset': -4,
      'line-color': 'black',
      //'line-opacity': 0.0,
      'line-width': [
        'case', ['boolean', ['feature-state', 'hover'], false],
        arrowthickness * 1.5 * 2,
        arrowthickness * 2,
      ],
    },
  });

  map.addLayer({
    id: "alternativrouten-layer",
    type: "line",
    source: "source_alternativrouten",
    paint: {
      //'line-dasharray': [2, 1],
      "line-color": arrowColor,
      'line-width': [
        'case', ['boolean', ['feature-state', 'hover'], false],
        arrowthickness * 1.5,
        arrowthickness,
      ],
      // add line offset
      "line-offset": -4,
    },
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    }
  });
  map.addLayer({
    id: "alternativrouten-arrows",
    type: "symbol",
    source: "source_alternativrouten",
    layout: {
      "symbol-placement": "point",
      "symbol-spacing": 120,
      "icon-image": "arrow-sdf",
      "icon-size": 0.4,
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-offset": [4, 10],
      'icon-rotate': ['get', 'rotation'],
      'icon-allow-overlap': true,
    },
    paint: {
      // color same as line
      "icon-color": arrowColor,
    }
  });

  if (firstload) {

			let legendSymbolAlternativeRoute = {
				text: "Alternativroute",
				symbolType: "arrow",
				fill: arrowColor,
				arrowSize: 14,
				arrowLength: 8,
				directInsert: true,
			}
			addLegendSymbol('#legend-measures', legendSymbolAlternativeRoute);

		console.log("Added legend entry for alternative routes.");



    let catGroup = CreateCategoryGroup("Alternativroute");

    // Add behaviour of the Checkbox
    let cat = catGroup.querySelector(".category")
    let checkbox = cat.querySelector("#visibility-checkbox")
    checkbox.dataset.category = "Alternativroute";
    $(checkbox).on("change", e => {
      MapHelpers.setFeatureVisibility(map, "alternativrouten-layer", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute") || [], e.target.checked)
      MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute") || [], e.target.checked)
      MapHelpers.setFeatureVisibility(map, "alternativrouten-stroke-layer", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute") || [], e.target.checked)
      MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows-shadow", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute") || [], e.target.checked)
    });

    checkbox.addEventListener("click", e => e.stopPropagation());
    document.querySelector("#measures").append(catGroup);

    data_alternative_routes.features.forEach((feature, i) => {
      console.log("Adding a sidebar entry for feature with id " + feature.id);
      // add Sidebar entry
      let props = feature.properties;
      let entryId = "alternative-route-entry-" + i;
      let clone = createSidebarEntry(entryId, null, null, props.label, props.headline, props.description);
      let bearing = 0; //Math.floor(Math.random() * 360);
      let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
      let pitch = 10 + Math.floor(Math.random() * 60);
      clone.querySelector(".sidebar-entry").addEventListener('click', function (event) {
        //don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
        event.stopPropagation();

        // If there's selected text, do nothing
        if (window.getSelection().toString().length > 0) {
          return;
        }

        let params = {
          bearing: bearing,
          center: feature.geometry.coordinates[0],
          zoom: zoom,
          pitch: pitch,
          speed: 0.5,
        }
        let hiddenRoutes = mappings.layerIdToHiddenFeatureIds.get("alternativrouten-layer")
        console.log(hiddenRoutes)
        if (hiddenRoutes && !hiddenRoutes.has(i)) { // Check if the corresponding feature is visible
          console.log("I fly to point");
          map.flyTo(params)
        }
        else {
          console.log("I fly do NOT fly to point");
        }
      });

      clone.querySelector(".sidebar-entry").addEventListener('mouseenter', function (event) {
        this.classList.add("highlight");
        MapHelpers.highlightLine(map, "source_alternativrouten", i);
      });
      clone.querySelector(".sidebar-entry").addEventListener('mouseleave', function (event) {
        this.classList.remove("highlight");
        MapHelpers.unhighlightLine(map, "source_alternativrouten", i);
      });
      mappings.categoryGroupToAlternativeRouteID.insert("Alternativroute", i);
      mappings.alternativeRouteIdToSidebarEntry.insert(i, clone.querySelector(".sidebar-entry"));
      document.querySelector(`[data-category="${feature.properties.category}"]`).appendChild(clone);
      $(document.getElementById("alternative-route-entry-" + i)).slideUp(0);
    });

    // Clicking the alternative routes layer...
    let id = null;
    map.on('mousemove', 'alternativrouten-layer', (event) => {
      if (event.features.length === 0)
        return;
      if (id != null) {
        // remove highlights from the sidebar entries
        let prevEntries = mappings.alternativeRouteIdToSidebarEntry.get(id);
        if (prevEntries) {
          prevEntries.forEach(entry => {
            entry.classList.remove("highlight");
          });
        }
      }
      id = event.features[0].id;
      // Add highlights to the sidebar entries
      let currentEntries = mappings.alternativeRouteIdToSidebarEntry.get(id);
      if (currentEntries) {
        currentEntries.forEach(entry => {
          entry.classList.add("highlight");
        });
      }
    });
    map.on('mouseleave', 'alternativrouten-layer', () => {
      // When the mouse leaves the layer layer, update the
      // feature state of the previously hovered feature
      if (id != null) {
        // Remove highlights from the sidebar entries
        let entries = mappings.alternativeRouteIdToSidebarEntry.get(id);
        if (entries) {
          entries.forEach(entry => {
            entry.classList.remove("highlight");
          });
        }
      }
      id = null;
    });






    // on first load, we initialize the alternative routes hidden
    MapHelpers.setFeatureVisibility(map, "alternativrouten-layer", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-stroke-layer", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows-shadow", mappings.categoryGroupToAlternativeRouteID.get("Alternativroute"), false)

  }
  else {

    // on baselayer changes, we re-initialize the filters with their current state
    MapHelpers.setFeatureVisibility(map, "alternativrouten-layer", mappings.layerIdToHiddenFeatureIds.get("alternativrouten-layer"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows", mappings.layerIdToHiddenFeatureIds.get("alternativrouten-arrows"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-stroke-layer", mappings.layerIdToHiddenFeatureIds.get("alternativrouten-stroke-layer"), false)
    MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows-shadow", mappings.layerIdToHiddenFeatureIds.get("alternativrouten-arrows-shadow"), false)
  }
  firstload = false;
}