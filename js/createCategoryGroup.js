export function CreateCategoryGroup(keyAttribute)
{
    let catGroup = document.querySelector("#category-group-template").content.cloneNode(true);
    if(!document.querySelector(`[data-category="${keyAttribute}"]`)) {
        catGroup.querySelector("#category-text").textContent = keyAttribute;
        catGroup.querySelector(".category-group").dataset.category = keyAttribute;
        
        let cat = catGroup.querySelector(".category")
        cat.addEventListener('click',     (event) => { $(`[data-category="${keyAttribute}"]`).find('.sidebar-entry').slideToggle() });
        cat.addEventListener('mouseover', (event) => { cat.style.backgroundColor = '#fffeacff'; });
        cat.addEventListener('mouseout',  (event) => { cat.style.backgroundColor = ''; });
        console.log("Created a category Group")
        return catGroup;
    }
    else return null;
    
    
}