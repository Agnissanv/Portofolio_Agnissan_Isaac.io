// ============================================================
// Code A-Z — send-push.js
// Envoie une notification pour chaque nouvel article, projet ou poste
// pas encore annoncé, puis le mémorise dans la table push_notified.
//   npm run notify               → envoie
//   npm run notify -- --dry-run  → montre ce qui serait envoyé, sans rien envoyer
//   npm run notify -- --init     → marque tout l'existant comme déjà annoncé (1re fois)
// À lancer APRÈS que le site à jour soit en ligne sur Vercel.
// Variables : voir .env.example (chargées depuis .env via --env-file).
// ============================================================

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const ROOT = path.join(__dirname, '..');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
const dry = process.argv.includes('--dry-run');
const init = process.argv.includes('--init');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('Variables manquantes : voir .env.example');
  process.exit(1);
}
webpush.setVapidDetails(VAPID_SUBJECT || 'mailto:valenbouge@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const H = { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' };
const rest = (p, opts = {}) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
const readJson = (rel) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8')); } catch { return []; } };

function collect() {
  const items = [];
  readJson('blog/posts.json').forEach(p => items.push({
    key: `post:${p.slug}`, title: 'Nouvel article sur Code A-Z', body: p.title, url: `/blog/${p.slug}.html` }));
  readJson('emploi/jobs.json').forEach(j => items.push({
    key: `job:${j.slug}`, title: 'Nouveau poste chez Code A-Z', body: j.title, url: `/emploi/${j.slug}.html` }));
  require(path.join(ROOT, 'js', 'projects-data.js')).forEach(p => items.push({
    key: `project:${p.id}`, title: 'Nouveau projet au portfolio', body: `${p.title} — ${p.categoryLabel}`, url: `/projet/${p.id}.html` }));
  return items;
}

async function mustJson(res, what) {
  if (!res.ok) throw new Error(`${what} : Supabase a répondu ${res.status} ${await res.text()}`);
  return res.json();
}

(async () => {
  const done = new Set((await mustJson(await rest('push_notified?select=item_key'), 'lecture push_notified')).map(x => x.item_key));
  const fresh = collect().filter(i => !done.has(i.key));
  if (!fresh.length) return console.log('Rien de nouveau à annoncer.');

  if (init) {
    if (!dry) {
      const r = await rest('push_notified', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' },
        body: JSON.stringify(fresh.map(i => ({ item_key: i.key }))) });
      if (!r.ok) throw new Error('écriture push_notified : ' + r.status);
    }
    return console.log(`${fresh.length} élément(s) marqué(s) comme déjà annoncés (aucune notification envoyée).`);
  }

  console.log('À annoncer :\n' + fresh.map(i => ` - ${i.key} : ${i.body}`).join('\n'));
  if (dry) return console.log('(dry-run : rien envoyé)');

  const subs = await mustJson(await rest('push_subscriptions?select=endpoint,p256dh,auth'), 'lecture push_subscriptions');
  console.log(`${subs.length} abonné(s).`);

  for (const item of fresh) {
    const payload = JSON.stringify({ title: item.title, body: item.body, url: item.url });
    let ok = 0, gone = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 60 * 60 * 24 * 7 });
        ok++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          gone++;
          await rest(`push_subscriptions?endpoint=eq.${encodeURIComponent(s.endpoint)}`, { method: 'DELETE' });
        } else console.error('Échec pour un abonné :', err.statusCode || err.message);
      }
    }
    const r = await rest('push_notified', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates' }, body: JSON.stringify([{ item_key: item.key }]) });
    if (!r.ok) throw new Error('écriture push_notified : ' + r.status);
    console.log(`${item.key} : ${ok} envoyée(s), ${gone} abonnement(s) expiré(s) supprimé(s).`);
  }
})().catch(e => { console.error(e); process.exit(1); });
