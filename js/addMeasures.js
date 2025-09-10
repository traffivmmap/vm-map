import { scrollSidebarToEntry } from "./scrollSidebarToEntry.js";
import { createOutlinedSVGText } from "./createOutlinedSVGText.js";
import { addLegendSymbol } from "./addLegendSymbol.js";



export async function addMeasures(map, data_measures, img_route, icon_route)
{   
    console.log("loading massnahmen");

		// parse json. Fill map with markers, and sidebar with entries.
		for (let i = 0; i < data_measures.features.length; i++) {
			let feature = data_measures.features[i];
			
			// Check if Icon exists
			let icon_name = feature.properties.category;
			let r = fetch(icon_route + icon_name + '.svg')
			if (r.status === 404) {
				console.log('Icon ' + icon_name + ' not found. Loading default icon for feature ' + i + '.');
				r = fetch(icon_route + 'default.svg')
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
				cat.addEventListener('mouseover', (event) => { cat.style.backgroundColor = '#fffeacff'; });
				cat.addEventListener('mouseout',  (event) => { cat.style.backgroundColor = ''; }); 
				
				cat.querySelector("#visibility-checkbox").addEventListener('click',  (event) => {
					event.stopPropagation();
					//$(".maplibregl-marker").trigger("togglevisibility", [feature.properties.category, event.target.checked])
					$(".maplibregl-marker").trigger("evaluateVisibility")
				}); 

				document.querySelector("#measures").append(catGroup);

				// Add symbol to the legend
				let legendSymbolMeasure = {
					text : feature.properties.category,
					symbolType: "image",
					imgSrc: icon_route + icon_name + '.svg',
					imageSize: 32,
					directInsert: true,
				}
				addLegendSymbol('#legend-measures', legendSymbolMeasure);
			}

			// create a DOM element for the marker
			const m = document.createElement('div');
			m.classList.add('marker');
			const wrapper = document.createElement('div');

			wrapper.classList.add('marker-wrapper');
			// wrapper.style.position = 'relative';
			wrapper.style.pointerEvents = 'none';

			m.appendChild(wrapper);

			
			
			
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
					text: feature.properties.label,
					strokeWidth: 2,
					strokeColor: '#ffffff',
					fill: '#2a2623',
					fontSize: 11,
					x: 0,
					y: 0
				})
			// txt.style.position = 'absolute';
			txt.style.left = '100%';
			txt.style.width = 'auto';
			//txt.style.background = 'white'
			txt.classList.add('marker_text_svg');

			let txtContainer = wrapper.appendChild(document.createElement('div'));
			txtContainer.style.position = 'absolute';
			txtContainer.style.left = '105%';
			txtContainer.style.top = '-5px';
			txtContainer.appendChild(txt);
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
        });

			m.style.zIndex = Math.floor((90-feature.geometry.coordinates[0][1])*1000)
			m.dataset.iconcategory = feature.properties.category;
			m.dataset.strategy = feature.properties.strategy;
			let markerId = "measure-" + i
			m.id = markerId;

			$(m).on("evaluateVisibility", function() {

				var iconCategory = $(m).data('iconcategory')
				var strategyOfMarker = m.dataset.strategy
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
					$(m).show();
				else
					$(m).hide();				
			})

			m.addEventListener('click', (e) => {
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

			m.addEventListener('mouseover', function(e) {
				console.log("we hovered over a marker")
				window.cursorOnMarker = true;
				e.stopPropagation();

				m.style.width = `54px`;
				m.style.height = `80px`;		
				m.style.zIndex = Math.floor((90-feature.geometry.coordinates[0][1])*2000)
				m.querySelector(".marker_svg").style.filter = 'drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.3)) brightness(140%)';

				// Use querySelectorAll to find both elements
				let elements = document.querySelectorAll('#measure-entry-' + i + ', #strategy-measure-entry-' + i);
				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.style.backgroundColor = '#fffeacff';
				});
			});

			m.addEventListener('mouseout', function() {
				window.cursorOnMarker = false;

				m.style.width = `40px`;
				m.style.height = `64px`;
				m.style.zIndex = Math.floor((90-feature.geometry.coordinates[0][1])*1000)
				m.querySelector(".marker_svg").style.filter = 'drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.3))';

				let elements = document.querySelectorAll('#measure-entry-' + i + ', #strategy-measure-entry-' + i);
				// Loop through the NodeList and dispatch the event for each element
				elements.forEach(function(element) {
					console.log(element.id)
					element.style.backgroundColor = '';
				});
			}); 

			// add marker to map
			$(m).hide();
			new maplibregl.Marker({element: m, anchor: 'bottom'})
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
			}
			clone.querySelector(".headline").textContent = feature.properties.id + ": " + feature.properties.headline;
			//clone.querySelector(".cartlink").href = "www.example.com";
			clone.querySelector(".description").textContent = feature.properties.description;
			clone.querySelector(".sidebar-entry").id = "measure-entry-"  + i;

			clone.querySelector(".sidebar-entry").addEventListener('mouseover', function() {
				// forward event to marker
				m.dispatchEvent(new Event('mouseover'));
			});
			clone.querySelector(".sidebar-entry").addEventListener('mouseout', function() {
				m.dispatchEvent(new Event('mouseout'));
			}); 

			let bearing = 0; //Math.floor(Math.random() * 360);
			let zoom = 12.75 + Math.floor(Math.random() * 3); // 15.99 is the max zoom for the satellite map
			let pitch = 10 + Math.floor(Math.random() * 60);
			clone.querySelector(".sidebar-entry").addEventListener('click', function(event) {
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