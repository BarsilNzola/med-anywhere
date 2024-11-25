document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminLoginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        clearErrors();

        const formData = new FormData(event.target);
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
            alert('Login successful!');
            window.location.href = '/admin-dashboard.html'; // Redirect to the admin dashboard
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    });

    function clearErrors() {
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(function(field) {
            field.textContent = '';
        });
    }
});
