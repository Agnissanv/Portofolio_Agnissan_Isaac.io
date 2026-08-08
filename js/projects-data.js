// Données des projets — modifie ou ajoute des entrées ici, le reste est généré automatiquement.
const PROJECTS = [
  {
    id: "refuge-pop",
    title: "Refuge Pop",
    category: "web",
    categoryLabel: "Site de curation vidéo",
    year: "2026",
    tag: "Plateforme de streaming",
    pitch: "Une expérience de streaming complète, sans abonnement ni serveur vidéo.",
    thumb: "images/projets/dev_web/refugepop1.png",
    gallery: [
      "images/projets/dev_web/refugepop.jpg",
      "images/projets/dev_web/refugepop2.png",
      "images/projets/dev_web/refugepop3.png",
      "images/projets/dev_web/refugepop4.png"
    ],
    description: "Refuge Pop est une plateforme de streaming à part entière : catalogue de films à la demande, chaînes en direct, reprise de lecture automatique, suggestions personnalisées et recherche intelligente — construite sans base de données ni backend classique. La section Direct s'appuie sur un proxy Cloudflare Worker sur-mesure pour diffuser des flux HLS en direct en contournant les restrictions CORS. Un pipeline Python automatisé alimente et vérifie le catalogue.",
    tech: ["HTML5 / CSS3 / JS (SPA)", "API YouTube IFrame & HLS.js", "Cloudflare Workers", "Python (automatisation)", "Vercel"],
    link: "https://refugepop.agnissanisaac.com/",
    linkLabel: "Voir le site"
  },
  {
    id: "palettepick",
    title: "PalettePick",
    category: "web",
    categoryLabel: "Outil d'extraction de palettes de couleurs",
    year: "2026",
    tag: "Outil pour designers",
    pitch: "L'inspiration visuelle transformée en code, en quelques secondes.",
    thumb: "images/projets/dev_web/palettepick1.png",
    gallery: [
      "images/projets/dev_web/palettepick.jpg",
      "images/projets/dev_web/palettepick2.png",
      "images/projets/dev_web/palettepick3.png"
    ],
    description: "PalettePick extrait les couleurs dominantes de n'importe quelle image pour générer des palettes prêtes à l'emploi. L'outil traite les images localement pour une rapidité maximale et génère automatiquement variables CSS, codes HEX et RGB. L'objectif était une expérience « zéro friction », avec un design sombre aligné sur les standards des outils créatifs modernes.",
    tech: ["HTML5 / CSS3", "JavaScript ES6+", "UI High-Contrast & responsive", "GitHub Pages"],
    link: "https://agnissanv.github.io/palettepick/",
    linkLabel: "Voir le site"
  },
  {
    id: "qg-resto",
    title: "QG-Resto",
    category: "web",
    categoryLabel: "Site vitrine pour restaurant",
    year: "2026",
    tag: "Restaurant",
    pitch: "Une vitrine digitale pensée pour la gastronomie ivoirienne.",
    thumb: "images/projets/dev_web/qg-resto3.png",
    gallery: [
      "images/projets/dev_web/qg-resto1.jpg",
      "images/projets/dev_web/qg-resto2.jpg",
      "images/projets/dev_web/qg-resto4.png",
      "images/projets/dev_web/qg-resto5.png"
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
    pitch: "Une plateforme automatisée dédiée à l'actualité tech en Afrique de l'Ouest.",
    thumb: "images/projets/dev_web/TECH_WEST1.png",
    gallery: [
      "images/projets/dev_web/TECH_WEST1.png",
      "images/projets/dev_web/TECH_WEST2.png",
      "images/projets/dev_web/TECH_WEST3.png"
    ],
    description: "Un moteur intelligent qui fusionne plusieurs sources pour couvrir l'IA, la Fintech et les startups. Le défi : une interface capable de gérer un flux constant d'informations tout en restant lisible. Système de catégories pour une navigation personnalisée, et un tunnel dédié aux collaborations B2B.",
    tech: ["HTML5 / CSS3", "JavaScript (filtrage & modales)", "Intégration & automatisation de données", "Branding & UI"],
    link: "https://agnissanv.github.io/TECHWEST/",
    linkLabel: "Explorer le média"
  },
  {
    id: "immo",
    title: "Immo",
    category: "web",
    categoryLabel: "Site vitrine pour agence immobilière",
    year: "2026",
    tag: "Agence immobilière",
    pitch: "Une identité noire et dorée pour une agence immobilière haut de gamme.",
    thumb: "images/projets/dev_web/immo0.png",
    gallery: [
      "images/projets/dev_web/immo1.jpg",
      "images/projets/dev_web/immo2.jpg",
      "images/projets/dev_web/immo3.png",
      "images/projets/dev_web/immo4.png"
    ],
    description: "Site vitrine premium pensé pour inspirer confiance dès les premières secondes. Présentation immersive des biens, FAQ, témoignages, indicateurs de performance : chaque section a été pensée pour transformer un visiteur en prospect qualifié, sur tous les écrans.",
    tech: ["HTML5 / CSS3", "JavaScript (filtres & interactions)", "Responsive design", "UI/UX premium"],
    link: "https://agnissanv.github.io/immo/",
    linkLabel: "Découvrir le site"
  },
  {
    id: "overdose-gym",
    title: "Overdose Gym",
    category: "web",
    categoryLabel: "Site vitrine pour salle de sport",
    year: "2026",
    tag: "Fitness & sport",
    pitch: "Une landing page haute conversion pour une salle de sport d'élite.",
    thumb: "images/projets/dev_web/overdose-gym1.png",
    gallery: [
      "images/projets/dev_web/overdose-gym.jpg",
      "images/projets/dev_web/overdose-gym2.png",
      "images/projets/dev_web/overdose-gym3.png"
    ],
    description: "L'objectif : traduire l'énergie du CrossFit dans une interface sombre et directe. Tarifs et programmes mis en avant avec des appels à l'action clairs, optimisation pour les recherches géolocalisées, et une expérience mobile pensée pour des réservations rapides.",
    tech: ["HTML5 / CSS3 avancé", "JavaScript (formulaires)", "Google Maps API", "Mobile-first"],
    link: "https://agnissanv.github.io/fitnesswebsite1/",
    linkLabel: "Voir le site"
  },
  {
    id: "lumina",
    title: "Lumina",
    category: "web",
    categoryLabel: "Site vitrine pour cabinets d'optique",
    year: "2026",
    tag: "Cabinets d'optique",
    pitch: "Minimalisme clinique et esthétique luxueuse pour l'optique haut de gamme.",
    thumb: "images/projets/dev_web/lumina1.webp",
    gallery: [
      "images/projets/dev_web/lumina2.webp",
      "images/projets/dev_web/lumina3.webp",
      "images/projets/dev_web/lumina4.webp"
    ],
    description: "Un écrin numérique pour cabinets d'optique et boutiques de lunetterie. Système de prise de rendez-vous fluide, sections dédiées aux collections, structure technique légère pour une bonne visibilité SEO, palette pensée pour évoquer sérénité et rigueur scientifique.",
    tech: ["HTML5 sémantique", "CSS3 (Flexbox & Grid)", "JavaScript ES6+", "Git / GitHub"],
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

  // App projects
  {
    id: "budget-flow",
    title: "Budget Flow",
    category: "app",
    categoryLabel: "Application mobile",
    year: "2026",
    tag: "Finance personnelle",
    pitch: "Simulez, comparez et visualisez l'évolution de votre épargne en temps réel.",
    thumb: "images/projets/app/budget-flow/1.png",
    gallery: [
      "images/projets/app/budget-flow/1.png",
      "images/projets/app/budget-flow/2.jpeg",
      "images/projets/app/budget-flow/3.jpeg",
      "images/projets/app/budget-flow/4.jpeg",
      "images/projets/app/budget-flow/5.jpeg",
      "images/projets/app/budget-flow/6.jpeg",
      "images/projets/app/budget-flow/7.jpeg",
      "images/projets/app/budget-flow/8.jpeg",
      "images/projets/app/budget-flow/9.jpeg",
      "images/projets/app/budget-flow/10.jpeg",
      "images/projets/app/budget-flow/11.jpeg",
      "images/projets/app/budget-flow/12.jpeg",
      "images/projets/app/budget-flow/13.png"
    ],
    description: "Budget Flow transforme la gestion financière personnelle en expérience visuelle et interactive. Contrairement à une calculatrice classique qui donne un chiffre figé, l'application projette l'évolution de l'épargne mois par mois sous forme de courbes animées, et répond à des questions concrètes comme « Quand atteindrai-je 1 000 000 FCFA ? ». L'utilisateur saisit son revenu, ses dépenses par catégorie et son solde actuel : l'app calcule l'épargne nette et simule la trajectoire financière sur plusieurs mois, avec des curseurs interactifs pour ajuster les chiffres en temps réel, comparer deux scénarios côte à côte, ou visualiser la répartition des dépenses par catégorie. Fonctionne entièrement hors-ligne, données stockées en local.",
    tech: ["Flutter (Dart)", "Riverpod", "Hive (stockage local)", "fl_chart", "Multi-devises (XOF, EUR, USD...)"],
    link: "downloads/budget-flow.apk",
    linkLabel: "Télécharger l'APK",
    isDownload: true,
    downloadNote: "~50 Mo · Android 5.0 ou supérieur"
  },

  // Design projects
  {
    id: "logos",
    title: "Logos",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Identité de marque",
    pitch: "Une sélection de logos conçus pour des marques et indépendants.",
    thumb: "images/projets/design/logos/1.jpg",
    gallery: [
      "images/projets/design/logos/1.jpg",
      "images/projets/design/logos/2.jpg",
      "images/projets/design/logos/3.jpg",
      "images/projets/design/logos/4.jpg",
      "images/projets/design/logos/5.jpg",
      "images/projets/design/logos/6.jpg",
      "images/projets/design/logos/7.jpg",
      "images/projets/design/logos/8.jpg",
      "images/projets/design/logos/9.jpg",
      "images/projets/design/logos/10.jpg",
      "images/projets/design/logos/11.jpg",
      "images/projets/design/logos/12.jpg"
    ],
    description: "Chaque logo est pensé pour être simple à reconnaître et à décliner sur tous les supports — carte de visite, réseaux sociaux, packaging. L'objectif : une identité qui reste lisible même en petit format.",
    isCollection: true
  },
  {
    id: "flyers",
    title: "Flyers",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Communication visuelle",
    pitch: "Des flyers percutants, pensés pour capter l'attention en quelques secondes.",
    thumb: "images/projets/design/flyers/1.jpg",
    gallery: [
      "images/projets/design/flyers/1.jpg",
      "images/projets/design/flyers/2.jpg",
      "images/projets/design/flyers/3.jpg",
      "images/projets/design/flyers/4.jpg",
      "images/projets/design/flyers/5.jpg",
      "images/projets/design/flyers/6.jpg",
      "images/projets/design/flyers/7.jpg",
      "images/projets/design/flyers/8.jpg",
      "images/projets/design/flyers/9.jpg",
      "images/projets/design/flyers/10.jpg",
      "images/projets/design/flyers/11.jpg"
    ],
    description: "Un flyer efficace transmet l'essentiel avant même d'être lu en détail. Chaque création met en avant une hiérarchie claire de l'information et un visuel qui accroche le regard.",
    isCollection: true
  },
  {
    id: "affiches",
    title: "Affiches",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Communication visuelle",
    pitch: "Des affiches pensées pour marquer, du format A4 au grand format.",
    thumb: "images/projets/design/affiches/1.jpg",
    gallery: [
      "images/projets/design/affiches/1.jpg",
      "images/projets/design/affiches/2.jpg",
      "images/projets/design/affiches/3.jpg",
      "images/projets/design/affiches/4.jpg",
      "images/projets/design/affiches/5.jpg",
      "images/projets/design/affiches/6.jpg",
      "images/projets/design/affiches/7.jpg",
      "images/projets/design/affiches/8.jpg",
      "images/projets/design/affiches/9.jpg",
      "images/projets/design/affiches/10.jpg",
      "images/projets/design/affiches/11.jpg",
      "images/projets/design/affiches/12.jpg"
    ],
    description: "Que ce soit pour un événement, une promotion ou une campagne, chaque affiche est conçue pour rester lisible et impactante, même vue de loin ou en un coup d'œil rapide.",
    isCollection: true
  },
  {
    id: "bannieres",
    title: "Bannières",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Web & réseaux sociaux",
    pitch: "Des bannières adaptées aux formats web et réseaux sociaux.",
    thumb: "images/projets/design/bannieres/1.jpg",
    gallery: [
      "images/projets/design/bannieres/1.jpg",
      "images/projets/design/bannieres/2.jpg",
      "images/projets/design/bannieres/3.jpg",
      "images/projets/design/bannieres/4.jpg",
      "images/projets/design/bannieres/5.jpg",
      "images/projets/design/bannieres/6.jpg",
      "images/projets/design/bannieres/7.jpg",
      "images/projets/design/bannieres/8.jpg",
      "images/projets/design/bannieres/9.jpg",
      "images/projets/design/bannieres/10.jpg",
      "images/projets/design/bannieres/11.jpg",
      "images/projets/design/bannieres/12.jpg"
    ],
    description: "Couvertures Facebook, bannières de site, visuels d'en-tête — chaque format a ses contraintes propres, pensées et respectées pour un rendu net sur tous les écrans.",
    isCollection: true
  },
  {
    id: "packaging",
    title: "Packaging",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Emballages & étiquettes",
    pitch: "Des emballages qui prolongent l'identité de marque jusqu'au produit.",
    thumb: "images/projets/design/packaging/1.jpg",
    gallery: [
      "images/projets/design/packaging/1.jpg",
      "images/projets/design/packaging/2.jpg",
      "images/projets/design/packaging/3.jpg",
      "images/projets/design/packaging/4.jpg",
      "images/projets/design/packaging/5.jpg",
      "images/projets/design/packaging/6.jpg",
      "images/projets/design/packaging/7.jpg",
      "images/projets/design/packaging/8.jpg"
    ],
    description: "Boîtes, sachets, étiquettes : chaque support d'emballage est pensé pour rester cohérent avec l'identité visuelle de la marque, tout en respectant les contraintes techniques d'impression et de production.",
    isCollection: true
  },
  {
    id: "goodies",
    title: "Goodies & produits dérivés",
    category: "design",
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Objets promotionnels",
    pitch: "T-shirts, casquettes, tasses, porte-clés — l'identité de marque déclinée sur l'objet.",
    thumb: "images/projets/design/goodies/1.jpg",
    gallery: [
      "images/projets/design/goodies/1.jpg",
      "images/projets/design/goodies/2.jpg",
      "images/projets/design/goodies/3.jpg",
      "images/projets/design/goodies/4.jpg",
      "images/projets/design/goodies/5.jpg",
      "images/projets/design/goodies/6.jpg",
      "images/projets/design/goodies/7.jpg",
      "images/projets/design/goodies/8.jpg",
      "images/projets/design/goodies/9.jpg",
      "images/projets/design/goodies/10.jpg",
      "images/projets/design/goodies/11.jpg",
      "images/projets/design/goodies/12.jpg"
    ],
    description: "Une bonne identité de marque doit rester reconnaissable même appliquée à un petit objet. Ces créations montrent comment un logo ou une charte graphique s'adapte aux contraintes d'un support physique, sans perdre en lisibilité.",
    isCollection: true
  }
];