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

    renderHeader();
    renderFooter();

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

const eventContainer = document.querySelector(".tour_dates_wrapper");
const filterEvents = document.querySelectorAll("li button");
const searchBar = document.querySelector(".btn_search");
const searchInput = document.querySelector(".event_search");
const waitlistSelect = document.getElementById("selectEvent");

// display dynamic data
window.addEventListener('DOMContentLoaded',()=>{
    loadTourDates();
});

async function loadTourDates() {
    try {
        const response = await fetch(tourDatesUrl);
        if (!response.ok) {
            throw new Error(`Unable to load tour dates: ${response.status} ${response.statusText}`);
        }

        tourDates = await response.json();

        if (eventContainer) {
            displayEventData(tourDates);
        }

        if (waitlistSelect) {
            populateWaitlistDropdown(tourDates);
        }
    } catch (error) {
        console.error(error);
    }
}

// searching events
if(searchBar)
{
	searchBar.addEventListener('click', (e)=>{
		let searchValue=searchInput.value;
		
		if(searchValue != ""){
			let searchEvent = tourDates.filter(function(eventData){
				if(eventData.eventTitle.includes(searchValue)){
					return eventData;
				};
			});
			
			displayEventData(searchEvent);
		} else {
			alert("Invalid search. Please enter the event you are searching for.");
		};
	});
}

// filtering events
filterEvents.forEach((filters)=>{
	filters.addEventListener('click',(e)=>{
		const eventLocation = e.target.dataset.id;
		const eventCategory = tourDates.filter(function(filt){
			if(filt.category === eventLocation){
					return filt;
			};
		});
		
		if(eventLocation === "All Locations"){
			displayEventData(tourDates);
		} else {
			displayEventData(eventCategory);
		};
	});
});


// defining a function to format and display tour events
function displayEventData(tourDates){
	let displayData = tourDates.map(function(event_items){
		return `
			  <tr>
				<td>${event_items.eventDate}</td>
				<td>${event_items.eventTitle}</td>
				<td><a href="${event_items.locationURL}">${event_items.eventLocation}</a></td>
				<td><input type="button" onclick="location.href='${event_items.statusURL}';" value="${event_items.eventStatus}"></td>
			  </tr>
			`;
	}).join("");
	eventContainer.innerHTML=displayData;
};

// defining a function to filter and display tour event titles for the waitlist dropdown
function populateWaitlistDropdown(events){
	events.forEach(event_item => {
		if(event_item.eventStatus === "Join Waitlist"){
			console.log("Adding option:", event_item.eventTitle);
			const option = document.createElement("option");
			option.value = event_item.id;
			option.textContent = event_item.eventTitle;
			waitlistSelect.appendChild(option);
		};
	});
};

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

        console.log("Check 1");
        email.setCustomValidity(emailValid ? "" : "Please enter a valid email address.");
        console.log("Check 2");
        fullName.setCustomValidity(nameValid ? "" : "Please enter your full name.");
        console.log("Email valid:", emailValid);
        console.log("Name valid:", nameValid);

        // Stop form submission if ANY field is invalid
        if (!emailValid) {
            event.preventDefault();
			this.reportValidity();
            console.log("Check 3");
        }
        if (!nameValid) {
            event.preventDefault();
            console.log("Check 4");
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

