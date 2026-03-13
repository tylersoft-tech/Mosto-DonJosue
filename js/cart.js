/* ============================================================
   CART MODULE — Mosto Don Josué
   CRUD operations + LocalStorage persistence
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'mosto_cart';

  /* --- Helpers --- */
  function _get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function _save(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    _updateBadge();
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  }

  /* --- Public API --- */

  /** Add a product to the cart. If same id+volume exists, increment qty. */
  function add(product) {
    const cart = _get();
    const key = product.id + '_' + product.volume;
    const existing = cart.find(item => (item.id + '_' + item.volume) === key);

    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        volume: product.volume,
        price: product.price,
        image: product.image || '',
        qty: product.qty || 1
      });
    }

    _save(cart);
    _showToast(`${product.name} agregado al carrito`);
    return cart;
  }

  /** Update quantity for item identified by id+volume */
  function updateQty(id, volume, qty) {
    const cart = _get();
    const key = id + '_' + volume;
    const item = cart.find(i => (i.id + '_' + i.volume) === key);
    if (item) {
      item.qty = Math.max(1, parseInt(qty) || 1);
    }
    _save(cart);
    return cart;
  }

  /** Remove item by id+volume */
  function remove(id, volume) {
    let cart = _get();
    const key = id + '_' + volume;
    cart = cart.filter(i => (i.id + '_' + i.volume) !== key);
    _save(cart);
    return cart;
  }

  /** Clear entire cart */
  function clear() {
    _save([]);
  }

  /** Get all items */
  function getAll() {
    return _get();
  }

  /** Get total price */
  function getTotal() {
    return _get().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  /** Get total number of items */
  function getCount() {
    return _get().reduce((sum, item) => sum + item.qty, 0);
  }

  /** Update the cart badge in header */
  function _updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    });
  }

  /** Toast notification */
  /** Premium Toast Notification */
  function _showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'toast';
      // Icon container
      const icon = document.createElement('div');
      icon.className = 'toast__icon';
      icon.textContent = '✅';
      toast.appendChild(icon);
      // Message container
      const msg = document.createElement('div');
      msg.className = 'toast__msg';
      toast.appendChild(msg);
      document.body.appendChild(toast);
    }
    // Update message
    toast.querySelector('.toast__msg').textContent = message;

    // Reset animation
    toast.classList.remove('show');
    void toast.offsetWidth; // Trigger reflow
    toast.classList.add('show');

    // Hide after delay
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000); // 4 seconds
  }

  /** Format price as Colombian COP */
  function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO');
  }

  /* --- Drawer UI --- */
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const drawerItems = document.getElementById('drawer-items');
  const drawerCount = document.getElementById('drawer-count');
  const drawerTotal = document.getElementById('drawer-total');
  const citySelect = document.getElementById('drawer-city');
  const checkoutBtn = document.getElementById('drawer-checkout-btn');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      renderDrawer();
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    }
  }

  function renderDrawer() {
    if (!drawerItems) return;
    const cart = _get();
    drawerCount.textContent = `(${getCount()})`;
    drawerTotal.textContent = formatPrice(getTotal());

    if (cart.length === 0) {
      drawerItems.innerHTML = `
        <div class="drawer-empty-state">
          <div style="font-size:3rem; margin-bottom:1rem;">🛒</div>
          <p>Tu carrito está vacío</p>
          <a href="productos.html" class="btn btn-sm btn-primary" onclick="Cart.close()">Ver Productos</a>
        </div>`;
      return;
    }

    drawerItems.innerHTML = cart.map(item => `
      <div class="drawer-item">
        <div class="drawer-item__image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="drawer-item__details">
          <h4>${item.name}</h4>
          <span class="drawer-item__vol">${item.volume}</span>
          <div class="drawer-item__price">${formatPrice(item.price * item.qty)}</div>
          
          <div class="drawer-item__controls">
            <button class="drawer-qty-btn minus" data-id="${item.id}" data-volume="${item.volume}">−</button>
            <span class="drawer-qty-val">${item.qty}</span>
            <button class="drawer-qty-btn plus" data-id="${item.id}" data-volume="${item.volume}">+</button>
            <button class="drawer-remove-btn" data-id="${item.id}" data-volume="${item.volume}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-attach listeners for dynamic elements
    drawerItems.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id && i.volume === btn.dataset.volume);
        if (item) updateQty(item.id, item.volume, item.qty - 1);
      });
    });

    drawerItems.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id && i.volume === btn.dataset.volume);
        if (item) updateQty(item.id, item.volume, item.qty + 1);
      });
    });

    drawerItems.querySelectorAll('.drawer-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        remove(btn.dataset.id, btn.dataset.volume);
      });
    });
  }

  function _initDrawerListeners() {
    if (drawer) {
      document.querySelector('.cart-drawer__close')?.addEventListener('click', closeDrawer);
    }
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Header (and other) cart buttons override
    const cartBtns = document.querySelectorAll('.cart-btn, .header .cart-btn');
    cartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    // Checkout button logic
    if (checkoutBtn && citySelect) {
      checkoutBtn.addEventListener('click', () => {
        const city = citySelect.value;
        if (typeof Checkout !== 'undefined') {
          Checkout.send(city);
        } else {
          console.error('Checkout module not loaded');
        }
      });
    }
  }

  /* --- Init badge and drawer on load --- */
  document.addEventListener('DOMContentLoaded', () => {
    _updateBadge();
    _initDrawerListeners();
  });

  // Also update drawer when cart changes
  document.addEventListener('cart:updated', () => {
    renderDrawer();
  });

  return { add, updateQty, remove, clear, getAll, getTotal, getCount, formatPrice, open: openDrawer, close: closeDrawer };
})();
