/* ============================================================
   Code A-Z — push.js
   Notifications push web : « Recevoir les nouveautés ».
   Points d'entrée pour le visiteur (tous facultatifs, jamais de demande sans clic) :
     - cloche dans la barre de navigation
     - invitation discrète après 30 s de visite, ou à la fin d'un article
     - blocs [data-push-cta] placés dans les pages (fin d'article, blog, emplois, accueil)
     - bouton du pied de page (aussi utilisé pour se désabonner)
   Le navigateur demande ensuite lui-même l'autorisation.
   Si la clé publique ci-dessous est vide, ou si le navigateur ne sait pas faire
   (ex. Safari iPhone hors écran d'accueil), rien n'apparaît.
   ============================================================ */
(function () {
  'use strict';

  // Clé publique VAPID (générée avec « npm run vapid »). Elle n'est pas secrète.
  var VAPID_PUBLIC_KEY = 'BAPokjp_VO-h8r8-a5CAqWYAUc4nyMonLHZPZBHlAJJPqToy5ijH5Sced8N2VJ3IkBghKd52NjVr4P90UtjR0rY';

  if (!VAPID_PUBLIC_KEY) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;

  var INVITE_KEY = 'codeaz-push-invite';
  var INVITE_PAUSE_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours après un « Plus tard »
  var INVITE_DELAY_MS = 30000;

  var state = { ready: false, subscribed: false, reg: null, justSubscribed: false, busy: false };
  var footerBtn = null, footerStatus = null, bell = null, invite = null, inviteShown = false;

  /* ---------- utilitaires ---------- */
  function urlBase64ToUint8Array(b64) {
    var pad = '='.repeat((4 - (b64.length % 4)) % 4);
    var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function send(method, payload) {
    return fetch('/api/push-subscribe', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); });
  }
  function denied() { return Notification.permission === 'denied'; }
  function invitePaused() {
    try {
      var t = parseInt(localStorage.getItem(INVITE_KEY), 10);
      return !!t && Date.now() - t < INVITE_PAUSE_MS;
    } catch (e) { return false; }
  }
  function pauseInvite() { try { localStorage.setItem(INVITE_KEY, String(Date.now())); } catch (e) {} }
  function say(msg) { if (footerStatus) footerStatus.textContent = msg; }

  /* ---------- abonnement ---------- */
  function subscribe() {
    if (!state.reg || state.busy) return Promise.resolve();
    state.busy = true; refresh();
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') return;
      return state.reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      }).then(function (sub) {
        return send('POST', sub.toJSON()).then(function () {
          state.subscribed = true; state.justSubscribed = true;
          say('Notifications activées. Vous serez prévenu à chaque nouveauté.');
        }).catch(function (e) { return sub.unsubscribe().then(function () { throw e; }); });
      });
    }).catch(function () {
      say('Une erreur est survenue, réessayez plus tard.');
    }).then(function () { state.busy = false; refresh(); });
  }

  function unsubscribe() {
    if (!state.reg || state.busy) return Promise.resolve();
    state.busy = true; refresh();
    return state.reg.pushManager.getSubscription().then(function (sub) {
      if (!sub) return;
      var endpoint = sub.endpoint;
      return sub.unsubscribe().then(function () { return send('DELETE', { endpoint: endpoint }); });
    }).then(function () {
      state.subscribed = false; state.justSubscribed = false;
      say('Notifications désactivées.');
    }).catch(function () {
      say('Une erreur est survenue, réessayez plus tard.');
    }).then(function () { state.busy = false; refresh(); });
  }

  /* ---------- interface ---------- */
  function refresh() {
    var canAsk = state.ready && !state.subscribed && !denied();

    document.querySelectorAll('[data-push-cta]').forEach(function (cta) {
      var done = cta.querySelector('.push-cta-done');
      var main = cta.querySelector('.push-cta-main');
      if (state.justSubscribed) {
        cta.hidden = false; if (main) main.hidden = true; if (done) done.hidden = false;
      } else {
        cta.hidden = !canAsk; if (main) main.hidden = false; if (done) done.hidden = true;
      }
      var b = cta.querySelector('[data-push-action]');
      if (b) b.disabled = state.busy;
    });

    if (bell) { bell.hidden = !canAsk; bell.disabled = state.busy; }
    if (invite && (state.subscribed || denied())) closeInvite(false);

    if (footerBtn && state.ready) {
      footerBtn.textContent = state.subscribed ? 'Désactiver les notifications' : 'Recevoir les nouveautés';
      footerBtn.disabled = state.busy || (denied() && !state.subscribed);
      footerBtn.title = denied() && !state.subscribed ? 'Les notifications sont bloquées dans les paramètres de votre navigateur.' : '';
    }
  }

  function buildFooterButton() {
    var host = document.querySelector('.footer-legal');
    if (!host) return;
    footerBtn = document.createElement('button');
    footerBtn.type = 'button';
    footerBtn.textContent = 'Recevoir les nouveautés';
    footerStatus = document.createElement('span');
    footerStatus.className = 'sr-only';
    footerStatus.setAttribute('role', 'status');
    footerStatus.setAttribute('aria-live', 'polite');
    host.appendChild(footerBtn);
    host.appendChild(footerStatus);
    footerBtn.addEventListener('click', function () { state.subscribed ? unsubscribe() : subscribe(); });
  }

  function buildBell() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    bell = document.createElement('button');
    bell.type = 'button';
    bell.className = 'theme-toggle push-bell';
    bell.hidden = true;
    bell.setAttribute('aria-label', 'Recevoir les nouveautés par notification');
    bell.title = 'Recevoir les nouveautés';
    bell.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" style="display:block"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
    toggle.parentNode.insertBefore(bell, toggle);
    bell.addEventListener('click', subscribe);
  }

  function bindCtas() {
    document.querySelectorAll('[data-push-cta]').forEach(function (cta) {
      cta.hidden = true;
      var b = cta.querySelector('[data-push-action]');
      if (b) b.addEventListener('click', subscribe);
    });
  }

  /* ---------- invitation discrète ---------- */
  function closeInvite(remember) {
    if (remember) pauseInvite();
    if (invite && invite.parentNode) invite.parentNode.removeChild(invite);
    invite = null;
  }

  function showInvite() {
    if (inviteShown || invite || !state.ready || state.subscribed || denied() || invitePaused()) return;
    if (document.querySelector('.legal-page, .cookie-banner')) return;
    inviteShown = true;
    invite = document.createElement('aside');
    invite.className = 'push-invite';
    invite.setAttribute('aria-labelledby', 'pushInviteTitle');
    invite.innerHTML =
      '<button type="button" class="push-invite-close" aria-label="Fermer">&times;</button>' +
      '<h2 id="pushInviteTitle">Être prévenu des nouveautés ?</h2>' +
      '<p>Un nouvel article, projet ou poste : une notification, rien d’autre. Vous pouvez vous désabonner à tout moment.</p>' +
      '<div class="push-invite-actions">' +
      '<button type="button" class="btn btn-outline btn-sm" data-later>Plus tard</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-yes>Oui, me prévenir</button>' +
      '</div>';
    document.body.appendChild(invite);
    invite.querySelector('[data-yes]').addEventListener('click', function () { closeInvite(false); subscribe(); });
    invite.querySelector('[data-later]').addEventListener('click', function () { closeInvite(true); });
    invite.querySelector('.push-invite-close').addEventListener('click', function () { closeInvite(true); });
    invite.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeInvite(true); });
  }

  function scheduleInvite() {
    if (invitePaused()) return;
    var tryShow = function () {
      if (document.querySelector('.cookie-banner')) { setTimeout(tryShow, 8000); return; }
      showInvite();
    };
    setTimeout(tryShow, INVITE_DELAY_MS);
    // Sur un article : dès que 80 % ont été lus
    var article = document.querySelector('.article-body');
    if (article) {
      var onScroll = function () {
        var r = article.getBoundingClientRect();
        var read = (window.innerHeight - r.top) / (r.height || 1);
        if (read > 0.8) { window.removeEventListener('scroll', onScroll); tryShow(); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------- démarrage ---------- */
  function init() {
    buildFooterButton();
    buildBell();
    bindCtas();

    navigator.serviceWorker.register('/sw.js').then(function () {
      return navigator.serviceWorker.ready;
    }).then(function (reg) {
      state.reg = reg;
      return reg.pushManager.getSubscription();
    }).then(function (sub) {
      state.subscribed = !!sub;
      state.ready = true;
      refresh();
      scheduleInvite();
    }).catch(function () {
      if (footerBtn) footerBtn.remove();
      if (bell) bell.remove();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
