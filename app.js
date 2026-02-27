const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
const CONDITIONS = ['Neu mit Etikett', 'Wie neu', 'Sehr gut', 'Gut'];
const CATEGORIES = ['Damen', 'Herren', 'Kinder', 'Elektro', 'Haushalt'];
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';
const EXPRESS_SURCHARGE = 7.9;

const USER_KEY = 'ts_users';
const SESSION_KEY = 'ts_session';
const USER_PRODUCTS_KEY = 'ts_user_products';
const historyKey = 'thriftstyle-history-v2';
const cartKey = 'thriftstyle-cart-v2';
const checkoutPrefsKey = 'thriftstyle-checkout-v1';

const CATEGORY_PLACEHOLDER_IMAGES = {
  Damen: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  Herren: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80',
  Kinder: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
  Elektro: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  Haushalt: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80'
};

const seedProducts = [
  { id: 1, title: 'Leinenbluse Weiß', brand: 'Armedangels', price: 29, size: 'S', zustand: 'Wie neu', farbe: 'Weiß', material: 'Leinen', category: 'Damen', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', locationText: 'Berlin • Versand möglich' },
  { id: 2, title: 'Vintage Jeansjacke', brand: 'Levi\'s', price: 44, size: 'M', zustand: 'Sehr gut', farbe: 'Blau', material: 'Denim', category: 'Herren', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', locationText: 'Hamburg • Versand möglich' },
  { id: 3, title: 'Kinder Regenjacke', brand: 'Tchibo', price: 14, size: 'XXS', zustand: 'Gut', farbe: 'Gelb', material: 'Polyester', category: 'Kinder', image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80', locationText: 'Köln • Abholung' },
  { id: 4, title: 'Bluetooth Kopfhörer', brand: 'Sony', price: 65, size: 'M', zustand: 'Wie neu', farbe: 'Schwarz', material: 'Kunststoff', category: 'Elektro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', locationText: 'München • Versand möglich' },
  { id: 5, title: 'Mixer Pro 900', brand: 'Bosch', price: 49, size: 'L', zustand: 'Neu mit Etikett', farbe: 'Silber', material: 'Edelstahl', category: 'Haushalt', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80', locationText: 'Frankfurt • Versand möglich' }
].map((product) => ({ ...product, image: getSafeImage(product), createdAt: Date.now() - product.id * 10000 }));

let userProducts = readJson(USER_PRODUCTS_KEY, []);
let products = mergeProducts();
let authMode = 'login';

const state = { search: '', brandSelect: '', brandText: '', priceMin: '', priceMax: '', categories: [], conditions: [], sizes: [], colors: [], materials: [], sort: 'newest' };
const historyData = readJson(historyKey, { clicks: [], searches: [], filters: [] });
const cart = readJson(cartKey, []);
const checkoutState = readJson(checkoutPrefsKey, { shippingProvider: 'DHL', shippingSpeed: 'standard', insuranceEnabled: false });

const $ = (id) => document.getElementById(id);
const unique = (arr) => [...new Set(arr)];
const euro = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 2600);
}

function hasValidImageUrl(value) {
  return typeof value === 'string' && (/^https?:\/\//.test(value) || value.startsWith('data:image/'));
}

function getSafeImage(product) {
  return hasValidImageUrl(product.image) ? product.image : (CATEGORY_PLACEHOLDER_IMAGES[product.category] || CATEGORY_PLACEHOLDER_IMAGES.Damen);
}

function mergeProducts() {
  return [...seedProducts, ...userProducts].map((p) => ({ ...p, image: getSafeImage(p) }));
}

function getSession() {
  return readJson(SESSION_KEY, null);
}

function getUsers() {
  return readJson(USER_KEY, []);
}

function getCurrentUser() {
  const session = getSession();
  if (!session?.userId) return null;
  return getUsers().find((u) => u.id === session.userId) || null;
}

async function hashPassword(password) {
  if (window.crypto?.subtle?.digest) {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // TODO: fallback entfernen und ausschließlich WebCrypto nutzen.
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) hash = ((hash << 5) - hash) + password.charCodeAt(i);
  return `fallback_${Math.abs(hash)}`;
}

function renderAccountNav() {
  const nav = $('account-nav');
  const user = getCurrentUser();
  if (!user) {
    nav.innerHTML = '<button id="open-auth" class="secondary" type="button" aria-label="Anmelden">Anmelden</button>';
    $('open-auth').addEventListener('click', () => $('auth-modal').showModal());
    return;
  }

  nav.innerHTML = `
    <button id="open-account-menu" type="button" class="icon-btn avatar-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Konto-Menü öffnen">
      <span class="avatar-dot">${user.name.charAt(0).toUpperCase()}</span>
      <span>${user.name}</span>
    </button>
    <div class="account-menu" id="account-menu" hidden>
      <button type="button" data-view="account" class="secondary">Mein Konto</button>
      <button type="button" data-view="sell" class="secondary">Artikel einstellen</button>
      <button type="button" data-view="my-items" class="secondary">Meine Artikel</button>
      <button type="button" id="logout-btn">Abmelden</button>
    </div>
  `;

  $('open-account-menu').addEventListener('click', () => {
    const menu = $('account-menu');
    const open = menu.hidden;
    menu.hidden = !open;
    $('open-account-menu').setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      showView(button.dataset.view);
      $('account-menu').hidden = true;
    });
  });

  $('logout-btn').addEventListener('click', () => {
    localStorage.removeItem(SESSION_KEY);
    showView('shop');
    renderAccountNav();
    renderMyItems();
    showToast('Erfolgreich abgemeldet');
  });
}

function showView(view) {
  $('shop-view').hidden = view !== 'shop';
  $('account-view').hidden = view !== 'account';
  $('sell-view').hidden = view !== 'sell';
  $('my-items-view').hidden = view !== 'my-items';
  if (view === 'account') renderAccountView();
  if (view === 'my-items') renderMyItems();
  if (view === 'sell') {
    if (!getCurrentUser()) {
      showToast('Bitte zuerst anmelden, um Artikel einzustellen');
      $('auth-modal').showModal();
      showView('shop');
    }
  }
}

function renderAccountView() {
  const user = getCurrentUser();
  const root = $('account-summary');
  if (!user) {
    root.innerHTML = '<p>Du bist aktuell nicht angemeldet.</p>';
    return;
  }
  const ownCount = userProducts.filter((p) => p.ownerUserId === user.id).length;
  root.innerHTML = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>E-Mail:</strong> ${user.email}</p>
    <p><strong>Konto erstellt:</strong> ${new Date(user.createdAt).toLocaleString('de-DE')}</p>
    <p><strong>Eigene Artikel:</strong> ${ownCount}</p>
  `;
}

function renderMyItems() {
  const user = getCurrentUser();
  const list = $('my-items-list');
  if (!user) {
    list.innerHTML = '<p>Bitte anmelden, um deine Artikel zu sehen.</p>';
    return;
  }
  const own = userProducts.filter((p) => p.ownerUserId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  list.innerHTML = own.length ? own.map((p) => `
    <article class="product-card">
      <div class="product-media-wrap"><img src="${getSafeImage(p)}" alt="${p.title}" /></div>
      <div class="product-content">
        <h3>${p.title}</h3>
        <p class="price">${euro(p.price)}</p>
        <p class="meta">${p.brand} · ${p.size} · ${p.zustand}</p>
        <button type="button" class="secondary" data-delete-product="${p.id}">Löschen</button>
      </div>
    </article>
  `).join('') : '<p>Du hast noch keine Artikel eingestellt.</p>';
}

function fillChecks(containerId, values, group) {
  $(containerId).innerHTML = values.map((item) => `<label class="filter-option"><input type="checkbox" data-group="${group}" value="${item}" /> ${item}</label>`).join('');
}

function fillOptions() {
  fillChecks('size-filters', SIZES, 'sizes');
  fillChecks('condition-filters', CONDITIONS, 'conditions');
  fillChecks('category-filters', CATEGORIES, 'categories');
  const colors = unique(products.map((p) => p.farbe)).sort();
  const materials = unique(products.map((p) => p.material)).sort();
  const brands = unique(products.map((p) => p.brand)).sort();
  fillChecks('color-filters', colors, 'colors');
  fillChecks('material-filters', materials, 'materials');
  $('brand-select').innerHTML = '<option value="">Alle Marken</option>' + brands.map((brand) => `<option>${brand}</option>`).join('');
  $('image-color').innerHTML = '<option value="">Farbe wählen</option>' + colors.map((color) => `<option>${color}</option>`).join('');
}

function renderCategoryRail() {
  $('category-rail').innerHTML = ['Alle', ...CATEGORIES].map((category) => `
    <button type="button" class="category-chip ${state.categories[0] === category ? 'active' : ''}" data-category="${category === 'Alle' ? '' : category}">${category}</button>
  `).join('');
}

function syncCategoryUi() {
  renderCategoryRail();
  document.querySelectorAll('input[data-group="categories"]').forEach((input) => {
    input.checked = state.categories.includes(input.value);
  });
}

function filterProducts() {
  let list = [...products];
  const term = state.search.toLowerCase();
  if (term) {
    list = list.filter((p) => [p.title, p.brand, p.material, p.farbe, p.description || ''].join(' ').toLowerCase().includes(term));
  }
  if (state.brandSelect) list = list.filter((p) => p.brand === state.brandSelect);
  if (state.brandText) list = list.filter((p) => p.brand.toLowerCase().includes(state.brandText.toLowerCase()));
  if (state.priceMin !== '') list = list.filter((p) => p.price >= Number(state.priceMin));
  if (state.priceMax !== '') list = list.filter((p) => p.price <= Number(state.priceMax));
  if (state.categories.length) list = list.filter((p) => state.categories.includes(p.category));
  if (state.conditions.length) list = list.filter((p) => state.conditions.includes(p.zustand));
  if (state.sizes.length) list = list.filter((p) => state.sizes.includes(p.size));
  if (state.colors.length) list = list.filter((p) => state.colors.includes(p.farbe));
  if (state.materials.length) list = list.filter((p) => state.materials.includes(p.material));

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'newest') list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return list;
}

function card(product, showCta = true) {
  const user = getCurrentUser();
  const mine = user && product.ownerUserId === user.id;
  return `
  <article class="product-card">
    <div class="product-media-wrap">
      <img src="${getSafeImage(product)}" alt="${product.title}" loading="lazy" onerror="window.tsImageFallback?.(this)" />
      <span class="condition-badge">${product.zustand}</span>
    </div>
    <div class="product-content">
      <h3>${product.title}</h3>
      <div class="price">${euro(product.price)}</div>
      <div class="meta brand">${product.brand}</div>
      <div class="meta">${product.size} · ${product.farbe} · ${product.material}</div>
      ${mine ? '<span class="owned-pill">Mein Artikel</span>' : ''}
      <button class="secondary" type="button" data-open="${product.id}">Details</button>
      ${showCta ? `<button class="primary" type="button" data-add="${product.id}">In den Warenkorb</button>` : ''}
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
  const ranked = [...products].sort((a, b) => (score.get(b.id) - score.get(a.id)) || (b.createdAt - a.createdAt)).slice(0, 4);
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
      document.querySelectorAll('input[data-group="categories"]').forEach((input) => { if (input !== box) input.checked = false; });
    }
    state[group] = [...document.querySelectorAll(`input[data-group="${group}"]:checked`)].map((x) => x.value);
    if (group === 'categories') syncCategoryUi();
  });

  $('apply-filters').addEventListener('click', () => { persistHistory(); syncCategoryUi(); renderProducts(); closePanel($('filter-drawer'), $('drawer-backdrop')); });
  $('reset-filters').addEventListener('click', () => {
    Object.assign(state, { search: '', brandSelect: '', brandText: '', priceMin: '', priceMax: '', categories: [], conditions: [], sizes: [], colors: [], materials: [], sort: 'newest' });
    ['search-input', 'brand-select', 'brand-text', 'price-min', 'price-max'].forEach((id) => { $(id).value = ''; });
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
  if (existing) existing.quantity += 1;
  else {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart.splice(cart.findIndex((entry) => entry.id === productId), 1);
  renderCart();
}

function getSubtotal() { return cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
function getItemCount() { return cart.reduce((sum, item) => sum + item.quantity, 0); }

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
  return { shippingTotal, freeStandardActive, label: `${shippingProvider} · ${shippingSpeed === 'express' ? 'Express (1–2 Werktage)' : 'Standard (3–5 Werktage)'}` };
}

function calculateBuyerProtection(subtotal) { return subtotal ? subtotal * 0.02 + 0.5 : 0; }
function calculateInsurance(subtotal, insuranceEnabled) { return (!insuranceEnabled || !subtotal) ? 0 : Math.min(9.99, Math.max(1.49, subtotal * 0.015)); }
function saveCheckoutPrefs() { localStorage.setItem(checkoutPrefsKey, JSON.stringify(checkoutState)); }

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
  $('cart-items').innerHTML = !cart.length ? '<p>Warenkorb ist leer.</p>' : cart.map((item) => `
      <div class="cart-item">
        <div><strong>${item.title}</strong><div>${euro(item.price)} · ${item.size}</div></div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-qty="${item.id}" data-delta="-1" aria-label="Menge verringern">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-qty="${item.id}" data-delta="1" aria-label="Menge erhöhen">+</button>
        </div>
      </div>
    `).join('');
  $('cart-count').textContent = getItemCount();
  updateTotal();
}

function initCheckoutControls() {
  document.querySelectorAll('input[name="shipping-provider"]').forEach((radio) => {
    radio.checked = radio.value === checkoutState.shippingProvider;
    radio.addEventListener('change', (e) => { checkoutState.shippingProvider = e.target.value; saveCheckoutPrefs(); updateTotal(); });
  });

  document.querySelectorAll('input[name="shipping-speed"]').forEach((radio) => {
    radio.checked = radio.value === checkoutState.shippingSpeed;
    radio.addEventListener('change', (e) => { checkoutState.shippingSpeed = e.target.value; saveCheckoutPrefs(); updateTotal(); });
  });

  $('insurance-toggle').checked = !!checkoutState.insuranceEnabled;
  $('insurance-toggle').addEventListener('change', (e) => { checkoutState.insuranceEnabled = e.target.checked; saveCheckoutPrefs(); updateTotal(); });
}

function setImageFallback(img) {
  if (!img || img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#6d4dff"/></svg>');
}
window.tsImageFallback = setImageFallback;

function validateSellForm(values, files) {
  if (!getCurrentUser()) return 'Bitte zuerst anmelden.';
  if (!values.title || !values.brand || !values.price || !values.size || !values.zustand || !values.farbe || !values.material || !values.category) return 'Bitte alle Pflichtfelder ausfüllen.';
  if (Number(values.price) <= 0) return 'Der Preis muss größer als 0 sein.';
  if (!files.length || files.length > 3) return 'Bitte 1 bis 3 Bilder hochladen.';
  if ([...files].some((f) => !f.type.startsWith('image/'))) return 'Es sind nur Bilddateien erlaubt.';
  return '';
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleSellSubmit(e) {
  e.preventDefault();
  const values = {
    title: $('sell-title').value.trim(),
    description: $('sell-description').value.trim(),
    brand: $('sell-brand').value.trim(),
    price: Number($('sell-price').value),
    size: $('sell-size').value,
    zustand: $('sell-condition').value,
    farbe: $('sell-color').value.trim(),
    material: $('sell-material').value.trim(),
    category: $('sell-category').value
  };
  const files = $('sell-images').files;
  const error = validateSellForm(values, files);
  $('sell-form-error').textContent = error;
  if (error) return;

  const images = await Promise.all([...files].slice(0, 3).map(fileToDataUrl));
  const user = getCurrentUser();
  const product = {
    id: `u_${Date.now()}`,
    ...values,
    image: images[0],
    images,
    ownerUserId: user.id,
    createdAt: Date.now(),
    locationText: 'Demo User • Versand möglich'
  };
  userProducts.push(product);
  localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(userProducts));
  refreshProducts();
  $('sell-form').reset();
  $('sell-form-error').textContent = '';
  showView('my-items');
  renderMyItems();
  showToast('Artikel veröffentlicht');
}

function refreshProducts() {
  products = mergeProducts();
  fillOptions();
  syncCategoryUi();
  renderProducts();
  renderRecommendations();
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = $('auth-email').value.trim().toLowerCase();
  const password = $('auth-password').value;
  const name = $('auth-name').value.trim();
  const users = getUsers();

  if (!email || !password) {
    $('auth-error').textContent = 'Bitte E-Mail und Passwort ausfüllen.';
    return;
  }

  if (authMode === 'register') {
    if (!name) {
      $('auth-error').textContent = 'Bitte gib deinen Namen ein.';
      return;
    }
    if (users.some((u) => u.email === email)) {
      $('auth-error').textContent = 'Diese E-Mail ist bereits registriert.';
      return;
    }
    const passwordHash = await hashPassword(password);
    const newUser = { id: `u_${Date.now()}`, name, email, passwordHash, createdAt: Date.now() };
    localStorage.setItem(USER_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, email, loginAt: Date.now() }));
    $('auth-modal').close();
    showToast('Konto erstellt und angemeldet');
  } else {
    const user = users.find((u) => u.email === email);
    if (!user) {
      $('auth-error').textContent = 'Kein Konto mit dieser E-Mail gefunden.';
      return;
    }
    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      $('auth-error').textContent = 'Passwort ist nicht korrekt.';
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, email, loginAt: Date.now() }));
    $('auth-modal').close();
    showToast('Erfolgreich angemeldet');
  }

  $('auth-form').reset();
  $('auth-error').textContent = '';
  renderAccountNav();
  renderProducts();
  renderRecommendations();
}

