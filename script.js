document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loader = document.querySelector('.loader');
    const loaderLogo = document.querySelector('.loader-logo');

    // Animate initials
    setTimeout(() => {
        loaderLogo.style.opacity = '1';
    }, 100);

    // Remove loader after 2.5 seconds
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.style.overflow = 'visible'; // allow scrolling

        // Trigger initial animations for elements in viewport
        setTimeout(() => {
            document.querySelectorAll('.hidden').forEach(el => {
                if (isElementInViewport(el)) {
                    el.classList.add('show');
                }
            });
        }, 500); // Wait for loader to fade
    }, 2500);

    // Initial state to prevent scroll during loading
    document.body.style.overflow = 'hidden';



    // 3. Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 4. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 6. Scroll-Triggered Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // Helper to check if element is in viewport for initial load
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 7. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            // Trigger section active state when it reaches the top third of the viewport
            // (using a fixed threshold or viewport height instead of sectionHeight)
            if (scrollY >= (sectionTop - window.innerHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 8. Carousel Navigation
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => {
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const screenshots = container.querySelector('.project-screenshots');

        // Scroll amount is roughly the width of one image + gap
        const scrollAmount = 266;

        if (prevBtn && nextBtn && screenshots) {
            prevBtn.addEventListener('click', () => {
                screenshots.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                screenshots.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });

    // 9. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentGalleryImages = [];
    let currentImageIndex = 0;

    const zoomableImages = document.querySelectorAll('.zoomable-image');

    zoomableImages.forEach((img) => {
        img.addEventListener('click', (e) => {
            // Find all images in the same gallery
            const gallery = e.target.closest('.project-screenshots');
            if (gallery) {
                currentGalleryImages = Array.from(gallery.querySelectorAll('.zoomable-image'));
                currentImageIndex = currentGalleryImages.indexOf(e.target);

                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    function updateLightboxImage() {
        if (currentGalleryImages.length > 0) {
            lightboxImg.src = currentGalleryImages[currentImageIndex].src;
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'visible';
            }
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                updateLightboxImage();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
                updateLightboxImage();
            }
        });
    }

    // 10. Translation Logic
    const translations = {
        en: {
            navHome: "Home",
            navProjects: "Projects",
            navContact: "Contact",
            greeting: "Hello, I'm Alexandre Bonnegarde-Delisle",
            heroTitle: "Developing <span class=\"accent\">mobile applications</span> and <span class=\"accent\">games</span>.",
            heroSubtitle: "Frontend Developer",
            aboutText1: "I’m a mobile and game developer with a focus on Flutter and Unity 3D. I enjoy building apps and games that are fun, functional, and easy to use.",
            aboutText2: "I like tackling both the technical side (<b>Coding</b>, <b>Optimization</b>, <b>Multiplayer systems</b>) and the creative side (<b>Design</b>, <b>UX</b>). My goal is to create projects that people enjoy and find useful.",
            btnProjects: "View my projects",
            btnContact: "Get in touch",
            skillsTitle: "Skills",
            projectsTitle: "Projects",
            ffaTag: "Mobile Game",
            ffaDesc: "Explore Freddy’s Flipping Adventure, a 2D platform mobile game guiding Freddy, a brave dog, through obstacle-filled levels with bonuses. Play online with friends and other players and climb the leaderboards!",
            cendTag: "Mobile Application",
            cendDesc: "CEND captures and retrieves sales, purchase, and expense invoices from various platforms. Track real-time activity, tax returns, and social security contributions. Stay connected with your accounting firm for enhanced proximity. New surprises and management modules are updated annually for improved performance.",
            studentTitle: "Student Projects",
            sirenDesc: "Siren: Rex Maria is set in a 1940s cruise ship wreck. As a diver, your mission is to uncover the ship’s mysterious sinking. But you’re unprepared for what lies within… What's inside? What’s real?",
            microDecayDesc1: "MicroDecay is a puzzle and adventure game.",
            microDecayDesc2: "Craft and recycle your tools to move forward in the game and resolve riddles!",
            chaosRunDesc: "Chaos Run is a co-op game where you and a friend escape a military base by stealing a parcel with a forklift. It requires dexterity and patience to complete!",
            itchBtn: "See on Itch.io",
            contactTitle: "Let's build something extraordinary together.",
            contactDesc: "Currently open for new opportunities. I'll try my best to get back to you!",
            formName: "Name",
            formNamePlaceholder: "John Doe",
            formEmail: "Email",
            formMessage: "Message",
            formMessagePlaceholder: "Your message here...",
            formSend: "Send Message",
            downloadAppStore: "Download on the",
            downloadPlayStore: "GET IT ON",
            navExperience: "Experience",
            experienceTitle: "Experience",
            exp1Date: "2025 – present",
            exp1Title: "Unity Game Developer",
            exp1Company: "Freestyle Trampoline Association",
            exp1Location: "Toronto, Remote",
            exp1Task1: "Developed a 2D mobile platformer in Unity (C#) with custom character controller, gameplay mechanics (jumps, tricks, power-ups).",
            exp1Task2: "Integrated Firebase (notifications, player data), Photon Engine (multiplayer, matchmaking), Unity IAP & Ads (monetization).",
            exp1Task3: "Designed and implemented UI/UX features.",
            exp2Title: "Mobile Application Developer",
            exp2Company: "Parallele Intelligence",
            exp2Location: "Montreal, Remote",
            exp2Task1: "Built a cross-platform app with Flutter/Dart, enhanced by advanced AI language models.",
            exp2Task2: "Implemented real-time multilingual translation, smart content optimization, and accessibility features.",
            exp2Task3: "Added analytics tools to measure and reduce the digital carbon footprint.",
            exp3Date: "2022 – present",
            exp3Title: "Analyst-Programmer",
            exp3Company: "Infotel Conseil",
            exp3Location: "Blagnac, France",
            exp3Task1: "Designed and maintained automated tests in Java + Appium for Groupe BPCE (70% coverage).",
            exp3Task2: "Worked closely with developers and Product Owners to ensure high-quality software delivery.",
            exp3Task3: "Developed a customer loyalty app for Air France in C# .NET.",
            exp4Title: "Lead Mobile Developer",
            exp4Company: "Linkall",
            exp4Location: "Toulouse, France",
            exp4Task1: "Redesigned the mobile front-end of an ERP app (CEND) using Flutter/Dart for iOS & Android.",
            exp4Task2: "Led a UI/UX overhaul to improve user experience.",
            exp4Task3: "Managed a team of 5 developers using Scrum methodology.",
            exp4Task4: "Integrated features such as OCR, geolocation, biometric authentication, cloud services and FCM for Push Notifications",
            exp5Title: "Unity Developer",
            exp5Company: "Gate22",
            exp5Location: "Toulouse, France",
            exp5Task1: "Developed a VR art project in Unity (C#) for exhibitions.",
            exp5Task2: "Implemented a finite state machine (FSM) to handle avatar behaviors (movement, interactions, etc.)."
        },
        fr: {
            navHome: "Accueil",
            navProjects: "Projets",
            navContact: "Contact",
            greeting: "Bonjour, je suis Alexandre Bonnegarde-Delisle",
            heroTitle: "Développement d'<span class=\"accent\">applications mobiles</span> et de <span class=\"accent\">jeux</span>.",
            heroSubtitle: "Développeur Frontend",
            aboutText1: "Je suis développeur mobile et de jeux vidéo, spécialisé dans Flutter et Unity 3D. J'aime créer des applications et des jeux ludiques, fonctionnels et faciles à utiliser.",
            aboutText2: "J'aime relever les défis tant du côté technique (<b>Code</b>, <b>Optimisation</b>, <b>Multijoueurs</b>) que créatif (<b>Design</b>, <b>UX</b>). Mon objectif est de créer des projets que les gens apprécient et trouvent utiles.",
            btnProjects: "Voir mes projets",
            btnContact: "Me contacter",
            skillsTitle: "Compétences",
            projectsTitle: "Projets",
            ffaTag: "Jeu Mobile",
            ffaDesc: "Découvrez Freddy’s Flipping Adventure, un jeu de plateforme 2D où vous guidez Freddy, un chien courageux, à travers des niveaux remplis d'obstacles et de bonus. Jouez en ligne avec vos amis et grimpez dans le classement !",
            cendTag: "Application Mobile",
            cendDesc: "CEND capture et récupère les factures de ventes, d'achats et de frais depuis diverses plateformes. Suivez l'activité, les déclarations fiscales et les cotisations sociales en temps réel. Restez connecté avec votre cabinet d'expertise comptable.",
            studentTitle: "Projets Étudiants",
            sirenDesc: "Siren: Rex Maria se déroule dans l'épave d'un navire de croisière des années 1940. En tant que plongeur, votre mission est d'enquêter. Mais vous n'êtes pas préparé à ce qui s'y cache…",
            microDecayDesc1: "MicroDecay est un jeu d'aventure et de réflexion.",
            microDecayDesc2: "Fabriquez et recyclez vos outils pour avancer dans le jeu et résoudre des énigmes !",
            chaosRunDesc: "Chaos Run est un jeu en coopération où vous et un ami vous échappez d'une base militaire en volant un colis avec un chariot élévateur.",
            itchBtn: "Voir sur Itch.io",
            contactTitle: "Construisons quelque chose d'extraordinaire ensemble.",
            contactDesc: "Actuellement ouvert à de nouvelles opportunités. Je ferai de mon mieux pour vous répondre au plus vite !",
            formName: "Nom",
            formNamePlaceholder: "Jean Dupont",
            formEmail: "E-mail",
            formMessage: "Message",
            formMessagePlaceholder: "Votre message ici...",
            formSend: "Envoyer le message",
            downloadAppStore: "Télécharger dans l'",
            downloadPlayStore: "DISPONIBLE SUR",
            navExperience: "Expérience",
            experienceTitle: "Parcours Professionnel",
            exp1Date: "2025 – présent",
            exp1Title: "Développeur de Jeux Unity",
            exp1Company: "Freestyle Trampoline Association",
            exp1Location: "Toronto, À distance",
            exp1Task1: "Développement d'un jeu de plateforme mobile 2D dans Unity (C#) avec un contrôleur de personnage personnalisé et des mécaniques de jeu (sauts, figures, bonus).",
            exp1Task2: "Intégration de Firebase (notifications, données joueurs), Photon Engine (multijoueur, matchmaking), Unity IAP & Ads (monétisation).",
            exp1Task3: "Conception et implémentation de fonctionnalités UI/UX.",
            exp2Title: "Développeur d'Applications Mobiles",
            exp2Company: "Parallele Intelligence",
            exp2Location: "Montréal, À distance",
            exp2Task1: "Création d'une application multiplateforme avec Flutter/Dart, améliorée par des modèles d'IA avancés.",
            exp2Task2: "Implémentation de la traduction multilingue en temps réel, de l'optimisation de contenu intelligente et de fonctionnalités d'accessibilité.",
            exp2Task3: "Ajout d'outils d'analyse pour mesurer et réduire l'empreinte carbone numérique.",
            exp3Date: "2022 – présent",
            exp3Title: "Analyste-Programmeur",
            exp3Company: "Infotel Conseil",
            exp3Location: "Blagnac, France",
            exp3Task1: "Conception et maintenance de tests automatisés en Java + Appium pour le Groupe BPCE (couverture de 70%).",
            exp3Task2: "Collaboration étroite avec les développeurs et les Product Owners pour assurer la livraison de logiciels de haute qualité.",
            exp3Task3: "Développement d'une application de fidélité client pour Air France en C# .NET.",
            exp4Title: "Développeur Mobile Lead",
            exp4Company: "Linkall",
            exp4Location: "Toulouse, France",
            exp4Task1: "Refonte du front-end mobile d'une application ERP (CEND) en utilisant Flutter/Dart pour iOS & Android.",
            exp4Task2: "Direction d'une refonte UI/UX pour améliorer l'expérience utilisateur.",
            exp4Task3: "Gestion d'une équipe de 5 développeurs en utilisant la méthodologie Scrum.",
            exp4Task4: "Intégration de fonctionnalités telles que l'OCR, la géolocalisation, l'authentification biométrique, les services cloud et FCM pour les notifications push.",
            exp5Title: "Développeur Unity",
            exp5Company: "Gate22",
            exp5Location: "Toulouse, France",
            exp5Task1: "Développement d'un projet d'art en réalité virtuelle dans Unity (C#) pour des expositions.",
            exp5Task2: "Implémentation d'une machine à états finis (FSM) pour gérer les comportements d'avatars (mouvements, interactions, etc.)."
        }
    };

    let currentLang = 'en';
    const langToggleBtn = document.getElementById('lang-toggle');

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'fr' : 'en';
            langToggleBtn.textContent = currentLang === 'en' ? 'FR' : 'EN';

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[currentLang][key]) {
                    el.innerHTML = translations[currentLang][key];
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (translations[currentLang][key]) {
                    el.placeholder = translations[currentLang][key];
                }
            });
        });
    }

    // ---------------------------------------------------------------
    // YouTube spotlight: auto-fetch titles, channels, durations & views
    // ---------------------------------------------------------------
    // The API key lives in config.js (gitignored). To enable automatic stats:
    //   1. Go to https://console.cloud.google.com/apis/credentials and create an API key
    //   2. Restrict the key to "YouTube Data API v3" + your domain (HTTP referrer)
    //   3. Paste it inside config.js → window.PORTFOLIO_CONFIG.YOUTUBE_API_KEY
    // Without a key, thumbnails still display but views/durations stay as "—".
    const YOUTUBE_API_KEY = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.YOUTUBE_API_KEY) || '';

    const videoCards = document.querySelectorAll('.video-card[data-video-id]');
    if (videoCards.length > 0 && YOUTUBE_API_KEY) {
        loadYouTubeStats(videoCards);
    }

    // Featured banner: replace static image with embedded YouTube trailer on click
    const trailerBanner = document.querySelector('.featured-banner[data-trailer-id]');
    if (trailerBanner) {
        const playTrailer = () => {
            if (trailerBanner.classList.contains('is-playing')) return;
            const id = trailerBanner.dataset.trailerId;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
            iframe.title = 'Trailer';
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            trailerBanner.classList.add('is-playing');
            trailerBanner.appendChild(iframe);
        };
        trailerBanner.addEventListener('click', playTrailer);
        trailerBanner.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playTrailer();
            }
        });
    }

    function loadYouTubeStats(cards) {
        const ids = Array.from(cards).map(c => c.dataset.videoId);
        const cacheKey = 'siren_yt_stats_v1';
        const cacheTtl = 6 * 60 * 60 * 1000; // 6 hours

        // Try cache first
        try {
            const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
            if (cached && cached.timestamp && (Date.now() - cached.timestamp) < cacheTtl
                && ids.every(id => cached.data && cached.data[id])) {
                applyYouTubeStats(cards, cached.data);
                return;
            }
        } catch (e) { /* ignore cache errors */ }

        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
        fetch(url)
            .then(res => res.json().then(json => ({ ok: res.ok, status: res.status, json })))
            .then(({ ok, status, json }) => {
                if (!ok || json.error) {
                    console.error('[YouTube API] HTTP', status, json.error || json);
                    return;
                }
                if (!json.items || json.items.length === 0) {
                    console.warn('[YouTube API] No items returned for', ids);
                    return;
                }
                console.log('[YouTube API] Got', json.items.length, 'items');
                const data = {};
                json.items.forEach(item => {
                    data[item.id] = {
                        title: item.snippet.title,
                        channel: item.snippet.channelTitle,
                        views: parseInt(item.statistics.viewCount, 10) || 0,
                        duration: item.contentDetails.duration
                    };
                });
                try {
                    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
                } catch (e) { /* localStorage may be unavailable */ }
                applyYouTubeStats(cards, data);
            })
            .catch(err => console.error('[YouTube API] Fetch failed:', err));
    }

    function applyYouTubeStats(cards, data) {
        let totalViews = 0;
        cards.forEach(card => {
            const stats = data[card.dataset.videoId];
            if (!stats) return;
            totalViews += stats.views;

            const titleEl = card.querySelector('.video-title');
            const channelEl = card.querySelector('.video-channel');
            const viewsEl = card.querySelector('.video-views');
            const durationEl = card.querySelector('.video-duration');

            if (titleEl) titleEl.textContent = stats.title;
            if (channelEl) channelEl.textContent = stats.channel;
            if (viewsEl) viewsEl.textContent = formatViewCount(stats.views) + ' views';
            if (durationEl) durationEl.textContent = formatDuration(stats.duration);
        });

        const totalEl = document.querySelector('[data-stat="yt-total-views"]');
        if (totalEl) totalEl.textContent = formatViewCount(totalViews) + '+';
    }

    function formatViewCount(n) {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
        return String(n);
    }

    // Convert ISO 8601 duration (e.g. "PT1H2M30S") to "1:02:30" or "2:30"
    function formatDuration(iso) {
        const m = iso && iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return '';
        const h = parseInt(m[1] || '0', 10);
        const min = parseInt(m[2] || '0', 10);
        const s = parseInt(m[3] || '0', 10);
        const pad = v => String(v).padStart(2, '0');
        return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
    }
});
