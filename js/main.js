function openSpotify() {
    window.open("https://open.spotify.com", "_blank");
}

// Global Validation Helpers
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function isFullNameValid(name) {
    if (!name) return false;
    return name.trim().length >= 2;
}

// Core Cart Storage & Badge Management
let inMemoryCart = null;

function getStoredCart() {
    if (inMemoryCart !== null && Array.isArray(inMemoryCart) && inMemoryCart.length > 0) {
        return inMemoryCart;
    }

    try {
        const savedCart = localStorage.getItem('halcyonCart') || sessionStorage.getItem('halcyonCart');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed) && parsed.length > 0) {
                inMemoryCart = parsed;
                return parsed;
            }
        }
    } catch (error) {
        console.warn('Storage access warning:', error);
    }

    return inMemoryCart || [];
}

function saveCart(cart) {
    inMemoryCart = Array.isArray(cart) ? cart : [];

    try {
        const jsonStr = JSON.stringify(inMemoryCart);

        localStorage.setItem('halcyonCart', jsonStr);
        sessionStorage.setItem('halcyonCart', jsonStr);
    } catch (error) {
        console.warn('Storage save warning:', error);
    }
}

function formatPrice(value) {
    return `£${Number(value || 0).toFixed(2)}`;
}

function getCartItemCount(cart) {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce(function (count, item) {
        const qty = Number(item.quantity !== undefined ? item.quantity : (item.qty !== undefined ? item.qty : 1));

        return count + (isNaN(qty) ? 1 : qty);
    }, 0);
}

function getCartTotal(cart) {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce(function (total, item) {
        const qty = Number(item.quantity !== undefined ? item.quantity : (item.qty !== undefined ? item.qty : 1));
        const price = Number(item.price || 0);
        return total + (price * (isNaN(qty) ? 1 : qty));
    }, 0);
}

function updateNavCartBadge() {
    const cart = getStoredCart();
    const cartCount = getCartItemCount(cart);
    const $navBadges = $('#navCartBadge, #cartBadge, .nav-cart-badge, .cart-badge');

    if ($navBadges.length) {
        $navBadges.text(cartCount);

        if (cartCount > 0) {
            $navBadges.removeClass('hidden');
        } else {
            $navBadges.addClass('hidden');
        }
    }
}

function renderCart() {
    updateNavCartBadge();

    const $cartItems = $('#cartItems');
    const $cartCount = $('#cartCount');
    const $cartTotal = $('#cartTotal');
    const cart = getStoredCart();
    const cartCount = getCartItemCount(cart);

    if (!$cartItems.length || !$cartCount.length || !$cartTotal.length) {
        return;
    }

    if (cart.length === 0) {
        $cartItems.html('<div class="empty-cart">Your cart is empty. Add a few items to see them here.</div>');
    } else {
        const cartHtml = cart.map(function (item) {
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.title}</p>
                        <p class="cart-item-meta">${item.quantity} × ${formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-qty">${formatPrice(item.price * item.quantity)}</span>
                        <button type="button" class="cart-item-remove" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        $cartItems.html(cartHtml);
    }

    $cartCount.text(`${cartCount} item${cartCount === 1 ? '' : 's'}`);
    $cartTotal.text(formatPrice(getCartTotal(cart)));
}

$(document).ready(function () {
    const $siteHeader = $("#siteHeader");
    const $siteFooter = $("#siteFooter");

    function getNavItems() {
        return [
            { href: "index.html", label: "Home", page: "home" },
            { href: "UpcomingEvents.html", label: "Events", page: "events" },
            { href: "about.html", label: "About Us", page: "about" },
            { href: "store.html", label: "Store", page: "store" },
            { href: "newsletter.html", label: "Newsletter", page: "newsletter" },
            { href: "contact.html", label: "Contact", page: "contact" }
        ];
    }

    function renderHeader() {
        if (!$siteHeader.length) return;

        const activePage = $("body").attr("data-page") || "";
        const navHtml = getNavItems().map(function (item) {
            const activeClass = item.page === activePage ? "active" : "";
            return `<a href="${item.href}" class="${activeClass}">${item.label}</a>`;
        }).join("");

        $siteHeader.html(`
            <nav class="top-nav" aria-label="Main Navigation">
                ${navHtml}
                <a href="store.html#cartPanel" class="cart-icon" aria-label="Shopping Cart" title="Shopping Cart">
                    <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                    <span id="navCartBadge" class="nav-cart-badge hidden">0</span>
                </a>
            </nav>
        `);
    }

    function renderFooter() {
        if (!$siteFooter.length) return;

        $siteFooter.html(`
            <br>
            <br>
            <p><b>Follow us on social media and stay up to date with our latest news and events!</b></p>
            <p><b>Instagram: </b> @halcyonband</p>
            <p><b>Email: </b> info@halcyonband.com</p>
            <p><b>Phone: </b> +44 1234 567890</p>
            <p>&copy; 2026 Halcyon. All rights reserved.</p>
        `);
    }

    renderHeader();
    renderFooter();
    renderCart();

    window.addEventListener('storage', function (event) {
        if (event.key === 'halcyonCart') {
            inMemoryCart = null;
            renderCart();
        }
    });

    $(document).on('click', '.cart-icon', function (event) {
        const $cartPanel = $('#cartPanel');
        if ($cartPanel.length > 0) {
            event.preventDefault();
            $cartPanel[0].scrollIntoView({ behavior: 'smooth' });
        }
    });

    const currentPage = $('body').attr('data-page') || '';

    if (currentPage === 'store' && typeof initStorePage === 'function') {
        initStorePage();
    } else if (currentPage === 'events' && typeof initEventsPage === 'function') {
        initEventsPage();
    } else if (currentPage === 'newsletter' && typeof initNewsletterPage === 'function') {
        initNewsletterPage();
    }
});
