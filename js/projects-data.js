// Données des projets — modifie ou ajoute des entrées ici, le reste est généré automatiquement.
// Secteurs d'activité : la liste de référence. Un projet reçoit un ou plusieurs secteurs (champ "sectors").
// Pour ajouter un secteur ou une famille, modifie SEULEMENT cette liste. Les noms doivent être écrits pareil dans les projets.
const SECTOR_FAMILIES = [
  { name: "Commerce & Retail", sectors: ["Boutique de mode", "Cosmétique & beauté (produits)", "Épicerie & supermarché", "Produits artisanaux & locaux", "Électronique & téléphonie", "Librairie & papeterie"] },
  { name: "Restauration & Hôtellerie", sectors: ["Restaurant", "Traiteur", "Café & salon de thé", "Hôtel & résidence meublée", "Agence de voyage"] },
  { name: "Santé & Bien-être", sectors: ["Clinique & cabinet médical", "Cabinet dentaire", "Pharmacie", "Spa & bien-être"] },
  { name: "Beauté & Style", sectors: ["Salon de coiffure", "Institut de beauté", "Opticien", "Bijouterie & accessoires"] },
  { name: "Immobilier & BTP", sectors: ["Agence immobilière", "BTP & construction", "Architecte & décoration", "Promoteur immobilier"] },
  { name: "Éducation & Formation", sectors: ["École privée", "Centre de formation", "Soutien scolaire", "Université & institut"] },
  { name: "Finance & Services pro", sectors: ["Cabinet comptable", "Cabinet d'avocats", "Cabinet de conseil", "Assurance", "Microfinance"] },
  { name: "Événementiel & Divertissement", sectors: ["Mariage & événements", "Location de salle & matériel", "Studio photo & vidéo", "Artiste & musicien"] },
  { name: "Transport & Logistique", sectors: ["Transport & livraison", "Location de véhicules", "Déménagement"] },
  { name: "Associations & Institutions", sectors: ["ONG & association", "Association religieuse", "Institution publique"] },
  { name: "Technologie & SaaS", sectors: ["Outil SaaS", "Marketplace", "Application mobile"] },
  { name: "Agriculture & Agroalimentaire", sectors: ["Coopérative agricole", "Transformation alimentaire", "Produits bio & naturels"] },
  { name: "Médias & Contenu", sectors: ["Actualité & blog", "Streaming", "Créateur de contenu"] },
  { name: "Sport & Fitness", sectors: ["Salle de sport", "Club & académie sportive", "Coach sportif"] }
];

// Mots-clés de recherche (facultatif) : ce que les gens tapent, en plus du nom officiel du secteur.
const SECTOR_ALIASES = {
  "Restaurant": "resto maquis gargote bar lounge",
  "Café & salon de thé": "cafe cafeteria patisserie boulangerie",
  "Hôtel & résidence meublée": "hotel auberge residence airbnb",
  "BTP & construction": "batiment travaux chantier maconnerie entrepreneur",
  "Cabinet d'avocats": "avocat juriste juridique droit notaire huissier",
  "Cabinet comptable": "comptable compta fiscal expert-comptable",
  "Clinique & cabinet médical": "medecin docteur hopital clinique sante",
  "Salle de sport": "gym fitness musculation crossfit",
  "Salon de coiffure": "coiffeur barbier barber tresses",
  "Institut de beauté": "onglerie manucure esthetique maquillage",
  "École privée": "ecole college lycee scolaire",
  "Agence immobilière": "immo agence location vente logement",
  "Boutique de mode": "vetements pret-a-porter fashion friperie e-commerce boutique en ligne",
  "Transport & livraison": "livreur coursier taxi vtc fret",
  "Studio photo & vidéo": "photographe videaste cameraman",
  "ONG & association": "ong association fondation humanitaire",
  "Application mobile": "app android ios mobile"
};

