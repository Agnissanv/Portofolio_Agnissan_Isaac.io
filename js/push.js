/* ============================================================
   Code A-Z — push.js
   Bouton « Recevoir les nouveautés » (notifications push web).
   - Rien ne se passe sans clic volontaire, puis autorisation du navigateur.
   - Désabonnement possible au même endroit, à tout moment.
   - Si la clé publique ci-dessous est vide, le bouton n'apparaît pas.
   ============================================================ */
(function () {
  'use strict';

  // Clé publique VAPID (générée avec « npm run vapid »). Elle n'est pas secrète.
  var VAPID_PUBLIC_KEY = 'BAPokjp_VO-h8r8-a5CAqWYAUc4nyMonLHZPZBHlAJJPqToy5ijH5Sced8N2VJ3IkBghKd52NjVr4P90UtjR0rY';

  if (!VAPID_PUBLIC_KEY) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;

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

  function init() {
    var host = document.querySelector('.footer-legal');
    if (!host) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    var status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    host.appendChild(btn);
    host.appendChild(status);

    var reg = null;

    function render(subscribed) {
      btn.textContent = subscribed ? 'Désactiver les notifications' : 'Recevoir les nouveautés';
      btn.setAttribute('data-subscribed', subscribed ? 'true' : 'false');
      if (Notification.permission === 'denied' && !subscribed) {
        btn.disabled = true;
        btn.title = 'Les notifications sont bloquées dans les paramètres de votre navigateur.';
      }
    }

    navigator.serviceWorker.register('/sw.js').then(function (r) {
      reg = r;
      return navigator.serviceWorker.ready;
    }).then(function (r) {
      reg = r;
      return r.pushManager.getSubscription();
    }).then(function (sub) { render(!!sub); }).catch(function () { btn.remove(); });

    btn.addEventListener('click', function () {
      if (!reg) return;
      btn.disabled = true;
      reg.pushManager.getSubscription().then(function (sub) {
        if (sub) {
          var endpoint = sub.endpoint;
          return sub.unsubscribe().then(function () { return send('DELETE', { endpoint: endpoint }); })
            .then(function () { render(false); status.textContent = 'Notifications désactivées.'; });
        }
        return Notification.requestPermission().then(function (perm) {
          if (perm !== 'granted') { render(false); return; }
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          }).then(function (newSub) {
            return send('POST', newSub.toJSON()).then(function () {
              render(true);
              status.textContent = 'Notifications activées. Vous serez prévenu à chaque nouveauté.';
            }).catch(function (e) { return newSub.unsubscribe().then(function () { throw e; }); });
          });
        });
      }).catch(function () {
        status.textContent = 'Une erreur est survenue, réessayez plus tard.';
        render(false);
      }).then(function () { if (Notification.permission !== 'denied') btn.disabled = false; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
