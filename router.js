async function navigateTo(url) {
    history.pushState(null, null, url);
    await router();
}

async function router() {
    const routes = [
        { path: "/", view: () => fetchContent("/landing.html") },
        { path: "/projects/", view: () => fetchContent("/search/search.html") },
        { path: "/projects/calcify/", view: () => fetchContent("/projects/calcify/content.html") },
        { path: "/projects/githubStatsDisplay/", view: () => fetchContent("/projects/githubStatsDisplay/index.html") },
        { path: "/snippets/", view: () => fetchContent("/search/search.html") }
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

    if (location.pathname == "/") {
        document.querySelector("#nav-home-tab").classList.add("active");
        calculateAge();
    }
    else if (location.pathname.startsWith("/projects/")) {
        document.querySelector("#nav-projects-tab").classList.add("active");
        fetchData("projects.json");
    }
    else if (location.pathname.startsWith("/snippets/")) {
        document.querySelector("#nav-snippets-tab").classList.add("active");
        fetchData("codeSnippets.json");
    }

    // If a hash is present (e.g., /#about-me), scroll to that section after content loads
    if (location.hash) {
        const targetId = location.hash.substring(1);
        // Try immediately, and again on next frame to ensure layout is ready
        const scrollToTarget = () => {
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        };
        scrollToTarget();
        requestAnimationFrame(scrollToTarget);
    }
}

async function fetchContent(file) {
    const res = await fetch(file);
    return await res.text();
}

function openAboutMe() {
    if (location.pathname !== "/")
        navigateTo("/#about-me");
    else
        document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' });
}

// Handle back/forward navigation
window.addEventListener("popstate", router);

// Intercept clicks on <a data-link> (also when clicking child elements like <i>)
document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("a[data-link]");
    if (!a) return;
    e.preventDefault();
    navigateTo(a.href);
});

// Initial load
router();
