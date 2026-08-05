function openSpotify() {
    window.open("https://open.spotify.com", "_blank");
}

// ------------------------ rhianna ^ --------------------------------------------------------------- adam v -----------------


$(document).ready(function () {
    const $siteHeader = $("#siteHeader");
    const $siteFooter = $("#siteFooter");

    function getNavItems() {
        return [
            { href: "index.html", label: "Home", page: "home" },
            { href: "events.html", label: "Events", page: "events" },
            { href: "about.html", label: "About Us", page: "about" },
            { href: "store.html", label: "Store", page: "store" },
            { href: "newsletter.html", label: "Newsletter", page: "newsletter" },
            { href: "contact.html", label: "Contact", page: "contact" }
        ];
    }

    function renderHeader() {
        const activePage = $("body").attr("data-page") || "";
        const navHtml = getNavItems().map(function (item) {
            const activeClass = item.page === activePage ? "active" : "";
            return `<a href="${item.href}" class="${activeClass}">${item.label}</a>`;
        }).join("");

        $siteHeader.html(`
            <div class="top-nav">
                ${navHtml}
                <a href="#" class="cart-icon" aria-label="Shopping Cart" title="Shopping Cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                </a>
            </div>
        `);
    }

    function renderFooter() {
        $siteFooter.html(`
            <footer>
                <br>
                <br>
                <p><b>Follow us on social media and stay up to date with our latest news and events!</b></p>
                <p><b>Instagram: </b> @halcyonband</p>
                <p><b>Email: </b> info@halcyonband.com</p>
                <p><b>Phone: </b> +44 1234 567890</p>
                <p>&copy; 2026 Halcyon. All rights reserved.</p>
            </footer>
        `);
    }
    //======= Things for j Query - Daniel =====

    function getStoredCart() {
        const savedCart = localStorage.getItem('halcyonCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('halcyonCart', JSON.stringify(cart));
    }

    function formatPrice(value) {
        return `£${value.toFixed(2)}`;
    }

    const storeProducts = [
        {
            id: 'album-vinyl',
            title: 'Halcyon Vinyl Album',
            description: 'A collectible vinyl record with exclusive artwork.',
            price: 24.99,
            label: 'Vinyl'
        },
        {
            id: 'hoodie-black',
            title: 'Halcyon Hoodie',
            description: 'Comfortable black hoodie with the band logo.',
            price: 39.99,
            label: 'Hoodie'
        },
        {
            id: 'tshirt-cream',
            title: 'Halcyon T-Shirt',
            description: 'Soft, cream-coloured tee with a vintage design.',
            price: 19.99,
            label: 'T-Shirt'
        },
        {
            id: 'poster-set',
            title: 'Poster Pack',
            description: 'Set of 3 limited edition posters for your wall.',
            price: 14.99,
            label: 'Poster'
        },
        {
            id: 'cap-olive',
            title: 'Halcyon Cap',
            description: 'Olive baseball cap with embroidered logo.',
            price: 16.99,
            label: 'Cap'
        },
        {
            id: 'sticker-bundle',
            title: 'Sticker Bundle',
            description: 'Collection of 8 band stickers for your gear.',
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
                            <button type="button" class="button product-add-btn" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        $productGrid.html(productHtml);
    }

    function getCartItemCount(cart) {
        return cart.reduce(function (count, item) {
            return count + item.quantity;
        }, 0);
    }

    function getCartTotal(cart) {
        return cart.reduce(function (total, item) {
            return total + item.price * item.quantity;
        }, 0);
    }

    function renderCart() {
        const $cartItems = $('#cartItems');
        const $cartCount = $('#cartCount');
        const $cartTotal = $('#cartTotal');
        const cart = getStoredCart();

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

        const cartCount = getCartItemCount(cart);
        $cartCount.text(`${cartCount} item${cartCount === 1 ? '' : 's'}`);
        $cartTotal.text(formatPrice(getCartTotal(cart)));
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
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        renderCart();
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
        localStorage.removeItem('halcyonCart');
        renderCart();
    }

    function setupStoreEvents() {
        renderProductGrid();
        renderCart();

        $('#productGrid').on('click', '.product-add-btn', function () {
            const productId = $(this).data('product-id');
            addToCart(productId);
        });

        $('#cartItems').on('click', '.cart-item-remove', function () {
            const productId = $(this).data('product-id');
            removeFromCart(productId);
        });

        $('#clearCartBtn').on('click', function () {
            clearCart();
        });
    }
// ======== bits and bobs for the shop - Daniel ========
    renderHeader();
    renderFooter();

    if ($('body').data('page') === 'store') {
        setupStoreEvents();
    }

    const $form = $("#newsletterForm");
    const $fullName = $("#fullName");
    const $email = $("#email");
    const $city = $("#city");
    const $interests = $("input[name='interests']");
    const $terms = $("#terms");
    const $fanMessage = $("#fanMessage");
    const $charCounter = $("#charCounter");

    const $errorSummary = $("#formErrorSummary");
    const $errorList = $("#errorList");

    // Email regex
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Helper functions for field states
    function setFieldState($input, isValid, $errorElem, errorText) {
        const $container = $input.closest(".input-container").length ? $input.closest(".input-container") : $input.closest("div");
        const $validIcon = $container.find(".valid-icon");
        const $invalidIcon = $container.find(".invalid-icon");

        if (isValid) {
            $input.removeClass("border-red-500").addClass("border-emerald-500");
            $errorElem.addClass("hidden");

            if ($validIcon.length) $validIcon.removeClass("hidden");
            if ($invalidIcon.length) $invalidIcon.addClass("hidden");
        } else {
            $input.removeClass("border-emerald-500").addClass("border-red-500");
            $errorElem.removeClass("hidden");

            if ($validIcon.length) $validIcon.addClass("hidden");
            if ($invalidIcon.length) $invalidIcon.removeClass("hidden");
        }

        return isValid;
    }

    // Individual Field Validators
    function validateFullName() {
        const value = $fullName.val().trim();
        const isValid = value.length >= 2;

        return setFieldState($fullName, isValid, $("#fullNameError"), "Full Name must be at least 2 characters.");
    }

    function validateEmail() {
        const value = $email.val();
        const isValid = isValidEmail(value);

        return setFieldState($email, isValid, $("#emailError"), "Enter a valid email address.");
    }

    function validateCity() {
        const value = $city.val();
        const isValid = value !== null && value !== "";

        return setFieldState($city, isValid, $("#cityError"), "Please select a nearest tour location.");
    }

    function validateInterests() {
        const isValid = $("input[name='interests']:checked").length > 0;

        if (isValid) {
            $("#interestsError").addClass("hidden");
        } else {
            $("#interestsError").removeClass("hidden");
        }

        return isValid;
    }

    function validateTerms() {
        const isValid = $terms.is(":checked");

        if (isValid) {
            $("#termsError").addClass("hidden");
        } else {
            $("#termsError").removeClass("hidden");
        }

        return isValid;
    }

    // Character counter for fan message
    if ($fanMessage.length && $charCounter.length) {
        $fanMessage.on("input", function () {
            const currentLength = $(this).val().length;

            $charCounter.text(`${currentLength} / 200`);
        });
    }

    // Real time validation listeners
    $fullName.on("input blur", validateFullName);
    $email.on("input blur", validateEmail);
    $city.on("change blur", validateCity);
    $interests.on("change", validateInterests);
    $terms.on("change", validateTerms);

    // Submit handler
    $form.on("submit", function (error) {
        error.preventDefault();

        const errors = [];

        if (!validateFullName()) {
            errors.push("Full Name must be at least 2 characters.");
        }

        if (!validateEmail()) {
            errors.push("A valid Email Address is required.");
        }

        if (!validateCity()) {
            errors.push("Please select your nearest tour location.");
        }

        if (!validateInterests()) {
            errors.push("Select at least one content interest topic.");
        }

        if (!validateTerms()) {
            errors.push("You must accept the terms to subscribe.");
        }

        if (errors.length > 0) {
            $errorList.empty();

            errors.forEach(function (msg) {
                $errorList.append(`<li>${msg}</li>`);
            });
            
            $errorSummary.removeClass("hidden");

            // Scroll to error summary smoothly
            $errorSummary[0].scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            $errorSummary.addClass("hidden");

            const userEmail = $email.val();
            let secondsLeft = 10;

            // Show success screen with live countdown timer
            $form.html(`
                <div class="success-card">
                    <h3 class="success-title">Welcome to Halcyon!</h3>
                    <p class="success-text">
                        Thank you for joining our fan newsletter. A confirmation email has been sent to <strong class="text-primary">${userEmail}</strong>.
                    </p>
                    <p class="redirect-notice">
                        Redirecting to home page in <span id="countdownTimer" class="countdown-number">${secondsLeft}</span> seconds...
                    </p>
                    <a href="index.html" class="redirect-link">
                        <span>Return to Home Now</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `);

            // 10 second redirect countdown timer
            const countdownInterval = setInterval(function () {
                secondsLeft--;
                $("#countdownTimer").text(secondsLeft);

                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = "index.html";
                }
            }, 1000);
        }
    });
});
