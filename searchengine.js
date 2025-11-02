var data;
var dataJS
var prevQuery;
var prevFilterTags = [];
var prevFilterLanguages = [];
var page = 1;
var maxEntriesPerPage = 5;

var filteredData;

async function fetchData(file) {
    const response = await fetch("/resources/" + file);
    if (response.ok) {
        dataJS = await response.json();
        filteredData = dataJS;
        displayData(dataJS.slice(0, maxEntriesPerPage));
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
        updatePagination();
    }

    // Append router to handle navigation for newly added links
    resultArea.querySelectorAll("[data-link]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            navigateTo(link.href);
        });
    });
}

function changePage(newPage) {
    var totalPages = Math.ceil(filteredData.length / maxEntriesPerPage);
    newPage = Math.min(newPage, totalPages);
    if (newPage == -1)
        newPage = Math.max(page - 1, 1);

    console.log("current page:", page);
    console.log("Changing to page:", newPage);
    page = newPage;
    document.querySelector("#result-area").innerHTML = "";
    displayData(filteredData.slice((page - 1) * maxEntriesPerPage, page * maxEntriesPerPage));
}

function updatePagination() {
    var pagination = document.querySelector("#pagination");
    pagination.innerHTML = "";

    var totalPages = Math.ceil(filteredData.length / maxEntriesPerPage);

    var chevron = document.createElement("i");
    chevron.innerText = "";
    chevron.classList.add("pointer");
    chevron.classList.add("fa");
    chevron.classList.add("fa-chevron-left");
    chevron.classList.add("mx-5");
    chevron.onclick = (function () {
        return function () {
            changePage(-1);
        };
    })(i);
    pagination.appendChild(chevron);

    var pageLink;

    if (page > 3) {
        pageLink = document.createElement("a");
        pageLink.innerText = "1";
        pageLink.classList.add("pointer");
        pageLink.classList.add("mx-5");
        pageLink.onclick = (function (i) {
            return function () {
                changePage(1);
            };
        });
        pagination.appendChild(pageLink);

        if (page > 4) {
            pageLink = document.createElement("a");
            pageLink.innerText = "...";
            pageLink.classList.add("mx-5");
            pagination.appendChild(pageLink);
        }
    }

    for (var i = Math.max(page - 2, 1); i <= Math.min(page + (page == 1 ? 4 : page == 2 ? 3 : 2), totalPages); i++) {
        pageLink = document.createElement("a");
        pageLink.innerText = i;
        pageLink.classList.add("pointer");
        pageLink.classList.add("mx-5");
        if (i == page) {
            pageLink.classList.add("fw-bold");
            pageLink.classList.add("text-decoration-underline");
        }
        pageLink.onclick = (function (i) {
            return function () {
                changePage(i);
            };
        })(i);
        pagination.appendChild(pageLink);
    }

    if (page < totalPages - 3) {
        if (page < totalPages - 4) {
            pageLink = document.createElement("a");
            pageLink.innerText = "...";
            pageLink.classList.add("mx-5");
            pagination.appendChild(pageLink);
        }
        pageLink = document.createElement("a");
        pageLink.innerText = totalPages;
        pageLink.classList.add("pointer");
        pageLink.classList.add("mx-5");
        pageLink.onclick = (function (i) {
            return function () {
                changePage(totalPages);
            };
        });
        pagination.appendChild(pageLink);
    }

    chevron = document.createElement("i");
    chevron.innerText = "";
    chevron.classList.add("pointer");
    chevron.classList.add("fa");
    chevron.classList.add("fa-chevron-right");
    chevron.classList.add("mx-5");
    chevron.onclick = (function () {
        return function () {
            changePage(page + 1);
        };
    })(i);
    pagination.appendChild(chevron);
}

var filterTags = [];
var filterLanguages = [];

function filterData(e) {
    var resultArea = document.querySelector("#result-area");
    var results = [];
    var query = e || "";
    resultArea.innerHTML = "";

    var tagSearchQuery;
    var languageSearchQuery;

    if (query.startsWith("tag:") || filterTags.length > 0) {
        var splittedQuery = [];
        var joinedTags = "";

        if (query.startsWith("tag:")) {
            splittedQuery = query.split(' ', 2);
            joinedTags = splittedQuery[0].substring(4) + ',' + filterTags.join(',');

            query = splittedQuery[1];
        } else {
            joinedTags = filterTags.join(',');
        }

        if (joinedTags.endsWith(','))
            joinedTags = joinedTags.slice(0, -1);
        else if (joinedTags.startsWith(','))
            joinedTags = joinedTags.substring(1);

        tagSearchQuery = joinedTags.split(',');
    }
    else if (query.startsWith("language:")) {
        var splittedQuery = query.split(' ', 2);
        var joinedLanguages = splittedQuery[0].substring(9) + ',' + filterLanguages.join(',');

        if (joinedLanguages.endsWith(','))
            joinedLanguages = joinedLanguages.slice(0, -1);
        else if (joinedLanguages.startsWith(','))
            joinedLanguages = joinedLanguages.substring(1);

        languageSearchQuery = (splittedQuery[0].substring(9) + ',' + filterLanguages.join(',')).split(',');
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

    if (prevQuery != e || JSON.stringify(prevFilterTags) != JSON.stringify(filterTags) || JSON.stringify(prevFilterLanguages) != JSON.stringify(filterLanguages)) {
        dataJS.forEach(element => {
            var displayMatch = false;
            var tagMatch = true;
            var languageMatch = true;

            if (element["title"].toLowerCase().includes(query.toLowerCase()) || query == "")
                displayMatch = true;

            if (tagSearchQuery != undefined) {
                tagSearchQuery.forEach(tag => {
                    if (tagMatch)
                        tagMatch = element["tags"].map(v => v.toLowerCase()).includes(tag.toLowerCase());
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

        if (e != "" && e != undefined || filterTags.length > 0 || filterLanguages.length > 0)
            displayData(results);
        else
            displayData(dataJS);
        if (resultArea.innerHTML == "")
            resultArea.innerHTML = "<p class='text-center'>No results found</a>";
        prevQuery = query;
        prevFilterTags = [...filterTags];
        prevFilterLanguages = [...filterLanguages];
    }
}