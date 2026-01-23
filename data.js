(() => {
  const XLSX_CDNS = [
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'
  ];
  let workbookPromise = null;

  function toSlug(value) {
    return (value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item';
  }

  function splitList(value) {
    return (value || '')
      .split('|')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function normalizeRow(row) {
    const normalized = {};
    Object.keys(row || {}).forEach(key => {
      const safeKey = String(key || '').toLowerCase().trim();
      normalized[safeKey] = String(row[key] ?? '').trim();
    });
    return normalized;
  }

  function pick(row, keys) {
    for (const key of keys) {
      if (row[key]) return row[key];
    }
    return '';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function ensureXlsx() {
    if (window.XLSX) return Promise.resolve();
    return loadScript(XLSX_CDNS[0])
      .catch(() => loadScript(XLSX_CDNS[1]))
      .then(() => {
        if (!window.XLSX) {
          throw new Error('XLSX library unavailable');
        }
      });
  }

  function resolveExcelUrls() {
    const metaUrl = document.querySelector('meta[name="data-xlsx"]')?.content;
    const configured = (window.DATA_XLSX_URL || metaUrl || 'data.xlsx').trim();
    const urls = new Set();
    if (configured) {
      urls.add(new URL(configured, window.location.href).toString());
    }
    urls.add(new URL('data.xlsx', window.location.href).toString());
    return Array.from(urls);
  }

  function loadWorkbook() {
    if (workbookPromise) return workbookPromise;

    workbookPromise = (async () => {
      await ensureXlsx();
      const urls = resolveExcelUrls();
      let lastError = null;

      for (const url of urls) {
        try {
          const response = await fetch(url, { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(`Failed to load ${url} (${response.status})`);
          }
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            throw new Error(`Unexpected HTML response for ${url}`);
          }
          const buffer = await response.arrayBuffer();
          window.SiteData = window.SiteData || {};
          window.SiteData._excelUrl = url;
          return XLSX.read(buffer, { type: 'array' });
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error('Failed to load data.xlsx');
    })();

    return workbookPromise;
  }

  function getSheetRows(sheetName) {
    return loadWorkbook().then(workbook => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return [];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
      return rows.map(normalizeRow);
    });
  }

  function parseLeads(value) {
    return splitList(value).map(entry => {
      const parts = entry.split('::').map(part => part.trim());
      return {
        name: parts[0] || '',
        title: parts[1] || '',
        slug: parts[2] || toSlug(parts[0] || '')
      };
    }).filter(lead => lead.name);
  }

  function parseSlides(value) {
    return splitList(value).map(entry => {
      const parts = entry.split('::').map(part => part.trim());
      return {
        title: parts[0] || '',
        image: parts[1] || '',
        caption: parts[2] || ''
      };
    }).filter(slide => slide.title);
  }

  function getResearchers() {
    return getSheetRows('Researchers').then(rows => rows.map(row => {
      const name = pick(row, ['name', 'full name', 'full_name']);
      return {
        name,
        title: pick(row, ['title', 'role']),
        description: pick(row, ['description', 'bio']),
        image: pick(row, ['image', 'image_url', 'photo', 'photo_url']),
        slug: pick(row, ['slug']) || toSlug(name)
      };
    }).filter(item => item.name));
  }

  function getProjects() {
    return getSheetRows('Projects').then(rows => rows.map(row => {
      const title = pick(row, ['title']);
      return {
        slug: pick(row, ['slug']) || toSlug(title),
        title,
        summary: pick(row, ['summary', 'description']),
        cover: pick(row, ['cover', 'cover_image', 'image', 'image_url']),
        leads: parseLeads(pick(row, ['leads', 'team'])),
        details: splitList(pick(row, ['details', 'highlights'])),
        slides: parseSlides(pick(row, ['slides', 'slide_list']))
      };
    }).filter(item => item.title));
  }

  function getProjectsForResearcher(slug) {
    if (!slug) return Promise.resolve([]);
    return getProjects().then(projects => projects.filter(project =>
      (project.leads || []).some(lead => lead.slug === slug)
    ));
  }

  function getProjectBySlug(slug) {
    return getProjects().then(list => list.find(item => item.slug === slug) || list[0] || null);
  }

  window.SiteData = {
    getResearchers,
    getProjects,
    getProjectsForResearcher,
    getProjectBySlug,
    toSlug
  };
})();
