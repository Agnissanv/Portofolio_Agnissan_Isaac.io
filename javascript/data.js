// 1. On sort resetSearch pour le bouton "Retour"
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
            console.log("Base de données articles :", articles);

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
                    // On injecte le HTML
                    resultsContainer.innerHTML += `
                        <div class="card mb-3 bg-dark border-secondary">
                            <img src="${article.image}" class="card-img-top" alt="${article.title}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title text-white">${article.title}</h5>
                                <a href="article.html?id=${article.id}" class="btn btn-outline-danger">Lire l'article</a>
                            </div>
                        </div>`;
                });
            } else {
                resultsContainer.innerHTML = `<h3 class="text-white p-4 text-center border border-danger">Aucun résultat trouvé pour "${query}"</h3>`;
            }
        });
    }
});



function displayArticles() {
    const container = document.getElementById('default-articles');

    if (!container) {
        console.error("Container introuvable !");
        return;
    }

    container.innerHTML = "";

    const articlesArray = Object.keys(articles).map(id => ({
        id,
        ...articles[id]
    }));

    articlesArray.forEach(article => {
        // On crée l'URL complète de l'article pour le partage
    const articleUrl = `https://agnissanv.github.io/Portofolio_Agnissan_Isaac.io/article.html?id=${article.id}`;

        container.innerHTML += `
            <div class="card mb-3">
                <img src="${article.image}" class="card-img-top" loading="lazy" alt="${article.title}">
                <div class="card-body">
                    <h5>${article.title}</h5>
                    <p class="text-muted">${article.date}</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a href="article.html?id=${article.id}" class="btn btn-danger">
                            Lire l'article
                        </a>
                        <button 
                            class="btn btn-outline-danger btn-share-article" 
                            data-title="${article.title}" 
                            data-url="${articleUrl}"
                            title="Partager l'expertise">
                            Partager <i class="bi bi-share-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Une fois que les articles sont affichés, on active les boutons de partage
    setupShareButtons();
}

function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.btn-share-article');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            // On récupère les données spécifiques à l'article cliqué
            const title = btn.getAttribute('data-title');
            const url = btn.getAttribute('data-url');

            const shareData = {
                title: title,
                text: `Découvre cet article sur Code A-Z : ${title}`,
                url: url
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback : copier le lien si le partage natif n'existe pas (ex: sur PC)
                    await navigator.clipboard.writeText(url);
                    alert("Lien de l'article copié dans le presse-papier !");
                }
            } catch (err) {
                console.log('Erreur de partage:', err);
            }
        });
    });
}

// On lance l'affichage
window.addEventListener("load", displayArticles);