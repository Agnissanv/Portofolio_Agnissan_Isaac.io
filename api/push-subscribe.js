// ============================================================
// Code A-Z — api/push-subscribe.js
// Enregistre (POST) ou supprime (DELETE) un abonnement aux notifications.
// Aucune donnée personnelle n'est demandée : seulement l'adresse technique
// fournie par le navigateur.
// ============================================================

const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /^[a-z0-9.-]+\.push\.apple\.com$/,
  /^[a-z0-9.-]+\.notify\.windows\.com$/
];

function isValidEndpoint(endpoint) {
  if (typeof endpoint !== 'string' || endpoint.length > 1000) return false;
  try {
    const u = new URL(endpoint);
    return u.protocol === 'https:' && PUSH_HOSTS.some((re) => re.test(u.hostname));
  } catch { return false; }
}

const base64url = /^[A-Za-z0-9_-]{10,200}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service non configuré' });
  }

  const body = req.body || {};
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    if (req.method === 'DELETE') {
      if (!isValidEndpoint(body.endpoint)) return res.status(400).json({ error: 'Abonnement invalide' });
      const r = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(body.endpoint)}`, {
        method: 'DELETE', headers
      });
      if (!r.ok) throw new Error('supabase ' + r.status);
      return res.status(200).json({ success: true });
    }

    const keys = body.keys || {};
    if (!isValidEndpoint(body.endpoint) || !base64url.test(keys.p256dh || '') || !base64url.test(keys.auth || '')) {
      return res.status(400).json({ error: 'Abonnement invalide' });
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?on_conflict=endpoint`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ endpoint: body.endpoint, p256dh: keys.p256dh, auth: keys.auth })
    });
    if (!r.ok) throw new Error('supabase ' + r.status);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('push-subscribe:', err.message);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
