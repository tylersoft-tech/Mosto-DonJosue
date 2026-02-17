/* ============================================================
   CHECKOUT MODULE — Mosto Don Josué
   City→WhatsApp phone mapping + message generation
   ============================================================ */

const Checkout = (() => {

    /* --- City→Phone mapping (placeholder numbers — update with real ones) --- */
    const CITY_PHONES = {
        barrancabermeja: { phone: '573001234567', label: 'Barrancabermeja (Sede Matriz)' },
        bogota: { phone: '573009876543', label: 'Bogotá' },
        medellin: { phone: '573005551234', label: 'Medellín' },
        cali: { phone: '573005554321', label: 'Cali' },
        bucaramanga: { phone: '573005559876', label: 'Bucaramanga' }
    };

    /**
     * Build the WhatsApp message from cart items.
     * Uses .map() + .join() to avoid [object Object]
     */
    function buildMessage(cart, total, cityKey) {
        const cityInfo = CITY_PHONES[cityKey];
        const cityLabel = cityInfo ? cityInfo.label : 'No seleccionada';

        const header = '🍇 *PEDIDO — Mosto Don Josué* 🍇\n\n';
        const divider = '────────────────────\n';

        const items = cart.map((item, i) => {
            const subtotal = item.price * item.qty;
            return `${i + 1}. *${item.name}*\n` +
                `   📦 Volumen: ${item.volume}\n` +
                `   🔢 Cantidad: ${item.qty}\n` +
                `   💰 Precio unit.: $${item.price.toLocaleString('es-CO')}\n` +
                `   💵 Subtotal: $${subtotal.toLocaleString('es-CO')}`;
        }).join('\n\n');

        const footer = `\n\n${divider}` +
            `*🛒 TOTAL: $${total.toLocaleString('es-CO')}*\n` +
            `📍 Ciudad de entrega: *${cityLabel}*\n\n` +
            `_¡Gracias por elegir Mosto Don Josué!_ 🙏`;

        return header + items + footer;
    }

    /**
     * Generate the full WhatsApp API URL
     */
    function generateURL(cityKey) {
        const cart = Cart.getAll();
        const total = Cart.getTotal();

        if (!cart.length) {
            alert('Tu carrito está vacío. Agrega productos antes de finalizar.');
            return null;
        }

        if (!cityKey || !CITY_PHONES[cityKey]) {
            alert('Por favor selecciona tu ciudad de entrega.');
            return null;
        }

        const phone = CITY_PHONES[cityKey].phone;
        const message = buildMessage(cart, total, cityKey);
        const encoded = encodeURIComponent(message);

        return `https://wa.me/${phone}?text=${encoded}`;
    }

    /**
     * Open WhatsApp with the order
     */
    function send(cityKey) {
        const url = generateURL(cityKey);
        if (url) {
            window.open(url, '_blank');
        }
    }

    /** Get available cities for dropdown */
    function getCities() {
        return Object.entries(CITY_PHONES).map(([key, val]) => ({
            value: key,
            label: val.label
        }));
    }

    return { send, generateURL, getCities, buildMessage, CITY_PHONES };
})();
