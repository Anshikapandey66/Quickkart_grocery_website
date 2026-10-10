
const PRODUCTS = [
  {id:1,name:"Fresh Apples",category:"Fruits",emoji:"🍎",size:"4 pieces",price:99,oldPrice:120,rating:4.7,image:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80"},
  {id:2,name:"Sweet Bananas",category:"Fruits",emoji:"🍌",size:"6 pieces",price:40,oldPrice:48,rating:4.6,image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80"},
  {id:3,name:"Fresh Mangoes",category:"Fruits",emoji:"🥭",size:"2 pieces",price:129,oldPrice:159,rating:4.8,image:"https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=80"},
  {id:4,name:"Farm Fresh Milk",category:"Dairy",emoji:"🥛",size:"500 ml",price:32,oldPrice:35,rating:4.8,image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80"},
  {id:5,name:"Creamy Butter",category:"Dairy",emoji:"🧈",size:"100 g",price:58,oldPrice:65,rating:4.5,image:"https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80"},
  {id:6,name:"Fresh Eggs",category:"Dairy",emoji:"🥚",size:"6 pieces",price:48,oldPrice:54,rating:4.7,image:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=500&q=80"},
  {id:7,name:"Potato Chips",category:"Snacks",emoji:"🥔",size:"1 pack",price:20,oldPrice:25,rating:4.4,image:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80"},
  {id:8,name:"Chocolate Cookies",category:"Snacks",emoji:"🍪",size:"150 g",price:45,oldPrice:55,rating:4.6,image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80"},
  {id:9,name:"Orange Juice",category:"Drinks",emoji:"🧃",size:"1 litre",price:89,oldPrice:105,rating:4.5,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80"},
  {id:10,name:"Cold Coffee",category:"Drinks",emoji:"🥤",size:"250 ml",price:55,oldPrice:65,rating:4.4,image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80"},
  {id:11,name:"Fresh Broccoli",category:"Vegetables",emoji:"🥦",size:"250 g",price:40,oldPrice:49,rating:4.6,image:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80"},
  {id:12,name:"Red Tomatoes",category:"Vegetables",emoji:"🍅",size:"500 g",price:30,oldPrice:36,rating:4.7,image:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80"},
  {id:13,name:"Fresh Carrots",category:"Vegetables",emoji:"🥕",size:"500 g",price:35,oldPrice:42,rating:4.5,image:"https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80"},
  {id:14,name:"Peanut Butter",category:"Pantry",emoji:"🥜",size:"340 g",price:149,oldPrice:175,rating:4.8,image:"https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=500&q=80"},
  {id:15,name:"Rolled Oats",category:"Pantry",emoji:"🥣",size:"500 g",price:99,oldPrice:119,rating:4.6,image:"https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&q=80"},
  {id:16,name:"Dark Chocolate",category:"Snacks",emoji:"🍫",size:"80 g",price:75,oldPrice:90,rating:4.8,image:"https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=500&q=80"}
];

const CATEGORIES = [
  {name:"All",emoji:"🛍️"},
  {name:"Fruits",emoji:"🍎"},
  {name:"Vegetables",emoji:"🥦"},
  {name:"Dairy",emoji:"🥛"},
  {name:"Snacks",emoji:"🍪"},
  {name:"Drinks",emoji:"🥤"},
  {name:"Pantry",emoji:"🫙"}
];

const money = n => "₹" + Number(n).toFixed(2);
const $ = id => document.getElementById(id);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

let cart = readStorage("qk_cart", {});
let wishlist = readStorage("qk_wishlist", []);
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";
let couponApplied = false;
let toastTimer;

function saveData() {
  try {
    localStorage.setItem("qk_cart", JSON.stringify(cart));
    localStorage.setItem("qk_wishlist", JSON.stringify(wishlist));
  } catch {
    showToast("Could not save data in this browser.");
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function productById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function imageHTML(product, className) {
  return `
    <img class="${className}"
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
    <span class="product-placeholder"
      style="display:none">${product.emoji}</span>
  `;
}

// CATEGORY FILTERS

function renderCategories() {
  $("categoryList").innerHTML = CATEGORIES.map(c => `
    <button class="category-chip ${activeCategory === c.name ? "active" : ""}"
      data-category="${c.name}" type="button">
      ${c.emoji} ${c.name}
    </button>
  `).join("");
}

// PRODUCT SEARCH AND SORTING

function getVisibleProducts() {
  let list = PRODUCTS.filter(p => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;

    const text = `${p.name} ${p.category} ${p.size}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortMode === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderProducts() {
  const list = getVisibleProducts();

  $("productGrid").innerHTML = list.map(p => {
    const qty = cart[p.id] || 0;
    const saved = wishlist.includes(p.id);

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          ${imageHTML(p, "product-image")}
          <span class="product-badge">
            ${Math.round((1 - p.price / p.oldPrice) * 100)}% OFF
          </span>
          <button class="wish-button ${saved ? "active" : ""}"
            data-wish="${p.id}" type="button"
            aria-label="Toggle ${p.name} wishlist">
            ${saved ? "♥" : "♡"}
          </button>
        </div>

        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3>${p.name}</h3>
          <div class="product-meta">
            ${p.size} · <span class="rating">★ ${p.rating}</span>
          </div>

          <div class="product-bottom">
            <div class="price-area">
              <strong>${money(p.price)}</strong>
              <span class="old-price">${money(p.oldPrice)}</span>
            </div>
            <button class="add-button ${qty ? "in-cart" : ""}"
              data-add="${p.id}" type="button">
              ${qty ? `+ ${qty} · Add` : "ADD +"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  $("emptyState").classList.toggle("hidden", list.length > 0);
  $("productGrid").classList.toggle("hidden", list.length === 0);
}

// SHOPPING CART

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function subtotal() {
  return PRODUCTS.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0), 0
  );
}

function discount() {
  return couponApplied && subtotal() >= 299
    ? Math.round(subtotal() * 0.10 * 100) / 100
    : 0;
}

function deliveryFee() {
  const afterDiscount = subtotal() - discount();

  if (subtotal() === 0 || afterDiscount >= 299) return 0;
  return 25;
}

function grandTotal() {
  return subtotal() - discount() + deliveryFee();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveData();
  renderAll();
  showToast(productById(id).name + " added to cart!");
}

function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveData();
  renderAll();
}

function renderCart() {
  const entries = PRODUCTS.filter(p => cart[p.id] > 0);
  const count = cartCount();

  $("cartCount").textContent = count;
  $("drawerCartCount").textContent = count;

  if (entries.length === 0) {
    couponApplied = false;

    $("cartItems").innerHTML = `
      <div class="drawer-empty">
        <span>🛒</span>
        <h3>Your cart is empty!</h3>
        <p>Add your favourite groceries to get started.</p>
      </div>
    `;

    $("cartFooter").innerHTML = "";
    return;
  }

  $("cartItems").innerHTML = entries.map(p => `
    <div class="cart-line">
      ${imageHTML(p, "cart-line-image")}

      <div>
        <h3>${p.name}</h3>
        <small>${money(p.price)} · ${p.size}</small>

        <div class="quantity-control">
          <button data-qty="${p.id}" data-delta="-1">−</button>
          <span>${cart[p.id]}</span>
          <button data-qty="${p.id}" data-delta="1">+</button>
        </div>
      </div>

      <div>
        <div class="cart-line-price">
          ${money(p.price * cart[p.id])}
        </div>
        <button class="mini-button" data-remove="${p.id}">
          Remove
        </button>
      </div>
    </div>
  `).join("");

  $("cartFooter").innerHTML = `
    <div class="shipping-note">
      ${subtotal() - discount() >= 299
        ? "🎉 Free delivery unlocked!"
        : `Add ${money(299 - (subtotal() - discount()))} more for free delivery.`}
    </div>

    <div class="coupon-row">
      <input id="couponInput" placeholder="Coupon code">
      <button id="applyCoupon">Apply</button>
    </div>

    <p class="coupon-message">
      ${couponApplied
        ? "FRESH10 applied successfully!"
        : "Use FRESH10 on orders of ₹299 or more."}
    </p>

    <div class="bill-line">
      <span>Subtotal</span><b>${money(subtotal())}</b>
    </div>

    ${discount() ? `
      <div class="bill-line">
        <span>Discount</span><b>−${money(discount())}</b>
      </div>` : ""}

    <div class="bill-line">
      <span>Delivery</span>
      <b>${deliveryFee() === 0 ? "FREE" : money(deliveryFee())}</b>
    </div>

    <div class="bill-line total">
      <span>Total</span><span>${money(grandTotal())}</span>
    </div>

    <button class="shop-btn full-width" id="checkoutOpen">
      Checkout →
    </button>
  `;

  if (couponApplied) {
    $("couponInput").value = "FRESH10";
  }
}

// WISHLIST

function toggleWishlist(id) {
  id = Number(id);

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist ♥");
  }

  saveData();
  renderAll();
}

function renderWishlist() {
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  $("drawerWishCount").textContent = items.length;

  $("wishlistItems").innerHTML = items.length
    ? items.map(p => `
      <div class="saved-line">
        ${imageHTML(p, "")}
        <div>
          <strong>${p.name}</strong>
          <p>${money(p.price)}</p>
          <button class="mini-button" data-add="${p.id}">
            Add to cart
          </button>
          <button class="mini-button" data-wish="${p.id}">
            Remove ♥
          </button>
        </div>
      </div>
    `).join("")
    : `<div class="drawer-empty">
        <span>♡</span>
        <h3>No saved products</h3>
        <p>Tap the heart on a product to save it.</p>
      </div>`;

  // Keep the header count accurate.
  const headerCount = document.querySelector("#wishlistOpen .count");
  if (headerCount) headerCount.textContent = wishlist.length;
}

// DRAWERS

function openDrawer(id) {
  closeDrawers();

  $("overlay").classList.add("open");
  $(id).classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  document.querySelectorAll(".drawer").forEach(drawer => {
    drawer.classList.remove("open");
  });

  $("overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function renderAll() {
  renderCategories();
  renderProducts();
  renderCart();
  renderWishlist();
}

// CHECKOUT DEMO

function openCheckout() {
  if (cartCount() === 0) {
    showToast("Please add products first");
    return;
  }

  closeDrawers();

  $("checkoutContent").classList.remove("hidden");
  $("orderSuccess").classList.add("hidden");

  $("checkoutSummary").innerHTML = `
    <div>
      <span>Subtotal</span><b>${money(subtotal())}</b>
    </div>
    ${discount() ? `
      <div><span>Discount</span><b>−${money(discount())}</b></div>
    ` : ""}
    <div>
      <span>Delivery</span>
      <b>${deliveryFee() === 0 ? "FREE" : money(deliveryFee())}</b>
    </div>
    <div>
      <span>Total</span><b>${money(grandTotal())}</b>
    </div>
  `;

  $("checkoutModal").classList.remove("hidden");
}

function closeCheckout() {
  $("checkoutModal").classList.add("hidden");
}

function placeOrder(formData) {
  const orderId = "QK" + Date.now().toString().slice(-7);

  const order = {
    id: orderId,
    customer: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    payment: formData.get("payment"),
    total: grandTotal(),
    date: new Date().toLocaleString()
  };

  $("checkoutContent").classList.add("hidden");
  $("orderSuccess").classList.remove("hidden");

  $("orderSuccess").innerHTML = `
    <h2>🎉 Order Confirmed!</h2>
    <p>This is a demo order. No real delivery or payment was processed.</p>
    <br>
    <p><b>Order ID:</b> ${order.id}</p>
    <p><b>Name:</b> ${order.customer}</p>
    <p><b>Address:</b> ${order.address}</p>
    <p><b>Total:</b> ${money(order.total)}</p>
    <p><b>Status:</b> Confirmed (demo)</p>
    <br>
    <button class="shop-btn full-width" id="finishOrder">
      Continue Shopping
    </button>
  `;

  try {
    const orders = readStorage("qk_orders", []);
    orders.unshift(order);
    localStorage.setItem("qk_orders", JSON.stringify(orders.slice(0, 10)));
  } catch {}

  cart = {};
  couponApplied = false;
  saveData();
  renderAll();
}

// EVENT LISTENERS

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.category) {
    activeCategory = button.dataset.category;
    renderCategories();
    renderProducts();
  }

  if (button.dataset.add) addToCart(button.dataset.add);

  if (button.dataset.wish) toggleWishlist(button.dataset.wish);

  if (button.dataset.qty) {
    changeQuantity(
      button.dataset.qty,
      Number(button.dataset.delta)
    );
  }

  if (button.dataset.remove) {
    delete cart[button.dataset.remove];
    saveData();
    renderAll();
    showToast("Product removed");
  }

  if (button.dataset.close !== undefined) closeDrawers();

  if (button.dataset.modalClose !== undefined) closeCheckout();

  if (button.id === "checkoutOpen") openCheckout();

  if (button.id === "applyCoupon") {
    const code = $("couponInput").value.trim().toUpperCase();

    if (code === "FRESH10" && subtotal() >= 299) {
      couponApplied = true;
      renderAll();
      showToast("10% discount applied!");
    } else if (code === "FRESH10") {
      showToast("Coupon requires a ₹299 subtotal");
    } else {
      couponApplied = false;
      renderAll();
      showToast("Invalid coupon code");
    }
  }

  if (button.id === "finishOrder") {
    closeCheckout();
    showToast("Happy shopping!");
    document.getElementById("shop").scrollIntoView({
      behavior: "smooth"
    });
  }

  if (button.id === "clearFilters") {
    activeCategory = "All";
    searchTerm = "";
    $("searchInput").value = "";
    renderAll();
  }
});

$("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

$("sortSelect").addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

$("cartOpen").addEventListener("click", () => {
  openDrawer("cartDrawer");
});

$("overlay").addEventListener("click", closeDrawers);

$("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!event.currentTarget.reportValidity()) return;

  placeOrder(new FormData(event.currentTarget));
});

$("checkoutModal").addEventListener("click", event => {
  if (event.target.id === "checkoutModal") closeCheckout();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeDrawers();
    closeCheckout();
  }
});

renderAll();
