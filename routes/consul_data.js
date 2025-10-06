// routes/registro.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error('Error al consultar datos:', error);
        res.status(500).json({ error: 'Error al consultar datos' });
    }
});

module.exports = router;