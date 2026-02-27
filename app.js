const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
const CONDITIONS = ['Neu mit Etikett', 'Wie neu', 'Sehr gut', 'Gut'];
const CATEGORIES = ['Damen', 'Herren', 'Kinder', 'Elektro', 'Haushalt'];
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';


const CATEGORY_PLACEHOLDER_IMAGES = {
  Damen: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  Herren: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80',
  Kinder: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
  Elektro: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  Haushalt: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80'
};

function hasValidImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function getSafeImage(product) {
  return hasValidImageUrl(product.image) ? product.image : (CATEGORY_PLACEHOLDER_IMAGES[product.category] || CATEGORY_PLACEHOLDER_IMAGES.Damen);
}

let products = [
  { id: 1, title: 'Leinenbluse Weiß', brand: 'Armedangels', price: 29, size: 'S', zustand: 'Wie neu', farbe: 'Weiß', material: 'Leinen', category: 'Damen', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', locationText: 'Berlin • Versand möglich' },
  { id: 2, title: 'Vintage Jeansjacke', brand: 'Levi\'s', price: 44, size: 'M', zustand: 'Sehr gut', farbe: 'Blau', material: 'Denim', category: 'Herren', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', locationText: 'Hamburg • Versand möglich' },
  { id: 3, title: 'Kinder Regenjacke', brand: 'Tchibo', price: 14, size: 'XXS', zustand: 'Gut', farbe: 'Gelb', material: 'Polyester', category: 'Kinder', image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80', locationText: 'Köln • Abholung' },
  { id: 4, title: 'Bluetooth Kopfhörer', brand: 'Sony', price: 65, size: 'M', zustand: 'Wie neu', farbe: 'Schwarz', material: 'Kunststoff', category: 'Elektro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', locationText: 'München • Versand möglich' },
  { id: 5, title: 'Mixer Pro 900', brand: 'Bosch', price: 49, size: 'L', zustand: 'Neu mit Etikett', farbe: 'Silber', material: 'Edelstahl', category: 'Haushalt', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80', locationText: 'Frankfurt • Versand möglich' },
  { id: 6, title: 'Oversize Hoodie', brand: 'Nike', price: 38, size: 'XXL', zustand: 'Gut', farbe: 'Grau', material: 'Baumwolle', category: 'Herren', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', locationText: 'Stuttgart • Versand möglich' },
  { id: 7, title: 'Sommerkleid Floral', brand: 'Zara', price: 24, size: 'XS', zustand: 'Sehr gut', farbe: 'Rot', material: 'Viskose', category: 'Damen', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', locationText: 'Leipzig • Abholung' },
  { id: 8, title: 'Wollmantel Lang', brand: 'COS', price: 89, size: '3XL', zustand: 'Wie neu', farbe: 'Beige', material: 'Wolle', category: 'Damen', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', locationText: 'Berlin • Versand möglich' },
  { id: 9, title: 'Sportshirt DryFit', brand: 'Adidas', price: 19, size: '4XL', zustand: 'Neu mit Etikett', farbe: 'Grün', material: 'Polyester', category: 'Herren', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', locationText: 'Dresden • Versand möglich' },
  { id: 10, title: 'Cardigan Soft Knit', brand: 'Mango', price: 31, size: '5XL', zustand: 'Sehr gut', farbe: 'Rosa', material: 'Acryl', category: 'Damen', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80', locationText: 'Hannover • Abholung' },
  { id: 11, title: 'Kinder Sneaker Light', brand: 'Puma', price: 22, size: '6XL', zustand: 'Gut', farbe: 'Weiß', material: 'Mesh', category: 'Kinder', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', locationText: 'Bremen • Versand möglich' }
];

products = products.map((product) => ({ ...product, image: getSafeImage(product) }));

const state = { search: '', brandSelect: '', brandText: '', priceMin: '', priceMax: '', categories: [], conditions: [], sizes: [], colors: [], materials: [], sort: 'newest' };
const historyKey = 'thriftstyle-history-v2';
const cartKey = 'thriftstyle-cart-v2';
const checkoutPrefsKey = 'thriftstyle-checkout-v1';
const historyData = JSON.parse(localStorage.getItem(historyKey) || '{"clicks":[],"searches":[],"filters":[]}');
const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
const checkoutState = JSON.parse(localStorage.getItem(checkoutPrefsKey) || '{"shippingProvider":"DHL","shippingSpeed":"standard","insuranceEnabled":false}');

const $ = (id) => document.getElementById(id);
const unique = (arr) => [...new Set(arr)];
const euro = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

function fillOptions() {
  fillChecks('size-filters', SIZES, 'sizes');
  fillChecks('condition-filters', CONDITIONS, 'conditions');
  fillChecks('category-filters', CATEGORIES, 'categories');
  const colors = unique(products.map((p) => p.farbe)).sort();
  const materials = unique(products.map((p) => p.material)).sort();
  const brands = unique(products.map((p) => p.brand)).sort();
  fillChecks('color-filters', colors, 'colors');
  fillChecks('material-filters', materials, 'materials');
  $('image-color').innerHTML += colors.map((c) => `<option value="${c}">${c}</option>`).join('');
  $('brand-select').innerHTML += brands.map((b) => `<option value="${b}">${b}</option>`).join('');
}

function fillChecks(containerId, values, key) {
  $(containerId).innerHTML += values.map((v) => `<label class="filter-option"><input type="checkbox" data-group="${key}" value="${v}" /> ${v}</label>`).join('');
}

function renderCategoryRail() {
  const html = ['<button type="button" class="category-chip active" data-category="">Alle</button>']
    .concat(CATEGORIES.map((c) => `<button type="button" class="category-chip" data-category="${c}">${c}</button>`))
    .join('');
  $('category-rail').innerHTML = html;
}

function syncCategoryUi() {
  const selected = state.categories[0] || '';
  document.querySelectorAll('.category-chip').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === selected || (!selected && button.dataset.category === ''));
  });
  document.querySelectorAll('input[data-group="categories"]').forEach((checkbox) => {
    checkbox.checked = !!selected && checkbox.value === selected;
  });
}

function matchesText(product, text) {
  const q = text.toLowerCase();
  return [product.title, product.brand, product.material, product.farbe].some((v) => v.toLowerCase().includes(q));
}

function filterProducts() {
  let list = products.filter((p) => {
    if (state.search && !matchesText(p, state.search)) return false;
    if (state.brandSelect && p.brand !== state.brandSelect) return false;
    if (state.brandText && !p.brand.toLowerCase().includes(state.brandText.toLowerCase())) return false;
    if (state.priceMin && p.price < Number(state.priceMin)) return false;
    if (state.priceMax && p.price > Number(state.priceMax)) return false;
    if (state.categories.length && !state.categories.includes(p.category)) return false;
    if (state.conditions.length && !state.conditions.includes(p.zustand)) return false;
    if (state.sizes.length && !state.sizes.includes(p.size)) return false;
    if (state.colors.length && !state.colors.includes(p.farbe)) return false;
    if (state.materials.length && !state.materials.includes(p.material)) return false;
    return true;
  });

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'newest') list.sort((a, b) => b.id - a.id);
  return list;
}

function card(p, withCart = true) {
  const metaRow = `${p.size} · ${p.zustand} · ${p.farbe}/${p.material}`;
  return `<article class="product-card" data-open="${p.id}">
    <div class="product-media-wrap">
      <img src="${getSafeImage(p)}" alt="${p.title}" loading="lazy" onerror="setImageFallback(this)" />
      <span class="condition-badge">${p.zustand}</span>
    </div>
    <div class="product-content">
      <h3>${p.title}</h3>
      <div class="meta brand">${p.brand}</div>
      <div class="price">${euro(p.price)}</div>
      <div class="meta">${metaRow}</div>
      <div class="meta">${p.locationText}</div>
      ${withCart ? `<button class="primary" data-add="${p.id}" type="button">In den Warenkorb</button>` : ''}
    </div>
  </article>`;
}

function renderProducts() {
  const list = filterProducts();
  $('product-grid').innerHTML = list.length ? list.map((p) => card(p)).join('') : '<p>Keine Treffer. Passe die Filter an.</p>';
}

function renderRecommendations() {
  const score = new Map();
  for (const p of products) score.set(p.id, 0);
  historyData.filters.slice(-5).forEach((f) => {
    products.forEach((p) => {
      if (f.categories?.includes(p.category)) score.set(p.id, score.get(p.id) + 2);
      if (f.sizes?.includes(p.size)) score.set(p.id, score.get(p.id) + 1);
      if (f.brands?.includes(p.brand)) score.set(p.id, score.get(p.id) + 2);
    });
  });
  historyData.clicks.slice(-10).forEach((id) => score.set(id, (score.get(id) || 0) + 3));
  const ranked = [...products].sort((a, b) => (score.get(b.id) - score.get(a.id)) || b.id - a.id).slice(0, 4);
  $('recommended-grid').innerHTML = ranked.map((p) => card(p, false)).join('');
}

function openPanel(panel, backdrop) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); backdrop.hidden = false; }
function closePanel(panel, backdrop) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); backdrop.hidden = true; }

function persistHistory() {
  if (state.search) historyData.searches.push(state.search);
  historyData.filters.push({ categories: state.categories, sizes: state.sizes, brands: [state.brandSelect, state.brandText].filter(Boolean) });
  localStorage.setItem(historyKey, JSON.stringify(historyData));
}

function bindFilters() {
  $('search-input').addEventListener('input', (e) => { state.search = e.target.value.trim(); persistHistory(); renderProducts(); });
  $('sort-select').addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
  $('brand-select').addEventListener('change', (e) => { state.brandSelect = e.target.value; });
  $('brand-text').addEventListener('input', (e) => { state.brandText = e.target.value.trim(); });
  $('price-min').addEventListener('input', (e) => { state.priceMin = e.target.value; });
  $('price-max').addEventListener('input', (e) => { state.priceMax = e.target.value; });

  $('filters-form').addEventListener('change', (e) => {
    const box = e.target.closest('input[type="checkbox"]');
    if (!box) return;
    const group = box.dataset.group;
    if (group === 'categories' && box.checked) {
      document.querySelectorAll('input[data-group="categories"]').forEach((input) => {
        if (input !== box) input.checked = false;
      });
    }
    state[group] = [...document.querySelectorAll(`input[data-group="${group}"]:checked`)].map((x) => x.value);
    if (group === 'categories') syncCategoryUi();
  });

  $('apply-filters').addEventListener('click', () => { persistHistory(); syncCategoryUi(); renderProducts(); closePanel($('filter-drawer'), $('drawer-backdrop')); });
  $('reset-filters').addEventListener('click', () => {
    Object.assign(state, { search: '', brandSelect: '', brandText: '', priceMin: '', priceMax: '', categories: [], conditions: [], sizes: [], colors: [], materials: [], sort: 'newest' });
    $('search-input').value = '';
    $('brand-select').value = '';
    $('brand-text').value = '';
    $('price-min').value = '';
    $('price-max').value = '';
    $('sort-select').value = 'newest';
    document.querySelectorAll('#filters-form input[type="checkbox"]').forEach((c) => (c.checked = false));
    syncCategoryUi();
    renderProducts();
  });
}

function setupImageSearch() {
  $('image-upload').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    $('image-preview').src = src;
    $('image-preview').hidden = false;
  });

  $('image-search-btn').addEventListener('click', async () => {
    const file = $('image-upload').files?.[0] || null;
    const category = $('image-category').value;
    const color = $('image-color').value;
    const ids = await searchByImage(file, { category, color });
    const matched = products.filter((p) => ids.includes(p.id));
    $('product-grid').innerHTML = matched.length ? matched.map((p) => card(p)).join('') : '<p>Keine Bildsuch-Treffer.</p>';
  });
}

