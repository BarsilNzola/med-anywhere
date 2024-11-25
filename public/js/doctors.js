async function fetchDoctors() {
    const response = await fetch('/patients/doctors', { // Ensure endpoint is correct
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const doctors = await response.json();
        displayDoctors(doctors); // Call displayDoctors with the fetched data

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const filteredDoctors = doctors.filter(doctor =>
                doctor.first_name.toLowerCase().includes(searchTerm) ||
                doctor.last_name.toLowerCase().includes(searchTerm) ||
                doctor.specialization.toLowerCase().includes(searchTerm)
            );
            displayDoctors(filteredDoctors); // Call displayDoctors with filtered data
        });
    } else {
        const errorData = await response.json();
        document.getElementById('doctorsList').innerHTML = `<p>Error: ${errorData.message}</p>`;
    }
}

function displayDoctors(doctors) {
    const doctorsList = doctors.map(doctor => `
        <div class="doctor-card">
            <p><strong>Name:</strong> ${doctor.first_name} ${doctor.last_name}</p>
            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        </div>
    `).join('');
    document.getElementById('doctorsList').innerHTML = doctorsList;
}

document.addEventListener('DOMContentLoaded', fetchDoctors);
