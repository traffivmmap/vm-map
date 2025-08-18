import { CreateCategoryGroup } from "./createCategoryGroup.js";
import { filterBottlenecks } from "./filterBottlenecks.js";

export function addStrategies(map, data_bottlenecks, data_measures) {
		for (let i = 0; i < data_bottlenecks.features.length; i++) {
			let feature = data_bottlenecks.features[i];
			if(!feature.geometry.coordinates[0]) {
				console.log("Feature " + i + " had an invalid geometry. Not adding strategy-sidebar-entry.");
				continue;
			}
			if(!feature.properties.strategy) {
				console.log("Bottleneck " + i + " (" + feature.properties.pid + ") had an invalid strategy (" + feature.properties.strategy + "). Not adding strategy-sidebar-entry.");
				continue;
			}

			let strategy = feature.properties.strategy;

			let strat = CreateCategoryGroup(strategy)
			if(strat)
			{		
				strat.querySelector("#visibility-checkbox").addEventListener('click',  (event) => {
				event.stopPropagation();
				filterBottlenecks(map);
				}); 
				strat.querySelector("#visibility-checkbox").checked = false;
				// if (i == 0)
				//	strat.querySelector("#visibility-checkbox").checked = true;
			}
			console.log(strat);
			strat.querySelector(".category-group").id = "strategy-entry-" + i
			strat.querySelector("#category-text").textContent = "Strategie " + (strategy) ;
			document.querySelector("#strategies").append(strat);

			let entryCloneID = "Problemstelle-" + i;
			console.log("Copying DOM Elelent #" + entryCloneID)
			let clone = document.getElementById(entryCloneID).cloneNode(true)
			clone.id = "strategy-bottleneck-entry-"  + i

			console.log("appending " + clone + " to element strategy-entry-" + i)
			document.getElementById("strategy-entry-" + i).append(clone);

			document.getElementById("strategy-bottleneck-entry-"  + i).addEventListener('mouseover', function() {
				this.style.backgroundColor = 'rgb(240,248,255)';
				map.setFeatureState({source: 'source-problemstellen', id: i}, {hover: true});
				// make hover true
				
			});
			document.getElementById("strategy-bottleneck-entry-"  + i).addEventListener('mouseout', function() {
				this.style.backgroundColor = '';
				map.setFeatureState({source: 'source-problemstellen', id: i}, {hover: false});
				// make hover false
			});

			// When we click on the bottleneck-entry we fly to the bottleneck
			let bearing = 0;Math.floor(Math.random() * 360);
			let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
			let pitch = 10 + Math.floor(Math.random() * 35);
			document.getElementById("strategy-bottleneck-entry-"  + i).addEventListener('click', function() {
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


			for (let m = 0; m < data_measures.features.length; m++) {

				if(data_measures.features[m].properties.strategy)
				if(data_measures.features[m].properties.strategy == strategy)
				{
					let entryCloneID = "measure-entry-"  + m;
					console.log("strategy " + i + " contains measure " + m);
					console.log("Copying DOM Elelent #" + entryCloneID)
					let clone = document.getElementById(entryCloneID).cloneNode(true)
					clone.id = "strategy-measure-entry-"  + m

					console.log(clone);
					console.log("appending " + clone + " to element strategy-entry-" + i)
					document.getElementById("strategy-entry-" + i).append(clone);
					$(document.getElementById("strategy-measure-entry-"  + m)).slideUp(0);
					document.getElementById("strategy-measure-entry-"  + m).addEventListener('mouseover', function() {
						this.style.backgroundColor = 'rgb(240,248,255)';
						let marker = document.querySelector("#measure-" + m)
						marker.style.width = `54px`;
						marker.style.height = `80px`;	
						marker.style.filter = 'drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.3)) brightness(140%)';
						marker.style.zIndex = Math.floor((90-data_measures.features[m].geometry.coordinates[0][1])*2000)		
					});
					document.getElementById("strategy-measure-entry-"  + m).addEventListener('mouseout', function() {
						this.style.backgroundColor = '';
						let marker = document.querySelector("#measure-" + m)
						marker.style.width = `40px`;
						marker.style.height = `64px`;
						marker.style.filter = 'drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.3))';
						marker.style.zIndex = Math.floor((90-data_measures.features[m].geometry.coordinates[0][1])*1000)			
					});

					let bearing = 0; // Math.floor(Math.random() * 360);
					let zoom = 13.75 + Math.floor(Math.random() * 2); // 15.99 is the max zoom for the satellite map
					let pitch = 10 + Math.floor(Math.random() * 60);
					document.getElementById("strategy-measure-entry-"  + m).addEventListener('click', function() {
						let marker = document.querySelector("#measure-" + m)
						//don't propagate the click up to the category-elements (parents), because this would trigger the click event of the parent, leading to collapse of the group
						event.stopPropagation();	
						let params = {
							bearing: bearing,
							center: data_measures.features[m].geometry.coordinates[0],
							zoom: zoom,
							pitch: pitch,
							speed: 0.5,
						}
						if($('#measure-' + m).is(':visible'))
						{	
							
							
							console.log("I fly to point");
							map.flyTo(params)
						}
						else
						{
							console.log("I fly do NOT fly to point");
						}
			
					});

					// add hiding of the marker if the category-group is clicked:
					document.getElementById("strategy-entry-" + i).querySelector("#visibility-checkbox").addEventListener('click',  (event) => {
					event.stopPropagation();
					$(".maplibregl-marker").trigger("evaluateVisibility")
				}); 

				}	
			}
		}
        $("#tab-strategies > #visibility-checkbox").click();
	}