import { scrollSidebarToEntry } from "./scrollSidebarToEntry.js";

let data_measures = await (await fetch('data/geojson/massnahmen.geojson')).json();

export async function addMeasures(map, img_route, icon_route)
{   
    console.log("loading massnahmen");

		// parse json. Fill map with markers, and sidebar with entries.
		for (let i = 0; i < data_measures.features.length; i++) {
			let feature = data_measures.features[i];
			
			// Check if Icon exists
			let icon_name = feature.properties.category;
			let r = await fetch(icon_route + icon_name + '.svg')
			if (r.status === 404) {
				console.log('Icon ' + icon_name + ' not found. Loading default icon for feature ' + i + '.');
				r = await fetch(icon_route + 'default.svg')
				icon_name = "default"
				if (r.status === 404) {
					console.log("Default icon " + icon_route + 'default.svg not found! Not creating measure ' + i);
					continue;
				}
				
			}

			// Check if geometry is valid
			if (!(feature.geometry && feature.geometry.coordinates)) {
				console.log("Geometry of feature " + i + " was invalid! Not creating feature.");
				continue;
			}

			// Check for category
			let catGroup = document.querySelector("#category-group-template").content.cloneNode(true);
			if(!document.querySelector(`[data-category="${feature.properties.category}"]`)) {
				catGroup.querySelector("#category-text").textContent = feature.properties.category;
				catGroup.querySelector(".category-group").dataset.category = feature.properties.category;
				
				let cat = catGroup.querySelector(".category")
				cat.addEventListener('click',     (event) => { $(`[data-category="${feature.properties.category}"]`).find('.sidebar-entry').slideToggle() });
				cat.addEventListener('mouseover', (event) => { cat.style.backgroundColor = 'rgb(240,248,255)'; });
				cat.addEventListener('mouseout',  (event) => { cat.style.backgroundColor = ''; }); 
				
				cat.querySelector("#visibility-checkbox").addEventListener('click',  (event) => {
					event.stopPropagation();
					//$(".maplibregl-marker").trigger("togglevisibility", [feature.properties.category, event.target.checked])
					$(".maplibregl-marker").trigger("evaluateVisibility")
				}); 

				document.querySelector("#measures").append(catGroup);

			}

			// create a DOM element for the marker
			const el = document.createElement('div');
			el.classList.add('marker');
			// el.style.backgroundImage = `url(${encodeURI(icon_route + icon_name + '.svg')})`;

			// el.style.backgroundImage = setSvgAsBackground(icon_route + icon_name + '.svg');


    fetch(icon_route + icon_name + '.svg')
        .then(response => response.text())
        .then(svgContent => {
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
            const width = svgElement.getAttribute('width');
            const height = svgElement.getAttribute('height');
            
            // Set the viewBox attribute if both width and height are available
            if (width && height) {
                svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                // Optionally, remove the width and height attributes to make it responsive
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
            }

			// This can be used to change the fill of the SVG paths, that have the attribute fill: currentColor
			// svgElement.style.color = '#FF0000'


            
            // Insert the modified SVG content into the target element
            el.innerHTML = svgElement.outerHTML;
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
        });

			el.style.zIndex = Math.floor((90-feature.geometry.coordinates[0][1])*1000)
			el.dataset.iconcategory = feature.properties.category;
			el.dataset.strategy = feature.properties.strategy;
			let markerId = "measure-" + i
			el.id = markerId;

			$(el).on("evaluateVisibility", function() {

				var iconCategory = $(el).data('iconcategory')
				var strategyOfMarker = el.dataset.strategy
				var shouldShow = false;

				if($('#tab-measures :input[type="checkbox"]').prop('checked'))
				{
					if($('.category-group[data-category="' + iconCategory + '"]').find('input[type="checkbox"]').is(':checked'))
						shouldShow = true;
				}
				if($('#tab-strategies :input[type="checkbox"]').prop('checked'))
				{
					if($('.category-group[data-category="' + strategyOfMarker + '"]').find('input[type="checkbox"]').is(':checked'))
						shouldShow = true;
				}

				if (shouldShow)
					$(el).show();
				else
					$(el).hide();				
			})

			el.addEventListener('click', (e) => {
				e.stopPropagation();
				console.log("Clicking measure marker");
				// check which layer is active
				if($('#tab-strategies :input[type="checkbox"]').prop('checked'))
				{
					$("#tab-strategies").click();
					let sidebarEntry = document.getElementById("strategy-measure-entry-"  + i)
					scrollSidebarToEntry(sidebarEntry);		
				}
				if($('#tab-measures :input[type="checkbox"]').prop('checked'))
				{
					$("#tab-measures").click();
					let sidebarEntry = document.getElementById("measure-entry-" + i)
					scrollSidebarToEntry(sidebarEntry);		
				}
			});

			el.addEventListener('mouseover', function(e) {
				console.log("we hovered over a marker")
				window.cursorOnMarker = true;
				e.stopPropagation();
				//let sidebarEntry = document.getElementById("measure-entry-" + i)
				//sidebarEntry.dispatchEvent(new Event('mouseover'));

				//$('#measure-entry-' + i).dispatchEvent(new Event('mouseover'));

				// Use querySelectorAll to find both elements
				let elements = document.querySelectorAll('#measure-entry-' + i + ', #strategy-measure-entry-' + i);

				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.dispatchEvent(new Event('mouseover'));
				});
			});

			el.addEventListener('mouseout', function() {
				window.cursorOnMarker = false;
				let elements = document.querySelectorAll('#measure-entry-' + i + ', #strategy-measure-entry-' + i);

				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.dispatchEvent(new Event('mouseout'));
				});
			}); 

			// add marker to map
			$(el).hide();
			new maplibregl.Marker({element: el, anchor: 'bottom'})
				.setLngLat(feature.geometry.coordinates[0])
				.addTo(map);

			// add Sidebar entry
			let clone =  document.querySelector("#template").content.cloneNode(true);

			// Check if image exists
			let image_name = feature.properties.image;
			let file = await fetch(img_route + image_name)
			if (file.status === 404) {
				if (image_name != null) console.log('Image ' + image_name + ' not found.');
				clone.querySelector(".image-container").style.paddingBottom = 0;
				clone.querySelector(".image-container").style.height = 0;
			}
			else {
				clone.querySelector(".sidebar-image").src = img_route + image_name;
				//clone.querySelector(".banner").alt = feature.properties.image;
			}
			clone.querySelector(".headline").textContent = feature.properties.id + ": " + feature.properties.headline;
			//clone.querySelector(".cartlink").href = "www.example.com";
			clone.querySelector(".description").textContent = feature.properties.description;
			clone.querySelector(".sidebar-entry").id = "measure-entry-"  + i;

			clone.querySelector(".sidebar-entry").addEventListener('mouseover', function() {
				this.style.backgroundColor = 'rgb(240,248,255)';
				el.style.width = `80px`;
				el.style.height = `80px`;
				
			});
			clone.querySelector(".sidebar-entry").addEventListener('mouseout', function() {
				this.style.backgroundColor = '';
				el.style.width = `64px`;
				el.style.height = `64px`;
			}); 

			let bearing = Math.floor(Math.random() * 360);
			let zoom = 12.75 + Math.floor(Math.random() * 3); // 15.99 is the max zoom for the satellite map
			let pitch = 10 + Math.floor(Math.random() * 60);
			clone.querySelector(".sidebar-entry").addEventListener('click', function(event) {
				//don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
				event.stopPropagation();	
				let params = {
					bearing: bearing,
					center: feature.geometry.coordinates[0],
					zoom: zoom,
					pitch: pitch,
					speed: 0.5,
				}
				if($('#measure-' + i).is(':visible'))
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
			document.querySelector(`[data-category="${feature.properties.category}"]`).appendChild(clone);
			$(document.getElementById("measure-entry-" + i)).slideUp(0);
		}
}