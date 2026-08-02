// Données des projets — modifie ou ajoute des entrées ici, le reste est généré automatiquement.
const PROJECTS = [
  {
    id: "refuge-pop",
    title: "Refuge Pop",
    category: "web",
    categoryLabel: "Développement web",
    year: "2026",
    tag: "Plateforme de streaming",
    pitch: "Une expérience de streaming complète, sans abonnement ni serveur vidéo.",
    thumb: "images/projets/images/dev_web/refugepop1.png",
    gallery: [
      "images/projets/images/dev_web/refugepop.jpg",
      "images/projets/images/dev_web/refugepop2.png",
      "images/projets/images/dev_web/refugepop3.png",
      "images/projets/images/dev_web/refugepop4.png"
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
    categoryLabel: "Application",
    year: "2026",
    tag: "Outil pour designers",
    pitch: "L'inspiration visuelle transformée en code, en quelques secondes.",
    thumb: "images/projets/images/dev_web/palettepick1.png",
    gallery: [
      "images/projets/images/dev_web/palettepick.jpg",
      "images/projets/images/dev_web/palettepick2.png",
      "images/projets/images/dev_web/palettepick3.png"
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
    categoryLabel: "Site vitrine",
    year: "2026",
    tag: "Restaurant",
    pitch: "Une vitrine digitale pensée pour la gastronomie ivoirienne.",
    thumb: "images/projets/images/dev_web/qg-resto3.png",
    gallery: [
      "images/projets/images/dev_web/qg-resto1.jpg",
      "images/projets/images/dev_web/qg-resto2.jpg",
      "images/projets/images/dev_web/qg-resto4.png",
      "images/projets/images/dev_web/qg-resto5.png"
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
    categoryLabel: "Média digital",
    year: "2026",
    tag: "Actualité tech",
    pitch: "Une plateforme automatisée dédiée à l'actualité tech en Afrique de l'Ouest.",
    thumb: "images/projets/images/dev_web/TECH_WEST1.png",
    gallery: [
      "images/projets/images/dev_web/TECH_WEST1.png",
      "images/projets/images/dev_web/TECH_WEST2.png",
      "images/projets/images/dev_web/TECH_WEST3.png"
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
    categoryLabel: "Refonte graphique",
    year: "2026",
    tag: "Agence immobilière",
    pitch: "Une identité noire et dorée pour une agence immobilière haut de gamme.",
    thumb: "images/projets/images/dev_web/immo0.png",
    gallery: [
      "images/projets/images/dev_web/immo1.jpg",
      "images/projets/images/dev_web/immo2.jpg",
      "images/projets/images/dev_web/immo3.png",
      "images/projets/images/dev_web/immo4.png"
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
    categoryLabel: "Landing page",
    year: "2026",
    tag: "Fitness & sport",
    pitch: "Une landing page haute conversion pour une salle de sport d'élite.",
    thumb: "images/projets/images/dev_web/overdose-gym1.png",
    gallery: [
      "images/projets/images/dev_web/overdose-gym.jpg",
      "images/projets/images/dev_web/overdose-gym2.png",
      "images/projets/images/dev_web/overdose-gym3.png"
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
    categoryLabel: "Landing page premium",
    year: "2026",
    tag: "Cabinets d'optique",
    pitch: "Minimalisme clinique et esthétique luxueuse pour l'optique haut de gamme.",
    thumb: "images/projets/images/dev_web/lumina1.webp",
    gallery: [
      "images/projets/images/dev_web/lumina2.webp",
      "images/projets/images/dev_web/lumina3.webp",
      "images/projets/images/dev_web/lumina4.webp"
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
    categoryLabel: "Développement web",
    year: "2026",
    tag: "Blog / tunnel de vente",
    pitch: "Un blog en 4 pages, pensé pour attirer, rassurer et convertir.",
    thumb: "images/projets/images/dev_web/blog0.webp",
    gallery: [
      "images/projets/images/dev_web/blog1.webp",
      "images/projets/images/dev_web/blog2.webp",
      "images/projets/images/dev_web/blog3.webp",
      "images/projets/images/dev_web/blog4.webp"
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
    categoryLabel: "E-commerce",
    year: "2026",
    tag: "Boutique en ligne",
    pitch: "Un template e-commerce pensé pour transformer les visiteurs en clients.",
    thumb: "images/projets/images/dev_web/SENTIMENTALE.COM1.webp",
    gallery: [
      "images/projets/images/dev_web/SENTIMENTALE.COM2.webp",
      "images/projets/images/dev_web/SENTIMENTALE.COM3.webp",
      "images/projets/images/dev_web/SENTIMENTALE.COM4.webp"
    ],
    description: "Architecture optimisée pour la conversion : navigation intuitive, mise en avant claire des produits, structure adaptable à différents types d'activité (mode, accessoires, produits digitaux). Design responsive sur mobile, tablette et desktop.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "https://agnissanv.github.io/Site_complet_sentimentale1/",
    linkLabel: "Voir le site"
  }
];