async function searchByImage(file, hints = {}) {
  // TODO: Hier später echten Embedding/Vector-Search API-Call ergänzen (Backend + Index erforderlich).
  const nameHint = (file?.name || '').toLowerCase();
  return products.filter((p) => {
    const categoryOk = !hints.category || p.category === hints.category;
    const colorOk = !hints.color || p.farbe === hints.color;
    const filenameOk = !nameHint || [p.title, p.farbe, p.material, p.category].join(' ').toLowerCase().includes(nameHint.replace(/\.[a-z]+$/i, ''));
    return categoryOk && colorOk && filenameOk;
  }).map((p) => p.id);
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    const idx = cart.findIndex((entry) => entry.id === productId);
    cart.splice(idx, 1);
  }
  renderCart();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateShipping(cartItems, shippingProvider, shippingSpeed) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let baseShipping = 0;
  if (itemCount >= 1 && itemCount <= 2) baseShipping = 4.9;
  else if (itemCount >= 3 && itemCount <= 5) baseShipping = 6.9;
  else if (itemCount >= 6) baseShipping = 9.9;

  const providerSurchargeMap = { DHL: 0, GLS: 0.5, UPS: 1.5, DPD: 0.75 };
  const providerSurcharge = providerSurchargeMap[shippingProvider] || 0;

  const freeStandardActive = subtotal >= 100 && shippingSpeed === 'standard';
  const effectiveBase = freeStandardActive ? 0 : baseShipping;
  const expressFee = shippingSpeed === 'express' ? EXPRESS_SURCHARGE : 0;

  const shippingTotal = effectiveBase + providerSurcharge + expressFee;
  return {
    shippingTotal,
    baseShipping,
    providerSurcharge,
    expressFee,
    freeStandardActive,
    label: `${shippingProvider} · ${shippingSpeed === 'express' ? 'Express (1–2 Werktage)' : 'Standard (3–5 Werktage)'}`
  };
}

