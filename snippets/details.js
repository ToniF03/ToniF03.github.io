function loadSnippetDetails() {
    // Extract snippet ID from URL
    const pathParts = location.pathname.split('/');
    const snippetId = pathParts.length >= 3 ? pathParts[2] : null;
    if (!snippetId) {
        document.querySelector("#content").innerHTML += "<p>Error: No snippet ID provided in URL.</p>";
        return;
    }
    // Fetch snippet data
    fetchSnippetData('snippets.json')
}

async function fetchSnippetData(file) {
    const response = await fetch("/resources/" + file);
    if (response.ok) {
        var dataJS = await response.json();
        displaySnippetDetails(dataJS, snippetId);
    } else {
        console.error("Failed to fetch data:", response.status);
    }
}

function displaySnippetDetails(data, snippetId) {
    const snippet = data[snippetId];
    if (!snippet) {
        document.querySelector("#content").innerHTML += "<p>Error: Snippet not found.</p>";
        return;
    }
    // Display snippet details
    document.querySelector("#content").innerHTML += `<h2>${snippet.title}</h2>`;
    document.querySelector("#content").innerHTML += `<pre><code>${snippet.code}</code></pre>`;
    document.querySelector("#content").innerHTML += `<p>${snippet.description}</p>`;
}

// Load snippet details when the script is executed
loadSnippetDetails();