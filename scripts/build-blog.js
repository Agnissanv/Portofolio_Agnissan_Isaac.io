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

function slugifyHeading(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Ajoute un id à chaque <h2> et construit la table des matières
function processHeadings(html) {
  const toc = [];
  const withIds = html.replace(/<h2>(.*?)<\/h2>/g, (match, text) => {
    const plain = text.replace(/<[^>]+>/g, '');
    const id = slugifyHeading(plain);
    toc.push({ id, text: plain });
    return `<h2 id="${id}">${text}</h2>`;
  });
  return { html: withIds, toc };
}

function relatedPosts(current, all) {
  const others = all.filter(p => p.slug !== current.slug);
  const sameTag = others.filter(p => (p.tags || []).some(t => (current.tags || []).includes(t)));
  const pool = sameTag.length ? sameTag : others;
  return pool.slice(0, 3);
}

function articleTemplate({ post, contentHtml, toc, prev, next, related }) {
  const tagsHtml = (post.tags || []).map(t => `<span class="chip">${t}</span>`).join('');
  const shareUrl = `${SITE_URL}/blog/${post.slug}.html`;

  const tocHtml = toc.length ? `
    <nav class="toc" id="toc">
      <div class="toc-label">Sommaire</div>
      ${toc.map(item => `<a href="#${item.id}">${item.text}</a>`).join('')}
    </nav>` : '';

  const relatedHtml = related.length ? `
    <section class="related-section">
      <h2>À lire aussi</h2>
      <div class="related-grid">
        ${related.map(r => `
          <a href="${r.slug}.html" class="related-card">
            ${r.cover ? `<div class="cover"><img src="../${r.cover}" alt="${r.title}" loading="lazy"></div>` : ''}
            <div class="body">
              <div class="meta">${r.dateLabel}</div>
              <h3>${r.title}</h3>
            </div>
          </a>`).join('')}
      </div>
    </section>` : '';

  const prevNextHtml = (prev || next) ? `
    <nav class="prev-next">
      ${prev ? `<a href="${prev.slug}.html" class="pn-link pn-prev"><span class="pn-label">&larr; Article précédent</span><span class="pn-title">${prev.title}</span></a>` : '<span></span>'}
      ${next ? `<a href="${next.slug}.html" class="pn-link pn-next"><span class="pn-label">Article suivant &rarr;</span><span class="pn-title">${next.title}</span></a>` : '<span></span>'}
    </nav>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} — Blog Code A-Z</title>
<meta name="description" content="${post.excerpt}">
<meta name="author" content="Agnissan Isaac Valen">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.excerpt}">
<meta property="og:image" content="${SITE_URL}/${post.cover}">
<meta property="og:url" content="${shareUrl}">
<meta property="article:published_time" content="${post.date}">
<link rel="canonical" href="${shareUrl}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": ${JSON.stringify(post.title)},
  "datePublished": "${post.date}",
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

  .article-layout{ max-width:900px; margin:0 auto; padding:0 32px 40px; display:grid; grid-template-columns:1fr 200px; gap:56px; align-items:start; }
  @media (max-width:860px){ .article-layout{ grid-template-columns:1fr; } }

  .article-body{ font-size:16px; line-height:1.85; color:var(--text); max-width:680px; }
  .article-body h2{ margin-top:48px; margin-bottom:18px; font-size:1.6rem; scroll-margin-top:100px; }
  .article-body h3{ margin-top:36px; margin-bottom:14px; }
  .article-body p{ color:var(--text); font-weight:300; margin-bottom:20px; }
  .article-body ul, .article-body ol{ margin:0 0 20px 22px; color:var(--text); }
  .article-body li{ margin-bottom:8px; line-height:1.7; }
  .article-body a{ color:var(--accent); text-decoration-color:var(--line); }
  .article-tags{ display:flex; gap:8px; margin-top:40px; flex-wrap:wrap; }
  .back-link{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); text-decoration:none; margin-bottom:8px; }
  .back-link:hover{ color:var(--accent); }

  .toc{ position:sticky; top:100px; display:flex; flex-direction:column; gap:10px; }
  @media (max-width:860px){ .toc{ display:none; } }
  .toc-label{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--muted-2); margin-bottom:4px; }
  .toc a{ font-size:13px; color:var(--muted); text-decoration:none; line-height:1.5; border-left:2px solid var(--line); padding-left:12px; transition:all .2s ease; }
  .toc a:hover{ color:var(--text); border-color:var(--muted-2); }
  .toc a.active{ color:var(--accent); border-color:var(--accent); }

  .share-row{ display:flex; align-items:center; gap:10px; margin:36px 0; flex-wrap:wrap; }
  .share-label{ font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--muted-2); margin-right:2px; }
  .share-btn{
    width:36px; height:36px; border-radius:50%; border:1px solid var(--line); background:var(--surface);
    display:flex; align-items:center; justify-content:center; color:var(--muted); text-decoration:none;
    transition:all .2s ease; cursor:pointer; flex:none; position:relative;
  }
  .share-btn:hover{ border-color:var(--accent); color:var(--accent); }
  .share-btn svg{ width:16px; height:16px; }
  .share-btn .copied-tip{
    position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
    background:var(--text); color:var(--bg); font-family:'Inter',sans-serif; font-size:11px;
    padding:5px 10px; border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none;
    transition:opacity .2s ease;
  }
  .share-btn.copied .copied-tip{ opacity:1; }

  .related-section{ max-width:900px; margin:70px auto 0; padding:56px 32px 0; border-top:1px solid var(--line); }
  .related-section h2{ font-size:1.4rem; margin-bottom:28px; color:var(--text); }
  .related-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  @media (max-width:760px){ .related-grid{ grid-template-columns:1fr; } }
  .related-card{ text-decoration:none; display:block; }
  .related-card .cover{ aspect-ratio:16/10; border-radius:var(--radius-md); overflow:hidden; margin-bottom:14px; background:var(--line); }
  .related-card .cover img{ width:100%; height:100%; object-fit:cover; }
  .related-card .meta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted-2); margin-bottom:8px; }
  .related-card h3{ font-size:15px; color:var(--text); font-weight:500; line-height:1.4; }

  .prev-next{ max-width:900px; margin:0 auto; padding:44px 32px 90px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media (max-width:640px){ .prev-next{ grid-template-columns:1fr; } }
  .pn-link{ text-decoration:none; padding:20px 22px; border:1px solid var(--line); border-radius:var(--radius-md); display:flex; flex-direction:column; gap:8px; transition:border-color .2s ease; }
  .pn-link:hover{ border-color:var(--accent); }
  .pn-next{ text-align:right; }
  .pn-label{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted-2); }
  .pn-title{ font-size:14px; color:var(--text); line-height:1.4; }
  .reading-progress{
    position:fixed; top:0; left:0; height:3px; background:var(--accent);
    width:0%; z-index:200; transition:width .1s linear;
  }
</style>
</head>
<body>

<div class="reading-progress" id="readingProgress"></div>

<nav class="site-nav">
  <a href="../index.html#hero" class="logo">
    <img src="../images/Code_A-Z_Logo-no-bg.png" alt="Code A-Z">
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
      <span>${post.dateLabel}</span><span>·</span><span>${post.readMin} min de lecture</span>
    </div>
    <h1>${post.title}</h1>
  </header>
  ${post.cover ? `<div class="article-cover"><img src="../${post.cover}" alt="${post.title}" loading="lazy"></div>` : ''}

  <div class="article-layout">
    <div class="article-body">
      <div class="share-row">
        <span class="share-label">Partager :</span>
        <a class="share-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" aria-label="Partager sur LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.85c0-1.63-.03-3.73-2.28-3.73-2.28 0-2.63 1.78-2.63 3.62V23h-4V8z"/></svg>
        </a>
        <a class="share-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + shareUrl)}" aria-label="Partager sur WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.1 9 9.6 7.7 9.4 7.2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
        </a>
        <a class="share-btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" aria-label="Partager sur Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
        </a>
        <a class="share-btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}" aria-label="Partager sur X">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.4 2H8.2l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.4L17.7 20z"/></svg>
        </a>
        <a class="share-btn" target="_blank" rel="noopener" href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}" aria-label="Partager sur Telegram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 4.2 2.6 11.9c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5L19.6 7c.6-.4 1.1-.2.7.2l-9.6 8.7-.3 4.6c.5 0 .7-.2 1-.5l2.3-2.2 4.9 3.6c.9.5 1.5.2 1.8-.8L23 5.6c.4-1.3-.3-1.9-1-1.4z"/></svg>
        </a>
        <a class="share-btn" href="mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}" aria-label="Partager par email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>
        </a>
        <button class="share-btn" type="button" data-copy-url="${shareUrl}" aria-label="Copier le lien">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span class="copied-tip">Lien copié !</span>
        </button>
      </div>

      ${contentHtml}
      <div class="article-tags">${tagsHtml}</div>
    </div>
    ${tocHtml}
  </div>

  ${relatedHtml}
  ${prevNextHtml}
</article>

<footer>
  <div class="container footer-bottom">
    <span>&copy; 2026 Code A-Z. Tous droits réservés.</span>
    <a href="../index.html#contact">Discuter d'un projet →</a>
  </div>
</footer>

<script>
  const progressBar = document.getElementById('readingProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  });

  const copyBtn = document.querySelector('[data-copy-url]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copyUrl);
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 1800);
      } catch (err) {
        console.error('Copie impossible', err);
      }
    });
  }

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Retour en haut de page');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const headings = document.querySelectorAll('.article-body h2[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  if (headings.length && tocLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(h => spy.observe(h));
  }
</script>

</body>
</html>
`;
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) { console.log('Aucun dossier content/posts trouvé.'); return; }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  // 1ère passe : lire et parser tous les articles
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    return {
      slug, title: data.title, date: data.date, dateLabel: formatDateFR(data.date),
      excerpt: data.excerpt || '', cover: data.cover || '', tags: data.tags || [],
      readMin: readingTime(content), rawContent: content
    };
  });

  // Tri du plus récent au plus ancien
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 2ème passe : générer chaque page avec accès à tous les autres articles
  posts.forEach((post, index) => {
    const { html: contentHtml, toc } = processHeadings(md.render(post.rawContent));
    const prev = posts[index + 1] || null; // plus ancien
    const next = posts[index - 1] || null; // plus récent
    const related = relatedPosts(post, posts);

    const html = articleTemplate({ post, contentHtml, toc, prev, next, related });
    fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.html`), html, 'utf-8');
  });

  // Manifest pour blog.html (on retire rawContent, inutile côté client)
  const manifest = posts.map(({ rawContent, ...rest }) => rest);
  fs.writeFileSync(path.join(OUT_DIR, 'posts.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`${posts.length} article(s) généré(s) dans /blog`);
}

build();