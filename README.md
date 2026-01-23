# Northwell Research Site

Static HTML/CSS site that reads all content from an Excel workbook (`data.xlsx`). No build tools or local browser storage.
The Excel file is parsed in the browser using the SheetJS (`xlsx`) library loaded from a CDN.

## Structure
- `index.html`, `researchers.html`, `researcher.html`, `projects.html`, `project.html`, `publications.html` - public pages.
- `admin.html` - Excel schema reference (no local edits).
- `style.css` - shared styling.
- `data.js` - Excel loader and parsing helpers.
- `data.xlsx` - primary data source.
  - Includes sample rows with placeholder image URLs. Replace with your own URLs or data URIs.

## GitHub Pages Hosting
1) Create a GitHub repo and add these files to the repo root.  
2) Commit and push to `main`.  
3) In GitHub: Settings -> Pages -> Source: Deploy from branch -> Branch: `main` -> Folder: `/` -> Save.  
4) Visit the published URL shown in the Pages settings.
5) Confirm `data.xlsx` is committed and opens at `https://<user>.github.io/<repo>/data.xlsx`.

Optional overrides:
- Define `window.DATA_XLSX_URL = 'https://...'` before loading `data.js`, or
- Add `<meta name="data-xlsx" content="data.xlsx">` to point at a custom Excel URL.

## Excel Schema
Create `data.xlsx` with two sheets:

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
- `cover` (URL to the project cover image)
- `leads` (pipe-delimited list)
- `details` (pipe-delimited list)
- `slides` (pipe-delimited list)

Formatting rules:
- Use `|` to separate list items.
- Use `::` inside `leads` and `slides` entries.
  - Leads example: `Diego::Senior AI Engineer::diego|Theofilos::Principal Investigator`
  - Slides example: `Slide Title::https://example.com/slide1.png::Optional caption|Another Slide::https://example.com/slide2.png`
