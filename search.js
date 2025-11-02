function toggleFilterPanel(element) {
    const panel = document.getElementById('filter-panel');
    panel.classList.toggle('hide');
    element.querySelector('i').classList.toggle('fa-chevron-down');
    element.querySelector('i').classList.toggle('fa-chevron-up');
}