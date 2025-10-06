// routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /usuarios - para obtener lista de usuarios
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombre, apellido, correo FROM usuarios');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en servidor' });
    }
});

module.exports = router;