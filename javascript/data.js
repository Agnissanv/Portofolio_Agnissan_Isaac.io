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

            // On vide le conteneur et on bascule l'affichage
            resultsContainer.innerHTML = "";
            defaultArticles.style.display = 'none';
            searchResults.style.display = 'block';

            // AUTOMATION : On récupère la liste des cartes d'articles directement du HTML
            const cards = defaultArticles.querySelectorAll('.card');
            let totalResults = 0;

            cards.forEach(card => {
                // On extrait les informations de la carte HTML courante
                const titleElement = card.querySelector('.card-title');
                const textElement = card.querySelector('.card-text'); // Récupère la description
                const imgElement = card.querySelector('.card-img-top');
                const linkElement = card.querySelector('a'); // Récupère le lien de l'article

                const title = titleElement ? titleElement.innerText : "";
                const content = textElement ? textElement.innerText : "";
                const imgSrc = imgElement ? imgElement.getAttribute('src') : "";
                const linkHref = linkElement ? linkElement.getAttribute('href') : "#";

                // On vérifie si la recherche de l'utilisateur correspond au titre ou à la description
                if (title.toLowerCase().includes(query) || content.toLowerCase().includes(query)) {
                    totalResults++;
                    
                    // On injecte dynamiquement le résultat trouvé dans la zone de recherche
                    resultsContainer.innerHTML += `
                        <div class="card mb-3 bg-dark border-secondary text-white">
                            <img src="${imgSrc}" class="card-img-top" alt="${title}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title text-white">${title}</h5>
                                <p class="card-text text-muted fs-6">${content}</p>
                                <a href="${linkHref}" class="btn btn-outline-danger">Lire l'article</a>
                            </div>
                        </div>`;
                }
            });

            // Si aucun article ne correspond
            if (totalResults === 0) {
                resultsContainer.innerHTML = `<h3 class="text-white p-4 text-center border border-danger">Aucun résultat trouvé pour "${query}"</h3>`;
            }
        });
    }
});