$(document).ready(function () {
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
        const $parent = $input.closest("div");
        const $validIcon = $parent.find(".valid-icon");

        if (isValid) {
            $input.removeClass("border-red-500").addClass("border-emerald-500");
            $errorElem.addClass("hidden");

            if ($validIcon.length) $validIcon.removeClass("hidden");
        } else {
            $input.removeClass("border-emerald-500").addClass("border-red-500");
            $errorElem.removeClass("hidden");

            if ($validIcon.length) $validIcon.addClass("hidden");
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
    $form.on("submit", function (e) {
        e.preventDefault();

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

            // Show success message
            $form.html(`
                <div class="text-center py-12 space-y-4">
                    <h3 class="font-heading font-black text-2xl uppercase tracking-wider">Welcome to Halcyon!</h3>
                    <p class="text-sm max-w-md mx-auto">
                        Thank you for joining our fan newsletter. A confirmation email has been sent to <strong>${$email.val()}</strong>.
                    </p>
                </div>
            `);
        }
    });
});
