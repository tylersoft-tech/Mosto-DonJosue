/* ============================================================
   ANALYTICS MODULE — Umami Tracking Complete
   Comprehensive event tracking for Mosto Don Josué
   ============================================================ */

const Analytics = (() => {

    /* --- Get UTM Parameters --- */
    function getUTMs() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || '(direct)',
            utm_medium: params.get('utm_medium') || '(none)',
            utm_campaign: params.get('utm_campaign') || '(none)',
            utm_content: params.get('utm_content') || '(none)',
            utm_term: params.get('utm_term') || '(none)'
        };
    }

    /* --- Get Referrer --- */
    function getReferrer() {
        return document.referrer || '(direct)';
    }

    /* --- Get Device Info --- */
    function getDeviceInfo() {
        return {
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            browser: navigator.userAgent,
            language: navigator.language || navigator.userLanguage,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };
    }

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
        const utms = getUTMs();
        const deviceInfo = getDeviceInfo();
        
        const pageData = {
            url: url,
            referrer: getReferrer(),
            ...utms,
            ...deviceInfo
        };

        if (typeof umami !== 'undefined') {
            umami.trackView(pageName, url);
        }
        
        track('page_view', pageData);
    }

    /* --- Event: Add to Cart --- */
    function trackAddToCart(product) {
        const utms = getUTMs();
        track('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_volume: product.volume,
            ...utms
        });
    }

    /* --- Event: Remove from Cart --- */
    function trackRemoveFromCart(product) {
        track('remove_from_cart', {
            product_id: product.id,
            product_name: product.name
        });
    }

    /* --- Event: Cart Updated (qty change) --- */
    function trackCartUpdate(product, action) {
        track('cart_update', {
            product_id: product.id,
            product_name: product.name,
            action: action, // 'increase' or 'decrease'
            cart_count: Cart ? Cart.getCount() : 0
        });
    }

    /* --- Event: Cart View --- */
    function trackCartView() {
        const cart = Cart ? Cart.getAll() : [];
        const total = Cart ? Cart.getTotal() : 0;
        track('cart_view', {
            cart_count: cart.length,
            cart_total: total,
            cart_items: cart.map(item => item.name).join(', ')
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
            items_count: cart.length,
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
            transaction_id: 'WA_' + Date.now(),
            value: total,
            city: city,
            items_count: cart.length,
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
        const utms = getUTMs();
        track('view_product', {
            product_id: productId,
            product_name: productName,
            price: price,
            ...utms
        });
    }

    /* --- Event: Product Compare --- */
    function trackProductCompare(productName) {
        track('product_compare', {
            product_name: productName
        });
    }

    /* --- Event: Product Click --- */
    function trackProductClick(productName, location) {
        track('product_click', {
            product_name: productName,
            location: location
        });
    }

    /* --- Event: CTA Click --- */
    function trackCTA(ctaName, ctaLocation) {
        const utms = getUTMs();
        track('cta_click', {
            cta_name: ctaName,
            cta_location: ctaLocation,
            ...utms
        });
    }

    /* --- Event: WhatsApp Click --- */
    function trackWhatsApp(whatsappType, source) {
        const utms = getUTMs();
        track('whatsapp_click', {
            whatsapp_type: whatsappType,
            source: source,
            ...utms
        });
    }

    /* --- Event: Phone Call Click --- */
    function trackPhoneClick(phoneNumber) {
        track('phone_click', {
            phone_number: phoneNumber
        });
    }

    /* --- Event: External Link Click --- */
    function trackExternalLink(url, linkText) {
        const utms = getUTMs();
        track('external_link_click', {
            url: url,
            link_text: linkText.substring(0, 50),
            ...utms
        });
    }

    /* --- Event: Social Share --- */
    function trackSocialShare(platform, url) {
        track('social_share', {
            platform: platform,
            url: url
        });
    }

    /* --- Event: Social Follow --- */
    function trackSocialFollow(platform) {
        track('social_follow', {
            platform: platform
        });
    }

    /* --- Event: Form Start --- */
    function trackFormStart(formName) {
        track('form_start', {
            form_name: formName
        });
    }

    /* --- Event: Form Submit --- */
    function trackFormSubmit(formName, success) {
        track('form_submit', {
            form_name: formName,
            success: success
        });
    }

    /* --- Event: Form Error --- */
    function trackFormError(formName, field, error) {
        track('form_error', {
            form_name: formName,
            field: field,
            error: error
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

    /* --- Event: Newsletter Signup --- */
    function trackNewsletterSignup(email) {
        track('newsletter_signup', {
            email: email,
            source: getReferrer()
        });
    }

    /* --- Event: Download --- */
    function trackDownload(fileName, fileType) {
        track('download', {
            file_name: fileName,
            file_type: fileType
        });
    }

    /* --- Event: Video Start --- */
    function trackVideoStart(videoName) {
        track('video_start', {
            video_name: videoName
        });
    }

    /* --- Event: Video Complete --- */
    function trackVideoComplete(videoName) {
        track('video_complete', {
            video_name: videoName
        });
    }

    /* --- Event: Error --- */
    function trackError(errorType, errorMessage) {
        track('error', {
            error_type: errorType,
            error_message: errorMessage
        });
    }

    /* --- Event: Lead Generated --- */
    function trackLead(source, value) {
        track('lead', {
            source: source,
            value: value || 0
        });
    }

    /* --- Event: Promotion View --- */
    function trackPromotionView(promotionName, promotionId) {
        track('promotion_view', {
            promotion_id: promotionId,
            promotion_name: promotionName
        });
    }

    /* --- Event: Promotion Click --- */
    function trackPromotionClick(promotionName, promotionId) {
        track('promotion_click', {
            promotion_id: promotionId,
            promotion_name: promotionName
        });
    }

    /* --- Event: Coupon Enter --- */
    function trackCouponEnter(couponCode) {
        track('coupon_enter', {
            coupon_code: couponCode
        });
    }

    /* --- Event: Coupon Applied --- */
    function trackCouponApplied(couponCode, discount) {
        track('coupon_applied', {
            coupon_code: couponCode,
            discount: discount
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
                    track('scroll_depth', { depth: level + '%', page: window.location.pathname });
                }
            });
        }, { passive: true });
    }

    /* --- Time on Page --- */
    function trackTimeOnPage() {
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            track('time_on_page', { 
                seconds: timeOnPage,
                page: window.location.pathname
            });
        });
    }

    /* --- Exit Intent Detection --- */
    function initExitIntent() {
        let exited = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exited) {
                exited = true;
                track('exit_intent', {
                    page: window.location.pathname
                });
            }
        });
    }

    /* --- Idle Detection --- */
    function initIdleDetection() {
        let idleTime = 0;
        const idleInterval = setInterval(() => {
            idleTime++;
            if (idleTime === 60) { // 1 minute
                track('idle_1min', { page: window.location.pathname });
            }
            if (idleTime === 300) { // 5 minutes
                track('idle_5min', { page: window.location.pathname });
            }
        }, 1000);

        ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                idleTime = 0;
            });
        });
    }

    /* --- Back/Forward Detection --- */
    function initNavigationTracking() {
        window.addEventListener('popstate', (e) => {
            track('navigation_back_forward', {
                direction: e.state?.direction || 'unknown'
            });
        });
    }

    /* --- Initialize all tracking --- */
    function init() {
        // Track current page with full metadata
        trackPage(document.title, window.location.href);

        // Scroll depth
        initScrollTracking();

        // Time on page
        trackTimeOnPage();

        // Exit intent
        initExitIntent();

        // Idle detection
        initIdleDetection();

        // Navigation tracking
        initNavigationTracking();

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

        // Track WhatsApp buttons in page
        document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const href = btn.href;
                if (href.includes('franquicias')) {
                    trackWhatsApp('franchise', 'page');
                } else if (href.includes('contacto')) {
                    trackWhatsApp('contact', 'page');
                } else {
                    trackWhatsApp('general', 'page');
                }
            });
        });

        // Track All CTA Buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const text = this.textContent.trim().substring(0, 30);
                
                if (this.classList.contains('btn-primary')) {
                    trackCTA(text, document.title);
                }
            });
        });

        // Track Product Cards Click
        document.querySelectorAll('.card a, .product-card a').forEach(link => {
            link.addEventListener('click', function() {
                const productName = this.closest('.card, .product-card')?.querySelector('h3, .card__title')?.textContent?.trim();
                if (productName) {
                    trackProductClick(productName, 'card');
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

        // Track Megamenu Product Clicks
        document.querySelectorAll('.megamenu__item').forEach(item => {
            item.addEventListener('click', () => {
                const productName = item.querySelector('strong')?.textContent?.trim();
                if (productName) {
                    trackProductClick(productName, 'megamenu');
                }
            });
        });

        // Track External Links (Instagram, Facebook, etc.)
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            const hostname = link.hostname;
            if (!hostname.includes('mostodonjosue.com') && !hostname.includes('donjosue.openagi.com.co') && !hostname.includes('openagi.com.co')) {
                link.addEventListener('click', function(e) {
                    trackExternalLink(this.href, this.textContent.trim().substring(0, 20));
                });
            }
        });

        // Track Social Links
        const socialPlatforms = ['instagram', 'facebook', 'twitter', 'tiktok', 'youtube', 'linkedin'];
        socialPlatforms.forEach(platform => {
            document.querySelectorAll(`a[href*="${platform}"]`).forEach(link => {
                link.addEventListener('click', () => {
                    trackSocialFollow(platform);
                });
            });
        });

        // Track Contact Form
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                trackFormSubmit('contact_form', true);
                this.submit();
            });
            
            // Track form field focus
            contactForm.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('focus', () => {
                    trackFormStart('contact_form');
                });
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

        // Track Hero Section Clicks
        document.querySelectorAll('.hero .btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim().substring(0, 30);
                trackCTA(text, 'hero');
            });
        });

        // Track Footer Links
        document.querySelectorAll('.footer__links a').forEach(link => {
            link.addEventListener('click', function() {
                trackMenuClick('footer_' + this.getAttribute('href'));
            });
        });

        // Track Franchise CTA
        const franchiseBtn = document.querySelector('.franchise-hero .btn, [href*="franquicias"]');
        if (franchiseBtn) {
            franchiseBtn.addEventListener('click', () => {
                trackCTA('franchise_inquiry', 'hero');
            });
        }

        // Error handling
        window.addEventListener('error', (e) => {
            trackError('javascript', e.message);
        });

        // 404 Detection
        if (document.querySelector('.404, .error-page') || document.title.includes('404')) {
            track('page_404', {
                url: window.location.href
            });
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
        trackCartUpdate,
        trackCartView,
        trackCheckout,
        trackPurchase,
        trackProductView,
        trackProductCompare,
        trackProductClick,
        trackCTA,
        trackWhatsApp,
        trackPhoneClick,
        trackExternalLink,
        trackSocialShare,
        trackSocialFollow,
        trackFormStart,
        trackFormSubmit,
        trackFormError,
        trackMenuClick,
        trackSearch,
        trackNewsletterSignup,
        trackDownload,
        trackVideoStart,
        trackVideoComplete,
        trackError,
        trackLead,
        trackPromotionView,
        trackPromotionClick,
        trackCouponEnter,
        trackCouponApplied,
        getUTMs,
        getReferrer,
        getDeviceInfo,
        init
    };
})();
