// Tour Dates & Waitlist Module
async function loadTourDates() {
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

function setupWaitlistForm() {
    const formSubmission = document.getElementById("waitlist-form") || document.getElementById("waitlistForm");

    if (formSubmission) {
        formSubmission.addEventListener("submit", function (event) {
            const email = document.getElementById("email") || document.getElementById("email-address");
            const fullName = document.getElementById("fullName") || document.getElementById("full-name");

            if (email) email.setCustomValidity("");
            if (fullName) fullName.setCustomValidity("");

            const emailValid = email ? isValidEmail(email.value) : true;
            const nameValid = fullName ? isFullNameValid(fullName.value) : true;

            if (email) email.setCustomValidity(emailValid ? "" : "Please enter a valid email address.");
            if (fullName) fullName.setCustomValidity(nameValid ? "" : "Please enter your full name.");

            if (!emailValid || !nameValid) {
                event.preventDefault();
                if (typeof this.reportValidity === 'function') {
                    this.reportValidity();
                }
            }
        });

        const emailInput = document.getElementById("email") || document.getElementById("email-address");
        const nameInput = document.getElementById("fullName") || document.getElementById("full-name");

        if (emailInput) {
            emailInput.addEventListener("input", function () {
                this.setCustomValidity("");
            });
        }
        if (nameInput) {
            nameInput.addEventListener("input", function () {
                this.setCustomValidity("");
            });
        }
    }
}

function initEventsPage() {
    loadTourDates();
    setupEventsListeners();
    setupWaitlistForm();
}

document.addEventListener('DOMContentLoaded', () => {
    initEventsPage();
});
