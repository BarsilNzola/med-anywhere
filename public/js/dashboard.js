// Fetch and display user profile info
async function fetchProfile() {
    const response = await fetch('/patients/profile', { method: 'GET' });
    if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data:', profileData); // Log profile data
        const patientIdInput = document.getElementById('patient_id');
        if (profileData.id) {
            patientIdInput.value = profileData.id; // Set patient ID
            console.log('Patient ID set to:', patientIdInput.value); // Verify setting
        } else {
            console.error('Patient ID is missing in fetched profile data');
        }
        document.getElementById('profileInfo').innerHTML = `
            <p><strong>Name:</strong> ${profileData.first_name} ${profileData.last_name}</p>
            <p><strong>Email:</strong> ${profileData.email}</p>
            <p><strong>Phone:</strong> ${profileData.phone}</p>
            <button id="editProfileBtn">Edit Profile</button>
        `;
        document.getElementById('editProfileBtn').addEventListener('click', showProfileForm);
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}


function showProfileForm() {
    const profileSection = document.getElementById('profileInfo');
    profileSection.innerHTML += `
        <form id="profileForm">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" required>
            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" required>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required>
            <button type="submit">Update Profile</button>
        </form>
    `;
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
}

// Update profile function
async function updateProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch('/patients/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
        alert('Profile updated successfully!');
        fetchProfile();
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

// Fetch and populate doctors in the dropdown
async function populateDoctorDropdown() {
    console.log('Fetching doctors from backend'); // Log start of fetch
    const response = await fetch('/patients/doctors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const doctors = await response.json();
        console.log('Fetched doctors:', doctors); // Log fetched data
        const doctorSelect = document.getElementById('doctorSelect');
        doctorSelect.innerHTML = '<option value="">Select a Doctor</option>'; // Reset dropdown
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.first_name} ${doctor.last_name} ${doctor.specialization}`;
            doctorSelect.appendChild(option);
        });
    } else {
        console.error('Failed to fetch doctors', response.statusText);
    }
}

// Add appointment
document.getElementById('appointmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const patientId = document.getElementById('patient_id').value;
    if (!patientId) {
        console.error('Patient ID is not set before form submission');
        alert('Error: Patient ID is missing. Please reload the page and try again.');
        return;
    }
    
    const formData = new FormData(event.target);
    console.log('Form Data:', [...formData.entries()]); // Log formData to check values
    try {
        const response = await fetch('/appointments/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        const data = await response.json();
        if (response.ok) {
            alert('Appointment booked successfully!');
            fetchAppointments();
        } else {
            throw new Error(data.error); // Capture specific error message
        }
    } catch (error) {
        console.error('Error booking appointment:', error); // Log the error
        alert(`Error: ${error.message}`);
    }
});


// Fetch and display upcoming appointments
async function fetchAppointments() {
    const response = await fetch('/appointments', { method: 'GET' });
    if (response.ok) {
        const appointments = await response.json();
        const appointmentList = appointments.map(appt => `
            <div>
                <p><strong>Doctor:</strong> ${appt.doctor_name || 'Unknown'}</p>
                <p><strong>Date:</strong> ${appt.appointment_date || 'Unknown'}</p>
                <p><strong>Time:</strong> ${appt.appointment_time || 'Unknown'}</p>
                <button class="reschedule-btn" data-id="${appt.id}">Reschedule</button>
                <button class="cancel-btn" data-id="${appt.id}">Cancel</button>
            </div>
        `).join('');
        document.getElementById('appointmentList').innerHTML = appointmentList;

        document.querySelectorAll('.reschedule-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const apptId = event.target.getAttribute('data-id');
                rescheduleAppointment(apptId);
            });
        });
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const apptId = event.target.getAttribute('data-id');
                cancelAppointment(apptId);
            });
        });
    }
}


// Reschedule appointment function
async function rescheduleAppointment(apptId) {
    // Logic for rescheduling (e.g., show reschedule form)
}

// Cancel appointment function
async function cancelAppointment(apptId) {
    const response = await fetch(`/appointments/cancel/${apptId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        alert('Appointment canceled successfully');
        fetchAppointments();
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

// Fetch and display medical records
async function fetchMedicalRecords() {
    const response = await fetch('/patients/medical-records', { method: 'GET' });
    if (response.ok) {
        const medicalRecords = await response.json();
        const medicalRecordsList = medicalRecords.map(record => `
            <div>
                <p><strong>Date:</strong> ${record.date_of_record}</p>
                <p><strong>Prescription:</strong> ${record.prescription}</p>
                <p><strong>Lab Results:</strong> ${record.lab_results}</p>
                <p><strong>Consultation Notes:</strong> ${record.consultation_notes}</p>
            </div>
        `).join('');
        document.getElementById('medicalRecords').innerHTML = medicalRecordsList;
    }
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
        alert('Inquiry sent successfully!');
        event.target.reset();
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
});

// Article search functionality
document.getElementById('articleSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredArticles = articles.filter(article =>
        article.topic.toLowerCase().includes(searchTerm) ||
        article.doctor.toLowerCase().includes(searchTerm)
    );
    displayArticles(filteredArticles);
  });


// Handle logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    console.log('Logout button clicked');
    
    const response = await fetch('/patients/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log('Logout response:', response);

    if (response.ok) {
        alert('Logged out successfully!');
        window.location.href = '/signup.html';
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
});

function initMap() {
    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // Create map object
            var map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 10
            });
            // Fetch health centres data
            fetch('https://kmhfr.health.go.ke/public/facilities')
                .then(response => response.json())
                .then(data => {
                    data.forEach(healthCentre => {
                        var marker = new google.maps.Marker({
                            position: {lat: healthCentre.latitude, lng: healthCentre.longitude},
                            map: map
                        });
                    });
                });
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchAppointments();
    populateDoctorDropdown();
    initMap();
});
