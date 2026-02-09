import { CreateCategoryGroup } from "./createCategoryGroup.js";
import { filterBottlenecks } from "./filterBottlenecks.js";
import { mappings } from "./store.js";
import { MapHelpers } from "./mapHelpers.js";

export function addStrategies(map, data_bottlenecks, data_measures, data_alternative_routes) {
	for (let i = 0; i < data_bottlenecks.features.length; i++) {
		let feature = data_bottlenecks.features[i];
		if (!feature.geometry.coordinates[0]) {
			console.log("Feature " + i + " had an invalid geometry. Not adding strategy-sidebar-entry.");
			continue;
		}
		if (!feature.properties.strategy) {
			console.log("Bottleneck " + i + " (" + feature.properties.pid + ") had an invalid strategy (" + feature.properties.strategy + "). Not adding strategy-sidebar-entry.");
			continue;
		}

		let strategy = "strategy-" + feature.properties.strategy;

		let strat = CreateCategoryGroup(strategy)
		if (strat) {
			$(strat).find(".category-group").data("strategy-number", feature.properties.strategy);
			$(strat.querySelector("#visibility-checkbox")).on("change", e => {
				console.log("Visibility of strategy " + strategy + " changed to " + e.target.checked);
				filterBottlenecks(map);
				MapHelpers.setFeatureVisibility(map, "alternativrouten-layer", mappings.categoryGroupToAlternativeRouteID.get(strategy) || [], e.target.checked)
				MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows", mappings.categoryGroupToAlternativeRouteID.get(strategy) || [], e.target.checked)
				MapHelpers.setFeatureVisibility(map, "alternativrouten-stroke-layer", mappings.categoryGroupToAlternativeRouteID.get(strategy) || [], e.target.checked)
				MapHelpers.setFeatureVisibility(map, "alternativrouten-arrows-shadow", mappings.categoryGroupToAlternativeRouteID.get(strategy) || [], e.target.checked)
				MapHelpers.setCategoryMarkersVisible(strategy, e.target.checked)
			});
			let checkbox = strat.querySelector("#visibility-checkbox");
			checkbox.checked = false;
			// if (i == 0)
			//	strat.querySelector("#visibility-checkbox").checked = true;
		}
		console.log(strat);
		strat.querySelector(".category-group").id = "strategy-entry-" + i
		strat.querySelector("#category-text").textContent = "Strategie " + (feature.properties.strategy);
		document.querySelector("#strategies").append(strat);

		let entryCloneID = "Problemstelle-" + i;
		console.log("Copying DOM Elelent #" + entryCloneID)
		let clone = document.getElementById(entryCloneID).cloneNode(true)
		clone.id = "strategy-bottleneck-entry-" + i

		document.getElementById("strategy-entry-" + i).append(clone);

		document.getElementById("strategy-bottleneck-entry-" + i).addEventListener('mouseover', function () {
			this.style.backgroundColor = '#fffeacff';
			map.setFeatureState({ source: 'source-problemstellen', id: i }, { hover: true });
			// make hover true

		});
		document.getElementById("strategy-bottleneck-entry-" + i).addEventListener('mouseout', function () {
			this.style.backgroundColor = '';
			map.setFeatureState({ source: 'source-problemstellen', id: i }, { hover: false });
			// make hover false
		});

		// When we click on the bottleneck-entry we fly to the bottleneck
		let bearing = 0; Math.floor(Math.random() * 360);
		let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
		let pitch = 10 + Math.floor(Math.random() * 35);
		document.getElementById("strategy-bottleneck-entry-" + i).addEventListener('click', function () {
			//don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
			event.stopPropagation();

			// If there's selected text, do nothing
			if (window.getSelection().toString().length > 0) {
				return;
			}

			let params = {
				bearing: bearing,
				center: data_bottlenecks.features[i].geometry.coordinates[0],
				zoom: zoom,
				pitch: pitch,
				speed: 0.5,
			}
			if (event.target.closest(".category-group").querySelector("#visibility-checkbox").checked == true) {
				console.log("I fly to point");
				map.flyTo(params)
			}
			else {
				console.log("I fly do NOT fly to point");
			}
		});

		for (let m = 0; m < data_measures.features.length; m++) {
			if (data_measures.features[m].properties.strategy)
				if (data_measures.features[m].properties.strategy == data_bottlenecks.features[i].properties.strategy) {
					if (!mappings.categoryGroupToMeasureId.has(strategy)) {
						mappings.categoryGroupToMeasureId.set(strategy, []);
					}
					mappings.categoryGroupToMeasureId.get(strategy).push(m);
					let entryCloneID = "measure-entry-" + m;
					let clone = document.getElementById(entryCloneID).cloneNode(true)
					clone.id = "strategy-measure-entry-" + m
					mappings.measureIdToSidebarEntry.insert(m, clone);

					document.getElementById("strategy-entry-" + i).append(clone);
					$(document.getElementById("strategy-measure-entry-" + m)).slideUp(0);
					document.getElementById("strategy-measure-entry-" + m).addEventListener('mouseover', function () {
						MapHelpers.highlightMeasure(m);
					});
					document.getElementById("strategy-measure-entry-" + m).addEventListener('mouseout', function () {
						MapHelpers.removeHighlightMeasure(m);
					});

					document.getElementById("strategy-measure-entry-" + m).addEventListener('click', function () {
						event.stopPropagation();
						// If there's selected text, do nothing
						if (window.getSelection().toString().length > 0) {
							return;
						}
						MapHelpers.flyToMeasureMarker(map, data_measures.features[m], m)
					});
				}
		}

		// Clone the alternative route entries over to the strategy
		for (let a = 0; a < data_alternative_routes.features.length; a++) {
			let feature = data_alternative_routes.features[a];
			if (!feature.geometry.coordinates[0]) {
				console.log("Feature " + a + " had an invalid geometry. Not adding alternative-route-sidebar-entry.");
				continue;
			}
			if (feature.properties.strategy != data_bottlenecks.features[i].properties.strategy) {
				console.log("Alternative route " + a + " (" + feature.properties.label + "): Stragety did not correspond to current strategy. Strategy of feature: " + feature.properties.strategy + ". Current strategy: " + strategy + ". Not adding alternative-route-sidebar-entry.");
				continue;
			}
			mappings.categoryGroupToAlternativeRouteID.insert(strategy, a)
			// // print strategy:
			// console.log("Strategy: " + strategy)
			// // print strategy of feature:
			// console.log("Strategy of feature: " + feature.properties.strategy)
			// // print index of alternative route:
			// console.log("Index of alternative route: " + a)

			const sidebarEntries = mappings.alternativeRouteIdToSidebarEntry.get(a);

			// print sidebar entries:
			console.log("Sidebar entries for alternative route " + a + ": " + sidebarEntries);

			for (const entry of Array.from(sidebarEntries)) {
				// print current entry:
				// console.log("Current sidebar entry: ");
				// console.log(entry);
				const clone = entry.cloneNode(true);
				clone.id = "strategy-alternative-route-entry-" + a;
				mappings.alternativeRouteIdToSidebarEntry.insert(a, clone);

				//  console.log("appending " + clone + " to element strategy-entry-" + i)
				document.getElementById("strategy-entry-" + i).append(clone);


				document.getElementById("strategy-alternative-route-entry-" + a).addEventListener('mouseover', function () {
					// add highlight class to the class list of the entry

					MapHelpers.highlightLine(map, 'source_alternativrouten', a);
				});
				document.getElementById("strategy-alternative-route-entry-" + a).addEventListener('mouseout', function () {
					this.style.backgroundColor = '';
					MapHelpers.unhighlightLine(map, 'source_alternativrouten', a);
				});


				let bearing = 0; //Math.floor(Math.random() * 360);
				let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
				let pitch = 10 + Math.floor(Math.random() * 60);
				document.getElementById("strategy-alternative-route-entry-" + a).addEventListener('click', function (event) {
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
					if (hiddenRoutes && !hiddenRoutes.has(a)) { // Check if the corresponding feature is visible
						console.log("I fly to point");
						map.flyTo(params)
					}
					else {
						console.log("I fly do NOT fly to point");
					}
				});
			}
		}
	}
	$("#tab-strategies > #visibility-checkbox").click();
}