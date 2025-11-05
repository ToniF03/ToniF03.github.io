function loadSnippetDetails() {
    // Prevent duplicate execution
    if (window.snippetDetailsLoaded) return;
    window.snippetDetailsLoaded = true;
    
    // Extract snippet ID from URL
    const pathParts = location.pathname.split('/');
    const snippetId = pathParts.length >= 3 ? decodeURIComponent(pathParts[2]) : null;
    if (!snippetId) {
        document.querySelector("#content").innerHTML += "<p>Error: No snippet ID provided in URL.</p>";
        return;
    }
    // Fetch snippet data
    fetchSnippetData('codeSnippets.json', snippetId);
}

async function fetchSnippetData(file, snippetId) {
    const response = await fetch("/resources/" + file);
    if (response.ok) {
        var dataJS = await response.json();
        displaySnippetDetails(dataJS, snippetId);
    } else {
        console.error("Failed to fetch data:", response.status);
    }
}

function displaySnippetDetails(data, snippetId) {
    let snippet = null;
    // Convert snippetId to number if it's numeric
    const numeric = Number.parseInt(snippetId, 10);
    
    // Try to find by numeric id first, then by other fields
    if (!Number.isNaN(numeric)) {
        snippet = data.find?.(s => s.id === numeric);
    }
    
    // If not found by numeric id, try string matching
    if (!snippet) {
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