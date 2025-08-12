export function scrollSidebarToEntry(sidebarEntry){
		$('.tab-body').clearQueue()
		$('.sidebarEntry').clearQueue()
		// Slide down the entries, then scroll the sidebar to the correct position
		// keep track wether all entries have completed sliding open, before scrolling the sidebar
		var sidebarEntries = $(sidebarEntry).parent().children()
		var entriesCompleted = 0;
		sidebarEntries.slideDown(400 , () => {
			entriesCompleted++;					
			if (entriesCompleted === sidebarEntries.length) {
				$('.tab-body').animate({scrollTop: sidebarEntry.offsetTop + sidebarEntry.offsetParent.offsetTop - 64 - $('.sidebar').offset().top }, 1500);
			}
		});
	}