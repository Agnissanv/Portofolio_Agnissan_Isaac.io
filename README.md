# Code A-Z — Portfolio & Agence

Site personnel d'Agnissan Isaac (Code A-Z), développeur full-stack à Abidjan, Côte d'Ivoire.
Site statique (HTML / CSS / JavaScript), sans framework, déployé sur Vercel.

---

## Structure du projet

```
/
├── index.html                  → Page d'accueil (hero, à propos, services, portfolio, tarifs, contact)
├── blog.html                   → Liste des articles de blog
├── robots.txt                  → Autorise les moteurs de recherche à explorer le site
├── sitemap.xml                 → Généré automatiquement — ne jamais éditer à la main
│
├── css/
│   └── styles.css              → Feuille de style unique pour tout le site
│
├── js/
│   ├── app.js                  → Logique du site (nav, portfolio, modale, formulaire)
│   └── projects-data.js        → Données des projets du portfolio
│
├── img/                        → Logo et éléments de marque
├── images/
│   ├── projets/                → Images des projets du portfolio
│   └── blog/                   → Images des articles (un sous-dossier par article, voir plus bas)
│
├── content/
│   ├── posts/                  → Articles de blog en Markdown (.md) — SOURCE, à éditer ici
│   └── jobs/                   → Fiches de poste en JSON — SOURCE, à éditer ici
│
├── blog/                       → Généré automatiquement à partir de content/posts — ne pas éditer à la main
│   ├── posts.json
│   └── <slug>.html (un par article)
│
├── emploi/
│   ├── index.html                     → Liste des postes (page écrite à la main)
│   ├── pourquoi-nous-rejoindre.html   → Page écrite à la main
│   ├── jobs.json                      → Généré automatiquement — ne pas éditer à la main
│   └── <slug>.html (un par poste, généré automatiquement)
│
├── scripts/
│   ├── build-blog.js           → Génère blog/<slug>.html à partir de content/posts/*.md
│   ├── build-jobs.js           → Génère emploi/<slug>.html à partir de content/jobs/*.json
│   └── build-sitemap.js        → Génère sitemap.xml à partir de tout ce qui précède
│
└── package.json
```

**Règle d'or : tout ce qui est dans `blog/`, `emploi/*.html` (sauf `index.html` et `pourquoi-nous-rejoindre.html`) et `sitemap.xml` est généré automatiquement.** Ne jamais éditer ces fichiers à la main — les modifications seraient écrasées au prochain `npm run build`. Toujours éditer la source (`content/posts/`, `content/jobs/`).

---

## Installation (sur un nouvel ordinateur, ou après un clone GitHub)

```
npm install
```
Installe les deux dépendances nécessaires (`gray-matter`, `markdown-it`) pour que les scripts fonctionnent.

---

## Commande unique à retenir

```
npm run build
```

Régénère, dans l'ordre : les articles de blog, les fiches de poste, puis le sitemap. **C'est la seule commande à taper après n'importe quelle modification de contenu.**

---

## Ajouter un nouvel article de blog

1. Crée un fichier `.md` dans `content/posts/`, nommé en minuscules avec des tirets (ex. `combien-coute-un-site-web-en-cote-divoire.md`)
2. En-tête obligatoire en haut du fichier :
   ```
   ---
   title: "Titre de l'article"
   date: "2026-08-10"
   excerpt: "Résumé en une phrase, utilisé dans les balises SEO et sur la carte du blog."
   cover: "images/blog/combien-coute-un-site-web-en-cote-divoire/cover.jpg"
   tags: ["Tarifs", "Conseils"]
   ---
   ```
3. Écris le contenu en Markdown juste en dessous (titres avec `##`, listes avec `-`, etc.)
4. Place les images de l'article dans `images/blog/<nom-du-fichier-sans-.md>/`
5. Lance `npm run build`
6. Vérifie en local, puis `git add .` / `git commit` / `git push`

---

## Ajouter un nouveau poste (emploi)

1. Duplique un fichier existant dans `content/jobs/` (ex. `developpeur-front-end.json`) et renomme-le selon le nouveau poste
2. Modifie tous les champs (`slug`, `title`, `missionList`, `faqGroups`, etc.)
3. Lance `npm run build`
4. `git add .` / `git commit` / `git push`

---

## Ajouter un nouveau projet au portfolio

Éditer uniquement `js/projects-data.js` — ajouter un nouveau bloc dans le tableau `PROJECTS`. Le champ `category` doit être exactement `"web"`, `"design"` ou `"app"` (contrôle le filtre). Rien d'autre à modifier — le rendu est automatique.

---

## Déploiement

Le site est connecté à Vercel via GitHub : chaque `git push` sur la branche `main` déclenche un redéploiement automatique (1-2 minutes).

**Réglages Vercel importants** (Settings → Build and Deployment) :
- Framework Preset : `Other`
- Build Command : vide (override activé)
- Output Directory : `.` (override activé)

Ce site est 100 % statique — Vercel ne doit rien "construire" lui-même, il sert juste les fichiers tels quels.

---

## Modèle économique des collaborateurs (repère interne)

Sur un contrat où Agnissan délègue le développement à un collaborateur front-end (rôle de chef de projet) :

1. Prix du contrat
2. − Commission commercial (30 %, si apporté par un commercial)
3. − Frais réels d'hébergement / nom de domaine (1ère année)
4. = Base restante → 70 % développeur principal / 30 % chef de projet

---

## Charte graphique (repère rapide)

- Fond : `#F1EFEB` (clair, texture de points)
- Accent unique : rouge marque `#C6303E`
- Titres : Newsreader (serif)
- Texte courant : Inter
- Labels / eyebrows : JetBrains Mono
