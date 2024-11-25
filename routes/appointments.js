// File: routes/appointments.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Book an appointment
router.post('/book', async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;
    console.log('Received booking data:', { patient_id, doctor_id, appointment_date, appointment_time }); // Debugging received data
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check for scheduling conflicts
        const [conflict] = await pool.query(
            'SELECT * FROM Appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?',
            [doctor_id, appointment_date, appointment_time]
        );
        if (conflict.length) {
            return res.status(409).json({ error: 'Doctor already has an appointment at this time.' });
        }

        const [result] = await pool.query(
            'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "Scheduled")',
            [patient_id, doctor_id, appointment_date, appointment_time]
        );
        res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    } catch (err) {
        console.error(`Error booking appointment: ${err.message}`);
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
});

// View list of appointments
router.get('/', async (req, res) => {
    try {
        const [appointments] = await pool.query(`
            SELECT 
                Appointments.*, 
                CONCAT(Doctors.first_name, ' ', Doctors.last_name) AS doctor_name 
            FROM 
                Appointments 
            JOIN 
                Doctors 
            ON 
                Appointments.doctor_id = Doctors.id
        `);
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Reschedule appointment
router.put('/reschedule/:id', async (req, res) => {
    const { id } = req.params;
    const { appointment_date, appointment_time } = req.body;
    try {
        await pool.query('UPDATE Appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?', [appointment_date, appointment_time, id]);
        res.status(200).json({ message: 'Appointment rescheduled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel appointment
router.delete('/cancel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('UPDATE Appointments SET status = "Canceled" WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
