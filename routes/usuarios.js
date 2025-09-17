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

// POST corregido:
router.post('/', async (req, res) => {
    const { nombre, apellido, correo, contrasena } = req.body;
    const id_rol = 2; // Rol por defecto
    try {
        const { rows } = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, correo',
            //                                                         ↑ Agregué id_rol        ↑ Agregué $5
            [nombre, apellido, correo, contrasena, id_rol]
            //                                    ↑ Agregué id_rol
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