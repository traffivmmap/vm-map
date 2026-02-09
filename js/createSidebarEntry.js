/**
 * Creates a sidebar entry.
 * Basic functionality includes: 
 * Flying to a point on the map when clicked
 * Loading a picture if it exists
 * @param {maplibre.Map} map
 * @param {Array<number>} fly_to_point
 * @param {string} img_route
 */

export function createSidebarEntry(entryId, img_route, img_name, label, headline, description) {
		let clone = document.querySelector("#template").content.cloneNode(true);
		clone.querySelector(".sidebar-entry").id = entryId;
		// Check if image exists
		if (img_name) {
			const img = clone.querySelector(".sidebar-image");
			img.onload = () => {
				// display the image container if the image loads successfully
				clone.querySelector(".image-container").style.display = "block";
			};
			img.src = img_route + img_name;
		}

		// textual content
		clone.querySelector(".headline").textContent = label + ": " + headline;
		clone.querySelector(".description").textContent = description;
		return clone;
}