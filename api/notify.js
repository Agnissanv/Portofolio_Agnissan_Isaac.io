// ============================================================
// Code A-Z — api/notify.js
// Appelé chaque jour par Vercel Cron (voir vercel.json, 08:00 heure d'Abidjan = UTC).
// Compare la liste des publications du site (notify-index.json, généré par
// « npm run build ») avec celles déjà annoncées (table push_notified), et envoie
// une notification pour chaque nouveauté. Ce passage quotidien garde aussi la base
// gratuite Supabase éveillée (elle se met en pause après 7 jours d'inactivité).
// Protégé par CRON_SECRET (Vercel l'envoie automatiquement dans l'en-tête Authorization).
// ============================================================

import webpush from 'web-push';

const SITE = 'https://www.agnissanisaac.com';

// Regroupe les nouveautés : 1 seule notification par type quand il y en a plusieurs
// (ex. 8 nouveaux projets => « 8 nouveaux projets au portfolio », pas 8 notifications).
function groupNotifications(fresh) {
  const types = {
    post: { plural: 'articles', title: 'Nouveaux articles sur Code A-Z', url: '/blog.html' },
    job: { plural: 'postes', title: 'Nouveaux postes chez Code A-Z', url: '/emploi/index.html' },
    project: { plural: 'projets', title: 'Nouveaux projets au portfolio', url: '/#portfolio' }
  };
  const out = [];
  for (const [type, t] of Object.entries(types)) {
    const items = fresh.filter((i) => i.key.startsWith(type + ':'));
    if (!items.length) continue;
    if (items.length === 1) {
      out.push({ keys: [items[0].key], title: items[0].title, body: items[0].body, url: items[0].url });
    } else {
      const names = items.slice(0, 3).map((i) => i.body.split(' — ')[0]).join(', ');
      out.push({ keys: items.map((i) => i.key), title: t.title, body: `${items.length} ${t.plural} : ${names}${items.length > 3 ? '…' : ''}`, url: t.url });
    }
  }
  return out;
}

export default async function handler(req, res) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET } = process.env;
  if (!CRON_SECRET || req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(503).json({ error: 'Service non configuré' });
  }

  const H = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json'
  };
  const rest = (p, opts = {}) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { ...opts, headers: { ...H, ...(opts.headers || {}) } });

  try {
    webpush.setVapidDetails('mailto:contact.codeaz@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const idxRes = await fetch(`${SITE}/notify-index.json`, { headers: { 'Cache-Control': 'no-cache' } });
    if (!idxRes.ok) throw new Error('notify-index.json ' + idxRes.status);
    const index = await idxRes.json();

    const doneRes = await rest('push_notified?select=item_key');
    if (!doneRes.ok) throw new Error('push_notified ' + doneRes.status);
    const done = new Set((await doneRes.json()).map((x) => x.item_key));
    const fresh = index.filter((i) => !done.has(i.key));
    if (!fresh.length) return res.status(200).json({ sent: 0, message: 'Rien de nouveau' });

    const subsRes = await rest('push_subscriptions?select=endpoint,p256dh,auth');
    if (!subsRes.ok) throw new Error('push_subscriptions ' + subsRes.status);
    const subs = await subsRes.json();

    const report = [];
    for (const msg of groupNotifications(fresh)) {
      const payload = JSON.stringify({ title: msg.title, body: msg.body, url: msg.url });
      let ok = 0, gone = 0;
      for (let i = 0; i < subs.length; i += 25) {
        const batch = subs.slice(i, i + 25);
        const results = await Promise.allSettled(batch.map((s) =>
          webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 60 * 60 * 24 * 7 })));
        for (let j = 0; j < results.length; j++) {
          const r = results[j];
          if (r.status === 'fulfilled') { ok++; continue; }
          const code = r.reason && r.reason.statusCode;
          if (code === 404 || code === 410) {
            gone++;
            await rest(`push_subscriptions?endpoint=eq.${encodeURIComponent(batch[j].endpoint)}`, { method: 'DELETE' });
          }
        }
      }
      // On mémorise l'annonce même s'il n'y a aucun abonné : on ne notifie jamais après coup.
      await rest('push_notified', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' }, body: JSON.stringify(msg.keys.map((k) => ({ item_key: k }))) });
      report.push({ keys: msg.keys, ok, gone });
    }
    return res.status(200).json({ sent: report.length, report });
  } catch (err) {
    console.error('notify:', err.message);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
