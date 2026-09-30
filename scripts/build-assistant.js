// ============================================================
// Code A-Z — build-assistant.js
// Construit la « mémoire » de l'assistante : assistant/kb.json
// à partir du vrai contenu du site (tarifs, FAQ, méthode, articles, projets,
// emplois, ressources, pages légales). Rien n'est écrit à la main deux fois :
// quand le site change, `npm run build` met l'assistante à jour.
// Usage : node scripts/build-assistant.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');
const readJson = (rel) => { try { return JSON.parse(read(rel)); } catch { return []; } };

const clean = (html) => String(html || '')
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<br\s*\/?>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

const entries = [];
const add = (e) => entries.push(Object.assign({ keywords: '' }, e));

const persona = readJson('assistant/persona.json');
const index = read('index.html');

// ---------------------------------------------------------------- Tarifs (index.html)
const PANEL_LABEL = { web: 'développement web (sites)', design: 'design graphique', app: 'applications' };
const PANEL_KW = {
  web: 'site web vitrine site internet creation de site developpement web tarif prix cout combien devis budget fcfa starter business elite',
  design: 'design graphique logo flyer affiche identite visuelle charte graphique tarif prix cout combien fcfa',
  app: 'application appli mobile app tarif prix cout combien fcfa mvp back-end'
};
const panels = index.split('<div class="pricing-panel').slice(1);
panels.forEach((block) => {
  const key = (block.match(/data-panel="(\w+)"/) || [])[1];
  if (!key) return;
  const plans = block.split('<div class="price-card').slice(1).map((c) => {
    const plan = clean((c.match(/class="plan">([\s\S]*?)<\/div>/) || [])[1]);
    const amount = clean((c.match(/class="amount">([\s\S]*?)<\/div>/) || [])[1]);
    const desc = clean((c.match(/class="desc">([\s\S]*?)<\/p>/) || [])[1]);
    const items = [...c.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => clean(m[1]));
    return { plan, amount, desc, items };
  });
  const note = clean((block.match(/class="pricing-note[^"]*">([\s\S]*?)<\/p>/) || [])[1]);
  const text = plans.map((p) => `${p.plan} — ${p.amount} : ${p.desc} Inclus : ${p.items.slice(0, 5).join(', ')}.`).join(' ') + (note ? ' ' + note : '');
  if (key === 'web' && note) add({ id: 'info-hebergement', type: 'faq', title: 'Hébergement et nom de domaine', text: note, url: '/#tarifs', keywords: 'hebergement nom de domaine renouvellement annee inclus site en ligne' });
  add({ id: 'prix-' + key, type: 'price', title: `Tarifs : ${PANEL_LABEL[key]}`, text, plans: plans.map((p) => ({ plan: p.plan, amount: p.amount, desc: p.desc })), note, url: '/#tarifs', keywords: PANEL_KW[key] + ' ' + plans.map((p) => p.plan).join(' ') });
});

// ---------------------------------------------------------------- FAQ (index.html)
[...index.matchAll(/<button class="faq-entry-q"[\s\S]*?<h4>([\s\S]*?)<\/h4>[\s\S]*?<div class="faq-entry-a"><p>([\s\S]*?)<\/p>/g)].forEach((m, i) => {
  const q = clean(m[1]);
  const extra = [[/temps|d[ée]lai/i, 'delai duree livraison rapide combien de temps'], [/satisfait/i, 'remboursement garantie insatisfait probleme'], [/vraiment [àa] moi|appartient/i, 'propriete appartient proprietaire droits code source domaine hebergement'], [/pay|avance/i, 'acompte paiement avance 50 pourcent solde'], [/modifier|moi-m[êe]me/i, 'modifier autonome autonomie formation prise en main'], [/hors de|l.international/i, 'etranger international distance afrique diaspora']]
    .filter(([re]) => re.test(q)).map(([, k]) => k).join(' ');
  add({ id: 'faq-' + i, type: 'faq', title: q, text: clean(m[2]), url: '/#faq', keywords: 'question faq ' + extra });
});

// ---------------------------------------------------------------- Méthode et services
[...index.matchAll(/<div class="process-step">[\s\S]*?<h4>([\s\S]*?)<\/h4>\s*<p>([\s\S]*?)<\/p>/g)].forEach((m, i) => {
  add({ id: 'etape-' + i, type: 'process', title: `Étape ${i + 1} : ${clean(m[1])}`, text: clean(m[2]), url: '/#methode', keywords: 'methode etape processus deroulement comment ca se passe projet demarche' });
});
[...index.matchAll(/<div class="service-card">[\s\S]*?<h4>([\s\S]*?)<\/h4>\s*<p>([\s\S]*?)<\/p>/g)].forEach((m, i) => {
  add({ id: 'service-' + i, type: 'service', title: clean(m[1]), text: clean(m[2]), url: '/#services', keywords: 'service prestation offre que faites-vous' });
});

// ---------------------------------------------------------------- Pages du site (texte écrit à la main, stable)
const pages = [
  { id: 'page-apropos', title: "Qui est Code A-Z", url: '/#about', text: "Code A-Z est une agence de développement web et de design d'interface basée à Abidjan, fondée par Agnissan Isaac. Une équipe de développeurs, designers et commerciaux collabore sur chaque projet : sites sur mesure, rapides et sobres, applications et identité visuelle.", keywords: 'qui agence equipe fondateur agnissan isaac derriere presentation a propos abidjan histoire' },
  { id: 'page-accueil', title: 'Accueil', url: '/', text: "La page d'accueil de Code A-Z : présentation, services, équipe, portfolio, méthode, tarifs, questions fréquentes, avis et contact.", keywords: 'accueil debut presentation agence qui etes-vous a propos' },
  { id: 'page-services', title: 'Services', url: '/#services', text: 'Stratégie digitale, développement front-end, solutions métier sur mesure, SEO, identité visuelle et UX, accessibilité multi-support.', keywords: 'services prestations offre competences' },
  { id: 'page-portfolio', title: 'Portfolio (réalisations)', url: '/#portfolio', text: "Les projets réalisés, filtrables par type (web, design, applications) et par secteur d'activité.", keywords: 'portfolio realisations projets exemples sites references travaux' },
  { id: 'page-tarifs', title: 'Tarifs', url: '/#tarifs', text: 'Les formules et prix de départ en FCFA pour les sites web, le design graphique et les applications.', keywords: 'tarifs prix cout combien forfait formule devis budget' },
  { id: 'page-contact', title: 'Contact', url: '/#contact', text: "Formulaire de contact (réponse sous 24 h), adresse e-mail valenbouge@gmail.com, téléphone et WhatsApp +225 05 46 79 72 58, LinkedIn.", keywords: 'contact contacter joindre appeler telephone whatsapp mail email ecrire rendez-vous parler projet adresse' },
  { id: 'page-blog', title: 'Blog', url: '/blog.html', text: 'Des articles sur le web, la performance, le design, le métier de développeur et les affaires.', keywords: 'blog articles lire lecture actualites conseils' },
  { id: 'page-emplois', title: 'Emplois', url: '/emploi/index.html', text: "Les postes ouverts chez Code A-Z : développeur front-end, développeur back-end, commercial digital indépendant.", keywords: 'emploi emplois recrutement travail poste candidater candidature rejoindre equipe job freelance' },
  { id: 'page-ressources', title: 'Ressources gratuites', url: '/ressources.html', text: 'Guides gratuits à télécharger pour mieux comprendre le web et bien choisir son prestataire.', keywords: 'ressources gratuit guide ebook telecharger pdf' },
  { id: 'page-confidentialite', title: 'Politique de confidentialité', url: '/politique-confidentialite.html', text: 'Quelles données personnelles sont collectées, pourquoi, combien de temps et comment exercer vos droits.', keywords: 'confidentialite donnees personnelles vie privee rgpd protection' },
  { id: 'page-conditions', title: "Conditions d'utilisation et de vente", url: '/conditions-utilisation.html', text: "Règles d'utilisation du site, devis, paiement, livraison, annulation, rétractation et remboursement.", keywords: 'conditions cgu cgv mentions legales remboursement annulation' },
  { id: 'page-cookies', title: 'Politique des cookies', url: '/politique-cookies.html', text: 'La liste des cookies et stockages utilisés, et comment accepter, refuser ou modifier votre choix.', keywords: 'cookies cookie consentement traceurs' }
];
pages.forEach((p) => add(Object.assign({ type: 'page' }, p)));

// ---------------------------------------------------------------- Pages légales : une entrée par section
[['politique-confidentialite.html', 'Confidentialité'], ['conditions-utilisation.html', 'Conditions'], ['politique-cookies.html', 'Cookies']].forEach(([file, label]) => {
  const html = read(file);
  const main = (html.match(/<main[\s\S]*<\/main>/) || [html])[0];
  main.split(/<h2/).slice(1).forEach((sec, i) => {
    const id = (sec.match(/id="([^"]+)"/) || [])[1] || 'section-' + i;
    const title = clean((sec.match(/>([\s\S]*?)<\/h2>/) || [])[1]).replace(/^\d+\.\s*/, '');
    const body = clean(sec.replace(/^[\s\S]*?<\/h2>/, ''));
    if (!title || body.length < 30) return;
    add({ id: `legal-${slug(label)}-${id}`, type: 'legal', title: `${label} : ${title}`, text: clip(body, 900), url: `/${file}#${id}`, keywords: label.toLowerCase() + ' ' + title.toLowerCase() });
  });
});

// ---------------------------------------------------------------- Articles du blog
readJson('blog/posts.json').forEach((p) => {
  add({ id: 'post-' + p.slug, type: 'post', title: p.title, text: p.excerpt || '', url: `/blog/${p.slug}.html`, tags: p.tags || [], date: p.dateLabel, keywords: (p.tags || []).join(' ') + ' article blog lire' });
});

// ---------------------------------------------------------------- Projets et secteurs
const PROJECTS = require(path.join(ROOT, 'js', 'projects-data.js'));
const bySector = {};
PROJECTS.forEach((p) => {
  add({ id: 'projet-' + p.id, type: 'project', title: `${p.title} (${p.categoryLabel})`, text: p.pitch, url: `/projet/${p.id}.html`, sectors: p.sectors || [], keywords: [p.tag, ...(p.sectors || []), p.category === 'web' ? 'site web' : p.category === 'app' ? 'application' : 'design graphique', 'exemple realisation projet'].join(' ') });
  (p.sectors || []).forEach((s) => { (bySector[s] = bySector[s] || []).push(p.title); });
});
const ALIASES = PROJECTS.SECTOR_ALIASES || {};
Object.keys(bySector).forEach((s) => {
  add({ id: 'secteur-' + slug(s), type: 'sector', title: `Sites pour : ${s}`, text: `${bySector[s].length} projet${bySector[s].length > 1 ? 's' : ''} dans ce secteur : ${bySector[s].join(', ')}.`, url: `/?secteur=${slug(s)}#portfolio`, keywords: s + ' ' + (ALIASES[s] || '') + ' secteur exemple site pour metier activite' });
});

// ---------------------------------------------------------------- Emplois et ressources
readJson('emploi/jobs.json').forEach((j) => {
  add({ id: 'job-' + j.slug, type: 'job', title: j.title, text: `${j.excerpt} ${j.type}. ${j.location}. ${j.compensation}.`, url: `/emploi/${j.slug}.html`, keywords: 'emploi recrutement poste candidature travail ' + j.type });
});
readJson('ressources/ebooks.json').forEach((e) => {
  add({ id: 'ebook-' + e.slug, type: 'ebook', title: e.title, text: e.excerpt || '', url: `/ressources/${e.slug}.html`, keywords: 'guide ebook gratuit pdf telecharger choisir developpeur agence' });
});

const kb = { generated: new Date().toISOString().slice(0, 10), persona, entries };
fs.writeFileSync(path.join(ROOT, 'assistant', 'kb.json'), JSON.stringify(kb), 'utf-8');
const counts = entries.reduce((a, e) => (a[e.type] = (a[e.type] || 0) + 1, a), {});
console.log(`assistant/kb.json : ${entries.length} entrées (${Object.entries(counts).map(([k, v]) => k + ' ' + v).join(', ')}), ${(fs.statSync(path.join(ROOT, 'assistant', 'kb.json')).size / 1000).toFixed(0)} Ko`);
