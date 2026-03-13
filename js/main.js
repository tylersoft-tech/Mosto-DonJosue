/* ============================================================
   MAIN.JS — Orchestrator
   Initializes all modules, scroll animations, scroll-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Init Modules --- */
    Nav.init();
    // Theme.init() runs immediately in theme.js (before DOMContentLoaded)

    /* --- Dark Mode Toggle Buttons --- */
    document.querySelectorAll('.dark-toggle').forEach(btn => {
        btn.addEventListener('click', Theme.toggle);
    });

    /* --- Scroll-reveal (IntersectionObserver) --- */
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* --- Scroll to Top Button --- */
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Smooth scroll for anchor links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* --- Quick Add Buttons --- */
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                volume: btn.dataset.volume,
                image: btn.dataset.image,
                qty: 1
            };

            Cart.add(product);

            // Optional: visual feedback button
            const originalText = btn.textContent;
            btn.textContent = '¡Agregado!';
            btn.classList.add('btn-green'); // Assuming you have a green class or just style change
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('btn-green');
            }, 1000);

            // Auto open drawer
            Cart.open();
        });
    });
});
