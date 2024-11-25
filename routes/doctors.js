// File: routes/doctors.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Add new doctor
router.post('/add', async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)', [first_name, last_name, specialization, email, phone, schedule]);
        res.status(201).json({ message: 'Doctor added successfully', doctorId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View list of doctors
router.get('/', async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM Doctors');
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update doctor profile
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    try {
        await pool.query('UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?', [first_name, last_name, specialization, email, phone, schedule, id]);
        res.status(200).json({ message: 'Doctor profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete doctor profile
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM Doctors WHERE id = ?', [id]);
        res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
