# Northwell Research Site

Static HTML/CSS site that reads all content from an Excel workbook (`data.xlsx`). No build tools or local browser storage.
The Excel file is parsed in the browser using the SheetJS (`xlsx`) library loaded from a CDN.

## Structure
- `index.html`, `researchers.html`, `researcher.html`, `projects.html`, `project.html`, `publications.html` - public pages.
- `style.css` - shared styling.
- `data.js` - Excel loader and parsing helpers.
- `data.xlsx` - primary data source.
  - Includes sample rows with placeholder image URLs. Replace with your own URLs or data URIs.
- `presentations/` - PPTX files referenced in the `presentations` column.
- `images/` - uploaded researcher photos referenced in the `image` column.
- `local-editor/` - local-only content editor (ignored by Git; not published to GitHub Pages).

## GitHub Pages Hosting
1) Create a GitHub repo and add these files to the repo root.  
2) Commit and push to `main`.  
3) In GitHub: Settings -> Pages -> Source: Deploy from branch -> Branch: `main` -> Folder: `/` -> Save.  
4) Visit the published URL shown in the Pages settings.
5) Confirm `data.xlsx` is committed and opens at `https://<user>.github.io/<repo>/data.xlsx`.

Optional overrides:
- Define `window.DATA_XLSX_URL = 'https://...'` before loading `data.js`, or
- Add `<meta name="data-xlsx" content="data.xlsx">` to point at a custom Excel URL.

## Local Editor Workflow (not deployed)
1) Open `local-editor/editor.html` locally (double-click to open in a browser).
2) Edit Researchers, Projects, and Publications.
3) Upload PPTX files in the editor so slide previews are generated.
4) Export the ZIP (`site-content-YYYY-MM-DD.zip`).
5) Upload `data.xlsx` to repo root, PPTX files to `/presentations`, and images to `/images`.

Note: `local-editor/` is ignored in `.gitignore` so it will not be pushed to GitHub Pages.

## Excel Schema
Create `data.xlsx` with three sheets:

### Researchers (sheet name: `Researchers`)
Headers:
- `name`
- `title`
- `description`
- `image` (URL to the photo)
- `slug` (optional; auto-generated from name if omitted)

### Projects (sheet name: `Projects`)
Headers:
- `slug` (optional; auto-generated from title if omitted)
- `title`
- `summary`
- `cover` (auto-set from the first presentation preview)
- `leads` (pipe-delimited list)
- `details` (pipe-delimited list)
- `presentations` (pipe-delimited list of PPTX entries)

### Publications (sheet name: `Publications`)
Headers:
- `slug` (optional; auto-generated from title if omitted)
- `title`
- `url`
- `authors`
- `year`
- `project` (project slug)
- `researchers` (pipe-delimited researcher slugs)

Formatting rules:
- Use `|` to separate list items.
- Use `::` inside `leads` and `presentations` entries.
  - Leads example: `Diego::Senior AI Engineer::diego|Theofilos::Principal Investigator`
  - Presentations example: `Intro Deck::predict-overview.pptx::data:image/jpeg;base64,...|Q2 Update::predict-update.pptx::data:image/jpeg;base64,...`
