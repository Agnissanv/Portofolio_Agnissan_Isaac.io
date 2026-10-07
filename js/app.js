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


  /* ---------- Carrousel du titre (services) ---------- */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const titleTexts = [
      'Un site web qui vous apporte des <em>clients</em>, pas seulement des visites.',
      'Une image de marque <em>forte</em>, que vos clients reconnaissent et retiennent.',
      'Une application <em>simple</em>, qui vous fait gagner du temps chaque jour.'
    ];
    let titleIndex = 0;
    setInterval(() => {
      heroTitle.classList.add('fading');
      setTimeout(() => {
        titleIndex = (titleIndex + 1) % titleTexts.length;
        heroTitle.innerHTML = titleTexts[titleIndex];
        heroTitle.classList.remove('fading');
      }, 400);
    }, 7000);
  }


  /* ---------- Carrousel de phrases (comptage par catégorie) ---------- */
  const stripEl = document.getElementById('stripCarousel');
  if (stripEl && typeof PROJECTS !== 'undefined') {
    const counts = { web: 0, design: 0, app: 0 };
    PROJECTS.forEach(p => { if (counts[p.category] !== undefined) counts[p.category]++; });

    const phrases = [
      `<b>${counts.web}</b> site${counts.web > 1 ? 's' : ''} web en vedette`,
      `<b>${counts.design}</b> univers créatif${counts.design > 1 ? 's' : ''} en vedette`,
      `<b>${counts.app}</b> application${counts.app > 1 ? 's' : ''} en vedette`
    ];

    let phraseIndex = 0;
    stripEl.innerHTML = phrases[0];
    stripEl.classList.add('active');

    setInterval(() => {
      stripEl.classList.remove('active');
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        stripEl.innerHTML = phrases[phraseIndex];
        stripEl.classList.add('active');
      }, 450);
    }, 5000);
  }

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



  /* ---------- Portfolio : rendu + filtre + modale ---------- */
  const grid = document.getElementById('portfolioGrid');
  if (grid && typeof PROJECTS !== 'undefined') {

    /* ---------- Lightbox (zoom image + navigation) ---------- */
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', "Visionneuse d'images");
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer l'image">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Image précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
      <img alt="">
      <button class="lightbox-nav lightbox-next" aria-label="Image suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
      <span class="lightbox-counter"></span>
    `;
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let lightboxImages = [];
    let lightboxIndex = 0;

    function renderLightboxImage() {
      const item = lightboxImages[lightboxIndex];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
      const multi = lightboxImages.length > 1;
      lightboxPrev.style.display = multi ? 'flex' : 'none';
      lightboxNext.style.display = multi ? 'flex' : 'none';
      lightboxCounter.style.display = multi ? 'block' : 'none';
    }
    function openLightbox(images, startIndex) {
      lightboxImages = images;
      lightboxIndex = startIndex;
      renderLightboxImage();
      lightbox.classList.add('open');
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
    }
    function showPrev() {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      renderLightboxImage();
    }
    function showNext() {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      renderLightboxImage();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Glissement tactile (swipe) pour mobile
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 50) return;
      diff > 0 ? showPrev() : showNext();
    }, { passive: true });

    grid.innerHTML = PROJECTS.map(p => `
      <article class="project-card" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-label="Voir le projet ${p.title}">
        <div class="thumb"><img src="${p.thumb}" alt="Aperçu du projet ${p.title} — ${p.categoryLabel}" loading="lazy" decoding="async"></div>
        <div class="body">
          <div class="cat">${p.categoryLabel}</div>
          <h4>${p.title}</h4>
          <p class="pitch">${p.pitch}</p>
        </div>
      </article>
    `).join('');

    // ---------- Filtres : type + secteur, « Voir plus », lien partageable ----------
    const PAGE_SIZE = 12;
    const cards = [...document.querySelectorAll('.project-card')];
    const projectById = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
    const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const state = { type: 'all', sector: null, shown: PAGE_SIZE };

    const sectorCount = {};
    PROJECTS.forEach(p => (p.sectors || []).forEach(s => { sectorCount[s] = (sectorCount[s] || 0) + 1; }));
    const families = (typeof SECTOR_FAMILIES !== 'undefined' ? SECTOR_FAMILIES : [])
      .map(f => ({ name: f.name, sectors: f.sectors.filter(s => sectorCount[s]) }))
      .filter(f => f.sectors.length);
    const sectorBySlug = {};
    families.forEach(f => f.sectors.forEach(s => { sectorBySlug[slug(s)] = s; }));

    const sectorBar = document.getElementById('sectorBar');
    const sectorPanel = document.getElementById('sectorPanel');
    const sectorToggle = document.getElementById('sectorToggle');
    const sectorActive = document.getElementById('sectorActive');
    const sectorFamilies = document.getElementById('sectorFamilies');
    const sectorSearch = document.getElementById('sectorSearch');
    const sectorNone = document.getElementById('sectorNone');
    const countEl = document.getElementById('portfolioCount');
    const moreWrap = document.getElementById('portfolioMore');
    const moreBtn = document.getElementById('portfolioMoreBtn');
    const emptyEl = document.getElementById('portfolioEmpty');
    const typeBtns = document.querySelectorAll('.filter-btn[data-filter]');

    // Le panneau de secteurs n'apparaît que s'il y a des secteurs renseignés
    if (families.length && sectorBar) {
      sectorBar.hidden = false;
      sectorFamilies.innerHTML = families.map(f => `
        <div class="sector-family" data-family="${norm(f.name)}">
          <h3>${f.name}</h3>
          <div class="sector-chips">${f.sectors.map(s => `<button type="button" class="sector-chip" data-sector="${slug(s)}" data-search="${norm(s + ' ' + f.name + ' ' + ((typeof SECTOR_ALIASES !== 'undefined' && SECTOR_ALIASES[s]) || ''))}" aria-pressed="false">${s} <span>${sectorCount[s]}</span></button>`).join('')}</div>
        </div>`).join('');
    }

    function setPanel(open) {
      sectorPanel.hidden = !open;
      sectorToggle.setAttribute('aria-expanded', String(open));
      if (open && matchMedia('(pointer:fine)').matches) sectorSearch.focus({ preventScroll: true });
    }

    function syncUrl() {
      const q = new URLSearchParams();
      if (state.type !== 'all') q.set('type', state.type);
      if (state.sector) q.set('secteur', slug(state.sector));
      const qs = q.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }

    function apply() {
      const matched = cards.filter(card => {
        const p = projectById[card.dataset.id];
        return (state.type === 'all' || p.category === state.type) &&
               (!state.sector || (p.sectors || []).includes(state.sector));
      });
      const matchedSet = new Set(matched);
      cards.forEach(card => {
        const idx = matched.indexOf(card);
        card.classList.toggle('hide', !matchedSet.has(card) || idx >= state.shown);
      });
      const remaining = matched.length - state.shown;
      moreWrap.hidden = remaining <= 0;
      if (remaining > 0) moreBtn.textContent = `Voir plus (${remaining} restant${remaining > 1 ? 's' : ''})`;
      emptyEl.hidden = matched.length > 0;
      countEl.textContent = `${matched.length} projet${matched.length > 1 ? 's' : ''}`;

      sectorActive.innerHTML = state.sector
        ? `<button type="button" class="sector-tag" aria-label="Retirer le filtre ${state.sector}">${state.sector} <span aria-hidden="true">&times;</span></button>` : '';
      sectorFamilies.querySelectorAll('.sector-chip').forEach(c => {
        const on = state.sector && c.dataset.sector === slug(state.sector);
        c.classList.toggle('active', !!on);
        c.setAttribute('aria-pressed', String(!!on));
      });
      typeBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === state.type));
      syncUrl();
    }

    typeBtns.forEach(btn => btn.addEventListener('click', () => {
      state.type = btn.dataset.filter; state.shown = PAGE_SIZE; apply();
    }));
    moreBtn.addEventListener('click', () => { state.shown += PAGE_SIZE; apply(); });
    sectorToggle.addEventListener('click', () => setPanel(sectorPanel.hidden));
    sectorActive.addEventListener('click', (e) => {
      if (e.target.closest('.sector-tag')) { state.sector = null; state.shown = PAGE_SIZE; apply(); }
    });
    sectorFamilies.addEventListener('click', (e) => {
      const chip = e.target.closest('.sector-chip');
      if (!chip) return;
      const s = sectorBySlug[chip.dataset.sector];
      state.sector = state.sector === s ? null : s;
      state.shown = PAGE_SIZE;
      setPanel(false);
      apply();
      sectorToggle.focus({ preventScroll: true });
    });
    sectorSearch.addEventListener('input', () => {
      const q = norm(sectorSearch.value.trim());
      let any = false;
      sectorFamilies.querySelectorAll('.sector-family').forEach(fam => {
        let famAny = false;
        fam.querySelectorAll('.sector-chip').forEach(chip => {
          const hit = !q || chip.dataset.search.includes(q);
          chip.hidden = !hit; famAny = famAny || hit;
        });
        fam.hidden = !famAny; any = any || famAny;
      });
      sectorNone.hidden = any;
    });
    sectorPanel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { setPanel(false); sectorToggle.focus(); }
    });

    // Lien partageable : ?type=web&secteur=restaurant
    const params = new URLSearchParams(location.search);
    if (['web', 'design', 'app'].includes(params.get('type'))) state.type = params.get('type');
    if (sectorBySlug[params.get('secteur')]) state.sector = sectorBySlug[params.get('secteur')];
    apply();
    if (params.get('type') || params.get('secteur')) {
      const goToPortfolio = () => document.getElementById('portfolio').scrollIntoView({ behavior: 'auto' });
      if (document.readyState === 'complete') setTimeout(goToPortfolio, 100);
      else window.addEventListener('load', () => setTimeout(goToPortfolio, 100), { once: true });
    }

    // Modale
    const overlay = document.getElementById('modalOverlay');
    const modalBox = document.getElementById('modalBox');
    const modalClose = document.getElementById('modalClose');

    function openModal(id) {
      const p = PROJECTS.find(x => x.id === id);
      if (!p) return;

      const shareUrl = `${location.origin}/projet/${p.id}.html`;
      const shareRowHtml = `
        <div class="share-row">
          <span class="share-label">Partager :</span>
          <a class="share-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" aria-label="Partager sur LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.85c0-1.63-.03-3.73-2.28-3.73-2.28 0-2.63 1.78-2.63 3.62V23h-4V8z"/></svg>
          </a>
          <a class="share-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(p.title + ' — ' + shareUrl)}" aria-label="Partager sur WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.1 9 9.6 7.7 9.4 7.2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
          </a>
          <a class="share-btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" aria-label="Partager sur Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
          </a>
          <a class="share-btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(shareUrl)}" aria-label="Partager sur X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.4 2H8.2l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.4L17.7 20z"/></svg>
          </a>
          <button class="share-btn" type="button" data-copy-url="${shareUrl}" aria-label="Copier le lien">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span class="copied-tip">Lien copié !</span>
          </button>
        </div>
      `;
      const techHtml = p.isCollection ? '' : `<div class="modal-tech">${p.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>`;
      let actionHtml;
      if (p.isCollection) {
        actionHtml = `<a href="#contact" class="btn btn-primary">Discuter d'un projet similaire →</a>`;
      } else if (p.isDownload) {
        const badgesHtml = p.trustBadges ? `
          <div class="trust-badges">
            ${p.trustBadges.map(b => `<span class="trust-badge">${b}</span>`).join('')}
          </div>` : '';
        actionHtml = `
          ${badgesHtml}
          <div class="modal-actions-row">
            <a href="${p.link}" download class="btn btn-primary">${p.linkLabel} →</a>
            ${p.downloadNote ? `<span class="download-note">${p.downloadNote}</span>` : ''}
          </div>
        `;
      } else {
        actionHtml = `<a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary">${p.linkLabel} →</a>`;
      }
      let galleryClass = 'modal-gallery';
      if (p.isCollection) galleryClass = 'modal-gallery grid-layout';
      else if (p.category === 'app') galleryClass = 'modal-gallery app-layout';
      modalBox.innerHTML = `
        <div class="${galleryClass}">
          ${p.gallery.map((src, i) => `<img src="${src}" alt="${(p.galleryAlts && p.galleryAlts[i]) || `${p.title} — ${p.categoryLabel} : image ${i + 1} sur ${p.gallery.length}`}" loading="lazy">`).join('')}
        </div>
        <div class="modal-content">
          <div class="cat">${p.categoryLabel} · ${p.year}</div>
          ${p.sectors && p.sectors.length ? `<p class="modal-sectors">Secteur : ${p.sectors.join(' · ')}</p>` : ''}
          <h3>${p.title}</h3>
          <p class="pitch">${p.pitch}</p>
          <p class="desc">${p.description}</p>
          ${techHtml}
          <div class="modal-actions">
            ${actionHtml}
            ${shareRowHtml}
          </div>
        </div>
      `;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeModal._lastFocus = document.activeElement;
    }
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    modalBox.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy-url]');
      if (copyBtn) {
        navigator.clipboard.writeText(copyBtn.dataset.copyUrl).then(() => {
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 1800);
        }).catch(err => console.error('Copie impossible', err));
      }
    });

    // Ouvrir automatiquement un projet si l'URL contient #projet-<id>
    if (location.hash.startsWith('#projet-')) {
      const targetId = location.hash.replace('#projet-', '');
      if (PROJECTS.some(x => x.id === targetId)) openModal(targetId);
    }
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) openModal(card.dataset.id);
    });

    modalBox.addEventListener('click', (e) => {
      if (e.target.closest('.modal-actions a[href="#contact"]')) {
        closeModal();
        return;
      }
      const clickedImg = e.target.closest('.modal-gallery img');
      if (clickedImg) {
        const galleryEl = clickedImg.closest('.modal-gallery');
        const allImgs = [...galleryEl.querySelectorAll('img')];
        const images = allImgs.map(img => ({ src: img.src, alt: img.alt }));
        const startIndex = allImgs.indexOf(clickedImg);
        openLightbox(images, startIndex);
      }
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

  /* ---------- Filtre des tarifs ---------- */
  const pricingBtns = document.querySelectorAll('[data-pricing]');
  pricingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pricingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.pricing;
      document.querySelectorAll('.pricing-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
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

});

/* ---------- FAQ ---------- */
document.querySelectorAll('.faq-entry').forEach(entry => {
  const q = entry.querySelector('.faq-entry-q');
  q.setAttribute('aria-expanded', 'false');
  q.addEventListener('click', () => {
    const open = entry.classList.toggle('open');
    q.setAttribute('aria-expanded', String(open));
  });
});

  /* ---------- Onglets contact (formulaire / réponse rapide) ---------- */
  const contactTabBtns = document.querySelectorAll('.contact-tab-btn');
  contactTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      contactTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.contact-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === btn.dataset.tab);
      });
    });
  });

  const quickWhatsappBtn = document.getElementById('quickWhatsappBtn');
  const quickMessage = document.getElementById('quickMessage');
  if (quickWhatsappBtn && quickMessage) {
    quickWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = quickMessage.value.trim() || "Bonjour, je souhaite discuter d'un projet avec Code A-Z.";
      window.open(`https://wa.me/2250546797258?text=${encodeURIComponent(text)}`, '_blank');
    });
  }