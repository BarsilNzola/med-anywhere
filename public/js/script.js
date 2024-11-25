// Clear previous error messages
function clearErrors() {
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(function(field) {
        field.textContent = '';
    });
}

// Show error message
function showError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
    // All your script.js code goes inside this function
    // Handle showing login form from signup link
    document.getElementById('showLogin').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    });

    // Handle showing signup form from login link
    document.getElementById('showSignup').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('signupFormContainer').style.display = 'block';
    });
    
    // Signup Form Submission
    document.getElementById('signupForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission
        clearErrors(); // Clear previous error messages
        let isValid = validateForm(); // Validate fields

        if (isValid) {
            const formData = new FormData(event.target);
            const response = await fetch('/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                alert('Signup successful! Now you can log in.');
                // Display the captured form data
                let data = await response.json();
                displayFormData(data);
                // Hide signup form and show login form
                document.getElementById('signupFormContainer').style.display = 'none';
                document.getElementById('loginFormContainer').style.display = 'block';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        }
    });

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        clearErrors();

        const formData = new FormData(event.target);
        const identifier = formData.get('identifier');
        const password = formData.get('password');

        try {
            const response = await fetch('patients/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
            });

            const text = await response.text(); // Get the raw response text
            console.log('Raw response text:', text); // Log the raw response text

            if (response.ok) {
                const data = JSON.parse(text); // Parse the JSON only if response is OK
                if (data.role === 'admin') {
                    window.location.href = '/admin-dashboard.html';
                } else {
                    window.location.href = '/dashboard.html';
                }
            } else {
                console.error('Error response status:', response.status);
                console.error('Error response text:', text);
                const errorData = JSON.parse(text);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Parsing error:', error);
            alert('An error occurred while processing your request.');
        }
    
    });

    // Real-time email format validation
    document.getElementById('email').addEventListener('input', function() {
        const email = this.value;
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(email)) {
            showError('emailError', 'Invalid email format');
        } else {
            document.getElementById('emailError').textContent = ''; // Clear the error if email is valid
        }
    });

    // Fetch and display user profile info
    async function fetchProfile() {
        const response = await fetch('/patients/profile', { method: 'GET' });
        const profileData = await response.json();
        document.getElementById('profileInfo').innerHTML = `
            <p><strong>Name:</strong> ${profileData.first_name} ${profileData.last_name}</p>
            <p><strong>Email:</strong> ${profileData.email}</p>
            <p><strong>Phone:</strong> ${profileData.phone}</p>
        `;
    }

    // Capture form data into an object
    function captureFormData() {
        const formData = {
            first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        address: document.getElementById('address').value,
        termsAccepted: document.getElementById('terms').checked
        };
        return formData;
    }


    // Validation for the signup form
function validateForm() {
    let isValid = true;

    // First Name validation
    const firstName = document.getElementById('first_name').value;
    if (firstName === '') {
        showError('firstNameError', 'First Name is required');
        isValid = false;
    }

    // Last Name validation
    const lastName = document.getElementById('last_name').value;
    if (lastName === '') {
        showError('lastNameError', 'Last Name is required');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
        showError('emailError', 'Invalid email format');
        isValid = false;
    }

    // Password validation
    const password = document.getElementById('password').value;
    if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters long');
        isValid = false;
    }

    // Confirm Password validation
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    // Phone validation
    const phone = document.getElementById('phone').value;
    if (phone === '') {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    }

    // Date of Birth validation
    const dateOfBirth = document.getElementById('date_of_birth').value;
    if (dateOfBirth === '') {
        showError('dobError', 'Date of Birth is required');
        isValid = false;
    }

    // Gender validation
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        showError('genderError', 'Please select a gender');
        isValid = false;
    }

    // Address validation
    const address = document.getElementById('address').value;
    if (address === '') {
        showError('addressError', 'Address is required');
        isValid = false;
    }

    // Terms and Conditions validation
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        showError('termsError', 'You must agree to the terms and conditions');
        isValid = false;
    }

    return isValid;
}


    // Carousel functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initial slide display
    showSlide(currentSlide);

    // Change slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Additional profile fetch and other functions for dashboard
    document.addEventListener('DOMContentLoaded', () => {
        fetchProfile();
        fetchAppointments();
    });
});
