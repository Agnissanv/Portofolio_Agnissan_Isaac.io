document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ANIMATIONS AU DÉFILEMENT (REVEAL) - L'effet "Premium"
       ========================================================================== */
    // L'Intersection Observer détecte quand un élément entre dans l'écran
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // L'animation se déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément est dans le champ de vision
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // On arrête de l'observer pour que l'animation ne se joue qu'une fois
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // On cible tous les éléments qui ont la classe "reveal"
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    /* ==========================================================================
       2. ACCORDÉON FAQ - L'expérience utilisateur sans friction
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        // On écoute le clic sur la zone de la question
        if (question) {
            question.addEventListener('click', () => {
                // On utilise 'open' au lieu de 'active' pour éviter le conflit avec le scroll
                item.classList.toggle('open');
            });
        }
    });

    /* ==========================================================================
       3. NAVIGATION FLUIDE (SMOOTH SCROLL) POUR LES CALL-TO-ACTION
       ========================================================================== */
    // Rend le clic sur les boutons d'ancrage (ex: href="#postuler") doux et professionnel
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // On ignore si le lien est juste "#"
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});