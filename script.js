const products = [
    { id: "sambal-red", name: "Rangavati Red Ikat Saree", category: "Sarees", price: 6850, oldPrice: 7900, tag: "BESTSELLER", color: "Red · Ivory", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=82", alt: "Model wearing a red traditional Indian saree" },
    { id: "sambal-indigo", name: "Neelambari Cotton Ikat", category: "Sarees", price: 5400, oldPrice: null, tag: "HANDWOVEN", color: "Indigo · Ecru", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=82", alt: "Colorful handwoven fabric on a loom" },
    { id: "sambal-ochre", name: "Suna Phula Silk Blend", category: "Sarees", price: 8200, oldPrice: null, tag: "LIMITED WEAVE", color: "Ochre · Rust", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=82", alt: "Woman wearing a warm-toned Indian saree" },
    { id: "ikat-dupatta", name: "Kosal Ikat Dupatta", category: "Dupattas", price: 2450, oldPrice: 2900, tag: "EVERYDAY FAVOURITE", color: "Terracotta · Cream", image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=82", alt: "Handwoven textile with artisan hands" },
    { id: "sambal-black", name: "Charcoal Pasapalli Saree", category: "Sarees", price: 7200, oldPrice: null, tag: "NEW ARRIVAL", color: "Black · Sand", image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=82", alt: "Artisan hands working with colorful woven threads" },
    { id: "ikat-stole", name: "Bargarh Woven Stole", category: "Stoles", price: 1850, oldPrice: null, tag: "SMALL BATCH", color: "Rust · Indigo", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=82", alt: "Colorful woven fabric on a loom" }
];

const money = amount => `₹${amount.toLocaleString("en-IN")}`;
let category = "All";
let cart = JSON.parse(localStorage.getItem("tantu-cart") || "[]");
let toastTimeout;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");

function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = products.filter(product =>
        (category === "All" || product.category === category) &&
        `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query)
    );
    if (sortSelect.value === "price-low") visible = visible.sort((a, b) => a.price - b.price);
    if (sortSelect.value === "price-high") visible = visible.sort((a, b) => b.price - a.price);

    productGrid.innerHTML = visible.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${product.alt}" loading="lazy">
                <span class="product-tag">${product.tag}</span>
                <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">+ Add to bag</button>
                <button class="favorite-button" data-favorite="${product.id}" aria-label="Save ${product.name} to favourites">♡</button>
            </div>
            <div class="product-info"><div><p class="product-category">${product.category.slice(0, -1) || product.category} <span>·</span> Sambalpuri Ikat</p><h3>${product.name}</h3><p class="product-color">${product.color}</p></div><div class="product-price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div></div>
        </article>`).join("");
    document.getElementById("noResults").classList.toggle("hidden", visible.length !== 0);
}

function saveCart() {
    localStorage.setItem("tantu-cart", JSON.stringify(cart));
    renderCart();
}

function addToCart(id) {
    const item = cart.find(entry => entry.id === id);
    if (item) item.quantity += 1;
    else cart.push({ id, quantity: 1 });
    saveCart();
    showToast("Added to your bag");
}

function renderCart() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
    document.getElementById("drawerCount").textContent = `(${count})`;
    document.getElementById("cartSubtotal").textContent = money(total);
    document.getElementById("cartEmpty").classList.toggle("hidden", count > 0);
    document.getElementById("cartFooter").classList.toggle("hidden", count === 0);
    document.getElementById("cartItems").innerHTML = cart.map(item => {
        const product = products.find(entry => entry.id === item.id);
        return `<article class="cart-item">
            <img src="${product.image}" alt="">
            <div class="cart-item-info"><h3>${product.name}</h3><p>${product.color}</p><strong>${money(product.price)}</strong><div class="quantity-control"><button data-quantity="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="1" data-id="${item.id}" aria-label="Increase quantity">+</button></div></div>
            <button class="remove-item" data-remove="${item.id}" aria-label="Remove ${product.name}">×</button>
        </article>`;
    }).join("");
}

function setCartOpen(open) {
    cartDrawer.classList.toggle("is-open", open);
    cartBackdrop.classList.toggle("hidden", !open);
    cartDrawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("drawer-open", open);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
    category = button.dataset.category;
    document.querySelectorAll(".filter-button").forEach(filter => filter.classList.toggle("active", filter === button));
    renderProducts();
}));

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (addButton) addToCart(addButton.dataset.add);
    if (favoriteButton) {
        const saved = favoriteButton.classList.toggle("is-favorite");
        favoriteButton.textContent = saved ? "♥" : "♡";
        showToast(saved ? "Saved to favourites" : "Removed from favourites");
    }
    if (quantityButton) {
        const item = cart.find(entry => entry.id === quantityButton.dataset.id);
        item.quantity += Number(quantityButton.dataset.quantity);
        cart = cart.filter(entry => entry.quantity > 0);
        saveCart();
    }
    if (removeButton) {
        cart = cart.filter(entry => entry.id !== removeButton.dataset.remove);
        saveCart();
    }
});

document.getElementById("openCartButton").addEventListener("click", () => setCartOpen(true));
document.getElementById("closeCartButton").addEventListener("click", () => setCartOpen(false));
cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.getElementById("continueShopping").addEventListener("click", () => {
    setCartOpen(false);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("checkoutButton").addEventListener("click", () => showToast("Checkout setup is coming soon. Your bag is saved on this device."));
document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("newsletterMessage").textContent = "Thanks! Newsletter signup will be available when our email service is connected.";
    event.target.reset();
});
const headerSearch = document.querySelector(".header-search");
headerSearch.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 680px)").matches) {
        headerSearch.classList.add("is-open");
        searchInput.focus();
    }
});
document.addEventListener("click", event => {
    if (!headerSearch.contains(event.target) && window.matchMedia("(max-width: 680px)").matches) {
        headerSearch.classList.remove("is-open");
    }
});
document.getElementById("mobileMenuButton").addEventListener("click", () => {
    const nav = document.getElementById("mainNav");
    nav.classList.toggle("is-open");
    document.getElementById("mobileMenuButton").setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => document.getElementById("mainNav").classList.remove("is-open")));

renderProducts();
renderCart();
