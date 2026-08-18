// ============================================================
// Code A-Z — build-ebooks.js
// Génère ressources/<slug>.html à partir de content/ebooks/*.json
// Usage : node scripts/build-ebooks.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EBOOKS_DIR = path.join(ROOT, 'content', 'ebooks');
const OUT_DIR = path.join(ROOT, 'ressources');
const SITE_URL = 'https://agnissanisaac.com';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function pageTemplate(ebook) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${ebook.title} — Ressources gratuites Code A-Z</title>
<meta name="description" content="${ebook.excerpt}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${ebook.title}">
<meta property="og:description" content="${ebook.excerpt}">
<meta property="og:url" content="${SITE_URL}/ressources/${ebook.slug}.html">
<link rel="canonical" href="${SITE_URL}/ressources/${ebook.slug}.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css">
<script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
<style>
  .resource-hero{ max-width:820px; margin:0 auto; padding:90px 32px 60px; text-align:center; }
  .resource-hero h1{ font-size:clamp(2.2rem,5vw,3.2rem); margin-top:16px; line-height:1.15; }
  .resource-hero p{ margin-top:20px; font-size:1.05rem; max-width:560px; margin-left:auto; margin-right:auto; }
  .back-link{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); text-decoration:none; margin-bottom:8px; }
  .back-link:hover{ color:var(--accent); }

  .resource-layout{ max-width:960px; margin:0 auto; padding:0 32px 100px; display:grid; grid-template-columns:0.85fr 1.15fr; gap:56px; align-items:start; }
  @media (max-width:800px){ .resource-layout{ grid-template-columns:1fr; } }

  .book-cover{
    background:#0B0B0C; border-radius:var(--radius-md); aspect-ratio:3/4;
    display:flex; flex-direction:column; justify-content:center; padding:36px;
    box-shadow:var(--shadow-lg);
  }
  .book-cover svg{ width:34px; margin-bottom:20px; }
  .book-cover .tag{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#E0454F; letter-spacing:1px; text-transform:uppercase; margin-bottom:14px; }
  .book-cover h3{ color:#EDEDEA; font-size:1.25rem; line-height:1.3; }

  .form-card{
    background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-md);
    padding:36px 34px; min-height:360px; display:flex; flex-direction:column;
  }
  .form-step{ display:none; flex-direction:column; gap:18px; flex:1; }
  .form-step.active{ display:flex; }
  .form-progress{ display:flex; gap:6px; margin-bottom:24px; }
  .form-progress span{ height:3px; flex:1; background:var(--line); border-radius:2px; overflow:hidden; }
  .form-progress span.done{ background:var(--accent); }

  .field label{ display:block; font-size:12.5px; color:var(--muted); margin-bottom:8px; }
  .field input{
    width:100%; background:var(--bg); border:1px solid var(--line); border-radius:var(--radius-sm);
    padding:14px 16px; font-family:'Inter',sans-serif; font-size:14px; color:var(--text);
  }
  .field input:focus{ outline:none; border-color:var(--accent); }
  .field-error{ font-size:12px; color:var(--accent); margin-top:6px; display:none; }
  .field-error.show{ display:block; }

  .choice-row{ display:flex; gap:10px; }
  .choice-btn{
    flex:1; padding:14px; border:1px solid var(--line); border-radius:var(--radius-sm);
    background:var(--bg); color:var(--text); font-size:13.5px; text-align:center; transition:all .2s ease;
  }
  .choice-btn.selected{ border-color:var(--accent); background:var(--surface-2); color:var(--accent); }

  .form-nav{ display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:20px; }
  .form-nav .btn-back{ font-size:13px; color:var(--muted); background:none; border:none; cursor:pointer; }

  .success-state{ display:none; flex-direction:column; align-items:center; text-align:center; gap:14px; flex:1; justify-content:center; }
  .success-state.active{ display:flex; }
  .success-state svg{ width:48px; height:48px; color:#3E7A4C; }
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
    <a href="../emploi/index.html">Emplois</a>
  </div>
  <button class="theme-toggle" id="themeToggle" aria-label="Changer de thème">
    <svg class="icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    <svg class="icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
  </button>
</nav>

<div class="resource-hero">
  <a href="../ressources.html" class="back-link">&larr; Toutes les ressources</a>
  <div class="eyebrow" style="justify-content:center;"><span class="dot"></span>Ressource gratuite · ${ebook.pages}</div>
  <h1>${ebook.title}</h1>
  <p>${ebook.excerpt}</p>
</div>

<div class="resource-layout">
  <div class="book-cover">
    <svg viewBox="0 0 100 100" fill="none"><path d="M15 20 L55 50 L15 80" stroke="#EDEDEA" stroke-width="9" stroke-linecap="square"/><path d="M30 30 L62 50 L30 70" stroke="#E0454F" stroke-width="7" stroke-linecap="square"/></svg>
    <div class="tag">Guide gratuit</div>
    <h3>${ebook.title}</h3>
  </div>

  <div class="form-card">
    <div class="form-progress">
      <span id="prog1" class="done"></span>
      <span id="prog2"></span>
      <span id="prog3"></span>
    </div>

    <form id="ebookForm">
      <div class="form-step active" data-step="1">
        <div class="field">
          <label for="fullname">Votre nom</label>
          <input type="text" id="fullname" required>
        </div>
        <div class="field">
          <label for="email">Votre email</label>
          <input type="email" id="email" required>
          <div class="field-error" id="emailError">Merci d'entrer une adresse email valide.</div>
        </div>
        <div class="form-nav">
          <span></span>
          <button type="button" class="btn btn-primary" id="toStep2">Suivant →</button>
        </div>
      </div>

      <div class="form-step" data-step="2">
        <div class="field">
          <label>Avez-vous déjà une entreprise ou une activité ?</label>
          <div class="choice-row" data-field="hasCompany">
            <button type="button" class="choice-btn">Oui</button>
            <button type="button" class="choice-btn">Non</button>
          </div>
        </div>
        <div class="field">
          <label>Avez-vous déjà un site web ?</label>
          <div class="choice-row" data-field="hasWebsite">
            <button type="button" class="choice-btn">Oui</button>
            <button type="button" class="choice-btn">Non</button>
          </div>
        </div>
        <div class="form-nav">
          <button type="button" class="btn-back" id="toStep1">← Retour</button>
          <button type="button" class="btn btn-primary" id="toStep3">Suivant →</button>
        </div>
      </div>

      <div class="form-step" data-step="3">
        <p style="font-size:14px; color:var(--muted); line-height:1.7;">Le guide vous sera envoyé automatiquement par email dans les prochaines minutes.</p>
        <div class="form-nav">
          <button type="button" class="btn-back" id="toStep2b">← Retour</button>
          <button type="submit" class="btn btn-primary" id="submitBtn">Recevoir mon ebook gratuitement</button>
        </div>
      </div>
    </form>

    <div class="success-state" id="successState">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
      <h3>C'est envoyé !</h3>
      <p style="font-size:13.5px; color:var(--muted);">Vérifiez votre boîte mail (et vos spams) dans quelques minutes.</p>
    </div>
  </div>
</div>

<footer>
  <div class="container footer-bottom">
    <span>&copy; 2026 Code A-Z. Tous droits réservés.</span>
    <a href="../index.html#contact">Discuter d'un projet →</a>
  </div>
</footer>

<script>
  const EBOOK_ID = ${JSON.stringify(ebook.slug)};

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

  const steps = document.querySelectorAll('.form-step');
  const progs = [document.getElementById('prog1'), document.getElementById('prog2'), document.getElementById('prog3')];
  const formData = { ebookId: EBOOK_ID, fullname:'', email:'', hasCompany:null, hasWebsite:null };

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('active', s.dataset.step == n));
    progs.forEach((p, i) => p.classList.toggle('done', i < n));
  }

  function isValidEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email);
  }

  document.getElementById('toStep2').addEventListener('click', () => {
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const errorEl = document.getElementById('emailError');
    if (!name || !isValidEmail(email)) {
      errorEl.classList.add('show');
      return;
    }
    errorEl.classList.remove('show');
    formData.fullname = name;
    formData.email = email;
    showStep(2);
  });

  document.getElementById('toStep1').addEventListener('click', () => showStep(1));
  document.getElementById('toStep2b').addEventListener('click', () => showStep(2));

  document.querySelectorAll('.choice-row').forEach(row => {
    row.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        formData[row.dataset.field] = btn.textContent.trim();
      });
    });
  });

  document.getElementById('toStep3').addEventListener('click', () => showStep(3));

  document.getElementById('ebookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur serveur');

      document.getElementById('ebookForm').style.display = 'none';
      document.getElementById('successState').classList.add('active');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Réessayer';
      alert("Une erreur est survenue. Réessayez, ou écrivez-moi directement à valenbouge@gmail.com.");
    }
  });
</script>

</body>
</html>
`;
}

function build() {
  if (!fs.existsSync(EBOOKS_DIR)) { console.log('Aucun dossier content/ebooks trouvé.'); return; }
  const files = fs.readdirSync(EBOOKS_DIR).filter(f => f.endsWith('.json'));
  const manifest = [];

  files.forEach(file => {
    const ebook = JSON.parse(fs.readFileSync(path.join(EBOOKS_DIR, file), 'utf-8'));
    const html = pageTemplate(ebook);
    fs.writeFileSync(path.join(OUT_DIR, `${ebook.slug}.html`), html, 'utf-8');
    manifest.push(ebook);
  });

  fs.writeFileSync(path.join(OUT_DIR, 'ebooks.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`${files.length} ebook(s) généré(s) dans /ressources`);
}

build();