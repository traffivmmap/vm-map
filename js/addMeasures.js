import { scrollSidebarToEntry } from "./scrollSidebarToEntry.js";
import { createOutlinedSVGText } from "./createOutlinedSVGText.js";
import { addLegendSymbol } from "./addLegendSymbol.js";
import { CreateCategoryGroup } from "./createCategoryGroup.js";
import { createSidebarEntry } from "./createSidebarEntry.js";
import { mappings, MultiMap } from "./store.js";
import { MapHelpers } from './mapHelpers.js';

/**
 * Adds measure layers to the map.
 *
 * @param {Map} map
 * @param {GeoJSON.FeatureCollection[]} data_measures
 *   Array of GeoJSON FeatureCollections
 * @param {string} img_route
 * @param {string} icon_route
 */


const featureIdToSidebarEntry = new Map();
// global variable to store the mapping of alternative route feature ids to their corresponding sidebar entries, for hover highlighting
var allFeatures;
var categories;

const icon_route = 'data/icons/'
const svgCache = new Map(); // Cache SVG content by category to avoid redundant fetches

/**
 * Fetch and cache SVG content for a given category.
 * Subsequent calls for the same category will return the cached Promise.
 */
function fetchSVGContent(category) {
	if (!svgCache.has(category)) {
		svgCache.set(category, 
			fetch(icon_route + category + '.svg')
				.then(response => response.text())
				.catch(error => {
					console.error(`Error loading SVG for category ${category}:`, error);
					return null;
				})
		);
	}
	return svgCache.get(category);
}

export function addMeasures(map, data_measures, img_route) {
	console.log("loading massnahmen");


data_measures.features.sort((a, b) =>
  a.properties.label.localeCompare(b.properties.label, undefined, { numeric: true })
);

	allFeatures = data_measures.features;
	categories = new Set(
		allFeatures
			.map(f => f.properties.category)
	);

	createCategoryGroupsForMarkers();

	allFeatures.forEach((feature, i) => {
		// add Sidebar entry
		let props = feature.properties;
    let clone = createSidebarEntry("measure-entry-" + i, img_route, props.image, props.label, props.headline, props.description);
		clone.querySelector(".sidebar-entry").addEventListener('click', function (event) {
			//don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
			event.stopPropagation();

			// If there's selected text, do nothing
			if (window.getSelection().toString().length > 0) {
				return;
			}

			MapHelpers.flyToMeasureMarker(map, feature, i);
		});

		// add mappings for entries and category groups
		mappings.measureIdToSidebarEntry.insert(i, clone.querySelector(".sidebar-entry"));
		const category = feature.properties.category;
		if (!mappings.categoryGroupToMeasureId.has(category)) {
			mappings.categoryGroupToMeasureId.set(category, []);
		}
		mappings.categoryGroupToMeasureId.get(category).push(i);

		// add entry to the category-group inside the sidebar and collapse the entry
		document.querySelector(`[data-category="${feature.properties.category}"]`).appendChild(clone);
		$(document.getElementById("measure-entry-" + i)).slideUp(0);
		// Check for single point or multipoint geometry using cases
		switch (feature.geometry.type) {
			case "MultiPoint":
				feature.geometry.coordinates.forEach(coord => {
					addMarkerToMap(map, coord, i, feature.properties.category, feature.properties.label);
				});
				break;
			case "Point":
				addMarkerToMap(map, feature.geometry.coordinates, i, feature.properties.category, feature.properties.label);
				break;
			default:
				console.log("addMeasures: Skipping feature due to invalid geometry type.");
		}
	});

	console.log(mappings.measureIdToSidebarEntry)
	mappings.measureIdToSidebarEntry.forEach((entries, id) => {
		entries.forEach(entry => {
			entry.addEventListener("mouseenter", (e) => MapHelpers.highlightMeasure(id));
			entry.addEventListener("mouseleave", (e) => MapHelpers.removeHighlightMeasure(id));
		});
	});

	mappings.measureIdToMarkers.forEach((markers, id) => {
		markers.forEach(marker => {
			marker.addEventListener("mouseenter", () => MapHelpers.highlightMeasure(id));
			marker.addEventListener("mouseleave", () => MapHelpers.removeHighlightMeasure(id));
		});
	});
}

