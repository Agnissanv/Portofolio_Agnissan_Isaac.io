// ============================================================
// Code A-Z — api/keepalive.js
// Appelé automatiquement tous les 3 jours par Vercel Cron (voir vercel.json)
// pour éviter que la base gratuite Supabase soit mise en pause après 7 jours d'inactivité.
// ============================================================

export default async function handler(req, res) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET } = process.env;
  if (!CRON_SECRET || req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service non configuré' });
  }
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/push_notified?select=item_key&limit=1`, {
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch {
    return res.status(502).json({ ok: false });
  }
}
