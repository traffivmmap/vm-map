export function filterBottlenecks(map)
{
    let filter = "no filter"
		if($('#tab-bottlenecks :input[type="checkbox"]').prop('checked'))
		{
			let key = $("#bottlenecks").find("input[type='checkbox']:checked").closest(".category-group").map(function() {return $(this).data("category");}).get();
			filter = ["any", ...key.map(situation => ["==", situation, ["get", "Situation"]])];
		}
		else
		if($('#tab-strategies :input[type="checkbox"]').prop('checked'))
		{
			let key = $("#strategies").find("input[type='checkbox']:checked").closest(".category-group").map(function() {return $(this).attr("data-category");}).get();
			filter = ["any", ...key.map(strategy => ["==", strategy, ["get", "strategy"]])];
		}
		else
		{
			filter = ["any", ["==", "NONE", ["get", "Situation"]]]
		}
		
		if(map.getLayer('layer-problemstellen-stroke'))
			map.setFilter(['layer-problemstellen-stroke'], filter);
		if(map.getLayer('layer-problemstellen-arrow-stroke'))
			map.setFilter(['layer-problemstellen-arrow-stroke'], filter);
		if(map.getLayer('layer-problemstellen-fill'))
			map.setFilter(['layer-problemstellen-fill'], filter);
		if(map.getLayer('layer-problemstellen-arrow-fill'))
			map.setFilter(['layer-problemstellen-arrow-fill'], filter);

}