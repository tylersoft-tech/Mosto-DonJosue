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
        id:     product.id,
        name:   product.name,
        volume: product.volume,
        price:  product.price,
        image:  product.image || '',
        qty:    product.qty || 1
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
  function _showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  /** Format price as Colombian COP */
  function formatPrice(price) {
    return '$' + price.toLocaleString('es-CO');
  }

  /* --- Init badge on load --- */
  document.addEventListener('DOMContentLoaded', _updateBadge);

  return { add, updateQty, remove, clear, getAll, getTotal, getCount, formatPrice };
})();
