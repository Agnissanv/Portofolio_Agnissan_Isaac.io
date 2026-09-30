# Brief 3 · Boutique en ligne avec paiement Mobile Money

**Secteur dans le portfolio** : `Produits artisanaux & locaux` (famille Commerce & Retail)
**Tag** : `E-commerce · Mobile Money`
**Niveau** : e-commerce complet (le plus important à montrer)
**Effort estimé** : 5 à 7 jours

## Cible et promesse
Une boutique de produits locaux et artisanaux ivoiriens (pagnes, savons au karité, bijoux, épices, cosmétiques naturels) qui vend en ligne. Le point qui compte : **payer avec Orange Money, MTN MoMo, Moov Money ou Wave**, comme en vrai. C'est ce qui manque dans ton portfolio : Sentimentale est un modèle, pas un cas de paiement local.
Nom fictif suggéré : *Kôra Maison*.

## Identité visuelle
- **Ambiance** : chaleureuse, artisanale, premium. Elle doit donner envie d'offrir.
- **Palette** : terre cuite `#B4532A`, sable `#F2E6D4`, ocre `#D9A441`, vert olive `#4A5A34`, texte `#2B211B`.
- **Typo** : un serif expressif pour les titres (ex. *Fraunces*), *DM Sans* pour le texte.
- **Images** : produits sur fond neutre, mains d'artisans, matières et motifs. 12 produits minimum.

## Pages
1. **Accueil**
2. **Boutique** (grille de produits avec filtres)
3. **Fiche produit**
4. **Panier**
5. **Paiement** (les 4 moyens Mobile Money + paiement à la livraison)
6. **Confirmation de commande**
7. **Notre histoire / contact** (une seule page)

## Accueil : sections
1. Grand visuel + titre ("L'artisanat ivoirien, livré chez vous.") + bouton *Voir la boutique*.
2. Catégories (Mode, Beauté naturelle, Maison, Épicerie fine).
3. Produits vedettes.
4. Bandeau de confiance : paiement Mobile Money, livraison à Abidjan et en province, retours sous 7 jours.
5. L'histoire des artisans.
6. Avis clients.
7. Inscription à l'infolettre (facultative, avec case de consentement).

## Fonctionnalités clés
- **Filtres et tri** : catégorie, prix en FCFA, disponibilité. Recherche instantanée.
- **Panier persistant** (localStorage) avec quantité modifiable et total en FCFA.
- **Calcul de la livraison** selon la commune (Abidjan par quartier, autres villes).
- **Parcours de paiement simulé** : choix de l'opérateur, saisie du numéro, écran "Confirmez sur votre téléphone", puis confirmation de commande. Tout est simulé, aucun vrai compte n'est utilisé.
- **Suivi de commande** en 4 étapes (reçue, préparée, en livraison, livrée) avec un numéro de commande.
- **Paiement à la livraison** en option.

## Contenu à préparer
- 12 produits avec nom, prix (de 2 500 à 45 000 FCFA), description courte, 2 photos.
- Grille des frais de livraison.
- Textes de confiance (retours, paiement sécurisé, contact).

## Pour le vrai paiement (quand un client réel achètera)
Ne code pas les paiements Mobile Money à la main. On passe par un **agrégateur de paiement** qui gère Orange Money, MTN, Moov et Wave (par exemple CinetPay ou un équivalent). À vérifier avec le client : frais, délais de versement, documents demandés. Pour le portfolio, la simulation suffit.

## Points de vigilance
- Ne jamais afficher un vrai numéro de téléphone ou un vrai compte de paiement.
- Toujours afficher les **prix TTC en FCFA** et les frais de livraison avant de payer.
- Les données de paiement ne sont jamais stockées côté site.

## Pour la fiche portfolio
- `categoryLabel` : "Boutique en ligne avec paiement Mobile Money"
- `pitch` : "Une boutique de produits artisanaux ivoiriens avec panier, livraison par commune et paiement Mobile Money."
- `tech` : HTML5 / CSS3, JavaScript (panier, filtres, parcours de paiement), Responsive design
