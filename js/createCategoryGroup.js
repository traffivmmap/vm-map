export function CreateCategoryGroup(keyAttribute) {
    let catGroup = document.querySelector("#category-group-template").content.cloneNode(true);
    if (!document.querySelector(`[data-category="${keyAttribute}"]`)) {
        catGroup.querySelector("#category-text").textContent = keyAttribute;
        catGroup.querySelector(".category-group").dataset.category = keyAttribute;
        // make the entries under this category toggleable by clicking on the category name
        let cat = catGroup.querySelector(".category")
        cat.addEventListener('click', (event) => { $(`[data-category="${keyAttribute}"]`).find('.sidebar-entry').slideToggle() });
        // whenever we check the checkbox of a categoy group, we set the checkbox of the tab it sits in to true. We use the change event
        $(cat.querySelector("#visibility-checkbox")).on('change', (event) => {
            event.stopPropagation();
            if (event.target.checked) {
                // let tab = document.querySelector(".tab.active");
                let tab = $('#tab-' + $(event.target).closest(".tab-body").attr("id"))[0];
                if (tab) {
                    // check it using jquery syntax to trigger the change event of the tab checkbox, which will make sure that the change is propagated to all other category groups in the same tab
                    let tabCheckbox = tab.querySelector("#visibility-checkbox");
                    if (!tabCheckbox.checked) {
                        $(tabCheckbox).prop('checked', true);
                        $(tabCheckbox).trigger('change');
                    }
                }
            }
            // if the checkbox is unchecked, check if there are no other checkboxes in the same tab that are checked, if so, uncheck the checkbox of the tab as well
            // the checkboxes are inside the siblings of the current category group
            else {
                let siblingCheckboxes = $(`[data-category="${keyAttribute}"]`).siblings().find("#visibility-checkbox");
                let anyChecked = false;
                siblingCheckboxes.each(function () {
                    if (this.checked) {
                        anyChecked = true;
                        return false; // break the loop
                    }
                });
                if (!anyChecked) {
                    let tab = $('#tab-' + $(event.target).closest(".tab-body").attr("id"))[0];
                    if (tab) {
                        let tabCheckbox = tab.querySelector("#visibility-checkbox");
                        // if it's not yet unchecked, uncheck it and trigger the change event
                        if (tabCheckbox.checked) {
                            console.log("A category group was unchecked. ("+ keyAttribute +") No other checked category groups have been found. Unchecking the tab.");
                            $(tabCheckbox).prop('checked', false);
                            
                            $(tabCheckbox).trigger('change');
                        }
                    }
                }
            }
        });
        $(cat.querySelector("#visibility-checkbox")).on('click', (event) => {
            event.stopPropagation();
        });
        return catGroup;
    }
    else return null;
}