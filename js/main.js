function openSpotify() {
    window.open("https://open.spotify.com", "_blank");
}

// ------------------------ rhianna ^ --------------------------------------------------------------- adam v -----------------
// Email regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function isFullNameValid(name){
	const isValid = name.length >= 2;
	return isValid
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
        const activePage = $("body").attr("data-page") || "";
        const navHtml = getNavItems().map(function (item) {
            const activeClass = item.page === activePage ? "active" : "";
            return `<a href="${item.href}" class="${activeClass}">${item.label}</a>`;
        }).join("");

        $siteHeader.html(`
            <nav class="top-nav" aria-label="Main Navigation">
                ${navHtml}
                <a href="store.html#cartPanel" class="cart-icon" aria-label="Shopping Cart" title="Shopping Cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="navCartBadge" class="nav-cart-badge hidden">0</span>
                </a>
            </nav>
        `);
    }

    function renderFooter() {
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
    //======= Things for j Query w/header and footer - Daniel =====

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
        } catch (e) {
            console.warn('Storage access warning:', e);
        }

        return inMemoryCart || [];
    }

    function saveCart(cart) {
        inMemoryCart = Array.isArray(cart) ? cart : [];
        try {
            const jsonStr = JSON.stringify(inMemoryCart);
            localStorage.setItem('halcyonCart', jsonStr);
            sessionStorage.setItem('halcyonCart', jsonStr);
        } catch (e) {
            console.warn('Storage save warning:', e);
        }
    }

    function formatPrice(value) {
        return `£${value.toFixed(2)}`;
    }

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
                            <button type="button" class="button product-add-btn" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        $productGrid.html(productHtml);
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
        } catch (e) {}
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

        $('#checkoutBtn').on('click', function () {
            const cart = getStoredCart();
            const cartCount = getCartItemCount(cart);

            if (cartCount === 0) {
                alert("Your cart is empty! Please add some merch before checking out.");
                return;
            }

            const total = formatPrice(getCartTotal(cart));
            const confirmMsg = `Thank you for your order!\n\nThis is a demonstration.\n\nTotal Items: ${cartCount}\nOrder Total: ${total}\n\nYour test checkout has completed successfully.`;

            alert(confirmMsg);
            clearCart();
        });
    }
