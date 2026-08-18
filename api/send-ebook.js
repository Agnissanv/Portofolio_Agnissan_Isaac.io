// ============================================================
// Code A-Z — api/send-ebook.js
// Fonction serveur Vercel : envoie l'ebook par email via Brevo
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { fullname, email, hasCompany, hasWebsite } = req.body || {};

  // Validation côté serveur (ne jamais faire confiance uniquement au navigateur)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!fullname || typeof fullname !== 'string' || fullname.trim().length < 2) {
    return res.status(400).json({ error: 'Nom invalide' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const DOWNLOAD_URL = 'https://agnissanisaac.com/downloads/ebooks/guide-choisir-developpeur-web.pdf';

  try {
    // 1) Envoi de l'email avec le lien de téléchargement
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'Code A-Z', email: 'contact@agnissanisaac.com' },
        to: [{ email, name: fullname }],
        subject: 'Votre guide : bien choisir son développeur ou son agence web',
        htmlContent: `
          <div style="font-family:Arial,sans-serif; max-width:520px; margin:0 auto; color:#181816;">
            <h2 style="color:#181816;">Bonjour ${fullname.split(' ')[0]},</h2>
            <p>Merci d'avoir demandé le guide. Vous pouvez le télécharger dès maintenant :</p>
            <p style="margin:28px 0;">
              <a href="${DOWNLOAD_URL}" style="background:#C6303E; color:#fff; padding:14px 28px; border-radius:999px; text-decoration:none; font-weight:bold;">
                Télécharger le guide (PDF)
              </a>
            </p>
            <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${DOWNLOAD_URL}">${DOWNLOAD_URL}</a></p>
            <p style="margin-top:32px;">Une question sur votre projet ? Répondez simplement à cet email, ou écrivez-moi directement : valenbouge@gmail.com</p>
            <p>Agnissan Isaac — Code A-Z</p>
          </div>
        `
      })
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error('Erreur Brevo (email):', errText);
      return res.status(502).json({ error: "L'envoi de l'email a échoué" });
    }

    // 2) Enregistrement du contact dans Brevo (pour retrouver la liste plus tard)
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: fullname,
          HAS_COMPANY: hasCompany || 'Non renseigné',
          HAS_WEBSITE: hasWebsite || 'Non renseigné',
          SOURCE: 'Ebook — Guide développeur'
        },
        updateEnabled: true
      })
    });
    // On ne bloque pas l'utilisateur si cette étape échoue — l'email est le plus important

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}