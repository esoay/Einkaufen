const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
const CONDITIONS = ['Neu mit Etikett', 'Wie neu', 'Sehr gut', 'Gut'];
const CATEGORIES = ['Damen', 'Herren', 'Kinder', 'Elektro', 'Haushalt'];
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';

const products = [
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

const state = { search: '', brandSelect: '', brandText: '', priceMin: '', priceMax: '', categories: [], conditions: [], sizes: [], colors: [], materials: [], sort: 'newest' };
const historyKey = 'thriftstyle-history-v2';
const cartKey = 'thriftstyle-cart-v2';
const historyData = JSON.parse(localStorage.getItem(historyKey) || '{"clicks":[],"searches":[],"filters":[]}');
const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

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
    .concat(CATEGORIES.map((category) => `<button type="button" class="category-chip" data-category="${category}">${category}</button>`))
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
  return `<article class="product-card" data-open="${p.id}">
    <img src="${p.image}" alt="${p.title}" loading="lazy" />
    <div class="product-content">
      <strong>${p.title}</strong>
      <span>${euro(p.price)}</span>
      <div class="meta">${p.brand} · ${p.size} · ${p.zustand}</div>
      <div class="meta">${p.category} · ${p.farbe} · ${p.material}</div>
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

function persistHistory() {
  if (state.search) historyData.searches.push(state.search);
  historyData.filters.push({ categories: state.categories, sizes: state.sizes, brands: [state.brandSelect, state.brandText].filter(Boolean) });
  localStorage.setItem(historyKey, JSON.stringify(historyData));
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
  // MVP: Simulierte Bildsuche über ausgewählte Attribute und optional Dateiname als Heuristik.
  const nameHint = (file?.name || '').toLowerCase();
  return products.filter((p) => {
    const categoryOk = !hints.category || p.category === hints.category;
    const colorOk = !hints.color || p.farbe === hints.color;
    const filenameOk = !nameHint || [p.title, p.farbe, p.material, p.category].join(' ').toLowerCase().includes(nameHint.replace(/\.[a-z]+$/i, ''));
    return categoryOk && colorOk && filenameOk;
  }).map((p) => p.id);
}

function renderCart() {
  $('cart-items').innerHTML = cart.length ? cart.map((item) => `<div class="cart-item"><strong>${item.title}</strong><div>${euro(item.price)}</div></div>`).join('') : '<p>Warenkorb ist leer.</p>';
  $('cart-total').textContent = euro(cart.reduce((sum, x) => sum + x.price, 0));
  $('cart-count').textContent = cart.length;
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function setupActions() {
  $('product-grid').addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = products.find((x) => x.id === Number(add.dataset.add));
      cart.push(p);
      renderCart();
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) {
      historyData.clicks.push(Number(open.dataset.open));
      localStorage.setItem(historyKey, JSON.stringify(historyData));
      renderRecommendations();
    }
  });

  $('category-rail').addEventListener('click', (e) => {
    const button = e.target.closest('[data-category]');
    if (!button) return;
    const category = button.dataset.category;
    state.categories = category ? [category] : [];
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
syncCategoryUi();
renderProducts();
renderRecommendations();
renderCart();
loadPayPalButtons();
