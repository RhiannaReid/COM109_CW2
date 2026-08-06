// Tour Dates & Waitlist Module

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
