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

// Mantén tu POST existente pero corrige la sintaxis:
router.post('/', async (req, res) => {
    const { nombre, apellido, correo, contraseña } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, correo',
            [nombre, apellido, correo, contraseña]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

module.exports = router;