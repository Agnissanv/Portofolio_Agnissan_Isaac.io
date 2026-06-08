// portfolio

function tabsFilters() {
    const tabs = document.querySelectorAll('.portfolio-filters a');
    const projets = document.querySelectorAll('.portfolio .card');

    const resetActiveLinks = () => {
        tabs.forEach(elem => {
            elem.classList.remove('active');
        })
    }

    const showProjets = (elem) => {
        console.log(elem);
        projets.forEach(projet => {
            let filter = projet.getAttribute('data-category')

            if(elem === 'all') {
                projet.parentNode.classList.remove('hide')
                return
            }

            console.log('tutu');
                // ne sera pas pris en compte !
            if(filter !== elem) {
                projet.parentNode.classList.add('hide')
            } else {
                projet.parentNode.classList.remove('hide')
            }


        });
    }

    tabs.forEach(elem => {
        elem.addEventListener('click', (event) => {
            event.preventDefault();
            let filter = elem.getAttribute('data-filter');
            showProjets(filter);
            resetActiveLinks();
            elem.classList.add('active');
        });
    })


}

tabsFilters();


function showProjectDetails() {
    const links = document.querySelectorAll('.card-link');
    const modals = document.querySelectorAll('.modal');
    const btns = document.querySelectorAll('.modal-close');

    const hideModals = () => {
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    links.forEach(elem => {
        elem.addEventListener('click', (even) => {
            even.preventDefault();
            document.querySelector(`[id=${elem.dataset.id}]`).classList.add('show')
        });
    });

    btns.forEach(btn => {
        btn.addEventListener('click', (even) => {
            hideModals();
        });
    });
}

showProjectDetails();

// effets
// effets
// effets


const observerIntersectionAnimation = () => {
    const sections = document.querySelectorAll('section');
    const skills = document.querySelectorAll('.skills .bar');



    sections.forEach((section, index) => {
        if (index === 0) return;
        section.style.opacity = "0";
        section.style.transition = "all 1.6s";
    });

    
    skills.forEach((elem, index) => {
        elem.style.width = "0";
        elem.style.transition = "all 1.6s";
    });

    let sectionObsever = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let elem = entry.target;
                elem.style.opacity = 1;
            }
        });
    });

    sections.forEach(section => {
        sectionObsever.observe(section);
    });



    let skillsObsever = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let elem = entry.target;
                elem.style.width = elem.dataset.width + '%';
            }
        });
    });

    skills.forEach(skill => {
        skillsObsever.observe(skill);
    });
}

observerIntersectionAnimation();


// section chiffrée
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter-anim');
    
    const startCounting = (entries, observer) => {
        entries.forEach(entry => {
            // Se déclenche quand la carte devient visible à l'écran
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                
                // Paramètres de l'animation
                const duration = 2000; // Durée de l'animation en ms (2 secondes)
                const frameRate = 1000 / 60; // Environ 60 images par seconde
                const totalFrames = Math.round(duration / frameRate);
                let currentFrame = 0;
                
                const updateCount = () => {
                    currentFrame++;
                    
                    // Calcul d'interpolation "Ease-out" (ralentit à la fin)
                    const progress = currentFrame / totalFrames;
                    const easeOut = progress * (2 - progress); 
                    const currentCount = Math.round(target * easeOut);

                    if (currentFrame < totalFrames) {
                        counter.innerText = prefix + currentCount + suffix;
                        requestAnimationFrame(updateCount); // Animation ultra-fluide gérée par le navigateur
                    } else {
                        // Valeur finale exacte
                        counter.innerText = prefix + target + suffix;
                    }
                };
                
                updateCount();
                
                // On arrête d'observer pour que l'animation ne se joue qu'une seule fois
                observer.unobserve(counter);
            }
        });
    };

    // L'Intersection Observer détecte le moment du scroll
    const observer = new IntersectionObserver(startCounting, {
        threshold: 0.5 // Déclenche quand la carte est visible à 50%
    });

    counters.forEach(counter => observer.observe(counter));
});

// <!-- Gestion du Service Worker -->
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('PWA Code A-Z : Prête (Service Worker OK)'))
                    .catch(err => console.log('Erreur PWA :', err));
                });
            }

        // <!-- Gestion de la fermeture automatique du menu -->
            // 1. Gestion de la fermeture automatique
            const menuContent = document.getElementById('navbarSupportedContent');
            const bsCollapse = new bootstrap.Collapse(menuContent, {toggle: false});

            // On sélectionne TOUS les liens cliquables (liens normaux + items dans les dropdowns)
            const allLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');

            allLinks.forEach((l) => {
                l.addEventListener('click', (e) => { 
                    // CONDITION CRUCIALE : 
                    // Si l'élément cliqué possède la classe 'dropdown-toggle', on ne fait RIEN.
                    // On laisse Bootstrap gérer l'ouverture du sous-menu.
                    if (l.classList.contains('dropdown-toggle')) {
                        return; 
                    }

                    // Pour tous les autres (liens directs ou items de sous-menus) :
                    if (window.innerWidth < 992) { 
                        bsCollapse.hide(); 
                    }
                });
            });

            // 2. Fermeture automatique dès que l'utilisateur SCROLLE
            window.addEventListener('scroll', () => {
                if (menuContent.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });

        // <!-- Gestion du formulaire de contact -->
            document.getElementById('contactForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const btn = document.getElementById('submitBtn');
                const status = document.getElementById('formStatus');

                btn.textContent = 'Envoi en cours...';
                btn.disabled = true;

                const data = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(this)
                }).then(r => r.json());

                if (data.success) {
                status.textContent = '✅ Message envoyé ! Je vous réponds sous 24h.';
                status.style.color = '#28a745';
                this.reset();
                } else {
                status.textContent = '❌ Une erreur est survenue. Réessayez.';
                status.style.color = '#dc3545';
                }

                status.style.display = 'block';
                btn.textContent = 'Envoyer mon projet';
                btn.disabled = false;
            });