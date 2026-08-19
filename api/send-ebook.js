// ============================================================
// Code A-Z — api/send-ebook.js
// Fonction serveur Vercel : envoie l'ebook par email via Brevo
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { fullname, email, hasCompany, hasWebsite, ebookId, companyName, websiteUrl } = req.body || {};

  // Validation côté serveur (ne jamais faire confiance uniquement au navigateur)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!fullname || typeof fullname !== 'string' || fullname.trim().length < 2) {
    return res.status(400).json({ error: 'Nom invalide' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

    // Liste des ebooks disponibles — ajouter une ligne ici pour chaque nouvel ebook
  const EBOOKS = {
        'guide-choisir-developpeur-web': {
      title: 'Le guide complet pour bien choisir son développeur ou son agence web',
      file: 'https://agnissanisaac.com/downloads/ebooks/guide-choisir-developpeur-web/ebook.pdf'
    }
  };

  const ebook = EBOOKS[ebookId];
  if (!ebook) {
    return res.status(400).json({ error: 'Ebook inconnu' });
  }
  const DOWNLOAD_URL = ebook.file;

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
                subject: `Votre guide : ${ebook.title}`,
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
          COMPANY_NAME: companyName || '',
          HAS_WEBSITE: hasWebsite || 'Non renseigné',
          WEBSITE_URL: websiteUrl || '',
          SOURCE: `Ebook — ${ebook.title}`
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