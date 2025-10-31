function linkToSection(element) {
    const elementId = element.id;
    navigator.clipboard.writeText(window.location.pathname + '#' + elementId);
    window.location.href = window.location.pathname + '#' + elementId;
}