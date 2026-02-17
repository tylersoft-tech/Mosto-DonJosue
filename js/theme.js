/* ============================================================
   THEME MODULE — Dark Mode Toggle
   ============================================================ */

const Theme = (() => {
    const STORAGE_KEY = 'mosto_theme';

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        _updateIcon();

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                _updateIcon();
            }
        });
    }

    function toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);
        _updateIcon();
    }

    function _updateIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const btns = document.querySelectorAll('.dark-toggle');
        btns.forEach(btn => {
            btn.innerHTML = isDark ? '☀️' : '🌙';
            btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        });
    }

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    return { init, toggle, isDark };
})();

// Initialize before DOMContentLoaded to prevent flash
Theme.init();
