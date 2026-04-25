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

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only init cursor if not on touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Add slight delay for outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .fancy-project-card, .student-card, .zoomable-image, .carousel-btn, .lightbox-btn, .lightbox-close');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

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
});