const PROJECTS = [
  // Colone 1 (3 projets)
  {
    id: "mon-gout",
    title: "Mon Goût",
    category: "web",
    categoryLabel: "Site pour restaurant (concept)",
    year: "2026",
    tag: "Restaurant",
    sectors: ["Restaurant"],
    pitch: "Un concept de restaurant de quartier à Marcory : une carte gourmande, un panier et une identité verte et chaleureuse.",
    thumb: "images/projets/dev_web/mon-gout/0-thumb.webp",
    gallery: [
      "images/projets/dev_web/mon-gout/1.webp",
      "images/projets/dev_web/mon-gout/2.webp",
      "images/projets/dev_web/mon-gout/3.webp"
    ],
    description: "Concept de démonstration réalisé par Code A-Z pour montrer ce qu'un restaurant peut obtenir en ligne : une page d'accueil qui donne faim, une carte filtrable par catégories avec recherche de plat, un panier et des favoris, une page d'histoire et une page contact avec bouton WhatsApp. Quatre vues fluides, sans rechargement, sur mobile comme sur ordinateur. Textes, photos et coordonnées sont provisoires, à remplacer par ceux du restaurant.",
    tech: ["HTML5 / CSS3", "JavaScript (sans framework)", "Panier et favoris", "Responsive design"],
    link: "https://mon-gout.vercel.app/",
    linkLabel: "Voir le concept"
  },
  {
    id: "immo",
    title: "Immo",
    category: "web",
    categoryLabel: "Site vitrine pour agence immobilière",
    year: "2026",
    tag: "Agence immobilière",
    sectors: ["Agence immobilière"],
    pitch: "Une identité noire et dorée pour une agence immobilière haut de gamme.",
    thumb: "images/projets/dev_web/immo0-thumb.webp",
    gallery: [
      "images/projets/dev_web/immo1.webp",
      "images/projets/dev_web/immo2.webp",
      "images/projets/dev_web/immo3.webp",
      "images/projets/dev_web/immo4.webp"
    ],
    description: "Site vitrine premium pensé pour inspirer confiance dès les premières secondes. Présentation immersive des biens, FAQ, témoignages, indicateurs de performance : chaque section a été pensée pour transformer un visiteur en prospect qualifié, sur tous les écrans.",
    tech: ["HTML5 / CSS3", "JavaScript (filtres & interactions)", "Responsive design", "UI/UX premium"],
    link: "https://agnissanv.github.io/immo/",
    linkLabel: "Découvrir le site"
  },
  {
    id: "elan-feh",
    title: "Élan Fêh",
    category: "web",
    categoryLabel: "Site institutionnel",
    year: "2026",
    tag: "ONG · Jeunesse",
    sectors: ["ONG & association"],
    pitch: "Un site vitrine pour une ONG qui transforme l'autonomisation des jeunes ivoiriens en programmes concrets, du code à l'agriculture.",
    thumb: "images/projets/dev_web/elan-feh/0-thumb.webp",
    gallery: [
      "images/projets/dev_web/elan-feh/1.webp",
      "images/projets/dev_web/elan-feh/2.webp",
      "images/projets/dev_web/elan-feh/3.webp",
      "images/projets/dev_web/elan-feh/4.webp",
      "images/projets/dev_web/elan-feh/5.webp",
      "images/projets/dev_web/elan-feh/6.webp",
      "images/projets/dev_web/elan-feh/7.webp"
    ],
    description: "Site vitrine pour Élan Fêh, une ONG ivoirienne dédiée à l'autonomisation des jeunes de 15 à 30 ans à Abidjan et dans la région du Poro. Présentation claire des trois axes d'action (formation numérique à Yopougon, agroécologie à Korhogo, mentorat pour les jeunes filles), parcours en trois étapes, témoignage d'une bénéficiaire, chiffres d'impact mis en avant, et formulaire de contact multi-sujets pour mentors, mécènes et familles. Pages légales complètes pour une crédibilité institutionnelle renforcée.",
    tech: [
      "À confirmer"
    ],
    link: "https://elan-feh-website.vercel.app/",
    linkLabel: "Découvrir l'association"
  },
  {
    id: "budget-flow",
    title: "Budget Flow",
    category: "app",
    categoryLabel: "Application mobile",
    year: "2026",
    tag: "Finance personnelle",
    sectors: ["Application mobile"],
    pitch: "Simulez, comparez et visualisez l'évolution de votre épargne en temps réel.",
    thumb: "images/projets/app/budget-flow/1-thumb.webp",
    gallery: [
      "images/projets/app/budget-flow/2.webp",
      "images/projets/app/budget-flow/3.webp",
      "images/projets/app/budget-flow/4.webp",
      "images/projets/app/budget-flow/5.webp",
      "images/projets/app/budget-flow/6.webp",
      "images/projets/app/budget-flow/7.webp",
      "images/projets/app/budget-flow/8.webp",
      "images/projets/app/budget-flow/9.webp",
      "images/projets/app/budget-flow/10.webp",
      "images/projets/app/budget-flow/11.webp",
      "images/projets/app/budget-flow/12.webp",
      "images/projets/app/budget-flow/13.webp"
    ],
    description: "Budget Flow transforme la gestion financière personnelle en expérience visuelle et interactive. Contrairement à une calculatrice classique qui donne un chiffre figé, l'application projette l'évolution de l'épargne mois par mois sous forme de courbes animées, et répond à des questions concrètes comme « Quand atteindrai-je 1 000 000 FCFA ? ». L'utilisateur saisit son revenu, ses dépenses par catégorie et son solde actuel : l'app calcule l'épargne nette et simule la trajectoire financière sur plusieurs mois, avec des curseurs interactifs pour ajuster les chiffres en temps réel, comparer deux scénarios côte à côte, ou visualiser la répartition des dépenses par catégorie. Fonctionne entièrement hors-ligne, données stockées en local.",
    tech: ["Flutter (Dart)", "Riverpod", "Hive (stockage local)", "fl_chart", "Multi-devises (XOF, EUR, USD...)"],
    link: "downloads/budget-flow.apk",
    linkLabel: "Télécharger l'APK",
    isDownload: true,
    downloadNote: "~50 Mo · Android 8.0 ou supérieur",
    trustBadges: ["Aucune donnée collectée", "100% hors-ligne", "Version 1.0.0", "1k+ téléchargements"]
  },
  {
    id: "affiches",
    title: "Affiches",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Communication visuelle",
    pitch: "Des affiches pensées pour marquer, du format A4 au grand format.",
    thumb: "images/projets/design/affiches/1-thumb.webp",
    gallery: [
      "images/projets/design/affiches/1.webp",
      "images/projets/design/affiches/2.webp",
      "images/projets/design/affiches/3.webp",
      "images/projets/design/affiches/4.webp",
      "images/projets/design/affiches/5.webp",
      "images/projets/design/affiches/6.webp",
      "images/projets/design/affiches/7.webp",
      "images/projets/design/affiches/8.webp",
      "images/projets/design/affiches/9.webp",
      "images/projets/design/affiches/10.webp",
      "images/projets/design/affiches/11.webp",
      "images/projets/design/affiches/12.webp"
    ],
    description: "Que ce soit pour un événement, une promotion ou une campagne, chaque affiche est conçue pour rester lisible et impactante, même vue de loin ou en un coup d'œil rapide.",
    isCollection: true
  },

  // Colone 2 (3 projets) il reste 1
  {
    id: "in-staff-deco",
    title: "I.N: Staff Deco",
    category: "web",
    categoryLabel: "Site vitrine",
    year: "2026",
    tag: "Décoration intérieure",
    sectors: ["BTP & construction", "Architecte & décoration"],
    pitch: "Un site vitrine pour une entreprise de faux plafonds et décoration intérieure à Abidjan.",
    thumb: "images/projets/dev_web/in-staff-deco/1-thumb.webp",
    gallery: [
      "images/projets/dev_web/in-staff-deco/1.webp",
      "images/projets/dev_web/in-staff-deco/2.webp",
      "images/projets/dev_web/in-staff-deco/3.webp",
      "images/projets/dev_web/in-staff-deco/4.webp",
      "images/projets/dev_web/in-staff-deco/5.webp",
      "images/projets/dev_web/in-staff-deco/6.webp",
      "images/projets/dev_web/in-staff-deco/7.webp",
      "images/projets/dev_web/in-staff-deco/8.webp"
    ],
    description: "Site vitrine conçu pour I.N: Staff Deco, spécialiste du placo-plâtre, des faux plafonds et de la décoration intérieure à Abidjan depuis 2008. Le site met en avant les réalisations de l'entreprise, ses tarifs au m² et les témoignages clients, avec un objectif simple : transformer un visiteur en demande de devis en un minimum de clics. La demande de devis est directement intégrée à WhatsApp : le visiteur remplit un formulaire, et le message part pré-rempli vers l'entreprise — il ne reste plus qu'à l'envoyer.",
    tech: ["HTML5 / CSS3", "JavaScript", "Intégration WhatsApp (devis pré-rempli)", "Responsive design"],
    link: "https://www.instaffdeco.com/",
    linkLabel: "Voir le site"
  },
  {
    id: "logos",
    title: "Logos",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Identité de marque",
    pitch: "Une sélection de logos conçus pour des marques et indépendants.",
    thumb: "images/projets/design/logos/1-thumb.webp",
    gallery: [
      "images/projets/design/logos/1.webp",
      "images/projets/design/logos/2.webp",
      "images/projets/design/logos/3.webp",
      "images/projets/design/logos/4.webp",
      "images/projets/design/logos/5.webp",
      "images/projets/design/logos/6.webp",
      "images/projets/design/logos/7.webp",
      "images/projets/design/logos/8.webp",
      "images/projets/design/logos/9.webp",
      "images/projets/design/logos/10.webp",
      "images/projets/design/logos/11.webp",
      "images/projets/design/logos/12.webp"
    ],
    description: "Chaque logo est pensé pour être simple à reconnaître et à décliner sur tous les supports — carte de visite, réseaux sociaux, packaging. L'objectif : une identité qui reste lisible même en petit format.",
    isCollection: true
  },

  // Colone 3 (3 projets)
  {
    id: "refuge-pop",
    title: "Refuge Pop",
    category: "web",
    categoryLabel: "Site de curation vidéo",
    year: "2026",
    tag: "Plateforme de streaming",
    sectors: ["Streaming"],
    pitch: "Une expérience de streaming complète, sans abonnement ni serveur vidéo.",
    thumb: "images/projets/dev_web/refugepop1-thumb.webp",
    gallery: [
      "images/projets/dev_web/refugepop.webp",
      "images/projets/dev_web/refugepop2.webp",
      "images/projets/dev_web/refugepop3.webp",
      "images/projets/dev_web/refugepop4.webp"
    ],
    description: "Refuge Pop est une plateforme de streaming à part entière : catalogue de films à la demande, chaînes en direct, reprise de lecture automatique, suggestions personnalisées et recherche intelligente — construite sans base de données ni backend classique. La section Direct s'appuie sur un proxy Cloudflare Worker sur-mesure pour diffuser des flux HLS en direct en contournant les restrictions CORS. Un pipeline Python automatisé alimente et vérifie le catalogue.",
    tech: ["HTML5 / CSS3 / JS (SPA)", "API YouTube IFrame & HLS.js", "Cloudflare Workers", "Python (automatisation)", "Vercel"],
    link: "https://refugepop.agnissanisaac.com/",
    linkLabel: "Voir le site"
  },
  {
    id: "qg-resto",
    title: "QG-Resto",
    category: "web",
    categoryLabel: "Site vitrine pour restaurant",
    year: "2026",
    tag: "Restaurant",
    sectors: ["Restaurant"],
    pitch: "Une vitrine digitale pensée pour la gastronomie ivoirienne.",
    thumb: "images/projets/dev_web/qg-resto3-thumb.webp",
    gallery: [
      "images/projets/dev_web/qg-resto1.webp",
      "images/projets/dev_web/qg-resto2.webp",
      "images/projets/dev_web/qg-resto4.webp",
      "images/projets/dev_web/qg-resto5.webp"
    ],
    description: "Site vitrine conçu pour valoriser les plats, renforcer l'image de marque et faciliter les réservations. Menu dynamique clair, formulaire de réservation intégré, témoignages et informations pratiques pour instaurer la confiance dès la première visite. Le tout pensé responsive pour un usage mobile en priorité.",
    tech: ["HTML5 / CSS3", "JavaScript (animations)", "Responsive design", "UI/UX"],
    link: "https://agnissanv.github.io/qg-resto/",
    linkLabel: "Découvrir le restaurant"
  },
  {
    id: "tech-west",
    title: "Tech West",
    category: "web",
    categoryLabel: "Site de Média digital",
    year: "2026",
    tag: "Actualité tech",
    sectors: ["Actualité & blog"],
    pitch: "Une plateforme automatisée dédiée à l'actualité tech en Afrique de l'Ouest.",
    thumb: "images/projets/dev_web/TECH_WEST1-thumb.webp",
    gallery: [
      "images/projets/dev_web/TECH_WEST1.webp",
      "images/projets/dev_web/TECH_WEST2.webp",
      "images/projets/dev_web/TECH_WEST3.webp"
    ],
    description: "Un moteur intelligent qui fusionne plusieurs sources pour couvrir l'IA, la Fintech et les startups. Le défi : une interface capable de gérer un flux constant d'informations tout en restant lisible. Système de catégories pour une navigation personnalisée, et un tunnel dédié aux collaborations B2B.",
    tech: ["HTML5 / CSS3", "JavaScript (filtrage & modales)", "Intégration & automatisation de données", "Branding & UI"],
    link: "https://agnissanv.github.io/TECHWEST/",
    linkLabel: "Explorer le média"
  },
  {
    id: "bannieres",
    title: "Bannières",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Web & réseaux sociaux",
    pitch: "Des bannières adaptées aux formats web et réseaux sociaux.",
    thumb: "images/projets/design/bannieres/1-thumb.webp",
    gallery: [
      "images/projets/design/bannieres/1.webp",
      "images/projets/design/bannieres/2.webp",
      "images/projets/design/bannieres/3.webp",
      "images/projets/design/bannieres/4.webp",
      "images/projets/design/bannieres/5.webp",
      "images/projets/design/bannieres/6.webp",
      "images/projets/design/bannieres/7.webp",
      "images/projets/design/bannieres/8.webp",
      "images/projets/design/bannieres/9.webp",
      "images/projets/design/bannieres/10.webp",
      "images/projets/design/bannieres/11.webp",
      "images/projets/design/bannieres/12.webp"
    ],
    description: "Couvertures Facebook, bannières de site, visuels d'en-tête — chaque format a ses contraintes propres, pensées et respectées pour un rendu net sur tous les écrans.",
    isCollection: true
  },
  {
    id: "overdose-gym",
    title: "Overdose Gym",
    category: "web",
    categoryLabel: "Site vitrine pour salle de sport",
    year: "2026",
    tag: "Fitness & sport",
    sectors: ["Salle de sport"],
    pitch: "Une landing page haute conversion pour une salle de sport d'élite.",
    thumb: "images/projets/dev_web/overdose-gym1-thumb.webp",
    gallery: [
      "images/projets/dev_web/overdose-gym.webp",
      "images/projets/dev_web/overdose-gym2.webp",
      "images/projets/dev_web/overdose-gym3.webp"
    ],
    description: "L'objectif : traduire l'énergie du CrossFit dans une interface sombre et directe. Tarifs et programmes mis en avant avec des appels à l'action clairs, optimisation pour les recherches géolocalisées, et une expérience mobile pensée pour des réservations rapides.",
    tech: ["HTML5 / CSS3 avancé", "JavaScript (formulaires)", "Google Maps API", "Mobile-first"],
    link: "https://agnissanv.github.io/fitnesswebsite1/",
    linkLabel: "Voir le site"
  },
  {
    id: "packaging",
    title: "Packaging",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Emballages & étiquettes",
    pitch: "Des emballages qui prolongent l'identité de marque jusqu'au produit.",
    thumb: "images/projets/design/packaging/1-thumb.webp",
    gallery: [
      "images/projets/design/packaging/1.webp",
      "images/projets/design/packaging/2.webp",
      "images/projets/design/packaging/3.webp",
      "images/projets/design/packaging/4.webp",
      "images/projets/design/packaging/5.webp",
      "images/projets/design/packaging/6.webp",
      "images/projets/design/packaging/7.webp",
      "images/projets/design/packaging/8.webp"
    ],
    description: "Boîtes, sachets, étiquettes : chaque support d'emballage est pensé pour rester cohérent avec l'identité visuelle de la marque, tout en respectant les contraintes techniques d'impression et de production.",
    isCollection: true
  },
  {
    id: "lumina",
    title: "LUMINA — Refonte identité & site vitrine",
    category: "web",
    categoryLabel: "Refonte / Identité visuelle",
    year: "2026",
    tag: "Opticien",
    sectors: ["Opticien"],
    pitch: "Une identité de marque affirmée pour un cabinet d'optique à Marcory, avec un curseur interactif qui simule en direct l'effet d'une bonne correction visuelle.",
    thumb: "images/projets/dev_web/lumina/0-thumb.webp",
    gallery: [
      "images/projets/dev_web/lumina/1.webp",
      "images/projets/dev_web/lumina/2.webp",
      "images/projets/dev_web/lumina/3.webp",
      "images/projets/dev_web/lumina/4.webp",
      "images/projets/dev_web/lumina/5.webp",
      "images/projets/dev_web/lumina/6.webp",
      "images/projets/dev_web/lumina/7.webp"
    ],
    description: "Site vitrine pensé pour un opticien à Marcory, Abidjan, avec une direction artistique « signage tropical » sur mesure : blocs de couleurs pleines, contours épais et ombres dures, à contre-courant des codes habituels du secteur (fond crème, dégradés, coins arrondis). Le hero propose une signature interactive : un curseur « Réglez votre vue » qui passe du flou au net, pour illustrer concrètement ce qu'apporte une bonne monture. Logo dessiné sur mesure en SVG, vitrine vidéo intégrée, galerie de montures en mosaïque, et une navigation fluide sur mobile comme sur desktop.",
    tech: ["HTML5", "CSS3 (Grid/Flexbox, animations)", "JavaScript vanilla", "SVG (logo et pictogrammes)", "Google Fonts (Unbounded, Archivo)", "Formspree (formulaire de contact)", "Google Maps Embed"],
    link: "https://agnissanv.github.io/Optic_template/",
    linkLabel: "Consulter le cabinet"
  },
  {
    id: "blog-template",
    title: "Site de blog",
    category: "web",
    categoryLabel: "Blog / tunnel de vente",
    year: "2026",
    tag: "Blog / tunnel de vente",
    sectors: ["Créateur de contenu"],
    pitch: "Un blog en 4 pages, pensé pour attirer, rassurer et convertir.",
    thumb: "images/projets/dev_web/blog0.webp",
    gallery: [
      "images/projets/dev_web/blog1.webp",
      "images/projets/dev_web/blog2.webp",
      "images/projets/dev_web/blog3.webp",
      "images/projets/dev_web/blog4.webp"
    ],
    description: "Accueil, page articles, page promotionnelle façon tunnel de vente et page de formulaire — avec barre de recherche et navigation fluide sur tout type d'appareil. Un gabarit pensé pour être adapté à différents secteurs d'activité.",
    tech: ["HTML", "Bootstrap"],
    link: "https://agnissanv.github.io/mon_blog-Code_A-Z/",
    linkLabel: "Voir le site"
  },
  {
    id: "sentimentale",
    title: "Sentimentale",
    category: "web",
    categoryLabel: "Boutique e-commerce",
    year: "2026",
    tag: "Boutique en ligne",
    sectors: ["Boutique de mode"],
    pitch: "Un template e-commerce pensé pour transformer les visiteurs en clients.",
    thumb: "images/projets/dev_web/SENTIMENTALE.COM1.webp",
    gallery: [
      "images/projets/dev_web/SENTIMENTALE.COM2.webp",
      "images/projets/dev_web/SENTIMENTALE.COM3.webp",
      "images/projets/dev_web/SENTIMENTALE.COM4.webp"
    ],
    description: "Architecture optimisée pour la conversion : navigation intuitive, mise en avant claire des produits, structure adaptable à différents types d'activité (mode, accessoires, produits digitaux). Design responsive sur mobile, tablette et desktop.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "https://agnissanv.github.io/Site_complet_sentimentale1/",
    linkLabel: "Voir le site"
  },  
  {
    id: "flyers",
    title: "Flyers",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Communication visuelle",
    pitch: "Des flyers percutants, pensés pour capter l'attention en quelques secondes.",
    thumb: "images/projets/design/flyers/1-thumb.webp",
    gallery: [
      "images/projets/design/flyers/1.webp",
      "images/projets/design/flyers/2.webp",
      "images/projets/design/flyers/3.webp",
      "images/projets/design/flyers/4.webp",
      "images/projets/design/flyers/5.webp",
      "images/projets/design/flyers/6.webp",
      "images/projets/design/flyers/7.webp",
      "images/projets/design/flyers/8.webp",
      "images/projets/design/flyers/9.webp",
      "images/projets/design/flyers/11.webp"
    ],
    description: "Un flyer efficace transmet l'essentiel avant même d'être lu en détail. Chaque création met en avant une hiérarchie claire de l'information et un visuel qui accroche le regard.",
    isCollection: true
  },
  {
    id: "palettepick",
    title: "PalettePick",
    category: "web",
    categoryLabel: "Outil d'extraction de palettes de couleurs",
    year: "2026",
    tag: "Outil pour designers",
    sectors: ["Outil SaaS"],
    pitch: "L'inspiration visuelle transformée en code, en quelques secondes.",
    thumb: "images/projets/dev_web/palettepick1-thumb.webp",
    gallery: [
      "images/projets/dev_web/palettepick.webp",
      "images/projets/dev_web/palettepick2.webp",
      "images/projets/dev_web/palettepick3.webp"
    ],
    description: "PalettePick extrait les couleurs dominantes de n'importe quelle image pour générer des palettes prêtes à l'emploi. L'outil traite les images localement pour une rapidité maximale et génère automatiquement variables CSS, codes HEX et RGB. L'objectif était une expérience « zéro friction », avec un design sombre aligné sur les standards des outils créatifs modernes.",
    tech: ["HTML5 / CSS3", "JavaScript ES6+", "UI High-Contrast & responsive", "GitHub Pages"],
    link: "https://agnissanv.github.io/palettepick/",
    linkLabel: "Voir le site"
  },
  {
    id: "goodies",
    title: "Goodies & produits dérivés",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Objets promotionnels",
    pitch: "T-shirts, casquettes, tasses, porte-clés — l'identité de marque déclinée sur l'objet.",
    thumb: "images/projets/design/goodies/1-thumb.webp",
    gallery: [
      "images/projets/design/goodies/1.webp",
      "images/projets/design/goodies/2.webp",
      "images/projets/design/goodies/3.webp",
      "images/projets/design/goodies/4.webp",
      "images/projets/design/goodies/5.webp",
      "images/projets/design/goodies/6.webp",
      "images/projets/design/goodies/7.webp",
      "images/projets/design/goodies/8.webp",
      "images/projets/design/goodies/9.webp",
      "images/projets/design/goodies/10.webp",
      "images/projets/design/goodies/11.webp",
      "images/projets/design/goodies/12.webp"
    ],
    description: "Une bonne identité de marque doit rester reconnaissable même appliquée à un petit objet. Ces créations montrent comment un logo ou une charte graphique s'adapte aux contraintes d'un support physique, sans perdre en lisibilité.",
    isCollection: true
  }
];

if (typeof module !== 'undefined' && module.exports) { module.exports = PROJECTS; module.exports.SECTOR_FAMILIES = SECTOR_FAMILIES; module.exports.SECTOR_ALIASES = SECTOR_ALIASES; }