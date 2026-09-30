/* ============================================================
   Code A-Z — consent.js
   Un seul panneau pour les deux choix qui demandent votre accord :
     1. Mesure d'audience (Google Analytics)
     2. Assistante virtuelle IA (vos questions libres partent vers un service d'IA externe)
   - Rien n'est chargé chez Google tant que le visiteur n'a pas accepté la mesure d'audience.
   - « Tout refuser » est aussi simple et aussi visible que « Tout accepter ».
   - Les choix se changent à tout moment (lien « Gérer les cookies » en bas de page).
   - Mémorisé dans le navigateur (localStorage), 6 mois.
   - Les notifications et les formulaires gardent leur accord au moment utile
     (la loi l'exige : un accord précis pour chaque usage).
   API pour les autres scripts : window.CodeAZConsent.get() / .setAI(bool) / .open()
   ============================================================ */
(function () {
  'use strict';

  var GA_ID = 'G-NMGV53DTSL';
  var KEY = 'codeaz-consent';
  var MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // 6 mois
  var POLICY_URL = '/politique-cookies.html';

  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.date) return null;
      if (typeof data.analytics !== 'boolean' && typeof data.ai !== 'boolean') return null;
      if (Date.now() - data.date > MAX_AGE_MS) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveChoice(patch) {
    var cur = readChoice() || {};
    var next = { date: Date.now(), v: 2 };
    var a = 'analytics' in patch ? patch.analytics : cur.analytics;
    var i = 'ai' in patch ? patch.ai : cur.ai;
    if (typeof a === 'boolean') next.analytics = a;
    if (typeof i === 'boolean') next.ai = i;
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
    return next;
  }

  function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function deleteAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name.indexOf('_gat') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var banner = null;

  function closeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function announce(choice) {
    document.dispatchEvent(new CustomEvent('codeaz:consent-changed', { detail: { analytics: choice.analytics, ai: choice.ai } }));
  }

  function decide(analytics, ai, wasAccepted) {
    var choice = saveChoice({ analytics: analytics, ai: ai });
    closeBanner();
    if (analytics) {
      loadAnalytics();
    } else {
      deleteAnalyticsCookies();
      if (wasAccepted && window.__gaLoaded) location.reload(); // décharge le script déjà chargé
    }
    announce(choice);
  }

  function openBanner(userTriggered) {
    if (banner) return;
    var previous = readChoice() || {};
    var wasAccepted = previous.analytics === true;

    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.setAttribute('aria-describedby', 'cookieDesc');
    banner.innerHTML =
      '<h2 id="cookieTitle">Vos choix</h2>' +
      '<p id="cookieDesc">Deux fonctions du site demandent votre accord. Refuser ne limite l’accès à aucun contenu. ' +
      '<a href="' + POLICY_URL + '">En savoir plus</a></p>' +
      '<div class="cookie-options"' + (userTriggered === true ? '' : ' hidden') + '>' +
      '<label class="cookie-option"><input type="checkbox" name="analytics"' + (previous.analytics ? ' checked' : '') + '>' +
      '<span><strong>Mesure d’audience</strong><em>Google Analytics : cookies de statistiques, pour savoir quelles pages sont utiles. Aucun cookie publicitaire.</em></span></label>' +
      '<label class="cookie-option"><input type="checkbox" name="ai"' + (previous.ai ? ' checked' : '') + '>' +
      '<span><strong>Assistante virtuelle (IA)</strong><em>Vos questions libres sont envoyées à un service d’IA externe (Groq, États-Unis) pour y répondre. Sans cela, l’assistante répond avec la recherche du site.</em></span></label>' +
      '</div>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" data-cookie="refuse">Tout refuser</button>' +
      '<button type="button" class="btn btn-outline btn-sm" data-cookie="' + (userTriggered === true ? 'save' : 'custom') + '">' + (userTriggered === true ? 'Enregistrer' : 'Personnaliser') + '</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Tout accepter</button>' +
      '</div>';

    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var action = b.getAttribute('data-cookie');
      if (action === 'accept') return decide(true, true, wasAccepted);
      if (action === 'refuse') return decide(false, false, wasAccepted);
      if (action === 'custom') {                       // affiche les deux choix séparés
        banner.querySelector('.cookie-options').hidden = false;
        b.setAttribute('data-cookie', 'save'); b.textContent = 'Enregistrer';
        banner.querySelector('input[name="analytics"]').focus();
        return;
      }
      if (action === 'save') {
        decide(banner.querySelector('input[name="analytics"]').checked, banner.querySelector('input[name="ai"]').checked, wasAccepted);
      }
    });
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); banner.querySelector('[data-cookie="refuse"]').focus(); }
    });
    document.body.appendChild(banner);
    if (userTriggered === true) banner.querySelector('[data-cookie="refuse"]').focus({ preventScroll: true });
  }

  window.openCookieSettings = function () { openBanner(true); };
  window.CodeAZConsent = {
    get: function () { var c = readChoice() || {}; return { analytics: c.analytics, ai: c.ai }; },
    setAI: function (value) { var c = saveChoice({ ai: !!value }); announce(c); },
    open: function () { openBanner(true); }
  };

  function init() {
    var choice = readChoice();
    if (choice && choice.analytics === true) loadAnalytics();
    if (!choice || typeof choice.analytics !== 'boolean') openBanner();   // tant que la mesure d'audience n'a pas reçu de réponse

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); openBanner(true); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
