/* ============================================================
   Code A-Z — consent.js
   Gestion du consentement aux cookies de mesure d'audience.
   - Rien n'est chargé chez Google tant que le visiteur n'a pas cliqué sur « Accepter ».
   - Refuser est aussi simple qu'accepter ; le choix se change à tout moment
     (lien « Gérer les cookies » en bas de page, ou politique des cookies).
   - Le choix est mémorisé dans le navigateur (localStorage), 6 mois.
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
      if (!data || typeof data.analytics !== 'boolean' || !data.date) return null;
      if (Date.now() - data.date > MAX_AGE_MS) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveChoice(analytics) {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, date: Date.now() })); } catch (e) {}
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

  function decide(analytics, wasAccepted) {
    saveChoice(analytics);
    closeBanner();
    if (analytics) {
      loadAnalytics();
    } else {
      deleteAnalyticsCookies();
      if (wasAccepted && window.__gaLoaded) location.reload(); // décharge le script déjà chargé
    }
    document.dispatchEvent(new CustomEvent('codeaz:consent-changed', { detail: { analytics: analytics } }));
  }

  function openBanner(userTriggered) {
    if (banner) return;
    var previous = readChoice();
    var wasAccepted = !!(previous && previous.analytics);

    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.setAttribute('aria-describedby', 'cookieDesc');
    banner.innerHTML =
      '<h2 id="cookieTitle">Vos choix sur les cookies</h2>' +
      '<p id="cookieDesc">Ce site utilise, uniquement avec votre accord, un cookie de mesure d’audience (Google Analytics) ' +
      'pour comprendre quelles pages sont utiles. Aucun cookie publicitaire. Refuser ne limite l’accès à aucun contenu. ' +
      '<a href="' + POLICY_URL + '">En savoir plus</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-outline btn-sm" data-cookie="refuse">Tout refuser</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Accepter</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      decide(b.getAttribute('data-cookie') === 'accept', wasAccepted);
    });
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); banner.querySelector('[data-cookie="refuse"]').focus(); }
    });
    document.body.appendChild(banner);
    if (userTriggered === true) banner.querySelector('[data-cookie="refuse"]').focus({ preventScroll: true });
  }

  window.openCookieSettings = function () { openBanner(true); };

  function init() {
    var choice = readChoice();
    if (choice && choice.analytics) loadAnalytics();
    if (!choice) openBanner();

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); openBanner(true); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
