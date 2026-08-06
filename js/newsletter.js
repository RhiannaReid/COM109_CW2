// Fan Newsletter Form Validation, LocalStorage Subscription & Countdown Module

function getSubscriptionData() {
    try {
        const saved = localStorage.getItem('halcyonNewsletterSubscribed') || sessionStorage.getItem('halcyonNewsletterSubscribed');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Subscription storage access error:', e);
    }
    return null;
}

function saveSubscriptionData(data) {
    try {
        const jsonStr = JSON.stringify(data);
        localStorage.setItem('halcyonNewsletterSubscribed', jsonStr);
        sessionStorage.setItem('halcyonNewsletterSubscribed', jsonStr);
    } catch (e) {
        console.warn('Subscription storage save error:', e);
    }
}

function removeSubscriptionData() {
    try {
        localStorage.removeItem('halcyonNewsletterSubscribed');
        sessionStorage.removeItem('halcyonNewsletterSubscribed');
    } catch (e) {}
}

function renderSubscribedState($form, subData) {
    $form.html(`
        <div class="subscribed-card">
            <div class="subscribed-header">
                <i class="fa-solid fa-circle-check subscribed-icon"></i>
                <h2 class="form-title">You are Subscribed!</h2>
            </div>
            <p class="subscribed-text">
                Welcome back, <strong>${subData.name || 'Fan'}</strong>! You are currently subscribed to the Halcyon Fan Newsletter with <strong class="text-primary">${subData.email}</strong>.
            </p>
            <p class="subscribed-subtext">
                You'll receive exclusive band news, tour dates, and early merch drops straight to your inbox.
            </p>
            <div class="subscribed-actions">
                <button type="button" id="unsubscribeBtn" class="button button-unsubscribe">
                    <i class="fa-solid fa-bell-slash"></i> Unsubscribe from Newsletter
                </button>
            </div>
        </div>
    `);

    $("#unsubscribeBtn").on("click", function () {
        removeSubscriptionData();
        alert("You have been unsubscribed from the Halcyon Fan Newsletter.");
        window.location.reload();
    });
}

function initNewsletterPage() {
    const $form = $("#newsletterForm");
    if (!$form.length) return;

    // Check if user is already subscribed in localStorage
    const existingSub = getSubscriptionData();
    if (existingSub && existingSub.email) {
        renderSubscribedState($form, existingSub);
        return;
    }

    const $fullName = $("#fullName");
    const $email = $("#email");
    const $city = $("#city");
    const $interests = $("input[name='interests']");
    const $terms = $("#terms");
    const $fanMessage = $("#fanMessage");
    const $charCounter = $("#charCounter");

    const $errorSummary = $("#formErrorSummary");
    const $errorList = $("#errorList");

    function setFieldState($input, isValid, $errorElem, errorText) {
        if (!$input.length) return true;
        const $container = $input.closest(".input-container").length ? $input.closest(".input-container") : $input.closest("div");
        const $validIcon = $container.find(".valid-icon");
        const $invalidIcon = $container.find(".invalid-icon");

        if (isValid) {
            $input.removeClass("border-red-500").addClass("border-emerald-500");
            if ($errorElem.length) $errorElem.addClass("hidden");

            if ($validIcon.length) $validIcon.removeClass("hidden");
            if ($invalidIcon.length) $invalidIcon.addClass("hidden");
        } else {
            $input.removeClass("border-emerald-500").addClass("border-red-500");
            if ($errorElem.length) $errorElem.removeClass("hidden");

            if ($validIcon.length) $validIcon.addClass("hidden");
            if ($invalidIcon.length) $invalidIcon.removeClass("hidden");
        }

        return isValid;
    }

    function validateFullName() {
        if (!$fullName.length) return true;

        const value = $fullName.val().trim();
        const isValid = isFullNameValid(value);

        return setFieldState($fullName, isValid, $("#fullNameError"), "Full Name must be at least 2 characters.");
    }

    function validateEmail() {
        if (!$email.length) return true;

        const value = $email.val();
        const isValid = isValidEmail(value);

        return setFieldState($email, isValid, $("#emailError"), "Enter a valid email address.");
    }

    function validateCity() {
        if (!$city.length) return true;

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
        if (!$terms.length) return true;
        const isValid = $terms.is(":checked");

        if (isValid) {
            $("#termsError").addClass("hidden");
        } else {
            $("#termsError").removeClass("hidden");
        }

        return isValid;
    }

    if ($fanMessage.length && $charCounter.length) {
        $fanMessage.on("input", function () {
            const currentLength = $(this).val().length;
            $charCounter.text(`${currentLength} / 200`);
        });
    }

    $fullName.on("input blur", validateFullName);
    $email.on("input blur", validateEmail);
    $city.on("change blur", validateCity);
    $interests.on("change", validateInterests);
    $terms.on("change", validateTerms);

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

            if ($errorSummary.length && $errorSummary[0].scrollIntoView) {
                $errorSummary[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            $errorSummary.addClass("hidden");
            const userName = $fullName.val().trim();
            const userEmail = $email.val().trim();

            // Save subscription into localStorage
            saveSubscriptionData({
                name: userName,
                email: userEmail,
                subscribedAt: new Date().toISOString()
            });

            let secondsLeft = 10;

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
}

$(document).ready(function () {
    if ($('#newsletterForm').length) {
        initNewsletterPage();
    }
});
