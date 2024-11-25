// File: routes/patients.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// Register a new patient
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]);
        res.status(201).json({ message: 'Patient registered successfully', patient_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adjust login route in patients.js or a common route file
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    if (identifier.includes('@')) {
        const [rows] = await pool.query('SELECT * FROM Patients WHERE email = ?', [identifier]);
        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (isMatch) {
                req.session.user = { id: user.id, role: 'user' };
                req.session.patient_id = user.id; // Ensure patient ID is stored in session
                res.status(200).json({ message: 'Login successful', role: 'user' });
            } else {
                res.status(400).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } else  {
        // Admin login
        const [rows] = await pool.query('SELECT * FROM Admin WHERE username = ?', [identifier]);
        if (rows.length > 0) {
            const admin = rows[0];
            const isMatch = await bcrypt.compare(password, admin.password_hash);
            if (isMatch) {
                req.session.user = { id: admin.id, role: 'admin' };
                res.status(200).json({ message: 'Login successful', role: 'admin' });
            } else {
                res.status(400).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    }
});

// View patient profile
router.get('/profile', async (req, res) => {
    if (!req.session.patient_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM Patients WHERE id = ?', [req.session.patient_id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update patient profile
router.put('/profile', async (req, res) => {
    if (!req.session.patient_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;
    try {
        await pool.query('UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?', [first_name, last_name, phone, date_of_birth, gender, address, req.session.patientId]);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// fetch doctors
router.get('/doctors', async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM Doctors');
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch medical records
router.get('/medical-records', async (req, res) => {
    const patient_id = req.session.patient_id;
    try {
        const [records] = await pool.query('SELECT * FROM MedicalRecords WHERE patient_id = ?', [patient_id]);
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// adding new medical record
router.post('/medical-records', async (req, res) => {
    const { patient_id, prescription, lab_results, consultation_notes, date_of_record } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO MedicalRecords (patient_id, prescription, lab_results, consultation_notes, date_of_record) VALUES (?, ?, ?, ?, ?)', [patient_id, prescription, lab_results, consultation_notes, date_of_record]);
        res.status(201).json({ message: 'Medical record added successfully', recordId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


// Delete patient account
router.delete('/delete', async (req, res) => {
    if (!req.session.patient_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        await pool.query('DELETE FROM Patients WHERE id = ?', [req.session.patient_id]);
        req.session.destroy();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