function setAuthMode(mode) {
  authMode = mode;
  const register = mode === 'register';
  $('auth-title').textContent = register ? 'Registrieren' : 'Anmelden';
  $('auth-submit').textContent = register ? 'Registrieren' : 'Anmelden';
  $('register-name-wrap').hidden = !register;
  $('toggle-auth-mode').textContent = register ? 'Schon ein Konto? Anmelden' : 'Noch kein Konto? Registrieren';
  $('auth-error').textContent = '';
}

function setupSellFormOptions() {
  $('sell-size').innerHTML = '<option value="">Bitte wählen</option>' + SIZES.map((s) => `<option>${s}</option>`).join('');
  $('sell-condition').innerHTML = '<option value="">Bitte wählen</option>' + CONDITIONS.map((c) => `<option>${c}</option>`).join('');
  $('sell-category').innerHTML = '<option value="">Bitte wählen</option>' + CATEGORIES.map((c) => `<option>${c}</option>`).join('');
}

function setupActions() {
  $('product-grid').addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) return addToCart(add.dataset.add.startsWith('u_') ? add.dataset.add : Number(add.dataset.add));
    const open = e.target.closest('[data-open]');
    if (open) {
      historyData.clicks.push(open.dataset.open.startsWith('u_') ? open.dataset.open : Number(open.dataset.open));
      localStorage.setItem(historyKey, JSON.stringify(historyData));
      renderRecommendations();
    }
  });

  $('my-items-list').addEventListener('click', (e) => {
    const button = e.target.closest('[data-delete-product]');
    if (!button) return;
    const id = button.dataset.deleteProduct;
    userProducts = userProducts.filter((p) => p.id !== id);
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(userProducts));
    refreshProducts();
    renderMyItems();
    showToast('Artikel gelöscht');
  });

  $('cart-items').addEventListener('click', (e) => {
    const qtyButton = e.target.closest('[data-qty]');
    if (!qtyButton) return;
    updateCartQuantity(qtyButton.dataset.qty.startsWith('u_') ? qtyButton.dataset.qty : Number(qtyButton.dataset.qty), Number(qtyButton.dataset.delta));
  });

  $('category-rail').addEventListener('click', (e) => {
    const button = e.target.closest('[data-category]');
    if (!button) return;
    state.categories = button.dataset.category ? [button.dataset.category] : [];
    syncCategoryUi(); persistHistory(); renderProducts();
  });

  $('open-filter-drawer').addEventListener('click', () => openPanel($('filter-drawer'), $('drawer-backdrop')));
  $('close-filter-drawer').addEventListener('click', () => closePanel($('filter-drawer'), $('drawer-backdrop')));
  $('drawer-backdrop').addEventListener('click', () => closePanel($('filter-drawer'), $('drawer-backdrop')));
  $('open-cart').addEventListener('click', () => openPanel($('cart-panel'), $('cart-backdrop')));
  $('close-cart').addEventListener('click', () => closePanel($('cart-panel'), $('cart-backdrop')));
  $('cart-backdrop').addEventListener('click', () => closePanel($('cart-panel'), $('cart-backdrop')));

  $('open-checkout').addEventListener('click', () => $('checkout-modal').showModal());
  $('close-checkout').addEventListener('click', () => $('checkout-modal').close());

  $('close-auth').addEventListener('click', () => $('auth-modal').close());
  $('toggle-auth-mode').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'register' : 'login'));
  $('auth-form').addEventListener('submit', handleAuthSubmit);
  $('sell-form').addEventListener('submit', handleSellSubmit);

  ['back-to-shop', 'back-to-shop-2', 'back-to-shop-3'].forEach((id) => $(id).addEventListener('click', () => showView('shop')));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#account-nav')) {
      const menu = $('account-menu');
      if (menu) menu.hidden = true;
    }
  });
}

function loadPayPalButtons() {
  const script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
  script.onload = () => {
    if (!window.paypal) return;
    window.paypal.Buttons({ createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '10.00' } }] }), onApprove: () => alert('PayPal Demo: Zahlung genehmigt') }).render('#paypal-buttons-container');
  };
  script.onerror = () => { $('paypal-buttons-container').textContent = 'PayPal konnte im Demo-Modus nicht geladen werden.'; };
  document.head.appendChild(script);
}

fillOptions();
renderCategoryRail();
bindFilters();
setupImageSearch();
setupActions();
setupSellFormOptions();
initCheckoutControls();
syncCategoryUi();
renderAccountNav();
renderProducts();
renderRecommendations();
renderCart();
loadPayPalButtons();
setAuthMode('login');
