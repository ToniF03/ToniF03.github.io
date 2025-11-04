function loadSnippetDetails() {
    // Extract snippet ID from URL
    const pathParts = location.pathname.split('/');
    const snippetId = pathParts.length >= 3 ? decodeURIComponent(pathParts[2]) : null;
    if (!snippetId) {
        document.querySelector("#content").innerHTML += "<p>Error: No snippet ID provided in URL.</p>";
        return;
    }
    // Fetch snippet data
    fetchData('codeSnippets.json', snippetId);
}

async function fetchData(file, snippetId) {
    const response = await fetch("/resources/" + file);
    if (response.ok) {
        var dataJS = await response.json();
        displaySnippetDetails(dataJS, snippetId);
        displaySnippetDetails(dataJS, snippetId);
    } else {
        console.error("Failed to fetch data:", response.status);
    }
}

function displaySnippetDetails(data, snippetId) {
    let snippet = null;
    // If the id is a number and exists as index
    const numeric = Number.parseInt(snippetId, 10);
    if (!Number.isNaN(numeric) && data[numeric]) {
        snippet = data[numeric];
    } else {
        // Try to find by id or slug field
        snippet = data.find?.(s => s.id === snippetId || s.slug === snippetId || s.title === snippetId);
    }
    if (!snippet) {
        document.querySelector("#content").innerHTML += "<p>Error: Snippet not found.</p>";
        return;
    }
    // Display snippet details
    document.querySelector("#snippet-title").textContent = snippet.title;
    document.querySelector("#snippet-description").textContent = snippet.description;
    const container = document.getElementById('code-preview-container');
    if (container) {
        // Clear previous embed if any
        container.innerHTML = "";
        const script = document.createElement('script');
        let embeddingUrl = "https://emgithub.com/embed-v2.js?target=" + encodeURIComponent(snippet?.link?.url || "");
        embeddingUrl += "&style=dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on";
        script.src = embeddingUrl;
        document.querySelector("#github-link").href = snippet?.link?.url;
        container.appendChild(script);
    }
}

// Load snippet details when the script is executed
loadSnippetDetails();