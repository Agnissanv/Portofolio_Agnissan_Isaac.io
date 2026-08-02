// ============================================================
// Code A-Z — build-sitemap.js
// Génère sitemap.xml à partir des pages statiques + articles + postes
// Usage : node scripts/build-sitemap.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://agnissanisaac.com';
const today = new Date().toISOString().split('T')[0];

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return []; }
}

function build() {
  const urls = [];

  // Pages statiques
  urls.push({ loc: `${SITE_URL}/index.html`, lastmod: today, priority: '1.0' });
  urls.push({ loc: `${SITE_URL}/blog.html`, lastmod: today, priority: '0.8' });
  urls.push({ loc: `${SITE_URL}/emploi/index.html`, lastmod: today, priority: '0.6' });
  urls.push({ loc: `${SITE_URL}/emploi/pourquoi-nous-rejoindre.html`, lastmod: today, priority: '0.5' });

  // Articles de blog
  const posts = readJsonSafe(path.join(ROOT, 'blog', 'posts.json'));
  posts.forEach(p => {
    urls.push({ loc: `${SITE_URL}/blog/${p.slug}.html`, lastmod: p.date, priority: '0.7' });
  });

  // Fiches de poste
  const jobs = readJsonSafe(path.join(ROOT, 'emploi', 'jobs.json'));
  jobs.forEach(j => {
    urls.push({ loc: `${SITE_URL}/emploi/${j.slug}.html`, lastmod: today, priority: '0.5' });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf-8');
  console.log(`sitemap.xml généré avec ${urls.length} URL(s)`);
}

build();