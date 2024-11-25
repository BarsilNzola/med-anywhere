const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM Admin WHERE username = ?', [username]);
    if (rows.length > 0) {
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (isMatch) {
            req.session.user = { id: admin.id, role: admin.role };
            res.status(200).json({ message: 'Login successful', role: admin.role });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } else {
        res.status(400).json({ message: 'Invalid username or password' });
    }
});



// View list of doctors (admin only)
router.get('/doctors', isAdmin, async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM Doctors');
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View list of appointments (admin only)
router.get('/appointments', async (req, res) => {
    try {
        const [appointments] = await pool.query('SELECT * FROM Appointments');
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manage doctors (admin only)
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

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM Doctors WHERE id = ?', [id]);
        res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin route to manage patients
router.get('/patients', isAdmin, async (req, res) => {
    try {
        const [patients] = await pool.query('SELECT * FROM Patients');
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


module.exports = router;
