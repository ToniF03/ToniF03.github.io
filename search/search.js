function toggleFilterPanel(element) {
    const panel = document.getElementById('filter-panel');
    panel.classList.toggle('hide');
    element.querySelector('i').classList.toggle('fa-chevron-down');
    element.querySelector('i').classList.toggle('fa-chevron-up');
}

function onEnterTagsInput(object, event) {
    if (event.endsWith(' ')) {
        var tagArea = document.getElementById('tag-area');
        if (event.trim() !== '') {
            object.value = '';

            if (!filterTags.includes(event.trim().toLowerCase())) {
                tagArea.innerHTML += "<div class='pill-label pointer' onclick='removeTag(this)'>" + event.trim() + " <i class='mx-5 fa fa-times'></i></div>";
                filterTags.push(event.trim().toLowerCase());
                filterData(prevQuery);
            }
        }
    }
}

function removeTag(element) {
    var tagArea = document.getElementById('tag-area');
    var tagText = element.textContent.trim();
    filterTags = filterTags.filter(tag => tag !== tagText.toLowerCase());
    tagArea.removeChild(element);
    filterData(prevQuery);
}