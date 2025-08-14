document.addEventListener('DOMContentLoaded', () => {

    // --- FORM TOGGLE LOGIC ---
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
    
    // --- DYNAMICALLY POPULATE DOB DROPDOWNS ---
    const dobDay = document.getElementById('dob-day');
    const dobYear = document.getElementById('dob-year');
    if(dobDay && dobYear) {
        for (let i = 1; i <= 31; i++) {
            dobDay.innerHTML += `<option value="${i}">${i}</option>`;
        }
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1930; i--) {
            dobYear.innerHTML += `<option value="${i}">${i}</option>`;
        }
    }


    // --- SHARED VALIDATION HELPER FUNCTIONS ---
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

    // --- LOGIN FORM VALIDATION ---
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;
            const username = document.getElementById('login-username');
            const password = document.getElementById('login-password');

            [username, password].forEach(clearError);

            if (username.value.trim() === '') {
                isValid = false;
                showError(username, 'Please enter your username or email.');
            }
            if (password.value.trim() === '') {
                isValid = false;
                showError(password, 'Please enter your password.');
            }

            if (isValid) {
                alert('Login Successful!');
                // loginForm.submit(); // Uncomment to allow form submission
            }
        });
    }

    // --- REGISTRATION FORM VALIDATION (FULL) ---
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;

            const name = document.getElementById('reg-name');
            const email = document.getElementById('reg-email');
            const phone = document.getElementById('reg-phone');
            const password = document.getElementById('reg-password');
            const confirmPassword = document.getElementById('reg-confirm-password');
            const terms = document.getElementById('reg-terms');
            
            const dobDaySelect = document.getElementById('dob-day');
            const dobMonthSelect = document.getElementById('dob-month');
            const dobYearSelect = document.getElementById('dob-year');

            const inputsToClear = [name, email, phone, password, confirmPassword, terms, dobDaySelect];
            inputsToClear.forEach(clearError);
            [dobDaySelect, dobMonthSelect, dobYearSelect].forEach(el => el.classList.remove('input-error'));


            if (name.value.trim() === '') {
                isValid = false; showError(name, 'Name cannot be empty.');
            }
            const emailPattern = /^\S+@\S+\.\S+$/;
            if (!emailPattern.test(email.value)) {
                isValid = false; showError(email, 'Please enter a valid email address.');
            }
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone.value)) {
                isValid = false; showError(phone, 'Please enter a valid 10-digit phone number.');
            }
            if (password.value.length < 8) {
                isValid = false; showError(password, 'Password must be at least 8 characters long.');
            }
            if (password.value !== confirmPassword.value) {
                isValid = false; showError(confirmPassword, 'Passwords do not match.');
            }
             if (dobDaySelect.value === '' || dobMonthSelect.value === '' || dobYearSelect.value === '') {
                isValid = false; 
                showError(dobDaySelect, 'Please select a complete date of birth.');
                [dobDaySelect, dobMonthSelect, dobYearSelect].forEach(el => el.classList.add('input-error'));
            }
            if (!terms.checked) {
                isValid = false; showError(terms, 'You must agree to the terms of service.');
            }

            if (isValid) {
                alert('Registration Successful!');
                // registerForm.submit(); // Uncomment to allow form submission
            }
        });
    }
});