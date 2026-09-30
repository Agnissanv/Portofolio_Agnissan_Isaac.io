// ============================================================
// Code A-Z — build-static.js
// Injecte, dans les pages dont la liste est affichée par JavaScript
// (portfolio, blog, ressources, emplois), une version statique <noscript>
// lisible par les moteurs de recherche, les agents IA et les navigateurs sans JS.
// Repère dans la page : <!--STATIC:nom--> ... <!--/STATIC:nom-->
// Usage : node scripts/build-static.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readJson(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8')); } catch { return []; }
}

function inject(file, name, html) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf-8');
  const re = new RegExp(`(<!--STATIC:${name}-->)[\\s\\S]*?(<!--/STATIC:${name}-->)`);
  if (!re.test(src)) { console.log(`Repère STATIC:${name} introuvable dans ${file}`); return; }
  const out = src.replace(re, (_, a, b) => `${a}\n${html}\n${b}`);
  if (out !== src) fs.writeFileSync(p, out, 'utf-8');
  console.log(`${file} : liste statique "${name}" mise à jour`);
}

// --- Portfolio ---
const PROJECTS = require(path.join(ROOT, 'js', 'projects-data.js'));
inject('index.html', 'projects', `<noscript>
${PROJECTS.map(p => `<article>
<h3>${esc(p.title)} — ${esc(p.categoryLabel)} (${esc(p.year)})</h3>
<p>${esc(p.pitch)}</p>
<p>${esc(p.description)}</p>
${p.tech && p.tech.length ? `<p>Technologies : ${p.tech.map(esc).join(', ')}.</p>` : ''}
${p.link ? `<p><a href="${esc(p.link)}">${esc(p.linkLabel || 'Voir le projet')}</a></p>` : ''}
</article>`).join('\n')}
</noscript>`);

// --- Blog ---
const posts = readJson('blog/posts.json');
inject('blog.html', 'posts', `<noscript>
<ul>
${posts.map(p => `<li><a href="blog/${esc(p.slug)}.html">${esc(p.title)}</a> — ${esc(p.dateLabel)}. ${esc(p.excerpt)}</li>`).join('\n')}
</ul>
</noscript>`);

// --- Ressources ---
const ebooks = readJson('ressources/ebooks.json');
inject('ressources.html', 'ebooks', `<noscript>
<ul>
${ebooks.map(e => `<li><a href="ressources/${esc(e.slug)}.html">${esc(e.title)}</a> (${esc(e.pages)}). ${esc(e.excerpt)}</li>`).join('\n')}
</ul>
</noscript>`);

// --- Emplois ---
const jobs = readJson('emploi/jobs.json');
inject('emploi/index.html', 'jobs', `<noscript>
<ul>
${jobs.map(j => `<li><a href="${esc(j.slug)}.html">${esc(j.title)}</a> — ${esc(j.status)}. ${esc(j.excerpt)} (${esc(j.type)} · ${esc(j.location)})</li>`).join('\n')}
</ul>
</noscript>`);

// --- Index des publications pour les notifications (lu par api/notify.js et scripts/send-push.js) ---
const notifyIndex = [];
posts.forEach(p => notifyIndex.push({ key: `post:${p.slug}`, title: 'Nouvel article sur Code A-Z', body: p.title, url: `/blog/${p.slug}.html` }));
jobs.forEach(j => notifyIndex.push({ key: `job:${j.slug}`, title: 'Nouveau poste chez Code A-Z', body: j.title, url: `/emploi/${j.slug}.html` }));
PROJECTS.forEach(p => notifyIndex.push({ key: `project:${p.id}`, title: 'Nouveau projet au portfolio', body: `${p.title} — ${p.categoryLabel}`, url: `/projet/${p.id}.html` }));
fs.writeFileSync(path.join(ROOT, 'notify-index.json'), JSON.stringify(notifyIndex, null, 2), 'utf-8');
console.log(`notify-index.json généré (${notifyIndex.length} élément(s))`);
