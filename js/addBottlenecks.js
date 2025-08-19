import { CreateCategoryGroup } from "./createCategoryGroup.js";
import { filterBottlenecks } from "./filterBottlenecks.js";



let sidebarEntriesAdded = false;

export function addBottlenecks(map, data_bottlenecks, img_route)
{   
    if(!sidebarEntriesAdded)
    {
        // Add sidebar entries for Bottlenecks
        for (let i = 0; i < data_bottlenecks.features.length; i++) {
			let feature = data_bottlenecks.features[i];
			feature.properties.id = i;
			if(!feature.geometry.coordinates[0]) {
				console.log("Bottleneck " + i + " had an invalid geometry. Not adding sidebar-entry.");
				continue;
			}
			data_bottlenecks.features[i] = reverse(data_bottlenecks.features[i]);
			data_bottlenecks.features[i].properties.rotation = 90 + turf.bearing(data_bottlenecks.features[i].geometry.coordinates[0], data_bottlenecks.features[i].geometry.coordinates[1]);	
			
			// Create and return a category group, but only if it not already exists
			let catGroup = CreateCategoryGroup(feature.properties.Situation);
			if(catGroup) 
			{		
				catGroup.querySelector("#visibility-checkbox").addEventListener('click',  (event) => {
					event.stopPropagation();
					filterBottlenecks(map);
					//$(".maplibregl-marker").trigger("togglevisibility", [feature.properties.category])
				}); 
				document.querySelector("#bottlenecks").prepend(catGroup);
			}
			
			
			// ----------------- Add Sidebar entry --------------------------
			// add Sidebar entry
			let clone =  document.querySelector("#template").content.cloneNode(true);

			// Check if image exists
			let image_name = null;
			if(feature.properties.image)
				image_name = feature.properties.image;
			// let id = feature.properties.Situation.replaceAll(' ', '') + '-' + i
			let id = 'Problemstelle-' + i

			if(image_name == null || image_name == "")
			{
				console.log('No image name provided');
				clone.querySelector(".image-container").style.paddingBottom = 0;
				clone.querySelector(".image-container").style.height = 0;
			}
			else
			{
				let file = fetch(img_route + image_name)
				if (file.status === 404) {
					console.log('Image ' + image_name + ' not found.');
					clone.querySelector(".image-container").style.paddingBottom = 0;
					clone.querySelector(".image-container").style.height = 0;
				}
			
				else {
					clone.querySelector(".sidebar-image").src = img_route + image_name;
				}
			}


			clone.querySelector(".headline").textContent = `${feature.properties.pid}: ${feature.properties.headline}`;
			//clone.querySelector(".cartlink").href = "www.example.com";
			clone.querySelector(".description").textContent = `${feature.properties.description}`;
			clone.querySelector(".sidebar-entry").id = id;

			clone.querySelector(".sidebar-entry").addEventListener('mouseover', function() {
				this.style.backgroundColor = '#fffeacff';
				map.setFeatureState({source: 'source-problemstellen', id: i}, {hover: true});
				// make hover true
				
			});
			clone.querySelector(".sidebar-entry").addEventListener('mouseout', function() {
				this.style.backgroundColor = '';
				map.setFeatureState({source: 'source-problemstellen', id: i}, {hover: false});
				// make hover false
			}); 

			let bearing = 0;Math.floor(Math.random() * 360);
			let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
			let pitch = 10 + Math.floor(Math.random() * 60);
			clone.querySelector(".sidebar-entry").addEventListener('click', function(event) {
				//don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
				event.stopPropagation();	
				let params = {
					bearing: bearing,
					center: data_bottlenecks.features[i].geometry.coordinates[0],
					zoom: zoom,
					pitch: pitch,
					speed: 0.5,
				}
				if(event.target.closest(".category-group").querySelector("#visibility-checkbox").checked == true)
				{	
					console.log("I fly to point");
					map.flyTo(params)
				}
				else
				{
					console.log("I fly do NOT fly to point");
				}
			});  

			// add entry to the category-group inside the sidebar and collapse the entry
			document.querySelector(`[data-category="${feature.properties.Situation}"]`).appendChild(clone);
			$(document.getElementById(id)).slideUp(0);
	  	}

		let problemstelleID = null;		
		map.on('mousemove', 'layer-problemstellen-fill', (event) => {
			map.getCanvas().style.cursor = 'pointer';
			if (event.features.length === 0)
				return;
			// When the mouse moves over the layer, update the
			// feature state for the feature under the mouse
			if (problemstelleID != null) {
				map.setFeatureState({source: 'source-problemstellen', id: problemstelleID}, {hover: false});
				// Use querySelectorAll to find both elements
				let elements = document.querySelectorAll('#Problemstelle-' + problemstelleID + ', #strategy-bottleneck-entry-' + problemstelleID);
				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					element.dispatchEvent(new Event('mouseout'));
				});
			}
			problemstelleID = event.features[0].id;
			map.setFeatureState({source: 'source-problemstellen', id: problemstelleID}, {hover: true});
			// Use querySelectorAll to find both elements
			let elements = document.querySelectorAll('#Problemstelle-' + problemstelleID + ', #strategy-bottleneck-entry-' + problemstelleID);
				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.dispatchEvent(new Event('mouseover'));
				});

        });
        map.on('mouseleave', 'layer-problemstellen-fill', () => {
			map.getCanvas().style.cursor = '';
			// When the mouse leaves the layer layer, update the
        	// feature state of the previously hovered feature
        	if (problemstelleID != null) {
        		map.setFeatureState({source: 'source-problemstellen', id: problemstelleID}, {hover: false});
				// Use querySelectorAll to find both elements
				let elements = document.querySelectorAll('#Problemstelle-' + problemstelleID + ', #strategy-bottleneck-entry-' + problemstelleID);
				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.dispatchEvent(new Event('mouseout'));
				});
        	}
          	problemstelleID = null;          	
        });
        // $("#tab-bottlenecks > #visibility-checkbox").click();
        sidebarEntriesAdded = true;
        console.log("Added sidebar entries for Bottlenecks.")
    }

    console.log("Adding Source and layers");
		map.addSource('source-problemstellen', {
			data: data_bottlenecks,
			type: 'geojson',
			generateId: true // This ensures that all features have unique IDs
		});

		let arrowthickness = 6;
		let strokeopacity = 0.9;
		let offset =  ['*', -9, ['coalesce', ['get', 'Offset'], 0.6]]; //-4;
		let outlineColor = 'white'
		let colorrule = [
		'match', ['get','Situation'],
			'Abendspitze', '#ffb800', // from QGIS
			'Beeinträchtigung des ÖPNV', '#c80007',
			'Beeinträchtigung des Radverkehrs', '#d1f700',
			'Morgenspitze', '#ffff00',
			'Morgenspitze & Abendspitze', '#FF4500',
			'Stau', '#b22222',
			'Unfall', '#ff0000',
			'Notfall', '#c80007',
			'Baustelle', 'hsla(51, 90%, 55%, 1)', // original fallback
			'ÖPNV', 'darkcyan',                   // original
			'Zurückgestellte Problemstellen', '#C5C5C5',
			'black' // default
		];
	
		// add 4 layers: line stroke, arrow-stroke, line-fill and arrow-fill
 		map.addLayer({
            'id': 'layer-problemstellen-stroke',
            'type': 'line',
            'source': 'source-problemstellen',
            'layout': {
                //'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
				'line-blur': 15,
				'line-offset': offset,
                'line-color': 'black',
				'line-opacity': strokeopacity,
                'line-width': 
				[
					'case', ['boolean', ['feature-state', 'hover'], false],
					arrowthickness * 2 * 1.5,
					arrowthickness * 2,
				],
            },
        });
		map.addLayer({
            'id': 'layer-problemstellen-arrow-stroke',
            'type': 'symbol',
            'source': 'source-problemstellen',
			'symbol-z-order': 'viewport_y',
			'paint': {
              //'icon-color': '#FBFBFB', // color is determined by the SVG. We don't use SDF, because it has no antialiasing
			  'icon-opacity': strokeopacity,
			  'icon-color': 'rgba(0,0,0,0)',
			  'icon-halo-width': 1,
				'icon-halo-blur': 6,
				'icon-halo-color': 'rgba(0,0,0,0.25)',
			},
			'layout': {
								"icon-offset": [
					"case",
					["==", ["get", "Offset"], 2], ["literal", [2, 14.4]],
					["==", ["get", "Offset"], 3], ["literal", [2, 21.6]],
					["==", ["get", "Offset"], 4], ["literal", [2, 28.8]],
					["literal", [2, 4.32]] // default
					],
				'icon-image': 'arrow-big-sdf',
				'symbol-placement': 'point',
				'symbol-spacing': 1,
				'icon-size':1.25,
				'icon-pitch-alignment': "map",
				'icon-rotation-alignment': "map",
				'icon-rotate': ['get', 'rotation'],
				'icon-allow-overlap': true,
   			}
        }); 

		map.addLayer({
            'id': 'layer-problemstellen-arrow-fill',
            'type': 'symbol',
            'source': 'source-problemstellen',
			'symbol-z-order': 'viewport_y',
			'paint': {
              	'icon-color': colorrule,

  

					},
			'layout': {
			
				"icon-offset": [
					"case",
					["==", ["get", "Offset"], -0.6], ["literal", [0, -13.5]],
					["==", ["get", "Offset"], 2], ["literal", [0, 45]],
					["==", ["get", "Offset"], 3], ["literal", [0, 67.5]],
					["==", ["get", "Offset"], 4], ["literal", [0, 90]],
					["literal", [0, 13.5]] // default
					],

				'icon-image': 'arrow-sdf',
				'symbol-placement': 'point',
				'symbol-spacing': 1,
				'icon-size':0.4,
				//'icon-size':  ['get', 'iconsize'],
				'icon-pitch-alignment': "map",
				'icon-rotation-alignment': "map",
				'icon-rotate': ['get', 'rotation'],
				'icon-allow-overlap': true,
   			}
        });  

		map.addLayer({
            'id': 'layer-problemstellen-fill',
            'type': 'line',
            'source': 'source-problemstellen',
            'layout': {
                //'line-join': 'round',
				'line-cap': 'round',
            },
            'paint': {
				'line-offset': offset,
                'line-color': colorrule,
				//NOT SUPPORTED :(
				//'line-border-width':1,
                'line-width': [
					'case', ['boolean', ['feature-state', 'hover'], false],
					arrowthickness * 1.5,
					arrowthickness,
				],
            },
        });

		filterBottlenecks(map);

    console.log("Added source and Layer Bottlenecks.")
}