var data;
var dataJS
var prevQuery;

async function fetchData(file) {
    const response = await fetch("/resources/" + file);
    if (response.ok) {
        dataJS = await response.json();
        displayData(dataJS);
    } else {
        console.error("Failed to fetch data:", response.status);
    }
}

function displayData(_data) {
    var resultArea = document.querySelector("#result-area")

    for (let i = 0; i < Object.keys(_data).length; i++) {
        var htmlBody = "";

        // Support new schema: link: { url, target } with fallback to legacy url string field
        var linkObj = _data[i]["link"] || { url: _data[i]["url"], target: "_self" };

        htmlBody += "<div class=\"results\"><a href='" + linkObj.url + "' target='" + linkObj.target + "' " + (linkObj.target == "_blank" ? "" : "data-link") + "><h1>" + _data[i]["title"] + "</h1>" + "<p class=\"description\">" + _data[i]["description"] + "</p>";

        var tags = _data[i]["tags"]
        var languages = _data[i]["language"]

        if (Object.keys(tags).length > 0) {
            htmlBody += "<p>Tags:</p>";
            tags.forEach(element => {
                htmlBody += '<div class="pill-label">' + element + '</div>'
            });
        }

        if (Object.keys(languages).length > 0) {
            htmlBody += "<p>Languages:</p>";
            languages.forEach(element => {
                htmlBody += '<div class="pill-label">' + element + '</div>'
            });
        }

        htmlBody += "</a></div>";
        resultArea.innerHTML += htmlBody;
    }

    // Append router to handle navigation for newly added links
    resultArea.querySelectorAll("[data-link]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            navigateTo(link.href);
        });
    });
}

function filterData(e) {
    var resultArea = document.querySelector("#result-area");
    var results = [];
    var query = e;
    resultArea.innerHTML = "";

    var tagSearchQuery;
    var languageSearchQuery;

    if (query.startsWith("tag:")) {
        var splittedQuery = query.split(' ', 2);
        tagSearchQuery = splittedQuery[0].substring(4).split(',');
        query = splittedQuery[1];
    }
    else if (query.startsWith("language:")) {
        var splittedQuery = query.split(' ', 2);
        languageSearchQuery = splittedQuery[0].substring(9).split(',');
        query = splittedQuery[1];
    }
    
    if (query == undefined)
        query = "";

    if (query.startsWith("language:")) {
        var splittedQuery = query.split(' ', 2);
        languageSearchQuery = splittedQuery[0].substring(9).split(',');
        query = splittedQuery[1];
    }
    else if (query.startsWith("tag:")) {
        var splittedQuery = query.split(' ', 2);
        tagSearchQuery = splittedQuery[0].substring(4).split(',');
        query = splittedQuery[1];
    }

    if (query == undefined)
        query = "";

    if (prevQuery != e) {
        dataJS.forEach(element => {
            var displayMatch = false;
            var tagMatch = true;
            var languageMatch = true;

            if (element["title"].toLowerCase().includes(query.toLowerCase()) || query == "")
                displayMatch = true;

            if (tagSearchQuery != undefined) {
                tagSearchQuery.forEach(tag => {
                    if (tagMatch)
                        tagMatch = element["tags"].includes(tag.substring(0, 1).toUpperCase() + tag.substring(1).toLowerCase());
                });
            }

            if (languageSearchQuery != undefined) {
                languageSearchQuery.forEach(language => {
                    if (languageMatch)
                        languageMatch = element["language"].includes(language);
                });
            }

            if (displayMatch && tagMatch && languageMatch) {
                results.push(element)
            }
        });
        if (e != "" && e != undefined)
            displayData(results);
        else
            displayData(dataJS);
        if (resultArea.innerHTML == "")
            resultArea.innerHTML = "<p class='text-center'>No results found</a>";
        prevQuery = query;
    }
}