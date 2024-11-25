document.addEventListener('DOMContentLoaded', () => {
    fetchAdminDashboardData();

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const response = await fetch('/admin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Logged out successfully!'); 
            window.location.href = '/signup.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    });
});

// Add Doctor Form Submission
document.getElementById('addDoctorForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const doctorData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        specialization: formData.get('specialization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        schedule: formData.get('schedule')
    };

    const response = await fetch('/doctors/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
    });

    if (response.ok) {
        alert('Doctor added successfully!');
        fetchDoctors(); // Refresh the doctors list
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
});

// Fetch and Display Admin Dashboard Data
async function fetchAdminDashboardData() {
    try {
        await fetchAppointments();
        await fetchDoctors();
        await fetchPatients();
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
    }
}

// Fetch and Display Appointments
async function fetchAppointments() {
    const response = await fetch('/admin/appointments', { method: 'GET' });
    if (response.ok) {
        const appointments = await response.json();
        const appointmentList = appointments.map(appt => `
            <div>
                <p><strong>Doctor:</strong> ${appt.doctor_name}</p>
                <p><strong>Date:</strong> ${appt.appointment_date}</p>
                <p><strong>Time:</strong> ${appt.appointment_time}</p>
                <button class="approve-btn" data-id="${appt.id}">Approve</button>
                <button class="cancel-btn" data-id="${appt.id}">Cancel</button>
            </div>
        `).join('');
        document.getElementById('appointmentList').innerHTML = appointmentList;

        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', event => {
                const apptId = event.target.getAttribute('data-id');
                updateAppointmentStatus(apptId, 'Approved');
            });
        });

        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', event => {
                const apptId = event.target.getAttribute('data-id');
                updateAppointmentStatus(apptId, 'Canceled');
            });
        });
    }
}

// Update Appointment Status
async function updateAppointmentStatus(apptId, status) {
    const response = await fetch(`/admin/appointments/${apptId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (response.ok) {
        alert('Appointment status updated');
        fetchAppointments(); // Refresh the appointment list
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

// Fetch and Display Doctors
async function fetchDoctors() {
    const response = await fetch('/admin/doctors', { 
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
     });
     
    if (response.ok) {
        const doctors = await response.json();
        const doctorsList = doctors.map(doctor => `
            <div>
                <p><strong>Name:</strong> ${doctor.first_name} ${doctor.last_name}</p>
                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                <button class="update-doctor-btn" data-id="${doctor.id}">Update</button>
                <button class="remove-doctor-btn" data-id="${doctor.id}">Remove</button>
            </div>
        `).join('');
        document.getElementById('doctorsList').innerHTML = doctorsList;

        document.querySelectorAll('.update-doctor-btn').forEach(button => {
            button.addEventListener('click', event => {
                const doctorId = event.target.getAttribute('data-id');
                updateDoctor(doctorId);
            });
        });

        document.querySelectorAll('.remove-doctor-btn').forEach(button => {
            button.addEventListener('click', event => {
                const doctorId = event.target.getAttribute('data-id');
                removeDoctor(doctorId);
            });
        });
    }
}

// Fetch and Display Patients
async function fetchPatients() {
    const response = await fetch('/admin/patients', { method: 'GET' });
    if (response.ok) {
        const patients = await response.json();
        const patientsList = patients.map(patient => `
            <div>
                <p><strong>Name:</strong> ${patient.first_name} ${patient.last_name}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <button class="update-patient-btn" data-id="${patient.id}">Update</button>
                <button class="remove-patient-btn" data-id="${patient.id}">Remove</button>
            </div>
        `).join('');
        document.getElementById('patientsList').innerHTML = patientsList;

        document.querySelectorAll('.update-patient-btn').forEach(button => {
            button.addEventListener('click', event => {
                const patientId = event.target.getAttribute('data-id');
                updatePatient(patientId);
            });
        });

        document.querySelectorAll('.remove-patient-btn').forEach(button => {
            button.addEventListener('click', event => {
                const patientId = event.target.getAttribute('data-id');
                removePatient(patientId);
            });
        });
    }
}

// Update Doctor
async function updateDoctor(doctorId) {
    // Logic for updating doctor details (e.g., show update form)
}

// Remove Doctor
async function removeDoctor(doctorId) {
    const response = await fetch(`/admin/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Doctor removed successfully');
        fetchDoctors(); // Refresh the doctors list
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

// Update Patient
async function updatePatient(patientId) {
    // Logic for updating patient details (e.g., show update form)
}

// Remove Patient
async function removePatient(patientId) {
    const response = await fetch(`/admin/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Patient removed successfully');
        fetchPatients(); // Refresh the patients list
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}