// ======== bits and bobs for the shop - Daniel ========
    renderHeader();
    renderFooter();
    // Ensure header cart badge is in sync on all pages
    renderCart();

    // Listen for storage updates across tabs/windows
    window.addEventListener('storage', function (e) {
        if (e.key === 'halcyonCart') {
            inMemoryCart = null;
            renderCart();
        }
    });

    $(document).on('click', '.cart-icon', function (e) {
        const $cartPanel = $('#cartPanel');
        if ($cartPanel.length > 0) {
            e.preventDefault();
            $cartPanel[0].scrollIntoView({ behavior: 'smooth' });
        }
    });

    const currentPage = $('body').attr('data-page') || '';
    if (currentPage === 'store') {
        setupStoreEvents();
        if (window.location.hash === '#cartPanel' || window.location.hash === '#cart') {
            setTimeout(function () {
                const $cartPanel = $('#cartPanel');
                if ($cartPanel.length > 0) {
                    $cartPanel[0].scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    } else if (currentPage === 'events') {
        loadTourDates();
        setupEventsListeners();
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
        const isValid = isFullNameValid(value);

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

/*--------------------------------------- rebecca v -----------------*/


// Initialising a list of tour dates
const tourDatesUrl = "json/tourDates.json";
let tourDates = [];

const fallbackTourDates = [
    {
        "id": 1,
        "eventTitle": "Estadio River Plate",
        "eventDate": "25th January 2027",
        "eventLocation": "Buenos Aires, Argentina",
        "category": "South America",
        "locationURL": "https://maps.app.goo.gl/wiWkqhn7uR6r8XtZ7",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.ticketek.com.ar/"
    },
    {
        "id": 2,
        "eventTitle": "Sydney Opera House",
        "eventDate": "3rd March 2027",
        "eventLocation": "Sydney, Australia",
        "category": "Australia and Oceania",
        "locationURL": "https://maps.app.goo.gl/RhG9nugBTUk1L3Q56",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.sydneyoperahouse.com/"
    },
    {
        "id": 3,
        "eventTitle": "Mercedes-Benz Arena",
        "eventDate": "11th April 2027",
        "eventLocation": "Berlin, Germany",
        "category": "Europe",
        "locationURL": "https://maps.app.goo.gl/8VwAo1HtrwNYpExG8",
        "eventStatus": "Join Waitlist",
        "statusURL": "JoinEventWaitlist.html"
    },
    {
        "id": 4,
        "eventTitle": "L'Olympia Theatre",
        "eventDate": "9th May 2027",
        "eventLocation": "Paris, France",
        "category": "Europe",
        "locationURL": "https://maps.app.goo.gl/XjM8Yn3fsHNT9AYp7",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.fnacspectacles.com/"
    },
    {
        "id": 5,
        "eventTitle": "Wembley Stadium",
        "eventDate": "18th June 2027",
        "eventLocation": "London, UK",
        "category": "UK and Ireland",
        "locationURL": "https://maps.app.goo.gl/3eb2w4PStiLSwckY8",
        "eventStatus": "Join Waitlist",
        "statusURL": "JoinEventWaitlist.html"
    },
    {
        "id": 6,
        "eventTitle": "Red Rocks Amphitheatre",
        "eventDate": "14th July 2027",
        "eventLocation": "Colorado, USA",
        "category": "North America",
        "locationURL": "https://maps.app.goo.gl/2fYt9mXq8sP4k7L3A",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.redrocksonline.com/"
    },
    {
        "id": 7,
        "eventTitle": "Belsonic",
        "eventDate": "7th August 2027",
        "eventLocation": "Belfast, UK",
        "category": "UK and Ireland",
        "locationURL": "https://maps.app.goo.gl/AHBMQpaNaEFoEvgbA",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.ticketmaster.co.uk/"
    },
    {
        "id": 8,
        "eventTitle": "O2 Belfast",
        "eventDate": "15th August 2027",
        "eventLocation": "Belfast, UK",
        "category": "UK and Ireland",
        "locationURL": "https://maps.app.goo.gl/6GauRHqYpvb5F8kQ7",
        "eventStatus": "Join Waitlist",
        "statusURL": "JoinEventWaitlist.html"
    },
    {
        "id": 9,
        "eventTitle": "3Arena",
        "eventDate": "19th August 2027",
        "eventLocation": "Dublin, Ireland",
        "category": "UK and Ireland",
        "locationURL": "https://maps.app.goo.gl/3ReJX9YDXRXVpLdP7",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.ticketmaster.ie/"
    },
    {
        "id": 10,
        "eventTitle": "Madison Square Garden",
        "eventDate": "12th September 2027",
        "eventLocation": "New York City, USA",
        "category": "North America",
        "locationURL": "https://maps.app.goo.gl/idzy5LKEz1zp8JY57",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.ticketmaster.com/"
    },
    {
        "id": 11,
        "eventTitle": "Tokyo Dome",
        "eventDate": "22nd October 2027",
        "eventLocation": "Tokyo, Japan",
        "category": "Asia",
        "locationURL": "https://maps.app.goo.gl/2SVR28274JXR7eWi6",
        "eventStatus": "Join Waitlist",
        "statusURL": "JoinEventWaitlist.html"
    },
    {
        "id": 12,
        "eventTitle": "Rogers Arena",
        "eventDate": "30th November 2027",
        "eventLocation": "Vancouver, Canada",
        "category": "North America",
        "locationURL": "https://maps.app.goo.gl/D71c7pexExvfxPHL8",
        "eventStatus": "Buy Tickets",
        "statusURL": "https://www.ticketmaster.ca/"
    }
];

// display dynamic data
document.addEventListener('DOMContentLoaded', () => {
    loadTourDates();
    setupEventsListeners();
});

async function loadTourDates() {
    try {
        const response = await fetch(tourDatesUrl);
        if (!response.ok) {
            throw new Error(`Unable to load tour dates: ${response.status} ${response.statusText}`);
        }
        tourDates = await response.json();
    } catch (error) {
        console.warn("Using fallback tour dates due to local file CORS restriction:", error);
        tourDates = fallbackTourDates;
    }

    displayEventData(tourDates);
    populateWaitlistDropdown(tourDates);
}

function setupEventsListeners() {
    const searchBar = document.querySelector(".btn_search");
    const searchInput = document.querySelector(".event_search");
    const filterEvents = document.querySelectorAll(".filter-button, li button");

    if (searchBar && searchInput) {
        searchBar.addEventListener('click', (e) => {
            let searchValue = searchInput.value.trim();

            if (searchValue !== "") {
                let searchEvent = tourDates.filter(function (eventData) {
                    return eventData.eventTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
                           eventData.eventLocation.toLowerCase().includes(searchValue.toLowerCase());
                });

                displayEventData(searchEvent);
            } else {
                displayEventData(tourDates);
            }
        });
    }

    if (filterEvents.length) {
        filterEvents.forEach((filters) => {
            filters.addEventListener('click', (e) => {
                const eventLocation = e.target.dataset.id;
                if (eventLocation === "All Locations") {
                    displayEventData(tourDates);
                } else {
                    const eventCategory = tourDates.filter(function (filt) {
                        return filt.category === eventLocation;
                    });
                    displayEventData(eventCategory);
                }
            });
        });
    }
}

// defining a function to format and display tour events
function displayEventData(data) {
    const eventContainer = document.querySelector(".tour_dates_wrapper");
    if (!eventContainer || !Array.isArray(data)) return;

    let displayData = data.map(function (event_items) {
        return `
            <tr>
                <td>${event_items.eventDate}</td>
                <td>${event_items.eventTitle}</td>
                <td><a href="${event_items.locationURL}">${event_items.eventLocation}</a></td>
                <td><input type="button" onclick="location.href='${event_items.statusURL}';" value="${event_items.eventStatus}"></td>
            </tr>
        `;
    }).join("");

    eventContainer.innerHTML = displayData;
}

// defining a function to filter and display tour event titles for the waitlist dropdown
function populateWaitlistDropdown(events) {
    const waitlistSelect = document.getElementById("selectEvent");
    if (!waitlistSelect || !Array.isArray(events)) return;

    waitlistSelect.innerHTML = "";
    events.forEach(event_item => {
        if (event_item.eventStatus === "Join Waitlist") {
            const option = document.createElement("option");
            option.value = event_item.id;
            option.textContent = event_item.eventTitle;
            waitlistSelect.appendChild(option);
        }
    });
}

// form validation
const formSubmission = document.getElementById("waitlist-form");

if (formSubmission) {
    formSubmission.addEventListener("submit", function (event) {
        const email = document.getElementById("email-address");
        const fullName = document.getElementById("full-name");
		
		// Clear any previous custom validity before re-checking
        email.setCustomValidity("");
        fullName.setCustomValidity("");

        const emailValid = isValidEmail(email.value);
        const nameValid = isFullNameValid(fullName.value);

        email.setCustomValidity(emailValid ? "" : "Please enter a valid email address.");
        fullName.setCustomValidity(nameValid ? "" : "Please enter your full name.");
        console.log("Email valid:", emailValid);
        console.log("Name valid:", nameValid);

        // Stop form submission if ANY field is invalid
        if (!emailValid) {
            event.preventDefault();
			this.reportValidity();
        }
        if (!nameValid) {
            event.preventDefault();
			this.reportValidity();
        }
    });
	
	document.getElementById("email-address").addEventListener("input", function () {
        this.setCustomValidity("");
    });
    document.getElementById("full-name").addEventListener("input", function () {
        this.setCustomValidity("");
    });
}

