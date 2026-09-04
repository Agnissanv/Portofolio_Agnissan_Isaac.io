// ============================================================
// Code A-Z — build-jobs.js
// Génère emploi/<slug>.html à partir de content/jobs/*.json
// Usage : node scripts/build-jobs.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JOBS_DIR = path.join(ROOT, 'content', 'jobs');
const OUT_DIR = path.join(ROOT, 'emploi');
const SITE_URL = 'https://agnissanisaac.com';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function jobTemplate(job) {
  const faqHtml = job.faqGroups.map(group => `
        <div class="faq-group-label">${group.label}</div>
        <div class="faq-grid">
          ${group.items.map(item => `
          <div class="faq-item">
            <button class="faq-question" type="button">
              <h4>${item.q}</h4>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer"><p>${item.a}</p></div>
          </div>`).join('')}
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NMGV53DTSL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-NMGV53DTSL');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${job.title} — Emplois Code A-Z</title>
<meta name="description" content="${job.excerpt}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${job.title} — Code A-Z">
<meta property="og:description" content="${job.excerpt}">
<meta property="og:url" content="${SITE_URL}/emploi/${job.slug}.html">
<link rel="canonical" href="${SITE_URL}/emploi/${job.slug}.html">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": ${JSON.stringify(job.title)},
  "description": ${JSON.stringify(job.excerpt)},
  "employmentType": ${JSON.stringify(job.type)},
  "hiringOrganization": { "@type": "Organization", "name": "Code A-Z", "sameAs": "${SITE_URL}" },
  "jobLocationType": "TELECOMMUTE"
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css">
<script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
<script defer src="/_vercel/insights/script.js"></script>
<style>
  .job-header{ max-width:820px; margin:0 auto; padding:80px 32px 0; }
  .job-status{ display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#3E7A4C; margin-bottom:22px; letter-spacing:0.04em; }
  .job-status .pulse{ width:7px; height:7px; border-radius:50%; background:#3E7A4C; }
  .job-header h1{ font-size:clamp(2rem,4.4vw,3rem); margin-bottom:22px; }
  .job-meta{ display:flex; gap:28px; flex-wrap:wrap; font-size:13.5px; color:var(--muted); margin-bottom:6px; }
  .job-meta span{ display:flex; align-items:center; gap:8px; }
  .job-meta svg{ width:15px; height:15px; color:var(--accent); }

  .job-body{ max-width:720px; margin:56px auto 0; padding:0 32px; }
  .job-section{ margin-bottom:44px; }
  .job-section h2{ font-size:1.4rem; margin-bottom:16px; }
  .job-section p{ color:var(--text); font-size:15px; line-height:1.75; margin-bottom:16px; }
  .job-section ul{ display:flex; flex-direction:column; gap:12px; }
  .job-section li{ font-size:14.5px; color:var(--text); line-height:1.6; padding-left:22px; position:relative; }
  .job-section li::before{ content:'—'; position:absolute; left:0; color:var(--accent); }

  .job-footer-card{
    max-width:720px; margin:0 auto 90px; padding:0 32px;
  }
  .job-footer-inner{
    background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-md);
    padding:32px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
  }
  .job-footer-inner .claim-label{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; }
  .job-footer-inner .claim-value{ font-family:'Newsreader',serif; font-size:1.4rem; color:var(--text); }

  .faq-section{ max-width:760px; margin:0 auto; padding:0 32px 100px; }
  .faq-group-label{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:var(--muted-2); margin:40px 0 16px; }
  .faq-grid{ display:flex; flex-direction:column; gap:10px; }
  .faq-item{ background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-sm); overflow:hidden; }
  .faq-question{
    width:100%; background:none; border:none; text-align:left; padding:18px 20px;
    display:flex; align-items:center; justify-content:space-between; gap:16px;
  }
  .faq-question h4{ font-family:'Inter',sans-serif; font-weight:400; font-size:14.5px; color:var(--text); }
  .faq-icon{ color:var(--accent); font-size:18px; flex:none; transition:transform .3s ease; }
  .faq-item.open .faq-icon{ transform:rotate(45deg); }
  .faq-answer{ max-height:0; opacity:0; overflow:hidden; transition:all .3s ease; padding:0 20px; }
  .faq-item.open .faq-answer{ max-height:400px; opacity:1; padding:0 20px 20px; }
  .faq-answer p{ font-size:14px; color:var(--muted); line-height:1.65; }

  .back-link{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); text-decoration:none; margin-bottom:24px; }
  .back-link:hover{ color:var(--accent); }
</style>
</head>
<body>

<nav class="site-nav">
  <a href="../index.html#hero" class="logo">
    <img class="logo-light" src="../images/Code_A-Z_Logo-no-bg.png" alt="Code A-Z">
    <img class="logo-dark" src="../images/Code_A-Z_Logo-no-bg2.png" alt="Code A-Z">
  </a>
  <div class="nav-links">
    <a href="../index.html#about">À propos</a>
    <a href="../index.html#portfolio">Portfolio</a>
    <a href="../blog.html">Blog</a>
    <a href="../emploi/index.html" class="active">Emplois</a>
  </div>
  <button class="theme-toggle" id="themeToggle" aria-label="Changer de thème">
    <svg class="icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    <svg class="icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
  </button>
</nav>

<header class="job-header">
  <a href="index.html" class="back-link">&larr; Tous les postes</a>
  <div class="job-status"><span class="pulse"></span>${job.status}${job.sharedWith ? ` · Relayé avec ${job.sharedWith}` : ''}</div>
  <h1>${job.title}</h1>
  <div class="job-meta">
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>${job.type}</span>
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>${job.location}</span>
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l2-4h14l2 4"/></svg>${job.compensation}</span>
  </div>
</header>

<div class="job-body">
  <div class="job-section">
    <h2>La mission</h2>
    <p>${job.missionIntro}</p>
    <ul>${job.missionList.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>
  <div class="job-section">
    <h2>Le profil recherché</h2>
    <p>${job.profileIntro}</p>
    <ul>${job.profileList.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>
</div>

<div class="job-footer-card">
  <div class="job-footer-inner">
    <div>
      <div class="claim-label">Rémunération</div>
      <div class="claim-value">${job.compensationClaim}</div>
    </div>
    <a href="${job.applyLink}" target="_blank" rel="noopener" class="btn btn-primary">${job.applyLabel} →</a>
  </div>
</div>

<section class="faq-section">
  <h2 style="margin-bottom:8px;">Questions fréquentes</h2>
  ${faqHtml}
</section>

<footer>
  <div class="container footer-bottom">
    <span>&copy; 2026 Code A-Z. Tous droits réservés.</span>
    <a href="../index.html#contact">Une question ? Contactez-nous →</a>
  </div>
</footer>

<script>
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
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

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => item.classList.toggle('open'));
  });
</script>

</body>
</html>
`;
}

function build() {
  if (!fs.existsSync(JOBS_DIR)) { console.log('Aucun dossier content/jobs trouvé.'); return; }
  const files = fs.readdirSync(JOBS_DIR).filter(f => f.endsWith('.json'));
  const manifest = [];

  files.forEach(file => {
    const job = JSON.parse(fs.readFileSync(path.join(JOBS_DIR, file), 'utf-8'));
    const html = jobTemplate(job);
    fs.writeFileSync(path.join(OUT_DIR, `${job.slug}.html`), html, 'utf-8');
    manifest.push({
      slug: job.slug, title: job.title, status: job.status, type: job.type,
      location: job.location, compensation: job.compensation, excerpt: job.excerpt
    });
  });

  fs.writeFileSync(path.join(OUT_DIR, 'jobs.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`${files.length} poste(s) généré(s) dans /emploi`);
}

build();
