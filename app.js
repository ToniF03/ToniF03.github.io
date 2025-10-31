function linkToSection(element) {
    const elementId = element.id;
    navigator.clipboard.writeText(window.location.pathname + '#' + elementId);
    window.location.href = window.location.pathname + '#' + elementId;
}

function calculateAge() {
    document.getElementById('age').innerHTML = String(new Date(Date.now() - new Date(2003, 12, 10)).getUTCFullYear() - 1970);
}