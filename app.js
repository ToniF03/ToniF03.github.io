function linkToSection(element) {
    const elementId = element.id;
    navigator.clipboard.writeText(window.location.host + location.pathname + '#' + elementId);
    window.location.href = window.location.pathname + '#' + elementId;
}

function calculateAge() {
    document.getElementById('age').innerHTML = String(new Date(Date.now() - new Date(2003, 12, 10)).getUTCFullYear() - 1970);
}

function openInTab(url) {
    window.open(url, "_blank")
}

let onNavProjectsTab = false;
let onNavProjects = false;

function closeNavProjects(element) {
    const elementId = element.id;
    if (elementId === 'nav-projects-tab')
        onNavProjectsTab = false;
    else if (elementId === 'nav-projects')
        onNavProjects = false;

    if (!onNavProjectsTab && !onNavProjects)
        document.getElementById('nav-projects').style.display = 'none';
}

function openNavProjects(element) {
    const elementId = element.id;
    if (elementId === 'nav-projects-tab')
        onNavProjectsTab = true;
    else if (elementId === 'nav-projects')
        onNavProjects = true;

    if (onNavProjectsTab || onNavProjects)
        document.getElementById('nav-projects').style.display = 'block';
}