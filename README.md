# Northwell Research Site

Static HTML/CSS site with a CSV-driven Researchers page. No build tools needed.

## Structure
- `index.html`, `researchers.html`, `projects.html`, `publications.html` - public pages.
- `admin.html` - CSV administration notes (no local browser storage).
- `style.css` - shared styling.
- `researchers.csv` - primary data source for Researchers.
- `projects.csv` - primary data source for Projects.

## GitHub Pages Hosting
1) Create a GitHub repo and add these files to the repo root.  
2) Commit and push to `main`.  
3) In GitHub: Settings → Pages → Source: Deploy from branch → Branch: `main` → Folder: `/` → Save.  
4) Visit the published URL (shown in the Pages settings).

## Editing Data
- The Researchers page reads from `researchers.csv` by default.
- Update `researchers.csv` in the repo to change the list. Required headers: `name,title,description,slug`.
- You can also set the CSV URL in `researchers.html` and `researcher.html` if you host the CSV elsewhere.

## Projects Data
- Projects are loaded from `projects.csv`.
- Required headers: `slug,title,summary,leads,details,slides`.
- Use `|` to separate list items, and `::` to split lead name/title or slide title/caption.
  - Example leads: `Diego::Senior AI Engineer|Theofilos::Principal Investigator`
  - Example slides: `Slide Title::Optional caption|Another slide`
