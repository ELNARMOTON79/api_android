const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /usuarios (nuevo endpoint para registrar un usuario)
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, correo, contraseña } = req.body;
        const { rows } = await pool.query(
        'INSERT INTO usuarios (nombre, apellido, correo, contraseña) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, correo',
        [nombre, apellido, correo, contraseña]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
        return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error en el servidor al registrar' });
    }
});

module.exports = router;
