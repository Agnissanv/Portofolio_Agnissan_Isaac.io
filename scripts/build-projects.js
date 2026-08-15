// ============================================================
// Code A-Z — build-projects.js
// Génère projet/<id>.html — pages "pont" avec meta données
// personnalisées par projet, pour un aperçu de partage correct.
// Usage : node scripts/build-projects.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'projet');
const SITE_URL = 'https://agnissanisaac.com';
const PROJECTS = require(path.join(ROOT, 'js', 'projects-data.js'));

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function pageTemplate(p) {
  const image = p.gallery && p.gallery[0] ? p.gallery[0] : p.thumb;
  const target = `../index.html#projet-${p.id}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=${target}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title} — Portfolio Code A-Z</title>
<meta name="description" content="${p.pitch}">
<meta name="robots" content="noindex, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title} — Code A-Z">
<meta property="og:description" content="${p.pitch}">
<meta property="og:image" content="${SITE_URL}/${image}">
<meta property="og:url" content="${SITE_URL}/projet/${p.id}.html">
<link rel="canonical" href="${SITE_URL}/projet/${p.id}.html">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>Redirection vers <a href="${target}">${p.title}</a>…</p>
</body>
</html>
`;
}

function build() {
  PROJECTS.forEach(p => {
    fs.writeFileSync(path.join(OUT_DIR, `${p.id}.html`), pageTemplate(p), 'utf-8');
  });
  console.log(`${PROJECTS.length} page(s) projet générée(s) dans /projet`);
}

build();