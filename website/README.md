# Northwell Research Site

Static HTML/CSS site with an inline-data Researchers page and a simple admin panel that saves to your browser via `localStorage`. No build tools needed.

## Structure
- `index.html`, `researchers.html`, `projects.html`, `publications.html` – public pages.
- `admin.html` – admin UI (login: `admin` / `northwell`) to add/edit/delete researchers; saves to `localStorage` under `researchersData`.
- `style.css` – shared styling.
- `Theofilos.png` – sample image.

## GitHub Pages Hosting
1) Create a GitHub repo and add the contents of the `website/` folder to the repo root (or set `website/` as the Pages source).  
2) Commit and push to `main`.  
3) In GitHub: Settings → Pages → Source: Deploy from branch → Branch: `main` → Folder: `/` → Save.  
4) Visit the published URL (shown in the Pages settings). If you used `docs/` or kept files in `website/`, set that as the folder.

## Editing Data
- Researchers page reads from `localStorage` first; if none is stored, it falls back to the inline JSON block in `researchers.html`.
- Use `admin.html` to manage researchers; refresh `researchers.html` to see changes.
- To change defaults, edit the inline JSON script in `researchers.html`.