function calculateBuyerProtection(subtotal) {
  if (!subtotal) return 0;
  return subtotal * 0.02 + 0.5;
}

function calculateInsurance(subtotal, insuranceEnabled) {
  if (!insuranceEnabled || !subtotal) return 0;
  return Math.min(9.99, Math.max(1.49, subtotal * 0.015));
}

function saveCheckoutPrefs() {
  localStorage.setItem(checkoutPrefsKey, JSON.stringify(checkoutState));
}

function updateTotal() {
  const subtotal = getSubtotal();
  const shipping = calculateShipping(cart, checkoutState.shippingProvider, checkoutState.shippingSpeed);
  const buyerProtection = calculateBuyerProtection(subtotal);
  const insurance = calculateInsurance(subtotal, checkoutState.insuranceEnabled);
  const total = subtotal + shipping.shippingTotal + buyerProtection + insurance;

  $('summary-subtotal').textContent = euro(subtotal);
  $('summary-shipping-label').textContent = `Versand (${shipping.label})`;
  $('summary-shipping').textContent = euro(shipping.shippingTotal);
  $('summary-protection').textContent = euro(buyerProtection);
  $('summary-insurance').textContent = euro(insurance);
  $('summary-total').textContent = euro(total);

  $('free-shipping-banner').hidden = !shipping.freeStandardActive;

  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function renderCart() {
  if (!cart.length) {
    $('cart-items').innerHTML = '<p>Warenkorb ist leer.</p>';
  } else {
    $('cart-items').innerHTML = cart.map((item) => `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          <div>${euro(item.price)} · ${item.size}</div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-qty="${item.id}" data-delta="-1" aria-label="Menge verringern">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-qty="${item.id}" data-delta="1" aria-label="Menge erhöhen">+</button>
        </div>
      </div>
    `).join('');
  }

  $('cart-count').textContent = getItemCount();
  updateTotal();
}

function initCheckoutControls() {
  document.querySelectorAll('input[name="shipping-provider"]').forEach((radio) => {
    radio.checked = radio.value === checkoutState.shippingProvider;
    radio.addEventListener('change', (e) => {
      checkoutState.shippingProvider = e.target.value;
      saveCheckoutPrefs();
      updateTotal();
    });
  });

  document.querySelectorAll('input[name="shipping-speed"]').forEach((radio) => {
    radio.checked = radio.value === checkoutState.shippingSpeed;
    radio.addEventListener('change', (e) => {
      checkoutState.shippingSpeed = e.target.value;
      saveCheckoutPrefs();
      updateTotal();
    });
  });

  $('insurance-toggle').checked = !!checkoutState.insuranceEnabled;
  $('insurance-toggle').addEventListener('change', (e) => {
    checkoutState.insuranceEnabled = e.target.checked;
    saveCheckoutPrefs();
    updateTotal();
  });
}

function setImageFallback(img) {
  if (!img || img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8b5cf6"/>
          <stop offset="52%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#g)"/>
      <circle cx="92" cy="90" r="8" fill="rgba(255,255,255,0.85)"/>
      <circle cx="300" cy="120" r="6" fill="rgba(255,255,255,0.7)"/>
      <circle cx="220" cy="340" r="9" fill="rgba(255,255,255,0.72)"/>
    </svg>
  `);
}

function setupActions() {
  $('product-grid').addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      addToCart(Number(add.dataset.add));
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) {
      historyData.clicks.push(Number(open.dataset.open));
      localStorage.setItem(historyKey, JSON.stringify(historyData));
      renderRecommendations();
    }
  });

  $('cart-items').addEventListener('click', (e) => {
    const qtyButton = e.target.closest('[data-qty]');
    if (!qtyButton) return;
    updateCartQuantity(Number(qtyButton.dataset.qty), Number(qtyButton.dataset.delta));
  });

  $('category-rail').addEventListener('click', (e) => {
    const button = e.target.closest('[data-category]');
    if (!button) return;
    state.categories = button.dataset.category ? [button.dataset.category] : [];
    syncCategoryUi();
    persistHistory();
    renderProducts();
  });

  $('open-filter-drawer').addEventListener('click', () => openPanel($('filter-drawer'), $('drawer-backdrop')));
  $('close-filter-drawer').addEventListener('click', () => closePanel($('filter-drawer'), $('drawer-backdrop')));
  $('drawer-backdrop').addEventListener('click', () => closePanel($('filter-drawer'), $('drawer-backdrop')));
  $('open-cart').addEventListener('click', () => openPanel($('cart-panel'), $('cart-backdrop')));
  $('close-cart').addEventListener('click', () => closePanel($('cart-panel'), $('cart-backdrop')));
  $('cart-backdrop').addEventListener('click', () => closePanel($('cart-panel'), $('cart-backdrop')));

  $('open-checkout').addEventListener('click', () => $('checkout-modal').showModal());
  $('close-checkout').addEventListener('click', () => $('checkout-modal').close());
}

function loadPayPalButtons() {
  const script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
  script.onload = () => {
    if (!window.paypal) return;
    window.paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '10.00' } }] }),
      onApprove: () => alert('PayPal Demo: Zahlung genehmigt')
    }).render('#paypal-buttons-container');
  };
  script.onerror = () => { $('paypal-buttons-container').textContent = 'PayPal konnte im Demo-Modus nicht geladen werden.'; };
  document.head.appendChild(script);
}

fillOptions();
renderCategoryRail();
bindFilters();
setupImageSearch();
setupActions();
initCheckoutControls();
syncCategoryUi();
renderProducts();
renderRecommendations();
renderCart();
loadPayPalButtons();