function addMarkerToMap(map, LngLat, i, category, label) {
	// create a DOM element for the marker
	const m = document.createElement('div');
	m.classList.add('marker');
	const wrapper = document.createElement('div');
	wrapper.classList.add('marker-wrapper');
	wrapper.style.pointerEvents = 'none';
	m.appendChild(wrapper);

	// construct an svg marker: load an svg, and also create an svg label for it.
	fetchSVGContent(category)
		.then(svgContent => {
			if (!svgContent) {
				console.error('No SVG content available for category:', category);
				return;
			}
			// Create a temporary DOM element to parse the SVG
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = svgContent;

			// Get the SVG element from the parsed content
			const svgElement = tempDiv.querySelector('svg');
			if (!svgElement) {
				console.error('No SVG found in the file.');
				return;
			}

			// Get the width and height attributes from the SVG
			const width = parseFloat(svgElement.getAttribute('width'))
			const height = parseFloat(svgElement.getAttribute('height'));

			// Set the viewBox attribute if both width and height are available
			if (width && height) {
				svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
				// Optionally, remove the width and height attributes to make it responsive
				svgElement.removeAttribute('width');
				svgElement.removeAttribute('height');
				// svgElement.removeAttribute('stroke');
			}

			// This can be used to change the fill of the SVG paths, that have the attribute fill: currentColor
			// svgElement.style.color = '#222222';

			svgElement.classList.add('marker_svg');

			// Insert the modified SVG content into the target element
			wrapper.appendChild(svgElement);

			// Add a label
			let txt = createOutlinedSVGText({
				text: label,
				strokeWidth: 2,
				strokeColor: '#ffffff',
				fill: '#2a2623',
				fontSize: 11,
				x: 0,
				y: 0
			})
			txt.style.left = '100%';
			txt.style.width = 'auto';
			txt.classList.add('marker_text_svg');

			let txtContainer = wrapper.appendChild(document.createElement('div'));
			txtContainer.style.position = 'absolute';
			txtContainer.style.left = '105%';
			txtContainer.style.top = '-5px';
			txtContainer.appendChild(txt);
		})
		.catch(error => {
			console.error('Error processing SVG:', error);
		});

	var baseZ = Math.floor((90 - LngLat[1]) * 1000);
	m.style.zIndex = baseZ
	m.dataset.baseZ = baseZ;

	m.addEventListener('click', (e) => {
		e.stopPropagation();
		console.log("Clicking measure marker");
		// check which layer is active
		if ($('#tab-strategies :input[type="checkbox"]').prop('checked')) {
			$("#tab-strategies").click();
			let sidebarEntry = document.getElementById("strategy-measure-entry-" + i)
			scrollSidebarToEntry(sidebarEntry);
		}
		if ($('#tab-measures :input[type="checkbox"]').prop('checked')) {
			$("#tab-measures").click();
			let sidebarEntry = document.getElementById("measure-entry-" + i)
			scrollSidebarToEntry(sidebarEntry);
		}
	});


	// add marker to maplibre map
	$(m).hide();
	new maplibregl.Marker({ element: m, anchor: 'bottom' })
		.setLngLat(LngLat)
		.addTo(map);

		if (!mappings.measureIdToMarkers.has(i)) {
			mappings.measureIdToMarkers.set(i, []);
		}
	mappings.measureIdToMarkers.get(i).push(m);
}

function createCategoryGroupsForMarkers() {
	// iterate categories and add legend symbols and category groups
	categories.forEach(category => {
		let catGroup = CreateCategoryGroup(category);
		let cat = catGroup.querySelector(".category")
		let checkbox = cat.querySelector("#visibility-checkbox")
		checkbox.dataset.category = category;

		$(checkbox).on("change", e => {
			MapHelpers.setCategoryMarkersVisible(category, e.target.checked)
		});
		document.querySelector("#measures").append(catGroup);

		// Add symbol to the legend
		let legendSymbolMeasure = {
			text: category,
			symbolType: "image",
			imgSrc: icon_route + category + '.svg',
			imageSize: 32,
			directInsert: true,
		}
		addLegendSymbol('#legend-measures', legendSymbolMeasure);
	})
}