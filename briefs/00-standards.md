# Standards communs à tous les sites du portfolio

Ce qu'on a appris en optimisant Code A-Z. À appliquer dès la création : ça évite de tout reprendre après.

## 1. Un site "montrable"
- **4 à 6 pages ou vues distinctes**, chacune belle en capture d'écran (accueil, page métier, page équipe/produits, contact ou réservation). Le portfolio affiche 3 à 5 captures par site.
- **Un écran d'accueil fort** : c'est la vignette du portfolio (1440 × 900). Un titre clair, un visuel, un bouton.
- **Au moins une interaction qui se voit** : filtre, recherche, panier, formulaire, calculateur, réservation. C'est ce qui distingue un site vivant d'une simple page.
- **Un vrai contenu réaliste** : noms, prix en FCFA, quartiers d'Abidjan (Cocody, Plateau, Marcory, Riviera, Yopougon, Treichville…), horaires. Pas de "Lorem ipsum".

## 2. Vitesse
- **Polices hébergées sur le site** (pas de Google Fonts). Fichiers WebP/woff2 dans le dossier du site. Deux familles maximum.
- **Images en WebP**, 1 600 px de large maximum, 80 % de qualité. Pas de PNG/JPG lourds.
- **Pas de bibliothèque lourde** (jQuery, Bootstrap complet, sliders) si un peu de CSS/JS suffit.
- **Images sous le pli en `loading="lazy"`**, sauf la première image visible.
- Objectif : **moins de 500 Ko** au chargement de l'accueil.

## 3. Accessibilité
- **Contraste** texte/fond d'au moins 4,5 pour 1 (7 pour 1 pour les petits textes gris). Vérifier les gris clairs et les textes sur photo.
- **Texte alternatif** sur chaque image, qui décrit ce qu'on voit.
- **Un seul `<h1>`** par page, titres dans l'ordre. Les boutons sont de vrais `<button>`, les liens de vrais `<a>`.
- **Navigation au clavier** possible, avec un contour visible au focus.
- `lang="fr"` sur la page, `<title>` et `meta description` uniques par page.

## 4. Formulaires et données
- Ne demander que le nécessaire (nom, téléphone, message). Pas de date de naissance ni de pièce d'identité pour une simple demande.
- **Case de consentement** avant l'envoi, avec un lien vers la politique de confidentialité.
- Pour une démo, ne branche pas de vrais envois : simule la confirmation ("Demande reçue").
- Les **paiements Mobile Money** d'une démo sont simulés (écran de confirmation), jamais reliés à un vrai compte.

## 5. Contenu à éviter (risque juridique)
- Pas de **fausses certifications ou accréditations** ("certifié ISO", "agréé", "n° 1 en Afrique") sur un site qui montrera un vrai nom.
- Pas de **vrais noms de personnes, avocats, médecins ou écoles**. Invente des noms plausibles, sans lien avec des personnes réelles.
- Pas d'**allégations médicales** ni de promesses de résultat garanti.
- Pas de **photos volées** : utilise des banques d'images libres de droits (vérifie la licence commerciale) ou des photos du client avec accord écrit.

## 6. Référencement de base
- Une `meta description` et un `<title>` uniques par page.
- Balisage `LocalBusiness` (schema.org) sur l'accueil quand il s'agit d'une entreprise locale : nom, adresse, téléphone, horaires.
- URL lisibles (`/services`, `/contact`), pas de `page1.html`.

## 7. Avant d'envoyer le lien pour le portfolio
- [ ] Ouvre bien sur mobile (390 px) et sur ordinateur (1440 px).
- [ ] Toutes les images s'affichent, aucune erreur dans la console du navigateur.
- [ ] Aucun texte illisible (contraste).
- [ ] Le site est en ligne sur Vercel, accessible sans connexion.
- [ ] Tu connais le **secteur** exact (liste dans `js/projects-data.js`, `SECTOR_FAMILIES`).
