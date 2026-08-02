// ============================================================
// Code A-Z — app.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
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
      <article class="project-card" data-category="${p.category}" data-id="${p.id}">
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
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
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
          status.textContent = 'Message envoyé — je reviens vers vous sous 24h.';
          status.className = 'ok';
          form.reset();
        } else {
          throw new Error(data.message || 'Erreur');
        }
      } catch (err) {
        status.textContent = "Une erreur est survenue. Réessayez, ou écrivez-moi directement à valenbouge@gmail.com.";
        status.className = 'err';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

});
