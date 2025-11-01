async function navigateTo(url) {
    history.pushState(null, null, url);
    await router();
}

async function router() {
    const routes = [
        { path: "/", view: () => fetchContent("landing.html") },
        { path: "/projects/calcify/", view: () => fetchContent("index.html") },
        { path: "/projects/githubStatsDisplay/", view: () => fetchContent("index.html") },
        { path: "/snippets/", view: () => fetchContent("index.html") }
    ];

    const match = routes.find(r => r.path === location.pathname);

    if (!match) {
        // Page not found → show 404
        document.querySelector("#content").innerHTML = '<h1>404</h1><h1>I do not know what you were looking for...<br>But I do not think it is here.<br>No worries, you are not lost. You can get back, <a href="/">here</a>.</h1>';
        return;
    }

    const html = await match.view();
    document.querySelector("#content").innerHTML = html;

    var allActiveTabs = document.querySelectorAll(".active");
    allActiveTabs.forEach(element => {
        element.classList.remove("active");
    });

    if (location.pathname == "/")
        document.querySelector("#nav-home-tab").classList.add("active");
    else if (location.pathname.startsWith("/projects/"))
        document.querySelector("#nav-projects-tab").classList.add("active");
    else if (location.pathname.startsWith("/snippets/"))
        document.querySelector("#nav-snippets-tab").classList.add("active");
}

async function fetchContent(file) {
    const res = await fetch(file);
    return await res.text();
}

// Handle back/forward navigation
window.addEventListener("popstate", router);

// Intercept clicks on <a data-link>
document.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

// Initial load
router();


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