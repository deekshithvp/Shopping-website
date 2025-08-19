document.addEventListener('DOMContentLoaded', () => {

    // --- FORM TOGGLE LOGIC (No changes needed here) ---
    const showLoginBtn = document.getElementById('show-login');
    const showRegisterBtn = document.getElementById('show-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            showLoginBtn.classList.add('active');
            showRegisterBtn.classList.remove('active');
        });
    }

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            showRegisterBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
        });
    }

    // --- DYNAMICALLY POPULATE DOB DROPDOWNS (No changes needed here) ---
    const dobDay = document.getElementById('dob-day');
    const dobYear = document.getElementById('dob-year');
    if (dobDay && dobYear) {
        for (let i = 1; i <= 31; i++) {
            dobDay.innerHTML += `<option value="${i}">${i}</option>`;
        }
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1930; i--) {
            dobYear.innerHTML += `<option value="${i}">${i}</option>`;
        }
    }


    // --- SHARED VALIDATION HELPER FUNCTIONS (No changes needed here) ---
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        error.textContent = message;
        input.classList.add('input-error');
        if (input.type === 'checkbox') {
            error.style.marginTop = '0.5rem';
        }
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        error.textContent = '';
        input.classList.remove('input-error');
    };

    // --- REUSABLE VALIDATION FUNCTIONS (New Structure) ---

    // Get all form elements upfront
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const regName = document.getElementById('reg-name');
    const regEmail = document.getElementById('reg-email');
    const regPhone = document.getElementById('reg-phone');
    const regPassword = document.getElementById('reg-password');
    const regConfirmPassword = document.getElementById('reg-confirm-password');
    const dobDaySelect = document.getElementById('dob-day');
    const dobMonthSelect = document.getElementById('dob-month');
    const dobYearSelect = document.getElementById('dob-year');
    const regTerms = document.getElementById('reg-terms');

    // Each function validates one input and returns true (valid) or false (invalid)
    const validateLoginUsername = () => {
        if (loginUsername.value.trim() === '') {
            showError(loginUsername, 'Please enter your username or email.');
            return false;
        }
        clearError(loginUsername);
        return true;
    };

    const validateLoginPassword = () => {
        if (loginPassword.value.trim() === '') {
            showError(loginPassword, 'Please enter your password.');
            return false;
        }
        clearError(loginPassword);
        return true;
    };

    const validateRegName = () => {
        if (regName.value.trim() === '') {
            showError(regName, 'Name cannot be empty.');
            return false;
        }
        clearError(regName);
        return true;
    };

    const validateRegEmail = () => {
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!emailPattern.test(regEmail.value)) {
            showError(regEmail, 'Please enter a valid email address.');
            return false;
        }
        clearError(regEmail);
        return true;
    };

    const validateRegPhone = () => {
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(regPhone.value)) {
            showError(regPhone, 'Please enter a valid 10-digit phone number.');
            return false;
        }
        clearError(regPhone);
        return true;
    };

    const validateRegPassword = () => {
        if (regPassword.value.length < 8) {
            showError(regPassword, 'Password must be at least 8 characters long.');
            return false;
        }
        clearError(regPassword);
        // After validating the main password, re-validate the confirmation field
        validateRegConfirmPassword();
        return true;
    };

    const validateRegConfirmPassword = () => {
        if (regPassword.value !== regConfirmPassword.value) {
            showError(regConfirmPassword, 'Passwords do not match.');
            return false;
        }
        if (regConfirmPassword.value.trim() !== '') {
            clearError(regConfirmPassword);
        }
        return true;
    };

    const validateRegDOB = () => {
        clearError(dobDaySelect); // Clear any existing error message
        [dobDaySelect, dobMonthSelect, dobYearSelect].forEach(el => el.classList.remove('input-error'));
        if (dobDaySelect.value === '' || dobMonthSelect.value === '' || dobYearSelect.value === '') {
            showError(dobDaySelect, 'Please select a complete date of birth.');
            [dobDaySelect, dobMonthSelect, dobYearSelect].forEach(el => el.classList.add('input-error'));
            return false;
        }
        return true;
    };

    const validateRegTerms = () => {
        if (!regTerms.checked) {
            showError(regTerms, 'You must agree to the terms of service.');
            return false;
        }
        clearError(regTerms);
        return true;
    };

    // --- ATTACH REAL-TIME EVENT LISTENERS ---
    const addLiveValidation = (element, validationFunc) => {
        if (element) {
            const eventType = (element.type === 'checkbox' || element.tagName === 'SELECT') ? 'change' : 'input';
            element.addEventListener(eventType, validationFunc);
        }
    };

    // Login Form Listeners
    addLiveValidation(loginUsername, validateLoginUsername);
    addLiveValidation(loginPassword, validateLoginPassword);

    // Registration Form Listeners
    addLiveValidation(regName, validateRegName);
    addLiveValidation(regEmail, validateRegEmail);
    addLiveValidation(regPhone, validateRegPhone);
    addLiveValidation(regPassword, validateRegPassword);
    addLiveValidation(regConfirmPassword, validateRegConfirmPassword);
    addLiveValidation(regTerms, validateRegTerms);
    [dobDaySelect, dobMonthSelect, dobYearSelect].forEach(el => addLiveValidation(el, validateRegDOB));


    // --- UPDATED FORM SUBMISSION LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Run all validations one last time on submit
            const isUsernameValid = validateLoginUsername();
            const isPasswordValid = validateLoginPassword();

            if (isUsernameValid && isPasswordValid) {
                alert('Login Successful!');
                // loginForm.submit(); // Uncomment to allow form submission
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Run all validations to show all errors if the form is incomplete
            const isNameValid = validateRegName();
            const isEmailValid = validateRegEmail();
            const isPhoneValid = validateRegPhone();
            const isPasswordValid = validateRegPassword();
            const isConfirmPasswordValid = validateRegConfirmPassword();
            const isDOBValid = validateRegDOB();
            const isTermsValid = validateRegTerms();

            if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && isDOBValid && isTermsValid) {
                alert('Registration Successful!');
                // registerForm.submit(); // Uncomment to allow form submission
            }
        });
    }
});
