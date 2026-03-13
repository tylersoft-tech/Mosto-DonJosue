/* ============================================================
   ANALYTICS MODULE — Umami Tracking
   Comprehensive event tracking for Mosto Don Josué
   ============================================================ */

const Analytics = (() => {

    /* --- Umami track function --- */
    function track(eventName, eventData = {}) {
        if (typeof umami !== 'undefined') {
            umami.track(eventName, eventData);
        } else {
            console.log('[Analytics]', eventName, eventData);
        }
    }

    /* --- Page view with metadata --- */
    function trackPage(pageName, url) {
        if (typeof umami !== 'undefined') {
            umami.trackView(pageName, url);
        }
    }

    /* --- Event: Add to Cart --- */
    function trackAddToCart(product) {
        track('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_volume: product.volume
        });
    }

    /* --- Event: Remove from Cart --- */
    function trackRemoveFromCart(product) {
        track('remove_from_cart', {
            product_id: product.id,
            product_name: product.name
        });
    }

    /* --- Event: Cart View --- */
    function trackCartView() {
        track('cart_view', {
            cart_count: Cart ? Cart.getCount() : 0,
            cart_total: Cart ? Cart.getTotal() : 0
        });
    }

    /* --- Event: Begin Checkout --- */
    function trackCheckout(city) {
        const cart = Cart ? Cart.getAll() : [];
        const total = Cart ? Cart.getTotal() : 0;
        track('begin_checkout', {
            currency: 'COP',
            value: total,
            city: city,
            items: cart.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.qty,
                price: item.price
            }))
        });
    }

    /* --- Event: Purchase (WhatsApp sent) --- */
    function trackPurchase(city) {
        const cart = Cart ? Cart.getAll() : [];
        const total = Cart ? Cart.getTotal() : 0;
        track('purchase', {
            currency: 'COP',
            transaction_id: Date.now(),
            value: total,
            city: city,
            items: cart.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.qty,
                price: item.price
            }))
        });
    }

    /* --- Event: Product View --- */
    function trackProductView(productName, productId, price) {
        track('view_product', {
            product_id: productId,
            product_name: productName,
            price: price
        });
    }

    /* --- Event: CTA Click --- */
    function trackCTA(ctaName, ctaLocation) {
        track('cta_click', {
            cta_name: ctaName,
            cta_location: ctaLocation
        });
    }

    /* --- Event: WhatsApp Click --- */
    function trackWhatsApp(whatsappType, source) {
        track('whatsapp_click', {
            whatsapp_type: whatsappType,
            source: source
        });
    }

    /* --- Event: External Link Click --- */
    function trackExternalLink(url, linkText) {
        track('external_link_click', {
            url: url,
            link_text: linkText
        });
    }

    /* --- Event: Form Submit --- */
    function trackFormSubmit(formName, success) {
        track('form_submit', {
            form_name: formName,
            success: success
        });
    }

    /* --- Event: Menu Click --- */
    function trackMenuClick(menuItem) {
        track('menu_click', {
            menu_item: menuItem
        });
    }

    /* --- Event: Search --- */
    function trackSearch(searchTerm) {
        track('search', {
            search_term: searchTerm
        });
    }

    /* --- Scroll Depth Tracking --- */
    let scrollTracked = { 25: false, 50: false, 75: false, 100: false };
    function initScrollTracking() {
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            [25, 50, 75, 100].forEach(level => {
                if (scrollPercent >= level && !scrollTracked[level]) {
                    scrollTracked[level] = true;
                    track('scroll_depth', { depth: level + '%' });
                }
            });
        }, { passive: true });
    }

    /* --- Time on Page --- */
    function trackTimeOnPage() {
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            track('time_on_page', { seconds: timeOnPage });
        });
    }

    /* --- Initialize all tracking --- */
    function init() {
        // Track current page
        trackPage(document.title, window.location.href);

        // Scroll depth
        initScrollTracking();

        // Time on page
        trackTimeOnPage();

        // Track Add to Cart buttons
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseInt(btn.dataset.price),
                    volume: btn.dataset.volume
                };
                trackAddToCart(product);
            });
        });

        // Track Cart Drawer Open
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.addEventListener('click', trackCartView);
        });

        // Track Checkout Button
        const checkoutBtn = document.getElementById('drawer-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const city = document.getElementById('drawer-city')?.value;
                trackCheckout(city);
            });
        }

        // Track WhatsApp Float Button
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', () => {
                trackWhatsApp('float', 'header');
            });
        }

        // Track All CTA Buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const text = this.textContent.trim().substring(0, 30);
                
                // Don't track if it's anchor or external
                if (href && !href.startsWith('#') && !href.startsWith('http')) {
                    // Could be a CTA
                }
                
                if (this.classList.contains('btn-primary')) {
                    trackCTA(text, document.title);
                }
            });
        });

        // Track Menu Clicks
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                if (href) {
                    trackMenuClick(href);
                }
            });
        });

        // Track External Links (Instagram, Facebook, etc.)
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes('mostodonjosue.com') && !link.href.includes('donjosue.openagi.com.co')) {
                link.addEventListener('click', function(e) {
                    trackExternalLink(this.href, this.textContent.trim().substring(0, 20));
                });
            }
        });

        // Track Contact Form (if exists)
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                trackFormSubmit('contact_form', true);
                // Continue with actual form submission
                this.submit();
            });
        }

        // Track Product Page Views
        const productNameEl = document.querySelector('.card__title, .product__title, h1');
        if (productNameEl && window.location.pathname.includes('producto-')) {
            const productName = productNameEl.textContent.trim();
            const priceEl = document.querySelector('.card__price, .product__price');
            const price = priceEl ? parseInt(priceEl.textContent.replace(/[^0-9]/g, '')) : 0;
            trackProductView(productName, window.location.pathname, price);
        }
    }

    /* --- Auto-init on DOMContentLoaded --- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        track,
        trackPage,
        trackAddToCart,
        trackRemoveFromCart,
        trackCartView,
        trackCheckout,
        trackPurchase,
        trackProductView,
        trackCTA,
        trackWhatsApp,
        trackExternalLink,
        trackFormSubmit,
        trackMenuClick,
        init
    };
})();
