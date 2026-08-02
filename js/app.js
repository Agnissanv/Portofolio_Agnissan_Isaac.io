// ============================================================
// Code A-Z — app.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Thème sombre / clair ---------- */
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

  // Compteur de projets
  const projectCountEl = document.getElementById('projectCount');
  if (projectCountEl && typeof PROJECTS !== 'undefined') projectCountEl.textContent = PROJECTS.length;

  /* ---------- Menu mobile ---------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') mobileMenu.classList.remove('open');
    });
  }

  /* ---------- Lien de nav actif au scroll ---------- */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Barres de compétences ---------- */
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.fill');
        fill.style.width = entry.target.dataset.width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillRows.forEach(row => skillObserver.observe(row));

  /* ---------- Portfolio : rendu + filtre + modale ---------- */
  const grid = document.getElementById('portfolioGrid');
  if (grid && typeof PROJECTS !== 'undefined') {

    grid.innerHTML = PROJECTS.map(p => `
      <article class="project-card" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-label="Voir le projet ${p.title}">
        <div class="thumb"><img src="${p.thumb}" alt="Aperçu — ${p.title}" loading="lazy"></div>
        <div class="body">
          <div class="cat">${p.categoryLabel}</div>
          <h4>${p.title}</h4>
          <p class="pitch">${p.pitch}</p>
        </div>
      </article>
    `).join('');

    // Filtres
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hide', !show);
          if (show) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = ''; }
        });
      });
    });

    // Modale
    const overlay = document.getElementById('modalOverlay');
    const modalBox = document.getElementById('modalBox');
    const modalClose = document.getElementById('modalClose');

    function openModal(id) {
      const p = PROJECTS.find(x => x.id === id);
      if (!p) return;
      modalBox.innerHTML = `
        <div class="modal-gallery">
          ${p.gallery.map(src => `<img src="${src}" alt="Capture — ${p.title}" loading="lazy">`).join('')}
        </div>
        <div class="modal-content">
          <div class="cat">${p.categoryLabel} · ${p.year}</div>
          <h3>${p.title}</h3>
          <p class="pitch">${p.pitch}</p>
          <p class="desc">${p.description}</p>
          <div class="modal-tech">${p.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>
          <div class="modal-actions">
            <a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary">${p.linkLabel} →</a>
          </div>
        </div>
      `;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) openModal(card.dataset.id);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.project-card');
      if (card) { e.preventDefault(); openModal(card.dataset.id); }
    });


    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab' && overlay.classList.contains('open')) {
        const focusable = overlay.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Formulaire de contact (Web3Forms) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours…';
      status.textContent = '';
      status.className = '';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const data = await res.json();
        if (data.success) {
          status.textContent = '✓ Message envoyé — je reviens vers vous sous 24h.';
          status.className = 'ok show';
          submitBtn.textContent = 'Envoyé ✓';
          submitBtn.classList.add('success');
          form.reset();
          setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.textContent = originalLabel;
          }, 3000);
        } else {
          throw new Error(data.message || 'Erreur');
        }
      } catch (err) {
        status.textContent = "Une erreur est survenue. Réessayez, ou écrivez-moi directement à valenbouge@gmail.com.";
        status.className = 'err show';
      } finally {
        submitBtn.disabled = false;
        if (!submitBtn.classList.contains('success')) submitBtn.textContent = originalLabel;
      }
    });
  }

});


/* ---------- Bouton retour en haut ---------- */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Retour en haut de page');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));