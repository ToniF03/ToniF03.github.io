**Project Overview**
- **Description:** A static personal website that showcases projects, code snippets and documentation. Built as a lightweight single-page app with client-side routing and small utilities for embedding markdown and GitHub code snippets.
- **Purpose:** Hostable on GitHub Pages for a portfolio and project documentation.

**Quick Start**
- **Preview locally:** open `index.html` in your browser or run a simple static server. Example (PowerShell):

```powershell
# using Python
python -m http.server 8000
# or using node's http-server (if installed)
npx http-server -p 8000
```
- **Deploy:** push this repo to GitHub and enable GitHub Pages (branch `master` or `gh-pages`, depending on your settings).

**Usage Notes**
- **Markdown embedding:** The site includes a small markdown embed script. To display remote or local markdown inside any page, add an element with `data-markdown` and the URL to the file:

```html
<link rel="stylesheet" href="/markdown/markdown.css">
<script src="/markdown/markdown.js"></script>

<div data-markdown="/markdown/sample.md"></div>
```

- **Snippet details:** Snippet detail pages use `/snippets/details.html` together with `/snippets/details.js`. The script expects the snippet ID or slug to be part of the URL, e.g. `/snippets/1`.

**Project Structure (top-level)**
- **`index.html`** – main entry and router container
- **`landing.html`** – homepage section
- **`router.js`** – client-side router (handles SPA navigation)
- **`searchengine.js`** – search / snippet listing logic
- **`snippets/`** – snippet detail template and script (`details.html`, `details.js`)
- **`markdown/`** – markdown viewer and embed scripts + CSS (`markdown.js`, `markdown.css`)
- **`projects/`** – project pages (e.g., `calcify/content.html`)
- **`resources/`** – JSON data files and other static assets (`codeSnippets.json`, `projects.json`)
- **`search/`** – search page & assets
- **`styling/`** – CSS utilities and lightweight bootstrap

**Notes for maintainers / developers**
- The router injects HTML snippets into `#content` and then calls `reloadScripts()` to evaluate script tags in the injected content. Be careful to avoid duplicate side-effectful script executions (use guards like `window.fooLoaded`).
- Markdown rendering is intentionally small and simple. For advanced Markdown features (tables, GFM, footnotes) consider replacing `markdown.js` with a library such as `marked` or `markdown-it`.
- `resources/codeSnippets.json` holds snippet metadata. Each entry should include `id`, `title`, `link`, `description`, `tags`, and `language`.

**Contributing**
- Fork the repo, create a branch, make changes, and submit a pull request.
- Keep changes focused (style updates separate from feature changes).

**License**
- No license file included by default. Add a `LICENSE` file to explicitly set the project's license.

**Contact**
- Repo owner: `ToniF03` (GitHub)
