// Store Products & Interactive Cart Module

const storeProducts = [
    {
        id: 'album-vinyl',
        title: 'Halcyon Vinyl Album',
        description: 'A collectible vinyl record with exclusive artwork... chance to be signed by a band member!',
        price: 24.99,
        label: 'Vinyl'
    },
    {
        id: 'hoodie-black',
        title: 'Halcyon Hoodie',
        description: 'Comfortable black hoodie with the band logo',
        price: 39.99,
        label: 'Hoodie'
    },
    {
        id: 'tshirt-cream',
        title: 'Halcyon T-Shirt',
        description: 'Soft, cream-coloured tee with a vintage design',
        price: 19.99,
        label: 'T-Shirt'
    },
    {
        id: 'poster-set',
        title: 'Pack of 3 Posters',
        description: 'Set of 3 limited edition posters for your wall',
        price: 14.99,
        label: 'Poster'
    },
    {
        id: 'cap-olive',
        title: 'Halcyon Hat',
        description: 'Olive baseball cap with embroidered logo',
        price: 16.99,
        label: 'Cap'
    },
    {
        id: 'sticker-bundle',
        title: 'Sticker Bundle',
        description: 'Collection of 8 band stickers for your gear',
        price: 7.99,
        label: 'Stickers'
    }
];

function renderProductGrid() {
    const $productGrid = $('#productGrid');

    if (!$productGrid.length) {
        return;
    }

    const productHtml = storeProducts.map(function (product) {
        return `
            <article class="product-card">
                <div class="product-image">
                    <div>
                        <strong>${product.label}</strong>
                        <p>${product.title}</p>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <button type="button" class="button product-add-btn" data-product-id="${product.id}" aria-label="Add ${product.title} to cart">Add to Cart</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    $productGrid.html(productHtml);
}

function addToCart(productId) {
    const product = storeProducts.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const cart = getStoredCart();
    const existing = cart.find(function (item) {
        return item.id === productId;
    });

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
        cart.push(Object.assign({}, product, { quantity: 1 }));
    }

    saveCart(cart);
    renderCart();

    const $cartPanel = $('#cartPanel');
    if ($cartPanel.length > 0) {
        $cartPanel[0].scrollIntoView({ behavior: 'smooth' });
    }
}

function removeFromCart(productId) {
    let cart = getStoredCart();

    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    saveCart(cart);
    renderCart();
}

function clearCart() {
    inMemoryCart = [];

    try {
        localStorage.removeItem('halcyonCart');
        sessionStorage.removeItem('halcyonCart');
    } catch (error) {}

    renderCart();
}

function setupStoreEvents() {
    renderProductGrid();
    renderCart();

    $('#productGrid').off('click', '.product-add-btn').on('click', '.product-add-btn', function () {
        const productId = $(this).data('product-id');
        addToCart(productId);
    });

    $('#cartItems').off('click', '.cart-item-remove').on('click', '.cart-item-remove', function () {
        const productId = $(this).data('product-id');
        removeFromCart(productId);
    });

    $('#clearCartBtn').off('click').on('click', function () {
        clearCart();
    });

    $('#checkoutBtn').off('click').on('click', function () {
        const cart = getStoredCart();
        const cartCount = getCartItemCount(cart);

        if (cartCount === 0) {
            alert("Your cart is empty! Please add some merch before checking out.");
            return;
        }

        const total = formatPrice(getCartTotal(cart));
        const confirmMsg = `🎉 Thank you for your order!\n\nThis is a demonstration store for Halcyon.\n\nTotal Items: ${cartCount}\nOrder Total: ${total}\n\nYour test checkout has completed successfully.`;

        alert(confirmMsg);
        clearCart();
    });
}

function initStorePage() {
    setupStoreEvents();
    if (window.location.hash === '#cartPanel' || window.location.hash === '#cart') {
        setTimeout(function () {
            const $cartPanel = $('#cartPanel');
            
            if ($cartPanel.length > 0) {
                $cartPanel[0].scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}
