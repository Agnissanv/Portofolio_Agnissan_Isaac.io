// ============================================================
// Code A-Z — build-blog.js
// Génère blog/<slug>.html à partir de content/posts/*.md
// Usage : node scripts/build-blog.js
// ============================================================

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUT_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://agnissanisaac.com';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

function formatDateFR(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function articleTemplate({ title, date, dateLabel, excerpt, cover, tags, contentHtml, readMin, slug }) {
  const tagsHtml = (tags || []).map(t => `<span class="chip">${t}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Blog Code A-Z</title>
<meta name="description" content="${excerpt}">
<meta name="author" content="Agnissan Isaac Valen">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${excerpt}">
<meta property="og:image" content="${SITE_URL}/${cover}">
<meta property="og:url" content="${SITE_URL}/blog/${slug}.html">
<meta property="article:published_time" content="${date}">
<link rel="canonical" href="${SITE_URL}/blog/${slug}.html">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": ${JSON.stringify(title)},
  "datePublished": "${date}",
  "author": { "@type": "Person", "name": "Agnissan Isaac" },
  "publisher": { "@type": "Organization", "name": "Code A-Z" }
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css">
<style>
  .article-header{ max-width:720px; margin:0 auto; padding:70px 32px 0; }
  .article-meta{ font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted-2); display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
  .article-header h1{ font-size:clamp(2rem,4.4vw,3.1rem); line-height:1.15; margin-bottom:18px; }
  .article-cover{ max-width:900px; margin:44px auto; padding:0 32px; }
  .article-cover img{ width:100%; border-radius:var(--radius-md); border:1px solid var(--line); aspect-ratio:16/9; object-fit:cover; }
  .article-body{ max-width:680px; margin:0 auto; padding:0 32px 100px; font-size:16px; line-height:1.85; color:var(--text); }
  .article-body h2{ margin-top:48px; margin-bottom:18px; font-size:1.6rem; }
  .article-body h3{ margin-top:36px; margin-bottom:14px; }
  .article-body p{ color:var(--text); font-weight:300; margin-bottom:20px; }
  .article-body ul, .article-body ol{ margin:0 0 20px 22px; color:var(--text); }
  .article-body li{ margin-bottom:8px; line-height:1.7; }
  .article-body a{ color:var(--accent); text-decoration-color:var(--line); }
  .article-tags{ display:flex; gap:8px; margin-top:40px; flex-wrap:wrap; }
  .back-link{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); text-decoration:none; margin-bottom:8px; }
  .back-link:hover{ color:var(--accent); }
</style>
</head>
<body>

<nav class="site-nav">
  <a href="../index.html#hero" class="logo">
    <svg viewBox="0 0 100 100" fill="none"><path d="M15 20 L55 50 L15 80" stroke="#181816" stroke-width="11" stroke-linecap="square"/><path d="M30 30 L62 50 L30 70" stroke="#C6303E" stroke-width="8" stroke-linecap="square"/></svg>
    <span class="logo-text">CODE <span class="a">A</span> Z</span>
  </a>
  <div class="nav-links">
    <a href="../index.html#about">À propos</a>
    <a href="../index.html#portfolio">Portfolio</a>
    <a href="../blog.html" class="active">Blog</a>
    <a href="../index.html#contact">Contact</a>
  </div>
</nav>

<article>
  <header class="article-header">
    <a href="../blog.html" class="back-link">&larr; Retour au blog</a>
    <div class="article-meta">
      <span>${dateLabel}</span><span>·</span><span>${readMin} min de lecture</span>
    </div>
    <h1>${title}</h1>
  </header>
  ${cover ? `<div class="article-cover"><img src="../${cover}" alt="${title}" loading="lazy"></div>` : ''}
  <div class="article-body">
    ${contentHtml}
    <div class="article-tags">${tagsHtml}</div>
  </div>
</article>

<footer>
  <div class="container footer-bottom">
    <span>&copy; 2026 Code A-Z. Tous droits réservés.</span>
    <a href="../index.html#contact">Discuter d'un projet →</a>
  </div>
</footer>

</body>
</html>
`;
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('Aucun dossier content/posts trouvé.');
    return;
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const manifest = [];

  files.forEach(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const contentHtml = md.render(content);
    const dateLabel = formatDateFR(data.date);
    const readMin = readingTime(content);

    const html = articleTemplate({
      title: data.title,
      date: data.date,
      dateLabel,
      excerpt: data.excerpt || '',
      cover: data.cover || '',
      tags: data.tags || [],
      contentHtml,
      readMin,
      slug
    });

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), html, 'utf-8');

    manifest.push({
      slug, title: data.title, date: data.date, dateLabel,
      excerpt: data.excerpt || '', cover: data.cover || '',
      tags: data.tags || [], readMin
    });
  });

  manifest.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`${files.length} article(s) généré(s) dans /blog`);
}

build();
