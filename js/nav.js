/* ============================================================
   NAV MODULE — Mobile Menu + Sticky Header
   ============================================================ */

const Nav = (() => {

    function init() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav');
        const header = document.querySelector('.header');
        const subToggles = document.querySelectorAll('.nav__toggle-sub');

        if (!hamburger || !nav) return;

        // Hamburger toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click (mobile)
        nav.querySelectorAll('.nav__link:not(.nav__has-sub)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Submenu toggles (mobile)
        subToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parent = toggle.closest('.nav__item');
                parent.classList.toggle('open');
            });
        });

        // For parent links that have submenus — prevent navigation on mobile
        document.querySelectorAll('.nav__has-sub').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    const parent = link.closest('.nav__item');
                    parent.classList.toggle('open');
                }
            });
        });

        // Sticky header shadow
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', window.scrollY > 20);
            }, { passive: true });
        }

        // Highlight current page
        _highlightActive();

        // Close mobile menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function _highlightActive() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav__link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === path || (path === 'index.html' && (href === '/' || href === 'index.html'))) {
                link.classList.add('active');
            }
        });
    }

    return { init };
})();
