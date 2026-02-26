const products = [
  {
    id: 1,
    name: 'Vintage Jeansjacke',
    price: 34.9,
    size: 'M',
    condition: 'Sehr gut',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Leinenhemd Blau',
    price: 22.5,
    size: 'L',
    condition: 'Wie neu',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Sommerkleid Floral',
    price: 29.99,
    size: 'S',
    condition: 'Sehr gut',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Oversize Hoodie',
    price: 27,
    size: 'XL',
    condition: 'Gut',
    image:
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Karierter Blazer',
    price: 39,
    size: 'M',
    condition: 'Wie neu',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    name: 'Chino Hose Beige',
    price: 24.5,
    size: 'L',
    condition: 'Sehr gut',
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    name: 'Basic T-Shirt Set',
    price: 15,
    size: 'XS',
    condition: 'Gut',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Strickpullover Creme',
    price: 26.75,
    size: 'S',
    condition: 'Wie neu',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80'
  }
];

const storageKey = 'thriftstyle-cart';
const cart = JSON.parse(localStorage.getItem(storageKey)) || [];

const productGrid = document.getElementById('product-grid');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const sizeFilter = document.getElementById('size-filter');
const conditionFilter = document.getElementById('condition-filter');
const priceFilter = document.getElementById('price-filter');
const cartPanel = document.getElementById('cart-panel');
const backdrop = document.getElementById('backdrop');

function formatEuro(value) {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function getFilteredProducts() {
  const selectedSize = sizeFilter.value;
  const selectedCondition = conditionFilter.value;
  const maxPrice = Number(priceFilter.value);

  return products.filter((product) => {
    const sizeMatch = selectedSize === 'alle' || product.size === selectedSize;
    const conditionMatch =
      selectedCondition === 'alle' || product.condition === selectedCondition;
    const priceMatch = !maxPrice || product.price <= maxPrice;

    return sizeMatch && conditionMatch && priceMatch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();

  if (!filtered.length) {
    productGrid.innerHTML =
      '<p>Keine Produkte für die gewählten Filter gefunden. Bitte Filter anpassen.</p>';
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-content">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${formatEuro(product.price)}</span>
          <p class="product-meta">Größe: ${product.size} · Zustand: ${product.condition}</p>
          <button class="add-button" data-id="${product.id}" type="button">In den Warenkorb</button>
        </div>
      </article>
    `
    )
    .join('');
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function renderCart() {
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${formatEuro(item.price)} · Größe ${item.size}</p>
            <button class="remove-link" data-remove="${item.id}">Entfernen</button>
          </div>
          <div>
            <div class="quantity-controls">
              <button type="button" data-qty="${item.id}" data-delta="-1">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty="${item.id}" data-delta="1">+</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartTotalEl.textContent = formatEuro(total);
  cartCountEl.textContent = count;
}

function openCart() {
  cartPanel.classList.add('open');
  cartPanel.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartPanel.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}

document.getElementById('filters').addEventListener('input', renderProducts);

document.getElementById('open-cart').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-id]');
  if (!button) return;

  addToCart(Number(button.dataset.id));
});

cartItemsEl.addEventListener('click', (event) => {
  const qtyButton = event.target.closest('[data-qty]');
  if (qtyButton) {
    updateQuantity(Number(qtyButton.dataset.qty), Number(qtyButton.dataset.delta));
    return;
  }

  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

renderProducts();
renderCart();
