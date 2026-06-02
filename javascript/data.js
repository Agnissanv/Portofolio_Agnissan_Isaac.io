// ==========================================
// 1. BASE DE DONNÉES DES ARTICLES (L'objet manquant)
// ==========================================
const articles = {
    "gagner-argent-developpeur-junior": {
        title: "Comment gagner ses premiers 500 000 FCFA par mois en tant que développeur junior.",
        image: "img/article7.png",
        content: "Découvrez les stratégies simples pour générer un excellent revenu dès vos premiers mois en tant que développeur junior. Web vitrine, offres irrésistibles, maintenance, portfolio business, prospection directe."
    },
    "youtube-tue-votre-carriere": {
        title: "YouTube est en train de tuer votre carrière de développeur (et vous ne le savez même pas).",
        image: "img/article1.webp",
        content: "Pourquoi regarder des tutos ne suffit plus ? Découvrez la méthode psychologique pour enfin coder sans béquilles."
    },
    "ia-dev-web": {
        title: "L'IA va-t-elle tuer le métier de développeur ? (La vérité en 2026).",
        image: "img/article2.webp",
        content: "ChatGPT et Gemini changent la donne. Découvrez pourquoi apprendre à coder reste votre meilleur investissement en 2026."
    },
    "decrocher-premier-job-dev-sans-diplome": {
        title: "3 façons de décrocher ton premier job de développeur sans 5 ans d'expérience ni diplôme d'ingénieur",
        image: "img/article3.webp",
        content: "On vous a fait croire qu'il fallait un diplôme d'ingénieur, 5 ans d'expérience, et un CV parfait pour décrocher un job de développeur..."
    },
    "obtenir-clients-freelance-dev": {
        title: "Comment obtenir vos premiers clients en tant que développeur web freelance (même sans expérience).",
        image: "img/article4.webp",
        content: "Si vous venez de commencer en freelance et que vous n'avez aucun client, ce n'est pas un problème de compétence."
    },
    "les-7-erreurs": {
        title: "Les 7 erreurs qui empêchent les développeurs débutants de gagner de l'argent.",
        image: "img/article5.webp",
        content: "Vous savez coder… mais vous ne gagnez toujours pas d'argent ? Le problème n'est pas votre niveau..."
    },
    "generer-palette-gratuit": {
        title: "Générer une palette de couleurs à partir d'une image (outil gratuit rapide).",
        image: "img/article6_palettepick.webp",
        content: "Que vous soyez développeur, designer ou créateur de contenu, extraire les bonnes couleurs d'une image est essentiel pour garder une cohérence visuelle."
    }
};

// ==========================================
// 2. FONCTIONNALITÉ DE RECHERCHE
// ==========================================
function resetSearch() {
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('default-articles').style.display = 'block';
    document.getElementById('search-input').value = "";
}

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const defaultArticles = document.getElementById('default-articles');
    const searchResults = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-container');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const query = searchInput.value.trim().toLowerCase();
            if (query === "") {
                resetSearch();
                return;
            }

            // --- DEBUG : Vérification dans la console ---
            console.log("Recherche lancée pour :", query);

            // On vide et on switch l'affichage
            resultsContainer.innerHTML = "";
            defaultArticles.style.display = 'none';
            searchResults.style.display = 'block';

            // Filtrage
            const articlesArray = Object.keys(articles).map(id => ({ id, ...articles[id] }));
            const filtered = articlesArray.filter(article => {
                return article.title.toLowerCase().includes(query) || 
                       article.content.toLowerCase().includes(query);
            });

            if (filtered.length > 0) {
                filtered.forEach(article => {
                    // On injecte le HTML des résultats trouvés
                    resultsContainer.innerHTML += `
                        <div class="card mb-3 bg-dark border-secondary text-white">
                            <img src="${article.image}" class="card-img-top" alt="${article.title}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title text-white">${article.title}</h5>
                                <p class="card-text text-muted fs-6">${article.content}</p>
                                <a href="articles/${article.id}.html" class="btn btn-outline-danger">Lire l'article</a>
                            </div>
                        </div>`;
                });
            } else {
                resultsContainer.innerHTML = `<h3 class="text-white p-4 text-center border border-danger">Aucun résultat trouvé pour "${query}"</h3>`;
            }
        });
    }
});